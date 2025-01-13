import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: [
      '@ffmpeg/ffmpeg',
      '@ffmpeg/util',
      '@ffmpeg/core'
    ]
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('@ffmpeg/core')) {
            return 'ffmpeg-core'; // Create a separate chunk for @ffmpeg/core
          }
          // Default chunking logic
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
      external: ['@ffmpeg/core'],
    }
  }
})
