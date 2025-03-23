export interface Team {
  id: string;
  name: string;
  icon_type: 'emoji' | 'image';
  icon_value: string | null;
  created_at: string;
}

export interface TeamMember {
  id: string;
  team_id: string;
  name: string;
  created_at: string;
}

export interface OKR {
  id: string;
  team_id: string;
  title: string;
  description: string | null;
  progress: number;
  created_at: string;
}

export interface Goal {
  id: string;
  team_id: string;
  okr_id: string;
  team_member_id: string;
  description: string;
  status: 'not_started' | 'in_progress' | 'completed';
  created_at: string;
  comments?: Comment[];
}

export interface Comment {
  id: string;
  goal_id: string;
  comment: string;
  created_at: string;
} 