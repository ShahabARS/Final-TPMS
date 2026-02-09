import { Task } from '../types';

/**
 * TaskCard Component
 * 
 * Displays a single task card in the Kanban board.
 * This is a reusable component - we'll use it inside Column components.
 * 
 * React concepts:
 * - onClick: Event handler for when user clicks the card
 * - Conditional rendering: Show deadline only if it exists
 */
interface TaskCardProps {
  task: Task;
  onClick: () => void;
}

function TaskCard({ task, onClick }: TaskCardProps) {
  // Format deadline date for display
  const formatDeadline = (deadline?: Date) => {
    if (!deadline) return null;
    const date = deadline instanceof Date ? deadline : new Date(deadline);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Check if task is overdue
  const isOverdue = task.deadline && new Date(task.deadline) < new Date() && task.status !== 'DONE';

  return (
    <div
      onClick={onClick}
      className="bg-white border border-gray-200 rounded-lg p-3 mb-2 cursor-pointer hover:shadow-md transition-shadow"
    >
      {/* Task Title */}
      <h3 className="font-semibold text-gray-800 mb-1 text-sm">{task.title}</h3>
      
      {/* Task Description (truncated) */}
      {task.description && (
        <p className="text-xs text-gray-600 mb-2 line-clamp-2">{task.description}</p>
      )}

      {/* Task Metadata */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        {/* Deadline */}
        {task.deadline && (
          <span className={isOverdue ? 'text-red-600 font-medium' : ''}>
            📅 {formatDeadline(task.deadline)}
            {isOverdue && ' (Overdue)'}
          </span>
        )}
        
        {/* Effort */}
        {task.effort && (
          <span className="ml-auto">⚡ {task.effort}h</span>
        )}
      </div>

      {/* Assigned User Badge */}
      {task.assignedTo && (
        <div className="mt-2 pt-2 border-t border-gray-100">
          <span className="text-xs text-gray-500">👤 Assigned</span>
        </div>
      )}
    </div>
  );
}

export default TaskCard;
