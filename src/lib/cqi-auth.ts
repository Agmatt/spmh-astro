// src/lib/cqi-auth.ts
// One shared place for: login check → role lookup → idle check → password gate.
// Used by every CQI page and API route so the rules can't drift apart.

import type { AstroCookies } from 'astro';
import {
  createClient,
  type SupabaseClient,
  type User,
} from '@supabase/supabase-js';
import { createSupabaseServer } from './supabase-server';

export type CqiRole = 'cqi_super_admin' | 'cqi_admin' | 'cqi_viewer';

const ROLE_PRIORITY: CqiRole[] = ['cqi_super_admin', 'cqi_admin', 'cqi_viewer'];
const IDLE_MS = 10 * 60 * 1000;

function feedbackUrl(): string | undefined {
  return (
    import.meta.env.FEEDBACK_SUPABASE_URL ?? process.env.FEEDBACK_SUPABASE_URL
  );
}

/** Service-role client for the FEEDBACK project. Server-side only. */
export function createAdminClient(): SupabaseClient {
  const url = feedbackUrl();
  const key =
    import.meta.env.FEEDBACK_SUPABASE_SERVICE_ROLE_KEY ??
    process.env.FEEDBACK_SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      'Missing FEEDBACK_SUPABASE_URL or FEEDBACK_SUPABASE_SERVICE_ROLE_KEY',
    );
  }

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export type CqiAuthResult =
  | { ok: false; redirect: string }
  | { ok: true; user: User; role: CqiRole; adminClient: SupabaseClient };

type Options = {
  /**
   * Only the Settings page and the account API set this.
   * Everything else sends a user who still has a temporary password
   * to the Settings page first.
   */
  skipPasswordGate?: boolean;
};

export async function requireCqiUser(
  cookies: AstroCookies,
  options: Options = {},
): Promise<CqiAuthResult> {
  const supabase = createSupabaseServer(cookies);

  // ── 1. Is anyone logged in? (getUser validates the token with Supabase) ──
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, redirect: '/admin/cqi/login' };

  const adminClient = createAdminClient();

  // ── 2. Role lookup ──
  const { data: roleRows, error: roleErr } = await adminClient
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id);

  if (roleErr) {
    console.error('[CQI role error]', roleErr);
    await supabase.auth.signOut();
    return { ok: false, redirect: '/admin/cqi/login?error=server' };
  }

  // Ignore roles that belong to other systems (e.g. news editor roles)
  const role = (roleRows ?? [])
    .map((r) => r.role as CqiRole)
    .filter((r) => ROLE_PRIORITY.includes(r))
    .sort((a, b) => ROLE_PRIORITY.indexOf(a) - ROLE_PRIORITY.indexOf(b))[0];

  if (!role) {
    console.warn('[CQI] no CQI role →', {
      signedInAs: user.email,
      userId: user.id,
      rolesFoundForThisUser: roleRows,
    });
    await supabase.auth.signOut();
    return {
      ok: false,
      redirect: `/admin/cqi/login?error=no_access&email=${encodeURIComponent(user.email ?? '')}`,
    };
  }

  // ── 3. 10-minute idle check ──
  const { data: sessionRow, error: sessErr } = await adminClient
    .from('user_sessions')
    .select('last_activity_at')
    .eq('user_id', user.id)
    .maybeSingle();

  if (sessErr) console.error('[CQI session read error]', sessErr);

  const lastActivity = sessionRow
    ? new Date(sessionRow.last_activity_at).getTime()
    : null;
  const signedInAt = user.last_sign_in_at
    ? new Date(user.last_sign_in_at).getTime()
    : 0;

  // Only idle if the old activity belongs to THIS login.
  if (
    lastActivity !== null &&
    lastActivity > signedInAt &&
    Date.now() - lastActivity > IDLE_MS
  ) {
    await adminClient.from('user_sessions').delete().eq('user_id', user.id);
    await supabase.auth.signOut();
    return { ok: false, redirect: '/admin/cqi/login?timeout=1' };
  }

  // Awaited on purpose: on Vercel, un-awaited work can be cut off.
  const { error: upsertErr } = await adminClient
    .from('user_sessions')
    .upsert(
      { user_id: user.id, last_activity_at: new Date().toISOString() },
      { onConflict: 'user_id' },
    );
  if (upsertErr) console.error('[CQI session write error]', upsertErr);

  // ── 4. Temporary password? Must choose their own first ──
  // app_metadata can only be changed by the server, never by the user.
  if (
    !options.skipPasswordGate &&
    user.app_metadata?.must_change_password === true
  ) {
    return { ok: false, redirect: '/admin/cqi/settings' };
  }

  return { ok: true, user, role, adminClient };
}
