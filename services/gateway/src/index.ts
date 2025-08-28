import express from 'express';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();
app.use(cors());
app.use(express.json());

const USERS_TARGET = process.env.USERS_URL || 'http://localhost:4001';
const POSTS_TARGET = process.env.POSTS_URL || 'http://localhost:4002';
const COMMENTS_TARGET = process.env.COMMENTS_URL || 'http://localhost:8000';

app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'gateway' }));

// Proxy routes
app.use('/api/users', createProxyMiddleware({ 
  target: USERS_TARGET, 
  changeOrigin: true, 
  pathRewrite: { '^/api/users': '' },
  onError: (err, req, res) => {
    console.error('Proxy error to users service:', err.message);
    res.status(503).json({ error: 'Users service unavailable' });
  }
}));

app.use('/api/posts', createProxyMiddleware({ 
  target: POSTS_TARGET, 
  changeOrigin: true, 
  pathRewrite: { '^/api/posts': '' },
  onError: (err, req, res) => {
    console.error('Proxy error to posts service:', err.message);
    res.status(503).json({ error: 'Posts service unavailable' });
  }
}));

app.use('/api/comments', createProxyMiddleware({ 
  target: COMMENTS_TARGET, 
  changeOrigin: true, 
  pathRewrite: { '^/api/comments': '' },
  onError: (err, req, res) => {
    console.error('Proxy error to comments service:', err.message);
    res.status(503).json({ error: 'Comments service unavailable' });
  }
}));

const port = process.env.PORT ? Number(process.env.PORT) : 4000;
app.listen(port, () => {
  console.log(`gateway listening on :${port}`);
  console.log(`Proxying to:`);
  console.log(`  Users: ${USERS_TARGET}`);
  console.log(`  Posts: ${POSTS_TARGET}`);
  console.log(`  Comments: ${COMMENTS_TARGET}`);
});