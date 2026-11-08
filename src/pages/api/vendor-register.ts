import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';
import { resend, fromEmail, getVendorEmailHtml } from '../../lib/resend';

export const prerender = false;

const supabaseUrl =
  import.meta.env.PUBLIC_SUPABASE_URL ||
  import.meta.env.PUBLIC_FEEDBACK_SUPABASE_URL;
const supabaseKey =
  import.meta.env.PUBLIC_SUPABASE_ANON_KEY ||
  import.meta.env.PUBLIC_FEEDBACK_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    // Receive the final country string from the frontend
    const { companyName, kraPin, regNumber, category, email, phone, country } =
      body;

    const { error: dbError } = await supabase.from('vendors').insert({
      company_name: companyName,
      kra_pin: kraPin,
      reg_number: regNumber,
      category: category,
      email: email,
      phone: phone,
      country: country, // Save the country
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
      throw dbError;
    }

    try {
      await resend.emails.send({
        from: fromEmail,
        to: [email],
        subject: 'Vendor Registration Received - SPMH Procurement',
        html: getVendorEmailHtml(companyName),
      });
    } catch (emailError) {
      console.error('Resend Email Error:', emailError);
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err: any) {
    console.error('Vendor Register Error:', err);
    return new Response(
      JSON.stringify({ error: err.message || 'Internal server error' }),
      { status: 500 },
    );
  }
};
