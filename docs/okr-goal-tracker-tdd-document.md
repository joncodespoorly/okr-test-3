# OKR and Weekly Goal Tracker - Technical Design Document

## System Architecture

- **Application Type**: Next.js single-page application
- **Framework**: Next.js 14 with App Router
- **Database**: Supabase PostgreSQL
- **Real-time Updates**: Supabase Realtime
- **Hosting**: Vercel

## Component Architecture

### Core Components

```typescript
// Layout Components
Layout                    // Root layout with providers
MainContent              // Main content wrapper

// Feature Components
OKRPanel                 // OKR management section
WeeklyGoalsPanel         // Weekly goals section
ReportsPanel             // Analytics dashboard

// Shared Components
Slider                   // Progress slider with color states
StatusBadge             // Status indicator with colors
ModalForm               // Reusable modal form
```

### State Management

- **React Context**
  - TeamContext: Team member management
  - OKRContext: OKR state and operations
  - GoalContext: Weekly goals state

- **Local State**
  - Component-specific UI states
  - Form states with React Hook Form
  - Modal visibility states

### Data Flow

- **Client → Server**
  - Direct Supabase operations
  - Optimistic updates for better UX
  - Error handling with toast notifications

- **Server → Client**
  - Initial data load with React Query
  - Real-time updates via Supabase subscriptions
  - Automatic UI updates on data changes

## Technical Stack

### Frontend
- Next.js 14
- TypeScript
- Tailwind CSS
- Shadcn/ui components
- Recharts for visualizations
- React Hook Form
- Zod for validation
- Sonner for toasts

### Backend
- Supabase
  - PostgreSQL database
  - Row Level Security
  - Realtime subscriptions

## Database Schema

```sql
-- Teams table
CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
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
  okr_id UUID NOT NULL REFERENCES okrs(id) ON DELETE CASCADE,
  team_member_id UUID NOT NULL REFERENCES team_members(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('not_started', 'in_progress', 'completed')) DEFAULT 'not_started',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

## API Implementation

```typescript
// Supabase API functions
const api = {
  // Team operations
  getTeam: () => supabase.from('teams').select('*').single(),
  
  // Team member operations
  getTeamMembers: () => supabase.from('team_members').select('*'),
  addTeamMember: (name: string) => supabase.from('team_members').insert({ name }),
  deleteTeamMember: (id: string) => supabase.from('team_members').delete().eq('id', id),
  
  // OKR operations
  getOkrs: () => supabase.from('okrs').select('*'),
  addOkr: (data: OkrInput) => supabase.from('okrs').insert(data),
  updateOkr: (id: string, data: Partial<OkrInput>) => 
    supabase.from('okrs').update(data).eq('id', id),
  deleteOkr: (id: string) => supabase.from('okrs').delete().eq('id', id),
  
  // Weekly goal operations
  getGoals: () => supabase.from('weekly_goals')
    .select(`*, team_members(*), okrs(*)`),
  addGoal: (data: GoalInput) => supabase.from('weekly_goals').insert(data),
  updateGoal: (id: string, data: Partial<GoalInput>) =>
    supabase.from('weekly_goals').update(data).eq('id', id),
  deleteGoal: (id: string) => supabase.from('weekly_goals').delete().eq('id', id)
};
```

## Type Definitions

```typescript
// Core types
interface Team {
  id: string;
  name: string;
  created_at: string;
}

interface TeamMember {
  id: string;
  team_id: string;
  name: string;
  created_at: string;
}

interface OKR {
  id: string;
  team_id: string;
  title: string;
  description?: string;
  progress: number;
  created_at: string;
}

interface WeeklyGoal {
  id: string;
  team_id: string;
  okr_id: string;
  team_member_id: string;
  description: string;
  status: 'not_started' | 'in_progress' | 'completed';
  created_at: string;
  team_members?: TeamMember;
  okrs?: OKR;
}

// Input types
interface OkrInput {
  title: string;
  description?: string;
  progress?: number;
}

interface GoalInput {
  description: string;
  team_member_id: string;
  okr_id: string;
  status?: 'not_started' | 'in_progress' | 'completed';
}
```

## Real-time Implementation

```typescript
// Supabase real-time subscriptions
const setupRealtimeSubscriptions = () => {
  // OKR changes
  supabase
    .channel('okr-changes')
    .on('postgres_changes', { 
      event: '*', 
      schema: 'public', 
      table: 'okrs' 
    }, handleOkrChange)
    .subscribe();

  // Goal changes
  supabase
    .channel('goal-changes')
    .on('postgres_changes', { 
      event: '*', 
      schema: 'public', 
      table: 'weekly_goals' 
    }, handleGoalChange)
    .subscribe();

  // Team member changes
  supabase
    .channel('member-changes')
    .on('postgres_changes', { 
      event: '*', 
      schema: 'public', 
      table: 'team_members' 
    }, handleTeamMemberChange)
    .subscribe();
};
```

## Error Handling

```typescript
// Error handling utilities
const handleError = (error: Error) => {
  console.error(error);
  toast.error('An error occurred. Please try again.');
};

// API wrapper with error handling
const apiWrapper = async <T>(
  operation: () => Promise<T>
): Promise<T | null> => {
  try {
    const result = await operation();
    return result;
  } catch (error) {
    handleError(error as Error);
    return null;
  }
};
```

## Performance Optimizations

- React Query for data caching
- Optimistic updates for better UX
- Debounced progress updates
- Memoized components where beneficial
- Efficient real-time subscription management

## Security Considerations

- Row Level Security policies
- Input validation with Zod
- XSS prevention with proper escaping
- CORS configuration
- Rate limiting on API endpoints

## Testing Strategy

- Jest for unit testing
- React Testing Library for component tests
- Integration tests for critical flows
- E2E testing with Playwright
- Real-time testing utilities
