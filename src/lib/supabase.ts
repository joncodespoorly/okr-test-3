import { createClient } from '@supabase/supabase-js';

// Default values for build time - these will be overridden by environment variables in production
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://niamiwnqcnqetrfuzqbr.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5pYW1pd25xY25xZXRyZnV6cWJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI3NDc1MjUsImV4cCI6MjA1ODMyMzUyNX0.4jv9FqvgQxUbwh66vCZB3yQ_QmfnTZHt9Ii0ffdJbIU';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.warn('Using default Supabase credentials. Make sure to set the correct environment variables in production.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type OKR = {
  id: string;
  team_id: string;
  title: string;
  description: string | null;
  progress: number;
  created_at: string;
}; 