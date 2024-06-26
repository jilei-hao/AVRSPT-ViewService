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
      '@assets': '/src/assets',
      '@components': '/src/components',
      '@rendering': '/src/rendering',
      '@interaction': '/src/interaction',
      '@logic': '/src/logic',
    }
  }
})
