/**
 * Authentication Routes (Refactored)
 * Uses the new authService for business logic
 */

import express from 'express';
import { authService } from '../services/authService.js';
import { protect } from '../middleware/auth.js';
import {
  validateRequiredFields,
  validateEmail,
  validatePassword,
} from '../middleware/validation.js';

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post(
  '/register',
  validateRequiredFields(['name', 'email', 'password']),
  validateEmail,
  validatePassword,
  async (req, res, next) => {
    try {
      const result = await authService.register(req.body);

      res.status(201).json({
        success: true,
        token: result.token,
        user: result.user,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post(
  '/login',
  validateRequiredFields(['email', 'password']),
  validateEmail,
  async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);

      res.json({
        success: true,
        token: result.token,
        user: result.user,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @route   GET /api/auth/me
 * @desc    Get current user details
 * @access  Private
 */
router.get('/me', protect, async (req, res, next) => {
  try {
    const user = await authService.getCurrentUser(req.user._id);

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
