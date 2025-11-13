/**
 * Monaco Editor Theme for proto-typed DSL
 *
 * Defines dark theme optimized for DSL syntax highlighting.
 * Token colors align with actual DSL implementation in dsl-language.ts
 *
 * Design Philosophy:
 * - Dark mode only (no light theme support)
 * - High contrast for readability
 * - Semantic color mapping (views = red, components = green, buttons = blue, etc.)
 *
 * @see dsl-language.ts for token definitions
 * @see constants.ts for token type mapping
 */

import { Monaco } from '@monaco-editor/react'
import {
  DSL_THEME_NAME,
  DSL_TOKEN_RULES,
  DSL_EDITOR_COLORS,
} from './dsl-theme-data'

/**
 * Register custom dark theme for the DSL
 * Colors chosen for optimal contrast and semantic meaning
 */
export function registerDSLTheme(monaco: Monaco) {
  monaco.editor.defineTheme(DSL_THEME_NAME, {
    base: 'vs-dark',
    inherit: true,
    rules: DSL_TOKEN_RULES.flatMap(({ token, foreground, fontStyle }) => {
      const tokens = Array.isArray(token) ? token : [token]
      return tokens.map((scope) => ({
        token: scope,
        foreground: foreground.replace('#', ''),
        fontStyle,
      }))
    }),
    colors: DSL_EDITOR_COLORS,
  })
}
