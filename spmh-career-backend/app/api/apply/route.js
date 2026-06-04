import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

// ── CORS Headers Configuration ───────────────────────────────────────────────
const corsHeaders = {
  'Access-Control-Allow-Origin': '*', // Allows your frontend to communicate safely
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// ── Clients (initialised per request — safe in serverless) ───────────────────
function getSupabase() {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Missing Supabase environment variables');
  }
  return createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
}

function getResend() {
  if (!process.env.RESEND_API_KEY) {
    throw new Error('Missing RESEND_API_KEY');
  }
  return new Resend(process.env.RESEND_API_KEY);
}

// ── Email templates ───────────────────────────────────────────────────────────
function hrEmailHtml({ fullName, email, phone, position, coverLetter, cvUrl }) {
  const dateStr = new Date().toLocaleDateString('en-KE', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  return `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f0f0f0;font-family:Arial,sans-serif;">
  <div style="max-width:600px;margin:24px auto;background:white;border-radius:10px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.1);">
    <div style="background:#7B1A2E;padding:24px 28px;text-align:center;">
      <h1 style="color:white;margin:0;font-size:20px;letter-spacing:0.4px;">St. Paul's Mission Hospital</h1>
      <p style="color:#f2c0c0;margin:6px 0 0;font-size:13px;">New Job Application — HR Notification</p>
    </div>
    <div style="padding:28px;">
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        <tr style="border-bottom:1px solid #eee;">
          <td style="padding:10px 0;font-weight:bold;color:#666;width:130px;">Position</td>
          <td style="padding:10px 0;color:#111;font-weight:bold;">${position}</td>
        </tr>
        <tr style="border-bottom:1px solid #eee;">
          <td style="padding:10px 0;font-weight:bold;color:#666;">Full Name</td>
          <td style="padding:10px 0;color:#111;">${fullName}</td>
        </tr>
        <tr style="border-bottom:1px solid #eee;">
          <td style="padding:10px 0;font-weight:bold;color:#666;">Email</td>
          <td style="padding:10px 0;"><a href="mailto:${email}" style="color:#7B1A2E;">${email}</a></td>
        </tr>
        <tr style="border-bottom:1px solid #eee;">
          <td style="padding:10px 0;font-weight:bold;color:#666;">Phone</td>
          <td style="padding:10px 0;color:#111;">${phone || '—'}</td>
        </tr>
        ${
          cvUrl
            ? `
        <tr style="border-bottom:1px solid #eee;">
          <td style="padding:10px 0;font-weight:bold;color:#666;">CV / Resume</td>
          <td style="padding:10px 0;">
            <a href="${cvUrl}" style="background:#7B1A2E;color:white;padding:6px 14px;text-decoration:none;border-radius:5px;font-size:13px;">Download CV</a>
          </td>
        </tr>`
            : ''
        }
        <tr>
          <td style="padding:10px 0;font-weight:bold;color:#666;">Applied On</td>
          <td style="padding:10px 0;color:#111;">${dateStr}</td>
        </tr>
      </table>
      ${
        coverLetter
          ? `
      <div style="margin-top:20px;padding:16px;background:#fdf6f7;border-left:4px solid #7B1A2E;border-radius:4px;">
        <p style="margin:0 0 8px;font-weight:bold;color:#555;font-size:13px;">Cover Letter</p>
        <p style="margin:0;color:#333;font-size:14px;line-height:1.7;">${coverLetter.replace(/\n/g, '<br>')}</p>
      </div>`
          : ''
      }
    </div>
    <div style="background:#7B1A2E;padding:14px;text-align:center;">
      <p style="color:#f2c0c0;margin:0;font-size:11px;">Safe Hands, Caring Hearts · St. Paul's Mission Hospital, Homa Bay, Kenya</p>
    </div>
  </div>
</body>
</html>`;
}

function applicantEmailHtml({ fullName, position }) {
  const dateStr = new Date().toLocaleDateString('en-KE', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  return `<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f0f0f0;font-family:Arial,sans-serif;">
  <div style="max-width:600px;margin:24px auto;background:white;border-radius:10px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,0.1);">
    <div style="background:#7B1A2E;padding:24px 28px;text-align:center;">
      <h1 style="color:white;margin:0;font-size:20px;letter-spacing:0.4px;">St. Paul's Mission Hospital</h1>
      <p style="color:#f2c0c0;margin:6px 0 0;font-size:13px;">Safe Hands, Caring Hearts</p>
    </div>
    <div style="padding:28px;">
      <p style="color:#333;font-size:15px;margin-top:0;">Dear <strong>${fullName}</strong>,</p>
      <p style="color:#444;line-height:1.7;font-size:14px;">
        Thank you for your interest in joining the team at <strong>St. Paul's Mission Hospital</strong>.
        We have successfully received your application for:
      </p>
      <div style="background:#fdf6f7;border:2px solid #7B1A2E;border-radius:8px;padding:18px;text-align:center;margin:20px 0;">
        <p style="margin:0;font-size:18px;font-weight:bold;color:#7B1A2E;">${position}</p>
        <p style="margin:8px 0 0;font-size:13px;color:#888;">Submitted: ${dateStr}</p>
      </div>
      <p style="color:#444;line-height:1.7;font-size:14px;">
        Our HR team will carefully review your application and reach out within
        <strong>7–14 working days</strong>. Only shortlisted candidates will be contacted for interview.
      </p>
      <p style="color:#444;line-height:1.7;font-size:14px;">
        If you have any questions, please contact our HR department directly.
      </p>
      <p style="color:#444;font-size:14px;margin-bottom:4px;">Warm regards,</p>
      <p style="color:#333;font-size:14px;margin-top:4px;">
        <strong>Human Resources Department</strong><br>
        St. Paul's Mission Hospital<br>
        Homa Bay, Kenya
      </p>
    </div>
    <div style="background:#7B1A2E;padding:14px;text-align:center;">
      <p style="color:#f2c0c0;margin:0;font-size:11px;">Safe Hands, Caring Hearts · St. Paul's Mission Hospital, Homa Bay, Kenya</p>
    </div>
  </div>
</body>
</html>`;
}

// ── Validation helpers ────────────────────────────────────────────────────────
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ── OPTIONS — preflight handling ───────────────────────────────────────────────
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}

// ── POST /api/apply ───────────────────────────────────────────────────────────
export async function POST(request) {
  try {
    const supabase = getSupabase();
    const resend = getResend();

    // ── Parse multipart form data ────────────────────────────────────────────
    let formData;
    try {
      formData = await request.formData();
    } catch {
      return Response.json(
        { error: 'Invalid form data.' },
        { status: 400, headers: corsHeaders },
      );
    }

    const fullName = formData.get('fullName')?.toString().trim();
    const email = formData.get('email')?.toString().trim().toLowerCase();
    const phone = formData.get('phone')?.toString().trim() || null;
    const position = formData.get('position')?.toString().trim();
    const coverLetter = formData.get('coverLetter')?.toString().trim() || null;
    const cvFile = formData.get('cv'); // File | null

    // ── Validation ───────────────────────────────────────────────────────────
    if (!fullName || !email || !position) {
      return Response.json(
        { error: 'Full name, email, and position are required.' },
        { status: 400, headers: corsHeaders },
      );
    }
    if (!isValidEmail(email)) {
      return Response.json(
        { error: 'Please provide a valid email address.' },
        { status: 400, headers: corsHeaders },
      );
    }
    if (cvFile && cvFile.size > 5 * 1024 * 1024) {
      return Response.json(
        { error: 'CV file too large. Maximum size is 5MB.' },
        { status: 400, headers: corsHeaders },
      );
    }

    // ── 1. Upload CV to Supabase Storage ─────────────────────────────────────
    let cvUrl = null;

    if (cvFile && cvFile.size > 0) {
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ];
      if (!allowedTypes.includes(cvFile.type)) {
        return Response.json(
          {
            error:
              'Only PDF and Word documents are accepted (.pdf, .doc, .docx).',
          },
          { status: 400, headers: corsHeaders },
        );
      }

      const buffer = Buffer.from(await cvFile.arrayBuffer());
      const safeName = cvFile.name.replace(/[^a-zA-Z0-9.\-_]/g, '-');
      const fileName = `${Date.now()}-${safeName}`;

      const { error: storageError } = await supabase.storage
        .from('cvs')
        .upload(fileName, buffer, {
          contentType: cvFile.type,
          upsert: false,
        });

      if (storageError) {
        console.error('Supabase storage error:', storageError);
        return Response.json(
          { error: 'Failed to upload CV. Please try again.' },
          { status: 500, headers: corsHeaders },
        );
      }

      const { data: urlData } = supabase.storage
        .from('cvs')
        .getPublicUrl(fileName);
      cvUrl = urlData.publicUrl;
    }

    // ── 2. Save application to database ──────────────────────────────────────
    const { data: application, error: dbError } = await supabase
      .from('applications')
      .insert([
        {
          full_name: fullName,
          email,
          phone,
          position,
          cover_letter: coverLetter,
          cv_url: cvUrl,
          status: 'pending',
          applied_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (dbError) {
      console.error('Supabase DB error:', dbError);
      return Response.json(
        { error: 'Failed to save application. Please try again.' },
        { status: 500, headers: corsHeaders },
      );
    }

    console.log(
      `✓ Application saved: ${application.id} — ${position} / ${fullName}`,
    );

    // ── 3. Send emails (non-blocking — never fail the request over email) ────
    const emailPayload = {
      fullName,
      email,
      phone,
      position,
      coverLetter,
      cvUrl,
    };

    const [hrResult, applicantResult] = await Promise.allSettled([
      resend.emails.send({
        from: 'SPMH Careers <onboarding@resend.dev>',
        to: process.env.HR_EMAIL,
        subject: `New Application: ${position} — ${fullName}`,
        html: hrEmailHtml(emailPayload),
      }),
      resend.emails.send({
        from: 'SPMH Careers <onboarding@resend.dev>',
        to: email,
        subject: `Application Received — ${position} at St. Paul's Mission Hospital`,
        html: applicantEmailHtml(emailPayload),
      }),
    ]);

    if (hrResult.status === 'rejected')
      console.error('HR email failed:', hrResult.reason);
    else console.log(`✓ HR email sent: ${hrResult.value?.data?.id}`);

    if (applicantResult.status === 'rejected')
      console.error('Applicant email failed:', applicantResult.reason);
    else
      console.log(
        `✓ Applicant confirmation sent: ${applicantResult.value?.data?.id}`,
      );

    // ── 4. Respond with CORS headers ───────────────────────────────────────────
    return Response.json(
      {
        success: true,
        message: 'Application submitted successfully.',
        id: application.id,
      },
      {
        status: 200,
        headers: corsHeaders,
      },
    );
  } catch (err) {
    console.error('Unhandled error in POST /api/apply:', err);
    return Response.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500, headers: corsHeaders },
    );
  }
}
