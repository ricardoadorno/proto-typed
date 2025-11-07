# Proto-Typed Language Services

This module hosts everything that turns the Proto-Typed DSL into a consumable
Language Server experience. It exposes the engines that power IntelliSense,
diagnostics, hovers, and error reporting for both the VS Code extension and the
web playground (Monaco).

```
packages/core/src/language
├── adapters/          # Framework-specific wiring (VS Code, Monaco)
├── engine/            # LSP-like features implemented against TextDocuments
├── grammar/           # TextMate grammar + language configuration JSON
└── index.ts           # Public exports
```

## High-level Architecture

1. **LanguageHost (supplied by the consumer)** turns raw text into domain
   results: an AST plus `ProtoError[]`. The host decides how to parse the DSL
   (typically via `parseAndBuildAst` and `ErrorBus` from `packages/core`).
2. **LanguageEngine** (in `engine/engine.ts`) keeps a `TextDocumentStore`,
   reacts to document lifecycle events (`open`, `update`, `close`), and
   transforms `ProtoError`s into protocol-compliant diagnostics, completions,
   hovers, semantic tokens, and code actions.
3. **Adapters** translate between host environments and the engine:
   - `adapters/vscode.ts` wires the engine into VS Code APIs
   - `adapters/monaco.ts` wires the engine into Monaco via LSP-style providers
4. **Grammar assets** (`grammar/proto-typed.tmLanguage.json` and
   `grammar/language-configuration.json`) define syntax highlighting,
   indentation rules, and token classifications. These files are shared by both
   the VS Code extension and the Monaco integration.

## LanguageHost Contract

```ts
export interface LanguageHost {
  parse(text: string, uri: string): { ast: unknown; errors: ProtoError[] }
  onErrors?(uri: string, cb: (errors: ProtoError[]) => void): () => void
}
```

- `parse` must be a **pure** operation that never mutates shared state; the
  engine expects it to succeed even when the AST is unusable (return `errors`
  describing the failure).
- `onErrors` is optional and enables push updates when an external process (e.g.
  background validation) produces errors for a given URI.

### How Hosts Are Implemented Today

- **Web playground (`packages/web`):**
  `src/components/editor/language-host.ts` plugs the parser (`parseAndBuildAst`),
  renderer errors, and the shared `ErrorBus`. Each Monaco model URI is cached so
  UI widgets can render aggregated validation state.
- **VS Code extension (`packages/extension`):**
  The extension imports `parseAndBuildAst` directly and registers the host via
  `activateVSCodeAdapter`.

When adding a new runtime (CLI, tests, etc.), implement `LanguageHost` close to
the environment to retain control over caching and telemetry.

## Engine Modules

| File | Responsibility |
| --- | --- |
| `engine/textdoc-store.ts` | Keeps the canonical `TextDocument` plus latest AST, diagnostics, and ProtoError mirror for every open URI |
| `engine/diagnostics.ts` | Maps `ProtoError` -> `Diagnostic`, enriches with deterministic codes (`PTDxxx`) and ranges |
| `engine/completions.ts` | Provides IntelliSense snippets and metadata; driven by trigger characters exported as `TRIGGER_CHARACTERS` |
| `engine/hover.ts` | Keyword-centric Markdown tooltips for DSL constructs |
| `engine/code-actions.ts` | Contextual quick fixes (missing colon, missing indent, etc.) |
| `engine/semantic-tokens.ts` | Placeholder for future semantic-token support (currently returns `null`) |

Every helper operates on `vscode-languageserver-*` primitives so we can re-use
the same logic in both VS Code and Monaco.

## Grammar & Configuration

- `proto-typed.tmLanguage.json` — TextMate grammar that tokenizes views,
  components, typography, forms, layouts, and delimiters.
- `language-configuration.json` — Bracket pairs, auto-closing, indentation, and
  comment settings.

