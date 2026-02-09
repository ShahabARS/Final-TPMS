import { useState } from 'react';
import type { Task, Comment } from '../types';
import { TaskStatus } from '../types';
import Modal from '../components/Modal';

/**
 * TaskDetailModal Component
 * 
 * Modal for viewing and editing task details.
 * Includes comments section for team members to add comments.
 * 
 * React concepts:
 * - Editing state: Toggle between view and edit modes
 * - Comments array management
 * - Form handling for updates
 */
interface TaskDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  onDeleteTask?: (taskId: string) => void;
  availableStatuses: TaskStatus[];
  currentUserId?: string; // For adding comments
}

function TaskDetailModal({
  isOpen,
  onClose,
  task,
  onUpdateTask,
  onDeleteTask,
  availableStatuses,
  currentUserId,
}: TaskDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState<Task | null>(null);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);

  // Initialize edited task when modal opens
  if (isOpen && task && !editedTask) {
    setEditedTask({ ...task });
  }

  // Reset state when modal closes
  const handleClose = () => {
    setIsEditing(false);
    setEditedTask(null);
    setNewComment('');
    setComments([]);
    onClose();
  };

  // Handle saving edits
  const handleSave = () => {
    if (!editedTask) return;

    onUpdateTask(editedTask.taskId, {
      title: editedTask.title,
      description: editedTask.description,
      status: editedTask.status,
      deadline: editedTask.deadline,
      effort: editedTask.effort,
      assignedTo: editedTask.assignedTo,
    });

    setIsEditing(false);
  };

  // Handle adding a comment
  const handleAddComment = () => {
    if (!newComment.trim() || !task || !currentUserId) return;

    const comment: Comment = {
      commentId: `comment-${Date.now()}`,
      taskId: task.taskId,
      userId: currentUserId,
      text: newComment.trim(),
      createdAt: new Date(),
    };

    setComments([...comments, comment]);
    setNewComment('');
  };

  // Handle deleting task
  const handleDelete = () => {
    if (!task || !onDeleteTask) return;
    if (confirm('Are you sure you want to delete this task?')) {
      onDeleteTask(task.taskId);
      handleClose();
    }
  };

  if (!task) return null;

  const displayTask = editedTask || task;
  const formatDate = (date?: Date) => {
    if (!date) return 'Not set';
    const d = date instanceof Date ? date : new Date(date);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Task Details" size="lg">
      <div className="space-y-6">
        {/* Header Actions */}
        <div className="flex justify-between items-start">
          <div className="flex-1">
            {isEditing ? (
              <input
                type="text"
                value={displayTask.title}
                onChange={(e) =>
                  setEditedTask({ ...displayTask, title: e.target.value })
                }
                className="w-full text-xl font-bold border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <h3 className="text-xl font-bold text-gray-800">{displayTask.title}</h3>
            )}
          </div>
          <div className="flex gap-2">
            {!isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-3 py-1.5 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                >
                  Edit
                </button>
                {onDeleteTask && (
                  <button
                    onClick={handleDelete}
                    className="px-3 py-1.5 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                  >
                    Delete
                  </button>
                )}
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setEditedTask({ ...task });
                  }}
                  className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Save
                </button>
              </>
            )}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          {isEditing ? (
            <textarea
              value={displayTask.description}
              onChange={(e) =>
                setEditedTask({ ...displayTask, description: e.target.value })
              }
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <p className="text-gray-600 whitespace-pre-wrap">
              {displayTask.description || 'No description'}
            </p>
          )}
        </div>

        {/* Task Metadata */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            {isEditing ? (
              <select
                value={displayTask.status}
                onChange={(e) =>
                  setEditedTask({ ...displayTask, status: e.target.value as TaskStatus })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {availableStatuses.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            ) : (
              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm font-medium">
                {displayTask.status}
              </span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Deadline</label>
            {isEditing ? (
              <input
                type="date"
                value={
                  displayTask.deadline
                    ? new Date(displayTask.deadline).toISOString().split('T')[0]
                    : ''
                }
                onChange={(e) =>
                  setEditedTask({
                    ...displayTask,
                    deadline: e.target.value ? new Date(e.target.value) : undefined,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-600">{formatDate(displayTask.deadline)}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Effort</label>
            {isEditing ? (
              <input
                type="number"
                min="0"
                step="0.5"
                value={displayTask.effort || ''}
                onChange={(e) =>
                  setEditedTask({
                    ...displayTask,
                    effort: e.target.value ? parseFloat(e.target.value) : undefined,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <p className="text-gray-600">{displayTask.effort ? `${displayTask.effort}h` : 'Not set'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Assigned To</label>
            {isEditing ? (
              <input
                type="text"
                value={displayTask.assignedTo || ''}
                onChange={(e) =>
                  setEditedTask({ ...displayTask, assignedTo: e.target.value || undefined })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="User ID"
              />
            ) : (
              <p className="text-gray-600">{displayTask.assignedTo || 'Unassigned'}</p>
            )}
          </div>
        </div>

        {/* Comments Section */}
        <div className="border-t border-gray-200 pt-4">
          <h4 className="text-lg font-semibold text-gray-800 mb-4">Comments</h4>

          {/* Comments List */}
          <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
            {comments.length === 0 ? (
              <p className="text-gray-500 text-sm">No comments yet</p>
            ) : (
              comments.map((comment) => (
                <div key={comment.commentId} className="bg-gray-50 rounded-lg p-3">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-sm font-medium text-gray-700">User {comment.userId}</span>
                    <span className="text-xs text-gray-500">
                      {new Date(comment.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{comment.text}</p>
                </div>
              ))
            )}
          </div>

          {/* Add Comment */}
          {currentUserId && (
            <div className="flex gap-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleAddComment();
                  }
                }}
                placeholder="Add a comment..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleAddComment}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Add
              </button>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}

export default TaskDetailModal;
