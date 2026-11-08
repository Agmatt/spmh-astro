// src/pages/api/send-tender-email.ts
import type { APIRoute } from 'astro';
import { resend, fromEmail, getTenderEmailHtml } from '../../lib/resend';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const { companyName, contactName, email, tenderCode, tenderTitle } =
      await request.json();

    if (!email || !companyName) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400 },
      );
    }

    await resend.emails.send({
      from: fromEmail,
      to: [email],
      subject: `Application Received: ${tenderCode} - SPMH`,
      html: getTenderEmailHtml(
        companyName,
        contactName,
        tenderCode,
        tenderTitle,
      ),
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error('Send Tender Email Error:', err);
    return new Response(JSON.stringify({ error: 'Email failed to send' }), {
      status: 500,
    });
  }
};
