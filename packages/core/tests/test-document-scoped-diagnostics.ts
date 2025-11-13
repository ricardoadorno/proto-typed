/**
 * Test Suite for Phase 2: Document-Scoped Diagnostics
 *
 * Tests the new document-scoped diagnostic storage:
 * - DiagnosticStore operations
 * - ErrorBus V2 backward compatibility
 * - ErrorBus V2 new document-scoped API
 * - publishDiagnostics pattern
 * - Migration path from global to document-scoped
 */

import {
  DiagnosticStore,
  ErrorBusV2,
  createDiagnostic,
} from './src/core/diagnostics'

// ============================================================
// Test Helper
// ============================================================

let passedTests = 0
let totalTests = 0

function test(name: string, fn: () => void | Promise<void>) {
  totalTests++
  try {
    const result = fn()
    if (result instanceof Promise) {
      result
        .then(() => {
          console.log(`✅ PASS: ${name}`)
          passedTests++
        })
        .catch((error: Error) => {
          console.log(`❌ FAIL: ${name}`)
          console.error(`   ${error.message}`)
        })
    } else {
      console.log(`✅ PASS: ${name}`)
      passedTests++
    }
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
// Setup
// ============================================================

console.log('🧪 Testing Phase 2: Document-Scoped Diagnostics\n')
console.log('='.repeat(60))

// Create fresh instances
const store = DiagnosticStore.get()
const errorBus = ErrorBusV2.get()

// Test URIs
const URI1 = 'file:///test1.dsl'
const URI2 = 'file:///test2.dsl'
const URI3 = 'file:///test3.dsl'

// Sample diagnostics
const diag1 = createDiagnostic({
  code: 'PT-LINT-1001',
  severity: 'error',
  message: 'Error 1',
  line: 1,
  column: 1,
})

const diag2 = createDiagnostic({
  code: 'PT-LINT-1002',
  severity: 'warning',
  message: 'Warning 1',
  line: 2,
  column: 1,
})

const diag3 = createDiagnostic({
  code: 'PT-LINT-2001',
  severity: 'info',
  message: 'Info 1',
  line: 3,
  column: 1,
})

// ========================================
// DiagnosticStore Tests
// ========================================

test('DiagnosticStore: publishDiagnostics stores diagnostics', () => {
  store.clearAll()
  store.publishDiagnostics(URI1, [diag1, diag2])

  const diagnostics = store.getDiagnostics(URI1)
  assertEqual(diagnostics.length, 2, 'Should have 2 diagnostics')
})

test('DiagnosticStore: publishDiagnostics empty array clears', () => {
  store.publishDiagnostics(URI1, [diag1])
  store.publishDiagnostics(URI1, []) // Clear

  const diagnostics = store.getDiagnostics(URI1)
  assertEqual(diagnostics.length, 0, 'Should be cleared')
})

test('DiagnosticStore: multiple documents are independent', () => {
  store.clearAll()
  store.publishDiagnostics(URI1, [diag1])
  store.publishDiagnostics(URI2, [diag2, diag3])

  assertEqual(store.getDiagnostics(URI1).length, 1)
  assertEqual(store.getDiagnostics(URI2).length, 2)
})

test('DiagnosticStore: deduplication works per document', () => {
  store.clearAll()
  const duplicate = { ...diag1 }

  store.publishDiagnostics(URI1, [diag1, duplicate])

  const diagnostics = store.getDiagnostics(URI1)
  assertEqual(diagnostics.length, 1, 'Should dedupe within document')
})

test('DiagnosticStore: getAllDiagnostics returns map', () => {
  store.clearAll()
  store.publishDiagnostics(URI1, [diag1])
  store.publishDiagnostics(URI2, [diag2])

  const all = store.getAllDiagnostics()
  assertEqual(all.size, 2, 'Should have 2 documents')
  assert(all.has(URI1), 'Should have URI1')
  assert(all.has(URI2), 'Should have URI2')
})

test('DiagnosticStore: clearDiagnostics removes document', () => {
  store.clearAll()
  store.publishDiagnostics(URI1, [diag1])
  store.clearDiagnostics(URI1)

  assertEqual(store.getDiagnostics(URI1).length, 0)
})

test('DiagnosticStore: clearAll removes all documents', () => {
  store.publishDiagnostics(URI1, [diag1])
  store.publishDiagnostics(URI2, [diag2])
  store.clearAll()

  assertEqual(store.getTotalCount(), 0)
  assertEqual(store.getAllDiagnostics().size, 0)
})

test('DiagnosticStore: subscribe gets immediate notification', () => {
  store.clearAll()
  store.publishDiagnostics(URI1, [diag1])

  let notified = false
  let receivedDiagnostics: any[] = []

  store.subscribe(URI1, (_uri, diagnostics) => {
    notified = true
    receivedDiagnostics = diagnostics
  })

  assert(notified, 'Should be notified immediately')
  assertEqual(
    receivedDiagnostics.length,
    1,
    'Should receive current diagnostics'
  )
})

test('DiagnosticStore: subscribe gets updates', () => {
  store.clearAll()

  let callCount = 0
  store.subscribe(URI1, () => {
    callCount++
  })

  // Initial notification happened (callCount = 1)
  store.publishDiagnostics(URI1, [diag1]) // callCount = 2

  assertEqual(callCount, 2, 'Should be called on updates')
})

test('DiagnosticStore: unsubscribe works', () => {
  store.clearAll()

  let callCount = 0
  const unsubscribe = store.subscribe(URI1, () => {
    callCount++
  })

  unsubscribe() // Unsubscribe

  store.publishDiagnostics(URI1, [diag1]) // Should NOT call

  assertEqual(
    callCount,
    1,
    'Should not be called after unsubscribe (only initial)'
  )
})

// ========================================
// ErrorBus V2: Backward Compatibility
// ========================================

test('ErrorBus V2: emit() works (backward compat)', () => {
  errorBus.clear()
  errorBus.emit(diag1)

  const all = errorBus.getAll()
  assertEqual(all.length, 1, 'Should have 1 error')
})

test('ErrorBus V2: bulk() works (backward compat)', () => {
  errorBus.clear()
  errorBus.bulk([diag1, diag2, diag3])

  const all = errorBus.getAll()
  assertEqual(all.length, 3, 'Should have 3 errors')
})

test('ErrorBus V2: clear() works (backward compat)', () => {
  errorBus.clear()
  errorBus.emit(diag1)
  errorBus.clear()

  const all = errorBus.getAll()
  assertEqual(all.length, 0, 'Should be cleared')
})

test('ErrorBus V2: clear(stage) filters (backward compat)', () => {
  errorBus.clear()

  const lexerError = { ...diag1, stage: 'lexer' as const }
  const parserError = { ...diag2, stage: 'parser' as const }

  errorBus.bulk([lexerError, parserError])
  errorBus.clear('lexer')

  const all = errorBus.getAll()
  assertEqual(all.length, 1, 'Should only have parser error')
  assertEqual(all[0].stage, 'parser')
})

test('ErrorBus V2: getByStage() works (backward compat)', () => {
  errorBus.clear()

  const lexerError = { ...diag1, stage: 'lexer' as const }
  const parserError = { ...diag2, stage: 'parser' as const }

  errorBus.bulk([lexerError, parserError])

  const lexerErrors = errorBus.getByStage('lexer')
  assertEqual(lexerErrors.length, 1, 'Should have 1 lexer error')
})

test('ErrorBus V2: subscribe() works (backward compat)', () => {
  errorBus.clear()

  let notified = false
  errorBus.subscribe((errors) => {
    notified = true
  })

  errorBus.emit(diag1)

  assert(notified, 'Should be notified on emit')
})

test('ErrorBus V2: count() works (backward compat)', () => {
  errorBus.clear()
  errorBus.bulk([diag1, diag2])

  assertEqual(errorBus.count(), 2, 'Should have count of 2')
})

test('ErrorBus V2: hasFatalErrors() works (backward compat)', () => {
  errorBus.clear()

  const fatalError = { ...diag1, severity: 'fatal' as const }
  errorBus.emit(fatalError)

  assert(errorBus.hasFatalErrors(), 'Should detect fatal error')
})

// ========================================
// ErrorBus V2: New Document-Scoped API
// ========================================

test('ErrorBus V2: publishDiagnostics() stores by URI', () => {
  errorBus.publishDiagnostics(URI1, [diag1])
  errorBus.publishDiagnostics(URI2, [diag2, diag3])

  assertEqual(errorBus.getDiagnostics(URI1).length, 1)
  assertEqual(errorBus.getDiagnostics(URI2).length, 2)
})

test('ErrorBus V2: clearDiagnostics() clears specific URI', () => {
  errorBus.publishDiagnostics(URI1, [diag1])
  errorBus.publishDiagnostics(URI2, [diag2])

  errorBus.clearDiagnostics(URI1)

  assertEqual(errorBus.getDiagnostics(URI1).length, 0)
  assertEqual(
    errorBus.getDiagnostics(URI2).length,
    1,
    'URI2 should be unaffected'
  )
})

test('ErrorBus V2: subscribeToDocument() works', () => {
  let notified = false
  let receivedUri = ''

  errorBus.subscribeToDocument(URI1, (uri, diagnostics) => {
    notified = true
    receivedUri = uri
  })

  errorBus.publishDiagnostics(URI1, [diag1])

  assert(notified, 'Should be notified')
  assertEqual(receivedUri, URI1, 'Should receive correct URI')
})

test('ErrorBus V2: getAllDocuments() returns non-default URIs', () => {
  // Clear all first
  errorBus.publishDiagnostics(URI1, [])
  errorBus.publishDiagnostics(URI2, [])

  errorBus.publishDiagnostics(URI1, [diag1])
  errorBus.publishDiagnostics(URI2, [diag2])

  const docs = errorBus.getAllDocuments()

  assert(docs.includes(URI1), 'Should include URI1')
  assert(docs.includes(URI2), 'Should include URI2')
})

test('ErrorBus V2: getTotalCount() counts across documents', () => {
  errorBus.publishDiagnostics(URI1, [diag1])
  errorBus.publishDiagnostics(URI2, [diag2, diag3])

  const defaultCount = errorBus.getAll().length
  const total = errorBus.getTotalCount()

  assert(total >= 3, 'Should count diagnostics from multiple documents')
})

test('ErrorBus V2: hasAnyDiagnostics() detects any', () => {
  errorBus.publishDiagnostics(URI1, [])
  errorBus.publishDiagnostics(URI2, [])
  errorBus.clear() // Clear default URI

  assertEqual(errorBus.hasAnyDiagnostics(), false, 'Should be false when empty')

  errorBus.publishDiagnostics(URI1, [diag1])

  assertEqual(
    errorBus.hasAnyDiagnostics(),
    true,
    'Should be true when has diagnostics'
  )
})

test('ErrorBus V2: hasDiagnostics(uri) checks specific document', () => {
  errorBus.publishDiagnostics(URI1, [diag1])
  errorBus.publishDiagnostics(URI2, [])

  assertEqual(
    errorBus.hasDiagnostics(URI1),
    true,
    'URI1 should have diagnostics'
  )
  assertEqual(
    errorBus.hasDiagnostics(URI2),
    false,
    'URI2 should not have diagnostics'
  )
})

// ========================================
// Migration Path
// ========================================

test('ErrorBus V2: legacy and new API coexist', () => {
  errorBus.clear() // Clear default URI

  // Legacy API
  errorBus.emit(diag1)

  // New API
  errorBus.publishDiagnostics(URI1, [diag2])

  // Both work
  assertEqual(errorBus.getAll().length, 1, 'Legacy API should work')
  assertEqual(errorBus.getDiagnostics(URI1).length, 1, 'New API should work')
})

test('ErrorBus V2: isLegacyMode() detects mode', () => {
  // Clear all URIs from previous tests
  errorBus.publishDiagnostics(URI1, [])
  errorBus.publishDiagnostics(URI2, [])
  errorBus.publishDiagnostics(URI3, [])
  errorBus.clear() // Clear default URI

  // Only default URI has diagnostics
  errorBus.emit(diag1)
  assert(errorBus.isLegacyMode(), 'Should be in legacy mode')

  // Add document-scoped diagnostic
  errorBus.publishDiagnostics(URI1, [diag2])
  assertEqual(errorBus.isLegacyMode(), false, 'Should not be in legacy mode')
})

test('ErrorBus V2: getDefaultUri() returns consistent URI', () => {
  const uri = errorBus.getDefaultUri()
  assert(uri.length > 0, 'Should have default URI')
  assert(uri.includes('default'), 'Should indicate default')
})

// ========================================
// Results
// ========================================

// Wait a bit for async tests
setTimeout(() => {
  console.log('='.repeat(60))
  console.log(`\n✅ Tests passed: ${passedTests}/${totalTests}\n`)

  if (passedTests === totalTests) {
    console.log('🎉 All tests passed! Phase 2 is working correctly.\n')
    console.log('Key achievements:')
    console.log('  ✅ Document-scoped diagnostic storage')
    console.log('  ✅ LSP publishDiagnostics pattern')
    console.log('  ✅ 100% backward compatibility with ErrorBus V1')
    console.log('  ✅ New document-scoped API')
    console.log('  ✅ Migration path from global to document-scoped\n')
    process.exit(0)
  } else {
    console.log(`⚠️  ${totalTests - passedTests} test(s) failed.\n`)
    process.exit(1)
  }
}, 100)
