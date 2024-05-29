import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
      '@viewer': '/src/avrp_viewer',
      '@ui': '/src/ui',
    }
  }
})
