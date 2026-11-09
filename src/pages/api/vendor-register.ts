// src/pages/api/vendor-register.ts
import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

export const prerender = false;

// Read from import.meta.env (build time) or process.env (runtime on Vercel).
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

function vendorEmailHtml(companyName: string) {
  return `
    <div style="font-family:Arial,sans-serif;color:#1e293b;max-width:560px">
      <h2 style="color:#125276">Vendor registration received</h2>
      <p>Dear ${escapeHtml(companyName)},</p>
      <p>Thank you for registering with St. Paul's Mission Hospital. Our procurement
      office will review your details and contact you if further information is needed.</p>
      <p style="font-size:12px;color:#64748b">St. Paul's Mission Hospital · Accounts &amp; Procurement</p>
    </div>`;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const supabaseUrl = env('PUBLIC_SUPABASE_URL') ?? env('SUPABASE_URL');
    const supabaseKey =
      env('PUBLIC_SUPABASE_ANON_KEY') ?? env('SUPABASE_ANON_KEY');

    if (!supabaseUrl || !supabaseKey) {
      console.error('[vendor-register] missing Supabase env vars');
      return json(
        { error: 'Server configuration error: database keys are missing.' },
        500,
      );
    }

    let body: any;
    try {
      body = await request.json();
    } catch {
      return json({ error: 'Invalid form data. Please try again.' }, 400);
    }

    const { companyName, kraPin, regNumber, category, email, phone, country } =
      body ?? {};

    if (!companyName || !email || !kraPin) {
      return json(
        { error: 'Company name, KRA PIN and email are required.' },
        400,
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { error: dbError } = await supabase.from('vendors').insert({
      company_name: companyName,
      kra_pin: kraPin,
      reg_number: regNumber,
      category,
      email,
      phone,
      country,
      status: 'pending',
    });

    if (dbError) {
      console.error('[vendor-register] DB error:', dbError);
      if (dbError.code === '23505') {
        return json(
          { error: 'This email or KRA PIN is already registered.' },
          400,
        );
      }
      return json(
        { error: 'Could not save your registration. Please try again.' },
        500,
      );
    }

    // Email is optional and must never fail the registration.
    const resendKey = env('RESEND_API_KEY');
    if (resendKey) {
      try {
        const resend = new Resend(resendKey);
        const { error: mailError } = await resend.emails.send({
          from:
            env('RESEND_FROM_EMAIL') ??
            'SPMH Procurement <procurement@spmh.co.ke>',
          to: [email],
          subject: 'Vendor Registration Received - SPMH Procurement',
          html: vendorEmailHtml(companyName),
        });
        if (mailError)
          console.error('[vendor-register] Resend error:', mailError);
      } catch (mailErr: any) {
        console.error('[vendor-register] email failed:', mailErr?.message);
      }
    } else {
      console.warn(
        '[vendor-register] RESEND_API_KEY not set; skipping confirmation email',
      );
    }

    return json({ success: true }, 200);
  } catch (err: any) {
    console.error('[vendor-register] unexpected error:', err);
    return json({ error: 'Something went wrong. Please try again.' }, 500);
  }
};
