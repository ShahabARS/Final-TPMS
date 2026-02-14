/**
 * Authentication API
 */

import { apiRequest } from './client';
import type { AuthResponse, LoginRequest, RegisterRequest, UserResponse } from './types';

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
   * Get current user details
   */
  getMe: async (): Promise<{ success: boolean; user: UserResponse }> => {
    return apiRequest('/auth/me');
  },
};
