/**
 * Phase 3 Tests: Configurable Lint Rules
 *
 * Tests configuration system for customizing linter behavior:
 * - Severity overrides
 * - Rule disabling
 * - Configuration merging
 * - File-based configuration
 * - Integration with linter
 */

import * as fs from 'fs'
import * as path from 'path'
import * as os from 'os'
import type { ProtoError } from './src/types/errors'
import type { LintConfig } from './src/core/diagnostics/lint-config'
import {
  DEFAULT_LINT_CONFIG,
  severityToLSP,
  applyLintConfig,
  applyLintConfigBulk,
  mergeLintConfigs,
  validateLintConfig,
} from './src/core/diagnostics/lint-config'
import {
  findConfigFile,
  loadConfigFile,
  loadLintConfig,
  clearConfigCache,
  createDefaultConfigFile,
  type ProtoTypedConfig,
} from './src/core/diagnostics/config-loader'

// ============================================================
// Test Infrastructure
// ============================================================

let testCount = 0
let passCount = 0
let failCount = 0

function test(name: string, fn: () => void): void {
  testCount++
  try {
    fn()
    passCount++
    console.log(`✅ PASS: ${name}`)
  } catch (error) {
    failCount++
    console.error(`❌ FAIL: ${name}`)
    if (error instanceof Error) {
      console.error(`   ${error.message}`)
    }
  }
}

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(message)
  }
}

function assertEqual<T>(actual: T, expected: T, message: string): void {
  if (actual !== expected) {
    throw new Error(`${message}\n  Expected: ${expected}\n  Actual: ${actual}`)
  }
}

// ============================================================
// Test Data
// ============================================================

const sampleError: ProtoError = {
  stage: 'editor',
  code: 'PT-LINT-2001',
  severity: 'warning',
  message: 'Screen "About" is defined but never used',
  hint: 'Remove unused definitions',
  source: 'monaco',
}

const sampleInfo: ProtoError = {
  stage: 'editor',
  code: 'PT-LINT-2002',
  severity: 'warning',
  message: 'Component "Header" is defined but never instantiated',
  hint: 'Use the component or remove definition',
  source: 'monaco',
}

const sampleFatalError: ProtoError = {
  stage: 'editor',
  code: 'PT-LINT-1001',
  severity: 'error',
  message: 'Component "Footer" is not defined',
  hint: 'Define the component',
  source: 'monaco',
}

// ============================================================
// Test: Severity Conversion
// ============================================================

console.log('\n🧪 Testing Phase 3: Configurable Lint Rules\n')
console.log('============================================================')

test('severityToLSP: converts "off" to null', () => {
  const result = severityToLSP('off')
  assertEqual(result, null, 'Should return null for disabled rules')
})

test('severityToLSP: converts "error" to 1', () => {
  const result = severityToLSP('error')
  assertEqual(result, 1, 'Should return 1 for error')
})

test('severityToLSP: converts "warn" to 2', () => {
  const result = severityToLSP('warn')
  assertEqual(result, 2, 'Should return 2 for warn')
})

test('severityToLSP: converts "warning" to 2', () => {
  const result = severityToLSP('warning')
  assertEqual(result, 2, 'Should return 2 for warning')
})

test('severityToLSP: converts "info" to 3', () => {
  const result = severityToLSP('info')
  assertEqual(result, 3, 'Should return 3 for info')
})

test('severityToLSP: converts "hint" to 4', () => {
  const result = severityToLSP('hint')
  assertEqual(result, 4, 'Should return 4 for hint')
})

// ============================================================
// Test: Apply Config to Single Diagnostic
// ============================================================

test('applyLintConfig: returns null when rule is disabled', () => {
  const config: LintConfig = {
    rules: { 'PT-LINT-2001': 'off' },
  }
  const result = applyLintConfig(sampleError, config)
  assertEqual(result, null, 'Should return null for disabled rule')
})

