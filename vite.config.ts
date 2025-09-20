import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import mdx from '@mdx-js/rollup'

// https://vite.dev/config/
export default defineConfig({
  plugins: [mdx(), react(), tailwindcss()],
  build: {
    sourcemap: true
  },
  base: '/proto-typed/',
})
