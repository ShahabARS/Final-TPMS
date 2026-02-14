/**
 * Shared API Types
 */

import type { Role, TaskStatus } from '../../types';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role?: Role;
}

export interface UserResponse {
  userId: string;
  name: string;
  email: string;
  role: Role;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: UserResponse;
}

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

export interface Task {
  _id: string;
  projectId: string;
  epicId?: string;
  title: string;
  description: string;
  assignedTo?: string;
  deadline?: string;
  effort?: number;
  status: TaskStatus;
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

export interface ApiSuccessResponse {
  success: boolean;
  message?: string;
}
