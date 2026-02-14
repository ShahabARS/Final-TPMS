// Type definitions for our application

export const Role = {
  ADMIN: 'ADMIN',
  LEADER: 'LEADER',
  MEMBER: 'MEMBER',
} as const;

export type Role = typeof Role[keyof typeof Role];

export const TaskStatus = {
  TODO: 'TODO',
  DOING: 'DOING',
  DONE: 'DONE',
} as const;

export type TaskStatus = typeof TaskStatus[keyof typeof TaskStatus];

export interface User {
  userId: string;
  name: string;
  email: string;
  role: Role;
}

export interface Project {
  projectId: string;
  name: string;
  description: string;
  leaderId: string;
}

export interface Task {
  taskId: string;
  epicId?: string;
  title: string;
  description: string;
  assignedTo?: string;
  deadline?: Date;
  effort?: number;
  status: TaskStatus;
}

export interface Comment {
  commentId: string;
  taskId: string;
  userId: string;
  text: string;
  createdAt: Date;
}
