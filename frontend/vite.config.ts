import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['lucide-react'],
          // framer-motion is deliberately NOT pinned to a manual chunk: naming it here makes
          // Rollup hoist it into the entry graph, so index.html modulepreloads 41 kB gzip of
          // animation code for a lightbox that only exists on /project/:slug. Left unpinned it
          // ships inside the lazy ProjectDetail chunk instead.
        },
      },
    },
  },
});
