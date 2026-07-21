// src/pages/api/vendor-register.js
import { supabase } from '../../lib/supabase';
// import { Resend } from 'resend'; // uncomment once wired to your Resend key,
// same pattern as the appointment booking confirmation emails.

export async function POST({ request }) {
  const body = await request.json();

  const { companyName, kraPin, regNumber, category, email, phone, agree } =
    body;

  if (
    !companyName ||
    !kraPin ||
    !regNumber ||
    !category ||
    !email ||
    !phone ||
    !agree
  ) {
    return new Response(JSON.stringify({ error: 'Missing required fields.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { data, error } = await supabase
    .from('vendors')
    .insert({
      company_name: companyName,
      kra_pin: kraPin,
      reg_number: regNumber,
      category,
      email,
      phone,
      status: 'pending',
    })
    .select()
    .single();

  if (error) {
    console.error('Vendor registration failed:', error.message);
    return new Response(
      JSON.stringify({ error: 'Could not save registration.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }

  // Optional: send a confirmation email the same way the booking system does.
  // await resend.emails.send({
  //   from: 'procurement@spmh.co.ke',
  //   to: email,
  //   subject: 'Vendor Registration Received — SPMH Procurement',
  //   html: `<p>Thank you, ${companyName}. Your registration under ${category} has been received.</p>`,
  // });

  return new Response(JSON.stringify({ vendor: data }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
