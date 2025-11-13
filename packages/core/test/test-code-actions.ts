/**
 * Phase 4 Tests: Code Actions & Quick Fixes
 *
 * Tests automated fixes for common diagnostic issues:
 * - Code action providers
 * - Quick fix generation
 * - Workspace edits
 * - Diagnostic enhancement
 */

import type { ProtoError } from './src/types/errors'
import type { CodeAction, Position, Range } from './src/types/diagnostics'
import {
  getCodeActions,
  getCodeActionsForDiagnostics,
  registerCodeActionProvider,
  createQuickFix,
  createTextEdit,
  createWorkspaceEdit,
  createInsertionEdit,
  createDeletionEdit,
  createReplacementEdit,
  type CodeActionProvider,
  type CodeActionContext
} from './src/core/diagnostics/code-actions'
import {
  enhanceWithCodeActions,
  enhanceDiagnosticsWithCodeActions,
  hasCodeActions,
  getCodeActionsFromDiagnostic,
  getPreferredCodeAction,
  countCodeActions
} from './src/core/diagnostics/diagnostic-enhancer'

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

const undefinedComponentDiagnostic: ProtoError = {
  stage: 'editor',
  code: 'PT-LINT-1001',
  severity: 'error',
  message: 'Component "Header" is not defined',
  hint: 'Define the component before using it',
  source: 'monaco'
}

const undefinedNavigationDiagnostic: ProtoError = {
  stage: 'editor',
  code: 'PT-LINT-1002',
  severity: 'error',
  message: 'Navigation target "About" does not exist',
  hint: 'Define a screen, modal, or drawer named "About"',
  source: 'monaco'
}

const unusedViewDiagnostic: ProtoError = {
  stage: 'editor',
  code: 'PT-LINT-2001',
  severity: 'warning',
  message: 'Screen "Settings" is defined but never used',
  hint: 'Remove unused definitions or add navigation to this view',
  source: 'monaco',
  range: {
    start: { line: 10, character: 0 },
    end: { line: 15, character: 0 }
  }
}

const unusedComponentDiagnostic: ProtoError = {
  stage: 'editor',
  code: 'PT-LINT-2002',
  severity: 'warning',
  message: 'Component "Footer" is defined but never instantiated',
  hint: 'Use the component or remove the definition',
  source: 'monaco',
  range: {
    start: { line: 20, character: 0 },
    end: { line: 25, character: 0 }
  }
}

const testUri = 'file:///test.dsl'

// ============================================================
// Test: Code Action Providers
// ============================================================

console.log('\n🧪 Testing Phase 4: Code Actions & Quick Fixes\n')
console.log('============================================================')

test('PT-LINT-1001: provides "Create component" action', () => {
  const actions = getCodeActions(undefinedComponentDiagnostic, testUri)

  assert(actions.length > 0, 'Should have at least one action')
  assert(actions.some(a => a.title.includes('Create component')), 'Should have create action')
  assert(actions.some(a => a.isPreferred), 'Should have preferred action')
})

test('PT-LINT-1001: creates valid workspace edit', () => {
  const actions = getCodeActions(undefinedComponentDiagnostic, testUri)
  const createAction = actions.find(a => a.title.includes('Create component'))

  assert(createAction !== undefined, 'Should find create action')
  assert(createAction!.edit !== undefined, 'Should have edit')
  assert(createAction!.edit!.changes !== undefined, 'Should have changes')
  assert(createAction!.edit!.changes![testUri] !== undefined, 'Should have edits for URI')
})

test('PT-LINT-1001: inserts correct component template', () => {
  const actions = getCodeActions(undefinedComponentDiagnostic, testUri)
  const createAction = actions.find(a => a.title.includes('Create component'))

  const edits = createAction!.edit!.changes![testUri]
  assert(edits.length === 1, 'Should have one edit')
  assert(edits[0].newText.includes('component Header'), 'Should include component name')
  assert(edits[0].newText.includes('TODO'), 'Should include TODO')
})

