// src/lib/tenders-supabase-browser.ts
// Browser Supabase client for the MAIN project (tzliykelldkbweogledq).
// Separate from lib/supabase-browser.ts, which points at the FEEDBACK
// project for the CQI portal — using that one here logs people into the
// wrong database. Also separate from the plain `lib/supabase.js` client
// (localStorage-based) already used by the public tender/apply pages,
// because the Tenders Portal's server-side auth gate reads the session
// from COOKIES, and only a client built with createBrowserClient writes
// those cookies.

import { createBrowserClient } from '@supabase/ssr';

let client: ReturnType<typeof createBrowserClient> | undefined;

export function getTendersBrowserSupabase() {
  client ??= createBrowserClient(
    import.meta.env.PUBLIC_SUPABASE_URL,
    import.meta.env.PUBLIC_SUPABASE_ANON_KEY,
  );
  return client;
}
