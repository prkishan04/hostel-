import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// DevOps: output to /dist so our Docker build can easily copy static assets.
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist'
  }
});

