import { useState } from 'react';
import type { Task } from '../types';
import { TaskStatus } from '../types';
import Modal from '../components/Modal';

/**
 * CreateTaskModal Component
 * 
 * Modal for creating a new task.
 * 
 * React concepts:
 * - Form state management with multiple useState hooks
 * - Form submission handler
 * - Controlled inputs (value + onChange)
 */
interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateTask: (task: Omit<Task, 'taskId'>) => void;
  availableStatuses: TaskStatus[];
}

function CreateTaskModal({
  isOpen,
  onClose,
  onCreateTask,
  availableStatuses,
}: CreateTaskModalProps) {
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>(availableStatuses[0] || TaskStatus.TODO);
  const [deadline, setDeadline] = useState('');
  const [effort, setEffort] = useState<number | undefined>(undefined);
  const [assignedTo, setAssignedTo] = useState('');

  // Reset form when modal closes
  const handleClose = () => {
    setTitle('');
    setDescription('');
    setStatus(availableStatuses[0] || TaskStatus.TODO);
    setDeadline('');
    setEffort(undefined);
    setAssignedTo('');
    onClose();
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!title.trim()) {
      alert('Please enter a task title');
      return;
    }

    // Create task object
    const newTask: Omit<Task, 'taskId'> = {
      title: title.trim(),
      description: description.trim(),
      status,
      deadline: deadline ? new Date(deadline) : undefined,
      effort: effort || undefined,
      assignedTo: assignedTo || undefined,
    };

    onCreateTask(newTask);
    handleClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create New Task" size="lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Task Title */}
        <div>
          <label htmlFor="task-title" className="block text-sm font-medium text-gray-700 mb-2">
            Task Title <span className="text-red-500">*</span>
          </label>
          <input
            id="task-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="What needs to be done?"
            required
            autoFocus
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="task-description" className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            id="task-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
            placeholder="Add more details to this task..."
          />
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Status */}
          <div>
            <label htmlFor="task-status" className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              id="task-status"
              value={status}
              onChange={(e) => setStatus(e.target as TaskStatus)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              {availableStatuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Deadline */}
          <div>
            <label htmlFor="task-deadline" className="block text-sm font-medium text-gray-700 mb-2">
              Deadline
            </label>
            <input
              id="task-deadline"
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Effort */}
          <div>
            <label htmlFor="task-effort" className="block text-sm font-medium text-gray-700 mb-2">
              Effort (hours)
            </label>
            <input
              id="task-effort"
              type="number"
              min="0"
              step="0.5"
              value={effort || ''}
              onChange={(e) => setEffort(e.target.value ? parseFloat(e.target.value) : undefined)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., 4"
            />
          </div>

          {/* Assigned To */}
          <div>
            <label htmlFor="task-assigned" className="block text-sm font-medium text-gray-700 mb-2">
              Assign To (User ID)
            </label>
            <input
              id="task-assigned"
              type="text"
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Optional"
            />
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={handleClose}
            className="px-5 py-2.5 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Create Task
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default CreateTaskModal;
