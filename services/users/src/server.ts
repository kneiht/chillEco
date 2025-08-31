import { createApp } from './app';
import { env } from './config/environment';
import { connectDb, disconnectDb } from './config/database';

const PORT = env.PORT;

// Create express app
const app = createApp();

// Connect to database
connectDb().catch(error => console.dir(error));

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Users service running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
});

// Graceful shutdown
async function gracefulShutdown() {
  console.log('Shutting down gracefully...');
  await disconnectDb().catch(error => console.dir(error));
  process.exit(0);
}

// Handle SIGTERM and SIGINT
process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
