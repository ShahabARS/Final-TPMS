/**
 * Tasks API
 */

import { apiRequest } from './client';
import type {
  Task,
  TaskResponse,
  TasksResponse,
  ApiSuccessResponse,
} from './types';
import type { TaskStatus } from '../../types';

interface CreateTaskRequest {
  projectId: string;
  title: string;
  description?: string;
  status?: TaskStatus;
  assignedTo?: string;
  deadline?: string;
  effort?: number;
}

export const tasksApi = {
  /**
   * Get all tasks for a project
   */
  getByProject: async (projectId: string): Promise<TasksResponse> => {
    return apiRequest<TasksResponse>(`/tasks?projectId=${projectId}`);
  },

  /**
   * Get single task by ID
   */
  getById: async (id: string): Promise<TaskResponse> => {
    return apiRequest<TaskResponse>(`/tasks/${id}`);
  },

  /**
   * Create new task
   */
  create: async (data: CreateTaskRequest): Promise<TaskResponse> => {
    // Sanitize data to ensure it's JSON serializable
    const sanitizedData = {
      projectId: String(data.projectId),
      title: String(data.title),
      description: data.description ? String(data.description) : undefined,
      status: data.status,
      assignedTo: data.assignedTo ? String(data.assignedTo) : undefined,
      deadline: data.deadline ? String(data.deadline) : undefined,
      effort: data.effort ? Number(data.effort) : undefined,
    };

    return apiRequest<TaskResponse>('/tasks', {
      method: 'POST',
      body: JSON.stringify(sanitizedData),
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
  delete: async (id: string): Promise<ApiSuccessResponse> => {
    return apiRequest(`/tasks/${id}`, {
      method: 'DELETE',
    });
  },
};
