# Documentation System (`src/docs`)

## Structure
- `toc.ts` — table of contents used by the docs UI.
- `sections/*.mdx` — topic pages (syntax, components, forms, layout, lists, mobile, etc.).

## Authoring
- Write MDX; prefer concise examples that mirror the DSL.
- Keep dark mode visuals consistent with app styling.
- Cross-link related topics (e.g., lists ↔ buttons ↔ navigation).

## Updating Docs
- When adding DSL features, update both syntax references and examples.
- Surface known issues and troubleshooting steps.
