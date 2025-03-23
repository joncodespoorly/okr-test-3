import React, { createContext, useContext, useState, useEffect } from 'react';
import { Team, TeamMember, supabase } from '../lib/supabase';

interface TeamContextType {
  team: Team | null;
  teamMembers: TeamMember[];
  isLoading: boolean;
  error: string | null;
  updateTeam: (data: Partial<Team>) => Promise<void>;
  addTeamMember: (name: string) => Promise<void>;
  updateTeamMember: (id: string, name: string) => Promise<void>;
  deleteTeamMember: (id: string) => Promise<void>;
}

const TeamContext = createContext<TeamContextType | undefined>(undefined);

export function TeamProvider({ children }: { children: React.ReactNode }) {
  const [team, setTeam] = useState<Team | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTeamData();
    const teamSubscription = supabase
      .channel('team-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'teams' }, handleTeamChange)
      .subscribe();

    const membersSubscription = supabase
      .channel('member-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'team_members' }, handleMemberChange)
      .subscribe();

    return () => {
      teamSubscription.unsubscribe();
      membersSubscription.unsubscribe();
    };
  }, []);

  const fetchTeamData = async () => {
    try {
      const { data: teamData, error: teamError } = await supabase
        .from('teams')
        .select('*')
        .single();

      if (teamError) throw teamError;

      const { data: membersData, error: membersError } = await supabase
        .from('team_members')
        .select('*');

      if (membersError) throw membersError;

      setTeam(teamData);
      setTeamMembers(membersData || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTeamChange = (payload: any) => {
    if (payload.new) {
      setTeam(payload.new);
    }
  };

  const handleMemberChange = (payload: any) => {
    if (payload.eventType === 'INSERT') {
      setTeamMembers(prev => [...prev, payload.new]);
    } else if (payload.eventType === 'UPDATE') {
      setTeamMembers(prev => prev.map(member => 
        member.id === payload.new.id ? payload.new : member
      ));
    } else if (payload.eventType === 'DELETE') {
      setTeamMembers(prev => prev.filter(member => member.id !== payload.old.id));
    }
  };

  const updateTeam = async (data: Partial<Team>) => {
    try {
      const { error: updateError } = await supabase
        .from('teams')
        .update(data)
        .eq('id', team?.id);

      if (updateError) throw updateError;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  const addTeamMember = async (name: string) => {
    try {
      const { error: insertError } = await supabase
        .from('team_members')
        .insert({ team_id: team?.id, name });

      if (insertError) throw insertError;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  const updateTeamMember = async (id: string, name: string) => {
    try {
      const { error: updateError } = await supabase
        .from('team_members')
        .update({ name })
        .eq('id', id);

      if (updateError) throw updateError;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  const deleteTeamMember = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('team_members')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  return (
    <TeamContext.Provider
      value={{
        team,
        teamMembers,
        isLoading,
        error,
        updateTeam,
        addTeamMember,
        updateTeamMember,
        deleteTeamMember,
      }}
    >
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