import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // server: {
  //   port: 5173,
  //   proxy: {
  //     '/api': {
  //       target: 'https://university-577mrdcq8-sufias-projects-12d26cf0.vercel.app',
  //       changeOrigin: true,
  //     },
  //   },
  // },
})
