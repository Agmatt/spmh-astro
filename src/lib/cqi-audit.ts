// src/lib/cqi-audit.ts
// Writes one row to cqi_audit_log. Never throws: a logging problem must not
// block the action itself, but it is printed to the server log.

import type { SupabaseClient, User } from '@supabase/supabase-js';

export async function logAudit(
  adminClient: SupabaseClient,
  user: User,
  action: string,
  options: {
    feedbackId?: string | null;
    details?: Record<string, unknown>;
  } = {},
): Promise<void> {
  const { error } = await adminClient.from('cqi_audit_log').insert([
    {
      feedback_id: options.feedbackId ?? null,
      user_id: user.id,
      user_email: user.email,
      action,
      details: options.details ?? null,
    },
  ]);

  if (error) console.error('[CQI audit]', error.message);
}
