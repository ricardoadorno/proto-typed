import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import mdx from '@mdx-js/rollup'
import vike from 'vike/plugin'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [mdx(), react(), tailwindcss(), vike()],
  build: {
    sourcemap: true
  },
  // Use /proto-typed/ base for production (GitHub Pages), / for development
  base: mode === 'production' ? '/proto-typed/' : '/',
  server: {
    open: true
  }
}))
