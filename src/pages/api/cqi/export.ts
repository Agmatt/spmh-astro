// src/pages/api/cqi/export.ts
import type { APIRoute } from 'astro';
import { requireCqiUser } from '../../../lib/cqi-auth';
import { logAudit } from '../../../lib/cqi-audit';

export const prerender = false;

const COLUMNS = [
  'submitted_at',
  'service_point',
  'visitor_type',
  'name',
  'age',
  'sex',
  'ward_dept',
  'room_bed',
  'visit_date',
  'phone',
  'email',
  ...Array.from({ length: 18 }, (_, i) => `q${i + 1}`),
  'critical_improvement',
  'comment_positive',
  'comment_improvement',
  'comment_other',
  'wants_followup',
  'followup_phone',
  'followup_email',
  'status',
  'resolution_notes',
  'archived_at',
];

// Quote every cell, and stop spreadsheet formula injection:
// free-text starting with = + - @ would otherwise run as a formula in Excel.
function csvCell(value: unknown): string {
  if (value === null || value === undefined) return '';
  let text = String(value);
  const looksLikePhone = /^\+?[\d\s()-]+$/.test(text);
  if (!looksLikePhone && /^[=+\-@\t\r]/.test(text)) text = `'${text}`;
  return `"${text.replace(/"/g, '""')}"`;
}

export const GET: APIRoute = async ({ cookies, redirect }) => {
  const auth = await requireCqiUser(cookies);
  if (!auth.ok) return redirect(auth.redirect);

  // Supabase returns at most 1000 rows per request, so fetch in pages
  const PAGE = 1000;
  const rows: Record<string, unknown>[] = [];

  for (let from = 0; from < 10000; from += PAGE) {
    const { data, error } = await auth.adminClient
      .from('patient_feedback')
      .select('*')
      .is('deleted_at', null)
      .order('submitted_at', { ascending: false })
      .order('id', { ascending: true })
      .range(from, from + PAGE - 1);

    if (error) {
      console.error('[CQI export]', error);
      return new Response('Could not export feedback.', { status: 500 });
    }

    rows.push(...(data ?? []));
    if (!data || data.length < PAGE) break;
  }

  await logAudit(auth.adminClient, auth.user, 'exported_csv', {
    details: { rows: rows.length },
  });

  const lines = [
    COLUMNS.join(','),
    ...rows.map((row) => COLUMNS.map((c) => csvCell(row[c])).join(',')),
  ];
  // BOM so Excel reads the file as UTF-8
  const csv = '\uFEFF' + lines.join('\r\n');

  return new Response(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="cqi-feedback-${new Date().toISOString().slice(0, 10)}.csv"`,
      'Cache-Control': 'no-store',
    },
  });
};
