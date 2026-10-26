import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

export const prerender = false;

const escape = (v: any) => {
  if (v === null || v === undefined) return '';
  const s = String(v).replace(/"/g, '""');
  return /[",\n]/.test(s) ? `"${s}"` : s;
};

export const GET: APIRoute = async ({ locals }) => {
  if (!locals.user) {
    return new Response('Unauthorized', { status: 401 });
  }

  const url =
    process.env.FEEDBACK_SUPABASE_URL ?? import.meta.env.FEEDBACK_SUPABASE_URL;
  const key =
    process.env.FEEDBACK_SUPABASE_SERVICE_ROLE_KEY ??
    import.meta.env.FEEDBACK_SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    return new Response('Server config error', { status: 500 });
  }

  const admin = createClient(url, key);

  const { data, error } = await admin
    .from('patient_feedback')
    .select('*')
    .order('submitted_at', { ascending: false });

  if (error) return new Response('Query failed', { status: 500 });

  // Columns to export — anonymised (no name, phone, email, followup_*)
  const headers = [
    'id',
    'submitted_at',
    'service_point',
    'visitor_type',
    'age',
    'sex',
    'ward_dept',
    ...Array.from({ length: 18 }, (_, i) => `q${i + 1}`),
    'critical_improvement',
    'comment_positive',
    'comment_improvement',
    'comment_other',
    'wants_followup',
    'status',
    'resolution_notes',
  ];

  const lines = [headers.join(',')];
  for (const row of data || []) {
    lines.push(headers.map((h) => escape((row as any)[h])).join(','));
  }

  const csv = lines.join('\n');
  const filename = `cqi-feedback-${new Date().toISOString().slice(0, 10)}.csv`;

  return new Response(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
};
