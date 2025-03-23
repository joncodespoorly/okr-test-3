-- Insert a demo team
INSERT INTO teams (id, name, icon_type, icon_value)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Demo Team',
  'emoji',
  '👥'
);

-- Insert team members
INSERT INTO team_members (id, team_id, name)
VALUES
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'John Doe'),
  ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'Jane Smith'),
  ('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', 'Bob Johnson');

-- Insert OKRs
INSERT INTO okrs (id, team_id, title, description, progress)
VALUES
  (
    '00000000-0000-0000-0000-000000000005',
    '00000000-0000-0000-0000-000000000001',
    'Improve Customer Satisfaction',
    'Increase customer satisfaction score by implementing user feedback',
    0.7
  ),
  (
    '00000000-0000-0000-0000-000000000006',
    '00000000-0000-0000-0000-000000000001',
    'Expand Market Reach',
    'Enter new market segments and increase user base',
    0.3
  );

-- Insert weekly goals
INSERT INTO weekly_goals (id, team_id, okr_id, team_member_id, description, status)
VALUES
  (
    '00000000-0000-0000-0000-000000000007',
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000005',
    '00000000-0000-0000-0000-000000000002',
    'Conduct user interviews with top 10 customers',
    'in_progress'
  ),
  (
    '00000000-0000-0000-0000-000000000008',
    '00000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000006',
    '00000000-0000-0000-0000-000000000003',
    'Research potential market opportunities in Asia',
    'not_started'
  );

-- Insert goal comments
INSERT INTO goal_comments (goal_id, comment)
VALUES
  ('00000000-0000-0000-0000-000000000007', 'Scheduled 5 interviews for next week'),
  ('00000000-0000-0000-0000-000000000007', 'Initial feedback looks promising'); 