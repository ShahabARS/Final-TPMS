import { useState, useEffect } from 'react';
import type { Task, Project, User } from '../types';
import { TaskStatus, Role } from '../types';
import Column from '../components/Column';
import CreateTaskModal from '../modals/CreateTaskModal';
import TaskDetailModal from '../modals/TaskDetailModal';
import BoardSettingsModal from '../modals/BoardSettingsModal';
import TeamMembersModal from '../modals/TeamMembersModal';
import CreateColumnModal from '../modals/CreateColumnModal';
import { projectsApi, tasksApi, type Task as ApiTask, type UserResponse } from '../services/api';

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
  // State for loading and errors
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for tasks - loaded from API
  const [tasks, setTasks] = useState<Task[]>([]);

  // State for columns
  const [columns, setColumns] = useState<string[]>([
    TaskStatus.TODO,
    TaskStatus.DOING,
    TaskStatus.DONE,
  ]);

  // State for project (board settings)
  const [project, setProject] = useState<Project | null>(null);

  // State for team members
  const [teamMembers, setTeamMembers] = useState<User[]>([]);

  // State for current user role
  const [currentUserRole, setCurrentUserRole] = useState<Role>(Role.MEMBER);

  // State for which modal is open
  const [openModal, setOpenModal] = useState<
    'none' | 'settings' | 'team' | 'createTask' | 'createColumn' | 'taskDetail'
  >('none');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Load project and tasks on component mount
  useEffect(() => {
    const loadBoardData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Get all projects for user
        const projectsRes = await projectsApi.getAll();
        
        if (projectsRes.data.length === 0) {
          setError('No projects found. Please create a project first.');
          setIsLoading(false);
          return;
        }

        // Use the first project
        const apiProject = projectsRes.data[0];
        
        // Convert API Project to internal Project type
        const leaderId = typeof apiProject.leaderId === 'string' ? apiProject.leaderId : (apiProject.leaderId as Record<string, string>)._id;
        const convertedProject: Project = {
          projectId: apiProject._id,
          name: apiProject.name,
          description: apiProject.description,
          leaderId: leaderId,
        };

        setProject(convertedProject);

        // Load columns if they exist in the project
        if (apiProject.columns && apiProject.columns.length > 0) {
          setColumns(apiProject.columns);
        }

        // Get tasks for this project
        const tasksRes = await tasksApi.getByProject(apiProject._id);
        
        // Convert API Tasks to internal Task type
        const convertedTasks: Task[] = tasksRes.data.map((apiTask: ApiTask) => ({
          taskId: apiTask._id,
          title: apiTask.title,
          description: apiTask.description,
          status: apiTask.status as TaskStatus,
          deadline: apiTask.deadline ? new Date(apiTask.deadline) : undefined,
          effort: apiTask.effort,
          assignedTo: apiTask.assignedTo,
        }));

        setTasks(convertedTasks);

        // Get project members
        const membersRes = await projectsApi.getMembers(apiProject._id);
        
        // Convert API UserResponse to internal User type
        const convertedMembers: User[] = membersRes.data.map((member: UserResponse) => ({
          userId: member.userId,
          name: member.name,
          email: member.email,
          role: member.role as Role,
        }));

        setTeamMembers(convertedMembers);

        // Determine current user role based on email
        const currentMember = convertedMembers.find(m => m.email === userEmail);
        if (currentMember) {
          setCurrentUserRole(currentMember.role);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load board data';
        setError(message);
        console.error('Error loading board data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    void loadBoardData();
  }, [userEmail]);

  // Handler for creating a new task
  const handleCreateTask = async (newTaskData: Omit<Task, 'taskId'>) => {
    try {
      if (!project) return;

      // Convert deadline to ISO string safely
      const deadlineString = newTaskData.deadline instanceof Date 
        ? newTaskData.deadline.toISOString() 
        : newTaskData.deadline ? new Date(newTaskData.deadline).toISOString() : undefined;

      // Create task via API
      const response = await tasksApi.create({
        projectId: project.projectId,
        title: newTaskData.title,
        description: newTaskData.description,
        status: newTaskData.status,
        assignedTo: newTaskData.assignedTo,
        deadline: deadlineString,
        effort: newTaskData.effort,
      });

      // Add task to local state
      const newTask: Task = {
        taskId: response.data._id,
        title: response.data.title,
        description: response.data.description,
        status: response.data.status as TaskStatus,
        deadline: response.data.deadline ? new Date(response.data.deadline) : undefined,
        effort: response.data.effort,
        assignedTo: response.data.assignedTo,
      };

      setTasks([...tasks, newTask]);
      handleCloseModal();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create task';
      alert(`Error creating task: ${message}`);
      console.error('Error creating task:', err);
    }
  };

  // Handler for updating a task
  const handleUpdateTask = async (taskId: string, updates: Partial<Task>) => {
    try {
      // Update task via API
      await tasksApi.update(taskId, {
        ...updates,
        deadline: updates.deadline?.toISOString(),
      });

      // Update in local state
      setTasks(
        tasks.map((task) => (task.taskId === taskId ? { ...task, ...updates } : task))
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update task';
      alert(`Error updating task: ${message}`);
      console.error('Error updating task:', err);
    }
  };

  // Handler for deleting a task
  const handleDeleteTask = async (taskId: string) => {
    try {
      // Delete task via API
      await tasksApi.delete(taskId);

      // Remove from local state
      setTasks(tasks.filter((task) => task.taskId !== taskId));
      handleCloseModal();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete task';
      alert(`Error deleting task: ${message}`);
      console.error('Error deleting task:', err);
    }
  };

  // Handler for updating project
  const handleUpdateProject = async (projectId: string, updates: Partial<Project>) => {
    try {
      if (!project || project.projectId !== projectId) return;

      // Update project via API
      await projectsApi.update(projectId, {
        name: updates.name,
        description: updates.description,
        columns: updates.description ? undefined : columns,
      });

      // Update in local state
      setProject({ ...project, ...updates });
      handleCloseModal();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update project';
      alert(`Error updating project: ${message}`);
      console.error('Error updating project:', err);
    }
  };

  // Handler for creating a new column
  const handleCreateColumn = async (columnName: string) => {
    try {
      if (!project) return;

      // Check if column already exists
      if (columns.includes(columnName)) {
        alert('Column already exists');
        return;
      }

      // Update project with new columns
      const newColumns = [...columns, columnName];
      await projectsApi.update(project.projectId, {
        columns: newColumns,
      });

      // Add new column to local state
      setColumns(newColumns);
      handleCloseModal();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create column';
      alert(`Error creating column: ${message}`);
      console.error('Error creating column:', err);
    }
  };

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

  // Show error state
  if (error && !isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="max-w-md p-8 bg-white rounded-lg shadow-md">
          <h2 className="mb-4 text-xl font-bold text-red-600">Error</h2>
          <p className="mb-6 text-gray-700">{error}</p>
          <button
            onClick={onLogout}
            className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-b-2 border-blue-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading board...</p>
        </div>
      </div>
    );
  }

  // Show empty state if no project
  if (!project) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="max-w-md p-8 bg-white rounded-lg shadow-md">
          <h2 className="mb-4 text-xl font-bold text-gray-800">No Project Found</h2>
          <p className="mb-6 text-gray-600">You don't have any projects yet.</p>
          <button
            onClick={onLogout}
            className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header/Navbar */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-4 py-4 mx-auto max-w-7xl">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{project.name}</h1>
            <p className="text-sm text-gray-500">{project.description}</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Welcome, {userEmail}</span>
            <button
              onClick={onLogout}
              className="px-4 py-2 text-gray-700 transition-colors bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Board Content */}
      <main className="px-4 py-8 mx-auto max-w-7xl">
        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={() => handleOpenModal('settings')}
            className="px-4 py-2 text-white transition-colors bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Board Settings
          </button>
          <button
            onClick={() => handleOpenModal('team')}
            className="px-4 py-2 text-white transition-colors bg-green-600 rounded-md hover:bg-green-700"
          >
            Team Members
          </button>
          <button
            onClick={() => handleOpenModal('createTask')}
            className="px-4 py-2 text-white transition-colors bg-purple-600 rounded-md hover:bg-purple-700"
          >
            Create Task
          </button>
          <button
            onClick={() => handleOpenModal('createColumn')}
            className="px-4 py-2 text-white transition-colors bg-orange-600 rounded-md hover:bg-orange-700"
          >
            Create Column
          </button>
        </div>

        {/* Kanban Columns */}
        <div className="flex gap-4 pb-4 overflow-x-auto">
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
        currentUserRole={currentUserRole}
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
