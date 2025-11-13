/**
 * Phase 3: Configurable Lint Rules
 *
 * This module provides a configuration system for customizing linter behavior,
 * inspired by ESLint, Svelte Language Tools, and other modern linters.
 *
 * Users can:
 * - Override severity levels for specific rules
 * - Disable rules entirely
 * - Configure rules per project via .proto-typed.json
 *
 * @example
 * ```typescript
 * const config: LintConfig = {
 *   rules: {
 *     'PT-LINT-2001': 'warn',    // Unused views as warning
 *     'PT-LINT-2002': 'off',     // Disable unused component check
 *     'PT-LINT-1001': 'error',   // Keep as error (explicit)
 *   }
 * }
 * ```
 */

import type { DiagnosticSeverity } from '../types/diagnostics'
import type { ProtoError, Severity } from '../types/errors'

/**
 * Rule severity configuration
 * - 'off': Rule is disabled, no diagnostic will be produced
 * - 'error': Rule violation produces an error (severity 1)
 * - 'warn' | 'warning': Rule violation produces a warning (severity 2)
 * - 'info': Rule violation produces information (severity 3)
 * - 'hint': Rule violation produces a hint (severity 4)
 */
export type RuleSeverity = 'off' | 'error' | 'warn' | 'warning' | 'info' | 'hint'

/**
 * Rule configuration - can be severity string or complex config object
 * Future: Can extend to support rule-specific options
 *
 * @example
 * ```typescript
 * {
 *   'PT-LINT-1001': 'warn'  // Simple severity override
 *   // Future: 'PT-LINT-1001': ['warn', { ignorePatterns: ['Test*'] }]
 * }
 * ```
 */
export type RuleConfig = RuleSeverity

/**
 * Lint configuration schema
 *
 * Follows conventions from:
 * - ESLint (.eslintrc.json)
 * - Svelte Language Tools (svelte.config.js)
 * - TypeScript (tsconfig.json)
 */
export interface LintConfig {
  /**
   * Rule-specific configuration
   * Key: Rule code (e.g., 'PT-LINT-1001')
   * Value: Severity override or configuration object
   */
  rules?: {
    [ruleCode: string]: RuleConfig
  }
}

/**
 * Default configuration - all rules enabled at their default severity
 *
 * Default severities come from ERROR_REGISTRY, which was established
 * in Phase 1. This config represents "no customization".
 */
export const DEFAULT_LINT_CONFIG: LintConfig = {
  rules: {}
}

/**
 * Merges multiple configurations with precedence
 * Later configs override earlier ones
 *
 * @param configs - Array of configs, in order of precedence (low to high)
 * @returns Merged configuration
 *
 * @example
 * ```typescript
 * const merged = mergeLintConfigs([
 *   baseConfig,      // Project defaults
 *   userConfig,      // User overrides
 *   cliConfig        // CLI flags (highest priority)
 * ])
 * ```
 */
export function mergeLintConfigs(...configs: LintConfig[]): LintConfig {
  const merged: LintConfig = {
    rules: {}
  }

  for (const config of configs) {
    if (config.rules) {
      merged.rules = {
        ...merged.rules,
        ...config.rules
      }
    }
  }

  return merged
}

/**
 * Converts RuleSeverity string to LSP DiagnosticSeverity number
 *
 * @param severity - Rule severity ('error', 'warn', 'info', 'hint')
 * @returns LSP severity (1 = error, 2 = warning, 3 = info, 4 = hint)
 */
export function severityToLSP(severity: RuleSeverity): DiagnosticSeverity | null {
  switch (severity) {
    case 'off':
      return null  // Disabled rules produce no diagnostic
    case 'error':
      return 1  // DiagnosticSeverity.Error
    case 'warn':
    case 'warning':
      return 2  // DiagnosticSeverity.Warning
    case 'info':
      return 3  // DiagnosticSeverity.Information
    case 'hint':
      return 4  // DiagnosticSeverity.Hint
    default:
      return null
  }
}

