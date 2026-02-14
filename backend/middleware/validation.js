/**
 * Input Validation Middleware
 * Validates incoming request data
 */

import { ValidationError } from '../utils/errors.js';

/**
 * Validate required fields
 */
export const validateRequiredFields = (fields) => {
  return (req, res, next) => {
    const missingFields = fields.filter(field => !req.body[field]);

    if (missingFields.length > 0) {
      next(
        new ValidationError(
          `Missing required fields: ${missingFields.join(', ')}`
        )
      );
    } else {
      next();
    }
  };
};

/**
 * Validate email format
 */
export const validateEmail = (req, res, next) => {
  const email = req.body.email;
  const emailRegex = /^\S+@\S+\.\S+$/;

  if (email && !emailRegex.test(email)) {
    next(new ValidationError('Invalid email format'));
  } else {
    next();
  }
};

/**
 * Validate password strength
 */
export const validatePassword = (req, res, next) => {
  const password = req.body.password;

  if (password && password.length < 6) {
    next(new ValidationError('Password must be at least 6 characters'));
  } else {
    next();
  }
};
