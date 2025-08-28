import express from 'express';

const app = express();
app.use(express.json());

app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'users' }));

app.get('/users', (_req, res) => {
  res.json([
    { id: 1, name: 'Ada Lovelace' },
    { id: 2, name: 'Grace Hopper' },
    { id: 3, name: 'Katherine Johnson' }
  ]);
});

app.get('/users/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const users = [
    { id: 1, name: 'Ada Lovelace', email: 'ada@example.com' },
    { id: 2, name: 'Grace Hopper', email: 'grace@example.com' },
    { id: 3, name: 'Katherine Johnson', email: 'katherine@example.com' }
  ];
  
  const user = users.find(u => u.id === id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  res.json(user);
});

const port = process.env.PORT ? Number(process.env.PORT) : 4001;
app.listen(port, () => console.log(`users service listening on :${port}`));