import { serverError } from '../utils/response';
import type { Request, Response, NextFunction } from 'express';

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  const messsage = process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong!';
  serverError(res, messsage);
}
