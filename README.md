## Microservices Monorepo Setup (pnpm workspaces, Python uv, Taskfile)

This guide explains how to scaffold and run a Node.js + Python microservices monorepo using:

- **pnpm workspaces** for JavaScript/TypeScript package management
- **uv** for Python dependency and virtual environment management
- **Taskfile** for uniform, cross-language task automation

Services included:

- **frontend**: React (Vite)
- **gateway**: Express.js reverse proxy for backend services
- **users**: Express.js
- **posts**: Express.js
- **comments**: FastAPI (Python)

### Prerequisites

- Node.js 18+ (recommend using `fnm` or `nvm`)
- pnpm 9+
- Python 3.11+
- uv (`pip install uv` or follow the official installer)
- Task (go-task): `brew install go-task/tap/go-task` or download from releases
- Optional: `direnv` for environment loading

### Monorepo Structure

```text
.
├─ package.json                 # Root scripts and dev tooling
├─ pnpm-workspace.yaml          # Workspace packages
├─ Taskfile.yml                 # Task runner orchestration
├─ .env                         # Shared env (optional)
└─ services/
   ├─ frontend/                 # React app (Vite)
   ├─ gateway/                  # API Gateway (Express + proxy)
   │  ├─ package.json
   │  └─ src/
   ├─ users/                    # Express service (TS or JS)
   │  ├─ package.json
   │  └─ src/
   ├─ posts/                    # Express service (TS or JS)
   │  ├─ package.json
   │  └─ src/
   └─ comments/                 # FastAPI (Python)
      ├─ pyproject.toml
      └─ app/
```

You can use TypeScript for Node services; examples below show TypeScript where helpful.

---

## 1) Initialize the Workspace

From the repo root:

```bash
pnpm init -y
```

Create `pnpm-workspace.yaml`:

```yaml
packages:
  - services/*
```

Root `package.json` (add helpful scripts and dev deps):

```json
{
  "name": "chilleco-monorepo",
  "private": true,
  "packageManager": "pnpm@9",
  "scripts": {
    "build": "pnpm -r build",
    "dev": "pnpm -r --parallel dev",
    "lint": "pnpm -r lint",
    "format": "pnpm -r format",
    "test": "pnpm -r test"
  },
  "devDependencies": {
    "concurrently": "^9.0.0",
    "typescript": "^5.5.0",
    "tsx": "^4.17.0",
    "eslint": "^9.7.0",
    "@typescript-eslint/parser": "^7.16.0",
    "@typescript-eslint/eslint-plugin": "^7.16.0",
    "eslint-config-prettier": "^9.1.0",
    "eslint-plugin-react": "^7.34.3",
    "eslint-plugin-react-hooks": "^4.6.2",
    "prettier": "^3.3.3"
  }
}
```

Install root dev tooling:

```bash
pnpm install
```

---

## 2) Scaffold Services

### Frontend (React + Vite)

```bash
pnpm create vite@latest services/frontend -- --template react-ts --name frontend --yes
cd services/frontend
pnpm install
pnpm add -D eslint prettier @types/node
```

Add scripts to `services/frontend/package.json`:

```json
{
  "name": "frontend",
  "private": true,
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "lint": "eslint .",
    "format": "prettier -w .",
    "test": "echo \"no tests yet\""
  }
}
```

Ensure the app calls APIs at the ports you choose below (e.g., `http://localhost:4001`, `4002`, `8000`).

### users (Express.js)

```bash
mkdir -p services/users/src
cd services/users
pnpm init -y
pnpm add express zod
pnpm add -D typescript tsx @types/node @types/express eslint prettier
```

Add `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "CommonJS",
    "outDir": "dist",
    "rootDir": "src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  }
}
```

Create `src/index.ts`:

```ts
import express from 'express';

const app = express();
app.use(express.json());

app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'users' }));

app.get('/users', (_req, res) => {
  res.json([{ id: 1, name: 'Ada' }]);
});

const port = process.env.PORT ? Number(process.env.PORT) : 4001;
app.listen(port, () => console.log(`users listening on :${port}`));
```

Update `package.json` scripts (use `tsx` instead of `ts-node`/`nodemon`):

```json
{
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "lint": "eslint .",
    "format": "prettier -w .",
    "test": "echo \"no tests yet\""
  }
}
```

### posts (Express.js)

