/**
 * @proto-typed/core
 *
 * Core features of the Proto-Typed DSL:
 * - Lexer: Tokenization
 * - Parser: AST generation
 * - Renderer: AST to HTML
 * - Formatter: Code formatting
 * - Linter: Static analysis
 * - Diagnostics: LSP-compliant error handling (Phases 1-4)
 */

// Re-export all modules
export * from './core/lexer/index.js'
export * from './core/parser/index.js'
export * from './core/renderer/index.js'
export * from './core/themes/index.js'
export * from './core/formatter/index.js'
export * from './core/linter/index.js'
export * from './core/diagnostics/index.js'

// Export ErrorBus separately to avoid conflicts
export { ErrorBus, errorBus } from './core/error-bus.js'
export { ErrorBus as ErrorBusV2, errorBus as errorBusV2 } from './core/error-bus-v2.js'

// Re-export types
export * from './types/index.js'
