import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  import.meta.env.PUBLIC_SUPABASE_ACADEMICS_URL,
  import.meta.env.PUBLIC_SUPABASE_ACADEMICS_ANON_KEY
);