// src/lib/editorial-supabase-browser.ts
// Browser client for the NEWS project (zzlngx…). Writes the session as
// cookies so the server gate and the dashboard's queries share one session.
import { createBrowserClient } from '@supabase/ssr';

let client: ReturnType<typeof createBrowserClient> | undefined;

export function getEditorialBrowserSupabase() {
  client ??= createBrowserClient(
    import.meta.env.PUBLIC_SUPABASE_NEWS_URL,
    import.meta.env.PUBLIC_SUPABASE_NEWS_ANON_KEY,
  );
  return client;
}