test('applyLintConfig: overrides severity to error', () => {
  const config: LintConfig = {
    rules: { 'PT-LINT-2001': 'error' },
  }
  const result = applyLintConfig(sampleError, config)
  assert(result !== null, 'Should not be null')
  assertEqual(result!.severity, 'error', 'Should be error')
})

test('applyLintConfig: overrides severity to warn', () => {
  const config: LintConfig = {
    rules: { 'PT-LINT-1001': 'warn' }, // Error -> Warning
  }
  const result = applyLintConfig(sampleFatalError, config)
  assert(result !== null, 'Should not be null')
  assertEqual(result!.severity, 'warning', 'Should be warning')
})

test('applyLintConfig: overrides severity to info', () => {
  const config: LintConfig = {
    rules: { 'PT-LINT-2001': 'info' },
  }
  const result = applyLintConfig(sampleError, config)
  assert(result !== null, 'Should not be null')
  assertEqual(result!.severity, 'info', 'Should be info')
})

test('applyLintConfig: keeps original when no override', () => {
  const config: LintConfig = {
    rules: { 'PT-LINT-9999': 'off' }, // Different rule
  }
  const result = applyLintConfig(sampleError, config)
  assert(result !== null, 'Should not be null')
  assertEqual(result!.severity, 'warning', 'Should keep original severity')
})

test('applyLintConfig: returns as-is when no config', () => {
  const result = applyLintConfig(sampleError, {})
  assertEqual(result, sampleError, 'Should return original diagnostic')
})

// ============================================================
// Test: Apply Config to Multiple Diagnostics
// ============================================================

test('applyLintConfigBulk: filters disabled rules', () => {
  const diagnostics = [sampleError, sampleInfo, sampleFatalError]
  const config: LintConfig = {
    rules: {
      'PT-LINT-2001': 'off', // Disable first
      'PT-LINT-2002': 'off', // Disable second
    },
  }
  const result = applyLintConfigBulk(diagnostics, config)
  assertEqual(result.length, 1, 'Should have 1 diagnostic (only fatal error)')
  assertEqual(result[0].code, 'PT-LINT-1001', 'Should be the fatal error')
})

test('applyLintConfigBulk: applies multiple overrides', () => {
  const diagnostics = [sampleError, sampleInfo, sampleFatalError]
  const config: LintConfig = {
    rules: {
      'PT-LINT-2001': 'info', // Warning -> Info
      'PT-LINT-1001': 'warn', // Error -> Warning
    },
  }
  const result = applyLintConfigBulk(diagnostics, config)
  assertEqual(result.length, 3, 'Should have all 3 diagnostics')
  assertEqual(result[0].severity, 'info', 'First should be info')
  assertEqual(result[2].severity, 'warning', 'Last should be warning')
})

test('applyLintConfigBulk: empty config returns all', () => {
  const diagnostics = [sampleError, sampleInfo, sampleFatalError]
  const result = applyLintConfigBulk(diagnostics, {})
  assertEqual(result.length, 3, 'Should have all 3 diagnostics')
})

// ============================================================
// Test: Config Merging
// ============================================================

test('mergeLintConfigs: merges two configs', () => {
  const base: LintConfig = {
    rules: {
      'PT-LINT-2001': 'warn',
      'PT-LINT-2002': 'error',
    },
  }
  const override: LintConfig = {
    rules: {
      'PT-LINT-2001': 'off', // Override
    },
  }
  const result = mergeLintConfigs(base, override)
  assertEqual(result.rules!['PT-LINT-2001'], 'off', 'Should use override')
  assertEqual(result.rules!['PT-LINT-2002'], 'error', 'Should keep base')
})

test('mergeLintConfigs: later configs win', () => {
  const config1: LintConfig = { rules: { 'PT-LINT-2001': 'warn' } }
  const config2: LintConfig = { rules: { 'PT-LINT-2001': 'error' } }
  const config3: LintConfig = { rules: { 'PT-LINT-2001': 'off' } }

  const result = mergeLintConfigs(config1, config2, config3)
  assertEqual(result.rules!['PT-LINT-2001'], 'off', 'Should use last config')
})

