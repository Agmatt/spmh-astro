// src/pages/api/cqi/archive.ts
import type { APIRoute } from 'astro';
import { requireCqiUser } from '../../../lib/cqi-auth';
import { logAudit } from '../../../lib/cqi-audit';

export const prerender = false;

const ACTIONS = ['archive', 'unarchive', 'delete'];
const AUDIT_NAME: Record<string, string> = {
  archive: 'archived',
  unarchive: 'unarchived',
  delete: 'deleted',
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

export const POST: APIRoute = async ({ request, cookies }) => {
  const auth = await requireCqiUser(cookies);
  if (!auth.ok) return json({ error: 'Not signed in.' }, 401);

  let body: any;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid request.' }, 400);
  }

  const { id, action } = body ?? {};
  if (!id || typeof id !== 'string' || !ACTIONS.includes(action)) {
    return json({ error: 'Invalid request.' }, 400);
  }

  // Archive / unarchive: admins and super admins. Delete: super admins only.
  const canEdit = auth.role === 'cqi_admin' || auth.role === 'cqi_super_admin';
  const canDelete = auth.role === 'cqi_super_admin';
  if (action === 'delete' ? !canDelete : !canEdit) {
    return json({ error: 'You do not have permission to do that.' }, 403);
  }

  const now = new Date().toISOString();
  const uid = auth.user.id;

  const patch =
    action === 'archive'
      ? { archived_at: now, archived_by: uid }
      : action === 'unarchive'
        ? { archived_at: null, archived_by: null }
        : { deleted_at: now, deleted_by: uid }; // soft delete: row is kept for audit

  const { data, error } = await auth.adminClient
    .from('patient_feedback')
    .update(patch)
    .eq('id', id)
    .is('deleted_at', null)
    .select('id')
    .maybeSingle();

  if (error) {
    console.error('[CQI archive]', error);
    return json({ error: 'Action failed.' }, 500);
  }
  if (!data) return json({ error: 'Feedback not found.' }, 404);

  await logAudit(auth.adminClient, auth.user, AUDIT_NAME[action], {
    feedbackId: id,
  });

  return json({ success: true });
};
