import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: "./",  // Keep this if using GitHub Pages or relative paths
  build: {
    outDir: "dist",
  },
  server: {
    historyApiFallback: true, // Ensure SPA routing works on local dev server
  },
  preview: {
    historyApiFallback: true, // Ensure routes work in preview mode
  },
});