test('mergeLintConfigs: handles empty configs', () => {
  const config: LintConfig = { rules: { 'PT-LINT-2001': 'warn' } }
  const result = mergeLintConfigs({}, config, {})
  assertEqual(result.rules!['PT-LINT-2001'], 'warn', 'Should preserve config')
})

// ============================================================
// Test: Config Validation
// ============================================================

test('validateLintConfig: accepts valid config', () => {
  const config: LintConfig = {
    rules: {
      'PT-LINT-2001': 'warn',
      'PT-LINT-2002': 'off',
      'PT-LINT-1001': 'error',
    },
  }
  const errors = validateLintConfig(config)
  assertEqual(errors.length, 0, 'Should have no errors')
})

test('validateLintConfig: rejects invalid severity', () => {
  const config: LintConfig = {
    rules: {
      'PT-LINT-2001': 'invalid' as any,
    },
  }
  const errors = validateLintConfig(config)
  assert(errors.length > 0, 'Should have errors')
})

test('validateLintConfig: accepts empty config', () => {
  const errors = validateLintConfig({})
  assertEqual(errors.length, 0, 'Should have no errors')
})

// ============================================================
// Test: File-Based Configuration
// ============================================================

// Create temp directory for config tests
const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'proto-typed-test-'))

test('findConfigFile: finds .proto-typed.json', () => {
  const configPath = path.join(tempDir, '.proto-typed.json')
  fs.writeFileSync(configPath, '{}', 'utf-8')

  const found = findConfigFile(tempDir)
  assert(found !== null, 'Should find config file')
  assert(found!.endsWith('.proto-typed.json'), 'Should be .proto-typed.json')
})

test('findConfigFile: returns null when not found', () => {
  const emptyDir = fs.mkdtempSync(path.join(os.tmpdir(), 'proto-typed-empty-'))
  const found = findConfigFile(emptyDir)
  assertEqual(found, null, 'Should not find config file')
  fs.rmdirSync(emptyDir)
})

test('loadConfigFile: loads valid JSON config', () => {
  const configPath = path.join(tempDir, '.proto-typed-load.json')
  const configContent: ProtoTypedConfig = {
    lint: {
      rules: {
        'PT-LINT-2001': 'warn',
      },
    },
  }
  fs.writeFileSync(configPath, JSON.stringify(configContent), 'utf-8')

  clearConfigCache() // Clear cache
  const loaded = loadConfigFile(configPath)
  assert(loaded !== null, 'Should load config')
  assertEqual(loaded!.lint!.rules!['PT-LINT-2001'], 'warn', 'Should have rule')
})

test('loadConfigFile: returns null for invalid JSON', () => {
  const configPath = path.join(tempDir, '.proto-typed-invalid.json')
  fs.writeFileSync(configPath, '{ invalid json }', 'utf-8')

  clearConfigCache()
  const loaded = loadConfigFile(configPath)
  assertEqual(loaded, null, 'Should return null for invalid JSON')
})

test('loadConfigFile: caches loaded configs', () => {
  const configPath = path.join(tempDir, '.proto-typed-cache.json')
  fs.writeFileSync(configPath, '{"lint":{"rules":{}}}', 'utf-8')

  clearConfigCache()
  const first = loadConfigFile(configPath)
  const second = loadConfigFile(configPath)

  // Should be same object (cached)
  assertEqual(first, second, 'Should return cached config')
})

test('loadLintConfig: returns default when no file', () => {
  const emptyDir = fs.mkdtempSync(
    path.join(os.tmpdir(), 'proto-typed-noconfig-')
  )
  const config = loadLintConfig(emptyDir)

  assert(config !== null, 'Should return config')
  assert(config.rules !== undefined, 'Should have rules object')
  fs.rmdirSync(emptyDir)
})

