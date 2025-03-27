import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "./", // Ensures relative paths work
  plugins: [react()],
  build: {
    outDir: "dist",
  },
  server: {
    historyApiFallback: true, // Fixes reload issues in SPA
  },
});
