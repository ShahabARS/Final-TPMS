import type { Task } from '../types';
import { TaskStatus } from '../types';
import TaskCard from './TaskCard';

/**
 * Column Component
 * 
 * Represents a single column in the Kanban board (e.g., TODO, DOING, DONE).
 * Each column displays tasks that have a matching status.
 * 
 * React concepts:
 * - Props: Receives column data (status, tasks) and handlers
 * - Array methods: .filter() to get tasks for this column
 * - .map() to render multiple TaskCard components
 */
interface ColumnProps {
  status: TaskStatus;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onAddTask?: () => void; // Optional: for "Add Task" button in column
}

function Column({ status, tasks, onTaskClick, onAddTask }: ColumnProps) {
  // Get tasks that belong to this column's status
  const columnTasks = tasks.filter(task => task.status === status);

  // Column color styling based on status
  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'TODO':
        return 'border-blue-300 bg-blue-50';
      case 'DOING':
        return 'border-yellow-300 bg-yellow-50';
      case 'DONE':
        return 'border-green-300 bg-green-50';
      default:
        return 'border-gray-300 bg-gray-50';
    }
  };

  return (
    <div className={`flex-1 min-w-70 rounded-lg border-2 p-4 ${getStatusColor(status)}`}>
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">
          {status}
        </h2>
        <span className="bg-white px-2 py-1 rounded-full text-xs font-medium text-gray-600">
          {columnTasks.length}
        </span>
      </div>

      {/* Tasks List */}
      <div className="space-y-2 min-h-50">
        {columnTasks.length === 0 ? (
          <div className="text-center py-8 text-gray-400 text-sm">
            No tasks
          </div>
        ) : (
          columnTasks.map(task => (
            <TaskCard
              key={task.taskId}
              task={task}
              onClick={() => onTaskClick(task)}
            />
          ))
        )}
      </div>

      {/* Add Task Button (optional - can be removed if not needed) */}
      {onAddTask && (
        <button
          onClick={onAddTask}
          className="mt-4 w-full py-2 text-sm text-gray-600 border-2 border-dashed border-gray-300 rounded-md hover:border-gray-400 hover:text-gray-700"
        >
          + Add Task
        </button>
      )}
    </div>
  );
}

export default Column;
