// src/lib/tenders-supabase-server.ts
// Cookie-based Supabase server client for the MAIN project (tzliykelldkbweogledq),
// which is where the tenders/vendors/applications tables live.
// Separate from lib/supabase-server.ts on purpose — that one is wired to the
// FEEDBACK project for the CQI portal. Mixing the two silently logs people
// into the wrong Supabase project.

import { createServerClient } from '@supabase/ssr';
import type { AstroCookies } from 'astro';

export function createTendersSupabaseServer(cookies: AstroCookies) {
  const url =
    import.meta.env.SUPABASE_URL ??
    process.env.SUPABASE_URL ??
    import.meta.env.PUBLIC_SUPABASE_URL;

  const anonKey =
    import.meta.env.PUBLIC_SUPABASE_ANON_KEY ?? process.env.PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      'Missing Supabase public env vars (SUPABASE_URL / PUBLIC_SUPABASE_ANON_KEY)',
    );
  }

  return createServerClient(url, anonKey, {
    cookies: {
      get(key) {
        return cookies.get(key)?.value;
      },
      set(key, value, options) {
        cookies.set(key, value, options);
      },
      remove(key, options) {
        cookies.delete(key, options);
      },
    },
  });
}