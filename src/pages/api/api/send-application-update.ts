// Request body:
// {
//   studentEmail: "student@email.com",
//   studentName: "Jane Doe",
//   status: "approved" | "declined",
//   feedback: "Your application has been approved..."
// }

// Implementation (using Resend):

// import { Resend } from 'resend';
// export async function post({ request }) {
//   const resend = new Resend(import.meta.env.RESEND_API_KEY);
  
//   const { studentEmail, studentName, status, feedback } = await request.json();
  
//   const subject = status === 'approved' 
//     ? '🎉 Your SPMH Attachment Application Approved'
//     : 'Update on Your SPMH Attachment Application';
  
//   const html = `
//     <h2>Hello ${studentName},</h2>
//     <p>Your attachment application has been <strong>${status}</strong>.</p>
//     ${feedback ? `<p><strong>Feedback:</strong></p><p>${feedback}</p>` : ''}
//     <p>Log in to your portal to view full details.</p>
//     <p>Best regards,<br/>SPMH HR Team</p>
//   `;
  
//   const { error } = await resend.emails.send({
//     from: 'hr@spmh.co.ke',
//     to: studentEmail,
//     subject,
//     html,
//   });
  
//   return new Response(JSON.stringify({ success: !error }), {
//     status: error ? 500 : 200,
//   });
// }



// ============================================================================
// 3. POST /api/send-welcome-email
// ============================================================================
// Sent after student account is created (before Supabase Auth confirmation email)
// Optional - Supabase Auth already sends confirmation email
//
// Implementation:
// Similar structure to above, welcome message + link to login

// ============================================================================
// Setup Checklist:
// ============================================================================
// [ ] Set up Resend account and get API key
// [ ] Add RESEND_API_KEY to environment variables (.env.local, Netlify secrets, etc.)
// [ ] Update sender domain in resend.emails.send() to match your verified domain
// [ ] Create API route files in src/pages/api/
// [ ] Test with Postman or curl
// [ ] Add error handling and logging
// [ ] Update form components to call correct endpoints

// ============================================================================
// Email Template Suggestions:
// ============================================================================
// - Use branded HTML templates with SPMH logo and colors
// - Include footer with contact info and links to portal
// - Keep emails mobile-responsive
// - Always include a plain-text fallback if possible
// - Add unsubscribe link (Resend handles this automatically for marketing emails)