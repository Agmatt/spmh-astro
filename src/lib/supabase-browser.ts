import { createBrowserClient } from '@supabase/ssr';

export function getBrowserSupabase() {
  const url =
    import.meta.env.PUBLIC_FEEDBACK_SUPABASE_URL ??
    import.meta.env.PUBLIC_SUPABASE_NEWS_URL;

  const anonKey =
    import.meta.env.PUBLIC_FEEDBACK_SUPABASE_ANON_KEY ??
    import.meta.env.PUBLIC_SUPABASE_NEWS_ANON_KEY;

  return createBrowserClient(url, anonKey);
}
