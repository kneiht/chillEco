import { beforeAll, afterAll } from 'vitest';

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.PORT = '4001';

// Global test setup
beforeAll(() => {
  // Any global setup can go here
});

afterAll(() => {
  // Any global cleanup can go here
});
