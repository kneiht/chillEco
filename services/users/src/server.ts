import { createApp } from './app';
import { env } from './config/environment';

const PORT = env.PORT;

const app = createApp();

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Users service running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
});
