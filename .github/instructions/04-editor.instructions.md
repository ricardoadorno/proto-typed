# Custom DSL Editor (Monaco)

Monaco-based editor integration lives in `src/core/editor/`.

## Key Files
- `index.ts` — editor bootstrap and exports
- `components/dsl-editor.tsx` — React component that renders the editor
- `hooks/use-monaco-dsl.ts` — setup lifecycle, disposables, side effects
- `language/dsl-language.ts` — DSL language configuration and tokens
- `theme/dsl-theme.ts` — dark theme tokens and colors (dark-only)
- `completion/dsl-completion.ts` — IntelliSense for DSL constructs
- `constants.ts` — shared language IDs, themes, and options

## Integration Notes
- Register language, theme, and completion providers on mount; dispose on unmount.
- Debounce content changes; send text to parser and update preview.
- Surface parse errors in-line and in the error panel components.
- Do not add `dark:` Tailwind prefixes; use dark tokens directly.
