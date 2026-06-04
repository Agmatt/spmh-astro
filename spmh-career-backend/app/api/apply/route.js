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
        { status: 400, headers: corsHeaders }, // Added headers to validation errors
      );
    }

    const fullName = formData.get('fullName')?.toString().trim();
    const email = formData.get('email')?.toString().trim().toLowerCase();
    const phone = formData.get('phone')?.toString().trim() || null;
    const position = formData.get('position')?.toString().trim();
    const coverLetter = formData.get('coverLetter')?.toString().trim() || null;
    const cvFile = formData.get('cv');

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

    // ── 3. Send emails ───────────────────────────────────────────────────────
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
    if (applicantResult.status === 'rejected')
      console.error('Applicant email failed:', applicantResult.reason);

    // ── 4. Respond with CORS allowance ───────────────────────────────────────
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
