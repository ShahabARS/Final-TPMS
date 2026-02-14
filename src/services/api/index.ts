/**
 * API Module
 * Central export point for all API functionality
 */

// Client and utilities
export {
  getToken,
  setToken,
  removeToken,
  ApiError,
  apiRequest,
} from './client';

// API operations
export { authApi } from './auth';
export { projectsApi } from './projects';
export { tasksApi } from './tasks';
export { commentsApi } from './comments';

// Types
export type {
  LoginRequest,
  RegisterRequest,
  UserResponse,
  AuthResponse,
  Project,
  ProjectResponse,
  ProjectsResponse,
  Task,
  TaskResponse,
  TasksResponse,
  Comment,
  CommentResponse,
  CommentsResponse,
  ApiSuccessResponse,
} from './types';
