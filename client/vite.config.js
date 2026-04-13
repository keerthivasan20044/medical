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

  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-ui': ['framer-motion', 'lucide-react', 'react-hot-toast'],
          'vendor-store': ['@reduxjs/toolkit', 'react-redux']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  },
  clearScreen: false,
});
