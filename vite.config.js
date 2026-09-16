import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages Deployment Configuration with Relative Base Path
export default defineConfig({
  plugins: [react()],
  base: './',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false
  },
  server: {
    port: 3000,
    open: false,
    fs: {
      allow: ['.']
    }
  }
});
