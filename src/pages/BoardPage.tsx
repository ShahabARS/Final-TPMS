import { useState } from 'react';
import type { Task } from '../types';
import { TaskStatus } from '../types';
import Column from '../components/Column';

/**
 * BoardPage Component
 * 
 * Main Kanban board page with columns and tasks.
 * 
 * React concepts you'll see:
 * - useState: Managing tasks and columns state
 * - Event handlers: onClick functions for buttons and task cards
 * - Array methods: .map() to render columns and tasks
 * - Conditional rendering: Show modals based on state
 */
interface BoardPageProps {
  userEmail: string;
  onLogout: () => void;
}

function BoardPage({ userEmail, onLogout }: BoardPageProps) {
  // State for tasks - later this will come from API
  const [tasks, setTasks] = useState<Task[]>([
    // Sample tasks for demonstration
    {
      taskId: '1',
      title: 'Design Login Page',
      description: 'Create wireframes and mockups for the login interface',
      status: TaskStatus.TODO,
      deadline: new Date('2026-02-15'),
      effort: 4,
    },
    {
      taskId: '2',
      title: 'Implement Authentication',
      description: 'Set up user login and session management',
      status: TaskStatus.DOING,
      deadline: new Date('2026-02-12'),
      effort: 8,
      assignedTo: 'user1',
    },
    {
      taskId: '3',
      title: 'Setup Database',
      description: 'Configure MongoDB and create initial schemas',
      status: TaskStatus.DONE,
      deadline: new Date('2026-02-10'),
      effort: 6,
    },
  ]);

  // State for columns - dynamic, can be customized
  const [columns, setColumns] = useState<TaskStatus[]>([
    TaskStatus.TODO,
    TaskStatus.DOING,
    TaskStatus.DONE,
  ]);

  // State for which modal is open (we'll create modals next)
  const [openModal, setOpenModal] = useState<'none' | 'settings' | 'team' | 'createTask' | 'createColumn' | 'taskDetail'>('none');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Handler for when a task card is clicked
  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setOpenModal('taskDetail'); // We'll create this modal later
    console.log('Task clicked:', task);
  };

  // Handler for modal buttons
  const handleOpenModal = (modal: typeof openModal) => {
    setOpenModal(modal);
  };

  const handleCloseModal = () => {
    setOpenModal('none');
    setSelectedTask(null);
  };

  // Handler for creating a new task (will be implemented in modal)
  const handleCreateTask = (newTask: Task) => {
    setTasks([...tasks, newTask]);
    handleCloseModal();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header/Navbar */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">TPMS Board</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Welcome, {userEmail}</span>
            <button
              onClick={onLogout}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Board Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Action Buttons */}
        <div className="mb-6 flex flex-wrap gap-3">
          <button
            onClick={() => handleOpenModal('settings')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Board Settings
          </button>
          <button
            onClick={() => handleOpenModal('team')}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            Team Members
          </button>
          <button
            onClick={() => handleOpenModal('createTask')}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
          >
            Create Task
          </button>
          <button
            onClick={() => handleOpenModal('createColumn')}
            className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors"
          >
            Create Column
          </button>
        </div>

        {/* Kanban Columns */}
        <div className="flex gap-4 overflow-x-auto pb-4">
          {columns.map((columnStatus) => (
            <Column
              key={columnStatus}
              status={columnStatus}
              tasks={tasks}
              onTaskClick={handleTaskClick}
              onAddTask={columnStatus === TaskStatus.TODO ? () => handleOpenModal('createTask') : undefined}
            />
          ))}
        </div>

        {/* Modal Placeholders - We'll create actual modals next */}
        {openModal !== 'none' && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">
                  {openModal === 'settings' && 'Board Settings'}
                  {openModal === 'team' && 'Team Members'}
                  {openModal === 'createTask' && 'Create New Task'}
                  {openModal === 'createColumn' && 'Create New Column'}
                  {openModal === 'taskDetail' && 'Task Details'}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              <div className="text-gray-600">
                {openModal === 'taskDetail' && selectedTask ? (
                  <div>
                    <p className="font-semibold mb-2 text-lg">{selectedTask.title}</p>
                    <p className="text-sm mb-2">{selectedTask.description}</p>
                    <p className="text-xs text-gray-500">Status: {selectedTask.status}</p>
                  </div>
                ) : (
                  <p>Modal for "{openModal}" will be implemented next!</p>
                )}
              </div>
              <button
                onClick={handleCloseModal}
                className="mt-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default BoardPage;
