# Extension Test Plan

This directory centralizes the automated checks for the Proto‑Typed VS Code extension.
It documents how we exercise both primary features:

1. The **language server** (completion, diagnostics, hover, etc.)
2. The **webview playground** (rendering DSL previews with Monaco + messaging)

## Tooling

| Layer        | Runner     | Folder                                       |
| ------------ | ---------- | -------------------------------------------- |
| Language LSP | Vitest     | `packages/extension/tests/*.spec.ts`         |
| Webview      | Playwright | `packages/extension/tests/webview/*.spec.ts` |

Vitest provides fast Node‑based snapshot tests of the reusable language engine
exposed by `@proto-typed/core`, while Playwright renders the built webview bundle
in Chromium and simulates the vscode messaging contract (handshake, DSL updates,
render complete notifications).

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

### Webview (Playwright)

Located in `tests/webview/webview.spec.ts` with config `tests/playwright.config.ts`.

Steps per spec:

1. Load the built webview HTML (`dist/webview/index.html`) via `file://`.
2. Stub `acquireVsCodeApi` so the React app thinks it’s running inside VS Code.
3. Dispatch `HANDSHAKE_INIT` and wait for the webview to respond with `HANDSHAKE_ACK`.
4. Dispatch `DSL_UPDATE` using the sample DSL.
5. Wait for the app to emit `RENDER_COMPLETE` and grab the resulting HTML string.
6. Compare the payload to the reference renderer output from `@proto-typed/core`
   (`astToHtmlStringPreview`). This guarantees Monaco, theme state, and messaging
   match the backend behavior.

Playwright snapshots can be extended later (screenshots, multiple fixtures), but the current
HTML comparison already catches most regressions.

## Running the Suite

From the repo root (after `pnpm install` and building the webview bundle):

```bash
pnpm run -F proto-typed-vscode-extension build:webview
pnpm run -F proto-typed-vscode-extension test
```

Internally this runs:

- `pnpm run test:unit` → Vitest (language engine snapshots)
- `pnpm run test:webview` → Playwright (webview integration)

Regenerate snapshots with:

```bash
UPDATE_SNAPSHOTS=1 pnpm run -F proto-typed-vscode-extension test
```

## Extending Coverage

### Language Server Tests (Vitest)

Current coverage includes completions, diagnostics, hover, code actions, and document
lifecycle. To extend:

- **Semantic tokens** — Once `semantic-tokens.ts` returns real tokens, add snapshot tests
- **Formatting** — When `format()` is implemented, add format tests with before/after
- **Advanced hover** — Add tests for more complex DSL elements as they are added
- **Additional code actions** — Test new quick fixes as error codes are added

### Webview Tests (Playwright)

Current coverage validates DSL-to-HTML rendering matches core renderer output. To extend:

- Create additional DSL fixture files in `test-workspace/` for complex scenarios:
  - Modals with multiple screens
  - Drawers with navigation state
  - Component instantiation with props
  - Theme overrides via `styles:` blocks
- Add visual regression tests using Playwright screenshots
- Test interactive features (navigation, modal toggles, drawer state)

### E2E Tests (VS Code Test Runner)

If VS Code APIs need end-to-end coverage (e.g., command registration, preview webview
lifecycle, syntax highlighting), we can add VS Code Test Runner suites that:

- Launch real VS Code instance
- Open `.pty` files and trigger preview command
- Leverage the same `RENDER_COMPLETE` messaging hook
- Validate editor decorations, diagnostics collection, completion UI

## Test Coverage Summary

| Feature           | Coverage     | Tests Location            |
| ----------------- | ------------ | ------------------------- |
| Completions       | ✅ Full      | `language-engine.spec.ts` |
| Diagnostics       | ✅ Full      | `language-engine.spec.ts` |
| Hover             | ✅ Full      | `language-engine.spec.ts` |
| Code Actions      | ✅ Full      | `language-engine.spec.ts` |
| Semantic Tokens   | ⚠️ Stub only | N/A (returns `null`)      |
| Formatting        | ⚠️ Stub only | N/A (returns `[]`)        |
| Webview Rendering | ✅ Full      | `webview/webview.spec.ts` |
| Webview Messaging | ✅ Full      | `webview/webview.spec.ts` |

Keeping the test plan in this README ensures contributors know _exactly_ how we validate
both halves of the extension before shipping.