Repeat the `users` setup for `services/posts` with a different port (e.g., `4002`) and endpoints like `/posts`. Use `tsx` for the dev script:

```json
{
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  }
}
```

### gateway (Express.js reverse proxy)

```bash
mkdir -p services/gateway/src
cd services/gateway
pnpm init -y
pnpm add express http-proxy-middleware cors
pnpm add -D typescript tsx @types/node @types/express eslint prettier
```

`tsconfig.json` (extends the root base):

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src"]
}
```

Create `src/index.ts`:

```ts
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

app.use('/api/users', createProxyMiddleware({ target: USERS_TARGET, changeOrigin: true, pathRewrite: { '^/api/users': '' } }));
app.use('/api/posts', createProxyMiddleware({ target: POSTS_TARGET, changeOrigin: true, pathRewrite: { '^/api/posts': '' } }));
app.use('/api/comments', createProxyMiddleware({ target: COMMENTS_TARGET, changeOrigin: true, pathRewrite: { '^/api/comments': '' } }));

const port = process.env.PORT ? Number(process.env.PORT) : 4000;
app.listen(port, () => console.log(`gateway listening on :${port}`));
```

`package.json` scripts:

```json
{
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "lint": "eslint .",
    "format": "prettier -w ."
  }
}
```

### comments (FastAPI with uv)

```bash
mkdir -p services/comments/app
cd services/comments
uv init --python 3.11 --name comments
```

Edit `pyproject.toml` to add FastAPI and Uvicorn:

```toml
[project]
name = "comments"
version = "0.1.0"
requires-python = ">=3.11"
dependencies = [
  "fastapi",
  "uvicorn[standard]"
]

[tool.uv]
package = true
```

Create `app/main.py`:

```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/health")
def health():
    return {"status": "ok", "service": "comments"}

@app.get("/comments")
def list_comments():
    return [{"id": 1, "text": "Great post!"}]
```

Dev command (will go into Taskfile, but standalone):

```bash
uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Install dependencies:

```bash
uv sync
```

---

## 3) Environment and Ports

Create `.env` in the repo root (or per service) to centralize config:

```env
GATEWAY_PORT=4000
USERS_PORT=4001
POSTS_PORT=4002
COMMENTS_PORT=8000
FRONTEND_PORT=5173
API_BASE_URL=http://localhost
USERS_URL=http://localhost:4001
POSTS_URL=http://localhost:4002
COMMENTS_URL=http://localhost:8000
```

Use these env vars in service startup scripts where applicable.

---

## 4) Centralized TypeScript, ESLint, and Prettier (root)

Manage configurations once at the repo root and share across all Node services:

1) Create `tsconfig.base.json` at the root:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "CommonJS",
    "moduleResolution": "Node",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

In each Node service `tsconfig.json`, extend the base:

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src"
  },
  "include": ["src"]
}
```

2) Create `.eslintrc.cjs` at the root:

```js
/* eslint-env node */
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module'
  },
  env: {
    node: true,
    es2022: true
  },
  plugins: ['@typescript-eslint', 'react', 'react-hooks'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:prettier/recommended'
  ],
  settings: {
    react: { version: 'detect' }
  },
  ignorePatterns: ['**/dist', '**/node_modules']
};
```

3) Create `.prettierrc.json` at the root:

```json
{
  "singleQuote": true,
  "trailingComma": "es5",
  "semi": true,
  "printWidth": 100
}
```

4) Create `.eslintignore` and `.prettierignore` at the root:

```text
**/dist
**/node_modules
```

5) Ensure root scripts run linters/formatters across all workspaces (already present above):

```json
{
  "scripts": {
    "lint": "pnpm -r lint",
    "format": "pnpm -r format"
  }
}
```

---

### Root files to create (at a glance)

Create these files at the repo root so all Node services can share them:

`pnpm-workspace.yaml`

```yaml
packages:
  - services/*
```

`tsconfig.base.json`

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "CommonJS",
    "moduleResolution": "Node",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

`.eslintrc.cjs`

```js
/* eslint-env node */
module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module'
  },
  env: {
    node: true,
    es2022: true
  },
  plugins: ['@typescript-eslint', 'react', 'react-hooks'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:prettier/recommended'
  ],
  settings: {
    react: { version: 'detect' }
  },
  ignorePatterns: ['**/dist', '**/node_modules']
};
```

`.prettierrc.json`

```json
{
  "singleQuote": true,
  "trailingComma": "es5",
  "semi": true,
  "printWidth": 100
}
```

`.eslintignore`

```text
**/dist
**/node_modules
```

`.prettierignore`

```text
**/dist
**/node_modules
```

---

## 5) Taskfile Orchestration

Create `Taskfile.yml` at the repo root to orchestrate installs and dev servers:

```yaml
version: '3'

