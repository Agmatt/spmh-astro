/**
 * SPMH EMAIL TEMPLATES
 *
 * This file contains two email templates:
 * 1. hrEmailTemplate   — sent to HR with full application details
 * 2. applicantEmailTemplate — sent to applicant as confirmation
 *
 * Both are HTML emails with SPMH branding.
 * To update the design, edit the HTML/CSS here.
 */

// ============================================
// TEMPLATE 1: EMAIL TO HR
// ============================================

const hrEmailTemplate = ({ fullName, email, phone, position, coverLetter }) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Job Application - SPMH</title>
</head>
<body style="margin:0; padding:0; background-color:#f5f5f5; font-family: Arial, sans-serif;">

  <!-- Wrapper -->
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f5f5; padding: 40px 0;">
    <tr>
      <td align="center">

        <!-- Email Card -->
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:8px; overflow:hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">

          <!-- Header -->
          <tr>
            <td style="background-color:#7B1A2E; padding: 32px 40px; text-align:center;">
              <h1 style="color:#ffffff; margin:0; font-size:22px; font-family: Georgia, serif;">
                St. Paul's Mission Hospital
              </h1>
              <p style="color:#e8c4c4; margin:8px 0 0 0; font-size:13px; letter-spacing:1px;">
                CATHOLIC DIOCESE OF HOMA BAY
              </p>
              <div style="margin-top:16px; background-color:#860E0E; border-radius:4px; padding:8px 20px; display:inline-block;">
                <p style="color:#ffffff; margin:0; font-size:14px; font-weight:bold;">
                  NEW JOB APPLICATION RECEIVED
                </p>
              </div>
            </td>
          </tr>

          <!-- Position Banner -->
          <tr>
            <td style="background-color:#F4E8EB; padding: 16px 40px; border-left: 4px solid #7B1A2E;">
              <p style="margin:0; font-size:13px; color:#7B1A2E; font-weight:bold; text-transform:uppercase; letter-spacing:1px;">
                Position Applied For
              </p>
              <p style="margin:4px 0 0 0; font-size:18px; color:#1a1a1a; font-weight:bold;">
                ${position}
              </p>
            </td>
          </tr>

          <!-- Applicant Details -->
          <tr>
            <td style="padding: 32px 40px;">
              <h2 style="color:#7B1A2E; font-size:16px; margin:0 0 20px 0; padding-bottom:8px; border-bottom:2px solid #F4E8EB;">
                Applicant Information
              </h2>

              <!-- Name -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
                <tr>
                  <td width="140" style="color:#666666; font-size:13px; font-weight:bold; padding:8px 0;">
                    Full Name
                  </td>
                  <td style="color:#1a1a1a; font-size:14px; padding:8px 0; border-bottom:1px solid #f0f0f0;">
                    ${fullName}
                  </td>
                </tr>
              </table>

              <!-- Email -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
                <tr>
                  <td width="140" style="color:#666666; font-size:13px; font-weight:bold; padding:8px 0;">
                    Email Address
                  </td>
                  <td style="color:#1a1a1a; font-size:14px; padding:8px 0; border-bottom:1px solid #f0f0f0;">
                    <a href="mailto:${email}" style="color:#7B1A2E; text-decoration:none;">${email}</a>
                  </td>
                </tr>
              </table>

              <!-- Phone -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
                <tr>
                  <td width="140" style="color:#666666; font-size:13px; font-weight:bold; padding:8px 0;">
                    Phone Number
                  </td>
                  <td style="color:#1a1a1a; font-size:14px; padding:8px 0; border-bottom:1px solid #f0f0f0;">
                    ${phone}
                  </td>
                </tr>
              </table>

              <!-- Cover Letter -->
              <h2 style="color:#7B1A2E; font-size:16px; margin:24px 0 12px 0; padding-bottom:8px; border-bottom:2px solid #F4E8EB;">
                Cover Letter
              </h2>
              <div style="background-color:#f9f9f9; border-left:4px solid #7B1A2E; padding:16px 20px; border-radius:0 4px 4px 0;">
                <p style="color:#333333; font-size:14px; line-height:1.7; margin:0;">
                  ${coverLetter || '<em style="color:#999999;">No cover letter provided.</em>'}
                </p>
              </div>

              <!-- CV Note -->
              <p style="color:#666666; font-size:13px; margin-top:20px; font-style:italic;">
                📎 CV/Resume attached to this email if uploaded by applicant.
              </p>
            </td>
          </tr>

          <!-- Action Footer -->
          <tr>
            <td style="background-color:#f9f9f9; padding:24px 40px; border-top:1px solid #eeeeee;">
              <p style="color:#666666; font-size:12px; margin:0; text-align:center;">
                This application was submitted via the 
                <strong>SPMH Careers Portal</strong>. 
                Please respond to the applicant within 48 hours.
              </p>
              <p style="color:#999999; font-size:11px; margin:8px 0 0 0; text-align:center;">
                St. Paul's Mission Hospital · Homa Bay, Kenya · Safe Hands, Caring Hearts
              </p>
            </td>
          </tr>

        </table>
        <!-- End Email Card -->

      </td>
    </tr>
  </table>

