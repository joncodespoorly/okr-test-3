import React, { createContext, useContext, useState, useEffect } from 'react';
import { WeeklyGoal, GoalComment, supabase } from '../lib/supabase';
import { useTeam } from './team-context';

interface GoalContextType {
  goals: WeeklyGoal[];
  isLoading: boolean;
  error: string | null;
  addGoal: (data: {
    description: string;
    okr_id: string;
    team_member_id: string;
  }) => Promise<void>;
  updateGoal: (id: string, data: Partial<WeeklyGoal>) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
  updateStatus: (id: string, status: WeeklyGoal['status']) => Promise<void>;
  addComment: (goalId: string, comment: string) => Promise<void>;
  deleteComment: (commentId: string) => Promise<void>;
  getComments: (goalId: string) => Promise<GoalComment[]>;
}

const GoalContext = createContext<GoalContextType | undefined>(undefined);

export function GoalProvider({ children }: { children: React.ReactNode }) {
  const { team } = useTeam();
  const [goals, setGoals] = useState<WeeklyGoal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (team) {
      fetchGoals();
      const subscription = supabase
        .channel('goal-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'weekly_goals' }, handleGoalChange)
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [team]);

  const fetchGoals = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('weekly_goals')
        .select(`
          *,
          team_member:team_members(*),
          okr:okrs(*)
        `)
        .eq('team_id', team?.id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      setGoals(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoalChange = (payload: any) => {
    if (payload.eventType === 'INSERT') {
      setGoals(prev => [payload.new, ...prev]);
    } else if (payload.eventType === 'UPDATE') {
      setGoals(prev => prev.map(goal => 
        goal.id === payload.new.id ? { ...goal, ...payload.new } : goal
      ));
    } else if (payload.eventType === 'DELETE') {
      setGoals(prev => prev.filter(goal => goal.id !== payload.old.id));
    }
  };

  const addGoal = async (data: {
    description: string;
    okr_id: string;
    team_member_id: string;
  }) => {
    try {
      const { error: insertError } = await supabase
        .from('weekly_goals')
        .insert({
          team_id: team?.id,
          ...data,
          status: 'not_started'
        });

      if (insertError) throw insertError;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  const updateGoal = async (id: string, data: Partial<WeeklyGoal>) => {
    try {
      const { error: updateError } = await supabase
        .from('weekly_goals')
        .update(data)
        .eq('id', id);

      if (updateError) throw updateError;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  const deleteGoal = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('weekly_goals')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  const updateStatus = async (id: string, status: WeeklyGoal['status']) => {
    try {
      const { error: updateError } = await supabase
        .from('weekly_goals')
        .update({ status })
        .eq('id', id);

      if (updateError) throw updateError;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  const addComment = async (goalId: string, comment: string) => {
    try {
      const { error: insertError } = await supabase
        .from('goal_comments')
        .insert({ goal_id: goalId, comment });

      if (insertError) throw insertError;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  const deleteComment = async (commentId: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('goal_comments')
        .delete()
        .eq('id', commentId);

      if (deleteError) throw deleteError;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  const getComments = async (goalId: string): Promise<GoalComment[]> => {
    try {
      const { data, error: fetchError } = await supabase
        .from('goal_comments')
        .select('*')
        .eq('goal_id', goalId)
        .order('created_at', { ascending: true });

      if (fetchError) throw fetchError;

      return data || [];
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  return (
    <GoalContext.Provider
      value={{
        goals,
        isLoading,
        error,
        addGoal,
        updateGoal,
        deleteGoal,
        updateStatus,
        addComment,
        deleteComment,
        getComments,
      }}
    >
      {children}
    </GoalContext.Provider>
  );
}

export function useGoals() {
  const context = useContext(GoalContext);
  if (context === undefined) {
    throw new Error('useGoals must be used within a GoalProvider');
  }
  return context;
} 