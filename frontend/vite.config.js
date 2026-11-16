import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// The frontend talks to the PHP API only through VITE_API_BASE_URL (see .env.example).
export default defineConfig({
  plugins: [react()],
  server: { port: 5173, strictPort: true },
});
