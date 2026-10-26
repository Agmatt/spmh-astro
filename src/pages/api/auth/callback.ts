import type { APIRoute } from 'astro';
import { createSupabaseServer } from '../../../lib/supabase-server';

export const prerender = false;

export const GET: APIRoute = async ({ url, cookies, redirect }) => {
  const code = url.searchParams.get('code');
  const next = url.searchParams.get('next') || '/admin/cqi';
  if (!code) return redirect('/admin/cqi/login?error=invalid_link');

  const supabase = createSupabaseServer(cookies);
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) return redirect('/admin/cqi/login?error=invalid_link');
  return redirect(next);
};
