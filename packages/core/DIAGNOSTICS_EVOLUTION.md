# Proto-Typed Diagnostics System - Gap Analysis & Evolution Proposal

## Executive Summary

This document analyzes the current Proto-Typed diagnostics/linting system against best practices from major LSP implementations (Volar, Svelte Language Tools) and the LSP specification, then proposes evolutionary improvements.

**Status**: ✅ Strong foundation, but room for alignment with LSP standards

---

## 1. Current State Analysis

### 1.1 What We Have Today

#### ErrorBus (`src/core/error-bus.ts`)
**Strengths:**
- ✅ Clean Singleton pattern
- ✅ Pub/Sub architecture (observers can subscribe)
- ✅ Automatic deduplication via composite key
- ✅ Stage-based filtering (lexer, parser, builder, renderer, editor)
- ✅ Immediate notification to late subscribers (critical for Monaco)
- ✅ Graceful error handling in subscribers

**Architecture:**
```typescript
ErrorBus (Singleton)
  ├── errors: ProtoError[]
  ├── listeners: Callback[]
  ├── emit(error) → dedupe → notify
  ├── bulk(errors) → dedupe batch → notify
  ├── subscribe(cb) → immediate snapshot + future updates
  └── clear(stage?) → selective or full clear
```

#### ProtoError Type (`src/types/errors.ts`)
**Structure:**
```typescript
{
  // Core fields
  stage: 'lexer' | 'parser' | 'builder' | 'renderer' | 'editor'
  code: string              // e.g., 'PT-LEX-1001'
  severity: 'info' | 'warning' | 'error' | 'fatal'
  message: string
  hint?: string             // Suggested fix

  // Location
  line?: number
  column?: number
  length?: number

  // Context
  nodeId?: string
  sourceSnippet?: string

  // Stage-specific fields (discriminated union)
  token?, expected?, rule?, nodeType?, etc.
}
```

**Strengths:**
- ✅ Discriminated union per stage (type-safe)
- ✅ Structured error codes (PT-STAGE-NNNN)
- ✅ Hint field for quick fixes
- ✅ Severity ranking system

#### Linter (`src/core/linter/linter.ts`)
**Current Rules:**
1. **PT-LINT-1001**: Undefined component reference
2. **PT-LINT-1002**: Undefined navigation target
3. **PT-LINT-2001**: Unused view definition
4. **PT-LINT-2002**: Unused component definition
5. **PT-LINT-3001**: Duplicate view name
6. **PT-LINT-3002**: Duplicate component name

**Strengths:**
- ✅ AST traversal with context collection
- ✅ Cross-reference validation
- ✅ Special handling for entry point (first screen)
- ✅ Recognizes special destinations (-1, URLs, anchors)

#### Monaco Integration (`src/core/editor/hooks/use-monaco-dsl.ts`)
**Current Flow:**
```
ErrorBus.subscribe() → getBestErrorPerLine() → monaco.editor.setModelMarkers()
```

**Strengths:**
- ✅ Deduplicates multiple errors per line (keeps highest severity)
- ✅ Formats messages with stage prefix
- ✅ Maps severity to Monaco MarkerSeverity

---

## 2. LSP Specification Standards

### 2.1 LSP Diagnostic Structure (v3.17)

According to the official LSP spec:

```typescript
interface Diagnostic {
  range: Range                        // { start: Position, end: Position }
  severity?: DiagnosticSeverity       // 1=Error, 2=Warning, 3=Info, 4=Hint
  code?: integer | string             // Unique identifier
  codeDescription?: CodeDescription   // Link to documentation
  source?: string                     // e.g., "proto-typed-lint"
  message: string                     // Human-readable description
  tags?: DiagnosticTag[]              // Unnecessary, Deprecated
  relatedInformation?: DiagnosticRelatedInformation[]
  data?: any                          // For code actions
}

interface DiagnosticRelatedInformation {
  location: Location
  message: string
}
```

**Key Differences from Our Model:**
- ❌ We use `line`, `column`, `length` (separate fields)
  - LSP uses `range: { start, end }` (Position objects)
- ❌ We don't have `codeDescription` (link to docs)
- ❌ We don't have `tags` (Unnecessary, Deprecated)
- ❌ We don't have `relatedInformation` (cross-references)
- ❌ We don't have `data` field for code actions
- ⚠️ Our `hint` field is custom (not standard LSP)

### 2.2 publishDiagnostics Notification

