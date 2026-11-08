// src/pages/api/tenders-portal/team.ts
// Team management for the Tenders & Vendor portal. Super admins only.
//
// IMPORTANT: this Supabase project is shared with other dashboards (news, etc.).
// "Remove" here only revokes tenders access. It never deletes the login account.
//
// IMPORTANT: the super admin should only see users who hold a TENDERS role.
// Users on the same Supabase project who belong to other portals (news, etc.)
// must never appear in this list. The GET handler below guarantees that by
// only ever fetching users whose IDs are present in tenders_user_roles.

import type { APIRoute } from 'astro';
import type { SupabaseClient } from '@supabase/supabase-js';
import { requireTendersUser } from '../../../lib/tenders-auth';
import { logAudit } from '../../../lib/tenders-audit';

export const prerender = false;

const TENDERS_ROLES = ['tenders_super_admin', 'tenders_staff'];

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

function generateTempPassword(): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
  const bytes = new Uint8Array(14);
  crypto.getRandomValues(bytes);
  return (
    Array.from(bytes, (b) => alphabet[b % alphabet.length]).join('') + '!9'
  );
}

/**
 * Fetch a specific set of auth users by ID.
 * Used by GET so we only ever pull the small number of users who actually
 * hold a tenders role — never every account on the shared project.
 */
async function getUsersByIds(admin: SupabaseClient, ids: string[]) {
  if (ids.length === 0) return [];
  const results = await Promise.all(
    ids.map((id) => admin.auth.admin.getUserById(id)),
  );
  return results
    .map((r) => r.data?.user)
    .filter((u): u is NonNullable<typeof u> => !!u);
}

/**
 * Page through ALL auth users on the project.
 * ONLY used by the `create` action, where we need to check whether an email
 * already exists on the shared project so we can grant access instead of
 * creating a duplicate account.
 */
async function listAllUsers(admin: SupabaseClient) {
  const users: any[] = [];
  for (let page = 1; page <= 20; page++) {
    const { data, error } = await admin.auth.admin.listUsers({
      page,
      perPage: 1000,
    });
    if (error) throw error;
    users.push(...data.users);
    if (data.users.length < 1000) break;
  }
  return users;
}

/** Give the user exactly one tenders role (never leaves them with zero). */
async function setTendersRole(
  admin: SupabaseClient,
  userId: string,
  role: string,
) {
  const { data: existing, error: selErr } = await admin
    .from('tenders_user_roles')
    .select('role')
    .eq('user_id', userId)
    .eq('role', role)
    .maybeSingle();
  if (selErr) return selErr;

  if (!existing) {
    const { error: insErr } = await admin
      .from('tenders_user_roles')
      .insert({ user_id: userId, role });
    if (insErr) return insErr;
  }

  // Remove any *other* tenders roles — never touches other portals' roles.
  const { error: delErr } = await admin
    .from('tenders_user_roles')
    .delete()
    .eq('user_id', userId)
    .in(
      'role',
      TENDERS_ROLES.filter((r) => r !== role),
    );
  return delErr;
}

async function isTendersMember(admin: SupabaseClient, userId: string) {
  const { data } = await admin
    .from('tenders_user_roles')
    .select('role')
    .eq('user_id', userId)
    .in('role', TENDERS_ROLES)
    .limit(1);
  return !!data && data.length > 0;
}

// ───────────────────────── GET: list procurement team ─────────────────────────
// Returns ONLY users who hold a tenders role. Users on the shared project who
// belong to other portals are never included, because we build the list from
// tenders_user_roles first and then look up only those specific user IDs.
export const GET: APIRoute = async ({ cookies }) => {
  const auth = await requireTendersUser(cookies);
  if (!auth.ok) return json({ error: 'Not signed in.' }, 401);
  if (auth.role !== 'tenders_super_admin') {
    return json({ error: 'Super admin access required.' }, 403);
  }
  const admin = auth.adminClient;

  try {
    // 1. Who has a tenders role? This is the ONLY source of truth.
    const { data: roleRows, error } = await admin
      .from('tenders_user_roles')
      .select('user_id, role')
      .in('role', TENDERS_ROLES);
    if (error) throw error;

    const rolesByUser = new Map<string, string[]>();
    for (const r of roleRows ?? []) {
      const list = rolesByUser.get(r.user_id) ?? [];
      list.push(r.role as string);
      rolesByUser.set(r.user_id, list);
    }

    // 2. Look up only those specific users (not the whole shared project).
    const userIds = [...rolesByUser.keys()];
    const users = await getUsersByIds(admin, userIds);

    const team = users
      .map((u) => ({
        id: u.id as string,
        email: (u.email ?? null) as string | null,
        roles: rolesByUser.get(u.id) as string[],
        last_sign_in_at: (u.last_sign_in_at ?? null) as string | null,
      }))
      .sort((a, b) => (a.email ?? '').localeCompare(b.email ?? ''));

    return json({ team });
  } catch (err) {
    console.error('[Tenders team list]', err);
    return json({ error: 'Could not load the team.' }, 500);
  }
};

