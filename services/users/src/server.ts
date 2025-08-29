import { createApp } from './app';

if (!process.env.PORT) {
  throw new Error('USERS_PORT must be defined');
}
const PORT = Number(process.env.PORT);
const app = createApp();

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Users service running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
});
