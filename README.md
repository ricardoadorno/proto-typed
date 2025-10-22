# proto-typed

**A lightweight DSL for rapid UI prototyping** - Write text, see UI instantly.

proto-typed is a browser-based tool that lets you create interactive UI prototypes using a simple, readable Domain Specific Language (DSL). No framework knowledge required - just type natural-looking syntax and watch your interface come to life in real-time.

## What is proto-typed?

proto-typed bridges the gap between wireframes and functional prototypes. Instead of dragging components or writing framework code, you describe your UI in plain text using an intuitive syntax. The tool handles the parsing, rendering, and interaction automatically.

**Perfect for**:
- **Designers** sketching interaction flows without code
- **Product Managers** creating clickable mockups for stakeholder reviews
- **Developers** rapidly prototyping UI ideas before implementation
- **Teams** collaborating on interface concepts with a shared, readable format

## Key Features

- 🚀 **Real-time Preview**: See your prototype update as you type
- 📱 **Mobile-First**: Built-in support for headers, navigators, modals, and drawers
- 🎨 **Theme System**: shadcn-inspired theming with CSS custom properties
- 🧩 **Component System**: Create reusable UI blocks with prop interpolation
- 🔗 **Navigation**: Screen transitions, modal/drawer toggles, back navigation
- 📝 **Monaco Editor**: Syntax highlighting, IntelliSense, and error detection
- 📤 **Export**: Download standalone HTML prototypes
- 🎯 **Zero Dependencies**: Prototypes use only Tailwind CDN + Lucide icons

## Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/ricardoadorno/proto-typed.git
cd proto-typed

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will open at `http://localhost:3000` with a split-pane interface:
- **Left**: Monaco editor with DSL syntax
- **Right**: Live prototype preview with device selector

### Your First Prototype

```dsl
screen Welcome:
  # Hello World
  > This is your first prototype
  @[Get Started](NextScreen)

screen NextScreen:
  # Success!
  > You just navigated between screens
  @[Go Back](-1)
```

**That's it!** You now have a working two-screen prototype with navigation.

## How It Works

proto-typed uses a **Lexer → Parser → AST → Renderer** pipeline to transform your DSL text into an interactive HTML prototype:

1.  **Lexer**: The input text is broken down into a sequence of tokens. This is handled by a custom lexer built with **Chevrotain**, which recognizes the fundamental parts of the DSL like keywords, symbols, and identifiers. It also has special logic to handle indentation.

2.  **Parser**: The stream of tokens is fed into a parser, also built with **Chevrotain**. The parser understands the grammatical rules of the DSL and organizes the tokens into a hierarchical structure called a Concrete Syntax Tree (CST).

3.  **AST Builder**: The CST is then traversed by an **AST Builder**, which is a CST visitor. This process transforms the CST into an Abstract Syntax Tree (AST), which is a more simplified and abstract representation of the UI structure, making it easier to work with.

4.  **Renderer**: Finally, the AST is passed to a **Renderer**. The renderer walks through the AST and generates a complete, self-contained HTML document. This document includes all the necessary HTML, CSS (via Tailwind CSS and custom properties), and JavaScript to create a fully interactive prototype.

## Technology Stack

- **Frontend**: Next.js (React) + TypeScript
- **Parsing**: Chevrotain (lexer & parser)
- **Editor**: Monaco Editor with custom DSL language support
- **Styling**: Tailwind CSS + shadcn theming system
- **Output**: Standalone HTML with CDN dependencies for Tailwind and Lucide icons

## DSL Syntax Overview

The DSL uses intuitive, readable syntax inspired by Markdown and common UI patterns.

### Screens & Views

```dsl
screen Home:
  # Welcome
  > Main content here

modal Dialog:
  # Confirmation
  @[OK](close)

drawer Menu:
  # Navigation
  - [Home](Home)
  - [Settings](Settings)
```

### Typography

```dsl
# to ###### → Headings (H1-H6)
>           → Paragraph text
>>          → Text (no bottom margin)
>>>         → Muted text
*>          → Note text
">          → Quote text
```

### Buttons

Pattern: `@<variant>?-<size>?\[text\]\(action\)`

**Variants** (optional, defaults to primary):
- `@primary`, `@secondary`, `@outline`, `@ghost`, `@destructive`, `@link`, `@success`, `@warning`

**Sizes** (optional, defaults to md):
- `-xs`, `-sm`, `-md`, `-lg`

```dsl
@[Large Default](action)
@secondary-lg[Medium Outline](action)
@outline-sm[Small Cancel](action)
@destructive[Delete](delete)
```

### Forms

Pattern: `___<type>?: Label{placeholder}[options] | attributes`

**Input Types**: `email`, `password`, `date`, `number`, `textarea`

```dsl
___: Email{Enter email}
___email: Email{Enter email}
___password: Password{Enter password}
___: Country{Select}[USA | Canada | Mexico]

[X] Checked checkbox
[ ] Unchecked checkbox
(X) Selected radio
( ) Unselected radio
```

