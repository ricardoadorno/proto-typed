/**
 * Diagnostics Module - LSP-Aligned Error Handling
 *
 * This module provides:
 * - Error registry with documentation (Phase 1)
 * - Diagnostic factory functions (Phase 1)
 * - Document-scoped diagnostic storage (Phase 2)
 * - Enhanced ErrorBus with backward compatibility (Phase 2)
 * - Configurable lint rules (Phase 3)
 * - Helper utilities for working with diagnostics
 *
 * **Phase 1**: LSP-compliant fields and error catalog
 * **Phase 2**: Document-scoped diagnostics and publishDiagnostics API
 * **Phase 3**: Configurable lint rules with severity overrides
 *
 * @see DIAGNOSTICS_EVOLUTION.md for architecture details
 */

// ==========================================================
// Phase 1: Error Registry
// ==========================================================

export {
  ERROR_REGISTRY,
  getErrorInfo,
  getErrorUrl,
  getErrorsByCategory,
  searchErrors,
  getFixes,
  getRelatedCodes,
  type ErrorCatalogEntry
} from './error-registry'

// ==========================================================
// Phase 1: Diagnostic Factory
// ==========================================================

export {
  createDiagnostic,
  createLegacyDiagnostic,
  createRangeDiagnostic,
  createDiagnostics,
  enhanceDiagnostic,
  enhanceDiagnostics,
  type CreateDiagnosticOptions
} from './diagnostic-factory'

// ==========================================================
// Phase 2: Document-Scoped Storage (New!)
// ==========================================================

export {
  DiagnosticStore,
  diagnosticStore,
  type DiagnosticEntry,
  type DiagnosticListener,
  type GlobalDiagnosticListener
} from './diagnostic-store'

// ==========================================================
// Phase 2: Enhanced ErrorBus (New!)
// ==========================================================

// Note: The original ErrorBus at src/core/error-bus.ts remains unchanged
// for backward compatibility. This is an enhanced version with document-scoped
// support. Import from here for new code, or migrate gradually.
export { ErrorBus as ErrorBusV2, errorBus as errorBusV2 } from '../error-bus-v2'

// ==========================================================
// LSP Types (Re-exports)
// ==========================================================

export type {
  Position,
  Range,
  DiagnosticSeverity,
  DiagnosticTag,
  CodeDescription,
  Location,
  DiagnosticRelatedInformation,
  Diagnostic
} from '../../types/diagnostics'

export {
  createPosition,
  createRange,
  createRangeFromLength,
  toZeroBased,
  toOneBased,
  isPositionInRange,
  rangesOverlap,
  comparePositions,
  compareRanges
} from '../../types/diagnostics'

// ==========================================================
// Phase 3: Configurable Lint Rules (New!)
// ==========================================================

export {
  DEFAULT_LINT_CONFIG,
  mergeLintConfigs,
  severityToLSP,
  severityToProtoTyped,
  applyLintConfig,
  applyLintConfigBulk,
  loadLintConfig,
  validateLintConfig,
  type LintConfig,
  type RuleSeverity,
  type RuleConfig
} from './lint-config'

export {
  findConfigFile,
  loadConfigFile,
  mergeConfigs,
  clearConfigCache,
  watchConfigFile,
  createDefaultConfigFile,
  type ProtoTypedConfig
} from './config-loader'
