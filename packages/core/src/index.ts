/**
 * @proto-typed/core
 *
 * Core features of the Proto-Typed DSL:
 * - Lexer: Tokenization
 * - Parser: AST generation
 * - Builder: AST to React/React Native
 * - Formatter: Code formatting
 * - Linter: Static analysis
 * - Diagnostics: LSP-compliant error handling (Phases 1-4)
 */

// Re-export all modules
export * from './core/lexer/index.js'
export * from './core/parser/index.js'
export * from './core/builder/index.js'
export * from './core/formatter/index.js'
export * from './core/linter/index.js'
export * from './core/diagnostics/index.js'
export * from './core/error-bus.js'
export * from './core/error-bus-v2.js'

// Re-export types
export * from './types/index.js'
