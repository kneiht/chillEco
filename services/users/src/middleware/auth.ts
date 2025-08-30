import type { Request, Response, NextFunction } from 'express';
import { error } from '../utils/response';

export function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  const isAuthenticated = true;
  if (isAuthenticated) {
    next();
  } else {
    error(res, 'Unauthorized', 401);
  }
}
