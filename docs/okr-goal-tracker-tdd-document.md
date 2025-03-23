# OKR and Weekly Goal Tracker - Technical Design Document

## System Design

- **Application Type**: Single-page web application
- **Deployment Platform**: Vercel (for Next.js hosting)
- **Database**: Supabase PostgreSQL
- **Real-time Capabilities**: Supabase Realtime for live updates
- **Infrastructure**: Serverless functions via Vercel/Supabase Edge Functions
- **File Storage**: Supabase Storage (for team icons)
- **Monitoring**: Vercel Analytics

## Architecture Pattern

- **Frontend Architecture**: Next.js with App Router
- **Component Architecture**: Atomic design pattern
  - Atoms: Basic UI elements (buttons, inputs, sliders)
  - Molecules: Composite components (OKR card, team member item)
  - Organisms: Complex UI sections (OKR panel, Weekly Goals panel)
  - Templates: Page layouts
  - Pages: Complete views with data fetching
- **Backend Architecture**: Supabase for database, auth, and API
- **Rendering Strategy**: Client-side rendering with hydration
  - Static generation for layout components
  - Client components for interactive elements

## State Management

- **Global State**: React Context API
  - `TeamContext`: Manage team data and team members
  - `OkrContext`: Manage OKRs and progress
  - `GoalContext`: Manage weekly goals and their statuses
- **Server State**: React Query (TanStack Query)
  - Data fetching, caching, and synchronization
  - Optimistic updates for better UX
  - Background refetching for fresh data
- **Form State**: React Hook Form
  - Validation, error handling, and submission
  - Integration with Zod for schema validation
- **UI State**: Local component state
  - Toggle states, modal visibility, etc.

## Data Flow

- **Client → Server**:
  - Forms submit data via Supabase SDK
  - Mutations handled by React Query
  - Optimistic updates for instant feedback
  
- **Server → Client**:
  - Initial data load via React Query/SWR
  - Real-time updates via Supabase Realtime subscriptions
  - Cached data invalidation on updates

- **Cross-Component Communication**:
  - Context provides data to components
  - Events/callbacks for specific interactions
  - Prop drilling minimized by context usage

- **Real-time Updates**:
  - Subscribe to database changes for relevant tables
  - Update local state when remote changes occur
  - Trigger UI updates for visualization components

## Technical Stack

- **Frontend**:
  - Framework: Next.js 14+ with React 18+
  - TypeScript for type safety
  - Tailwind CSS for styling
  - Shadcn/UI for component library
  - Lucide Icons for iconography
  - Sonner for toast notifications
  - React Hook Form for form management
  - Zod for schema validation
  - Recharts for data visualization

- **Backend**:
  - Supabase for database and authentication
  - Postgres for relational data storage
  - Row-level security policies for data access control
  - Supabase Functions for serverless operations
  - Supabase Storage for file storage

- **Development Tools**:
  - ESLint for code quality
  - Prettier for code formatting
  - Husky for Git hooks
  - Jest and React Testing Library for testing
  - Storybook for component documentation

## Authentication Process

- **No Authentication Required**:
  - As specified in the PRD, the application relies on team trust
  - Open access to all team members
  - No login/signup flow needed

- **Future Authentication Considerations** (if needed later):
  - Implement Supabase Auth
  - Email/password authentication
  - Optional social provider login
  - JWT token-based session management

## Route Design

- **App Router Structure**:

```
app/
├── layout.tsx                # Main application layout
├── page.tsx                  # Dashboard page (main view)
├── loading.tsx               # Loading state
├── error.tsx                 # Error handling
├── components/               # Shared components
│   ├── ui/                   # Shadcn UI components
│   ├── teams/                # Team-related components
│   ├── okrs/                 # OKR-related components
│   ├── goals/                # Goal-related components
│   └── reports/              # Visualization components
├── lib/                      # Utilities and helpers
│   ├── utils.ts              # General utilities
│   ├── supabase.ts           # Supabase client
│   └── schemas.ts            # Zod validation schemas
├── hooks/                    # Custom React hooks
│   ├── use-team.ts           # Team data hooks
│   ├── use-okrs.ts           # OKR data hooks
│   └── use-goals.ts          # Goal data hooks
└── contexts/                 # React contexts
    ├── team-context.tsx      # Team state management
    ├── okr-context.tsx       # OKR state management
    └── goal-context.tsx      # Goal state management
```

## API Design

- **Supabase API Usage**:
  - Direct table operations via Supabase client
  - Custom RLS policies for data access control

- **Core API Functions**:

