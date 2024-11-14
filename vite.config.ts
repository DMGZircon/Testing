import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/',  // This is for the production base URL, update if you're using a subfolder
  server: {
    port: 3000,  // Port is used during local dev, no need to worry about this for production
  },
});