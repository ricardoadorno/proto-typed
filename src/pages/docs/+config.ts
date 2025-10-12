import type { Config } from 'vike/types'

export default {
  // Pre-render docs pages at build time (SSG)
  prerender: true,
  
  // Disable SSR - only use client-side hydration
  ssr: false,
} satisfies Config
