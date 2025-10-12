export { route }

import type { RouteSync } from 'vike/types'

// Route function that matches /docs and /docs/*
const route: RouteSync = (pageContext): ReturnType<RouteSync> => {
  const { urlPathname } = pageContext
  
  // Match /docs exactly or /docs/* paths
  if (urlPathname === '/docs' || urlPathname.startsWith('/docs/')) {
    return {
      precedence: 10
    }
  }
  
  return false
}