</body>
</html>
  `;
};

// ============================================
// TEMPLATE 2: CONFIRMATION EMAIL TO APPLICANT
// ============================================

const applicantEmailTemplate = ({ fullName, position }) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Application Received - SPMH</title>
</head>
<body style="margin:0; padding:0; background-color:#f5f5f5; font-family: Arial, sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f5f5f5; padding: 40px 0;">
    <tr>
      <td align="center">

        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:8px; overflow:hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">

          <!-- Header -->
          <tr>
            <td style="background-color:#7B1A2E; padding: 32px 40px; text-align:center;">
              <h1 style="color:#ffffff; margin:0; font-size:22px; font-family: Georgia, serif;">
                St. Paul's Mission Hospital
              </h1>
              <p style="color:#e8c4c4; margin:8px 0 0 0; font-size:13px; letter-spacing:1px;">
                CATHOLIC DIOCESE OF HOMA BAY
              </p>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td style="padding: 40px 40px 24px 40px; text-align:center;">
              <div style="width:64px; height:64px; background-color:#F4E8EB; border-radius:50%; margin:0 auto 20px auto; display:flex; align-items:center; justify-content:center;">
                <span style="font-size:28px;">✅</span>
              </div>
              <h2 style="color:#1a1a1a; font-size:22px; margin:0 0 8px 0;">
                Application Received!
              </h2>
              <p style="color:#666666; font-size:15px; margin:0;">
                Thank you, <strong>${fullName}</strong>. We've received your application.
              </p>
            </td>
          </tr>

          <!-- Details -->
          <tr>
            <td style="padding: 0 40px 32px 40px;">
              <div style="background-color:#F4E8EB; border-radius:8px; padding:20px 24px; text-align:center;">
                <p style="color:#7B1A2E; font-size:13px; font-weight:bold; margin:0 0 4px 0; text-transform:uppercase; letter-spacing:1px;">
                  You Applied For
                </p>
                <p style="color:#1a1a1a; font-size:18px; font-weight:bold; margin:0;">
                  ${position}
                </p>
              </div>

              <!-- What Happens Next -->
              <h3 style="color:#7B1A2E; font-size:15px; margin:28px 0 16px 0;">
                What Happens Next?
              </h3>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding:10px 0; border-bottom:1px solid #f0f0f0;">
                    <span style="color:#7B1A2E; font-weight:bold;">1.</span>
                    <span style="color:#333333; font-size:14px; margin-left:8px;">Our HR team reviews your application</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 0; border-bottom:1px solid #f0f0f0;">
                    <span style="color:#7B1A2E; font-weight:bold;">2.</span>
                    <span style="color:#333333; font-size:14px; margin-left:8px;">Shortlisted candidates are contacted within 48 hours</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 0;">
                    <span style="color:#7B1A2E; font-weight:bold;">3.</span>
                    <span style="color:#333333; font-size:14px; margin-left:8px;">Interview scheduled if selected</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#f9f9f9; padding:24px 40px; border-top:1px solid #eeeeee; text-align:center;">
              <p style="color:#666666; font-size:13px; margin:0;">
                Questions? Contact HR at 
                <a href="mailto:agumbamats@gmail.com" style="color:#7B1A2E;">agumbamats@gmail.com</a>
              </p>
              <p style="color:#999999; font-size:11px; margin:8px 0 0 0;">
                St. Paul's Mission Hospital · Homa Bay, Kenya · Safe Hands, Caring Hearts
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
  `;
};

// Export both templates so index.js can use them
module.exports = { hrEmailTemplate, applicantEmailTemplate };
