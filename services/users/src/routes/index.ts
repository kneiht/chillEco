import express, { Router } from 'express';
import { success, error } from '../utils/response';
import mongoose from 'mongoose';
import authRoutes from './auth.routes';

const router: express.Router = Router();

router.use('/auth', authRoutes);

// Health check
router.get('/health', (_req, res) => {
  success(res, {
    status: 'ok',
    service: 'users',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
router.use('*', (_req, res) => {
  error(res, 'Not found', 404);
});

export default router;
