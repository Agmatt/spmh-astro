// src/pages/api/comments.ts
// API endpoint for submitting comments
// Stores comments in Supabase comments table with is_approved = false initially

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.PUBLIC_SUPABASE_URL,
  import.meta.env.SUPABASE_SERVICE_ROLE_KEY // Use service role for server-side operations
);

export async function POST({ request }: any) {
  // Only accept POST requests
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  try {
    const body = await request.json();
    const { name, email, comment, contentId } = body;

    // Validation
    if (!name || !email || !comment || !contentId) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(JSON.stringify({ error: 'Invalid email address' }), { status: 400 });
    }

    // Insert comment into Supabase (is_approved = false by default)
    const { data, error } = await supabase
      .from('comments')
      .insert([
        {
          content_id: contentId,
          name: name.trim(),
          email: email.trim(),
          body: comment.trim(),
          is_approved: false, // Require moderation
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return new Response(JSON.stringify({ error: 'Failed to save comment' }), { status: 500 });
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Comment submitted for moderation',
        data,
      }),
      { status: 201 }
    );
  } catch (err: any) {
    console.error('API error:', err);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
}