**LSP Pattern:**
```
Server → Client: textDocument/publishDiagnostics
{
  uri: "file:///path/to/file.dsl",
  version?: number,
  diagnostics: Diagnostic[]
}
```

**Key Points:**
- Diagnostics are **per-document** (URI-scoped)
- Sending empty array **clears** previous diagnostics
- No merging on client side - always replace
- Can arrive at any time (not just on change)

**Our Current Pattern:**
- ✅ We clear with `ErrorBus.clear()`
- ✅ We replace all diagnostics on each parse
- ❌ We don't track which file each error belongs to (no URI)
- ❌ We don't use LSP's publishDiagnostics (Monaco direct API instead)

---

## 3. Best Practices from Volar & Svelte LSP

### 3.1 Volar (Vue Language Tools)

**Architecture Insights:**
1. **Multi-Project Support**: Each `tsconfig.json` gets its own language service instance
2. **Layered Diagnostics**:
   - Template errors (Vue compiler)
   - TypeScript errors (TS service)
   - Style errors (CSS service)
3. **Incremental Updates**: Only re-compute diagnostics for changed files
4. **Source Attribution**: Each diagnostic has clear `source` field
5. **Performance**: Debounced diagnostic computation

**Key Takeaways:**
- ✅ We should have clear `source` attribution per diagnostic type
- ✅ Incremental updates would improve performance (currently re-lint entire AST)
- ⚠️ We don't need multi-project (single DSL file per editor instance)

### 3.2 Svelte Language Tools

**Architecture Insights:**
1. **Four Main Areas**:
   - CSS diagnostics (delegates to vscode-css-languageservice)
   - HTML diagnostics (delegates to vscode-html-languageservice)
   - Svelte compiler diagnostics
   - TypeScript diagnostics (via svelte2tsx transformation)

2. **Configuration**: Diagnostic codes can be:
   - Ignored
   - Treated as warnings
   - Treated as errors

3. **CLI Tool**: `svelte-check` for batch validation

**Key Takeaways:**
- ✅ We should support configurable severity per rule
- ✅ CLI tool for batch checking would be valuable
- ✅ Clear separation of diagnostic sources (lexer, parser, linter, etc.)

---

## 4. Gap Analysis

### 4.1 What We Do Well ✅

