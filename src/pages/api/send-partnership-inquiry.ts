// ============================================================================
// 2. POST /api/send-partnership-inquiry
// ============================================================================
// Sends partnership inquiry email directly to HR (since no in-app notification needed)
//
Request body:
{
  institutionName: "University XYZ",
  contactPerson: "Dr. John Smith",
  contactEmail: "john@uni.edu",
  locationType: "international",
  inquiryType: "mou",
  message: "We would like to establish a long-term partnership..."
}

Implementation (using Resend):

import { Resend } from 'resend';
export async function post({ request }) {
  const resend = new Resend(import.meta.env.RESEND_API_KEY);
  
  const { institutionName, contactPerson, contactEmail, locationType, inquiryType, message } = 
    await request.json();
  
  const html = `
    <h2>New Partnership Inquiry from ${institutionName}</h2>
    <p><strong>Contact Person:</strong> ${contactPerson}</p>
    <p><strong>Email:</strong> ${contactEmail}</p>
    <p><strong>Institution Scope:</strong> ${locationType}</p>
    <p><strong>Inquiry Type:</strong> ${inquiryType}</p>
    <p><strong>Message:</strong></p>
    <p>${message}</p>
  `;
  
  const { error } = await resend.emails.send({
    from: 'noreply@spmh.co.ke',
    to: 'hr@spmh.co.ke',
    subject: `Partnership Inquiry: ${institutionName} (${locationType})`,
    html,
  });
  
  return new Response(JSON.stringify({ success: !error }), {
    status: error ? 500 : 200,
  });
}