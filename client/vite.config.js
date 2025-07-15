import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/auth': 'http://localhost:5000',
      '/complaints': 'http://localhost:5000',
      '/reports': 'http://localhost:5000',
    }
  }
})
