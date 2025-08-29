import express from 'express';

const app = express();
app.use(express.json());

app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'posts' }));

app.get('/posts', (_req, res) => {
  res.json([
    { id: 1, title: 'Introduction to Microservices', userId: 1 },
    { id: 2, title: 'Building with Node.js', userId: 2 },
    { id: 3, title: 'Python FastAPI Guide', userId: 3 },
  ]);
});

app.get('/posts/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const posts = [
    {
      id: 1,
      title: 'Introduction to Microservices',
      content: 'Microservices architecture...',
      userId: 1,
    },
    { id: 2, title: 'Building with Node.js', content: 'Node.js is great for...', userId: 2 },
    { id: 3, title: 'Python FastAPI Guide', content: 'FastAPI makes it easy to...', userId: 3 },
  ];

  const post = posts.find(p => p.id === id);
  if (!post) {
    return res.status(404).json({ error: 'Post not found' });
  }

  res.json(post);
});

const port = process.env.PORT ? Number(process.env.PORT) : 4002;
app.listen(port, () => console.log(`posts service listening on :${port}`));
