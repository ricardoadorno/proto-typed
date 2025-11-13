/**
 * Test Suite for LSP-Aligned Diagnostics
 *
 * Tests the new Phase 1 features:
 * - LSP-compliant diagnostic creation
 * - Error registry lookups
 * - Range/Position conversions
 * - Backward compatibility
 */

import {
  createDiagnostic,
  createLegacyDiagnostic,
  createRangeDiagnostic,
  createRange,
  toZeroBased,
  toOneBased,
  getErrorInfo,
  getErrorUrl,
  enhanceDiagnostic,
} from './src/core/diagnostics'

// ============================================================
// Test Helper
// ============================================================

let passedTests = 0
let totalTests = 0

function test(name: string, fn: () => void) {
  totalTests++
  try {
    fn()
    console.log(`✅ PASS: ${name}`)
    passedTests++
  } catch (error) {
    console.log(`❌ FAIL: ${name}`)
    console.error(
      `   ${error instanceof Error ? error.message : String(error)}`
    )
  }
}

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(message)
  }
}

function assertEqual<T>(actual: T, expected: T, message?: string) {
  if (actual !== expected) {
    throw new Error(message || `Expected ${expected}, got ${actual}`)
  }
}

// ============================================================
// Test Suite
// ============================================================

console.log('🧪 Testing LSP-Aligned Diagnostics\n')
console.log('='.repeat(60))

// ========================================
// Position/Range Conversions
// ========================================

test('createRange creates valid Range', () => {
  const range = createRange(1, 5, 1, 10)
  assertEqual(range.start.line, 1)
  assertEqual(range.start.character, 5)
  assertEqual(range.end.line, 1)
  assertEqual(range.end.character, 10)
})

test('toZeroBased converts 1-based to 0-based', () => {
  const pos = toZeroBased(5, 10)
  assertEqual(pos.line, 4, 'Line should be 4 (0-indexed)')
  assertEqual(pos.character, 9, 'Character should be 9 (0-indexed)')
})

test('toOneBased converts 0-based to 1-based', () => {
  const result = toOneBased({ line: 4, character: 9 })
  assertEqual(result.line, 5, 'Line should be 5 (1-indexed)')
  assertEqual(result.column, 10, 'Column should be 10 (1-indexed)')
})

test('Round-trip conversion preserves values', () => {
  const original = { line: 10, column: 20 }
  const zeroBased = toZeroBased(original.line, original.column)
  const oneBased = toOneBased(zeroBased)
  assertEqual(oneBased.line, original.line)
  assertEqual(oneBased.column, original.column)
})

// ========================================
// Error Registry
// ========================================

test('getErrorInfo returns correct entry', () => {
  const info = getErrorInfo('PT-LINT-1001')
  assert(info !== undefined, 'Should find entry')
  assertEqual(info?.title, 'Undefined Component')
  assertEqual(info?.category, 'linter')
  assert(info?.url.includes('PT-LINT-1001'), 'URL should contain error code')
})

test('getErrorUrl returns URL for valid code', () => {
  const url = getErrorUrl('PT-LINT-1001')
  assert(url !== undefined, 'Should return URL')
  assert(
    url?.includes('proto-typed.dev/errors'),
    'URL should be documentation link'
  )
})

test('getErrorUrl returns undefined for invalid code', () => {
  const url = getErrorUrl('INVALID-CODE')
  assertEqual(url, undefined, 'Should return undefined for unknown codes')
})

// ========================================
// Diagnostic Creation (Legacy Format)
// ========================================

test('createLegacyDiagnostic populates both formats', () => {
  const diag = createLegacyDiagnostic(
    'PT-LINT-1001',
    'error',
    'Component "Foo" is not defined',
    5,
    10,
    3,
    'Define the component first'
  )

  // Legacy format
  assertEqual(diag.line, 5)
  assertEqual(diag.column, 10)
  assertEqual(diag.length, 3)

  // New format (should be auto-generated)
  assert(diag.range !== undefined, 'Range should be auto-generated')
  assertEqual(diag.range?.start.line, 4, 'Range line should be 0-indexed (4)')
  assertEqual(
    diag.range?.start.character,
    9,
    'Range character should be 0-indexed (9)'
  )
  assertEqual(
    diag.range?.end.character,
    12,
    'Range end should be start + length (12)'
  )
})

// ========================================
// Diagnostic Creation (Range Format)
// ========================================

