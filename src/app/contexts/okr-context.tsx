import React, { createContext, useContext, useState, useEffect } from 'react';
import { OKR, supabase } from '../lib/supabase';
import { useTeam } from './team-context';

interface OKRContextType {
  okrs: OKR[];
  isLoading: boolean;
  error: string | null;
  addOKR: (title: string, description?: string) => Promise<void>;
  updateOKR: (id: string, data: Partial<OKR>) => Promise<void>;
  deleteOKR: (id: string) => Promise<void>;
  updateProgress: (id: string, progress: number) => Promise<void>;
}

const OKRContext = createContext<OKRContextType | undefined>(undefined);

export function OKRProvider({ children }: { children: React.ReactNode }) {
  const { team } = useTeam();
  const [okrs, setOKRs] = useState<OKR[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (team) {
      fetchOKRs();
      const subscription = supabase
        .channel('okr-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'okrs' }, handleOKRChange)
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [team]);

  const fetchOKRs = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('okrs')
        .select('*')
        .eq('team_id', team?.id)
        .order('created_at', { ascending: true });

      if (fetchError) throw fetchError;

      setOKRs(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOKRChange = (payload: any) => {
    if (payload.eventType === 'INSERT') {
      setOKRs(prev => [...prev, payload.new]);
    } else if (payload.eventType === 'UPDATE') {
      setOKRs(prev => prev.map(okr => 
        okr.id === payload.new.id ? payload.new : okr
      ));
    } else if (payload.eventType === 'DELETE') {
      setOKRs(prev => prev.filter(okr => okr.id !== payload.old.id));
    }
  };

  const addOKR = async (title: string, description?: string) => {
    try {
      const { error: insertError } = await supabase
        .from('okrs')
        .insert({
          team_id: team?.id,
          title,
          description,
          progress: 0
        });

      if (insertError) throw insertError;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  const updateOKR = async (id: string, data: Partial<OKR>) => {
    try {
      const { error: updateError } = await supabase
        .from('okrs')
        .update(data)
        .eq('id', id);

      if (updateError) throw updateError;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  const deleteOKR = async (id: string) => {
    try {
      const { error: deleteError } = await supabase
        .from('okrs')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  const updateProgress = async (id: string, progress: number) => {
    try {
      const { error: updateError } = await supabase
        .from('okrs')
        .update({ progress })
        .eq('id', id);

      if (updateError) throw updateError;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      throw err;
    }
  };

  return (
    <OKRContext.Provider
      value={{
        okrs,
        isLoading,
        error,
        addOKR,
        updateOKR,
        deleteOKR,
        updateProgress,
      }}
    >
      {children}
    </OKRContext.Provider>
  );
}

export function useOKRs() {
  const context = useContext(OKRContext);
  if (context === undefined) {
    throw new Error('useOKRs must be used within an OKRProvider');
  }
  return context;
} 