test('PT-LINT-1002: provides multiple view type actions', () => {
  const actions = getCodeActions(undefinedNavigationDiagnostic, testUri)

  assert(actions.length >= 3, 'Should have at least 3 actions (screen, modal, drawer)')
  assert(actions.some(a => a.title.includes('screen')), 'Should have screen option')
  assert(actions.some(a => a.title.includes('modal')), 'Should have modal option')
  assert(actions.some(a => a.title.includes('drawer')), 'Should have drawer option')
})

test('PT-LINT-1002: screen action is preferred', () => {
  const actions = getCodeActions(undefinedNavigationDiagnostic, testUri)
  const screenAction = actions.find(a => a.title.includes('screen'))

  assert(screenAction !== undefined, 'Should find screen action')
  assert(screenAction!.isPreferred === true, 'Screen should be preferred')
})

test('PT-LINT-2001: provides "Remove" action when range available', () => {
  const actions = getCodeActions(unusedViewDiagnostic, testUri)

  assert(actions.length > 0, 'Should have actions')
  assert(actions.some(a => a.title.includes('Remove')), 'Should have remove action')
})

test('PT-LINT-2002: provides "Remove" action when range available', () => {
  const actions = getCodeActions(unusedComponentDiagnostic, testUri)

  assert(actions.length > 0, 'Should have actions')
  assert(actions.some(a => a.title.includes('Remove')), 'Should have remove action')
})

test('Unknown code: returns empty actions', () => {
  const unknownDiagnostic: ProtoError = {
    stage: 'editor',
    code: 'PT-UNKNOWN-9999',
    severity: 'error',
    message: 'Unknown error',
    source: 'monaco'
  }

  const actions = getCodeActions(unknownDiagnostic, testUri)
  assertEqual(actions.length, 0, 'Should have no actions for unknown code')
})

test('Missing code: returns empty actions', () => {
  const noDiagnostic: ProtoError = {
    stage: 'editor',
    code: '',
    severity: 'error',
    message: 'Error without code',
    source: 'monaco'
  }

  const actions = getCodeActions(noDiagnostic, testUri)
  assertEqual(actions.length, 0, 'Should have no actions when code missing')
})

// ============================================================
// Test: Bulk Operations
// ============================================================

test('getCodeActionsForDiagnostics: handles multiple diagnostics', () => {
  const diagnostics = [
    undefinedComponentDiagnostic,
    undefinedNavigationDiagnostic,
    unusedViewDiagnostic
  ]

  const map = getCodeActionsForDiagnostics(diagnostics, testUri)

  assert(map.size === 3, 'Should have actions for all 3 diagnostics')
  assert(map.get(undefinedComponentDiagnostic)!.length > 0, 'Should have actions for first')
  assert(map.get(undefinedNavigationDiagnostic)!.length > 0, 'Should have actions for second')
  assert(map.get(unusedViewDiagnostic)!.length > 0, 'Should have actions for third')
})

test('getCodeActionsForDiagnostics: filters diagnostics without actions', () => {
  const unknownDiagnostic: ProtoError = {
    stage: 'editor',
    code: 'PT-UNKNOWN-9999',
    severity: 'error',
    message: 'Unknown',
    source: 'monaco'
  }

  const diagnostics = [undefinedComponentDiagnostic, unknownDiagnostic]
  const map = getCodeActionsForDiagnostics(diagnostics, testUri)

  assertEqual(map.size, 1, 'Should only have entry for diagnostic with actions')
  assert(map.has(undefinedComponentDiagnostic), 'Should have known diagnostic')
  assert(!map.has(unknownDiagnostic), 'Should not have unknown diagnostic')
})

// ============================================================
// Test: Helper Functions
// ============================================================

