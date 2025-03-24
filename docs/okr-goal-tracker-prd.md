# OKR and Weekly Goal Tracker - Product Requirements Document

## 1. Overview

### 1.1 Product Vision
A web-based application that helps product teams track company OKRs (Objectives and Key Results) and align weekly goals with these broader objectives. The application will provide visual progress tracking and analytics to help teams stay focused on what matters most.

### 1.2 Business Objectives
- Improve alignment between company objectives and day-to-day work
- Increase transparency in goal progress across the team
- Provide clear visualization of OKR completion status
- Enable easy weekly goal tracking and assignment

### 1.3 Target Users
- Product managers and business analysts (team of 8-14 people)
- No authentication required - based on team trust
- Focus on desktop experience with responsive design

## 2. Key Features and Requirements

### 2.1 Company OKR Management
- **Set and Edit Company OKRs**
  - Create, view, and edit company-level OKRs
  - Each OKR has a title and description
  - Acceptance Criteria:
    - Users can add new OKRs with a title and description
    - Users can edit existing OKRs
    - OKRs display in a clean card layout in the main dashboard

- **OKR Progress Tracking**
  - Track progress of each OKR on a scale of 0-1 (0-100%)
  - Visual slider with percentage representation
  - Color-coded progress indicators:
    - Red (0-30%)
    - Amber (31-70%)
    - Green (71-100%)
  - Acceptance Criteria:
    - Slider control allows smooth adjustment of progress
    - Percentage is displayed numerically
    - Color changes automatically based on progress thresholds
    - Progress updates are saved in real-time

### 2.2 Team Management
- **Team Member Management**
  - Add and remove team members
  - Acceptance Criteria:
    - Users can add new team members with a name
    - Users can remove existing team members
    - Team members appear in the assignment dropdown for weekly goals

### 2.3 Weekly Goal Management
- **Create and Assign Goals**
  - Add weekly goals with descriptions
  - Assign goals to team members
  - Link goals to specific OKRs
  - Acceptance Criteria:
    - Users can create new weekly goals with a description
    - Goals can be assigned to team members via dropdown
    - Goals can be linked to OKRs via dropdown
    - Clear visual representation of assignments

- **Goal Status Tracking**
  - Mark goals as Not Started, In Progress, or Completed
  - Status updates reflect in real-time
  - Acceptance Criteria:
    - Goals can be marked with appropriate status
    - Status changes are visually indicated with colors
    - Status updates sync across all views

### 2.4 Analytics and Reporting
- **Dashboard Views**
  - Dashboard 1: Team Members by OKR
    - Bar chart showing distribution of team members across OKRs
    - Acceptance Criteria:
      - Chart updates dynamically with assignments
      - Clear visual representation of member distribution

  - Dashboard 2: Goals by OKR
    - Bar chart showing goals per OKR with status breakdown
    - Acceptance Criteria:
      - Chart shows distribution of goals
      - Status colors match goal status indicators

  - Dashboard 3: Goal Status Overview
    - Pie chart showing goal status distribution
    - Acceptance Criteria:
      - Chart shows percentage breakdown by status
      - Updates in real-time with status changes

## 3. Technical Specifications

### 3.1 Platform
- Web application built with Next.js 14
- Responsive design optimized for desktop
- Dark mode UI with modern aesthetics
- Real-time updates using Supabase

### 3.2 Tech Stack Implementation
- **Frontend**:
  - Next.js with TypeScript
  - Tailwind CSS for styling
  - Shadcn/ui components
  - Recharts for visualizations
  - React Context for state management

- **Backend**:
  - Supabase for PostgreSQL database
  - Supabase Realtime for live updates
  - Row Level Security for data protection

### 3.3 Data Model

#### 3.3.1 Teams Table
```
teams
- id (uuid, primary key)
- name (text, not null)
- icon_type (text, either 'emoji' or 'image')
- icon_value (text, emoji character or image URL)
- created_at (timestamp with time zone, default: now())
```

#### 3.3.2 Team Members Table
```
team_members
- id (uuid, primary key)
- team_id (uuid, foreign key to teams.id)
- name (text, not null)
- created_at (timestamp with time zone, default: now())
```

#### 3.3.3 OKRs Table
```
okrs
- id (uuid, primary key)
- team_id (uuid, foreign key to teams.id)
- title (text, not null)
- description (text)
- progress (decimal, default: 0, range: 0-1)
- created_at (timestamp with time zone, default: now())
```

