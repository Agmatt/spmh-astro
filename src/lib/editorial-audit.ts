// src/lib/editorial-audit.ts
// Writes one row to editorial_audit_log. Never throws: a logging problem must
// not block the action itself, but it is printed to the server log.

import type { SupabaseClient, User } from '@supabase/supabase-js';

export async function logAudit(
  adminClient: SupabaseClient,
  user: User,
  action: string,
  details?: Record<string, unknown>,
): Promise<void> {
  const { error } = await adminClient.from('editorial_audit_log').insert([
    {
      user_id: user.id,
      user_email: user.email,
      action,
      details: details ?? null,
    },
  ]);

  if (error) console.error('[Editorial audit]', error.message);
}
