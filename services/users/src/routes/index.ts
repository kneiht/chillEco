import express, { Router } from 'express';
import { success, error } from '../utils/response';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import testRoutes from './test.routes';
import { getDbConnectionStatus } from '../config/database';
import { isDevelopment } from '../config/environment';

const router: express.Router = Router();

router.use('/auth', authRoutes);
router.use('/user', userRoutes);

if (isDevelopment) {
  router.use('/test', testRoutes);
}

// Welcome route
router.get('/', (req, res) => {
  success(res, {
    message: 'Welcome to the Users service!',
    environment: process.env.NODE_ENV,
    // TODO: add more info like available endpoints, version, etc.
  });
});

// Health check
router.get('/health', (_req, res) => {
  success(res, {
    status: 'ok',
    service: 'users',
    environment: process.env.NODE_ENV,
    database: getDbConnectionStatus(),
    timestamp: new Date().toISOString(),
  });
});

// Test error
router.get('/error', (_req, _res) => {
  throw new Error('Test error');
});

// 404 handler
router.use('*', (_req, res) => {
  error(res, 'Not found', 404);
});

export default router;
