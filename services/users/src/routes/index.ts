import { Router } from 'express';
import express from 'express';
import { success } from '../utils/response';

const router: express.Router = Router();

// Health check
router.get('/health', (_req, res) => {
  success(res, { status: 'ok', timestamp: new Date().toISOString(), service: 'users' });
});

export default router;
