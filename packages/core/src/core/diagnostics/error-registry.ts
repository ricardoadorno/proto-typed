/**
 * Error Registry - Central catalog of all diagnostic codes
 *
 * This registry provides metadata for every error/warning code in Proto-Typed:
 * - Human-readable titles and descriptions
 * - Documentation URLs
 * - Code examples (before/after)
 * - Suggested fixes
 *
 * Inspired by TypeScript's error catalog and Rust's error index.
 *
 * @see https://proto-typed.dev/errors (planned documentation site)
 */

// ============================================================
// Types
// ============================================================

export interface ErrorCatalogEntry {
  /**
   * Short, human-readable title
   */
  title: string

  /**
   * Detailed description of what causes this error
   */
  description: string

  /**
   * URL to full documentation page
   */
  url: string

  /**
   * Category for organizing errors
   */
  category: 'lexer' | 'parser' | 'builder' | 'linter' | 'renderer' | 'editor'

  /**
   * Code examples showing the problem and solution
   */
  examples?: Array<{
    bad: string
    good: string
    description?: string
  }>

  /**
   * Suggested actions to fix the error
   */
  fixes?: string[]

  /**
   * Related error codes
   */
  relatedCodes?: string[]
}

// ============================================================
// Error Catalog
// ============================================================

export const ERROR_REGISTRY: Record<string, ErrorCatalogEntry> = {
  // ========================================
  // LEXER ERRORS (PT-LEX-xxxx)
  // ========================================

  'PT-LEX-1001': {
    title: 'Invalid Token',
    category: 'lexer',
    description: 'The lexer encountered a character or sequence that does not match any valid token in the DSL grammar.',
    url: 'https://proto-typed.dev/errors/PT-LEX-1001',
    examples: [
      {
        bad: 'screen Home:\n  container:\n    $ Invalid',
        good: 'screen Home:\n  container:\n    $MyComponent',
        description: 'Component instances must start with uppercase letter'
      }
    ],
    fixes: [
      'Check for typos or unsupported syntax',
      'Review the DSL syntax reference',
      'Ensure component names start with uppercase letters'
    ]
  },

  'PT-LEX-1002': {
    title: 'Unexpected Character',
    category: 'lexer',
    description: 'An unexpected character was encountered during tokenization.',
    url: 'https://proto-typed.dev/errors/PT-LEX-1002',
    fixes: [
      'Remove or replace the unexpected character',
      'Check for invisible characters or encoding issues'
    ]
  },

  // ========================================
  // PARSER ERRORS (PT-PARSE-xxxx)
  // ========================================

  'PT-PARSE-1001': {
    title: 'Syntax Error',
    category: 'parser',
    description: 'The parser encountered invalid syntax that does not conform to the DSL grammar.',
    url: 'https://proto-typed.dev/errors/PT-PARSE-1001',
    fixes: [
      'Check for missing colons after declarations',
      'Verify proper indentation',
      'Ensure all blocks are properly closed'
    ]
  },

  'PT-PARSE-1002': {
    title: 'Expected Name',
    category: 'parser',
    description: 'A name identifier was expected but not found (e.g., after screen, component, modal).',
    url: 'https://proto-typed.dev/errors/PT-PARSE-1002',
    examples: [
      {
        bad: 'screen :\n  container:',
        good: 'screen Home:\n  container:',
        description: 'Screens must have a name'
      }
    ],
    fixes: [
      'Add a name after the keyword',
      'Ensure the name starts with an uppercase letter'
    ]
  },

  'PT-PARSE-1003': {
    title: 'Expected Colon',
    category: 'parser',
    description: 'A colon (:) was expected to start a block but was not found.',
    url: 'https://proto-typed.dev/errors/PT-PARSE-1003',
    examples: [
      {
        bad: 'screen Home\n  container:',
        good: 'screen Home:\n  container:',
        description: 'Declarations must end with a colon'
      }
    ],
    fixes: [
      'Add a colon after the declaration',
      'Check for typos in keyword names'
    ]
  },

  'PT-PARSE-1004': {
    title: 'Expected Indentation',
    category: 'parser',
    description: 'Content was expected to be indented but was not.',
    url: 'https://proto-typed.dev/errors/PT-PARSE-1004',
    fixes: [
      'Indent the content by 2 spaces',
      'Ensure consistent indentation throughout the file'
    ]
  },

  'PT-PARSE-1005': {
    title: 'Unexpected Token',
    category: 'parser',
    description: 'A token was encountered in an invalid context.',
    url: 'https://proto-typed.dev/errors/PT-PARSE-1005',
    fixes: [
      'Check if the token is in the correct place',
      'Verify the surrounding context'
    ]
  },

  // ========================================
  // BUILDER ERRORS (PT-BLD-xxxx)
  // ========================================

  'PT-BLD-2001': {
    title: 'Invalid Modifiers',
    category: 'builder',
    description: 'The modifiers applied to an element are invalid or incompatible.',
    url: 'https://proto-typed.dev/errors/PT-BLD-2001',
    fixes: [
      'Check the list of valid modifiers for this element type',
      'Remove conflicting modifiers'
    ]
  },

  'PT-BLD-2002': {
    title: 'Invalid Props',
    category: 'builder',
    description: 'The properties provided to an element are invalid.',
    url: 'https://proto-typed.dev/errors/PT-BLD-2002',
    fixes: [
      'Check the prop syntax',
      'Verify prop names match component definition'
    ]
  },

  'PT-BLD-2003': {
    title: 'Missing Required Field',
    category: 'builder',
    description: 'A required field is missing from an element declaration.',
    url: 'https://proto-typed.dev/errors/PT-BLD-2003',
    fixes: [
      'Add the missing required field',
      'Check the element documentation for required fields'
    ]
  },

  // ========================================
  // LINTER ERRORS (PT-LINT-xxxx)
  // ========================================

  'PT-LINT-1001': {
    title: 'Undefined Component',
    category: 'linter',
    description: 'A component is referenced (e.g., $ComponentName) but no definition exists.',
    url: 'https://proto-typed.dev/errors/PT-LINT-1001',
    examples: [
      {
        bad: 'screen Home:\n  container:\n    $UndefinedComponent',
        good: 'component MyComponent:\n  > Content\n\nscreen Home:\n  container:\n    $MyComponent',
        description: 'Define components before using them'
      }
    ],
    fixes: [
      'Define the component above its usage',
      'Fix the component name spelling',
      'Import the component if it\'s from another file (future feature)'
    ],
    relatedCodes: ['PT-LINT-2002']
  },

  'PT-LINT-1002': {
    title: 'Undefined Navigation Target',
    category: 'linter',
    description: 'A button, link, or navigator item references a screen/modal/drawer that doesn\'t exist.',
    url: 'https://proto-typed.dev/errors/PT-LINT-1002',
    examples: [
      {
        bad: 'screen Home:\n  @primary[Go](NonExistentScreen)',
        good: 'screen Settings:\n  # ...\n\nscreen Home:\n  @primary[Go](Settings)',
        description: 'Navigation targets must exist'
      }
    ],
    fixes: [
      'Define the target screen/modal/drawer',
      'Fix the navigation target name spelling',
      'Use -1 to go back instead'
    ],
    relatedCodes: ['PT-LINT-2001']
  },

  'PT-LINT-2001': {
    title: 'Unused View',
    category: 'linter',
    description: 'A screen, modal, or drawer is defined but never navigated to.',
    url: 'https://proto-typed.dev/errors/PT-LINT-2001',
    examples: [
      {
        bad: 'screen Home:\n  # ...\n\nscreen UnusedSettings:\n  # Never referenced',
        good: 'screen Home:\n  @primary[Settings](Settings)\n\nscreen Settings:\n  # Now used!',
        description: 'Remove unused views or add navigation to them'
      }
    ],
    fixes: [
      'Add navigation to this view from another screen',
      'Remove the view if it\'s not needed',
      'Consider if this is a work-in-progress feature'
    ],
    relatedCodes: ['PT-LINT-1002']
  },

  'PT-LINT-2002': {
    title: 'Unused Component',
    category: 'linter',
    description: 'A component is defined but never instantiated.',
    url: 'https://proto-typed.dev/errors/PT-LINT-2002',
    examples: [
      {
        bad: 'component UnusedCard:\n  # Never used\n\nscreen Home:\n  # No $UnusedCard here',
        good: 'component Card:\n  > %title\n\nscreen Home:\n  $Card | My Title',
        description: 'Use or remove unused components'
      }
    ],
    fixes: [
      'Use the component with $ComponentName',
      'Remove the component if it\'s not needed',
      'Consider if this is a reusable component for future use'
    ],
    relatedCodes: ['PT-LINT-1001']
  },

  'PT-LINT-3001': {
    title: 'Duplicate View Name',
    category: 'linter',
    description: 'Multiple screens, modals, or drawers have the same name.',
    url: 'https://proto-typed.dev/errors/PT-LINT-3001',
    examples: [
      {
        bad: 'screen Home:\n  # First\n\nscreen Home:\n  # Duplicate!',
        good: 'screen Home:\n  # First\n\nscreen Settings:\n  # Unique name',
        description: 'Each view must have a unique name'
      }
    ],
    fixes: [
      'Rename one of the views',
      'Merge the views if they serve the same purpose',
      'Check for copy-paste errors'
    ],
    relatedCodes: ['PT-LINT-3002']
  },

  'PT-LINT-3002': {
    title: 'Duplicate Component Name',
    category: 'linter',
    description: 'Multiple components have the same name.',
    url: 'https://proto-typed.dev/errors/PT-LINT-3002',
    examples: [
      {
        bad: 'component Card:\n  # First\n\ncomponent Card:\n  # Duplicate!',
        good: 'component Card:\n  # First\n\ncomponent DetailCard:\n  # Unique name',
        description: 'Each component must have a unique name'
      }
    ],
    fixes: [
      'Rename one of the components',
      'Merge the components if they serve the same purpose',
      'Check for copy-paste errors'
    ],
    relatedCodes: ['PT-LINT-3001']
  },

  // ========================================
  // RENDERER ERRORS (PT-REND-xxxx)
  // ========================================

  'PT-REND-3001': {
    title: 'Renderer Error',
    category: 'renderer',
    description: 'A generic error occurred during rendering.',
    url: 'https://proto-typed.dev/errors/PT-REND-3001',
    fixes: [
      'Check the browser console for details',
      'Verify all props are valid',
      'Report this as a bug if it persists'
    ]
  },

  'PT-REND-3002': {
    title: 'Missing Required Prop',
    category: 'renderer',
    description: 'A component instance is missing a required prop.',
    url: 'https://proto-typed.dev/errors/PT-REND-3002',
    examples: [
      {
        bad: 'component Card:\n  > %title\n\nscreen Home:\n  $Card',
        good: 'component Card:\n  > %title\n\nscreen Home:\n  $Card | My Title',
        description: 'Provide all required props'
      }
    ],
    fixes: [
      'Add the missing prop after the pipe (|)',
      'Check the component definition for required props'
    ]
  },

  'PT-REND-3003': {
    title: 'Invalid Navigation',
    category: 'renderer',
    description: 'Navigation was attempted to an invalid target at runtime.',
    url: 'https://proto-typed.dev/errors/PT-REND-3003',
    fixes: [
      'Check navigation targets exist',
      'Verify navigation logic',
      'Use -1 for going back'
    ]
  },

  'PT-REND-3004': {
    title: 'Component Render Error',
    category: 'renderer',
    description: 'An error occurred while rendering a component.',
    url: 'https://proto-typed.dev/errors/PT-REND-3004',
    fixes: [
      'Check component definition for errors',
      'Verify all props are provided',
      'Check browser console for details'
    ]
  },

  // ========================================
  // EDITOR ERRORS (PT-EDIT-xxxx)
  // ========================================

  'PT-EDIT-4001': {
    title: 'Fatal Editor Error',
    category: 'editor',
    description: 'A fatal error occurred in the editor runtime.',
    url: 'https://proto-typed.dev/errors/PT-EDIT-4001',
    fixes: [
      'Reload the editor',
      'Check browser console for details',
      'Report this as a bug'
    ]
  },

  'PT-EDIT-4002': {
    title: 'Monaco Editor Error',
    category: 'editor',
    description: 'An error occurred in the Monaco editor integration.',
    url: 'https://proto-typed.dev/errors/PT-EDIT-4002',
    fixes: [
      'Reload the page',
      'Clear browser cache',
      'Report this as a bug if it persists'
    ]
  }
}

