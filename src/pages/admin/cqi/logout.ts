import type { APIRoute } from 'astro';
import { createSupabaseServer } from '../../../lib/supabase-server';

export const prerender = false;

export const POST: APIRoute = async ({ cookies, redirect }) => {
  const supabase = createSupabaseServer(cookies);
  await supabase.auth.signOut({ scope: 'local' }); // no server roundtrip — ~30ms
  return redirect('/admin/cqi/login');
};
