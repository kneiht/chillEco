import express from 'express';
import cors from 'cors';
import routes from './routes';
import { requestLogger, errorLogger } from './middleware/logger';
import { errorHandler } from './middleware/error-handler';

// Create express app
export function createApp(): express.Application {
  const app = express();

  // Middleware
  app.use(requestLogger);
  app.use(cors());
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Routes
  app.use('/api', routes);

  // Error handling
  app.use(errorLogger);
  app.use(errorHandler);

  return app;
}
