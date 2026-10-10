import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const page = (path) => fileURLToPath(new URL(path, import.meta.url))

// devsysbless.github.io adalah "user site", jadi base cukup '/'
export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    // Dua halaman: website utama (/) dan dashboard monitor (/admin/)
    rollupOptions: {
      input: {
        main: page('./index.html'),
        admin: page('./admin/index.html'),
      },
    },
  },
})
