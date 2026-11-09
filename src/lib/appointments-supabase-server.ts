// src/lib/appointments-supabase-server.ts
// Cookie-based server client for the NEWS/FEEDBACK project (zzlngx…),
// where content_items and appointments roles live.
import { createServerClient } from '@supabase/ssr';
import type { AstroCookies } from 'astro';

export function createAppointmentsSupabaseServer(cookies: AstroCookies) {
  const url =
    import.meta.env.PUBLIC_SUPABASE_NEWS_URL ??
    process.env.PUBLIC_SUPABASE_NEWS_URL;
  const anonKey =
    import.meta.env.PUBLIC_SUPABASE_NEWS_ANON_KEY ??
    process.env.PUBLIC_SUPABASE_NEWS_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      'Missing PUBLIC_SUPABASE_NEWS_URL or PUBLIC_SUPABASE_NEWS_ANON_KEY',
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