test('createTextEdit: creates valid edit', () => {
  const range: Range = {
    start: { line: 0, character: 0 },
    end: { line: 0, character: 5 }
  }
  const edit = createTextEdit(range, 'hello')

  assertEqual(edit.range, range, 'Should have correct range')
  assertEqual(edit.newText, 'hello', 'Should have correct text')
})

test('createInsertionEdit: creates insertion at position', () => {
  const position: Position = { line: 5, character: 10 }
  const edit = createInsertionEdit(position, 'inserted')

  assertEqual(edit.range.start, position, 'Start should be position')
  assertEqual(edit.range.end, position, 'End should be position')
  assertEqual(edit.newText, 'inserted', 'Should have correct text')
})

test('createDeletionEdit: creates deletion', () => {
  const range: Range = {
    start: { line: 0, character: 0 },
    end: { line: 2, character: 0 }
  }
  const edit = createDeletionEdit(range)

  assertEqual(edit.range, range, 'Should have correct range')
  assertEqual(edit.newText, '', 'Should have empty text for deletion')
})

test('createReplacementEdit: creates replacement', () => {
  const range: Range = {
    start: { line: 0, character: 0 },
    end: { line: 0, character: 5 }
  }
  const edit = createReplacementEdit(range, 'replaced')

  assertEqual(edit.range, range, 'Should have correct range')
  assertEqual(edit.newText, 'replaced', 'Should have replacement text')
})

test('createWorkspaceEdit: creates valid workspace edit', () => {
  const edits = [createInsertionEdit({ line: 0, character: 0 }, 'text')]
  const workspaceEdit = createWorkspaceEdit(testUri, edits)

  assert(workspaceEdit.changes !== undefined, 'Should have changes')
  assert(workspaceEdit.changes![testUri] !== undefined, 'Should have edits for URI')
  assertEqual(workspaceEdit.changes![testUri].length, 1, 'Should have one edit')
})

test('createQuickFix: creates valid code action', () => {
  const edit = createWorkspaceEdit(testUri, [])
  const action = createQuickFix('Fix it', undefinedComponentDiagnostic, edit, true)

  assertEqual(action.title, 'Fix it', 'Should have title')
  assertEqual(action.kind, 'quickfix', 'Should be quickfix kind')
  assert(action.isPreferred === true, 'Should be preferred')
  assertEqual(action.edit, edit, 'Should have edit')
})

// ============================================================
// Test: Diagnostic Enhancement
// ============================================================

test('enhanceWithCodeActions: attaches actions to diagnostic', () => {
  const enhanced = enhanceWithCodeActions(undefinedComponentDiagnostic, testUri)

  assert(enhanced.data !== undefined, 'Should have data field')
  assert((enhanced.data as any).codeActions !== undefined, 'Should have codeActions')
  assert(Array.isArray((enhanced.data as any).codeActions), 'Code actions should be array')
  assert((enhanced.data as any).codeActions.length > 0, 'Should have actions')
})

test('enhanceWithCodeActions: preserves original data', () => {
  const diagnosticWithData: ProtoError = {
    ...undefinedComponentDiagnostic,
    data: { customField: 'value' }
  }

  const enhanced = enhanceWithCodeActions(diagnosticWithData, testUri)

  assert((enhanced.data as any).customField === 'value', 'Should preserve custom field')
  assert((enhanced.data as any).codeActions !== undefined, 'Should add codeActions')
})

test('enhanceWithCodeActions: returns unchanged when no actions', () => {
  const unknownDiagnostic: ProtoError = {
    stage: 'editor',
    code: 'PT-UNKNOWN-9999',
    severity: 'error',
    message: 'Unknown',
    source: 'monaco'
  }

  const enhanced = enhanceWithCodeActions(unknownDiagnostic, testUri)
  assertEqual(enhanced, unknownDiagnostic, 'Should return same object when no actions')
})

