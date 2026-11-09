// src/lib/appointments-auth.ts
// One shared place for: login check → role lookup → idle check → password gate.
// Used by every appointments-portal page and API route so the rules can't drift apart.

import type { AstroCookies } from 'astro';
import {
  createClient,
  type SupabaseClient,
  type User,
} from '@supabase/supabase-js';
import { createAppointmentsSupabaseServer as createSupabaseServer } from './appointments-supabase-server';

export type AppointmentsRole =
  | 'appointments_super_admin'
  | 'appointments_staff';

const ROLE_PRIORITY: AppointmentsRole[] = [
  'appointments_super_admin',
  'appointments_staff',
];
const IDLE_MS = 15 * 60 * 1000; // matches the old AppointmentsAuthGate's 15-minute idle limit

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

export type AppointmentsAuthResult =
  | { ok: false; redirect: string }
  | {
      ok: true;
      user: User;
      role: AppointmentsRole;
      adminClient: SupabaseClient;
    };

type Options = {
  /**
   * Only the Settings page and the account API set this.
   * Everything else sends a user who still has a temporary password
   * to the Settings page first.
   */
  skipPasswordGate?: boolean;
};

export async function requireAppointmentsUser(
  cookies: AstroCookies,
  options: Options = {},
): Promise<AppointmentsAuthResult> {
  const supabase = createSupabaseServer(cookies);

  // ── 1. Is anyone logged in? (getUser validates the token with Supabase) ──
  const {
    data: { user },
    error: getUserErr,
  } = await supabase.auth.getUser();
  if (!user) {
    console.warn('[Appointments] no session found on request', {
      reason: getUserErr?.message ?? 'no user in session',
    });
    return { ok: false, redirect: '/admin/appointments/login' };
  }

  const adminClient = createAdminClient();

  // ── 2. Role lookup ──
  const { data: roleRows, error: roleErr } = await adminClient
    .from('appointments_user_roles')
    .select('role')
    .eq('user_id', user.id);

  if (roleErr) {
    console.error('[Appointments role error]', roleErr);
    await supabase.auth.signOut();
    return { ok: false, redirect: '/admin/appointments/login?error=server' };
  }

  // Ignore roles that belong to other systems (e.g. news editor roles)
  const role = (roleRows ?? [])
    .map((r) => r.role as AppointmentsRole)
    .filter((r) => ROLE_PRIORITY.includes(r))
    .sort((a, b) => ROLE_PRIORITY.indexOf(a) - ROLE_PRIORITY.indexOf(b))[0];

  if (!role) {
    console.warn('[Appointments] no appointments role →', {
      signedInAs: user.email,
      userId: user.id,
      rolesFoundForThisUser: roleRows,
    });
    await supabase.auth.signOut();
    return {
      ok: false,
      redirect: `/admin/appointments/login?error=no_access&email=${encodeURIComponent(user.email ?? '')}`,
    };
  }

  // ── 3. 10-minute idle check ──
  const { data: sessionRow, error: sessErr } = await adminClient
    .from('appointments_sessions')
    .select('last_activity_at')
    .eq('user_id', user.id)
    .maybeSingle();

  if (sessErr) console.error('[Appointments session read error]', sessErr);

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
    await adminClient
      .from('appointments_sessions')
      .delete()
      .eq('user_id', user.id);
    await supabase.auth.signOut();
    return { ok: false, redirect: '/admin/appointments/login?timeout=1' };
  }

  // Awaited on purpose: on Vercel, un-awaited work can be cut off.
  const { error: upsertErr } = await adminClient
    .from('appointments_sessions')
    .upsert(
      { user_id: user.id, last_activity_at: new Date().toISOString() },
      { onConflict: 'user_id' },
    );
  if (upsertErr) console.error('[Appointments session write error]', upsertErr);

  // ── 4. Temporary password? Must choose their own first ──
  // app_metadata can only be changed by the server, never by the user.
  if (
    !options.skipPasswordGate &&
    user.app_metadata?.must_change_password === true
  ) {
    return { ok: false, redirect: '/admin/appointments/settings' };
  }

  return { ok: true, user, role, adminClient };
}
