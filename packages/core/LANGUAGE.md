# Proto-Typed Language Reference

**Version 0.0.2**

Proto-Typed (`.pty`) is a declarative UI markup language that compiles to React components with TypeScript and Tailwind CSS. This reference describes the complete syntax and semantics of the language.

---

## Table of Contents

1. [Configuration](#configuration)
2. [Views](#views)
3. [Components](#components)
4. [Layouts](#layouts)
5. [Primitives](#primitives)
6. [Inputs](#inputs)
7. [Typography](#typography)
8. [Special Elements](#special-elements)

---

## Configuration

### Meta Configuration

Define application metadata at the top of your `.pty` file.

```pty
meta:
  version: 0.0.1
  title: My Application
```

**Properties:**
- `version` - Semantic version number (e.g., `0.0.1`, `1.2.3`)
- `title` - Application title string

---

### Head Configuration

Define theme and styling configuration.

```pty
head:
  color:
    primary: #3b82f6
    secondary: #64748b
    neutral: #f1f5f9
    accent: #f59e0b
  font:
    base: 16
    family: Inter
  template: $DefaultLayout
```

**Sections:**

#### `color:`
Define color palette for the application.
- `primary` - Main brand color (hex value)
- `secondary` - Secondary brand color (hex value)
- `neutral` - Neutral/background color (hex value)
- `accent` - Accent/highlight color (hex value)

#### `font:`
Define typography settings.
- `base` - Base font size in pixels (number)
- `family` - Font family name (string)

#### `template:`
Set default template component for screens.
- Value: Component instance reference (e.g., `$DefaultLayout`)

---

## Views

Views are top-level containers that represent screens, modals, or drawers.

### Screen

Full-screen page container.

```pty
screen Dashboard:
  container:
    # Welcome to Dashboard
    > This is the main screen
```

**Syntax:** `screen <Name>:`

---

### Modal

Overlay dialog that appears on top of content.

```pty
modal ConfirmDialog:
  card:
    # Are you sure?
    > This action cannot be undone
    row:
      @primary[Confirm](confirm)
      @outline[Cancel](cancel)
```

**Syntax:** `modal <Name>:`

---

### Drawer

Side panel overlay (typically for navigation).

```pty
drawer MainMenu:
  stack:
    # Menu
    navigator:
      - Home | HomeScreen
      - Settings | SettingsScreen
```

**Syntax:** `drawer <Name>:`

---

## Components

Reusable component definitions with props.

```pty
component UserCard:
  card:
    # %name
    >> %role
    > Email: %email
```

**Syntax:** `component <Name>:`

### Component Instances

Reference a component with `$ComponentName`:

```pty
screen Users:
  stack:
    $UserCard
    $UserCard
```

**Syntax:** `$<ComponentName>`

---

### Component Props

Reference component properties with `%propName`:

```pty
component ProfileCard:
  card:
    # %name
    > %description
```

**Syntax:** `%<propName>`

---

## Layouts

Layout containers control arrangement and spacing of child elements.

### Containers

Horizontal centering with max-width constraints.

```pty
container:         # Standard container (max-w-5xl)
container-narrow:  # Narrow container (max-w-3xl)
container-wide:    # Wide container (max-w-7xl)
container-full:    # Full-width container
```

---

### Stack (Vertical)

Vertical arrangement of elements.

```pty
stack:        # Standard vertical spacing (gap-4)
stack-tight:  # Tight spacing (gap-2)
stack-loose:  # Loose spacing (gap-8)
stack-none:   # No spacing (gap-0)
```

---

### Row (Horizontal)

Horizontal arrangement of elements.

```pty
row:         # Standard horizontal with start alignment
row-start:   # Align items to start
row-center:  # Center items
row-between: # Space between items
row-end:     # Align items to end
```

---

### Grid

Grid layout system.

```pty
grid:            # Auto grid
grid-2:          # 2 columns
grid-3:          # 3 columns
grid-4:          # 4 columns
grid-responsive: # Responsive auto-fill grid
```

---

### Layer (Positioning)

Control element positioning.

```pty
layer-static:   # Static positioning (default)
layer-relative: # Relative positioning
layer-absolute: # Absolute positioning
layer-fixed:    # Fixed positioning
layer-sticky:   # Sticky positioning
layer-overlay:  # Fixed overlay with backdrop
```

---

### Scroll (Overflow)

Control overflow behavior.

```pty
scroll-auto:   # Auto overflow
scroll-x:      # Horizontal scroll only
scroll-y:      # Vertical scroll only
scroll-hidden: # Hidden overflow
```

---

### Cards

Elevated content containers.

```pty
card:         # Standard card with padding
card-compact: # Card with small padding
card-feature: # Featured card with special styling
```

---

### Special Layouts

```pty
header:    # Mobile-optimized header
sidebar:   # Sidebar panel
list:      # Vertical list container
navigator: # Bottom navigation bar
```

---

## Primitives

### Buttons

Interactive button elements with variants.

```pty
@[Button Text](action)                    # Default button
@primary[Primary](action)                 # Primary variant
@secondary[Secondary](action)             # Secondary variant
@ghost[Ghost](action)                     # Ghost variant
@outline[Outline](action)                 # Outline variant
@destructive[Delete](action)              # Destructive variant
@success[Save](action)                    # Success variant
@warning[Warning](action)                 # Warning variant
```

**With Icon:**
```pty
@[Save]{save}(action)                     # Button with Lucide icon
```

**Size Modifiers:**
```pty
@primary-small[Small](action)             # Small button
@primary-icon[](action)                   # Icon-only button
@primary-large[Large](action)             # Large button
```

**Syntax:** `@[variant][-size][Label]{icon?}(action)`

---

### Images

Image elements with variants.

```pty
![Alt Text](url)                          # Standard image
!rounded[Alt Text](url)                   # Rounded corners
!circle-64x64[Avatar](url)                # Circular avatar (specify dimensions)
```

**Syntax:** `![variant?][alt](url)`

---

## Inputs

Form input elements.

### Text Input

```pty
___[Label][Placeholder]                   # Standard text input
___password[Password][Enter password]     # Password input
___email[Email][user@example.com]         # Email input
```

**Syntax:** `___[type?][Label][Placeholder]`

---

### Select Dropdown

```pty
___[Country][Select country[USA | Canada | Mexico]]
```

**Syntax:** `___[Label][Placeholder[Option1 | Option2 | ...]]`

---

### Checkbox

```pty
[X] Checked item
[ ] Unchecked item
```

**Syntax:** `[X]` or `[ ]` followed by label

---

### Radio Option

```pty
(X) Selected option
( ) Unselected option
```

**Syntax:** `(X)` or `( )` followed by label

---

## Typography

### Headings

```pty
# Heading 1
## Heading 2
### Heading 3
#### Heading 4
```

**Syntax:** `#` (1-4 times) followed by space and text

---

### Text Variants

```pty
> Paragraph text          # Standard body text
>> Small text             # Smaller secondary text
>>> Muted text            # Low-emphasis muted text
```

**Syntax:** `>` (1-3 times) followed by space and text

---

### Special Text Blocks

```pty
*> Blockquote             # Quoted content with left border
**> Note                  # Callout note with raised surface
```

**Syntax:** `*>` or `**>` followed by space and text

---

## Special Elements

### List Items

```pty
list:
  - Item 1
  - Item 2
  - Item 3
```

**Syntax:** `-` followed by space and text (within `list:` container)

---

### Navigator (Bottom Nav)

```pty
navigator:
  - Home | HomeScreen
  - Profile | ProfileScreen
  - Settings | SettingsScreen
```

**Syntax:** `- Label | ScreenName`

---

### FAB (Floating Action Button)

```pty
fab{plus}(action)         # FAB with Lucide icon
```

**Syntax:** `fab{icon}(action)`

---

### Separator

```pty
---                       # Horizontal line separator
```

**Syntax:** `---`

---

### Links

```pty
> [Link Text](destination)
```

**Syntax:** `[text](destination)` within paragraph

---

## Indentation & Nesting

Proto-Typed uses **tab-based indentation** for nesting:

```pty
screen Main:
  container:
    stack:
      # Welcome
      > Content here
```

- Each level of nesting requires one tab character
- Spaces are not valid for indentation
- Child elements must be indented one level deeper than parent

---

## Comments

Proto-Typed currently does not support inline comments. Use `#` for headings only.

---

## Actions & Events

Actions are specified in parentheses for interactive elements:

```pty
@[Click Me](handleClick)
fab{plus}(addItem)
```

The action name should correspond to a handler function in your application logic.

---

## Best Practices

1. **Start with configuration** - Define `meta:` and `head:` at the top
2. **Use semantic names** - Name screens, components clearly (e.g., `UserProfile`, not `Screen1`)
3. **Compose components** - Break complex UIs into reusable components
4. **Consistent indentation** - Always use tabs, never spaces
5. **Descriptive actions** - Use clear action names (e.g., `submitForm`, not `action1`)

---

## File Extension

Proto-Typed files use the `.pty` extension.

```
src/
  app.pty
  components/
    user-card.pty
  screens/
    dashboard.pty
```

---

## Language Server Features

The Proto-Typed language server provides:

- **Autocomplete** - Context-aware suggestions for all language constructs
- **Syntax Highlighting** - Semantic token-based highlighting
- **Diagnostics** - Real-time error checking and warnings
- **Hover Info** - Documentation on hover
- **Code Actions** - Quick fixes and refactorings

---

## Token Reference

### Keywords
`screen`, `modal`, `drawer`, `component`, `meta`, `head`

### Layout Types
`container`, `stack`, `row`, `grid`, `card`, `layer`, `scroll`, `header`, `sidebar`, `list`, `navigator`, `fab`

### Primitives
`@` (buttons), `!` (images), `___` (inputs), `#` (headings), `>` (paragraphs)

### Special Characters
- `$` - Component instance
- `%` - Component prop
- `@` - Button
- `#` - Heading or color value
- `>` - Paragraph/text
- `_` - Input (triple underscore)
- `-` - List item or separator (triple dash)
- `!` - Image
- `[` `]` - Labels, brackets
- `(` `)` - Actions, radio options
- `{` `}` - Icons
- `|` - Separator (navigator, select options)
- `:` - Property assignment

---

## Version History

- **0.0.2** - Current version with full language specification
- **0.0.1** - Initial prototype

---

For more information, examples, and tutorials, visit the Proto-Typed documentation site.
