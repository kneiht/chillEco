import express from 'express';
import routes from './routes';
import { connectDb } from './config/database';

// Connect to database
connectDb().catch(error => console.dir(error));

// Create express app
export function createApp(): express.Application {
  const app = express();
  app.use(express.json());

  // Routes
  app.use('/api', routes);
  return app;
}
