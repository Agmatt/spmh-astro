// src/pages/api/cqi/auth-callback.ts
// The reset-email link lands here. We turn it into a session (cookies),
// then send the user to the "set new password" page.

import type { APIRoute } from 'astro';
import type { EmailOtpType } from '@supabase/supabase-js';
import { createSupabaseServer } from '../../../lib/supabase-server';

export const prerender = false;

const INVALID = '/admin/cqi/login?error=invalid_link';
const NEXT = '/admin/cqi/reset-password';

export const GET: APIRoute = async ({ url, cookies, redirect }) => {
  const supabase = createSupabaseServer(cookies);

  // Supabase reports problems (expired, already used…) in the query string
  const providerError =
    url.searchParams.get('error_description') ?? url.searchParams.get('error');
  if (providerError) {
    console.error('[CQI reset callback] provider error:', providerError);
    return redirect(INVALID);
  }

  const code = url.searchParams.get('code');
  const tokenHash = url.searchParams.get('token_hash');
  const type = url.searchParams.get('type') as EmailOtpType | null;

  // Normal flow: ?code=...
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      // "code verifier" in this message = link opened in a different browser
      console.error('[CQI reset callback] exchange failed:', error.message);
      return redirect(INVALID);
    }
    return redirect(NEXT);
  }

  // Alternative flow: ?token_hash=...&type=recovery
  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash: tokenHash,
    });
    if (error) {
      console.error('[CQI reset callback] verifyOtp failed:', error.message);
      return redirect(INVALID);
    }
    return redirect(NEXT);
  }

  console.error('[CQI reset callback] no code or token in URL:', url.search);
  return redirect(INVALID);
};
