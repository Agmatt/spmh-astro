// src/lib/supabase-admin.ts
import { createClient } from '@supabase/supabase-js';

if (!import.meta.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('🚨 MISSING SUPABASE_SERVICE_ROLE_KEY IN .env FILE! 🚨');
}

// No fallback. It must use the service role key to bypass RLS.
export const supabaseAdmin = createClient(
  import.meta.env.PUBLIC_SUPABASE_URL,
  import.meta.env.SUPABASE_SERVICE_ROLE_KEY,
);
