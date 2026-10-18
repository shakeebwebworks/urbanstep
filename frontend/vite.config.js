import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ command }) => ({
  plugins: [react()],
  // In production Django serves our files under /static/, so build with that prefix.
  base: command === 'build' ? '/static/' : '/',
  server: {
    // In development, forward /api calls to Django so we avoid CORS problems.
    proxy: { '/api': 'http://127.0.0.1:8000' },
  },
}));