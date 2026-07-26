import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Deployed to https://<user>.github.io/ccaf-flashprep/, so assets must resolve
// against the repo subpath. Override with BASE_PATH=/ for a root-domain deploy.
export default defineConfig({
  base: process.env.BASE_PATH ?? '/ccaf-flashprep/',
  plugins: [react()],
});