test('loadLintConfig: loads from project root', () => {
  const projectDir = fs.mkdtempSync(
    path.join(os.tmpdir(), 'proto-typed-project-')
  )
  const configPath = path.join(projectDir, '.proto-typed.json')
  const configContent: ProtoTypedConfig = {
    lint: {
      rules: {
        'PT-LINT-2001': 'off',
      },
    },
  }
  fs.writeFileSync(configPath, JSON.stringify(configContent), 'utf-8')

  clearConfigCache()
  const config = loadLintConfig(projectDir)
  assertEqual(
    config.rules!['PT-LINT-2001'],
    'off',
    'Should load rule from file'
  )

  // Cleanup
  fs.unlinkSync(configPath)
  fs.rmdirSync(projectDir)
})

test('createDefaultConfigFile: creates config file', () => {
  const projectDir = fs.mkdtempSync(
    path.join(os.tmpdir(), 'proto-typed-create-')
  )
  const configPath = path.join(projectDir, '.proto-typed.json')

  createDefaultConfigFile(projectDir)

  assert(fs.existsSync(configPath), 'Config file should exist')
  const content = fs.readFileSync(configPath, 'utf-8')
  const parsed = JSON.parse(content)
  assert(parsed.lint !== undefined, 'Should have lint section')

  // Cleanup
  fs.unlinkSync(configPath)
  fs.rmdirSync(projectDir)
})

// ============================================================
// Test: Integration with Linter (Mock)
// ============================================================

test('Integration: config disables warnings', () => {
  // Simulate linter output
  const linterOutput = [sampleError, sampleInfo, sampleFatalError]

  // User config: disable all warnings
  const userConfig: LintConfig = {
    rules: {
      'PT-LINT-2001': 'off',
      'PT-LINT-2002': 'off',
    },
  }

  // Apply config
  const filtered = applyLintConfigBulk(linterOutput, userConfig)

  assertEqual(filtered.length, 1, 'Should only have error, not warnings')
  assertEqual(filtered[0].code, 'PT-LINT-1001', 'Should be the error')
})

test('Integration: config downgrades errors to warnings', () => {
  const linterOutput = [sampleFatalError]

  // User wants soft errors
  const userConfig: LintConfig = {
    rules: {
      'PT-LINT-1001': 'warn',
    },
  }

  const adjusted = applyLintConfigBulk(linterOutput, userConfig)

  assertEqual(adjusted.length, 1, 'Should have diagnostic')
  assertEqual(adjusted[0].severity, 'warning', 'Should be warning')
})

test('Integration: config promotes warnings to errors', () => {
  const linterOutput = [sampleError]

  // User wants strict mode
  const userConfig: LintConfig = {
    rules: {
      'PT-LINT-2001': 'error',
    },
  }

  const adjusted = applyLintConfigBulk(linterOutput, userConfig)

  assertEqual(adjusted.length, 1, 'Should have diagnostic')
  assertEqual(adjusted[0].severity, 'error', 'Should be error')
})

// ============================================================
// Cleanup and Summary
// ============================================================

// Cleanup temp directory
try {
  const files = fs.readdirSync(tempDir)
  for (const file of files) {
    fs.unlinkSync(path.join(tempDir, file))
  }
  fs.rmdirSync(tempDir)
} catch (error) {
  console.error('Cleanup error:', error)
}

console.log('============================================================\n')

if (failCount === 0) {
  console.log(`✅ Tests passed: ${passCount}/${testCount}\n`)
  console.log('🎉 All tests passed! Phase 3 is working correctly.\n')
  console.log('Key achievements:')
  console.log('  ✅ Severity override system')
  console.log('  ✅ Rule disabling (off)')
  console.log('  ✅ Configuration merging')
  console.log('  ✅ File-based configuration (.proto-typed.json)')
  console.log('  ✅ Config validation')
  console.log('  ✅ Integration with linter')
  process.exit(0)
} else {
  console.log(`✅ Tests passed: ${passCount}/${testCount}`)
  console.log(`❌ Tests failed: ${failCount}/${testCount}\n`)
  console.error(`⚠️  ${failCount} test(s) failed.`)
  process.exit(1)
}
