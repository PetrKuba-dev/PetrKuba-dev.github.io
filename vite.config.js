import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [
    react(),
    tailwindcss()],
  server: {
    proxy: {
      '/api': 'http://localhost:8000',
    },
    allowedHosts: [
      '71ea4da80a9f.ngrok-free.app',
    ]
  },
})
