# @proto-typed/core

Core features of the Proto-Typed DSL.

## Features

### Lexer

Tokenization of Proto-Typed DSL code.

### Parser

AST generation from tokens using Chevrotain.

### Builder

Transforms AST to React/React Native code.

### Formatter

Code formatting and pretty-printing.

### Linter

Static analysis with configurable rules.

### Diagnostics (Phases 1-4)

LSP-compliant diagnostic system with:

- **Phase 1**: Error registry and LSP types
- **Phase 2**: Document-scoped storage
- **Phase 3**: Configurable lint rules
- **Phase 4**: Code actions and quick fixes

## Installation

```bash
pnpm add @proto-typed/core
```

## Usage

```typescript
import { lexer, parser, builder, formatter, linter } from '@proto-typed/core'

// Lex and parse
const tokens = lexer.tokenize(code)
const ast = parser.parse(tokens)

// Build React code
const reactCode = builder.build(ast)

// Format code
const formatted = formatter.format(code)

// Lint code
const diagnostics = linter.lint(ast, config)
```

## Development

```bash
# Build
pnpm build

# Test
pnpm test

# Clean
pnpm clean
```

## Documentation

- [DIAGNOSTICS_EVOLUTION.md](./DIAGNOSTICS_EVOLUTION.md) - Diagnostic system architecture
- [FORMATTER_LINTER_DOCS.md](./FORMATTER_LINTER_DOCS.md) - Formatter and linter documentation
