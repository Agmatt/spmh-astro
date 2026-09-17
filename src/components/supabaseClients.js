import { createClient } from '@supabase/supabase-js';

// Create clients ONCE at module level - shared across all components
export const applicationsSupabase = createClient(
  'https://tzliykelldkbweogledq.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR6bGl5a2VsbGRrYndlb2dsZWRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI1NzI1ODUsImV4cCI6MjA5ODE0ODU4NX0.JKWYiiH2lXrg0snuOzxaRwFQgrhzAQ_LU9_7N-e8_VQ',
);

export const partnershipsSupabase = createClient(
  'https://zzlngxryoalajdpsbpnn.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6bG5neHJ5b2FsYWpkcHNicG5uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI2MDk3NjYsImV4cCI6MjA5ODE4NTc2Nn0.NN2MqqqOITkizXpMw1qrAwbb4GYIySa7jsIcWnmP-Ag',
);

// Volunteers uses partnerships by default
export const volunteersSupabase = partnershipsSupabase;
