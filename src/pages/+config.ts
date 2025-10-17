import vikeReact from 'vike-react/config'
import type { Config } from 'vike/types'

// Root configuration - SSG for all pages
export default {
  extends: [vikeReact],
  prerender: true, // ✅ enables SSG for all pages
  ssr: false,           // ⛔ disables SSR entirely
} satisfies Config
