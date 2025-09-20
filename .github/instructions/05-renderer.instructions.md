# Renderer Pipeline

Transforms AST to HTML and manages navigation state.

## Types (`src/types/render.ts`)
- `RenderOptions`: e.g., `currentScreen?: string | null`.
- `ProcessedAstData`: partitioned AST: `screens`, `components`, `globalModals`, `globalDrawers`.
- `ScreenRenderConfig`: `{ screen, index, currentScreen? }`.
- `NodeRenderer`: `(node: AstNode, context?: string) => string`.
- `NavigationType`: `'internal' | 'external' | 'toggle' | 'back' | 'action'`.
- `ElementState`: visibility state for modals/drawers.
- `RenderContext`: `{ currentScreen?, elementStates, navigationHistory }`.

## Files
- `src/core/renderer/node-renderer.ts` — per-node HTML generation with attributes.
- `src/core/renderer/ast-to-html/` — main rendering glue and screen management.
- `src/core/renderer/navigation-service/` — internal navigation helpers.

## Behaviors
- Named elements are hidden unless activated; renderer toggles visibility.
- Internal navigation updates `currentScreen` and maintains history.
- Support variable substitution in the rendered output.
- Use semantic HTML and proper attributes.
