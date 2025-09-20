# Lexer, Parser, and AST

This section documents the Chevrotain-based lexer and parser, and the AST builder.

## Lexer (`src/core/lexer/`)
- All tokens are defined in `tokens.ts` using Chevrotain `createToken`.
- Do not introduce a `StringLiteral` token — this DSL does not use it.
- Respect token precedence via `allTokens` order.
- Handle indentation via custom `Indent`/`Outdent` matchers in `lexer.ts`.
- Support `{key: value}` attributes and `$variable` recognition.
- Use precise regexes with optional groups for DSL flexibility.

## Parser (`src/core/parser/parser.ts`)
- Implement grammar rules per UI element as Chevrotain `CstParser` rules.
- Include attribute handling and optional modifiers.
- Manage indentation with `Indent`/`Outdent` tokens for nested blocks.
- Build a clean CST with distinct nodes for screens, components, lists, forms, etc.

## AST Builder (`src/core/parser/astBuilder.ts`)
- Convert CST → AST with discriminated unions (`type` field required).
- Store core properties under `props`; nested content under `elements`.
- Extract data via regex groups with safe fallbacks for optional parts.
- Implement variable substitution where applicable.
- Keep AST shallow and consistent for efficient rendering.

## Parse and Build (`src/core/parser/parse-and-build-ast.ts`)
- Orchestrates tokenization → parsing → AST conversion.
- Reset parser state per input; handle partial inputs gracefully.
- Return errors with line/column and helpful messages.
