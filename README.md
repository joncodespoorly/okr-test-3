# OKR Goal Tracker

A modern web application for tracking Objectives and Key Results (OKRs) and team goals. Built with Next.js, TypeScript, Tailwind CSS, and Supabase.

## Features

- **OKR Management**
  - Create and manage OKRs with progress tracking
  - Visual progress indicators
  - Real-time updates

- **Team Goals**
  - Create weekly goals linked to OKRs
  - Assign goals to team members
  - Track goal status (Not Started, In Progress, Completed)
  - Add comments and updates to goals

- **Team Management**
  - Manage team members
  - Track member contributions and assignments

- **Analytics & Reporting**
  - Visual charts and graphs for OKR progress
  - Goal status breakdown
  - Team member participation metrics

## Tech Stack

- **Frontend**
  - Next.js 15
  - React 19
  - TypeScript
  - Tailwind CSS
  - Recharts for data visualization
  - Radix UI components

- **Backend**
  - Supabase (PostgreSQL)
  - Real-time subscriptions
  - Row Level Security

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd okr-test-3
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory with the following variables:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run database migrations:
```bash
cd supabase
supabase migration up
```

5. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Project Structure

```
src/
├── app/              # Next.js app directory
├── components/       # Reusable UI components
├── contexts/         # React context providers
├── lib/             # Utility functions and configurations
└── types/           # TypeScript type definitions

supabase/
├── migrations/      # Database migrations
└── seed.sql        # Seed data
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 