// src/pages/api/cqi/account.ts
// Lets a signed-in CQI admin / super admin change their OWN password or email.
// Viewers are refused: they use "Forgot password" on the login page.

import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';
import { requireCqiUser } from '../../../lib/cqi-auth';
import { logAudit } from '../../../lib/cqi-audit';

export const prerender = false;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

/** Checks the current password without touching the user's real session. */
async function currentPasswordIsCorrect(
  email: string,
  password: string,
): Promise<boolean> {
  const url =
    import.meta.env.FEEDBACK_SUPABASE_URL ?? process.env.FEEDBACK_SUPABASE_URL;
  const anonKey =
    import.meta.env.PUBLIC_FEEDBACK_SUPABASE_ANON_KEY ??
    import.meta.env.PUBLIC_SUPABASE_NEWS_ANON_KEY;
  if (!url || !anonKey) throw new Error('Missing Supabase env vars');

  const client = createClient(url, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
  const { error } = await client.auth.signInWithPassword({ email, password });
  return !error;
}

export const POST: APIRoute = async ({ request, cookies }) => {
  const auth = await requireCqiUser(cookies);
  if (!auth.ok) return json({ error: 'Not signed in.' }, 401);

  if (auth.role === 'cqi_viewer') {
    return json(
      {
        error:
          'Settings are for admins only. Use "Forgot password" on the login page.',
      },
      403,
    );
  }

  let body: any;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid request.' }, 400);
  }

  const { action, current_password } = body ?? {};
  const currentEmail = auth.user.email;
  if (!currentEmail) return json({ error: 'Your account has no email.' }, 400);

  if (typeof current_password !== 'string' || !current_password) {
    return json({ error: 'Enter your current password.' }, 400);
  }

  try {
    if (!(await currentPasswordIsCorrect(currentEmail, current_password))) {
      return json({ error: 'Your current password is incorrect.' }, 400);
    }
  } catch (err) {
    console.error('[CQI account verify]', err);
    return json({ error: 'Could not verify your password.' }, 500);
  }

  // ── Change password ──
  if (action === 'change_password') {
    const newPassword = body.new_password;
    if (typeof newPassword !== 'string' || newPassword.length < 8) {
      return json(
        { error: 'New password must be at least 8 characters.' },
        400,
      );
    }
    if (newPassword.length > 72) {
      return json(
        { error: 'New password is too long (max 72 characters).' },
        400,
      );
    }
    if (newPassword === current_password) {
      return json(
        { error: 'New password must be different from the current one.' },
        400,
      );
    }

    const { error } = await auth.adminClient.auth.admin.updateUserById(
      auth.user.id,
      { password: newPassword },
    );
    if (error) {
      console.error('[CQI account password]', error.message);
      return json(
        { error: error.message || 'Could not change the password.' },
        400,
      );
    }

    await logAudit(auth.adminClient, auth.user, 'password_changed');
    return json({ success: true });
  }

  // ── Change email ──
  if (action === 'change_email') {
    const newEmail =
      typeof body.new_email === 'string'
        ? body.new_email.trim().toLowerCase()
        : '';
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(newEmail)) {
      return json({ error: 'Enter a valid email address.' }, 400);
    }
    if (newEmail === currentEmail.toLowerCase()) {
      return json({ error: 'That is already your email address.' }, 400);
    }

    const { error } = await auth.adminClient.auth.admin.updateUserById(
      auth.user.id,
      { email: newEmail, email_confirm: true },
    );
    if (error) {
      console.error('[CQI account email]', error.message);
      const taken = /already|registered|exists/i.test(error.message);
      return json(
        {
          error: taken
            ? 'That email address is already in use.'
            : 'Could not change the email.',
        },
        taken ? 409 : 500,
      );
    }

    await logAudit(auth.adminClient, auth.user, 'email_changed', {
      details: { old_email: currentEmail, new_email: newEmail },
    });
    return json({ success: true, email: newEmail });
  }

  return json({ error: 'Unknown action.' }, 400);
};