vars:
  GATEWAY_PORT: "${GATEWAY_PORT:-4000}"
  USERS_PORT: "${USERS_PORT:-4001}"
  POSTS_PORT: "${POSTS_PORT:-4002}"
  COMMENTS_PORT: "${COMMENTS_PORT:-8000}"
  FRONTEND_PORT: "${FRONTEND_PORT:-5173}"

tasks:
  install:js:
    dir: .
    cmds:
      - pnpm install

  install:py:
    dir: services/comments
    cmds:
      - uv sync

  install:
    deps: [install:js, install:py]

  dev:users:
    dir: services/users
    env:
      PORT: "{{.USERS_PORT}}"
    cmds:
      - pnpm dev

  dev:posts:
    dir: services/posts
    env:
      PORT: "{{.POSTS_PORT}}"
    cmds:
      - pnpm dev

  dev:gateway:
    dir: services/gateway
    env:
      PORT: "{{.GATEWAY_PORT}}"
      USERS_URL: "http://localhost:{{.USERS_PORT}}"
      POSTS_URL: "http://localhost:{{.POSTS_PORT}}"
      COMMENTS_URL: "http://localhost:{{.COMMENTS_PORT}}"
    cmds:
      - pnpm dev

  dev:comments:
    dir: services/comments
    cmds:
      - uv run uvicorn app.main:app --reload --host 0.0.0.0 --port {{.COMMENTS_PORT}}

  dev:frontend:
    dir: services/frontend
    env:
      PORT: "{{.FRONTEND_PORT}}"
      VITE_API_BASE_URL: "http://localhost:{{.GATEWAY_PORT}}/api"
    cmds:
      - pnpm dev

  dev:
    desc: Run all services concurrently
    cmds:
      - >-
        pnpm dlx concurrently \
        "task dev:gateway" \
        "task dev:users" \
        "task dev:posts" \
        "task dev:comments" \
        "task dev:frontend"

  build:
    desc: Build all JS workspaces (and Python noop)
    cmds:
      - pnpm -r build || true

  lint:
    cmds:
      - pnpm -r lint || true

  format:
    cmds:
      - pnpm -r format || true

  clean:
    cmds:
      - rm -rf **/node_modules **/dist **/.turbo || true
```

Notes:

- `task dev` uses `concurrently` to run all services. You can run any service individually via `task dev:users`, etc.
- If you prefer, you can replace `concurrently` with `tmux` or `foreman`.

---

## 6) Typical Commands

- **Install all deps**: `task install`
- **Run all services**: `task dev`
- **Run one service**: `task dev:users` (or `posts`, `comments`, `frontend`)
- **Build**: `task build`
- **Lint**: `task lint`
- **Format**: `task format`

---

## 7) Cross-Service Communication

- Frontend should call APIs via `VITE_API_BASE_URL` and service ports:
  - Users: `GET http://localhost:4001/users`
  - Posts: `GET http://localhost:4002/posts`
  - Comments: `GET http://localhost:8000/comments`

Consider adding API gateway or reverse proxy later (e.g., Traefik, NGINX) if you need a single origin.

---

## 8) Testing (Optional Quick Start)

- JS services: add `vitest` or `jest` per service, then wire to `pnpm -r test`.
- Python service: add `pytest` and `httpx` for FastAPI route tests.

---

## 9) Troubleshooting

- Port conflicts: change ports in `.env` or export vars before running `task`.
- Python not using the right version: ensure `uv` sees Python 3.11+.
- Node version issues: set a `.nvmrc`/`.node-version` and use `fnm`/`nvm`.

---

## 10) Next Steps

- Add shared libraries under `packages/` and reference them via pnpm workspaces.
- Introduce API schemas with `zod`/OpenAPI; share types via codegen.
- Add CI (GitHub Actions) to run `task install`, `task build`, `task test`.


