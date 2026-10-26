import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';
import { createSupabaseServer } from '../../../lib/supabase-server';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  const supabase = createSupabaseServer(cookies);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user)
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
    });

  const { data: roleRow } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user.id)
    .in('role', ['cqi_admin', 'cqi_super_admin'])
    .maybeSingle();
  if (!roleRow)
    return new Response(JSON.stringify({ error: 'Insufficient permissions' }), {
      status: 403,
    });

  const { id, action } = await request.json();
  if (!id || !['archive', 'unarchive', 'delete'].includes(action)) {
    return new Response(JSON.stringify({ error: 'Invalid request' }), {
      status: 422,
    });
  }

  // Only super admin can delete
  if (action === 'delete' && roleRow.role !== 'cqi_super_admin') {
    return new Response(
      JSON.stringify({ error: 'Only super admins can delete' }),
      { status: 403 },
    );
  }

  const url =
    import.meta.env.FEEDBACK_SUPABASE_URL ?? process.env.FEEDBACK_SUPABASE_URL!;
  const key =
    import.meta.env.FEEDBACK_SUPABASE_SERVICE_ROLE_KEY ??
    process.env.FEEDBACK_SUPABASE_SERVICE_ROLE_KEY!;
  const admin = createClient(url, key);

  const update =
    action === 'archive'
      ? { archived_at: new Date().toISOString(), archived_by: user.id }
      : action === 'unarchive'
        ? { archived_at: null, archived_by: null }
        : { deleted_at: new Date().toISOString(), deleted_by: user.id };

  const { error } = await admin
    .from('patient_feedback')
    .update(update)
    .eq('id', id);
  if (error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });

  await admin.from('cqi_audit_log').insert([
    {
      feedback_id: id,
      user_id: user.id,
      user_email: user.email,
      action: `feedback_${action}`,
      details: {},
    },
  ]);

  return new Response(JSON.stringify({ success: true }), { status: 200 });
};
