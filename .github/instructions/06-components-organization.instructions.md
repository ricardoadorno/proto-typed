# Components Organization

This taxonomy standardizes how we talk about UI building blocks and maps them to DSL constructs.

## Primitives
- Typography — `#`..`######`, `>`, `*>`, `">`
- Button — `@[Label](action)` with variant suffixes (`@_`, `@+`, `@-`, `@=`, `@!`)
- Link — `#[Label](action)`
- Images — `![Alt](url)`
- Icons — via `{icon}` placeholders where supported (e.g., `fab {icon}`)

## Form
- Text — `___:Label{Placeholder}`
- Select — `___:Label{Placeholder}[One | Two]`
- Radio — `(X) Label` / `( ) Label`
- Checkbox — `[X] Label` / `[ ] Label`

## Layout Primitives
- Container — `container:`
- Row — `row:`
- Column — `col:`
- Flow — sequences of blocks; use container/row/col for grouping
- Grid — `grid:`

## Content Structures
- List — `list:` with advanced item syntax
- Table — not yet a first-class DSL node (compose via grid/rows)
- Cards — `card:`
- Accordion — not yet a first-class DSL node (compose via list + toggles)
- Carousel — not yet a first-class DSL node (compose via grid + navigation)

## Navigation & Overlays
- Screens — `screen Name:`
- App Bar — model using components + layout primitives
- Drawer — `drawer Name:` (named element; hidden by default)
- Bottom Navigation — model using layout primitives or custom components
 - Modal — `modal Name:` (named element; hidden by default)
 - Floating Action Button — `fab {icon}`

## Notes
- Named elements (modals, drawers) are activated by referencing their names in actions.
- Keep primitives small and composable; prefer composition for not-yet-native patterns.
