import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,        // You can change the port if needed
    open: true         // Opens browser on server start
  },
  build: {
    outDir: 'dist',    // Output folder for production build
  }
});
