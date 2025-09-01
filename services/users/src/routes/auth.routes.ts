import express, { Router } from 'express';
import { success, error, created, serverError, unauthorized } from '../utils/response';
import { validateRegistration, validateLogin } from '../middleware/validation.middleware';
import { findUserByEmail, updateUserProfile } from '../services/user.service';
import type { RegisterInput, LoginInput } from '../validators/auth.validator';
import { authenticateToken, optionalAuth } from '../middleware/auth';
import { AuthenticatedRequest } from '../types/api';
import {
  registerUserWithTokens,
  loginUserWithTokens,
  refreshAccessToken,
  verifyUserToken,
} from '../services/auth.service';

const router: express.Router = Router();

// Register endpoint
router.post('/register', validateRegistration, async (req, res) => {
  try {
    const registerData: RegisterInput = req.body;

    // Remove confirmPassword from data sent to service
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword, ...userData } = registerData;

    // Create user and generate tokens
    const { user, tokens } = await registerUserWithTokens(userData);

    return created(
      res,
      {
        user,
        ...tokens,
        message: 'Registration successful! Please verify your email to activate your account.',
      },
      'User registered successfully'
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Registration failed';

    // Handle specific errors
    if (message.includes('already exists')) {
      return error(res, message, 409); // Conflict
    }

    return error(res, message, 400);
  }
});

// Login endpoint
router.post('/login', validateLogin, async (req, res) => {
  try {
    const loginData: LoginInput = req.body;

    // Authenticate user and get tokens
    const result = await loginUserWithTokens(loginData);

    if (!result) {
      return unauthorized(res, 'Invalid email or password');
    }

    const { user, tokens } = result;

    return success(
      res,
      {
        user,
        ...tokens,
        message: 'Login successful!',
      },
      'User logged in successfully'
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Login failed';

    if (message.includes('deactivated')) {
      return error(res, 'Account is deactivated. Please contact support.', 403);
    }

    return unauthorized(res, message);
  }
});

// Refresh token endpoint
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return error(res, 'Refresh token is required', 400);
    }

    // Refresh tokens
    const result = await refreshAccessToken(refreshToken);

    if (!result) {
      return unauthorized(res, 'Invalid or expired refresh token');
    }

    const { user, tokens } = result;

    return success(
      res,
      {
        user,
        ...tokens,
        message: 'Tokens refreshed successfully',
      },
      'Tokens refreshed successfully'
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Token refresh failed';
    return unauthorized(res, message);
  }
});

// Verify token endpoint
router.post('/verify', async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return error(res, 'Token is required', 400);
    }

    const user = await verifyUserToken(token);

    if (!user) {
      return unauthorized(res, 'Invalid or expired token');
    }

    return success(
      res,
      {
        valid: true,
        user,
        message: 'Token is valid',
      },
      'Token verification successful'
    );
  } catch (_err) {
    return unauthorized(res, 'Token verification failed');
  }
});

// Logout endpoint (client-side token removal)
router.post('/logout', optionalAuth, (req, res) => {
  // TODO: Implement token blacklisting for logout in production environments.
  // Currently, logout is handled by client-side token removal only.
  success(
    res,
    {
      message: 'Successfully logged out. Please remove tokens from client storage.',
      user: (req as AuthenticatedRequest).user || null,
    },
    'Logout successful'
  );
});

// Get current user profile (protected route)
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const authReq = req as AuthenticatedRequest;

    if (!authReq.user) {
      return unauthorized(res, 'User not authenticated');
    }

    return success(res, authReq.user, 'Profile retrieved successfully');
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to get profile';
    return serverError(res, message);
  }
});

// Update user profile (protected route)
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const authReq = req as AuthenticatedRequest;

    if (!authReq.user) {
      return unauthorized(res, 'User not authenticated');
    }

    const updateData = req.body;

    // Update user profile
    const updatedUser = await updateUserProfile(authReq.user.id, updateData);

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
});

// Check email availability
router.get('/check-email/:email', async (req, res) => {
  try {
    const { email } = req.params;

    // Basic email format validation
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return error(res, 'Invalid email format', 400);
    }

    const existingUser = await findUserByEmail(email);

    return success(
      res,
      {
        email,
        available: !existingUser,
        exists: !!existingUser,
      },
      existingUser ? 'Email is already taken' : 'Email is available'
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to check email availability';
    return serverError(res, message);
  }
});

// Password reset request (placeholder)
router.post('/forgot-password', (req, res) => {
  // TODO: Implement password reset logic with email
  success(
    res,
    {
      message: 'Password reset instructions will be sent to your email if the account exists.',
    },
    'Password reset request received'
  );
});

export default router;
