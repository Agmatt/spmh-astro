import { createClient } from '@supabase/supabase-js';

// Server-side constants (Safe here because this file never touches the browser!)
const SERVER_URL = 'https://tzliykelldkbweogledq.supabase.co';
const SERVER_SERVICE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR6bGl5a2VsbGRrYndlb2dsZWRxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjU3MjU4NSwiZXhwIjoyMDk4MTQ4NTg1fQ.ZlG1mu6MFqnHiCplaltLYfkdB1YW0gMjoVdftq5PeE0';
const SERVER_PASSPHRASE = 'spmh@admin26';

export const POST = async ({ request }) => {
  try {
    // Initialize the high-privilege client securely on the backend
    const supabase = createClient(SERVER_URL, SERVER_SERVICE_KEY);

    const body = await request.json();
    const {
      action,
      id,
      title,
      department,
      experience,
      description,
      is_active,
      secret,
    } = body;

    // Check passphrase matching
    if (secret !== SERVER_PASSPHRASE) {
      console.error(
        `❌ [API SECURITY]: Blocked access attempt with secret: "${secret}"`,
      );
      return new Response(
        JSON.stringify({ error: 'Unauthorized access attempt.' }),
        { status: 401 },
      );
    }

    // Process SQL Mutations directly bypassing RLS safely via service role
    if (action === 'insert') {
      const { error } = await supabase
        .from('jobs')
        .insert([
          { id, title, department, experience, description, is_active: true },
        ]);
      if (error) throw error;
    } else if (action === 'toggle') {
      const { error } = await supabase
        .from('jobs')
        .update({ is_active })
        .eq('id', id);
      if (error) throw error;
    } else if (action === 'delete') {
      const { error } = await supabase.from('jobs').delete().eq('id', id);
      if (error) throw error;
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error('❌ [DATABASE EXCEPTION]:', err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
};