1. **Structured Error Codes**: `PT-STAGE-NNNN` pattern is excellent
2. **Stage-Based Organization**: Clear separation of lexer/parser/builder/renderer/editor
3. **Deduplication**: Automatic via composite key
4. **Pub/Sub Pattern**: Clean observer pattern for ErrorBus
5. **Hint System**: Custom field for suggested fixes (better than LSP's lack of this)
6. **Type Safety**: Discriminated unions per stage

### 4.2 Gaps vs LSP Standards ⚠️

| Feature | LSP Standard | Proto-Typed Current | Gap |
|---------|-------------|-------------------|-----|
| Position Model | `range: { start, end }` | `line, column, length` | ⚠️ Different API |
| Code Description | `codeDescription: { href }` | None | ❌ Missing |
| Tags | `tags: [Unnecessary, Deprecated]` | None | ❌ Missing |
| Related Info | `relatedInformation: []` | None | ❌ Missing |
| Data Field | `data: any` (for code actions) | None | ❌ Missing |
| Source Field | `source: string` | Implicit in `stage` | ⚠️ Could be clearer |
| Document URI | Per-file diagnostics | Global error pool | ⚠️ No file tracking |

### 4.3 Architectural Weaknesses 🔴

1. **No Document Scoping**:
   - ErrorBus holds global error pool
   - Can't distinguish errors from different files
   - Problem for multi-file editing scenarios

2. **No Incremental Updates**:
   - Linter re-analyzes entire AST on every change
   - Could be optimized with dirty tracking

3. **Limited Configurability**:
   - No way to adjust severity per rule
   - No way to disable specific lint rules
   - Hard-coded rule behavior

4. **Missing Code Actions**:
   - We have `hint` field but no mechanism for quick fixes
   - LSP supports code actions with `data` field

5. **No Documentation Links**:
   - Error codes exist but no URL to detailed explanations
   - LSP's `codeDescription.href` provides this

6. **No Diagnostic Tags**:
   - Can't mark code as "unnecessary" (unused imports, etc.)
   - Can't mark code as "deprecated" (old syntax)

---

## 5. Proposed Evolution

### 5.1 Goals

1. **Align with LSP standards** while preserving our strengths
2. **Maintain backward compatibility** where possible
3. **Keep it simple** - don't add complexity for marginal gains
4. **Enable future features** (code actions, documentation, configuration)

### 5.2 Phase 1: Enhance Diagnostic Model (Non-Breaking)

**Add LSP-compatible fields to ProtoError:**

```typescript
export interface ProtoErrorBase {
  // ========================================
  // EXISTING FIELDS (Keep for backward compat)
  // ========================================
  stage: Stage
  code: string
  severity: Severity
  message: string
  hint?: string              // CUSTOM: Keep this, it's valuable
  line?: number              // DEPRECATED: Use range instead
  column?: number            // DEPRECATED: Use range instead
  length?: number            // DEPRECATED: Use range instead
  nodeId?: string
  sourceSnippet?: string
  messageKey?: string
  messageParams?: Record<string, string | number>

  // ========================================
  // NEW LSP-ALIGNED FIELDS
  // ========================================

  // Position (LSP-compliant)
  range?: {
    start: { line: number; character: number }
    end: { line: number; character: number }
  }

  // Source attribution (clearer than stage)
  source?: string           // e.g., "proto-typed-lexer", "proto-typed-lint"

  // Documentation link
  codeDescription?: {
    href: string            // e.g., "https://proto-typed.dev/errors/PT-LINT-1001"
  }

  // Diagnostic tags
  tags?: DiagnosticTag[]    // 'unnecessary' | 'deprecated'

  // Related information (for cross-references)
  relatedInformation?: Array<{
    location: {
      uri?: string          // File path (for multi-file)
      range: Range
    }
    message: string
  }>

  // Data for code actions
  data?: unknown            // Arbitrary data for quick fixes
}

// LSP-compatible tags
export enum DiagnosticTag {
  Unnecessary = 1,
  Deprecated = 2
}
```

**Migration Strategy:**
- Add new fields as optional
- Populate both old (`line`, `column`) and new (`range`) formats
- Deprecate old fields over time
- ErrorBus can serialize to both formats

### 5.3 Phase 2: Document-Scoped Diagnostics

**Problem**: ErrorBus doesn't track which file errors belong to

**Solution**: Add document URI tracking

```typescript
export interface DiagnosticEntry {
  uri: string              // Document identifier (file path or virtual URI)
  diagnostics: ProtoError[]
  version?: number         // Document version for staleness checks
}

export class ErrorBus {
  // OLD: private errors: ProtoError[]
  // NEW: private diagnosticsByUri: Map<string, DiagnosticEntry>

  // Enhanced API
  publishDiagnostics(uri: string, diagnostics: ProtoError[], version?: number): void
  getDiagnostics(uri: string): ProtoError[]
  clearDiagnostics(uri: string): void
  getAllDiagnostics(): Map<string, ProtoError[]>
}
```

**Benefits:**
- Multi-file editing support
- Clear separation of errors per document
- Aligns with LSP's publishDiagnostics pattern
- Enables incremental updates

### 5.4 Phase 3: Configurable Lint Rules

**Problem**: No way to customize linter behavior

**Solution**: Add configuration system

```typescript
export interface LintConfig {
  rules: {
    [ruleId: string]: 'off' | 'warn' | 'error' | 'info'
  }
}

// Example usage
const config: LintConfig = {
  rules: {
    'PT-LINT-2001': 'warn',    // Unused views as warning (not error)
    'PT-LINT-2002': 'off',     // Disable unused component check
  }
}

// In linter
export function lintDocument(
  ast: AstNode[],
  config?: LintConfig
): LintResult {
  // Apply config to adjust severities or skip rules
}
```

**Benefits:**
- Users can tune linter to their needs
- Teams can enforce standards
- Aligns with Svelte LSP's configurability

### 5.5 Phase 4: Code Actions & Quick Fixes

**Problem**: `hint` field is informational only, no automated fixes

**Solution**: Implement LSP code actions

```typescript
export interface ProtoCodeAction {
  title: string                    // "Import missing component"
  kind: CodeActionKind             // quickfix, refactor, etc.
  diagnostics?: ProtoError[]       // Which errors this fixes
  edit?: WorkspaceEdit             // Text changes to apply
  command?: Command                // Command to execute
}

// Attach to diagnostic
const diagnostic: ProtoError = {
  // ... existing fields
  data: {
    fixes: [
      {
        title: 'Add missing component definition',
        kind: 'quickfix',
        edit: {
          changes: {
            [uri]: [
              {
                range: { start: {...}, end: {...} },
                newText: 'component MyComponent:\n  # TODO\n'
              }
            ]
          }
        }
      }
    ]
  }
}
```

**Benefits:**
- One-click fixes for common issues
- Better developer experience
- Aligns with VS Code expectations

### 5.6 Phase 5: Documentation & Error Catalog

**Problem**: Error codes exist but no central documentation

**Solution**: Create error catalog with URLs

```typescript
// Error code registry
export const ERROR_REGISTRY = {
  'PT-LINT-1001': {
    title: 'Undefined Component Reference',
    description: 'Component is used but not defined',
    url: 'https://proto-typed.dev/errors/PT-LINT-1001',
    examples: [
      {
        bad: 'screen Home:\n  $UndefinedComponent',
        good: 'component MyComponent:\n  # ...\n\nscreen Home:\n  $MyComponent'
      }
    ],
    fixes: ['Define the component', 'Fix the component name']
  },
  // ... more entries
}

// Automatically add codeDescription
function enhanceDiagnostic(error: ProtoError): ProtoError {
  const entry = ERROR_REGISTRY[error.code]
  if (entry) {
    error.codeDescription = { href: entry.url }
  }
  return error
}
```

**Benefits:**
- Users can learn about errors
- Centralized documentation
- Professional polish

---

## 6. Implementation Roadmap

### Sprint 1: Foundation (Week 1-2)
- [ ] Add new LSP fields to ProtoError (optional, non-breaking)
- [ ] Create Range type and helpers (line/col → Range conversion)
- [ ] Add `source` field generation
- [ ] Update ErrorBus to populate both old and new fields
- [ ] Add DiagnosticTag enum

### Sprint 2: Document Scoping (Week 3-4)
- [ ] Refactor ErrorBus to use URI-based storage
- [ ] Update Monaco integration to use URI
- [ ] Add `publishDiagnostics` API
- [ ] Migrate existing code to new API
- [ ] Deprecate global error pool

### Sprint 3: Configuration (Week 5-6)
- [ ] Design LintConfig schema
- [ ] Implement rule severity override
- [ ] Add config file support (.proto-typed.json)
- [ ] Update linter to respect config
- [ ] Add CLI flag for config path

### Sprint 4: Code Actions (Week 7-8)
- [ ] Design CodeAction system
- [ ] Implement quick fixes for top 5 common errors
- [ ] Add Monaco code action provider
- [ ] Test UX in editor

### Sprint 5: Documentation (Week 9-10)
- [ ] Create error catalog website
- [ ] Generate docs from ERROR_REGISTRY
- [ ] Add codeDescription URLs to all diagnostics
- [ ] Write examples for each error code

---

## 7. Comparison: Before vs After

### Before (Current)

**Diagnostic Creation:**
```typescript
const error: ProtoError = {
  stage: 'editor',
  code: 'PT-LINT-1001',
  severity: 'error',
  message: 'Component "Foo" is not defined',
  hint: 'Define the component before using it',
  line: 5,
  column: 3,
  source: 'monaco'
}

errorBus.emit(error)
```

**Monaco Integration:**
```typescript
const markers = errors.map(err => ({
  startLineNumber: err.line || 1,
  startColumn: err.column || 1,
  endLineNumber: err.line || 1,
  endColumn: model.getLineMaxColumn(err.line || 1),
  message: `[${err.stage}] ${err.message}`,
  severity: toMonacoSeverity(err.severity)
}))
```

### After (Proposed)

**Diagnostic Creation:**
```typescript
const diagnostic = createDiagnostic({
  code: 'PT-LINT-1001',
  severity: 'error',
  message: 'Component "Foo" is not defined',
  range: {
    start: { line: 4, character: 2 },  // 0-indexed
    end: { line: 4, character: 6 }
  },
  source: 'proto-typed-lint',
  codeDescription: {
    href: 'https://proto-typed.dev/errors/PT-LINT-1001'
  },
  data: {
    fixes: [
      {
        title: 'Create component "Foo"',
        kind: 'quickfix',
        edit: { /* ... */ }
      }
    ]
  }
})

errorBus.publishDiagnostics(documentUri, [diagnostic])
```

**Monaco Integration:**
```typescript
const markers = diagnostics.map(diag => ({
  startLineNumber: diag.range.start.line + 1,  // Monaco is 1-indexed
  startColumn: diag.range.start.character + 1,
  endLineNumber: diag.range.end.line + 1,
  endColumn: diag.range.end.character + 1,
  message: diag.message,
  severity: diag.severity,
  source: diag.source,
  code: diag.code,
  tags: diag.tags
}))
```

---

## 8. Decisions & Rationale

### 8.1 Keep `hint` Field (Not Standard LSP)

**Decision**: Retain our custom `hint` field alongside LSP's `data` field

**Rationale**:
- Simple, human-readable suggestions
- Doesn't require code action infrastructure
- Can co-exist with code actions
- Users benefit immediately without waiting for full code action system

**Inspired by**: Our own innovation (not from Volar/Svelte, but valuable)

### 8.2 Dual Format Support (Transition Period)

**Decision**: Support both old (`line`, `column`) and new (`range`) formats during migration

**Rationale**:
- Non-breaking change
- Gives time for consumers to migrate
- Can run both formats in parallel
- Deprecate old format after 2-3 versions

**Inspired by**: Standard deprecation practices

### 8.3 URI-Based Scoping Optional

**Decision**: URI scoping is optional, fallback to global pool if no URI

**Rationale**:
- Current single-file use case works fine
- Don't break existing code
- Enable multi-file when needed
- Simple migration path

**Inspired by**: LSP's document-scoped diagnostics

### 8.4 Configuration via File, Not Runtime API

**Decision**: Load config from `.proto-typed.json`, not runtime API

**Rationale**:
- Standard practice (ESLint, Prettier, etc.)
- Easy to version control
- Team can share config
- No API complexity

**Inspired by**: Svelte LSP's configuration approach

### 8.5 Documentation URLs via Registry

**Decision**: Central ERROR_REGISTRY with URLs, not hardcoded in errors

**Rationale**:
- Single source of truth
- Easy to update docs without code changes
- Can generate website from registry
- Supports i18n in future

**Inspired by**: TypeScript's error messages system

---

## 9. Risk Assessment

### Low Risk ✅
- Adding new optional fields to ProtoError
- Creating Range type helpers
- Adding DiagnosticTag enum
- Enhancing ErrorBus with new methods (backward compatible)

### Medium Risk ⚠️
- Refactoring ErrorBus to URI-based storage (breaking change)
- Changing Monaco integration (needs careful testing)
- Adding code action infrastructure (new complexity)

### High Risk 🔴
- Removing old `line`/`column` fields (breaking change)
- Changing public API of ErrorBus (wide usage)
- Incremental linting (complex optimization, can introduce bugs)

### Mitigation Strategies
1. **Phased Rollout**: Implement in sprints, test each phase
2. **Feature Flags**: Guard new features behind flags
3. **Deprecation Warnings**: Warn before removing old API
4. **Extensive Testing**: Unit + integration tests for each phase
5. **Documentation**: Clear migration guides

---

## 10. Success Metrics

### Code Quality
- [ ] 100% TypeScript type coverage
- [ ] Zero breaking changes in Phase 1
- [ ] All existing tests pass
- [ ] New tests for all new features

### LSP Alignment
- [ ] Diagnostic structure matches LSP v3.17 spec
- [ ] All LSP fields have corresponding ProtoError fields
- [ ] publishDiagnostics pattern implemented

### Developer Experience
- [ ] Error messages are clear and actionable
- [ ] Code actions work for top 5 common errors
- [ ] Documentation available for all error codes
- [ ] Configuration reduces false positives

### Performance
- [ ] No performance regression from current system
- [ ] Incremental linting (future) improves perf by 50%+

---

## 11. References

### External
- **LSP Spec**: https://microsoft.github.io/language-server-protocol/
- **Volar**: https://github.com/vuejs/language-tools
- **Svelte LSP**: https://github.com/sveltejs/language-tools

### Internal
- `src/core/error-bus.ts` - Current ErrorBus implementation
- `src/types/errors.ts` - Current ProtoError types
- `src/core/linter/linter.ts` - Current linter
- `src/core/editor/hooks/use-monaco-dsl.ts` - Monaco integration

---

## 12. Conclusion

Proto-Typed has a **solid foundation** for diagnostics/linting. The ErrorBus architecture is clean, the error model is well-structured, and the linter is functional.

The main gaps are:
1. **LSP alignment** - Position model, new fields
2. **Document scoping** - Multi-file support
3. **Configurability** - Rule customization
4. **Code actions** - Automated fixes

The proposed evolution brings us closer to industry standards (Volar, Svelte LSP) while preserving our strengths (hint system, clean architecture, type safety).

**Recommendation**: Implement in 5 sprints, starting with non-breaking enhancements (Phase 1) and progressively adding advanced features.

This evolution will make Proto-Typed's diagnostics **best-in-class** for DSL tooling.
