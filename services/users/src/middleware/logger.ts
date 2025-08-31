import type { Request, Response, NextFunction } from 'express';
import { isDevelopment } from '../config/environment';

// Request logging middleware
export function requestLogger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();
  const timestamp = new Date().toISOString();

  // Log request
  if (isDevelopment) {
    console.log(`${timestamp} ${req.method} ${req.url}`);
    const logBody = req.body ? JSON.stringify(req.body) : '';
    console.log(`  Body: ${logBody}`);
    // TODO: hide sensitive data
  }

  // Register a listener for the 'finish' event
  res.on('finish', () => {
    const duration = Date.now() - start;
    const statusColor = res.statusCode >= 400 ? '🔴' : '🟢';
    if (isDevelopment) {
      console.log(`  ${statusColor} ${res.statusCode} ${duration}ms`);
      const logBody = req.body ? JSON.stringify(req.body) : '';
      console.log(`  Body: ${logBody}`);
    }
  });

  next();
}

// Error logger middleware
export function errorLogger(err: Error, req: Request, _res: Response, next: NextFunction) {
  const timestamp = new Date().toISOString();
  console.error(`❌ [${timestamp}] Error in ${req.method} ${req.url}:`);
  console.error(`   Message: ${err.message}`);

  if (isDevelopment && err.stack) {
    console.error(`   Stack: ${err.stack}`);
  }

  next(err);
}
