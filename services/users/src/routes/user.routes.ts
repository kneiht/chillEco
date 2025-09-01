import express, { Router, Response } from 'express';
import { success, error, serverError, forbidden } from '../utils/response';
import { authenticateToken } from '../middleware/auth';
import { validateRequest } from '../middleware/validation.middleware';
import { updateProfileSchema, changePasswordSchema } from '../validators/auth.validator';
import {
  findUserById,
  updateUserProfile,
  deactivateUser,
  getUserStats,
  changeUserPassword,
  getUserActivity,
} from '../services/user.service';
import type { AuthenticatedRequest } from '../types/api';

const router: express.Router = Router();

// Apply authentication to all routes
router.use(authenticateToken);

// Get current user profile
router.get('/profile', async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return error(res, 'User not authenticated', 401);
    }

    // Get full user details
    const user = await findUserById(req.user.id);

    if (!user) {
      return error(res, 'User not found', 404);
    }

    return success(res, user, 'Profile retrieved successfully');
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to get profile';
    return serverError(res, message);
  }
});

// Update user profile
router.put(
  '/profile',
  validateRequest(updateProfileSchema),
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.user) {
        return error(res, 'User not authenticated', 401);
      }

      const updateData = req.body;

      // Update user profile
      const updatedUser = await updateUserProfile(req.user.id, updateData);

      if (!updatedUser) {
        return error(res, 'Failed to update profile', 400);
      }

      return success(res, updatedUser, 'Profile updated successfully');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update profile';

      if (message.includes('already taken')) {
        return error(res, message, 409);
      }

      return error(res, message, 400);
    }
  }
);

// Change password
router.put(
  '/password',
  validateRequest(changePasswordSchema),
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      if (!req.user) {
        return error(res, 'User not authenticated', 401);
      }

      const { currentPassword, newPassword } = req.body;

      const success_result = await changeUserPassword(req.user.id, currentPassword, newPassword);

      if (!success_result) {
        return error(res, 'Current password is incorrect', 400);
      }

      return success(
        res,
        {
          message: 'Password changed successfully. Please login again with your new password.',
        },
        'Password updated successfully'
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to change password';
      return error(res, message, 400);
    }
  }
);

// Deactivate account
router.post('/deactivate', async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return error(res, 'User not authenticated', 401);
    }

    const deactivatedUser = await deactivateUser(req.user.id);

    if (!deactivatedUser) {
      return error(res, 'Failed to deactivate account', 400);
    }

    return success(
      res,
      {
        message: 'Account deactivated successfully. You have been logged out.',
        user: deactivatedUser,
      },
      'Account deactivated successfully'
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to deactivate account';
    return serverError(res, message);
  }
});

// Get user activity (placeholder for future implementation)
router.get('/activity', async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return error(res, 'User not authenticated', 401);
    }

    const userActivity = await getUserActivity(req.user.id);

    // TODO: Implement user activity tracking
    return success(res, userActivity, 'User activity retrieved');
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to get user activity';
    return serverError(res, message);
  }
});

// Admin routes (for future role-based access)
router.get('/admin/stats', async (req: AuthenticatedRequest, res: Response) => {
  try {
    // TODO: Add admin role check
    forbidden(res, 'Admin access required');
    const stats = await getUserStats();

    return success(res, stats, 'User statistics retrieved');
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to get user statistics';
    return serverError(res, message);
  }
});

export default router;
