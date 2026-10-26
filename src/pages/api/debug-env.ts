import type { APIRoute } from 'astro';
export const prerender = false;

export const GET: APIRoute = async () => {
  return new Response(
    JSON.stringify(
      {
        cwd: process.cwd(),
        import_meta_feedback_url:
          import.meta.env.FEEDBACK_SUPABASE_URL || 'UNDEFINED',
        process_feedback_url: process.env.FEEDBACK_SUPABASE_URL || 'UNDEFINED',
        import_meta_key_length:
          import.meta.env.FEEDBACK_SUPABASE_SERVICE_ROLE_KEY?.length || 0,
        process_key_length:
          process.env.FEEDBACK_SUPABASE_SERVICE_ROLE_KEY?.length || 0,
        all_import_meta_feedback_keys: Object.keys(import.meta.env).filter(
          (k) => k.includes('FEEDBACK'),
        ),
        all_process_feedback_keys: Object.keys(process.env).filter((k) =>
          k.includes('FEEDBACK'),
        ),
        all_env_files_on_disk: [
          '.env',
          '.env.local',
          '.env.development',
          '.env.development.local',
          '.env.production',
          '.env.production.local',
        ],
      },
      null,
      2,
    ),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    },
  );
};
