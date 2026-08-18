import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/khebab-app/',
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
})
