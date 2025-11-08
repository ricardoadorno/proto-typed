# Extension Test Plan

This directory centralizes the automated checks for the Proto‑Typed VS Code extension.
It documents how we exercise both primary features:

1. The **language server** (completion, diagnostics, hover, etc.)
2. The **webview playground** (rendering DSL previews with messaging integration)

## Testing Strategy

We use a **two-layer testing approach** optimized for VS Code extension development:

| Layer          | Runner                | Location          | Purpose                                    |
| -------------- | --------------------- | ----------------- | ------------------------------------------ |
| **Unit Tests** | Vitest (Node)         | `tests/*.spec.ts` | Fast, isolated language engine tests       |
| **E2E Tests**  | @vscode/test-electron | `tests/e2e/`      | Full integration tests inside real VS Code |

### Why This Approach?

- **Vitest** provides fast, deterministic snapshot tests of the language engine without VS Code overhead
- **@vscode/test-electron** tests the complete extension (LSP + webview) inside a real VS Code instance
- **No Playwright** - webviews in VS Code extensions require VS Code APIs (`acquireVsCodeApi`) that can't be properly mocked in isolated browser tests

## What We Test

### Language Server (Vitest)

Implemented in `language-engine.spec.ts`.

We spin up `createEngine(host)` with the same host used by the extension,
attach a `TextDocument` for sample DSL inputs, and assert:

#### **Completions**

- Completion list snapshots (first items, `kind`, `insertText`, snippet format)
- Trigger character support (`@`, `#`, `_`, etc.)
- Context-aware completions (buttons, layouts, views, components)

#### **Diagnostics**

- Diagnostic snapshots for malformed DSL (error codes/ranges stay stable)
- Error detection for missing colons (`PTD102`)
- Error detection for missing indentation (`PTD103`)

#### **Hover**

- Hover documentation for keywords (`screen`, `modal`, `drawer`, `component`)
- Hover for layout containers (`container`, `card`, `list`, `header`)
- Hover for button variants (`@primary`, `@ghost`, `@destructive`, etc.)
- Null return for unknown tokens

#### **Code Actions**

- Quick fix for missing colon (adds `:` at declaration end)
- Quick fix for missing indentation (adds tab at line start)
- Code actions bound to specific diagnostic codes

#### **Document Lifecycle**

- `open()` / `update()` / `close()` event handling
- Diagnostic updates on document changes
- State management across document versions

These assertions use inline snapshots so regressions are visible in diff reviews.

### Webview E2E Tests (VS Code Test Runner)

Located in `tests/e2e/suite/webview.test.ts`.

These tests run inside a **real VS Code instance** to validate:

1. **Command registration** - `proto-typed.showPreview` is available
2. **Webview lifecycle** - Panel opens and initializes correctly
3. **DSL rendering** - Webview produces correct HTML output via `RENDER_COMPLETE` messaging
4. **Live updates** - DSL changes trigger re-renders with updated HTML
5. **Error handling** - Invalid DSL is handled gracefully without crashes

The tests use the **test command** `proto-typed.getLastRender` (registered only when the extension runs)
to access the `lastRenderSnapshot` captured by the extension host. This validates the complete
messaging flow: editor → host → webview → render → host notification.

## Running the Suite

### ⚠️ **IMPORTANT: E2E Tests Requirement**

**You MUST close ALL VS Code windows before running E2E tests!**

VS Code's test runner (`@vscode/test-electron`) requires exclusive access. If you see:

- `"Running extension tests from the command line is currently only supported if no other instance of Code is running"`
- `"Extension host is unresponsive"` or tests hanging
- `"Error mutex already exists"`

→ **Solution**: Close ALL VS Code windows (including this one) and run tests from terminal.

### Running Tests

From the repo root (after `pnpm install` and building the extension):

```bash
# Run all tests (unit + E2E)
pnpm run -F proto-typed-vscode-extension test

# Run only unit tests (fast, VS Code can remain open)
pnpm run -F proto-typed-vscode-extension test:unit

# Run only E2E tests (CLOSE VS CODE FIRST!)
pnpm run -F proto-typed-vscode-extension test:e2e
```

Regenerate snapshots with:

```bash
UPDATE_SNAPSHOTS=1 pnpm run -F proto-typed-vscode-extension test:unit
```

### Prerequisites

- **Unit tests**: Just `pnpm install` (no build needed, VS Code can be running)
- **E2E tests**:
  1. Run `pnpm run compile` (builds extension + webview)
  2. **CLOSE ALL VS CODE WINDOWS**
  3. Run tests from external terminal

## Extending Coverage

### Language Server Tests (Vitest)

Current coverage includes completions, diagnostics, hover, code actions, and document
lifecycle. To extend:

- **Semantic tokens** — Once `semantic-tokens.ts` returns real tokens, add snapshot tests
- **Formatting** — When `format()` is implemented, add format tests with before/after
- **Advanced hover** — Add tests for more complex DSL elements as they are added
- **Additional code actions** — Test new quick fixes as error codes are added

### E2E Webview Tests (@vscode/test-electron)

Current coverage validates rendering, live updates, and error handling. To extend:

- **Navigation testing** — Test screen navigation, modal/drawer toggles
- **Component props** — Validate component instantiation with dynamic props
- **Theme switching** — Test theme changes via `styles:` blocks
- **Error recovery** — Test more edge cases (missing files, syntax errors, etc.)
- **Performance** — Add timing assertions for render latency

### E2E LSP Tests (@vscode/test-electron)

Current coverage validates hover, completion, and diagnostics. To extend:

- **Code actions** — Test quick fix application (not just availability)
- **Definition/references** — Once implemented, test go-to-definition
- **Rename** — Test symbol rename operations
- **Formatting** — Test document formatting when implemented

## Test Coverage Summary

| Feature           | Coverage     | Test Type | Location                                           |
| ----------------- | ------------ | --------- | -------------------------------------------------- |
| Completions       | ✅ Full      | Unit      | `language-engine.spec.ts`                          |
| Diagnostics       | ✅ Full      | Unit      | `language-engine.spec.ts`                          |
| Hover             | ✅ Full      | Unit/E2E  | `language-engine.spec.ts`, `e2e/suite/lsp.test.ts` |
| Code Actions      | ✅ Full      | Unit      | `language-engine.spec.ts`                          |
| LSP Integration   | ✅ Full      | E2E       | `e2e/suite/lsp.test.ts`                            |
| Webview Rendering | ✅ Full      | E2E       | `e2e/suite/webview.test.ts`                        |
| Webview Lifecycle | ✅ Full      | E2E       | `e2e/suite/webview.test.ts`                        |
| Live Updates      | ✅ Full      | E2E       | `e2e/suite/webview.test.ts`                        |
| Error Handling    | ✅ Full      | E2E       | `e2e/suite/webview.test.ts`                        |
| Semantic Tokens   | ⚠️ Stub only | N/A       | N/A (returns `null`)                               |
| Formatting        | ⚠️ Stub only | N/A       | N/A (returns `[]`)                                 |

### Test Architecture Benefits

✅ **Fast feedback loop** - Unit tests run in ~1s, E2E in ~30s  
✅ **Real integration** - E2E tests validate actual VS Code behavior  
✅ **Snapshot stability** - Unit tests catch language engine regressions  
✅ **Messaging validation** - E2E tests verify host ↔ webview communication

Keeping the test plan in this README ensures contributors know _exactly_ how we validate
both halves of the extension before shipping.