test('enhanceDiagnosticsWithCodeActions: enhances array', () => {
  const diagnostics = [undefinedComponentDiagnostic, undefinedNavigationDiagnostic]
  const enhanced = enhanceDiagnosticsWithCodeActions(diagnostics, testUri)

  assertEqual(enhanced.length, 2, 'Should have same count')
  assert(hasCodeActions(enhanced[0]), 'First should have actions')
  assert(hasCodeActions(enhanced[1]), 'Second should have actions')
})

test('hasCodeActions: detects presence of actions', () => {
  const enhanced = enhanceWithCodeActions(undefinedComponentDiagnostic, testUri)

  assert(hasCodeActions(enhanced), 'Enhanced should have actions')
  assert(!hasCodeActions(undefinedComponentDiagnostic), 'Original should not have actions')
})

test('getCodeActionsFromDiagnostic: retrieves actions', () => {
  const enhanced = enhanceWithCodeActions(undefinedComponentDiagnostic, testUri)
  const actions = getCodeActionsFromDiagnostic(enhanced)

  assert(Array.isArray(actions), 'Should return array')
  assert(actions.length > 0, 'Should have actions')
})

test('getCodeActionsFromDiagnostic: returns empty for non-enhanced', () => {
  const actions = getCodeActionsFromDiagnostic(undefinedComponentDiagnostic)

  assert(Array.isArray(actions), 'Should return array')
  assertEqual(actions.length, 0, 'Should be empty')
})

test('getPreferredCodeAction: finds preferred action', () => {
  const enhanced = enhanceWithCodeActions(undefinedComponentDiagnostic, testUri)
  const preferred = getPreferredCodeAction(enhanced)

  assert(preferred !== undefined, 'Should find preferred action')
  assert(preferred!.isPreferred === true, 'Should be marked as preferred')
})

test('countCodeActions: counts across diagnostics', () => {
  const diagnostics = [undefinedComponentDiagnostic, undefinedNavigationDiagnostic]
  const enhanced = enhanceDiagnosticsWithCodeActions(diagnostics, testUri)
  const count = countCodeActions(enhanced)

  assert(count > 0, 'Should have actions')
  assert(count >= diagnostics.length, 'Should have at least one action per diagnostic')
})

// ============================================================
// Test: Custom Provider Registration
// ============================================================

test('registerCodeActionProvider: allows custom providers', () => {
  const customProvider: CodeActionProvider = {
    diagnosticCodes: ['PT-CUSTOM-001'],
    provideCodeActions: (context) => {
      return [{
        title: 'Custom fix',
        kind: 'quickfix'
      }]
    }
  }

  registerCodeActionProvider(customProvider)

  const customDiagnostic: ProtoError = {
    stage: 'editor',
    code: 'PT-CUSTOM-001',
    severity: 'error',
    message: 'Custom error',
    source: 'monaco'
  }

  const actions = getCodeActions(customDiagnostic, testUri)
  assert(actions.length > 0, 'Should have custom actions')
  assert(actions.some(a => a.title === 'Custom fix'), 'Should have custom fix')
})

// ============================================================
// Summary
// ============================================================

console.log('============================================================\n')

if (failCount === 0) {
  console.log(`✅ Tests passed: ${passCount}/${testCount}\n`)
  console.log('🎉 All tests passed! Phase 4 is working correctly.\n')
  console.log('Key achievements:')
  console.log('  ✅ Code action providers for common errors')
  console.log('  ✅ Quick fixes for undefined components/navigation')
  console.log('  ✅ Remove actions for unused definitions')
  console.log('  ✅ Workspace edit generation')
  console.log('  ✅ Diagnostic enhancement with code actions')
  console.log('  ✅ Bulk operations support')
  console.log('  ✅ Custom provider registration')
  process.exit(0)
} else {
  console.log(`✅ Tests passed: ${passCount}/${testCount}`)
  console.log(`❌ Tests failed: ${failCount}/${testCount}\n`)
  console.error(`⚠️  ${failCount} test(s) failed.`)
  process.exit(1)
}
