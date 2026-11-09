// src/pages/admin/appointments/logout.ts
import type { APIRoute } from 'astro';
import { createAppointmentsSupabaseServer } from '../../../lib/appointments-supabase-server';

export const prerender = false;

export const POST: APIRoute = async ({ cookies, redirect }) => {
  const supabase = createAppointmentsSupabaseServer(cookies);
  await supabase.auth.signOut();
  return redirect('/admin/appointments/login');
};
