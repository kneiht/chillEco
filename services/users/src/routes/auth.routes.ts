import express, { Router } from 'express';
import { success, error, created, serverError } from '../utils/response';
import { validateRegistration, validateLogin } from '../middleware/validation.middleware';
import { createUser, authenticateUser, findUserByEmail } from '../services/user.service';
import type { RegisterInput, LoginInput } from '../validators/auth.validator';

const router: express.Router = Router();

// Register endpoint
router.post('/register', validateRegistration, async (req, res) => {
  try {
    const registerData: RegisterInput = req.body;

    // Remove confirmPassword from data sent to service
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword, ...userData } = registerData;

    // Create user
    const newUser = await createUser(userData);

    created(
      res,
      {
        user: newUser,
        message: 'Registration successful! Please verify your email to activate your account.',
      },
      'User registered successfully'
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Registration failed';

    // Handle specific errors
    if (message.includes('already exists')) {
      error(res, message, 409); // Conflict
    }

    error(res, message, 400);
  }
});

// Login endpoint
router.post('/login', validateLogin, async (req, res) => {
  try {
    const loginData: LoginInput = req.body;

    // Authenticate user
    const user = await authenticateUser(loginData);

    if (!user) {
      error(res, 'Invalid email or password', 401);
    }

    // TODO: Generate JWT token (will implement in next checkpoint)
    success(
      res,
      {
        user,
        token: 'jwt_token_placeholder',
        message: 'Login successful!',
      },
      'User logged in successfully'
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Login failed';

    if (message.includes('deactivated')) {
      error(res, 'Account is deactivated. Please contact support.', 403);
    }

    error(res, message, 401);
  }
});

// Logout endpoint
router.post('/logout', (req, res) => {
  // TODO: Implement token blacklisting (will implement with JWT)
  success(
    res,
    {
      message: 'Successfully logged out',
    },
    'Logout successful'
  );
});

// Check email availability
router.get('/check-email/:email', async (req, res) => {
  try {
    const { email } = req.params;

    // Basic email format validation
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      error(res, 'Invalid email format', 400);
    }

    const existingUser = await findUserByEmail(email);

    success(
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
    serverError(res, message);
  }
});

// Password reset request (placeholder)
router.post('/forgot-password', (req, res) => {
  // TODO: Implement password reset logic
  success(
    res,
    {
      message: 'Password reset instructions will be sent to your email if the account exists.',
    },
    'Password reset request received'
  );
});

// Profile routes (will be protected with JWT later)
router.get('/profile', (req, res) => {
  // TODO: Implement with JWT authentication
  error(res, 'Authentication required', 401);
});

router.put('/profile', (req, res) => {
  // TODO: Implement with JWT authentication
  error(res, 'Authentication required', 401);
});

export default router;
