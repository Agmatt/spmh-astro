// src/pages/api/cqi/update-status.ts
import type { APIRoute } from 'astro';
import { requireCqiUser } from '../../../lib/cqi-auth';
import { logAudit } from '../../../lib/cqi-audit';

export const prerender = false;

const ALLOWED_STATUS = ['new', 'reviewed', 'action_taken', 'closed'];

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

export const POST: APIRoute = async ({ request, cookies }) => {
  const auth = await requireCqiUser(cookies);
  if (!auth.ok) return json({ error: 'Not signed in.' }, 401);

  // Viewers can read only
  if (auth.role === 'cqi_viewer') {
    return json({ error: 'You have view-only access.' }, 403);
  }

  let body: any;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid request.' }, 400);
  }

  const { id, status, notes } = body ?? {};
  if (!id || typeof id !== 'string' || !ALLOWED_STATUS.includes(status)) {
    return json({ error: 'Invalid request.' }, 400);
  }

  const cleanNotes =
    typeof notes === 'string' ? notes.trim().slice(0, 2000) : '';

  const update: Record<string, unknown> = {
    status,
    reviewed_by: auth.user.id,
    reviewed_at: new Date().toISOString(),
  };
  // Empty notes never overwrite notes that already exist
  if (cleanNotes) update.resolution_notes = cleanNotes;

  const { data, error } = await auth.adminClient
    .from('patient_feedback')
    .update(update)
    .eq('id', id)
    .is('deleted_at', null)
    .select('id')
    .maybeSingle();

  if (error) {
    console.error('[CQI update-status]', error);
    return json({ error: 'Could not update status.' }, 500);
  }
  if (!data) return json({ error: 'Feedback not found.' }, 404);

  await logAudit(auth.adminClient, auth.user, `status_changed_to_${status}`, {
    feedbackId: id,
    details: { notes: cleanNotes || null },
  });

  return json({ success: true });
};
