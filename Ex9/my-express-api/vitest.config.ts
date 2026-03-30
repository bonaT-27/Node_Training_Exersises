import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true, // important
    environment: 'node',
    coverage: {
      provider: 'v8', // or 'c8' if you prefer
      reporter: ['text', 'html', 'json'],
      exclude: [
        'node_modules/',
        'dist/',
        'src/server.ts', // Exclude server bootstrap file
        '**/*.test.ts',
        '**/*.spec.ts',
        'tests/**'
      ],
      all: true, // Include all files even if not tested
      reportsDirectory: './coverage',
      thresholds: {
        statements: 70,
        branches: 80,
        functions: 80,
        lines: 80
      }
    }
  }
});
