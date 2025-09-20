# Common Patterns

## Adding a New DSL Element
1. Define token in `src/core/lexer/tokens.ts` (consider precedence).
2. Update `src/core/lexer/lexer.ts` if indentation or custom match needed.
3. Add parser rule in `src/core/parser/parser.ts` with attributes and optional modifiers.
4. Convert CST → AST in `src/core/parser/astBuilder.ts` with discriminated union and props/elements.
5. Render in `src/core/renderer/node-renderer.ts` and integrate with `ast-to-html`.
6. Update examples/docs (`src/examples`, `src/docs`).

## Token Pattern Guidelines
- Use capturing groups for extracting content.
- Support optional whitespace and newlines consistently.
- Support `{key: value}` attributes; consider nested values.
- Maintain order in `allTokens` to ensure precedence.

## AST Node Structure
- `type` (discriminator), `props` (core properties), `elements` (children).
- Provide safe fallbacks for optional parts.
- Support variable substitution.
