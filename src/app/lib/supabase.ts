import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Type definitions for our database tables
export type Team = {
  id: string;
  name: string;
  icon_type: 'emoji' | 'image';
  icon_value: string | null;
  created_at: string;
};

export type TeamMember = {
  id: string;
  team_id: string;
  name: string;
  created_at: string;
};

export type OKR = {
  id: string;
  team_id: string;
  title: string;
  description: string | null;
  progress: number;
  created_at: string;
};

export type WeeklyGoal = {
  id: string;
  team_id: string;
  okr_id: string;
  team_member_id: string;
  description: string;
  status: 'not_started' | 'in_progress' | 'completed';
  created_at: string;
  team_member?: TeamMember;
  okr?: OKR;
};

export type GoalComment = {
  id: string;
  goal_id: string;
  comment: string;
  created_at: string;
}; 