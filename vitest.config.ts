import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    isolate: false,
    reporters: process.env.GITHUB_ACTIONS
      ? ['tree', 'github-actions']
      : ['tree'],

    projects: [
      {
        test: {
          name: 'unit',
          include: ['tests/**/*.unit.test.ts'],
        },
      },
      {
        test: {
          name: 'integration',
          include: ['tests/integration/**/*.test.ts'],
        },
      },
      {
        test: {
          name: 'e2e',
          include: ['tests/e2e/**/*.test.ts'],
          globalSetup: ['./tests/e2e/global/setup.ts'],
          testTimeout: 120_000,
          hookTimeout: 120_000,
        },
      },
    ],
  },
});
