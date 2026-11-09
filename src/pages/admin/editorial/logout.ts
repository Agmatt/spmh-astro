// src/pages/admin/editorial/logout.ts
import type { APIRoute } from 'astro';
import { createEditorialSupabaseServer } from '../../../lib/editorial-supabase-server';

export const prerender = false;

export const POST: APIRoute = async ({ cookies, redirect }) => {
  const supabase = createEditorialSupabaseServer(cookies);
  await supabase.auth.signOut();
  return redirect('/admin/editorial/login');
};
