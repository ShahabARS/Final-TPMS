/**
 * Projects API
 */

import { apiRequest } from './client';
import type {
  Project,
  ProjectResponse,
  ProjectsResponse,
  UserResponse,
  ApiSuccessResponse,
} from './types';

export const projectsApi = {
  /**
   * Get all projects for current user
   */
  getAll: async (): Promise<ProjectsResponse> => {
    return apiRequest<ProjectsResponse>('/projects');
  },

  /**
   * Get single project by ID
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
   * Update project details
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

  /**
   * Delete project
   */
  delete: async (id: string): Promise<ApiSuccessResponse> => {
    return apiRequest(`/projects/${id}`, {
      method: 'DELETE',
    });
  },

  /**
   * Add member to project
   */
  addMember: async (
    projectId: string,
    memberId: string
  ): Promise<ProjectResponse> => {
    return apiRequest<ProjectResponse>(`/projects/${projectId}/members`, {
      method: 'POST',
      body: JSON.stringify({ memberId }),
    });
  },

  /**
   * Remove member from project
   */
  removeMember: async (
    projectId: string,
    memberId: string
  ): Promise<ProjectResponse> => {
    return apiRequest<ProjectResponse>(
      `/projects/${projectId}/members/${memberId}`,
      {
        method: 'DELETE',
      }
    );
  },
};
