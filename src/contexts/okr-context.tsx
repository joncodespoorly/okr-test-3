'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { OKR } from '../types/database';
import { toast } from 'sonner';
import { useTeam } from './team-context';

interface OKRContextType {
  okrs: OKR[];
  isLoading: boolean;
  addOKR: (title: string, description: string) => Promise<void>;
  updateOKR: (id: string, title: string, description: string) => Promise<void>;
  updateProgress: (id: string, progress: number) => Promise<void>;
  deleteOKR: (id: string) => Promise<void>;
}

const OKRContext = createContext<OKRContextType | undefined>(undefined);

export function OKRProvider({ children }: { children: React.ReactNode }) {
  const { team } = useTeam();
  const [okrs, setOKRs] = useState<OKR[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (team) {
      fetchOKRs();
    }
  }, [team]);

  async function fetchOKRs() {
    try {
      const { data, error } = await supabase
        .from('okrs')
        .select('*')
        .eq('team_id', team?.id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setOKRs(data || []);
    } catch (error) {
      toast.error('Failed to fetch OKRs');
      console.error('Error fetching OKRs:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function addOKR(title: string, description: string) {
    try {
      if (!team?.id) {
        throw new Error('No team selected');
      }

      const { data, error } = await supabase
        .from('okrs')
        .insert([{
          title,
          description,
          progress: 0,
          team_id: team.id
        }])
        .select()
        .single();

      if (error) throw error;
      setOKRs([...okrs, data]);
      toast.success('OKR added successfully');
    } catch (error) {
      toast.error('Failed to add OKR');
      console.error('Error adding OKR:', error);
    }
  }

  async function updateOKR(id: string, title: string, description: string) {
    try {
      const { error } = await supabase
        .from('okrs')
        .update({ title, description })
        .eq('id', id);

      if (error) throw error;
      setOKRs(okrs.map(o => o.id === id ? { ...o, title, description } : o));
      toast.success('OKR updated successfully');
    } catch (error) {
      toast.error('Failed to update OKR');
      console.error('Error updating OKR:', error);
    }
  }

  async function updateProgress(id: string, progress: number) {
    try {
      const { error } = await supabase
        .from('okrs')
        .update({ progress })
        .eq('id', id);

      if (error) throw error;
      setOKRs(okrs.map(o => o.id === id ? { ...o, progress } : o));
    } catch (error) {
      toast.error('Failed to update progress');
      console.error('Error updating progress:', error);
    }
  }

  async function deleteOKR(id: string) {
    try {
      const { error } = await supabase
        .from('okrs')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setOKRs(okrs.filter(o => o.id !== id));
      toast.success('OKR deleted successfully');
    } catch (error) {
      toast.error('Failed to delete OKR');
      console.error('Error deleting OKR:', error);
    }
  }

  return (
    <OKRContext.Provider value={{ okrs, isLoading, addOKR, updateOKR, updateProgress, deleteOKR }}>
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