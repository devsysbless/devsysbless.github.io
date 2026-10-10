import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// devsysbless.github.io adalah "user site", jadi base cukup '/'
export default defineConfig({
  plugins: [react()],
  base: '/',
})
