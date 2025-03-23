import React, { useState } from 'react';
import { useTeam } from '../../../contexts/team-context';
import { Button } from '../../../components/ui/button';
import { Loader2, Plus, Pencil, Trash2 } from 'lucide-react';

export function TeamMemberList() {
  const { members, isLoading, addMember, updateMember, deleteMember } = useTeam();
  const [newMemberName, setNewMemberName] = useState('');
  const [editingMember, setEditingMember] = useState<{ id: string; name: string } | null>(null);

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;

    await addMember(newMemberName);
    setNewMemberName('');
  };

  const handleStartEdit = (member: { id: string; name: string }) => {
    setEditingMember(member);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember || !editingMember.name.trim()) return;

    await updateMember(editingMember.id, editingMember.name);
    setEditingMember(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this team member?')) return;
    await deleteMember(id);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Team Members</h2>
        <Button
          onClick={() => setEditingMember({ id: '', name: '' })}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Member
        </Button>
      </div>

      {editingMember && (
        <form onSubmit={editingMember.id ? handleSaveEdit : handleAddMember} className="space-y-2">
          <input
            type="text"
            value={editingMember.id ? editingMember.name : newMemberName}
            onChange={(e) => editingMember.id 
              ? setEditingMember({ ...editingMember, name: e.target.value })
              : setNewMemberName(e.target.value)
            }
            placeholder="Enter member name"
            className="w-full p-2 border rounded-md bg-background"
          />
          <div className="flex gap-2">
            <Button type="submit">
              {editingMember.id ? 'Save' : 'Add'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setEditingMember(null)}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}

      <div className="space-y-2">
        {members.map((member) => (
          <div
            key={member.id}
            className="flex items-center justify-between p-3 border rounded-md bg-card"
          >
            <span>{member.name}</span>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleStartEdit(member)}
              >
                <Pencil className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(member.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 