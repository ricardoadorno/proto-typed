# Proto‑Typed — Overview

This project is a React-based UI prototyping tool powered by a custom Domain Specific Language (DSL). It ships a full pipeline: lexer → parser → AST builder → renderer, plus a Monaco-powered editor and live preview.

## Technology Stack
- Frontend: React 19, TypeScript, Vite
- Parsing: Chevrotain (lexer + parser)
- Editor: Monaco Editor with custom language, theme, and completion
- Styling: Tailwind (dark mode only)

## Top-Level Structure
- `src/core/lexer/` — Tokenization and lexical analysis
- `src/core/parser/` — Grammar rules, CST → AST pipeline
- `src/core/renderer/` — AST → HTML rendering and navigation
- `src/core/editor/` — Monaco DSL integration (language, theme, completion)
- `src/docs/` — Static documentation (MDX) and table of contents
- `src/components/` — App UI components
- `src/examples/` — Example DSL snippets
- `src/types/` — Shared TypeScript types (incl. render types)
- `src/utils/` — Utilities (icons, exporting, errors)

## Key Concepts
- DSL-first authoring: concise syntax for screens, layout, interactions
- Named elements (modal, drawer) with toggled visibility
- Live preview: debounced parsing and error surfacing
- Extensibility: add new DSL elements via tokens → parser → AST → renderer

## Reading Order (Recommended)
1) 02-DSL Syntax → 2) 03-Lexer/Parser/AST → 3) 04-Editor → 4) 05-Renderer → 5) 06-Components Organization → 6) 07-Coding Guidelines → 7) 08-Common Patterns → 8) 09-Docs
