// src/pages/api/cqi/account.ts
// A signed-in CQI user (any role) changes their OWN password.
// This is also the forced "choose your own password" step after an admin
// creates the account or resets the password.
// Email addresses are NOT changed here: a typo would lock the person out.

import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';
import { requireCqiUser } from '../../../lib/cqi-auth';
import { logAudit } from '../../../lib/cqi-audit';

export const prerender = false;

const MIN_LENGTH = 10;

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
  // skipPasswordGate: this is the endpoint that CLEARS the "must change" flag
  const auth = await requireCqiUser(cookies, { skipPasswordGate: true });
  if (!auth.ok) return json({ error: 'Not signed in.' }, 401);

  let body: any;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid request.' }, 400);
  }

  const { current_password, new_password } = body ?? {};
  const email = auth.user.email;
  if (!email) return json({ error: 'Your account has no email.' }, 400);

  if (typeof current_password !== 'string' || !current_password) {
    return json({ error: 'Enter your current password.' }, 400);
  }
  if (typeof new_password !== 'string' || new_password.length < MIN_LENGTH) {
    return json(
      { error: `New password must be at least ${MIN_LENGTH} characters.` },
      400,
    );
  }
  if (new_password.length > 72) {
    return json(
      { error: 'New password is too long (max 72 characters).' },
      400,
    );
  }
  if (new_password === current_password) {
    return json(
      { error: 'New password must be different from the current one.' },
      400,
    );
  }

  try {
    if (!(await currentPasswordIsCorrect(email, current_password))) {
      return json({ error: 'Your current password is incorrect.' }, 400);
    }
  } catch (err) {
    console.error('[CQI account verify]', err);
    return json({ error: 'Could not verify your password.' }, 500);
  }

  const { error } = await auth.adminClient.auth.admin.updateUserById(
    auth.user.id,
    {
      password: new_password,
      app_metadata: { must_change_password: false },
    },
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
};
