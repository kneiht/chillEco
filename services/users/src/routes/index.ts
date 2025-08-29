import express, { Router } from 'express';
import { success } from '../utils/response';
import mongoose from 'mongoose';

const router: express.Router = Router();

// Health check
router.get('/health', (_req, res) => {
  success(res, {
    status: 'ok',
    service: 'users',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
  });
});

export default router;
