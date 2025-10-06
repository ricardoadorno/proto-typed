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

The app will open at `http://localhost:5173` with a split-pane interface:
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

proto-typed uses a **Lexer → Parser → AST → Renderer** pipeline:

1. **Lexer** tokenizes your DSL text (Chevrotain)
2. **Parser** builds an Abstract Syntax Tree (AST)
3. **Renderer** converts AST to HTML with Tailwind CSS + shadcn variables
4. **Preview** displays the result in a simulated device frame

Your DSL is transformed into semantic HTML with proper navigation, theming, and responsive layout - no build step, no framework lock-in.

## Technology Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Parsing**: Chevrotain (lexer & parser)
- **Editor**: Monaco Editor with custom DSL language
- **Styling**: Tailwind CSS + shadcn theming system
- **Output**: Standalone HTML with CDN dependencies

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

Size: `@` (large), `@@` (medium), `@@@` (small)  
Variants: `_` (ghost), `+` (outline), `-` (secondary), `=` (destructive), `!` (warning)

```dsl
@[Large Default](action)
@@+[Medium Outline](action)
@@@=[Small Delete](action)
@[With Icon]{icon-name}(action)
```

### Forms

```dsl
___:Email{Enter email}
___*:Password{Enter password}
___:Country{Select}[USA | Canada | Mexico]

[X] Checked checkbox
[ ] Unchecked checkbox
(X) Selected radio
( ) Unselected radio
```

### Layouts

All layouts support inline modifiers:

```dsl
row-w50-center-p4:
  @[Button 1]
  @[Button 2]

col-h100-start-m2:
  > Content in column

grid-cols3-gap4:
  card:
    # Item 1
  card:
    # Item 2
  card:
    # Item 3

container-wfull-center-p8:
  # Centered content
```

**Modifiers**: `w[num]`, `h[num]`, `wfull`, `hfull`, `center`, `start`, `end`, `p[num]`, `m[num]`, `gap[num]`, `cols[1-12]`

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
header-h100-center:
  # App Name
  @_[Menu](menu)

navigator:
  - [Home]{home}(Home)
  - [Profile]{user}(Profile)

fab{plus}(addItem)
```
## Complete Example

Here's a full app with navigation, components, modals, and lists:

```dsl
component Header:
  header-h100-center:
    # TaskApp
    @_[Menu](MainMenu)

modal ConfirmDelete:
  # Delete Task?
  > This action cannot be undone
  @=[Delete](delete)
  @-[Cancel](close)

drawer MainMenu:
  # Menu
  list:
    - [Dashboard](Dashboard)
    - [Tasks](Tasks)
    - [Settings](Settings)

screen Dashboard:
  $Header
  
  container-wfull-center-p8:
    card-p6:
      ## Welcome Back
      > You have 5 tasks pending
    
    row-between-center-m4:
      card-w50-p4:
        ### Active
        > 12 tasks
      card-w50-p4:
        ### Completed
        > 48 tasks

screen Tasks:
  $Header
  
  @[Add Task](AddTask)
  
  list:
    - Setup Project{Due: Today}@+[Edit](edit)@=[Delete](ConfirmDelete)
    - Review Code{Due: Tomorrow}@+[Edit](edit)@=[Delete](ConfirmDelete)
    - Deploy App{Due: Friday}@+[Edit](edit)@=[Delete](ConfirmDelete)
  
  navigator:
    - [Dashboard]{home}(Dashboard)
    - [Tasks]{check-square}(Tasks)
    - [Settings]{settings}(Settings)
```

## Architecture

```
src/
├── core/
│   ├── lexer/          # Tokenization (Chevrotain)
│   ├── parser/         # Grammar rules & AST building
│   ├── renderer/       # AST → HTML conversion
│   │   ├── core/       # node-renderer, route-manager, theme-manager
│   │   ├── infrastructure/  # Gateways, mediators, helpers
│   │   └── nodes/      # Element-specific renderers
│   ├── editor/         # Monaco editor integration
│   └── themes/         # shadcn-based theme system
├── components/         # React UI components
├── examples/          # DSL example code
├── types/             # TypeScript definitions
└── utils/             # Helper functions
```

### Rendering Pipeline

1. **Lexer** (`lexer/tokens/`) - Tokenize DSL text into structured tokens
2. **Parser** (`parser/`) - Build Abstract Syntax Tree (AST) from tokens
3. **Route Manager** - Process screens, modals, drawers, components
4. **Theme Manager** - Merge shadcn themes with user styles
5. **Node Renderer** - Convert AST nodes to HTML with navigation
6. **Output** - Standalone HTML or preview fragment

### Design Patterns

- **Strategy Pattern**: Node type → renderer function mapping
- **Facade Pattern**: RouteManagerGateway simplifies complex APIs
- **Mediator Pattern**: NavigationMediator decouples navigation logic
- **Singleton Pattern**: Global route and theme managers

## For Developers

### Project Philosophy

- **Runtime validation** over automated tests
- **Dark mode only** - no light theme support
- **shadcn theming** - CSS variables for all colors
- **No hardcoded colors** - always use semantic tokens
- **Type-safe** - Full TypeScript coverage

### Adding New DSL Elements

1. **Token** (`lexer/tokens/*.tokens.ts`) - Define regex pattern
2. **Parser** (`parser/parser.ts`) - Add grammar rule
3. **Builder** (`parser/builders/*.builders.ts`) - CST → AST conversion
4. **Renderer** (`renderer/nodes/*.node.ts`) - AST → HTML rendering
5. **Types** (`types/ast-node.ts`) - Add to NodeType union

**Example**: Adding a badge element

```typescript
// 1. Token (lexer/tokens/primitives.tokens.ts)
export const Badge = createToken({
  name: "Badge",
  pattern: /badge\[([^\]]+)\]/
});

// 2. Builder (parser/builders/primitives.builders.ts)
export function buildBadgeElement(ctx: Context) {
  const match = ctx.Badge[0].image.match(/badge\[([^\]]+)\]/);
  return {
    type: "Badge",
    props: { text: match?.[1] || '' },
    children: []
  };
}

// 3. Renderer (renderer/nodes/primitives.node.ts)
export function renderBadge(node: AstNode): string {
  const { text } = node.props as any;
  return `<span class="badge" style="background-color: var(--primary);">${text}</span>`;
}

// 4. Add to RENDERERS map (renderer/core/node-renderer.ts)
const RENDERERS: Record<NodeType, typeof _render> = {
  // ... existing renderers
  Badge: (n) => renderBadge(n),
}
```

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

See `.github/copilot-instructions.md` for comprehensive development guidelines.

## License

Licensed under the Apache License 2.0. See [LICENSE](LICENSE) for details.

```
Copyright 2025 Ricardo Adorno

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```

## Acknowledgments

- **shadcn/ui** - Theming system inspiration
- **Chevrotain** - Parsing library
- **Monaco Editor** - Code editor component
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide Icons** - Icon system