import vikeReact from 'vike-react/config'
import type { Config } from 'vike/types'

// Root configuration - SSG for all pages
export default {
  extends: [vikeReact],
  
  // Pre-render all pages at build time (SSG)
  prerender: true,
  
  // Disable SSR - only use client-side hydration
  ssr: false,
} satisfies Config
