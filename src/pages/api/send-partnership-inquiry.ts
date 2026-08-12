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
    const {
      institutionName,
      contactPerson,
      contactEmail,
      locationType,
      inquiryType,
      message,
    } = await request.json();

    // Validate required fields
    if (
      !institutionName ||
      !contactPerson ||
      !contactEmail ||
      !locationType ||
      !inquiryType ||
      !message
    ) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const inquiryTypeLabels: Record<string, string> = {
      student_attachment: 'Student Attachment Pipeline',
      research: 'Research Collaboration',
      cme: 'Continuing Medical Education / Faculty Exchange',
      mou: 'Formal MOU / Long-Term Partnership',
      general: 'General Inquiry',
    };

    const locationTypeLabels: Record<string, string> = {
      local: 'Local (Kenya)',
      regional: 'Regional (East Africa)',
      international: 'International',
    };

    const inquiryLabel = inquiryTypeLabels[inquiryType] || inquiryType;
    const locationLabel = locationTypeLabels[locationType] || locationType;

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
            .header p { margin: 5px 0 0 0; opacity: 0.9; }
            .content { background: #f9fafb; padding: 30px 20px; }
            .info-box { background: white; border-left: 4px solid #1565c0; padding: 15px; margin: 15px 0; border-radius: 4px; }
            .info-box strong { display: block; color: #125276; margin-bottom: 5px; font-size: 12px; text-transform: uppercase; }
            .info-box p { margin: 0; }
            .message-box { background: white; border: 1px solid #e5e7eb; padding: 15px; margin: 20px 0; border-radius: 4px; }
            .message-box strong { display: block; color: #125276; margin-bottom: 10px; font-size: 12px; text-transform: uppercase; }
            .message-box p { margin: 0; white-space: pre-wrap; word-break: break-word; }
            .footer { background: #f3f4f6; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; border-radius: 0 0 8px 8px; }
            .action-button { display: inline-block; background: #1565c0; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; font-weight: bold; }
            a.action-button:hover { background: #125276; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📧 New Partnership Inquiry</h1>
              <p>From ${institutionName}</p>
            </div>
            
            <div class="content">
              <h2 style="color: #125276; margin-top: 0;">Partnership Inquiry Details</h2>
              
              <div class="info-box">
                <strong>Institution</strong>
                <p>${institutionName}</p>
              </div>
              
              <div class="info-box">
                <strong>Contact Person</strong>
                <p>${contactPerson}</p>
              </div>
              
              <div class="info-box">
                <strong>Email Address</strong>
                <p><a href="mailto:${contactEmail}">${contactEmail}</a></p>
              </div>
              
              <div class="info-box">
                <strong>Institution Scope</strong>
                <p>${locationLabel}</p>
              </div>
              
              <div class="info-box">
                <strong>Inquiry Type</strong>
                <p>${inquiryLabel}</p>
              </div>
              
              <div class="message-box">
                <strong>Message / Proposal</strong>
                <p>${message}</p>
              </div>
              
              <p style="text-align: center;">
                <a href="mailto:${contactEmail}" class="action-button">
                  Reply to Inquiry
                </a>
              </p>
              
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
              
              <p style="font-size: 12px; color: #6b7280;">
                <strong>Next Steps:</strong><br>
                1. Review the inquiry details above<br>
                2. Click "Reply to Inquiry" to contact the institution directly<br>
                3. Or log into the Academics Manager portal to track all inquiries<br>
              </p>
            </div>
            
            <div class="footer">
              <p>St. Paul's Mission Hospital<br>
              Homa Bay, Kenya<br>
              Academic & Internships Program</p>
              
              <p style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #e5e7eb;">
                This is an automated notification. Partnership inquiries are logged in the Academics Manager portal.
              </p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Send email to HR
    const { error } = await resend.emails.send({
      from: 'noreply@spmh.co.ke',
      to: 'hr@spmh.co.ke',
      subject: `Partnership Inquiry: ${institutionName} (${locationLabel})`,
      html,
    });

    if (error) {
      console.error('Resend error:', error);
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Failed to send email',
          details: error,
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
        message: 'Partnership inquiry sent to HR successfully',
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
        error: 'Internal server error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
};