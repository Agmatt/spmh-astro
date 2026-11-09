// src/pages/api/appointments/book.ts
// Public booking endpoint. Replaces the direct table reads and inserts the
// booking page used to make with the anon key, and the missing
// /api/send-booking-confirmation route.
//
// GET  ?clinic=sopc&dates=2026-11-09,2026-11-16  → booked count per date
// POST { clinic, date, time, fullName, phone, email?, medicalHistory? } → books
//
// The anon key can no longer read patient rows; only these counts are public.

import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

export const prerender = false;

const MAX_PER_DAY = 15;
const CLINICS: Record<string, { name: string; day: string; weekday: number }> =
  {
    sopc: {
      name: 'Surgical Outpatient Clinic (SOPC)',
      day: 'Monday',
      weekday: 1,
    },
    mopc: {
      name: 'Medical Outpatient Clinic (MOPC)',
      day: 'Tuesday',
      weekday: 2,
    },
    obgyn: { name: 'OB/GYN Outpatient Clinic', day: 'Wednesday', weekday: 3 },
    popc: {
      name: 'Pediatric Outpatient Clinic (POPC)',
      day: 'Thursday',
      weekday: 4,
    },
  };
const TIME_SLOTS = [
  '08:00 AM',
  '08:30 AM',
  '09:00 AM',
  '09:30 AM',
  '10:00 AM',
  '10:30 AM',
  '11:00 AM',
  '11:30 AM',
];
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

const env = (key: string): string | undefined =>
  ((import.meta.env as Record<string, string | undefined>)[key] ??
    process.env[key]) ||
  undefined;

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

