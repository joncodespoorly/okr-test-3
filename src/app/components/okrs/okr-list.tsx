import React, { useState } from 'react';
import { useOKRs } from '../../../contexts/okr-context';
import { Button } from '../../../components/ui/button';
import { Slider } from '../../../components/ui/slider';
import { Loader2, Plus, Pencil, Trash2 } from 'lucide-react';

export function OKRList() {
  const { okrs, isLoading, addOKR, updateOKR, updateProgress, deleteOKR } = useOKRs();
  const [newOKR, setNewOKR] = useState({ title: '', description: '' });
  const [editingOKR, setEditingOKR] = useState<{
    id: string;
    title: string;
    description: string;
  } | null>(null);

  const handleAddOKR = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOKR.title.trim()) return;

    await addOKR(newOKR.title, newOKR.description);
    setNewOKR({ title: '', description: '' });
  };

  const handleStartEdit = (okr: { id: string; title: string; description: string }) => {
    setEditingOKR(okr);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOKR || !editingOKR.title.trim()) return;

    await updateOKR(editingOKR.id, editingOKR.title, editingOKR.description);
    setEditingOKR(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this OKR?')) return;
    await deleteOKR(id);
  };

  const handleProgressChange = async (id: string, [value]: number[]) => {
    await updateProgress(id, value);
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
        <h2 className="text-2xl font-bold">OKRs</h2>
        <Button
          onClick={() => setEditingOKR({ id: '', title: '', description: '' })}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add OKR
        </Button>
      </div>

      {editingOKR && (
        <form onSubmit={editingOKR.id ? handleSaveEdit : handleAddOKR} className="space-y-2">
          <input
            type="text"
            value={editingOKR.id ? editingOKR.title : newOKR.title}
            onChange={(e) => editingOKR.id
              ? setEditingOKR({ ...editingOKR, title: e.target.value })
              : setNewOKR({ ...newOKR, title: e.target.value })
            }
            placeholder="Enter OKR title"
            className="w-full p-2 border rounded-md bg-background"
          />
          <textarea
            value={editingOKR.id ? editingOKR.description : newOKR.description}
            onChange={(e) => editingOKR.id
              ? setEditingOKR({ ...editingOKR, description: e.target.value })
              : setNewOKR({ ...newOKR, description: e.target.value })
            }
            placeholder="Enter OKR description"
            className="w-full p-2 border rounded-md bg-background h-24 resize-none"
          />
          <div className="flex gap-2">
            <Button type="submit">
              {editingOKR.id ? 'Save' : 'Add'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setEditingOKR(null)}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {okrs.map((okr) => (
          <div
            key={okr.id}
            className="p-4 border rounded-md bg-card space-y-4"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h3 className="font-medium">{okr.title}</h3>
                <p className="text-sm text-muted-foreground">{okr.description}</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleStartEdit(okr)}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(okr.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{Math.round(okr.progress * 100)}%</span>
              </div>
              <Slider
                value={[okr.progress]}
                onValueChange={(value) => handleProgressChange(okr.id, value)}
                max={1}
                step={0.01}
                className="w-full"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 