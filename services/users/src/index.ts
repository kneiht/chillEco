import express from 'express';

export function createApp(): express.Application {
  const app = express();
  app.use(express.json());

  app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'users' }));

  return app;
}

export function startServer(app: express.Application, port: number) {
  return app.listen(port, () => console.log(`users service listening on http://localhost:${port}`));
}

// Only start the server if this file is run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  if (!process.env.PORT) {
    throw new Error('USERS_PORT must be defined');
  }
  const port = Number(process.env.PORT);
  const app = createApp();
  startServer(app, port);
}
