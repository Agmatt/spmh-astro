// src/lib/supabase-news.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_NEWS_URL;
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_NEWS_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing PUBLIC_SUPABASE_NEWS_URL or PUBLIC_SUPABASE_NEWS_ANON_KEY in environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);