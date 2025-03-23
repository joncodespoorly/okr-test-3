import React, { useState } from 'react';
import { useGoals } from '../../../contexts/goal-context';
import { useTeam } from '../../../contexts/team-context';
import { useOKRs } from '../../../contexts/okr-context';
import { Button } from '../../../components/ui/button';
import { Loader2, Plus, Pencil, Trash2, MessageSquare } from 'lucide-react';
import { formatDate } from '../../../lib/utils';

export function GoalList() {
  const { goals, isLoading, addGoal, updateGoal, updateStatus, deleteGoal, addComment } = useGoals();
  const { members } = useTeam();
  const { okrs } = useOKRs();
  const [newGoal, setNewGoal] = useState({
    description: '',
    team_member_id: '',
    okr_id: ''
  });
  const [editingGoal, setEditingGoal] = useState<{
    id: string;
    description: string;
    team_member_id: string;
    okr_id: string;
  } | null>(null);
  const [newComment, setNewComment] = useState('');
  const [commentingGoalId, setCommentingGoalId] = useState<string | null>(null);

  const handleAddGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoal.description.trim() || !newGoal.team_member_id || !newGoal.okr_id) return;

    await addGoal(newGoal);
    setNewGoal({
      description: '',
      team_member_id: '',
      okr_id: ''
    });
  };

  const handleStartEdit = (goal: {
    id: string;
    description: string;
    team_member_id: string;
    okr_id: string;
  }) => {
    setEditingGoal(goal);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGoal || !editingGoal.description.trim() || !editingGoal.team_member_id || !editingGoal.okr_id) return;

    await updateGoal(editingGoal.id, editingGoal);
    setEditingGoal(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this goal?')) return;
    await deleteGoal(id);
  };

  const handleStatusChange = async (id: string, status: 'not_started' | 'in_progress' | 'completed') => {
    await updateStatus(id, status);
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentingGoalId || !newComment.trim()) return;

    await addComment(commentingGoalId, newComment);
    setNewComment('');
    setCommentingGoalId(null);
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
        <h2 className="text-2xl font-bold">Weekly Goals</h2>
        <Button
          onClick={() => setEditingGoal({
            id: '',
            description: '',
            team_member_id: '',
            okr_id: ''
          })}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Goal
        </Button>
      </div>

      {editingGoal && (
        <form onSubmit={editingGoal.id ? handleSaveEdit : handleAddGoal} className="space-y-2">
          <textarea
            value={editingGoal.id ? editingGoal.description : newGoal.description}
            onChange={(e) => editingGoal.id
              ? setEditingGoal({ ...editingGoal, description: e.target.value })
              : setNewGoal({ ...newGoal, description: e.target.value })
            }
            placeholder="Enter goal description"
            className="w-full p-2 border rounded-md bg-background h-24 resize-none"
          />
          <select
            value={editingGoal.id ? editingGoal.team_member_id : newGoal.team_member_id}
            onChange={(e) => editingGoal.id
              ? setEditingGoal({ ...editingGoal, team_member_id: e.target.value })
              : setNewGoal({ ...newGoal, team_member_id: e.target.value })
            }
            className="w-full p-2 border rounded-md bg-background"
          >
            <option value="">Assign to...</option>
            {members.map((member) => (
              <option key={member.id} value={member.id}>{member.name}</option>
            ))}
          </select>
          <select
            value={editingGoal.id ? editingGoal.okr_id : newGoal.okr_id}
            onChange={(e) => editingGoal.id
              ? setEditingGoal({ ...editingGoal, okr_id: e.target.value })
              : setNewGoal({ ...newGoal, okr_id: e.target.value })
            }
            className="w-full p-2 border rounded-md bg-background"
          >
            <option value="">Related OKR...</option>
            {okrs.map((okr) => (
              <option key={okr.id} value={okr.id}>{okr.title}</option>
            ))}
          </select>
          <div className="flex gap-2">
            <Button type="submit">
              {editingGoal.id ? 'Save' : 'Add'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setEditingGoal(null)}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {goals.map((goal) => (
          <div
            key={goal.id}
            className="p-4 border rounded-md bg-card space-y-4"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <p>{goal.description}</p>
                <div className="flex gap-2 text-sm text-muted-foreground">
                  <span>Assigned to: {members.find(m => m.id === goal.team_member_id)?.name}</span>
                  <span>•</span>
                  <span>Related to: {okrs.find(o => o.id === goal.okr_id)?.title}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleStartEdit(goal)}
                >
                  <Pencil className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(goal.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant={goal.status === 'not_started' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleStatusChange(goal.id, 'not_started')}
              >
                Not Started
              </Button>
              <Button
                variant={goal.status === 'in_progress' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleStatusChange(goal.id, 'in_progress')}
              >
                In Progress
              </Button>
              <Button
                variant={goal.status === 'completed' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleStatusChange(goal.id, 'completed')}
              >
                Completed
              </Button>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">Comments</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCommentingGoalId(commentingGoalId === goal.id ? null : goal.id)}
                  className="flex items-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  Add Comment
                </Button>
              </div>

              {commentingGoalId === goal.id && (
                <form onSubmit={handleAddComment} className="flex gap-2">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    className="flex-1 p-2 border rounded-md bg-background"
                  />
                  <Button type="submit" size="sm">Post</Button>
                </form>
              )}

              <div className="space-y-2">
                {goal.comments.map((comment) => (
                  <div key={comment.id} className="text-sm space-y-1">
                    <p>{comment.comment}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(comment.created_at)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 