# proto-typed

**DSL for rapid interface prototyping** — Describe in text, visualize instantly.

proto-typed transforms textual descriptions into navigable prototypes. No dragging blocks, no frameworks: you write what the interface _is_ (screens, lists, buttons), and the system takes care of the rest.

🚀 **[Try it online](https://ricardoadorno.github.io/proto-typed/)** — Interactive playground with ready-made examples

## What is it?

A tool that converts structured text into interactive interfaces. You describe content, structure, and navigation; it generates HTML with Tailwind + shadcn. Think of it as Markdown for UIs — semantics before appearance.

**Made for**:

- **Designers** who want to prototype flows without code
- **PMs** creating clickable mockups for presentations
- **Backend/full-stack devs** assembling screens without diving into CSS/JSX
- **AIs and agents** collaborating in a stable and versionable textual format

## Main features

- 🚀 **Real-time preview**: see changes instantly
- 📱 **Mobile-first**: native headers, navigators, modals, and drawers
- 🎨 **Theme system**: customizable CSS tokens (shadcn)
- 🧩 **Reusable components**: blocks with prop interpolation
- 🔗 **Complete navigation**: transitions between screens, modals, drawers
- 📝 **Monaco Editor**: syntax highlighting, IntelliSense, error detection
- 📤 **Export**: standalone HTML (Tailwind CDN + Lucide icons)
- 🤖 **AI-friendly**: stable and predictable syntax for models

## Quick start

### Try online

Try it immediately in the playground: **[ricardoadorno.github.io/proto-typed](https://ricardoadorno.github.io/proto-typed/)**

The online interface offers:

- Monaco editor with DSL syntax and autocomplete
- Real-time preview
- Pre-loaded examples (Contacts App, Login, Navigator)
- Standalone HTML export
- Device selector to simulate different screens

### Local installation

```bash
# Clone the repository
git clone https://github.com/ricardoadorno/proto-typed.git
cd proto-typed

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app opens at `http://localhost:3000` (Next.js) with a split interface:

- **Left**: Monaco editor with DSL syntax
- **Right**: Real-time preview with device selector

### Your first prototype

```dsl
screen Home:
  container:
    # Hello, world
    > This is your first prototype
    @[Start](Next)

screen Next:
  container:
    # Success!
    > You have just navigated between screens
    @[Back](-1)
```

**Done!** You have a navigable two-screen prototype.

## How it works

proto-typed uses a **Lexer → Parser → AST → Renderer** pipeline:

1.  **Lexer** tokenizes the DSL text (Chevrotain)
2.  **Parser** builds an Abstract Syntax Tree (AST)
3.  **Renderer** converts AST to HTML with Tailwind CSS + shadcn variables
4.  **Preview** displays the result in a simulated device frame

Your text is transformed into semantic HTML with navigation, themes, and responsive layout — no build step, no framework lock-in.

## Technology stack

- **Frontend**: Next.js 15 + React 19 + TypeScript
- **Parsing**: Chevrotain (lexer & parser)
- **Editor**: Monaco Editor with custom DSL language
- **Styling**: Tailwind CSS + shadcn theme system
- **Output**: Standalone HTML with CDN dependencies

## DSL Syntax

The DSL uses an intuitive and readable syntax, inspired by Markdown and common UI patterns.

### Screens and views

```dsl
screen Home:
  container:
    # Welcome
    > Main content here

modal Dialog:
  card:
    # Confirmation
  @[OK](close)

drawer Menu:
  list:
  - [Home](Home)
    - [Settings](Settings)
```

### Typography

```dsl
# to ####    → Headings (H1-H4)
>           → Paragraph (body)
>>          → Small/secondary text
>>>         → Muted helper text
*>          → Blockquote
**>         → Note callout
```

### Buttons

Pattern: `@<variant>?-<size>?[text](action)`

**Variants** (optional, default: primary):

- `@primary`, `@secondary`, `@outline`, `@ghost`, `@destructive`, `@success`, `@warning`

**Sizes** (optional, default: no modifier):

- `-small`, `-icon`, `-large`

```dsl
@[Default button](action)
@secondary-large[Large secondary button](action)
@outline-small[Small cancel](action)
@destructive[Delete](delete)
```

### Forms

Pattern: `___[<type>?: Label][placeholder[options]] | attributes`

**Input types**: `email`, `password`, `date`, `number`, `textarea`

```dsl
___[Email][Enter email]
___email[Email][Enter email]
___password[Password][Enter password]
___[Country][Select[Brazil | Portugal | Angola]]

[X] Checked checkbox
[ ] Unchecked checkbox
(X) Selected radio
( ) Unselected radio
```

### Layouts

Canonical layout tokens mapped to Tailwind/shadcn classes:

| Token                           | Group            | Short description                         | Base classes                                                |
| ------------------------------- | ---------------- | ----------------------------------------- | ----------------------------------------------------------- |
| `container`                     | Containers       | Balanced width for general pages          | `container mx-auto max-w-4xl px-6`                          |
| `container-narrow`              | Containers       | Reading column or long form               | `container mx-auto max-w-2xl px-6`                          |
| `container-wide`                | Containers       | Dashboards and dense content              | `container mx-auto max-w-6xl px-8`                          |
| `container-full`                | Containers       | Fluid layout spanning full width          | `mx-auto w-full px-4 sm:px-8`                               |
| `stack`                         | Stack (vertical) | Vertical blocks with medium gap           | `flex flex-col gap-6`                                       |
| `stack-tight`                   | Stack (vertical) | High density for short items              | `flex flex-col gap-3`                                       |
| `stack-loose`                   | Stack (vertical) | Spacious sections with breathing room     | `flex flex-col gap-8`                                       |
| `stack-none` (`stack-flush`)    | Stack (vertical) | No gap between stacked items              | `flex flex-col gap-0`                                       |
| `row`                           | Row (horizontal) | Default horizontal alignment              | `flex flex-row items-center gap-6`                          |
| `row-start`                     | Row (horizontal) | Align items to the start                  | `flex flex-row items-start gap-4`                           |
| `row-center`                    | Row (horizontal) | Fully centered distribution               | `flex flex-row items-center justify-center gap-4`           |
| `row-between`                   | Row (horizontal) | Spread items with space-between           | `flex flex-row items-center justify-between gap-4`          |
| `row-end`                       | Row (horizontal) | Right-aligned actions                     | `flex flex-row items-center justify-end gap-4`              |
| `grid`                          | Grid             | Single-column responsive baseline         | `grid grid-cols-1 gap-6`                                    |
| `grid-2`                        | Grid             | Two columns at `md` breakpoint            | `grid grid-cols-1 md:grid-cols-2 gap-6`                     |
| `grid-3`                        | Grid             | Three columns for catalogs                | `grid grid-cols-1 md:grid-cols-3 gap-6`                     |
| `grid-4`                        | Grid             | Four columns on wide screens              | `grid grid-cols-1 lg:grid-cols-4 gap-6`                     |
| `grid-responsive` (`grid-auto`) | Grid             | Auto-fit columns with `minmax(16rem,1fr)` | `grid grid-cols-[repeat(auto-fit,minmax(16rem,1fr))] gap-6` |
| `layer-static`                  | Layer / Position | Keeps flow untouched                      | `static`                                                    |
| `layer-relative`                | Layer / Position | Reference for positioned children         | `relative`                                                  |
| `layer-absolute`                | Layer / Position | Absolute fill inside relative parent      | `absolute inset-0`                                          |
| `layer-fixed`                   | Layer / Position | Fix element to the viewport               | `fixed inset-0`                                             |
| `layer-sticky`                  | Layer / Position | Sticky inside scrolling container         | `sticky top-0`                                              |
| `layer-overlay`                 | Layer / Position | Overlay with blur and backdrop            | `fixed inset-0 z-50 bg-background/80 backdrop-blur-sm`      |
| `scroll-auto`                   | Overflow         | Default overflow behaviour                | `overflow-auto`                                             |
| `scroll-x`                      | Overflow         | Enable horizontal scrolling               | `overflow-x-auto`                                           |
| `scroll-y`                      | Overflow         | Enable vertical scrolling                 | `overflow-y-auto`                                           |
| `scroll-hidden`                 | Overflow         | Hide overflowing content                  | `overflow-hidden`                                           |
| `card`                          | Cards            | Default card container                    | `border rounded-lg p-6`                                     |
| `card-compact`                  | Cards            | Tight card for dense data                 | `border rounded-lg p-4`                                     |
| `card-feature`                  | Cards            | Highlighted card with extra emphasis      | `border-2 rounded-xl p-8 shadow-lg`                         |
| `header`                        | Special          | Sticky page header with border            | `sticky top-0 z-10 border-b px-6`                           |
| `sidebar`                       | Special          | Fixed lateral navigation                  | `fixed h-full border-r p-4 pt-8`                            |

Compatibility: `stack-flush` and `grid-auto` remain available as aliases.

```dsl
container-narrow:
  stack-loose:
    card:
      ## Profile
      stack-tight:
        row-between:
          > Name
          > @proto
    layer-overlay:
      scroll-y:
        card:
          ### Change avatar
          > Upload limit: 2 MB
```

### Components with props

```dsl
component UserCard:
  card:
    ## %name
    > Email: %email
    > Phone: %phone

screen Users:
  list $UserCard:
    - John | john@email.com | (11) 98765-4321
    - Maria | maria@email.com | (21) 97654-3210
```

Props are separated by a pipe (`|`) and interpolated with `%propName`.

### Navigation

```dsl
> [Docs](ScreenName)            → Inline navigation link
> [External link](https://...)  → External URL
@[Go to screen](ScreenName)   → Button navigation
@[Open modal](ModalName)      → Toggle modal
@[Open drawer](DrawerName)    → Toggle drawer
@[Back](-1)                   → Go back in history
```

### Mobile components

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

## Complete example

A complete app with navigation, components, modals, and lists:

```dsl
component Header:
  header:
    # TaskApp
    @ghost[Menu](MainMenu)

modal ConfirmExclusion:
  card:
    # Delete task?
    > This action cannot be undone
    row-end:
      @ghost[Cancel](close)
      @destructive[Delete](delete)

drawer MainMenu:
  list:
    - Dashboard | Dashboard
    - Tasks | Tasks
    - Settings | Settings

screen Dashboard:
  $Header

  container:
    card:
      ## Welcome back
      > You have 5 pending tasks

    grid-2:
      card:
        ### Active
        # 12
      card:
        ### Completed
        # 48

screen Tasks:
  $Header

  container:
    @[Add task](AddTask)

  list:
      - Configure project | Due: Today | @outline[Edit](edit) | @destructive[Delete](ConfirmExclusion)
      - Review code | Due: Tomorrow | @outline[Edit](edit) | @destructive[Delete](ConfirmExclusion)
      - Deploy app | Due: Friday | @outline[Edit](edit) | @destructive[Delete](ConfirmExclusion)

  navigator:
    - Dashboard | Dashboard
    - Tasks | Tasks
    - Config | Settings
```

## Architecture

```
src/
├── app/              # Next.js app directory
├── components/       # React UI components for the editor
├── core/
│   ├── lexer/          # Tokenization (Chevrotain)
│   ├── parser/         # Grammar rules & AST construction
│   ├── renderer/       # AST → HTML conversion
│   │   ├── core/       # node-renderer, route-manager, theme-manager
│   │   ├── infrastructure/  # Gateways, mediators, helpers
│   │   └── nodes/      # Specific element renderers
│   ├── editor/         # Monaco editor integration
│   └── themes/         # Theme system based on shadcn
├── components/         # React UI components
├── examples/          # DSL example code
├── types/             # TypeScript definitions
└── utils/             # Helper functions
```

### Rendering pipeline

1.  **Lexer** (`lexer/tokens/`) - Tokenizes DSL text into structured tokens
2.  **Parser** (`parser/`) - Builds Abstract Syntax Tree (AST) from tokens
3.  **Route Manager** - Processes screens, modals, drawers, components
4.  **Theme Manager** - Merges shadcn themes with custom styles
5.  **Node Renderer** - Converts AST nodes to HTML with navigation
6.  **Output** - Standalone HTML or preview fragment

### Design patterns

- **Strategy Pattern**: Node type → renderer function mapping
- **Facade Pattern**: RouteManagerGateway simplifies complex APIs
- **Mediator Pattern**: NavigationMediator decouples navigation logic
- **Singleton Pattern**: Global route and theme managers

## For developers

### Project philosophy

- **Runtime validation** instead of automated tests
- **Dark mode only** - no light theme support
- **shadcn themes** - CSS variables for all colors
- **No hardcoded colors** - always use semantic tokens
- **Type-safe** - Full TypeScript coverage

### Adding new DSL elements

1.  **Token** (`lexer/tokens/*.tokens.ts`) - Define regex pattern
2.  **Parser** (`parser/parser.ts`) - Add grammar rule
3.  **Builder** (`parser/builders/*.builders.ts`) - Convert CST → AST
4.  **Renderer** (`renderer/nodes/*.node.ts`) - Render AST → HTML
5.  **Types** (`types/ast-node.ts`) - Add to NodeType union

**Example**: Adding a badge element

```typescript
// 1. Token (lexer/tokens/primitives.tokens.ts)
export const Badge = createToken({
  name: 'Badge',
  pattern: /badge\[([^\]]+)\]/,
})

// 2. Builder (parser/builders/primitives.builders.ts)
export function buildBadgeElement(ctx: Context) {
  const match = ctx.Badge[0].image.match(/badge\[([^\]]+)\]/)
  return {
    type: 'Badge',
    props: { text: match?.[1] || '' },
    children: [],
  }
}

// 3. Renderer (renderer/nodes/primitives.node.ts)
export function renderBadge(node: AstNode): string {
  const { text } = node.props as any
  return `<span class="badge" style="background-color: var(--primary);">${text}</span>`
}

// 4. Add to RENDERERS map (renderer/core/node-renderer.ts)
const RENDERERS: Record<NodeType, typeof _render> = {
  // ... existing renderers
  Badge: (n) => renderBadge(n),
}
```

### Code style

**Tailwind CSS**:

- ✅ Base classes only: `flex items-center px-4 py-2`
- ❌ No hardcoded colors: `bg-blue-500 text-white`
- ❌ No dark mode prefixes: `dark:bg-gray-900`

**CSS Variables** (shadcn):

- ✅ Semantic tokens: `var(--primary)`, `var(--muted-foreground)`
- ✅ UI elements: `var(--border)`, `var(--input)`, `var(--ring)`
- ❌ Color names: `var(--blue-500)`, `var(--gray-800)`

### Contributing

1.  Fork the repository
2.  Create a feature branch: `git checkout -b feature/new-element`
3.  Make changes following the code style
4.  Test in the running app (no automated tests)
5.  Submit a pull request

See `.github/copilot-instructions.md` for complete development guidelines.

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

- **shadcn/ui** - Inspiration for the theme system
- **Chevrotain** - Parsing library
- **Monaco Editor** - Code editor component
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide Icons** - Icon system