// ============================================================
// Helper Functions
// ============================================================

/**
 * Get registry entry for an error code
 */
export function getErrorInfo(code: string): ErrorCatalogEntry | undefined {
  return ERROR_REGISTRY[code]
}

/**
 * Get documentation URL for an error code
 */
export function getErrorUrl(code: string): string | undefined {
  return ERROR_REGISTRY[code]?.url
}

/**
 * Get all error codes for a category
 */
export function getErrorsByCategory(
  category: ErrorCatalogEntry['category']
): Array<{ code: string; entry: ErrorCatalogEntry }> {
  return Object.entries(ERROR_REGISTRY)
    .filter(([_, entry]) => entry.category === category)
    .map(([code, entry]) => ({ code, entry }))
}

/**
 * Search error registry by keyword
 */
export function searchErrors(query: string): Array<{ code: string; entry: ErrorCatalogEntry }> {
  const lowerQuery = query.toLowerCase()
  return Object.entries(ERROR_REGISTRY)
    .filter(([code, entry]) => {
      return (
        code.toLowerCase().includes(lowerQuery) ||
        entry.title.toLowerCase().includes(lowerQuery) ||
        entry.description.toLowerCase().includes(lowerQuery)
      )
    })
    .map(([code, entry]) => ({ code, entry }))
}

/**
 * Get suggested fixes for an error code
 */
export function getFixes(code: string): string[] {
  return ERROR_REGISTRY[code]?.fixes || []
}

/**
 * Get related error codes
 */
export function getRelatedCodes(code: string): string[] {
  return ERROR_REGISTRY[code]?.relatedCodes || []
}
