import express from 'express';
import routes from './routes';
import { connectDb } from './config/database';
import { logger } from './middleware/logger';
import { isAuthenticated } from './middleware/auth';

// Connect to database
connectDb().catch(error => console.dir(error));

// Create express app
export function createApp(): express.Application {
  const app = express();

  app.use(logger);
  app.use(express.json());
  app.use(isAuthenticated);

  // Routes
  app.use('/api', routes);
  return app;
}
