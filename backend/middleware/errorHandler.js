/**
 * Error Handler Middleware
 * Handles all errors and sends appropriate responses
 */

import { logger } from '../utils/logger.js';
import { AppError } from '../utils/errors.js';
import { HTTP_STATUS } from '../utils/constants.js';

export const errorHandler = (err, req, res, next) => {
  let error = err;
  let statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR;
  let message = 'Internal Server Error';

  // Handle custom AppError
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }
  // Handle Mongoose CastError (invalid ObjectId)
  else if (err.name === 'CastError') {
    statusCode = HTTP_STATUS.NOT_FOUND;
    message = 'Resource not found';
  }
  // Handle Mongoose duplicate key error
  else if (err.code === 11000) {
    statusCode = HTTP_STATUS.CONFLICT;
    message = 'Duplicate field value entered';
  }
  // Handle Mongoose validation error
  else if (err.name === 'ValidationError') {
    statusCode = HTTP_STATUS.BAD_REQUEST;
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(', ');
  }
  // Handle JWT errors
  else if (err.name === 'JsonWebTokenError') {
    statusCode = HTTP_STATUS.UNAUTHORIZED;
    message = 'Invalid token';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = HTTP_STATUS.UNAUTHORIZED;
    message = 'Token expired';
  }

  // Log error
  logger.error('Request error', err, {
    statusCode,
    path: req.path,
    method: req.method,
  });

  // Send response (include dev details when not in production)
  const responseBody = {
    success: false,
    message,
  };

  if (process.env.NODE_ENV !== 'production') {
    responseBody.error = err?.message;
    responseBody.stack = err?.stack;
  }

  res.status(statusCode).json(responseBody);
};
