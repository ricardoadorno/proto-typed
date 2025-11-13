/**
 * Diagnostics Module - LSP-Aligned Error Handling
 *
 * This module provides:
 * - Error registry with documentation
 * - Diagnostic factory functions
 * - Helper utilities for working with diagnostics
 *
 * **Phase 1 of LSP Evolution**: This module adds LSP-compliant fields
 * to Proto-Typed's diagnostic system while maintaining full backward
 * compatibility.
 *
 * @see DIAGNOSTICS_EVOLUTION.md for architecture details
 */

// Error Registry
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

// Diagnostic Factory
export {
  createDiagnostic,
  createLegacyDiagnostic,
  createRangeDiagnostic,
  createDiagnostics,
  enhanceDiagnostic,
  enhanceDiagnostics,
  type CreateDiagnosticOptions
} from './diagnostic-factory'

// Re-export LSP types for convenience
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
