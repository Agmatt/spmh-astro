// src/pages/admin/tenders/logout.ts
import type { APIRoute } from 'astro';
import { createTendersSupabaseServer } from '../../../lib/tenders-supabase-server';

export const prerender = false;

export const POST: APIRoute = async ({ cookies, redirect }) => {
  const supabase = createTendersSupabaseServer(cookies);
  await supabase.auth.signOut();
  return redirect('/admin/tenders/login');
};
