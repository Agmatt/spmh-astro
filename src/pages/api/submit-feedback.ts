// src/pages/api/submit-feedback.ts
import type { APIRoute } from 'astro';
import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';

export const prerender = false;

const FeedbackSchema = z.object({
  website: z.string().max(0).optional(),
  service_point: z.string().min(1, 'Service point is required'),
  visitor_type: z.string().optional().nullable(),
  name: z.string().max(120).optional().nullable(),
  age: z.coerce.number().min(0).max(120).optional().nullable(),
  sex: z.string().optional().nullable(),
  ward_dept: z.string().max(100).optional().nullable(),
  room_bed: z.string().max(50).optional().nullable(),
  visit_date: z.string().optional().nullable(),
  phone: z.string().max(20).optional().nullable(),
  email: z.string().email().max(200).optional().nullable().or(z.literal('')),
  q1: z.enum(['Excellent', 'Good', 'Fair', 'Poor', 'N/A']),
  q2: z.enum(['Excellent', 'Good', 'Fair', 'Poor', 'N/A']),
  q3: z.enum(['Excellent', 'Good', 'Fair', 'Poor', 'N/A']),
  q4: z.enum(['Excellent', 'Good', 'Fair', 'Poor', 'N/A']),
  q5: z.enum(['Excellent', 'Good', 'Fair', 'Poor', 'N/A']),
  q6: z.enum(['Excellent', 'Good', 'Fair', 'Poor', 'N/A']),
  q7: z.enum(['Excellent', 'Good', 'Fair', 'Poor', 'N/A']),
  q8: z.enum(['Excellent', 'Good', 'Fair', 'Poor', 'N/A']),
  q9: z.enum(['Excellent', 'Good', 'Fair', 'Poor', 'N/A']),
  q10: z.enum(['Excellent', 'Good', 'Fair', 'Poor', 'N/A']),
  q11: z.enum(['Excellent', 'Good', 'Fair', 'Poor', 'N/A']),
  q12: z.enum(['Excellent', 'Good', 'Fair', 'Poor', 'N/A']),
  q13: z.enum(['Excellent', 'Good', 'Fair', 'Poor', 'N/A']),
  q14: z.enum(['Excellent', 'Good', 'Fair', 'Poor', 'N/A']),
  q15: z.enum(['Excellent', 'Good', 'Fair', 'Poor', 'N/A']),
  q16: z.enum(['Excellent', 'Good', 'Fair', 'Poor', 'N/A']),
  q17: z.enum(['Excellent', 'Good', 'Fair', 'Poor', 'N/A']),
  q18: z.enum(['Excellent', 'Good', 'Fair', 'Poor', 'N/A']),
  critical_improvement: z
    .string()
    .min(1, 'Critical improvement is required')
    .max(2000),
  comment_positive: z.string().max(2000).optional().nullable(),
  comment_improvement: z.string().max(2000).optional().nullable(),
  comment_other: z.string().max(2000).optional().nullable(),
  wants_followup: z.enum(['Yes', 'No']).optional().nullable(),
  followup_phone: z.string().max(20).optional().nullable(),
  followup_email: z
    .string()
    .email()
    .max(200)
    .optional()
    .nullable()
    .or(z.literal('')),
  consent: z.union([z.literal('true'), z.literal('on')]),
});

export const POST: APIRoute = async ({ request }) => {
  try {
    const formData = await request.formData();
    const body = Object.fromEntries(formData.entries());

    if (body.website && body.website !== '') {
      return new Response(JSON.stringify({ success: true }), { status: 200 }); // Silently reject bots
    }

    const parsedData = FeedbackSchema.safeParse(body);
    if (!parsedData.success) {
      console.error('Validation failed:', parsedData.error.format());
      return new Response(
        JSON.stringify({
          error: 'Invalid form data. Please check all required fields.',
        }),
        { status: 422 },
      );
    }

    const cleanData = Object.fromEntries(
      Object.entries(parsedData.data).map(([key, value]) => [
        key,
        value === '' ? null : value,
      ]),
    );

    // ⚠️ USE THE ISOLATED FEEDBACK VARIABLES HERE
    const supabaseUrl = import.meta.env.FEEDBACK_SUPABASE_URL;
    const supabaseServiceKey = import.meta.env
      .FEEDBACK_SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing Feedback Supabase environment variables');
      return new Response(
        JSON.stringify({ error: 'Server configuration error.' }),
        { status: 500 },
      );
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    const { error: dbError } = await supabaseAdmin
      .from('patient_feedback')
      .insert([
        {
          ...cleanData,
          consent: true,
          status: 'new',
        },
      ]);

    if (dbError) {
      console.error('Supabase Insert Error:', dbError);
      return new Response(
        JSON.stringify({ error: 'Could not save feedback to the database.' }),
        { status: 500 },
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Feedback submitted successfully',
      }),
      { status: 201 },
    );
  } catch (err) {
    console.error('Server Error:', err);
    return new Response(JSON.stringify({ error: 'Internal server error.' }), {
      status: 500,
    });
  }
};
