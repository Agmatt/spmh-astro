// src/pages/api/editorial/team.ts
// Team management for the Editorial & Vendor portal. Super admins only.
//
// IMPORTANT: this Supabase project is shared with other dashboards (news, etc.).
// "Remove" here only revokes editorial access. It never deletes the login account.

import type { APIRoute } from 'astro';
import type { SupabaseClient } from '@supabase/supabase-js';
import { requireEditorialUser } from '../../../lib/editorial-auth';
import { logAudit } from '../../../lib/editorial-audit';

export const prerender = false;

const EDITORIAL_ROLES = ['editorial_super_admin', 'editorial_staff'];

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

/** Give the user exactly one editorial role (never leaves them with zero). */
async function setEditorialRole(
  admin: SupabaseClient,
  userId: string,
  role: string,
) {
  const { data: existing, error: selErr } = await admin
    .from('editorial_user_roles')
    .select('role')
    .eq('user_id', userId)
    .eq('role', role)
    .maybeSingle();
  if (selErr) return selErr;

  if (!existing) {
    const { error: insErr } = await admin
      .from('editorial_user_roles')
      .insert({ user_id: userId, role });
    if (insErr) return insErr;
  }

  const { error: delErr } = await admin
    .from('editorial_user_roles')
    .delete()
    .eq('user_id', userId)
    .in(
      'role',
      EDITORIAL_ROLES.filter((r) => r !== role),
    );
  return delErr;
}

async function isEditorialMember(admin: SupabaseClient, userId: string) {
  const { data } = await admin
    .from('editorial_user_roles')
    .select('role')
    .eq('user_id', userId)
    .in('role', EDITORIAL_ROLES)
    .limit(1);
  return !!data && data.length > 0;
}

// ───────────────────────── GET: list editorial team ─────────────────────────
export const GET: APIRoute = async ({ cookies }) => {
  const auth = await requireEditorialUser(cookies);
  if (!auth.ok) return json({ error: 'Not signed in.' }, 401);
  if (auth.role !== 'editorial_super_admin') {
    return json({ error: 'Super admin access required.' }, 403);
  }
  const admin = auth.adminClient;

  try {
    const { data: roleRows, error } = await admin
      .from('editorial_user_roles')
      .select('user_id, role')
      .in('role', EDITORIAL_ROLES);
    if (error) throw error;

    const rolesByUser = new Map<string, string[]>();
    for (const r of roleRows ?? []) {
      const list = rolesByUser.get(r.user_id) ?? [];
      list.push(r.role as string);
      rolesByUser.set(r.user_id, list);
    }

    const users = await listAllUsers(admin);
    const team = users
      .filter((u) => rolesByUser.has(u.id))
      .map((u) => ({
        id: u.id as string,
        email: (u.email ?? null) as string | null,
        roles: rolesByUser.get(u.id) as string[],
        last_sign_in_at: (u.last_sign_in_at ?? null) as string | null,
      }))
      .sort((a, b) => (a.email ?? '').localeCompare(b.email ?? ''));

    return json({ team });
  } catch (err) {
    console.error('[Editorial team list]', err);
    return json({ error: 'Could not load the team.' }, 500);
  }
};

// ───────────────────────── POST: create / set_role / remove ─────────────────────────
export const POST: APIRoute = async ({ request, cookies }) => {
  const auth = await requireEditorialUser(cookies);
  if (!auth.ok) return json({ error: 'Not signed in.' }, 401);
  if (auth.role !== 'editorial_super_admin') {
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
        !EDITORIAL_ROLES.includes(role)
      ) {
        return json({ error: 'Enter a valid email and role.' }, 400);
      }

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
          console.error('[Editorial team create]', error);
          return json({ error: 'Could not create the user.' }, 500);
        }
        target = data.user;
      }

      const roleErr = await setEditorialRole(admin, target.id, role);
      if (roleErr) {
        console.error('[Editorial team set role]', roleErr);
        return json({ error: 'Could not assign the role.' }, 500);
      }

      await logAudit(admin, auth.user, 'team_user_added', {
        target_email: email,
        role,
        new_account: !!tempPassword,
      });

      return json({ success: true, email, tempPassword });
    }

    // ── set_role / remove need an existing editorial team member ──
    const userId = body?.user_id;
    if (typeof userId !== 'string' || !userId) {
      return json({ error: 'Invalid request.' }, 400);
    }
    if (userId === auth.user.id) {
      return json({ error: "You can't change your own access." }, 400);
    }
    if (!(await isEditorialMember(admin, userId))) {
      return json(
        { error: 'That user is not part of the editorial team.' },
        404,
      );
    }

    const { data: targetData } = await admin.auth.admin.getUserById(userId);
    const targetEmail = targetData?.user?.email ?? null;

    if (action === 'set_role') {
      const role = body.role;
      if (!EDITORIAL_ROLES.includes(role)) {
        return json({ error: 'Invalid role.' }, 400);
      }
      const roleErr = await setEditorialRole(admin, userId, role);
      if (roleErr) {
        console.error('[Editorial team set role]', roleErr);
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
        console.error('[Editorial team reset password]', error.message);
        return json({ error: 'Could not reset the password.' }, 500);
      }
      await logAudit(admin, auth.user, 'team_password_reset', {
        target_email: targetEmail,
      });
      return json({ success: true, email: targetEmail, tempPassword });
    }

    if (action === 'remove') {
      // Revoke editorial access only. The login account is NOT deleted.
      const { error } = await admin
        .from('editorial_user_roles')
        .delete()
        .eq('user_id', userId)
        .in('role', EDITORIAL_ROLES);
      if (error) {
        console.error('[Editorial team remove]', error);
        return json({ error: 'Could not remove access.' }, 500);
      }
      await admin.from('editorial_sessions').delete().eq('user_id', userId);
      await logAudit(admin, auth.user, 'team_access_removed', {
        target_email: targetEmail,
      });
      return json({ success: true });
    }

    return json({ error: 'Unknown action.' }, 400);
  } catch (err) {
    console.error('[Editorial team]', err);
    return json({ error: 'Something went wrong.' }, 500);
  }
};
