# DSL Syntax

The DSL provides concise primitives for building interactive UI prototypes.

## General Rules
- Optional elements: suffix `?` (e.g., `@[Button]?(action)`).
- Containers: `:` followed by indented children.
- Text prefixes: `>` for text, `#`..`######` for headings, `*>` for notes, `">` for quotes.
- Interactive: `@[text]()`, `#[text]()`, `![alt](url)`, `$ComponentName`.

## Screen & Components
```
screen ScreenName:
  # Title
  > Content

component ComponentName:
  > Reusable content
  @[Do](action)

$ComponentName
```

## Named Elements
```
modal ModalName:
  > Modal content

drawer DrawerName:
  > Drawer content
```

- Activate via navigation actions (e.g., button actions targeting the element name).
- Hidden by default unless activated.

## Forms
- Text: `___:Label{Placeholder}`
- Password: `___*:Label{Placeholder}`
- Disabled: `___-:Label{Placeholder}`
- Select: `___:Label{Placeholder}[Option1 | Option2]`
- Checkboxes: `[X] Label`, `[ ] Label`
- Radios: `(X) Label`, `( ) Label`

## Layout
- `container:`, `grid:`, `card:`, `row:`, `col:`

## Lists (Advanced)
```
list:
  - [link](dest)title{subtitle}[Button](action)@_[Ghost](ghost)@=[Danger](danger)
  - Simple text item
```
Components (optional except dash):
- `[link_text](link)` — optional link
- free text — title/body
- `{subtitle}` — subtitle
- `[button](action)` — action buttons; variants with `@_`, `@+`, `@-`, `@=`, `@!`

## Navigation & Overlays (DSL)
- Screens: `screen Name:`
- App bar: model via layout or component blocks
- Drawer: `drawer Name:`
- Modal: `modal Name:`
- Floating Action Button: `fab {icon}` (when used)
