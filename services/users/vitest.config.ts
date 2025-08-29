import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      // reporter: ['text', 'json', 'html'],
      reporter: ['text'],
      exclude: ['node_modules/', 'dist/', 'tests/', '**/*.d.ts', '**/*.config.*'],
    },
  },
});
