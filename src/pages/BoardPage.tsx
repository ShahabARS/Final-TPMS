import { useState } from 'react';
import type { Task, Project, User } from '../types';
import { TaskStatus, Role } from '../types';
import Column from '../components/Column';
import CreateTaskModal from '../modals/CreateTaskModal';
import TaskDetailModal from '../modals/TaskDetailModal';
import BoardSettingsModal from '../modals/BoardSettingsModal';
import TeamMembersModal from '../modals/TeamMembersModal';
import CreateColumnModal from '../modals/CreateColumnModal';

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
  // Using string[] to allow custom columns beyond the TaskStatus enum
  const [columns, setColumns] = useState<string[]>([
    TaskStatus.TODO,
    TaskStatus.DOING,
    TaskStatus.DONE,
  ]);

  // State for project (board settings)
  const [project, setProject] = useState<Project>({
    projectId: '1',
    name: 'TPMS Project',
    description: 'Team Project Management System',
    leaderId: 'leader1',
  });

  // State for team members
  const [teamMembers, setTeamMembers] = useState<User[]>([
    {
      userId: 'leader1',
      name: 'John Doe',
      email: 'john@example.com',
      role: Role.LEADER,
    },
    {
      userId: 'member1',
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: Role.MEMBER,
    },
    {
      userId: 'member2',
      name: 'Bob Johnson',
      email: 'bob@example.com',
      role: Role.MEMBER,
    },
  ]);

  // State for which modal is open
  const [openModal, setOpenModal] = useState<
    'none' | 'settings' | 'team' | 'createTask' | 'createColumn' | 'taskDetail'
  >('none');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Handler for when a task card is clicked
  const handleTaskClick = (task: Task) => {
    setSelectedTask(task);
    setOpenModal('taskDetail');
  };

  // Handler for modal buttons
  const handleOpenModal = (modal: typeof openModal) => {
    setOpenModal(modal);
  };

  const handleCloseModal = () => {
    setOpenModal('none');
    setSelectedTask(null);
  };

  // Handler for creating a new task
  const handleCreateTask = (newTaskData: Omit<Task, 'taskId'>) => {
    const newTask: Task = {
      ...newTaskData,
      taskId: `task-${Date.now()}`,
    };
    setTasks([...tasks, newTask]);
    handleCloseModal();
  };

  // Handler for updating a task
  const handleUpdateTask = (taskId: string, updates: Partial<Task>) => {
    setTasks(
      tasks.map((task) => (task.taskId === taskId ? { ...task, ...updates } : task))
    );
  };

  // Handler for deleting a task
  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter((task) => task.taskId !== taskId));
  };

  // Handler for updating project
  const handleUpdateProject = (projectId: string, updates: Partial<Project>) => {
    if (project.projectId === projectId) {
      setProject({ ...project, ...updates });
    }
  };

  // Handler for creating a new column
  const handleCreateColumn = (columnName: string) => {
    // Check if column already exists
    if (columns.includes(columnName)) {
      return;
    }
    // Add new column
    setColumns([...columns, columnName]);
    handleCloseModal();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header/Navbar */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{project.name}</h1>
            <p className="text-sm text-gray-500">{project.description}</p>
          </div>
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
              status={columnStatus as TaskStatus}
              tasks={tasks}
              onTaskClick={handleTaskClick}
              onAddTask={
                columnStatus === TaskStatus.TODO
                  ? () => handleOpenModal('createTask')
                  : undefined
              }
            />
          ))}
        </div>
      </main>

      {/* Modals */}
      <CreateTaskModal
        isOpen={openModal === 'createTask'}
        onClose={handleCloseModal}
        onCreateTask={handleCreateTask}
        availableStatuses={columns as TaskStatus[]}
      />

      <TaskDetailModal
        isOpen={openModal === 'taskDetail'}
        onClose={handleCloseModal}
        task={selectedTask}
        onUpdateTask={handleUpdateTask}
        onDeleteTask={handleDeleteTask}
        availableStatuses={columns as TaskStatus[]}
        currentUserId="current-user-1"
      />

      <BoardSettingsModal
        isOpen={openModal === 'settings'}
        onClose={handleCloseModal}
        project={project}
        onUpdateProject={handleUpdateProject}
      />

      <TeamMembersModal
        isOpen={openModal === 'team'}
        onClose={handleCloseModal}
        members={teamMembers}
        currentUserRole={Role.LEADER}
      />

      <CreateColumnModal
        isOpen={openModal === 'createColumn'}
        onClose={handleCloseModal}
        existingColumns={columns}
        onCreateColumn={handleCreateColumn}
      />
    </div>
  );
}

export default BoardPage;