#### 3.3.4 Weekly Goals Table
```
weekly_goals
- id (uuid, primary key)
- team_id (uuid, foreign key to teams.id)
- okr_id (uuid, foreign key to okrs.id)
- team_member_id (uuid, foreign key to team_members.id)
- description (text, not null)
- status (text, one of: 'not_started', 'in_progress', 'completed', default: 'not_started')
- created_at (timestamp with time zone, default: now())
```

#### 3.3.5 Goal Comments Table
```
goal_comments
- id (uuid, primary key)
- goal_id (uuid, foreign key to weekly_goals.id)
- comment (text, not null)
- created_at (timestamp with time zone, default: now())
```

### 3.4 API Endpoints (via Supabase)

- Teams
  - GET, POST, PUT, DELETE /teams
  - GET /teams/{id}
  - PUT /teams/{id}

- Team Members
  - GET, POST /teams/{team_id}/members
  - GET /team_members/{id}
  - PUT, DELETE /team_members/{id}

- OKRs
  - GET, POST /teams/{team_id}/okrs
  - GET /okrs/{id}
  - PUT, DELETE /okrs/{id}

- Weekly Goals
  - GET, POST /teams/{team_id}/goals
  - GET /goals/{id}
  - PUT, DELETE /goals/{id}
  - GET /goals/by_okr/{okr_id}
  - GET /goals/by_member/{member_id}

- Goal Comments
  - GET, POST /goals/{goal_id}/comments
  - DELETE /comments/{id}

## 4. User Interface

### 4.1 Layout

Based on the provided wireframe, the application will have the following structure:

- **Header Section**
  - Team name and icon
  - Application title

- **Team Members Panel (Left Sidebar)**
  - List of all team members
  - Option to add/edit team members

- **OKRs Panel (Top Right Section)**
  - List of OKRs with titles
  - Progress sliders for each OKR
  - Percentage display
  - Color-coded indicators based on progress

- **Weekly Goals Panel (Middle Right Section)**
  - List of weekly goals
  - Assigned team member for each goal
  - Related OKR for each goal
  - Status indicator and toggle

- **Reports Panel (Bottom Right Section)**
  - Three dashboard views:
    - Team Members by OKR
    - Goals by OKR
    - Goal Status Breakdown

### 4.2 UI/UX Guidelines

- **Color Scheme**
  - Dark mode as primary theme
  - Accent colors:
    - Progress indicators: Red (#FF4136) → Amber (#FFDC00) → Green (#2ECC40)
    - Interactive elements: Use a consistent accent color (#3D9970)
    - Error states: (#FF4136)

- **Typography**
  - Primary font: Inter or SF Pro Display (system fonts)
  - Headings: Bold, larger size
  - Body text: Regular weight, high contrast against background

- **Interactive Elements**
  - Sliders: Custom design with color transitions
  - Buttons: Clear hover and active states
  - Dropdowns: Simple, readable options

- **Accessibility Considerations**
  - Sufficient contrast ratios
  - Semantic HTML elements
  - Keyboard navigation support

## 5. Implementation Plan

### 5.1 Development Phases

#### Phase 1: Foundation (Week 1-2)
- Set up project and tech stack
- Implement basic UI structure
- Create database schema in Supabase
- Implement basic CRUD operations for teams and team members

#### Phase 2: Core Functionality (Week 3-4)
- Implement OKR management
- Build progress tracking with sliders
- Develop weekly goal creation and assignment
- Create linking between goals and OKRs

#### Phase 3: Enhancements (Week 5-6)
- Implement analytics dashboards
- Add commenting functionality
- Polish UI/UX
- Optimize performance

### 5.2 Testing Strategy
- Unit testing for core functions
- Integration testing for data operations
- Manual testing with team members
- Performance testing for dashboard views

## 6. Future Considerations

### 6.1 Potential Enhancements
- Authentication system if needed in the future
- Historical data tracking and archiving
- Email notifications or integrations
- Mobile responsiveness improvements
- Export functionality for reporting

### 6.2 Scalability Considerations
- The current data model should support up to 50 users without major changes
- Consider caching strategies if the application grows
- Monitor database performance as data accumulates

## 7. Technical Considerations

### 7.1 Data Management
- Regular database backups via Supabase
- Consider data retention policies for completed goals
- Implement soft deletion for important records

### 7.2 Performance Optimization
- Implement lazy loading for dashboard components
- Use efficient queries with Supabase
- Consider client-side caching for frequently accessed data

### 7.3 Browser Compatibility
- Support latest versions of Chrome, Firefox, Safari, and Edge
- Graceful degradation for older browsers
