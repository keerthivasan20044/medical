import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],

  server: {
    port: 5174,
    strictPort: false,
    // Proxy /api requests to the backend to avoid CORS in dev
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
        secure: false,
      },
      '/socket.io': {
        target: 'http://localhost:5001',
        ws: true,
        changeOrigin: true,
      },
    },
    // Explicitly allow only THIS project's root to be served
    fs: {
      allow: [path.resolve(__dirname, '..')],
    },
  },

  clearScreen: false,
});
