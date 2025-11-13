/**
 * Formatter Module - Public API
 *
 * Exports all formatting-related functionality:
 * - formatDocument: Main formatting function
 * - registerFormattingProvider: Monaco LSP integration
 * - Utility functions for testing and debugging
 */

export { formatDocument, isFormattingIdempotent, getFormattingStats } from './formatter';
export { registerFormattingProvider } from './format-provider';