```typescript
// Team operations
const getTeam = () => supabase.from('teams').select('*').single();
const updateTeam = (data) => supabase.from('teams').update(data).match({ id: team.id });

// Team member operations
const getTeamMembers = () => supabase.from('team_members').select('*');
const addTeamMember = (data) => supabase.from('team_members').insert(data);
const updateTeamMember = (id, data) => supabase.from('team_members').update(data).match({ id });
const deleteTeamMember = (id) => supabase.from('team_members').delete().match({ id });

// OKR operations
const getOkrs = () => supabase.from('okrs').select('*');
const addOkr = (data) => supabase.from('okrs').insert(data);
const updateOkr = (id, data) => supabase.from('okrs').update(data).match({ id });
const deleteOkr = (id) => supabase.from('okrs').delete().match({ id });

// Weekly goal operations
const getGoals = () => supabase.from('weekly_goals').select('*, team_members(*), okrs(*)');
const addGoal = (data) => supabase.from('weekly_goals').insert(data);
const updateGoal = (id, data) => supabase.from('weekly_goals').update(data).match({ id });
const deleteGoal = (id) => supabase.from('weekly_goals').delete().match({ id });

// Goal comment operations
const getGoalComments = (goalId) => supabase.from('goal_comments').select('*').match({ goal_id: goalId });
const addGoalComment = (data) => supabase.from('goal_comments').insert(data);
const deleteGoalComment = (id) => supabase.from('goal_comments').delete().match({ id });
```

- **Real-time Subscriptions**:

```typescript
// Subscribe to team updates
supabase
  .channel('team-changes')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'teams' }, handleTeamChange)
  .subscribe();

// Subscribe to OKR updates
supabase
  .channel('okr-changes')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'okrs' }, handleOkrChange)
  .subscribe();

// Subscribe to goal updates
supabase
  .channel('goal-changes')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'weekly_goals' }, handleGoalChange)
  .subscribe();
```

## Database Design ERD

**Entity Relationship Diagram**

```
+---------------+       +------------------+       +-------------+
|    teams      |       |   team_members   |       |    okrs     |
+---------------+       +------------------+       +-------------+
| id (PK)       |       | id (PK)          |       | id (PK)     |
| name          |       | team_id (FK)     |----->| team_id (FK)|
| icon_type     |       | name             |       | title       |
| icon_value    |<------|                  |       | description |
| created_at    |       | created_at       |       | progress    |
+---------------+       +------------------+       | created_at  |
                                |                  +-------------+
                                |                        |
                                |                        |
                                v                        v
                        +------------------+       +-------------+
                        |   weekly_goals   |       |goal_comments|
                        +------------------+       +-------------+
                        | id (PK)          |       | id (PK)     |
                        | team_id (FK)     |       | goal_id (FK)|
                        | okr_id (FK)      |<------| comment     |
                        | team_member_id(FK)|       | created_at |
                        | description      |       +-------------+
                        | status           |
                        | created_at       |
                        +------------------+
```

**Database Schema**

```sql
-- Teams table
CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  icon_type TEXT NOT NULL CHECK (icon_type IN ('emoji', 'image')),
  icon_value TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Team members table
CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- OKRs table
CREATE TABLE okrs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  progress DECIMAL DEFAULT 0 CHECK (progress >= 0 AND progress <= 1),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Weekly goals table
CREATE TABLE weekly_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  okr_id UUID REFERENCES okrs(id) ON DELETE SET NULL,
  team_member_id UUID REFERENCES team_members(id) ON DELETE SET NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('not_started', 'in_progress', 'completed')) DEFAULT 'not_started',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Goal comments table
CREATE TABLE goal_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  goal_id UUID NOT NULL REFERENCES weekly_goals(id) ON DELETE CASCADE,
  comment TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

## Potential Challenges and Solutions

### 1. Real-time Data Synchronization

**Challenge**: Ensuring consistent state across all components when data changes.

**Solution**:
- Implement React Query's cache invalidation strategy
- Set up proper Supabase real-time subscriptions
- Use optimistic updates for immediate feedback
- Handle edge cases like conflicting updates

### 2. Component Reusability

**Challenge**: Creating reusable components that can adapt to different contexts.

**Solution**:
- Implement the atomic design pattern
- Create composable components with clear interfaces
- Use TypeScript for strong typing and autocompletion
- Document components with comments and potentially Storybook

### 3. Complex UI Interactions

**Challenge**: Implementing the progress sliders and status toggles with proper visual feedback.

**Solution**:
- Leverage Shadcn UI components as a foundation
- Custom styling with Tailwind for color transitions
- Implement proper state management for interactive elements
- Use React's useTransition for smoother UX during updates

### 4. Data Visualization Performance

**Challenge**: Rendering and updating charts efficiently when data changes.

**Solution**:
- Use memoization to prevent unnecessary re-renders
- Implement loading states for visualization components
- Consider windowing techniques for large datasets
- Optimize Recharts configurations for performance

### 5. Data Relationships Integrity

**Challenge**: Maintaining referential integrity when deleting related entities.

**Solution**:
- Implement cascading deletes at the database level
- Add confirmation dialogs for destructive actions
- Consider soft deletes for important records
- Handle orphaned records gracefully in the UI

### 6. Future Scaling

**Challenge**: Supporting larger teams and more data over time.

**Solution**:
- Implement pagination for data fetching
- Use indices for frequently queried columns
- Consider data archiving strategies for old/completed items
- Optimize database queries for performance

### 7. Dark Mode Implementation

**Challenge**: Consistent dark mode styling across all components.

**Solution**:
- Leverage Tailwind's dark mode utilities
- Ensure proper contrast ratios for accessibility
- Test color combinations for readability
- Create consistent color variable system
