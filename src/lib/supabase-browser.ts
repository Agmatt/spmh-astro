// src/lib/supabase-browser.ts
import { createBrowserClient } from '@supabase/ssr';

export function getBrowserSupabase() {
  const url = import.meta.env.PUBLIC_FEEDBACK_SUPABASE_URL;
  const anonKey = import.meta.env.PUBLIC_FEEDBACK_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    console.error(
      '[Supabase] Missing PUBLIC_FEEDBACK_* env vars at build time',
    );
    throw new Error('Supabase client config missing');
  }

  return createBrowserClient(url, anonKey);
}
