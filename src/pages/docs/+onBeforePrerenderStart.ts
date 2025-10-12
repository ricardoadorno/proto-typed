export { onBeforePrerenderStart }

import type { OnBeforePrerenderStartAsync } from 'vike/types'

// Generate all documentation routes for static generation
const onBeforePrerenderStart: OnBeforePrerenderStartAsync = async (): ReturnType<OnBeforePrerenderStartAsync> => {
  const docRoutes = [
    '/docs',
    '/docs/syntax',
    '/docs/primitives',
    '/docs/buttons',
    '/docs/inputs-forms',
    '/docs/typography',
    '/docs/icons',
    '/docs/layout-system',
    '/docs/structures-content',
    '/docs/components-props',
    '/docs/navigation',
    '/docs/navigation-overlays',
    '/docs/theming-styles',
    '/docs/examples',
    '/docs/troubleshooting',
  ]

  return docRoutes
}
