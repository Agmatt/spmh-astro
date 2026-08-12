import { Resend } from 'resend';
import type { APIRoute } from 'astro';

const resend = new Resend(import.meta.env.RESEND_API_KEY);

export const post: APIRoute = async ({ request }) => {
  // Verify request is POST
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const { studentEmail, studentName, status, feedback } = await request.json();

    // Validate required fields
    if (!studentEmail || !studentName || !status) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Validate status is approve or decline
    if (!['approved', 'declined'].includes(status)) {
      return new Response(
        JSON.stringify({ error: 'Invalid status value' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const isApproved = status === 'approved';
    const subject = isApproved
      ? '🎉 Your SPMH Attachment Application Approved'
      : 'Update on Your SPMH Attachment Application';

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #1565c0 0%, #125276 100%); color: white; padding: 30px 20px; border-radius: 8px 8px 0 0; text-align: center; }
            .header h1 { margin: 0; font-size: 28px; }
            .content { background: #f9fafb; padding: 30px 20px; }
            .status { display: inline-block; padding: 8px 16px; border-radius: 20px; font-weight: bold; margin: 20px 0; }
            .status.approved { background: #d1fae5; color: #065f46; }
            .status.declined { background: #fee2e2; color: #991b1b; }
            .feedback-box { background: white; border-left: 4px solid #1565c0; padding: 15px; margin: 20px 0; border-radius: 4px; }
            .footer { background: #f3f4f6; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; background: #1565c0; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; font-weight: bold; }
            a.button:hover { background: #125276; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>SPMH Academics & Internships</h1>
              <p>Application Status Update</p>
            </div>
            
            <div class="content">
              <p>Hello <strong>${studentName}</strong>,</p>
              
              <p>We are pleased to inform you about the status of your attachment application:</p>
              
              <div style="text-align: center;">
                <span class="status ${isApproved ? 'approved' : 'declined'}">
                  ${isApproved ? '✓ APPROVED' : '✗ DECLINED'}
                </span>
              </div>
              
              ${
                isApproved
                  ? `
                <p>Congratulations! Your attachment application has been <strong>approved</strong>.</p>
                <p>Our HR team will contact you shortly with placement details, including your confirmed start date, department assignment, and any additional requirements.</p>
              `
                  : `
                <p>Thank you for your application. Unfortunately, it has been <strong>declined</strong> at this time.</p>
                <p>Please review the feedback below. You may reapply in the future if you wish to pursue an attachment with us.</p>
              `
              }
              
              ${
                feedback
                  ? `
                <div class="feedback-box">
                  <strong>Feedback from HR:</strong>
                  <p>${feedback.replace(/\n/g, '<br>')}</p>
                </div>
              `
                  : ''
              }
              
              <p style="text-align: center;">
                <a href="${process.env.PUBLIC_SITE_URL || 'https://spmh.co.ke'}/portals/students" class="button">
                  View Your Portal
                </a>
              </p>
              
              <p>If you have any questions, please don't hesitate to contact our HR team at <a href="mailto:hr@spmh.co.ke">hr@spmh.co.ke</a>.</p>
              
              <p>Best regards,<br><strong>SPMH Human Resources & Academics Team</strong></p>
            </div>
            
            <div class="footer">
              <p>St. Paul's Mission Hospital<br>
              Homa Bay, Kenya<br>
              <a href="mailto:hr@spmh.co.ke">hr@spmh.co.ke</a> | +254 111 817447</p>
              
              <p style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #e5e7eb;">
                This is an automated message. Please do not reply directly to this email.
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Send email via Resend
    const { error } = await resend.emails.send({
      from: 'hr@spmh.co.ke',
      to: studentEmail,
      subject,
      html,
    });

    if (error) {
      console.error('Resend error:', error);
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Failed to send email',
          details: error 
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Email sent successfully' 
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('API error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Internal server error' 
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};