Consumers fetch these via `getTextMateGrammar()` and
`getLanguageConfiguration()`. The VS Code extension feeds them into the VS Code
language configuration APIs. The web playground uses the grammar to drive
tokenization (see the `registerGrammar` hook in the Monaco adapter).

## Adapter Responsibilities

### VS Code (`adapters/vscode.ts`)

- Registers language features against VS Code's `languages` API
- Converts between VS Code diagnostics/edits and LSP-compatible types
- Keeps `DiagnosticCollection` in sync with the engine
- Hands completion, hover, code action, semantic token, and formatting requests
  off to the engine

### Monaco (`adapters/monaco.ts`)

- Registers the Proto-Typed language ID and configuration with Monaco
- Bridges Monaco models to `TextDocument` objects expected by the engine
- Hooks provider APIs (`registerCompletionItemProvider`, `registerHoverProvider`,
  etc.) and forwards events to the engine
- Emits Monaco markers whenever diagnostics change
- Accepts an optional `registerGrammar` callback: supply a TextMate resolver
  (e.g., `monaco-textmate` + Oniguruma) to enable syntax highlighting that uses
  the grammar exported here

## Interaction With Other Packages

- `packages/core` (this package) supplies **language tooling** in addition to
  the parser, renderer, and shared type exports under `src/`.
- `packages/extension` depends on the `activateVSCodeAdapter` helper plus the
  textmate grammar/configuration JSON when bundling the VS Code extension.
- `packages/web` imports `attachToMonaco`, `TRIGGER_CHARACTERS`, and grammar
  helpers to power the playground editor. The hook `useMonacoDSL` composes the
  adapter with a `LanguageHost` implementation and the custom theme.

## Development & Testing

- Build the core package: `pnpm compile:core`
- Run unit tests (from repo root): `pnpm test` or `pnpm test:run`
- When editing grammar JSON, validate with any TextMate tooling (VS Code's
  built-in TM grammar inspector is handy) before publishing.
- The Monaco adapter is TypeScript-only; no runtime tests exist yet. When
  updating it, exercise the playground (`pnpm dev`) and the VS Code extension to
  ensure both adapters still work.

## Extending the Language Module

1. **New completions** — add snippet definitions in
   `engine/completions.ts` and update `TRIGGER_CHARACTERS` if necessary.
2. **Additional diagnostics** — extend `ERROR_CODES` in
   `packages/core/src/types/errors.ts` and add mapping entries in
   `engine/diagnostics.ts`.
3. **Hover docs** — add tokens to `HOVER_MAP` in `engine/hover.ts`.
4. **Code actions** — implement a helper in `engine/code-actions.ts` and wire it
   inside `getCodeActions`.
5. **Syntax highlighting** — edit `grammar/proto-typed.tmLanguage.json`; keep
   `scopeName` stable and coordinate with theming in
   `packages/web/src/components/editor/theme`.
6. **Formatting/Semantic tokens** — stubs exist in the engine; implement when
   we have an AST transformer or semantic token legend.

Whenever you add a new construct, remember the downstream consumers:

- Update the VS Code extension snippets/README
- Refresh Monaco theme colors if the grammar introduces new scopes
- Consider e2e fixtures under `packages/core/tests/syntax`

## Example: Wiring Monaco

```ts
import { attachToMonaco, createEngine } from '@proto-typed/core/language'
import { createLanguageHost } from './language-host'

const host = createLanguageHost()
await attachToMonaco(monaco, editor, host, {
  registerGrammar: async ({ monaco, editor, grammar, configuration }) => {
    await registerTextMate(monaco, editor, grammar, configuration)
  },
})
```

## Known Gaps / TODOs

- Semantic tokens currently return `null`; VS Code + Monaco fall back to TextMate
  theming only.
- Formatting provider is stubbed (`format()` returns an empty array).
- Monaco grammar registration is optional — consumers must provide a `registerGrammar`
  implementation (the web playground will do this soon for full highlighting).

Keep this document updated whenever the language engine gains new capabilities
or when additional adapters are introduced.
