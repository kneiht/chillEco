import express from 'express';
import routes from './routes/index';

export function createApp(): express.Application {
  const app = express();
  app.use(express.json());

  // Routes
  app.use('/api', routes);

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', service: 'users' });
  });

  return app;
}
