import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { yearsOfExperience } from './src/data/experience.js'

const page = (path) => fileURLToPath(new URL(path, import.meta.url))

// Isi %YEARS_EXPERIENCE% di index.html (deskripsi untuk Google & preview link) saat build
const experienceInHtml = {
  name: 'years-of-experience',
  transformIndexHtml: (html) => html.replaceAll('%YEARS_EXPERIENCE%', String(yearsOfExperience())),
}

// devsysbless.github.io adalah "user site", jadi base cukup '/'
export default defineConfig({
  plugins: [react(), experienceInHtml],
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
