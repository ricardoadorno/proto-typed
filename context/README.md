# Proto-Typed Context Documentation

This directory contains comprehensive documentation about the Proto-Typed project, designed to help LLMs and developers quickly understand the entire system.

## Documentation Index

### 1. [Overview](./overview.md)
**High-level introduction to Proto-Typed**
- What is Proto-Typed?
- Core concepts and capabilities
- Use cases and distribution
- What it is NOT

**Read this first** to understand the tool's purpose and scope.

---

### 2. [Architecture](./architecture.md)
**Detailed system architecture**
- Repository structure (monorepo)
- Core package architecture (lexer, parser, AST, renderer)
- Rendering architecture (3-tier layered design)
- Design patterns used throughout
- Data flow examples

**Read this** to understand how the system is organized and how data flows through the pipeline.

---

### 3. [Technologies](./technologies.md)
**Libraries and tools used**
- Core technologies (Chevrotain, TypeScript, nanoid)
- Web stack (Next.js, React, Monaco, Tailwind, Radix UI)
- VSCode extension stack
- Build tools (pnpm, Vitest, Playwright, ESLint, Prettier)
- Runtime dependencies
- OKLCH color technology

**Read this** to understand the technology choices and their rationale.

---

### 4. [Philosophy](./philosophy.md)
**Development philosophy and principles**
- Runtime validation over automated tests
- Simplicity over complexity
- Convention over configuration
- Mobile-first design
- Dark mode only
- Semantic styling
- No runtime framework dependencies
- Text-based workflow
- For prototyping, not production

**Read this** to understand the guiding principles behind design decisions.

---

### 5. [DSL Syntax](./dsl-syntax.md)
**Complete DSL syntax reference**
- Syntax fundamentals (indentation, blocks, nesting)
- Views (screen, modal, drawer, component)
- Layouts (canonical presets)
- Primitives (headings, text, images, links, buttons)
- Inputs (text, textarea, checkbox, radio, select)
- Component system (definition and instantiation)
- Head elements (title, favicon, meta, theme)
- Navigation targets (internal, external, actions, history)
- Complete examples

**Read this** to understand the DSL language and how to write Proto-Typed code.

---

### 6. [Rendering Pipeline](./rendering-pipeline.md)
**How DSL is transformed into HTML**
- Pipeline overview (text → tokens → CST → AST → HTML)
- Stage 1: Lexical analysis (Lexer)
- Stage 2: Syntax analysis (Parser)
- Stage 3: Semantic analysis (AST Builder)
- Stage 4: Code generation (Renderer)
- Complete end-to-end example
- Performance considerations
- Error handling

**Read this** to understand the compilation process and how each stage transforms the data.

---

### 7. [Styling System](./styling-system.md)
**How styling works in Proto-Typed**
- Two-layer approach (Tailwind + CSS variables)
- CSS variable system (semantic tokens)
- OKLCH color space (perceptual uniformity)
- Theme system (12 pre-defined themes)
- Custom theme overrides
- Styling patterns in renderers
- Critical styling rules (always/never)
- Dark mode only approach

**Read this** to understand the styling philosophy and how to work with colors and themes.

---

## Quick Reference

### For LLMs Working on Proto-Typed

**If you need to**:
- Understand what the project does → Read [Overview](./overview.md)
- Understand the codebase structure → Read [Architecture](./architecture.md)
- Add a new DSL element → Read [DSL Syntax](./dsl-syntax.md) and [Architecture](./architecture.md)
- Work with colors/styling → Read [Styling System](./styling-system.md)
- Debug the rendering pipeline → Read [Rendering Pipeline](./rendering-pipeline.md)
- Understand technology choices → Read [Technologies](./technologies.md)
- Make design decisions → Read [Philosophy](./philosophy.md)

### Key Files in the Codebase

Reference these files for implementation details:

- **Core Package**: `packages/core/src/`
  - Lexer: `lexer/lexer.ts`, `lexer/tokens/*.tokens.ts`
  - Parser: `parser/parser.ts`, `parser/rules/*.rules.ts`
  - AST Builder: `parser/builders/ast-builder.ts`, `parser/builders/*.builders.ts`
  - Renderer: `renderer/ast-to-html-*.ts`, `renderer/core/*.ts`, `renderer/nodes/*.node.ts`
  - Types: `types/ast-node.ts`

- **Web Package**: `packages/web/`
  - Main page: `app/page.tsx`
  - Components: `components/`

- **Extension Package**: `packages/extension/`
  - Extension entry: `src/extension.ts`
  - Webview: `src/webview/`

### Common Commands

```bash
# Development
pnpm dev                    # Start web app
pnpm compile:core           # Compile core package
pnpm compile:extension      # Compile VSCode extension

# Building
pnpm build                  # Build web app
pnpm compile                # Compile all

# Testing
pnpm test                   # Run tests
pnpm test:ui                # Run tests with UI
pnpm test:e2e               # Run E2E tests

# Code Quality
pnpm lint                   # Lint all packages
pnpm format                 # Format all files
pnpm typecheck              # Type-check all packages
```

---

## How This Documentation Was Created

This context documentation was generated to provide comprehensive understanding of the Proto-Typed project for:
- **LLMs**: Quick context loading for code assistance
- **New Contributors**: Onboarding and understanding the system
- **Documentation**: Reference material for the project

Each document focuses on a specific aspect of the system and can be read independently, though reading in order (1-7) provides the best learning experience.

---

## Maintenance

When updating the codebase, consider updating these documents if:
- Adding new DSL elements or syntax
- Changing the architecture or design patterns
- Adding new technologies or dependencies
- Modifying the styling system or themes
- Changing the rendering pipeline stages
- Updating the development philosophy

Keep these documents in sync with the code to ensure they remain accurate and useful.
