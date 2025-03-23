'use client';

import React from 'react';
import { TeamMemberList } from './components/teams/team-member-list';
import { OKRList } from './components/okrs/okr-list';
import { GoalList } from './components/goals/goal-list';
import { Reports } from './components/reports';
import { useTeam } from '../contexts/team-context';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const { isLoading, error } = useTeam();

  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      }
    >
      {error ? (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-destructive mb-2">Error</h2>
            <p className="text-muted-foreground">{error}</p>
          </div>
        </div>
      ) : (
        <div className="min-h-screen bg-background">
          <header className="border-b">
            <div className="container mx-auto px-4 py-4">
              <h1 className="text-3xl font-bold">OKR & Goal Tracker</h1>
            </div>
          </header>

          <main className="container mx-auto px-4 py-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="space-y-8">
                <TeamMemberList />
              </div>
              <div className="space-y-8">
                <OKRList />
              </div>
              <div className="space-y-8">
                <GoalList />
              </div>
            </div>
            <Reports />
          </main>
        </div>
      )}
    </React.Suspense>
  );
} 