// ───────────────────────── POST: create / set_role / remove ─────────────────────────
export const POST: APIRoute = async ({ request, cookies }) => {
  const auth = await requireTendersUser(cookies);
  if (!auth.ok) return json({ error: 'Not signed in.' }, 401);
  if (auth.role !== 'tenders_super_admin') {
    return json({ error: 'Super admin access required.' }, 403);
  }
  const admin = auth.adminClient;

  let body: any;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid request.' }, 400);
  }

  const action = body?.action;

  try {
    // ── create (or grant access to an existing account) ──
    if (action === 'create') {
      const email =
        typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
      const role = body.role;
      if (
        !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) ||
        !TENDERS_ROLES.includes(role)
      ) {
        return json({ error: 'Enter a valid email and role.' }, 400);
      }

      // This is the one place we scan all users: we need to know whether the
      // email already exists on the shared project (e.g. a news user) so we
      // grant them tenders access instead of creating a duplicate account.
      const users = await listAllUsers(admin);
      let target = users.find((u) => u.email?.toLowerCase() === email);
      let tempPassword: string | null = null;

      if (!target) {
        tempPassword = generateTempPassword();
        const { data, error } = await admin.auth.admin.createUser({
          email,
          password: tempPassword,
          email_confirm: true,
          app_metadata: { must_change_password: true },
        });
        if (error || !data.user) {
          console.error('[Tenders team create]', error);
          return json({ error: 'Could not create the user.' }, 500);
        }
        target = data.user;
      }

      const roleErr = await setTendersRole(admin, target.id, role);
      if (roleErr) {
        console.error('[Tenders team set role]', roleErr);
        return json({ error: 'Could not assign the role.' }, 500);
      }

      await logAudit(admin, auth.user, 'team_user_added', {
        target_email: email,
        role,
        new_account: !!tempPassword,
      });

      return json({ success: true, email, tempPassword });
    }

    // ── set_role / reset_password / remove need an existing tenders member ──
    const userId = body?.user_id;
    if (typeof userId !== 'string' || !userId) {
      return json({ error: 'Invalid request.' }, 400);
    }
    if (userId === auth.user.id) {
      return json({ error: "You can't change your own access." }, 400);
    }
    // Guard: only operate on users who are already on the tenders team.
    // This prevents a super admin from accidentally touching users who only
    // belong to other portals on the shared project.
    if (!(await isTendersMember(admin, userId))) {
      return json(
        { error: 'That user is not part of the procurement team.' },
        404,
      );
    }

    const { data: targetData } = await admin.auth.admin.getUserById(userId);
    const targetEmail = targetData?.user?.email ?? null;

    if (action === 'set_role') {
      const role = body.role;
      if (!TENDERS_ROLES.includes(role)) {
        return json({ error: 'Invalid role.' }, 400);
      }
      const roleErr = await setTendersRole(admin, userId, role);
      if (roleErr) {
        console.error('[Tenders team set role]', roleErr);
        return json({ error: 'Could not change the role.' }, 500);
      }
      await logAudit(admin, auth.user, 'team_role_changed', {
        target_email: targetEmail,
        role,
      });
      return json({ success: true });
    }

    if (action === 'reset_password') {
      // New temporary password; the person must replace it at next sign-in.
      const tempPassword = generateTempPassword();
      const { error } = await admin.auth.admin.updateUserById(userId, {
        password: tempPassword,
        app_metadata: { must_change_password: true },
      });
      if (error) {
        console.error('[Tenders team reset password]', error.message);
        return json({ error: 'Could not reset the password.' }, 500);
      }
      await logAudit(admin, auth.user, 'team_password_reset', {
        target_email: targetEmail,
      });
      return json({ success: true, email: targetEmail, tempPassword });
    }

    if (action === 'remove') {
      // Revoke tenders access only. The login account is NOT deleted, and
      // roles for other portals (news, etc.) are left untouched.
      const { error } = await admin
        .from('tenders_user_roles')
        .delete()
        .eq('user_id', userId)
        .in('role', TENDERS_ROLES);
      if (error) {
        console.error('[Tenders team remove]', error);
        return json({ error: 'Could not remove access.' }, 500);
      }
      await admin.from('tenders_sessions').delete().eq('user_id', userId);
      await logAudit(admin, auth.user, 'team_access_removed', {
        target_email: targetEmail,
      });
      return json({ success: true });
    }

    return json({ error: 'Unknown action.' }, 400);
  } catch (err) {
    console.error('[Tenders team]', err);
    return json({ error: 'Something went wrong.' }, 500);
  }
};