### Layouts

Canonical preset layouts with predefined Tailwind classes and shadcn styling:

```dsl
container:          → Standard container
container-narrow:   → Narrow container
stack:              → Vertical stack (gap-4)
stack-tight:        → Tight vertical stack (gap-2)
row-center:         → Centered horizontal row
row-between:        → Row with space-between
grid-2:             → 2-column grid
grid-3:             → 3-column grid
card:               → Standard card
card-compact:       → Compact card
header:             → Page header
sidebar:            → Sidebar layout
list:               → List container
navigator:          → Bottom navigation
fab:                → Floating action button
---                 → Separator
```

### Components with Props

```dsl
component UserCard:
  card:
    # %name
    > Email: %email
    > Phone: %phone

screen Users:
  list $UserCard:
    - John | john@email.com | 555-1234
    - Jane | jane@email.com | 555-5678
```

Props are pipe-separated (`|`) and interpolated with `%propName`.

### Navigation

```dsl
@[Go to Screen](ScreenName)    → Navigate to screen
@[Open Modal](ModalName)       → Toggle modal
@[Open Drawer](DrawerName)     → Toggle drawer
@[Go Back](-1)                 → History back
#[External Link](https://...)  → External URL
```

### Mobile Components

```dsl
header:
  # App Name
  @ghost[Menu](menu)

navigator:
  - Home | Home
  - Profile | Profile

fab:
  - + | addItem
```
## Complete Example

Here's a full app with navigation, components, modals, and lists:

```dsl
component Header:
  header:
    # TaskApp
    @ghost[Menu](MainMenu)

modal ConfirmDelete:
  # Delete Task?
  > This action cannot be undone
  @destructive[Delete](delete)
  @secondary[Cancel](close)

drawer MainMenu:
  # Menu
  list:
    - Dashboard | Dashboard
    - Tasks | Tasks
    - Settings | Settings

screen Dashboard:
  $Header
  
  container:
    card:
      ## Welcome Back
      > You have 5 tasks pending
    
    row-between:
      card:
        ### Active
        > 12 tasks
      card:
        ### Completed
        > 48 tasks

screen Tasks:
  $Header
  
  @[Add Task](AddTask)
  
  list:
    - Setup Project | Due: Today | @outline[Edit](edit) | @destructive[Delete](ConfirmDelete)
    - Review Code | Due: Tomorrow | @outline[Edit](edit) | @destructive[Delete](ConfirmDelete)
    - Deploy App | Due: Friday | @outline[Edit](edit) | @destructive[Delete](ConfirmDelete)
  
  navigator:
    - Dashboard | Dashboard
    - Tasks | Tasks
    - Settings | Settings
```

## Architecture

```
src/
├── app/              # Next.js app directory
├── components/       # React UI components for the editor
├── core/
│   ├── lexer/        # Tokenization logic (Chevrotain)
│   ├── parser/       # Grammar rules & AST building
│   ├── renderer/     # AST to HTML conversion
│   └── error-bus.ts  # Singleton for error handling
├── docs/             # MDX documentation files
├── examples/         # Example DSL files
├── hooks/            # Custom React hooks (e.g., useParse)
├── lib/              # Utility functions
├── types/            # TypeScript type definitions
└── utils/            # General helper functions
```

## For Developers

### Project Philosophy

- **Runtime validation** over automated tests
- **Dark mode only** - no light theme support
- **shadcn theming** - CSS variables for all colors
- **No hardcoded colors** - always use semantic tokens
- **Type-safe** - Full TypeScript coverage

### Adding New DSL Elements

1.  **Token**: Define the token in `src/core/lexer/tokens/`.
2.  **Parser Rule**: Add the grammar rule in `src/core/parser/parser.ts`.
3.  **AST Builder**: Implement the logic to build the AST node in `src/core/parser/builders/`.
4.  **Renderer**: Write the function to render the AST node to HTML in `src/core/renderer/nodes/`.
5.  **Type Definition**: Add the new node type to the `AstNode` type in `src/types/ast-node.ts`.


### Code Style

**Tailwind CSS**:
- ✅ Base classes only: `flex items-center px-4 py-2`
- ❌ No hardcoded colors: `bg-blue-500 text-white`
- ❌ No dark mode prefixes: `dark:bg-gray-900`

**CSS Variables** (shadcn):
- ✅ Semantic tokens: `var(--primary)`, `var(--muted-foreground)`
- ✅ UI elements: `var(--border)`, `var(--input)`, `var(--ring)`
- ❌ Color names: `var(--blue-500)`, `var(--gray-800)`

### Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-element`
3. Make changes following the code style
4. Test in the running app (no automated tests)
5. Submit a pull request

## License

Licensed under the Apache License 2.0. See LICENSE for details.

## Acknowledgments

- **shadcn/ui** - Theming system inspiration
- **Chevrotain** - Parsing library
- **Monaco Editor** - Code editor component
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide Icons** - Icon system
