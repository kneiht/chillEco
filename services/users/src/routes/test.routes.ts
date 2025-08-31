import express, { Router } from 'express';
import { success, error, serverError } from '../utils/response.js';
import { createUser, findUserByEmail, getUserStats } from '../services/user.service.js';

const router: express.Router = Router();

// Test user creation
router.post('/create-test-user', async (req, res) => {
  try {
    const testUser = {
      email: `test${Date.now()}example.com`,
      password: 'testpassword123',
      username: `testuser${Date.now()}`,
      firstName: 'Test',
      lastName: 'User',
    };

    const user = await createUser(testUser);
    success(res, user, 'Test user created successfully', 201);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to create test user';
    error(res, message, 400);
  }
});

// Test user lookup
router.get('/find-user/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const user = await findUserByEmail(email);

    if (user) {
      success(res, user, 'User found');
    } else {
      error(res, 'User not found', 404);
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to find user';
    serverError(res, message);
  }
});

// Get user statistics
router.get('/stats', async (req, res) => {
  try {
    const stats = await getUserStats();
    success(res, stats, 'User statistics retrieved');
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to get user statistics';
    serverError(res, message);
  }
});

export default router;
