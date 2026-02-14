/**
 * Comments API
 */

import { apiRequest } from './client';
import type {
  CommentResponse,
  CommentsResponse,
  ApiSuccessResponse,
} from './types';

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

  /**
   * Delete comment
   */
  delete: async (taskId: string, commentId: string): Promise<ApiSuccessResponse> => {
    return apiRequest(`/tasks/${taskId}/comments/${commentId}`, {
      method: 'DELETE',
    });
  },
};
