import { defineConfig } from 'vite';

export default defineConfig({
  build: { target: 'es2020' },
  base: './',
  worker: { format: 'es' },
  test: { include: ['tests/unit/**/*.test.js'] }
});
