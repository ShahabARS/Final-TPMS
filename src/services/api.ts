/**
 * API Service Layer
 * 
 * Centralized API calls for the frontend
 * All API requests go through this service
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Get auth token from localStorage
 */
const getToken = (): string | null => {
  return localStorage.getItem('token');
};

/**
 * Set auth token in localStorage
 */
export const setToken = (token: string): void => {
  localStorage.setItem('token', token);
};

/**
 * Remove auth token from localStorage
 */
export const removeToken = (): void => {
  localStorage.removeItem('token');
};

/**
 * Generic fetch wrapper with auth
 */
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = getToken();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'API request failed');
  }

  return data;
};

// ==================== AUTH API ====================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role?: 'ADMIN' | 'LEADER' | 'MEMBER';
}

export interface UserResponse {
  userId: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'LEADER' | 'MEMBER';
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: UserResponse;
}

export const authApi = {
  /**
   * Register a new user
   */
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    return apiRequest<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Login user
   */
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    return apiRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Get current user
   */
  getMe: async (): Promise<{ success: boolean; user: UserResponse }> => {
    return apiRequest('/auth/me');
  },
};

// ==================== PROJECTS API ====================

export interface Project {
  _id: string;
  name: string;
  description: string;
  leaderId: string;
  members: string[];
  columns: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ProjectsResponse {
  success: boolean;
  count: number;
  data: Project[];
}

export interface ProjectResponse {
  success: boolean;
  data: Project;
}

export const projectsApi = {
  /**
   * Get all projects for current user
   */
  getAll: async (): Promise<ProjectsResponse> => {
    return apiRequest<ProjectsResponse>('/projects');
  },

  /**
   * Get single project
   */
  getById: async (id: string): Promise<ProjectResponse> => {
    return apiRequest<ProjectResponse>(`/projects/${id}`);
  },

  /**
   * Create new project
   */
  create: async (data: {
    name: string;
    description?: string;
    columns?: string[];
  }): Promise<ProjectResponse> => {
    return apiRequest<ProjectResponse>('/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Update project
   */
  update: async (
    id: string,
    data: Partial<Project>
  ): Promise<ProjectResponse> => {
    return apiRequest<ProjectResponse>(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  /**
   * Get project members
   */
  getMembers: async (
    id: string
  ): Promise<{ success: boolean; count: number; data: UserResponse[] }> => {
    return apiRequest(`/projects/${id}/members`);
  },
};

// ==================== TASKS API ====================

export interface Task {
  _id: string;
  projectId: string;
  epicId?: string;
  title: string;
  description: string;
  assignedTo?: string;
  deadline?: string;
  effort?: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface TasksResponse {
  success: boolean;
  count: number;
  data: Task[];
}

export interface TaskResponse {
  success: boolean;
  data: Task;
}

export const tasksApi = {
  /**
   * Get all tasks for a project
   */
  getByProject: async (projectId: string): Promise<TasksResponse> => {
    return apiRequest<TasksResponse>(`/tasks?projectId=${projectId}`);
  },

  /**
   * Get single task
   */
  getById: async (id: string): Promise<TaskResponse> => {
    return apiRequest<TaskResponse>(`/tasks/${id}`);
  },

  /**
   * Create new task
   */
  create: async (data: {
    projectId: string;
    title: string;
    description?: string;
    status?: string;
    assignedTo?: string;
    deadline?: string;
    effort?: number;
  }): Promise<TaskResponse> => {
    return apiRequest<TaskResponse>('/tasks', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Update task
   */
  update: async (id: string, data: Partial<Task>): Promise<TaskResponse> => {
    return apiRequest<TaskResponse>(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  /**
   * Delete task
   */
  delete: async (id: string): Promise<{ success: boolean; message: string }> => {
    return apiRequest(`/tasks/${id}`, {
      method: 'DELETE',
    });
  },
};

// ==================== COMMENTS API ====================

export interface Comment {
  _id: string;
  taskId: string;
  userId: string;
  text: string;
  createdAt: string;
  updatedAt: string;
}

export interface CommentsResponse {
  success: boolean;
  count: number;
  data: Comment[];
}

export interface CommentResponse {
  success: boolean;
  data: Comment;
}

export const commentsApi = {
  /**
   * Get comments for a task
   */
  getByTask: async (taskId: string): Promise<CommentsResponse> => {
    return apiRequest<CommentsResponse>(`/tasks/${taskId}/comments`);
  },

  /**
   * Add comment to task
   */
  create: async (
    taskId: string,
    text: string
  ): Promise<CommentResponse> => {
    return apiRequest<CommentResponse>(`/tasks/${taskId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ text }),
    });
  },
};
