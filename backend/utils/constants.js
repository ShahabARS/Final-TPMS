/**
 * Application Constants
 */

export const ROLES = {
  ADMIN: 'ADMIN',
  LEADER: 'LEADER',
  MEMBER: 'MEMBER',
};

export const TASK_STATUS = {
  TODO: 'TODO',
  DOING: 'DOING',
  DONE: 'DONE',
};

export const DEFAULT_ROLE = ROLES.MEMBER;

export const JWT_EXPIRY = '30d';

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
};

export const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: 'Invalid email or password',
  USER_NOT_FOUND: 'User not found',
  USER_ALREADY_EXISTS: 'User already exists with this email',
  MISSING_REQUIRED_FIELDS: 'Missing required fields',
  UNAUTHORIZED: 'Not authorized to access this resource',
  FORBIDDEN: 'Insufficient permissions',
  INVALID_TOKEN: 'Invalid or expired token',
  PROJECT_NOT_FOUND: 'Project not found',
  TASK_NOT_FOUND: 'Task not found',
  COMMENT_NOT_FOUND: 'Comment not found',
};
