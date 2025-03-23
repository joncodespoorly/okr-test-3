import React from 'react';
import './globals.css';
import { Inter } from 'next/font/google';
import { Toaster } from 'sonner';
import { TeamProvider } from '../contexts/team-context';
import { OKRProvider } from '../contexts/okr-context';
import { GoalProvider } from '../contexts/goal-context';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'OKR and Weekly Goal Tracker',
  description: 'Track your team\'s OKRs and weekly goals',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <React.Suspense fallback={<div>Loading...</div>}>
          <TeamProvider>
            <OKRProvider>
              <GoalProvider>
                {children}
                <Toaster />
              </GoalProvider>
            </OKRProvider>
          </TeamProvider>
        </React.Suspense>
      </body>
    </html>
  );
} 