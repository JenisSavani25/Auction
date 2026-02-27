import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      // Helps reduce watcher overhead, especially in OneDrive folders
      ignored: ['**/node_modules/**', '**/.git/**'],
    }
  },
  optimizeDeps: {
    // Pre-bundle large libraries to speed up initial Vite load and reloads
    include: ['react', 'react-dom', 'lucide-react']
  }
})