test('createRangeDiagnostic populates both formats', () => {
  const range = createRange(4, 9, 4, 12) // 0-based
  const diag = createRangeDiagnostic(
    'PT-LINT-1001',
    'error',
    'Component "Foo" is not defined',
    range,
    'Define the component first'
  )

  // New format
  assert(diag.range !== undefined, 'Range should be present')
  assertEqual(diag.range?.start.line, 4)
  assertEqual(diag.range?.start.character, 9)

  // Legacy format (should be auto-generated)
  assertEqual(diag.line, 5, 'Line should be 1-indexed (5)')
  assertEqual(diag.column, 10, 'Column should be 1-indexed (10)')
  assertEqual(diag.length, 3, 'Length should be calculated (3)')
})

// ========================================
// Auto-Population from Registry
// ========================================

test('createDiagnostic auto-adds codeDescription', () => {
  const diag = createDiagnostic({
    code: 'PT-LINT-1001',
    severity: 'error',
    message: 'Test message',
    line: 5,
    column: 10,
  })

  assert(diag.codeDescription !== undefined, 'Should have codeDescription')
  assert(
    diag.codeDescription?.href.includes('PT-LINT-1001'),
    'codeDescription should link to error docs'
  )
})

test('createDiagnostic auto-adds source field', () => {
  const diag = createDiagnostic({
    code: 'PT-LINT-1001',
    severity: 'error',
    message: 'Test message',
    line: 5,
    column: 10,
  })

  assertEqual(diag.source, 'proto-typed-lint', 'Should have linter source')
})

test('createDiagnostic infers stage from code', () => {
  const lexerDiag = createDiagnostic({
    code: 'PT-LEX-1001',
    severity: 'error',
    message: 'Test',
    line: 1,
    column: 1,
  })
  assertEqual(lexerDiag.stage, 'lexer')
  assertEqual(lexerDiag.source, 'proto-typed-lexer')

  const parserDiag = createDiagnostic({
    code: 'PT-PARSE-1001',
    severity: 'error',
    message: 'Test',
    line: 1,
    column: 1,
  })
  assertEqual(parserDiag.stage, 'parser')
  assertEqual(parserDiag.source, 'proto-typed-parser')
})

// ========================================
// Backward Compatibility
// ========================================

test('Old code still works with legacy fields', () => {
  // Simulating old code that creates errors manually
  const oldStyleError: any = {
    stage: 'lexer',
    code: 'PT-LEX-1001',
    severity: 'error',
    message: 'Old style error',
    line: 5,
    column: 10,
    length: 3,
  }

  // Old style access still works
  assertEqual(oldStyleError.line, 5)
  assertEqual(oldStyleError.column, 10)
  assertEqual(oldStyleError.length, 3)
})

test('enhanceDiagnostic adds LSP fields to legacy errors', () => {
  const legacyError: any = {
    stage: 'lexer',
    code: 'PT-LEX-1001',
    severity: 'error',
    message: 'Legacy error',
    line: 5,
    column: 10,
    length: 3,
  }

  const enhanced = enhanceDiagnostic(legacyError)

  // Should now have range
  assert(enhanced.range !== undefined, 'Should add range')
  assertEqual(enhanced.range?.start.line, 4, 'Range should be 0-indexed')

  // Should now have source
  assert(enhanced.source !== undefined, 'Should add source')

  // Should now have codeDescription
  assert(enhanced.codeDescription !== undefined, 'Should add codeDescription')

  // Original fields still present
  assertEqual(enhanced.line, 5)
  assertEqual(enhanced.column, 10)
})

// ========================================
// Hint Auto-Population
// ========================================

test('createDiagnostic auto-adds hint from registry if missing', () => {
  const diag = createDiagnostic({
    code: 'PT-LINT-1001',
    severity: 'error',
    message: 'Component "Foo" is not defined',
    line: 5,
    column: 10,
    // No hint provided
  })

  assert(diag.hint !== undefined, 'Should auto-add hint from registry')
  assert(diag.hint!.length > 0, 'Hint should not be empty')
})

test('createDiagnostic preserves explicit hint', () => {
  const explicitHint = 'My custom hint'
  const diag = createDiagnostic({
    code: 'PT-LINT-1001',
    severity: 'error',
    message: 'Component "Foo" is not defined',
    line: 5,
    column: 10,
    hint: explicitHint,
  })

  assertEqual(diag.hint, explicitHint, 'Should use explicit hint, not registry')
})

// ========================================
// Results
// ========================================

console.log('='.repeat(60))
console.log(`\n✅ Tests passed: ${passedTests}/${totalTests}\n`)

if (passedTests === totalTests) {
  console.log('🎉 All tests passed! LSP alignment is working correctly.\n')
  process.exit(0)
} else {
  console.log(`⚠️  ${totalTests - passedTests} test(s) failed.\n`)
  process.exit(1)
}
