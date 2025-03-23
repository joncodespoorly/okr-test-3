-- Create teams table
CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  icon_type TEXT CHECK (icon_type IN ('emoji', 'image')),
  icon_value TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create team members table
CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create OKRs table
CREATE TABLE okrs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  progress FLOAT NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 1),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create weekly goals table
CREATE TABLE weekly_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  okr_id UUID NOT NULL REFERENCES okrs(id) ON DELETE CASCADE,
  team_member_id UUID NOT NULL REFERENCES team_members(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('not_started', 'in_progress', 'completed')) DEFAULT 'not_started',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create goal comments table
CREATE TABLE goal_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  goal_id UUID NOT NULL REFERENCES weekly_goals(id) ON DELETE CASCADE,
  comment TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_team_members_team_id ON team_members(team_id);
CREATE INDEX idx_okrs_team_id ON okrs(team_id);
CREATE INDEX idx_weekly_goals_team_id ON weekly_goals(team_id);
CREATE INDEX idx_weekly_goals_okr_id ON weekly_goals(okr_id);
CREATE INDEX idx_weekly_goals_team_member_id ON weekly_goals(team_member_id);
CREATE INDEX idx_goal_comments_goal_id ON goal_comments(goal_id);

-- Enable Row Level Security (RLS)
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE okrs ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE goal_comments ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for teams
DROP POLICY IF EXISTS "Enable all operations for authenticated users" ON teams;
CREATE POLICY "Enable all operations for all users" ON teams
  FOR ALL TO anon
  USING (true)
  WITH CHECK (true);

-- Create RLS policies for team members
DROP POLICY IF EXISTS "Enable all operations for authenticated users" ON team_members;
CREATE POLICY "Enable all operations for all users" ON team_members
  FOR ALL TO anon
  USING (true)
  WITH CHECK (true);

-- Create RLS policies for OKRs
DROP POLICY IF EXISTS "Enable all operations for authenticated users" ON okrs;
CREATE POLICY "Enable all operations for all users" ON okrs
  FOR ALL TO anon
  USING (true)
  WITH CHECK (true);

-- Create RLS policies for weekly goals
DROP POLICY IF EXISTS "Enable all operations for authenticated users" ON weekly_goals;
CREATE POLICY "Enable all operations for all users" ON weekly_goals
  FOR ALL TO anon
  USING (true)
  WITH CHECK (true);

-- Create RLS policies for goal comments
DROP POLICY IF EXISTS "Enable all operations for authenticated users" ON goal_comments;
CREATE POLICY "Enable all operations for all users" ON goal_comments
  FOR ALL TO anon
  USING (true)
  WITH CHECK (true); 