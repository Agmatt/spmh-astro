import { createServerClient } from '@supabase/ssr';
import type { AstroCookies } from 'astro';

export function createSupabaseServer(cookies: AstroCookies) {
  const url =
    import.meta.env.FEEDBACK_SUPABASE_URL ??
    process.env.FEEDBACK_SUPABASE_URL ??
    import.meta.env.PUBLIC_FEEDBACK_SUPABASE_URL;

  const anonKey =
    import.meta.env.PUBLIC_FEEDBACK_SUPABASE_ANON_KEY ??
    import.meta.env.PUBLIC_SUPABASE_NEWS_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      'Missing Supabase public env vars (FEEDBACK_SUPABASE_URL / PUBLIC_FEEDBACK_SUPABASE_ANON_KEY)',
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
