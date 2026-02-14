import User from '../models/User.js';
import { authService } from '../services/authService.js';
import { AuthenticationError, AuthorizationError } from '../utils/errors.js';
import { ERROR_MESSAGES } from '../utils/constants.js';

/**
 * Authentication Middleware
 * 
 * Verifies JWT token and attaches user to request object
 * Use this middleware on protected routes
 */
export const protect = async (req, res, next) => {
  try {
    let token;

    // Get token from Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw new AuthenticationError(ERROR_MESSAGES.INVALID_TOKEN);
    }

    try {
      // Verify and decode token
      const decoded = authService.verifyToken(token);

      // Get user from token (exclude password)
      req.user = await User.findById(decoded.id).select('-passwordHash');

      if (!req.user) {
        throw new AuthenticationError(ERROR_MESSAGES.USER_NOT_FOUND);
      }

      next();
    } catch (error) {
      if (error instanceof AuthenticationError) {
        next(error);
      } else {
        next(new AuthenticationError(ERROR_MESSAGES.INVALID_TOKEN));
      }
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Role-based Authorization Middleware
 * 
 * Checks if user has required role
 * Usage: authorize('ADMIN', 'LEADER')
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AuthenticationError(ERROR_MESSAGES.UNAUTHORIZED));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new AuthorizationError(ERROR_MESSAGES.FORBIDDEN)
      );
    }

    next();
  };
};
