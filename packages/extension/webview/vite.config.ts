/**
 * Vite configuration for webview bundle
 */

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: '../dist/webview',
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve(__dirname, 'index.html'),
      output: {
        entryFileNames: 'index.js',
        assetFileNames: 'index.[ext]',
        format: 'iife',
      },
    },
    // Optimize for webview
    minify: 'esbuild',
    sourcemap: false,
    target: 'es2020',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  optimizeDeps: {
    include: ['@proto-typed/core', 'react', 'react-dom'],
  },
  // Disable CSS code splitting
  css: {
    postcss: undefined,
  },
})
