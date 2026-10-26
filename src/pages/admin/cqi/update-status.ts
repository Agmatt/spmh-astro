import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';
import { createSupabaseServer } from '../../../lib/supabase-server';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  // ── Self-contained auth (no middleware dependency) ──
  const supabase = createSupabaseServer(cookies);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
    });
  }

  // ── Role check (must be admin or super admin) ──
  const { data: roleRow } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .in('role', ['cqi_admin', 'cqi_super_admin'])
    .maybeSingle();

  if (!roleRow) {
    return new Response(JSON.stringify({ error: 'Insufficient permissions' }), {
      status: 403,
    });
  }

  let body: { id: string; status: string; notes?: string };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
    });
  }

  const allowed = ['new', 'reviewed', 'action_taken', 'closed'];
  if (!body.id || !allowed.includes(body.status)) {
    return new Response(JSON.stringify({ error: 'Invalid status' }), {
      status: 422,
    });
  }

  const url =
    import.meta.env.FEEDBACK_SUPABASE_URL ?? process.env.FEEDBACK_SUPABASE_URL;
  const key =
    import.meta.env.FEEDBACK_SUPABASE_SERVICE_ROLE_KEY ??
    process.env.FEEDBACK_SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key)
    return new Response(JSON.stringify({ error: 'Config error' }), {
      status: 500,
    });

  const admin = createClient(url, key);

  const { error: updateErr } = await admin
    .from('patient_feedback')
    .update({ status: body.status, resolution_notes: body.notes || null })
    .eq('id', body.id);

  if (updateErr)
    return new Response(JSON.stringify({ error: updateErr.message }), {
      status: 500,
    });

  await admin.from('cqi_audit_log').insert([
    {
      feedback_id: body.id,
      user_id: user.id,
      user_email: user.email,
      action: `status_changed_to_${body.status}`,
      details: { notes: body.notes || null },
    },
  ]);

  return new Response(JSON.stringify({ success: true }), { status: 200 });
};
