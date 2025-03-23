'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Goal } from '../types/database';
import { toast } from 'sonner';
import { useTeam } from './team-context';

interface GoalContextType {
  goals: Goal[];
  isLoading: boolean;
  addGoal: (data: {
    description: string;
    team_member_id: string;
    okr_id: string;
  }) => Promise<void>;
  updateGoal: (id: string, data: {
    description: string;
    team_member_id: string;
    okr_id: string;
  }) => Promise<void>;
  updateStatus: (id: string, status: Goal['status']) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
  addComment: (goalId: string, comment: string) => Promise<void>;
}

const GoalContext = createContext<GoalContextType | undefined>(undefined);

export function GoalProvider({ children }: { children: React.ReactNode }) {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { team } = useTeam();

  useEffect(() => {
    if (team) {
      fetchGoals();
    }
  }, [team]);

  async function fetchGoals() {
    try {
      const { data, error } = await supabase
        .from('weekly_goals')
        .select(`
          *,
          comments:goal_comments(*)
        `)
        .eq('team_id', team?.id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setGoals(data || []);
    } catch (error) {
      toast.error('Failed to fetch goals');
      console.error('Error fetching goals:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function addGoal(data: {
    description: string;
    team_member_id: string;
    okr_id: string;
  }) {
    try {
      if (!team?.id) {
        throw new Error('No team selected');
      }

      const { data: newGoal, error } = await supabase
        .from('weekly_goals')
        .insert([{
          description: data.description,
          team_id: team.id,
          team_member_id: data.team_member_id,
          okr_id: data.okr_id,
          status: 'not_started'
        }])
        .select()
        .single();

      if (error) throw error;
      setGoals([...goals, { ...newGoal, comments: [] }]);
      toast.success('Goal added successfully');
    } catch (error) {
      toast.error('Failed to add goal');
      console.error('Error adding goal:', error);
    }
  }

  async function updateGoal(id: string, data: {
    description: string;
    team_member_id: string;
    okr_id: string;
  }) {
    try {
      const { error } = await supabase
        .from('weekly_goals')
        .update({
          description: data.description,
          team_member_id: data.team_member_id,
          okr_id: data.okr_id
        })
        .eq('id', id);

      if (error) throw error;
      setGoals(goals.map(g => g.id === id ? {
        ...g,
        description: data.description,
        team_member_id: data.team_member_id,
        okr_id: data.okr_id
      } : g));
      toast.success('Goal updated successfully');
    } catch (error) {
      toast.error('Failed to update goal');
      console.error('Error updating goal:', error);
    }
  }

  async function updateStatus(id: string, status: Goal['status']) {
    try {
      const { error } = await supabase
        .from('weekly_goals')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      setGoals(goals.map(g => g.id === id ? { ...g, status } : g));
      toast.success('Status updated successfully');
    } catch (error) {
      toast.error('Failed to update status');
      console.error('Error updating status:', error);
    }
  }

  async function deleteGoal(id: string) {
    try {
      const { error } = await supabase
        .from('weekly_goals')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setGoals(goals.filter(g => g.id !== id));
      toast.success('Goal deleted successfully');
    } catch (error) {
      toast.error('Failed to delete goal');
      console.error('Error deleting goal:', error);
    }
  }

  async function addComment(goalId: string, comment: string) {
    try {
      const { data: newComment, error } = await supabase
        .from('goal_comments')
        .insert([{
          goal_id: goalId,
          comment
        }])
        .select()
        .single();

      if (error) throw error;
      setGoals(goals.map(g => g.id === goalId ? {
        ...g,
        comments: [...(g.comments || []), newComment]
      } : g));
      toast.success('Comment added successfully');
    } catch (error) {
      toast.error('Failed to add comment');
      console.error('Error adding comment:', error);
    }
  }

  return (
    <GoalContext.Provider value={{
      goals,
      isLoading,
      addGoal,
      updateGoal,
      updateStatus,
      deleteGoal,
      addComment
    }}>
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