'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Team, TeamMember } from '../types/database';
import { toast } from 'sonner';

interface TeamContextType {
  team: Team | null;
  members: TeamMember[];
  isLoading: boolean;
  error: string | null;
  addMember: (name: string) => Promise<void>;
  updateMember: (id: string, name: string) => Promise<void>;
  deleteMember: (id: string) => Promise<void>;
}

const TeamContext = createContext<TeamContextType | undefined>(undefined);

export function TeamProvider({ children }: { children: React.ReactNode }) {
  const [team, setTeam] = useState<Team | null>(null);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrCreateTeam();
  }, []);

  useEffect(() => {
    if (team) {
      fetchMembers();
    }
  }, [team]);

  async function fetchOrCreateTeam() {
    try {
      setIsLoading(true);
      setError(null);

      // First try to fetch the default team
      let { data: team, error: fetchError } = await supabase
        .from('teams')
        .select('*')
        .eq('id', '00000000-0000-0000-0000-000000000001')
        .maybeSingle();

      // If no team exists, create it
      if (!team && !fetchError) {
        const { data: newTeam, error: createError } = await supabase
          .from('teams')
          .insert({
            id: '00000000-0000-0000-0000-000000000001',
            name: 'Demo Team',
            icon_type: 'emoji',
            icon_value: '👥'
          })
          .select()
          .single();

        if (createError) throw createError;
        team = newTeam;
      } else if (fetchError) {
        throw fetchError;
      }

      setTeam(team);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch or create team';
      setError(message);
      toast.error(message);
      console.error('Error fetching or creating team:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchMembers() {
    try {
      if (!team?.id) return;

      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .eq('team_id', team.id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMembers(data || []);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to fetch team members';
      setError(message);
      toast.error(message);
      console.error('Error fetching team members:', error);
    }
  }

  async function addMember(name: string) {
    try {
      if (!team?.id) {
        throw new Error('No team selected');
      }

      const { data, error } = await supabase
        .from('team_members')
        .insert([{
          name,
          team_id: team.id
        }])
        .select()
        .single();

      if (error) throw error;
      setMembers([...members, data]);
      toast.success('Team member added successfully');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to add team member';
      setError(message);
      toast.error(message);
      console.error('Error adding team member:', error);
    }
  }

  async function updateMember(id: string, name: string) {
    try {
      const { error } = await supabase
        .from('team_members')
        .update({ name })
        .eq('id', id);

      if (error) throw error;
      setMembers(members.map(m => m.id === id ? { ...m, name } : m));
      toast.success('Team member updated successfully');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update team member';
      setError(message);
      toast.error(message);
      console.error('Error updating team member:', error);
    }
  }

  async function deleteMember(id: string) {
    try {
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setMembers(members.filter(m => m.id !== id));
      toast.success('Team member deleted successfully');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to delete team member';
      setError(message);
      toast.error(message);
      console.error('Error deleting team member:', error);
    }
  }

  return (
    <TeamContext.Provider value={{ team, members, isLoading, error, addMember, updateMember, deleteMember }}>
      {children}
    </TeamContext.Provider>
  );
}

export function useTeam() {
  const context = useContext(TeamContext);
  if (context === undefined) {
    throw new Error('useTeam must be used within a TeamProvider');
  }
  return context;
} 