/**
 * Converts RuleSeverity to Proto-Typed Severity string
 *
 * Maps config severity to Proto-Typed's internal severity format:
 * - 'error' → 'error'
 * - 'warn'/'warning' → 'warning'
 * - 'info'/'hint' → 'info'
 * - 'off' → null (disabled)
 *
 * @param severity - Rule severity from config
 * @returns Proto-Typed severity or null if disabled
 */
export function severityToProtoTyped(severity: RuleSeverity): Severity | null {
  switch (severity) {
    case 'off':
      return null  // Disabled
    case 'error':
      return 'error'
    case 'warn':
    case 'warning':
      return 'warning'
    case 'info':
    case 'hint':
      return 'info'
    default:
      return null
  }
}

/**
 * Applies configuration to a diagnostic
 *
 * This is the core function that makes diagnostics respect user configuration:
 * 1. Check if rule is disabled → return null (no diagnostic)
 * 2. Check if severity is overridden → apply override
 * 3. Otherwise, keep original severity
 *
 * @param diagnostic - Original diagnostic from linter
 * @param config - User configuration
 * @returns Modified diagnostic or null if rule is disabled
 *
 * @example
 * ```typescript
 * const original: ProtoError = {
 *   code: 'PT-LINT-2001',
 *   severity: 'error',
 *   // ... other fields
 * }
 *
 * const config: LintConfig = {
 *   rules: { 'PT-LINT-2001': 'warn' }
 * }
 *
 * const adjusted = applyLintConfig(original, config)
 * // adjusted.severity === 'warning' (2)
 * ```
 */
export function applyLintConfig(
  diagnostic: ProtoError,
  config: LintConfig
): ProtoError | null {
  // No config, return as-is
  if (!config.rules || !diagnostic.code) {
    return diagnostic
  }

  // Check if rule has custom configuration
  const ruleConfig = config.rules[diagnostic.code]
  if (!ruleConfig) {
    return diagnostic  // No override, keep original
  }

  // Simple case: severity string
  if (typeof ruleConfig === 'string') {
    const newSeverity = severityToProtoTyped(ruleConfig)

    // Rule disabled
    if (newSeverity === null) {
      return null
    }

    // Create new diagnostic with overridden severity
    return {
      ...diagnostic,
      severity: newSeverity
    }
  }

  // Future: Handle complex rule configs
  return diagnostic
}

/**
 * Applies configuration to an array of diagnostics
 * Filters out disabled rules and adjusts severities
 *
 * @param diagnostics - Array of diagnostics
 * @param config - User configuration
 * @returns Filtered and adjusted diagnostics
 *
 * @example
 * ```typescript
 * const diagnostics = lintDocument(ast)
 * const adjusted = applyLintConfigBulk(diagnostics, userConfig)
 * errorBus.publishDiagnostics(uri, adjusted)
 * ```
 */
export function applyLintConfigBulk(
  diagnostics: ProtoError[],
  config: LintConfig
): ProtoError[] {
  return diagnostics
    .map(diag => applyLintConfig(diag, config))
    .filter((diag): diag is ProtoError => diag !== null)
}

/**
 * Configuration loader
 *
 * Note: Actual implementation moved to config-loader.ts (Phase 3)
 * This is a re-export for backward compatibility
 *
 * @param projectRoot - Project root directory
 * @returns Loaded configuration or default
 */
export { loadLintConfig } from './config-loader'

/**
 * Validates lint configuration
 * Checks for:
 * - Valid severity values
 * - Valid rule codes (optional, requires ERROR_REGISTRY)
 *
 * @param config - Configuration to validate
 * @returns Validation errors or empty array if valid
 */
export function validateLintConfig(config: LintConfig): string[] {
  const errors: string[] = []

  if (!config.rules) {
    return errors
  }

  const validSeverities: RuleSeverity[] = ['off', 'error', 'warn', 'warning', 'info', 'hint']

  for (const [ruleCode, ruleConfig] of Object.entries(config.rules)) {
    // Check severity string
    if (typeof ruleConfig === 'string') {
      if (!validSeverities.includes(ruleConfig)) {
        errors.push(`Invalid severity '${ruleConfig}' for rule '${ruleCode}'. Must be one of: ${validSeverities.join(', ')}`)
      }
    }
  }

  return errors
}
