// src/pages/api/vendor-register.ts
import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';
import { resend, fromEmail, getVendorEmailHtml } from '../../lib/resend';

// Force Vercel to use the Node.js runtime instead of Edge
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const supabaseUrl =
      import.meta.env.PUBLIC_SUPABASE_URL || import.meta.env.SUPABASE_URL;
    const supabaseKey =
      import.meta.env.PUBLIC_SUPABASE_ANON_KEY ||
      import.meta.env.SUPABASE_ANON_KEY;

    // Check 1: Are the environment variables loaded?
    if (!supabaseUrl || !supabaseKey) {
      return new Response(
        JSON.stringify({
          error:
            'Server Configuration Error: Supabase keys are missing on this server.',
        }),
        { status: 500 },
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const body = await request.json();
    const { companyName, kraPin, regNumber, category, email, phone, country } =
      body;

    // Check 2: Database Insert
    const { error: dbError } = await supabase.from('vendors').insert({
      company_name: companyName,
      kra_pin: kraPin,
      reg_number: regNumber,
      category: category,
      email: email,
      phone: phone,
      country: country,
      status: 'pending',
    });

    if (dbError) {
      console.error('Vendor DB Error:', dbError);
      if (dbError.code === '23505') {
        return new Response(
          JSON.stringify({
            error: 'This email or KRA PIN is already registered.',
          }),
          { status: 400 },
        );
      }
      // Return the exact database error to the browser
      return new Response(
        JSON.stringify({ error: `Database Error: ${dbError.message}` }),
        { status: 500 },
      );
    }

    // Check 3: Email Sending
    try {
      const emailResponse = await resend.emails.send({
        from: fromEmail,
        to: [email],
        subject: 'Vendor Registration Received - SPMH Procurement',
        html: getVendorEmailHtml(companyName),
      });

      if (emailResponse.error) {
        console.error('Resend API Error:', emailResponse.error);
        // We don't fail the whole request if email fails, but we log it
      }
    } catch (emailError: any) {
      console.error('Resend Catch Error:', emailError.message);
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err: any) {
    console.error('Vendor Register Route Error:', err);
    // This will expose the exact crash reason to your browser
    return new Response(
      JSON.stringify({ error: `Server Error: ${err.message}` }),
      { status: 500 },
    );
  }
};
