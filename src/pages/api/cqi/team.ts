import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';
import { createSupabaseServer } from '../../../lib/supabase-server';

export const prerender = false;

async function requireSuperAdmin(cookies: any) {
  const supabase = createSupabaseServer(cookies);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: 'Unauthorized', status: 401 };
  const { data: role } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .eq('role', 'cqi_super_admin')
    .maybeSingle();
  if (!role) return { error: 'Super admin only', status: 403 };
  return { user };
}

export const GET: APIRoute = async ({ cookies }) => {
  const guard = await requireSuperAdmin(cookies);
  if ('error' in guard)
    return new Response(JSON.stringify({ error: guard.error }), {
      status: guard.status,
    });

  const url =
    import.meta.env.FEEDBACK_SUPABASE_URL ?? process.env.FEEDBACK_SUPABASE_URL!;
  const key =
    import.meta.env.FEEDBACK_SUPABASE_SERVICE_ROLE_KEY ??
    process.env.FEEDBACK_SUPABASE_SERVICE_ROLE_KEY!;
  const admin = createClient(url, key);

  const {
    data: { users },
    error: usersErr,
  } = await admin.auth.admin.listUsers();
  if (usersErr)
    return new Response(JSON.stringify({ error: usersErr.message }), {
      status: 500,
    });

  const { data: roles } = await admin.from('user_roles').select('*');

  const team = users.map((u: any) => ({
    id: u.id,
    email: u.email,
    created_at: u.created_at,
    last_sign_in_at: u.last_sign_in_at,
    roles: (roles || [])
      .filter((r: any) => r.user_id === u.id)
      .map((r: any) => r.role),
  }));

  return new Response(JSON.stringify({ team }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};

export const POST: APIRoute = async ({ request, cookies }) => {
  const guard = await requireSuperAdmin(cookies);
  if ('error' in guard)
    return new Response(JSON.stringify({ error: guard.error }), {
      status: guard.status,
    });

  const url =
    import.meta.env.FEEDBACK_SUPABASE_URL ?? process.env.FEEDBACK_SUPABASE_URL!;
  const key =
    import.meta.env.FEEDBACK_SUPABASE_SERVICE_ROLE_KEY ??
    process.env.FEEDBACK_SUPABASE_SERVICE_ROLE_KEY!;
  const admin = createClient(url, key);

  const body = await request.json();
  const action = body.action as string;

  // ── Create new user ──
  if (action === 'create') {
    const tempPassword = `Spmh-${Math.random().toString(36).slice(2, 10)}!`;
    const { data: created, error } = await admin.auth.admin.createUser({
      email: body.email,
      password: tempPassword,
      email_confirm: true,
    });
    if (error)
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
      });
    await admin
      .from('user_roles')
      .insert([{ user_id: created.user!.id, role: body.role }]);
    return new Response(
      JSON.stringify({ success: true, tempPassword, email: body.email }),
      { status: 201 },
    );
  }

  // ── Change role ──
  if (action === 'set_role') {
    await admin.from('user_roles').delete().eq('user_id', body.user_id);
    await admin
      .from('user_roles')
      .insert([{ user_id: body.user_id, role: body.role }]);
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  }

  // ── Remove user ──
  if (action === 'remove') {
    await admin.auth.admin.deleteUser(body.user_id);
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  }

  return new Response(JSON.stringify({ error: 'Unknown action' }), {
    status: 400,
  });
};