const escapeHtml = (s: string) =>
  s.replace(
    /[&<>"']/g,
    (c) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[
        c
      ]!,
  );

// Server-side admin client for the zzlngx project, where appointments live.
function db() {
  const url = env('FEEDBACK_SUPABASE_URL');
  const key = env('FEEDBACK_SUPABASE_SERVICE_ROLE_KEY');
  if (!url || !key)
    throw new Error(
      'Missing FEEDBACK_SUPABASE_URL or FEEDBACK_SUPABASE_SERVICE_ROLE_KEY',
    );
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

// Only Kenyan mobile numbers, as in the form
function validPhone(phone: string) {
  return /^(?:\+254|254|0)[17]\d{8}$/.test(phone.replace(/[\s\-().]/g, ''));
}

// Dates must be a real, future occurrence of the clinic's weekday
function validClinicDate(date: string, weekday: number) {
  if (!DATE_RE.test(date)) return false;
  const d = new Date(`${date}T00:00:00Z`);
  if (isNaN(d.getTime()) || d.getUTCDay() !== weekday) return false;
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  return d.getTime() >= today.getTime();
}

// ── GET: how many bookings each requested date already has ─────────────
export const GET: APIRoute = async ({ url }) => {
  try {
    const clinic = url.searchParams.get('clinic') ?? '';
    const dates = (url.searchParams.get('dates') ?? '')
      .split(',')
      .filter(Boolean);
    if (
      !CLINICS[clinic] ||
      dates.length === 0 ||
      dates.length > 60 ||
      !dates.every((d) => DATE_RE.test(d))
    ) {
      return json({ error: 'Invalid request.' }, 400);
    }

    const { data, error } = await db()
      .from('appointments')
      .select('appointment_date')
      .eq('clinic_name', clinic)
      .in('appointment_date', dates);
    if (error) {
      console.error('[appointments availability]', error);
      return json({ error: 'Could not load availability.' }, 500);
    }

    const counts: Record<string, number> = Object.fromEntries(
      dates.map((d) => [d, 0]),
    );
    for (const row of data ?? [])
      counts[row.appointment_date] = (counts[row.appointment_date] ?? 0) + 1;
    return json({ max: MAX_PER_DAY, counts });
  } catch (err: any) {
    console.error('[appointments availability] unexpected:', err);
    return json({ error: 'Something went wrong.' }, 500);
  }
};

// ── POST: book a slot ───────────────────────────────────────────────────
export const POST: APIRoute = async ({ request }) => {
  try {
    let body: any;
    try {
      body = await request.json();
    } catch {
      return json({ error: 'Invalid request.' }, 400);
    }

    const clinicId = String(body?.clinic ?? '');
    const clinic = CLINICS[clinicId];
    const date = String(body?.date ?? '');
    const time = String(body?.time ?? '');
    const fullName = String(body?.fullName ?? '').trim();
    const phone = String(body?.phone ?? '').trim();
    const email = String(body?.email ?? '')
      .trim()
      .toLowerCase();
    const medicalHistory = String(body?.medicalHistory ?? '')
      .trim()
      .slice(0, 2000);

    if (!clinic) return json({ error: 'Please choose a clinic.' }, 400);
    if (!validClinicDate(date, clinic.weekday)) {
      return json({ error: `Please choose an upcoming ${clinic.day}.` }, 400);
    }
    if (!TIME_SLOTS.includes(time))
      return json({ error: 'Please choose a valid time.' }, 400);
    if (fullName.length < 3)
      return json({ error: 'Please enter your full name.' }, 400);
    if (!validPhone(phone))
      return json({ error: 'Please enter a valid Kenyan phone number.' }, 400);
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return json({ error: 'Please enter a valid email address.' }, 400);
    }

    const supabase = db();

    // Capacity, checked on the server
    const { count, error: countErr } = await supabase
      .from('appointments')
      .select('id', { count: 'exact', head: true })
      .eq('clinic_name', clinicId)
      .eq('appointment_date', date);
    if (countErr) {
      console.error('[appointments capacity]', countErr);
      return json(
        { error: 'Could not check availability. Please try again.' },
        500,
      );
    }
    if ((count ?? 0) >= MAX_PER_DAY) {
      return json(
        {
          error: `This date is fully booked. Please choose another ${clinic.day}.`,
        },
        409,
      );
    }

    const { error: insertErr } = await supabase.from('appointments').insert({
      clinic_name: clinicId,
      clinic_day: clinic.day,
      appointment_date: date,
      appointment_time: time,
      full_name: fullName,
      phone,
      email: email || null,
      medical_history: medicalHistory || null,
      status: 'approved',
    });
    if (insertErr) {
      console.error('[appointments insert]', insertErr);
      return json(
        { error: 'Could not save your booking. Please try again.' },
        500,
      );
    }

    // Confirmations. Never fail the booking because email failed.
    const resendKey = env('RESEND_API_KEY');
    if (resendKey) {
      try {
        const resend = new Resend(resendKey);
        const from =
          env('RESEND_FROM_EMAIL') ??
          'SPMH Appointments <appointments@spmh.co.ke>';
        const details = `
          <p><strong>Clinic:</strong> ${escapeHtml(clinic.name)}<br/>
          <strong>Date:</strong> ${escapeHtml(date)}<br/>
          <strong>Time:</strong> ${escapeHtml(time)}</p>`;

        if (email) {
          const { error } = await resend.emails.send({
            from,
            to: [email],
            subject: "Appointment confirmed - St. Paul's Mission Hospital",
            html: `<div style="font-family:Arial,sans-serif;color:#1e293b">
              <h2 style="color:#125276">Your appointment is confirmed</h2>
              <p>Dear ${escapeHtml(fullName)},</p>${details}
              <p>If you need to change this appointment, please call the front desk.</p></div>`,
          });
          if (error) console.error('[appointments patient email]', error);
        }

        const { error: staffErr } = await resend.emails.send({
          from,
          to: ['appointments@spmh.co.ke'],
          subject: `New appointment: ${fullName}`,
          html: `<div style="font-family:Arial,sans-serif;color:#1e293b">
            <h2>New appointment</h2>
            <p><strong>Patient:</strong> ${escapeHtml(fullName)}<br/>
            <strong>Phone:</strong> ${escapeHtml(phone)}<br/>
            <strong>Email:</strong> ${escapeHtml(email || '—')}</p>${details}</div>`,
        });
        if (staffErr) console.error('[appointments staff email]', staffErr);
      } catch (mailErr: any) {
        console.error('[appointments email failed]', mailErr?.message);
      }
    } else {
      console.warn(
        '[appointments] RESEND_API_KEY not set; no confirmation sent',
      );
    }

    return json(
      { success: true, clinic: clinic.name, day: clinic.day, date, time },
      201,
    );
  } catch (err: any) {
    console.error('[appointments book] unexpected:', err);
    return json({ error: 'Something went wrong. Please try again.' }, 500);
  }
};
