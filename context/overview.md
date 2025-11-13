# Proto-Typed: Overview

## What is Proto-Typed?

Proto-Typed is a Domain-Specific Language (DSL) for rapid UI prototyping that transforms simple text descriptions into interactive HTML prototypes. It's designed to bridge the gap between wireframes and functional prototypes, enabling designers and developers to quickly iterate on UI ideas without writing HTML, CSS, or JavaScript.

## Core Concept

The fundamental idea behind Proto-Typed is **text-driven UI creation**. Instead of writing verbose HTML markup or using visual drag-and-drop builders, you write concise, indentation-based DSL syntax that describes your UI structure.

### Example

```
screen Home:
  header:
    ## Welcome to Proto-Typed

  container:
    > This is a simple prototype
    @[Go to Settings](Settings)
```

This generates a fully interactive HTML page with navigation, styling, and mobile-first responsive design.

## Key Capabilities

### 1. Multi-View Applications
- **Screens**: Full-page views with client-side routing
- **Modals**: Overlay dialogs that can be toggled
- **Drawers**: Side panels (typically mobile bottom sheets)
- **Components**: Reusable UI blocks with props

### 2. Rich UI Elements
- **Layouts**: Containers, stacks, rows, grids, cards
- **Primitives**: Headings, text, images, links, buttons
- **Inputs**: Text fields, checkboxes, radios, selects, textareas
- **Navigation**: Internal routing, external links, history navigation

### 3. Interactive Navigation
All navigation is handled client-side with JavaScript:
- Screen transitions with history management
- Modal and drawer toggling
- Back/forward browser navigation
- External link support

### 4. Theming & Styling
- Built on shadcn/ui design system principles
- CSS variable-based theming
- 12 pre-defined color themes (neutral, slate, blue, red, etc.)
- Dark mode only (optimized for modern interfaces)
- Custom property overrides via `styles:` block

### 5. Component System with Props
Define reusable components with interpolated props:

```
component UserCard:
  card:
    ## %name
    > Role: %role

screen Team:
  list $UserCard:
    - Alice | Designer
    - Bob | Developer
```

Props are pipe-separated in list items and interpolated with `%propName` syntax.

## Output Formats

### 1. Preview Mode
Generates an HTML fragment suitable for embedding in a Single Page Application (SPA). Used by:
- **Web playground**: Live preview with Monaco editor
- **VSCode extension**: Webview preview panel

### 2. Export Mode
Generates a standalone HTML document with:
- Complete `<head>` section with meta tags
- Tailwind CSS via CDN
- Embedded navigation JavaScript
- All routes rendered as hidden `<div>` elements
- Theme CSS variables injected

## Use Cases

### For Designers
- Rapidly prototype user flows without coding
- Test navigation patterns and information architecture
- Share interactive prototypes with stakeholders
- Export to HTML for handoff

### For Developers
- Quickly mock up UI before implementation
- Create throwaway prototypes for user testing
- Document component structure
- Generate HTML boilerplate

### For Product Teams
- Validate ideas before investing in development
- Create clickable prototypes for user research
- Communicate design intent clearly
- Iterate faster on UI concepts

## Distribution

Proto-Typed is available in three packages:

1. **@proto-typed/core**: NPM package with the DSL engine (lexer, parser, renderer)
2. **Web playground**: Online editor at https://ricardoadorno.github.io/proto-typed/
3. **VSCode extension**: `.pty` file support with syntax highlighting and live preview

## Philosophy

Proto-Typed embraces:
- **Simplicity over complexity**: Minimal syntax, maximum expressiveness
- **Convention over configuration**: Sensible defaults, canonical presets
- **Runtime validation over tests**: Manual testing in the browser
- **Mobile-first design**: Native mobile UI patterns (navigator, drawers)
- **Semantic styling**: CSS variables, not hardcoded colors
- **Text-based workflow**: Fast iteration, version control friendly

## What It's NOT

- **Not a production framework**: For prototyping only, not production apps
- **Not a design tool**: No visual editor, text-based only
- **Not a static site generator**: Generates client-side navigated SPAs
- **Not extensible**: Fixed grammar, no plugins or custom elements (by design)

## Architecture Summary

```
DSL Text → Lexer → Tokens → Parser → CST → AST Builder → AST → Renderer → HTML
```

The system uses **Chevrotain** for parsing, implementing a clean separation between:
- **Lexical analysis**: Token definitions
- **Syntax analysis**: Grammar rules and CST
- **Semantic analysis**: AST construction
- **Code generation**: HTML rendering

For detailed architecture, see `architecture.md`.
