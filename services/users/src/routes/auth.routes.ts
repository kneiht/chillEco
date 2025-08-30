import express, { Router } from 'express';
import { success } from '../utils/response';

const router: express.Router = Router();

router.post('/register', (req, res) => {
  success(res, { dummy: 'Registered successfully' });
});

router.post('/login', (req, res) => {
  success(res, { dummy: 'Logged in successfully' });
});

router.post('/logout', (req, res) => {
  success(res, { dummy: 'Logged out successfully' });
});

export default router;
