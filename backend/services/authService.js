/**
 * Authentication Service
 * Handles all authentication business logic
 */

import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import {
  AuthenticationError,
  ValidationError,
  ConflictError,
} from '../utils/errors.js';
import {
  DEFAULT_ROLE,
  JWT_EXPIRY,
  ERROR_MESSAGES,
} from '../utils/constants.js';
import { logger } from '../utils/logger.js';

/**
 * Generate JWT Token
 */
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: JWT_EXPIRY,
  });
};

/**
 * Format user response (exclude sensitive data)
 */
const formatUserResponse = (user) => ({
  userId: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
});

export const authService = {
  /**
   * Register a new user
   */
  register: async (data) => {
    const { name, email, password, role } = data;

    // Validation
    if (!name || !email || !password) {
      throw new ValidationError(ERROR_MESSAGES.MISSING_REQUIRED_FIELDS);
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      logger.warn('Registration failed: user already exists', { email });
      throw new ConflictError(ERROR_MESSAGES.USER_ALREADY_EXISTS);
    }

    try {
      // Create user
      const user = await User.create({
        name: name.trim(),
        email: email.toLowerCase(),
        passwordHash: password,
        role: role || DEFAULT_ROLE,
      });

      logger.info('New user registered', { userId: user._id, email: user.email });

      // Generate token
      const token = generateToken(user._id);

      return {
        token,
        user: formatUserResponse(user),
      };
    } catch (error) {
      logger.error('Error during registration', error, { email });
      throw error;
    }
  },

  /**
   * Login user
   */
  login: async (email, password) => {
    // Validation
    if (!email || !password) {
      throw new ValidationError(ERROR_MESSAGES.MISSING_REQUIRED_FIELDS);
    }

    try {
      // Find user
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        logger.warn('Login failed: user not found', { email });
        throw new AuthenticationError(ERROR_MESSAGES.INVALID_CREDENTIALS);
      }

      // Check password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        logger.warn('Login failed: invalid password', { email });
        throw new AuthenticationError(ERROR_MESSAGES.INVALID_CREDENTIALS);
      }

      logger.info('User logged in', { userId: user._id, email: user.email });

      // Generate token
      const token = generateToken(user._id);

      return {
        token,
        user: formatUserResponse(user),
      };
    } catch (error) {
      if (error instanceof AuthenticationError) {
        throw error;
      }
      logger.error('Error during login', error, { email });
      throw error;
    }
  },

  /**
   * Get current user
   */
  getCurrentUser: async (userId) => {
    try {
      const user = await User.findById(userId).select('-passwordHash');

      if (!user) {
        throw new AuthenticationError(ERROR_MESSAGES.USER_NOT_FOUND);
      }

      return formatUserResponse(user);
    } catch (error) {
      logger.error('Error fetching current user', error, { userId });
      throw error;
    }
  },

  /**
   * Verify and decode JWT token
   */
  verifyToken: (token) => {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw new AuthenticationError(ERROR_MESSAGES.INVALID_TOKEN);
    }
  },
};
