# Proto-Typed: LLM Developer Context

> **Purpose**: Complete technical reference for AI agents and LLMs working with the proto-typed DSL framework.  
> **Target**: Test creation, feature development, debugging, and codebase navigation.  
> **Version**: 1.0.0 (2025)

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [DSL Syntax Reference](#2-dsl-syntax-reference)
3. [Code Architecture](#3-code-architecture)
4. [API Reference](#4-api-reference)
5. [Testing Guidelines](#5-testing-guidelines)
6. [Development Workflows](#6-development-workflows)
7. [Troubleshooting](#7-troubleshooting)

---

## 1. System Overview

### 1.1 What is Proto-Typed?

Proto-typed is a **Domain-Specific Language (DSL)** for rapid UI prototyping. It transforms text-based descriptions into interactive HTML prototypes with navigation, theming, and component composition.

**Core Philosophy**:

- Textual UI description (Markdown-like syntax)
- Instant preview (no build step)
- Standalone output (HTML + Tailwind CDN)
- AI-friendly syntax (stable, predictable patterns)

**Technology Stack**:

```
┌─────────────────────────────────────────────────┐
│ Input: DSL Text                                  │
│   ↓                                              │
│ Lexer (Chevrotain) → Tokens                     │
│   ↓                                              │
│ Parser (Chevrotain) → CST                       │
│   ↓                                              │
│ AST Builder → Abstract Syntax Tree              │
│   ↓                                              │
│ Renderer → HTML (Tailwind + shadcn)             │
│   ↓                                              │
│ Output: Standalone HTML or Preview Fragment     │
└─────────────────────────────────────────────────┘
```

**Project Structure**:

```
proto-typed/
├── packages/
│   ├── core/           ← DSL engine (lexer, parser, renderer)
│   ├── extension/      ← VSCode extension
│   └── web/            ← Next.js web playground
└── README.md
```

### 1.2 Key Concepts

| Concept          | Description                         | Example                           |
| ---------------- | ----------------------------------- | --------------------------------- |
| **Screen**       | Top-level view container            | `screen Home:`                    |
| **Modal/Drawer** | Global overlays                     | `modal ConfirmDialog:`            |
| **Component**    | Reusable template with props        | `component UserCard:`             |
| **Layout**       | Canonical preset (row, stack, grid) | `row-center:`, `stack-tight:`     |
| **Primitive**    | Atomic UI element                   | `@[Button](action)`, `# Heading`  |
| **Navigation**   | Screen transitions, modals, actions | `(ScreenName)`, `(close)`, `(-1)` |
| **Props**        | Component variables                 | `%name`, `%email`                 |
| **Theme**        | CSS variable system (shadcn)        | `--primary`, `--card`             |

### 1.3 Processing Pipeline

```
TEXT → TOKENS → CST → AST → HTML
  ↓       ↓       ↓     ↓      ↓
lexer  tokens  parser AST  renderer
                      builder
```

**Flow Details**:

1. **Lexer** (`packages/core/src/lexer/`):
   - Tokenizes DSL text using regex patterns
   - Handles indentation tracking (Indent/Outdent tokens)
   - Token categories: views, primitives, layouts, inputs, components, styles

2. **Parser** (`packages/core/src/parser/parser.ts`):
   - Builds Concrete Syntax Tree (CST) from tokens
   - Defines grammar rules with Chevrotain
   - Error recovery for better UX

3. **AST Builder** (`packages/core/src/parser/builders/`):
   - Converts CST → Abstract Syntax Tree
   - Extracts props, text, modifiers from tokens
   - Generates deterministic IDs for nodes

4. **Renderer** (`packages/core/src/renderer/`):
   - Converts AST → HTML strings
   - Manages navigation (RouteManager)
   - Applies theming (CustomPropertiesManager)
   - Node-specific renderers for each element type

---

## 2. DSL Syntax Reference

### 2.1 Views (Top-Level Containers)

#### Screen

**Purpose**: Main view container for app screens.

**Syntax**:

```dsl
screen ScreenName:
  content here
```

**Properties**:

- Name must be `TitleCase` (e.g., `Home`, `UserProfile`)
- First screen is default entry point
- Navigate via `@[Button](ScreenName)`

**Example**:

```dsl
screen Dashboard:
  header:
    # Dashboard
    @ghost[Settings](Settings)

  container:
    card:
      ## Stats
      > Total Users: 1,234
```

#### Modal

**Purpose**: Overlay dialog that can be toggled.

**Syntax**:

```dsl
modal ModalName:
  content here
```

**Properties**:

- Dismissible via `(close)` action
- Toggleable from buttons: `@[Open](ModalName)`
- Rendered globally (not inside screens)

**Example**:

```dsl
modal ConfirmDelete:
  card:
    # Delete Item?
    > This action cannot be undone.
    row-end:
      @ghost[Cancel](close)
      @destructive[Delete](deleteAction)
```

#### Drawer

**Purpose**: Side panel overlay (typically for navigation).

**Syntax**:

```dsl
drawer DrawerName:
  content here
```

**Properties**:

- Similar to modal but styled as side panel
- Dismissible via `(close)` or background click
- Toggle: `@[Menu](DrawerName)`

**Example**:

```dsl
drawer MainMenu:
  list:
    - Home | Home
    - Profile | Profile
    - Settings | Settings
    - #[Help](https://help.example.com)
```

---

### 2.2 Typography

| Token           | Syntax             | HTML Output            | Use Case       |
| --------------- | ------------------ | ---------------------- | -------------- |
| **Heading 1**   | `# Text`           | `<h1>`                 | Page title     |
| **Heading 2**   | `## Text`          | `<h2>`                 | Section title  |
| **Heading 3**   | `### Text`         | `<h3>`                 | Subsection     |
| **Heading 4-6** | `####` to `######` | `<h4>` - `<h6>`        | Minor headings |
| **Paragraph**   | `> Text`           | `<p>` (with margin)    | Body text      |
| **Text**        | `>> Text`          | `<span>` (no margin)   | Inline text    |
| **Muted Text**  | `>>> Text`         | `<span class="muted">` | Secondary text |
| **Note**        | `*> Text`          | Note element           | Callouts       |
| **Quote**       | `"> Text`          | `<blockquote>`         | Quotes         |

**Examples**:

```dsl
screen TextDemo:
  container:
    # Main Title
    ## Section Heading
    > This is a paragraph with bottom margin.
    >> This is inline text without margin.
    >>> This is muted/secondary text.
    *> Important note here.
    "> This is a quote.
```

---

### 2.3 Buttons

#### Syntax Pattern

```
@<variant>?-<size>?[label](action)
```

**Components**:

- `@` = Button marker (required)
- `<variant>` = Optional style (default: `primary`)
- `-<size>` = Optional size (default: `md`)
- `[label]` = Button text (required)
- `(action)` = Navigation/action target (required)

#### Variants

| Variant           | Syntax               | Style                      |
| ----------------- | -------------------- | -------------------------- |
| Primary (default) | `@[Text]`            | `--primary` background     |
| Secondary         | `@secondary[Text]`   | `--secondary` background   |
| Outline           | `@outline[Text]`     | Border only                |
| Ghost             | `@ghost[Text]`       | Transparent, hover effect  |
| Destructive       | `@destructive[Text]` | `--destructive` background |
| Link              | `@link[Text]`        | Text link style            |
| Success           | `@success[Text]`     | Success/confirm style      |
| Warning           | `@warning[Text]`     | Warning style              |

#### Sizes

| Size             | Syntax | Padding       |
| ---------------- | ------ | ------------- |
| Extra Small      | `-xs`  | `px-2 py-1`   |
| Small            | `-sm`  | `px-3 py-1.5` |
| Medium (default) | `-md`  | `px-4 py-2`   |
| Large            | `-lg`  | `px-6 py-3`   |

#### Actions

| Action Type       | Syntax           | Behavior                   |
| ----------------- | ---------------- | -------------------------- |
| Screen navigation | `(ScreenName)`   | Navigate to screen         |
| Modal toggle      | `(ModalName)`    | Open/close modal           |
| Drawer toggle     | `(DrawerName)`   | Open/close drawer          |
| Back              | `(-1)`           | Navigate back in history   |
| Close overlay     | `(close)`        | Dismiss modal/drawer       |
| JavaScript        | `(functionName)` | Placeholder for JS action  |
| External          | Not for buttons  | Use `#[Link](url)` instead |

#### Icon Support

Buttons support Lucide icons before/after text:

```dsl
@[icon:home Home]        → Icon before
@[Settings icon:settings] → Icon after
@[icon:user]             → Icon only
```

**Examples**:

```dsl
screen ButtonDemo:
  container:
    # Button Variants
    stack:
      @[Default Primary](NextScreen)
      @secondary[Secondary Style](Action)
      @outline[Outline Style](Action)
      @ghost[Ghost Style](Action)
      @destructive[Delete](ConfirmDelete)
      @link[Link Style](Action)

    # Button Sizes
    stack:
      @-xs[Extra Small](Action)
      @-sm[Small](Action)
      @-md[Medium](Action)
      @-lg[Large](Action)

    # Combined
    stack:
      @secondary-lg[Large Secondary](Action)
      @outline-sm[Small Outline](Action)
      @destructive-xs[Tiny Delete](Action)

    # Icons
    stack:
      @[icon:home Home](Dashboard)
      @secondary[Settings icon:settings](Settings)
      @ghost[icon:menu](MainMenu)
```

---

### 2.4 Links & Images

#### Link

**Syntax**: `#[label](url)`

**Properties**:

- External URLs: `https://`, `http://`
- Internal screens: `#ScreenName` (not common, use buttons)
- Opens in new tab for external URLs

**Examples**:

```dsl
screen LinkDemo:
  container:
    > Visit our #[website](https://example.com) for more info.
    > Read the #[documentation](https://docs.example.com/guide).
```

#### Image

**Syntax**: `![alt text](image-url)`

**Properties**:

- Standard Markdown image syntax
- Renders as `<img>` with responsive classes
- Alt text required for accessibility

**Examples**:

```dsl
screen ImageDemo:
  container:
    ![Company Logo](https://example.com/logo.png)
    ![Product Screenshot](https://example.com/product.png)
```

---

### 2.5 Layouts (Canonical Presets)

**Important**: Layouts are **predefined presets** with fixed Tailwind classes. No inline modifiers like `-w50-p4` are supported.

#### Containers

| Layout   | Syntax              | Description         | Tailwind Classes                   |
| -------- | ------------------- | ------------------- | ---------------------------------- |
| Standard | `container:`        | Max-width container | `container mx-auto px-4`           |
| Narrow   | `container-narrow:` | Narrow max-width    | `container max-w-sm mx-auto px-4`  |
| Wide     | `container-wide:`   | Wide max-width      | `container max-w-7xl mx-auto px-4` |
| Full     | `container-full:`   | Full width          | `w-full px-4`                      |

#### Stacks (Vertical)

| Layout   | Syntax         | Description    | Gap     |
| -------- | -------------- | -------------- | ------- |
| Standard | `stack:`       | Vertical stack | `gap-4` |
| Tight    | `stack-tight:` | Compact stack  | `gap-2` |
| Loose    | `stack-loose:` | Spacious stack | `gap-8` |
| Flush    | `stack-flush:` | No gap         | `gap-0` |

#### Rows (Horizontal)

| Layout   | Syntax         | Description    | Alignment                     |
| -------- | -------------- | -------------- | ----------------------------- |
| Standard | `row:`         | Horizontal row | `justify-start`               |
| Center   | `row-center:`  | Centered items | `justify-center items-center` |
| Between  | `row-between:` | Space between  | `justify-between`             |
| End      | `row-end:`     | Right-aligned  | `justify-end`                 |

#### Grids

| Layout   | Syntax       | Description      | Columns                       |
| -------- | ------------ | ---------------- | ----------------------------- |
| 2-column | `grid-2:`    | Two columns      | `grid-cols-2`                 |
| 3-column | `grid-3:`    | Three columns    | `grid-cols-3`                 |
| 4-column | `grid-4:`    | Four columns     | `grid-cols-4`                 |
| Auto-fit | `grid-auto:` | Auto-fit columns | `auto-fit minmax(250px, 1fr)` |

#### Cards

| Layout   | Syntax          | Description    | Padding         |
| -------- | --------------- | -------------- | --------------- |
| Standard | `card:`         | Default card   | `p-6`           |
| Compact  | `card-compact:` | Less padding   | `p-4`           |
| Feature  | `card-feature:` | Prominent card | `p-8 shadow-lg` |

#### Special Layouts

| Layout    | Syntax       | Description                  |
| --------- | ------------ | ---------------------------- |
| Header    | `header:`    | Page header with flex layout |
| Sidebar   | `sidebar:`   | Sidebar container            |
| List      | `list:`      | List container for items     |
| Navigator | `navigator:` | Bottom navigation bar        |
| Fab       | `fab:`       | Floating action button       |
| Separator | `---`        | Horizontal divider           |

**Example**:

```dsl
screen LayoutDemo:
  header:
    # App Name
    @ghost[Menu](MainMenu)

  container-wide:
    stack:
      card:
        ## Welcome
        > Introduction text here.

      grid-3:
        card-compact:
          ### Metric 1
          # 1,234
        card-compact:
          ### Metric 2
          # 5,678
        card-compact:
          ### Metric 3
          # 9,012

      row-between:
        @secondary[Cancel](-1)
        @[Continue](NextStep)

  navigator:
    - Home | Home
    - Profile | Profile
    - Settings | Settings
```

---

### 2.6 Forms & Inputs

#### Input Field

**Syntax**: `___<type>?: Label{placeholder}[options] | attributes`

**Components**:

- `___` = Input marker (3 underscores)
- `<type>` = Optional type (default: `text`)
- `:` = Separator
- `Label` = Field label
- `{placeholder}` = Placeholder text
- `[options]` = For select dropdowns
- `| attributes` = HTML attributes

**Input Types**:
| Type | Syntax | HTML Type |
|------|--------|-----------|
| Text (default) | `___:` | `type="text"` |
| Email | `___email:` | `type="email"` |
| Password | `___password:` | `type="password"` |
| Date | `___date:` | `type="date"` |
| Number | `___number:` | `type="number"` |
| Textarea | `___textarea:` | `<textarea>` |

**Examples**:

```dsl
screen FormDemo:
  container:
    card:
      ## Contact Form

      ___: Full Name{Enter your name}
      ___email: Email Address{Enter your email}
      ___password: Password{Enter password}
      ___date: Birth Date{Select date}
      ___number: Age{Enter age}
      ___textarea: Message{Type your message here}

      # With Select
      ___: Country{Select country}[USA | Canada | Mexico | Brazil]

      # With Attributes
      ___: Email{Your email} | required placeholder="user@example.com"

      @[Submit](submitForm)
```

#### Checkbox

**Syntax**:

- Checked: `[X] Label text`
- Unchecked: `[ ] Label text`

**Examples**:

```dsl
screen CheckboxDemo:
  container:
    card:
      ## Preferences
      [X] Receive email notifications
      [ ] Receive SMS notifications
      [X] Enable dark mode
```

#### Radio Button

**Syntax**:

- Selected: `(X) Label text`
- Unselected: `( ) Label text`

**Examples**:

```dsl
screen RadioDemo:
  container:
    card:
      ## Choose Plan
      (X) Free Plan
      ( ) Pro Plan
      ( ) Enterprise Plan
```

---

### 2.7 Components

#### Component Definition

**Syntax**:

```dsl
component ComponentName:
  content with %propVariables
```

**Properties**:

- Name must be `TitleCase`
- Props use `%varName` syntax
- Can contain any DSL elements
- Stored globally, rendered on instantiation

**Example**:

```dsl
component UserCard:
  card:
    ## %name
    >> %email
    >>> %role
    row-end:
      @outline[View](%profileLink)
```

#### Component Instantiation (Simple)

**Syntax**: `$ComponentName`

**Example**:

```dsl
screen Demo:
  container:
    $UserCard
```

#### Component Instantiation (With Props)

**Syntax**:

```dsl
$ComponentName:
  - value1 | value2 | value3
```

**Properties**:

- Values separated by `|` (pipe)
- Order matches `%prop` order in definition
- First `%` gets first value, second `%` gets second value, etc.

**Example**:

```dsl
component MetricCard:
  card:
    ### %label
    # %value
    >> %change

screen Dashboard:
  grid-3:
    $MetricCard:
      - Total Users | 1,234 | +12%
    $MetricCard:
      - Revenue | $45,678 | +8%
    $MetricCard:
      - Conversions | 89 | -3%
```

#### Component Lists

**Syntax**:

```dsl
list $ComponentName:
  - prop1 | prop2 | prop3
  - prop1 | prop2 | prop3
  - prop1 | prop2 | prop3
```

**Properties**:

- Each line creates one component instance
- Props map to `%variables` in definition
- Efficient for repeated data

**Example**:

```dsl
component TaskRow:
  row-between:
    > %task
    >>> %due
    @outline-sm[Edit](%editAction)

screen Tasks:
  container:
    list $TaskRow:
      - Review pull requests | Today | editTask1
      - Update documentation | Tomorrow | editTask2
      - Deploy to production | Friday | editTask3
```

---

### 2.8 Navigation

#### Navigation Targets

| Target Type | Syntax         | Behavior           | Example                     |
| ----------- | -------------- | ------------------ | --------------------------- |
| Screen      | `(ScreenName)` | Navigate to screen | `@[Go](Dashboard)`          |
| Modal       | `(ModalName)`  | Toggle modal       | `@[Open](ConfirmModal)`     |
| Drawer      | `(DrawerName)` | Toggle drawer      | `@[Menu](MainDrawer)`       |
| Back        | `(-1)`         | History back       | `@[Back](-1)`               |
| Close       | `(close)`      | Close overlay      | `@[Close](close)`           |
| Action      | `(actionName)` | Placeholder action | `@[Submit](submitForm)`     |
| External    | `#[Link](url)` | External URL       | `#[Docs](https://docs.com)` |

#### Navigation Flow Example

```dsl
screen Home:
  container:
    # Welcome
    @[Get Started](Onboarding)
    @[Open Menu](MainMenu)

screen Onboarding:
  container:
    # Step 1
    > Introduction text.
    row-between:
      @ghost[Back](-1)
      @[Next](OnboardingStep2)

screen OnboardingStep2:
  container:
    # Step 2
    > More details.
    @[Finish](Dashboard)

modal ConfirmAction:
  card:
    # Are you sure?
    row-end:
      @ghost[Cancel](close)
      @destructive[Confirm](deleteAction)

drawer MainMenu:
  list:
    - Home | Home
    - Profile | Profile
    - #[Help](https://help.example.com)
```

---

### 2.9 Styles & Theming

#### Styles Block

**Syntax**:

```dsl
styles:
  --custom-property: value;
  --another-property: value;
```

**Properties**:

- Define CSS custom properties
- Merged with theme variables
- Override theme defaults

**Example**:

```dsl
styles:
  --primary: oklch(0.7 0.2 250);
  --radius: 0.75rem;
  --font-family: "Inter", sans-serif;

screen Home:
  container:
    # Styled App
    > Uses custom primary color and border radius.
```

#### Theme System (shadcn-based)

**CSS Variables** (always use these, never hardcoded colors):

**Core Colors**:

- `--background` - Page background
- `--foreground` - Default text color
- `--card` - Card background
- `--card-foreground` - Card text
- `--popover` - Popover background
- `--popover-foreground` - Popover text

**Semantic Colors**:

- `--primary` / `--primary-foreground`
- `--secondary` / `--secondary-foreground`
- `--muted` / `--muted-foreground`
- `--accent` / `--accent-foreground`
- `--destructive` / `--destructive-foreground`

**UI Elements**:

- `--border` - Border color
- `--input` - Input border color
- `--ring` - Focus ring color
- `--radius` - Border radius value

**Chart Colors**:

- `--chart-1` to `--chart-5`

**Available Themes**:

- neutral, stone, slate, gray, zinc, red, rose, orange, green, blue, yellow, violet

**Usage in Renderer**:

```typescript
// ✅ DO: Use CSS variables
style="background-color: var(--primary); color: var(--primary-foreground);"

// ❌ DON'T: Hardcoded colors
class="bg-blue-500 text-white"
```

---

## 3. Code Architecture

### 3.1 Directory Structure

```
packages/core/src/
├── lexer/
│   ├── lexer.ts                    ← Main lexer with indentation tracking
│   └── tokens/
│       ├── core.tokens.ts          ← Identifier, Colon
│       ├── views.tokens.ts         ← Screen, Modal, Drawer
│       ├── primitives.tokens.ts    ← Button, Link, Image, Typography
│       ├── layouts.tokens.ts       ← Container, Stack, Row, Grid, Card
│       ├── inputs.tokens.ts        ← Input, Checkbox, Radio
│       ├── components.tokens.ts    ← Component, ComponentInstance
│       └── styles.tokens.ts        ← Styles, CssProperty
│
├── parser/
│   ├── parser.ts                   ← Grammar rules (Chevrotain CstParser)
│   ├── types.ts                    ← Parser context types
│   ├── index.ts                    ← Parser exports
│   ├── parse-and-build-ast.ts     ← Main parse function
│   ├── ast-builder.ts              ← CST → AST conversion orchestrator
│   └── builders/
│       ├── core.builders.ts        ← Program, Identifier builders
│       ├── views.builders.ts       ← Screen, Modal, Drawer builders
│       ├── primitives.builders.ts  ← Button, Link, Image, Text builders
│       ├── layouts.builders.ts     ← Layout, List, Card builders
│       ├── inputs.builders.ts      ← Input, Checkbox, Radio builders
│       ├── components.builders.ts  ← Component builders
│       └── styles.builders.ts      ← Styles builders
│
├── renderer/
│   ├── ast-to-html-document.ts     ← Full HTML document export
│   ├── ast-to-html-string-preview.ts ← Preview HTML fragment
│   ├── core/
│   │   ├── node-renderer.ts        ← Central dispatcher (Strategy pattern)
│   │   ├── route-manager.ts        ← Navigation state management
│   │   ├── theme-manager.ts        ← CSS variables management
│   │   └── safe-render.ts          ← Error boundary for rendering
│   ├── infrastructure/
│   │   ├── route-manager-gateway.ts      ← Facade for SPA clients
│   │   ├── navigation-mediator.ts        ← Navigation analysis
│   │   └── html-render-helper.ts         ← Screen rendering utilities
│   └── nodes/
│       ├── views.node.ts           ← Screen, Modal, Drawer renderers
│       ├── primitives.node.ts      ← Button, Link, Image, Text renderers
│       ├── layouts.node.ts         ← Layout renderers
│       ├── inputs.node.ts          ← Input renderers
│       ├── components.node.ts      ← Component renderers
│       └── styles/
│           └── styles.ts           ← Tailwind base classes + inline styles
│
├── themes/
│   └── theme-definitions.ts        ← shadcn theme definitions (OKLCH)
│
├── types/
│   ├── ast-node.ts                 ← AST node types & discriminated unions
│   ├── errors.ts                   ← Error types
│   ├── render.ts                   ← Render context types
│   └── routing.ts                  ← Route types
│
├── utils/
│   ├── deterministic-ids.ts        ← ID generation
│   ├── icon-utils.ts               ← Lucide icon parsing
│   └── suggestions.ts              ← Error suggestions
│
├── error-bus.ts                    ← Global error collection
└── index.ts                        ← Main exports
```

### 3.2 Key Classes & Services

#### Lexer (`lexer/lexer.ts`)

```typescript
export class IndentationLexer {
  tokenize(text: string): ILexingResult
}
```

- **Purpose**: Convert text → tokens with indentation tracking
- **Key Feature**: Adds `Indent`/`Outdent` tokens for nesting
- **Token Categories**: Organized in `tokens/*.tokens.ts`

#### Parser (`parser/parser.ts`)

```typescript
export class UiDslParser extends CstParser {
  program: Rule
  viewDefinition: Rule
  primitiveElement: Rule
  layoutElement: Rule
  // ... 40+ grammar rules
}
```

- **Purpose**: Build Concrete Syntax Tree from tokens
- **Pattern**: Chevrotain CstParser with grammar rules
- **Error Recovery**: Enabled for better UX

#### AST Builder (`parser/ast-builder.ts`)

```typescript
export class AstBuilder {
  visit(cst: CstNode): AstNode
}
```

- **Purpose**: Convert CST → AST
- **Pattern**: Visitor pattern with builders
- **Builders**: Modular in `builders/*.builders.ts`

#### RouteManager (`renderer/core/route-manager.ts`)

```typescript
export class RouteManager {
  processRoutes(ast: AstNode[], options): RouteCollection
  navigate(target: string): void
  goBack(): void
  getRoutes(): RouteCollection
  getRouteContext(): RouteContext
  createRenderContext(mode, options): RouteRenderContext
}
```

- **Purpose**: Manage screens, modals, drawers, components
- **Pattern**: Singleton service
- **State**: Current screen, navigation history, route collection
- **Key Methods**:
  - `processRoutes()` - Extract routes from AST
  - `navigate()` / `goBack()` - Navigation operations
  - `getRouteContext()` - Context for NavigationMediator

#### CustomPropertiesManager (`renderer/core/theme-manager.ts`)

```typescript
export class CustomPropertiesManager {
  reset(): void
  processStylesConfig(stylesNodes: AstNode[]): void
  generateAllCssVariables(isDark): string
  setExternalTheme(themeName: string): void
}
```

- **Purpose**: Manage CSS custom properties
- **Pattern**: Singleton service
- **Flow**: External theme + DSL `styles:` → Complete CSS

#### NavigationMediator (`renderer/infrastructure/navigation-mediator.ts`)

```typescript
export class NavigationMediator {
  analyzeNavigationTarget(target, routes): NavigationInfo
  generateHrefAttribute(target): string
  generateNavigationAttributes(target, routes): Record<string, string>
}
```

- **Purpose**: Analyze and generate navigation attributes
- **Pattern**: Mediator pattern
- **Types**: internal, external, action, toggle, back

#### Node Renderer (`renderer/core/node-renderer.ts`)

```typescript
const RENDERERS: Record<NodeType, RenderFunction> = {
  Button: (n) => renderButton(n),
  Screen: (n) => renderScreen(n, _render),
  // ... 40+ node types
}

export function renderNode(node: AstNode, ctx?: string): string
```

- **Purpose**: Dispatch nodes to specific renderers
- **Pattern**: Strategy pattern
- **Extension**: Add to `RENDERERS` map for new node types

### 3.3 Design Patterns

| Pattern             | Component                                 | Purpose                     |
| ------------------- | ----------------------------------------- | --------------------------- |
| **Strategy**        | `node-renderer.ts`                        | Map node types → renderers  |
| **Singleton**       | `RouteManager`, `CustomPropertiesManager` | Global state                |
| **Facade**          | `route-manager-gateway.ts`                | Simplify API for React      |
| **Mediator**        | `navigation-mediator.ts`                  | Decouple navigation logic   |
| **Visitor**         | `ast-builder.ts`                          | Traverse CST → AST          |
| **Builder**         | `builders/*.builders.ts`                  | Construct AST nodes         |
| **Template Method** | Render pipeline                           | Consistent render flow      |
| **Pure Functions**  | Node renderers                            | Predictable HTML generation |

### 3.4 Data Flow

#### Parse Flow

```
1. Text input
   ↓
2. IndentationLexer.tokenize(text)
   → Returns: { tokens, errors, groups }
   ↓
3. UiDslParser.parse(tokens)
   → Returns: CstNode (program)
   ↓
4. AstBuilder.visit(cst)
   → Returns: AstNode[]
   ↓
5. Return AST + errors
```

#### Render Flow

```
1. AST input
   ↓
2. customPropertiesManager.reset()
   ↓
3. customPropertiesManager.processStylesConfig(stylesNodes)
   ↓
4. routeManager.processRoutes(ast, options)
   ↓
5. routeManager.setRouteContext(mode, options)
   ↓
6. renderNode(screenNode)
   → Recursively renders children via RENDERERS map
   ↓
7. renderGlobalElements() (modals, drawers)
   ↓
8. Generate navigation script (document mode)
   ↓
9. routeManager.clearRouteContext()
   ↓
10. Return HTML string
```

---

## 4. API Reference

### 4.1 Parser API

#### `parseAndBuildAst(input: string): ParseResult`

**Purpose**: Main entry point for parsing DSL text.

**Parameters**:

- `input` (string): DSL text to parse

**Returns**:

```typescript
interface ParseResult {
  ast: AstNode[]
  errors: ProtoError[]
  parseErrors: IRecognitionException[]
}
```

**Example**:

```typescript
import { parseAndBuildAst } from '@proto-typed/core'

const result = parseAndBuildAst(`
screen Home:
  container:
    # Welcome
    @[Get Started](Next)
`)

if (result.errors.length === 0) {
  console.log('AST:', result.ast)
} else {
  console.error('Errors:', result.errors)
}
```

---

### 4.2 Renderer API

#### `astToHtmlDocument(ast: AstNode[], options?): string`

**Purpose**: Generate standalone HTML document.

**Parameters**:

- `ast` (AstNode[]): Parsed AST
- `options` (optional):
  ```typescript
  {
    currentScreen?: string,  // Initial screen (default: first)
    isDarkMode?: boolean     // Theme mode (default: true)
  }
  ```

**Returns**: Full HTML document string with:

- Tailwind CDN
- Lucide icons CDN
- Navigation script
- CSS variables

**Example**:

```typescript
import { parseAndBuildAst, astToHtmlDocument } from '@proto-typed/core'

const { ast } = parseAndBuildAst(dslText)
const html = astToHtmlDocument(ast, {
  currentScreen: 'Dashboard',
  isDarkMode: true,
})

// Save to file or serve
fs.writeFileSync('prototype.html', html)
```

#### `astToHtmlStringPreview(ast: AstNode[], options?): string`

**Purpose**: Generate HTML fragment for SPA embedding.

**Parameters**: Same as `astToHtmlDocument`

**Returns**: HTML fragment (no `<html>` wrapper, no CDNs)

**Example**:

```typescript
import { astToHtmlStringPreview } from '@proto-typed/core'

const previewHtml = astToHtmlStringPreview(ast, {
  currentScreen: 'Home'
})

// Use in React iframe or preview panel
<div dangerouslySetInnerHTML={{ __html: previewHtml }} />
```

---

### 4.3 RouteManager API

#### `processRoutes(ast: AstNode[], options?): RouteCollection`

**Purpose**: Extract and organize routes from AST.

**Parameters**:

- `ast` (AstNode[]): Parsed AST
- `options`:
  ```typescript
  {
    currentScreen?: string,
    initialScreen?: string
  }
  ```

**Returns**:

```typescript
interface RouteCollection {
  screens: Map<string, ScreenRoute>
  globals: Map<string, GlobalRoute>
  currentScreen?: string
  defaultScreen?: string
}
```

**Example**:

```typescript
import { routeManager } from '@proto-typed/core'

const routes = routeManager.processRoutes(ast, {
  currentScreen: 'Dashboard',
})

console.log('Screens:', Array.from(routes.screens.keys()))
console.log('Modals:', routeManager.getRoutesByType('modal'))
```

#### `navigate(target: string): boolean`

**Purpose**: Navigate to a screen/modal/drawer.

**Parameters**:

- `target` (string): Navigation target (screen name, modal name, etc.)

**Returns**: `boolean` - Success status

**Example**:

```typescript
routeManager.navigate('Profile') // Navigate to screen
routeManager.navigate('ConfirmModal') // Open modal
routeManager.navigate('-1') // Go back
```

#### `goBack(): void`

**Purpose**: Navigate back in history.

**Example**:

```typescript
routeManager.goBack()
```

#### `getRouteContext(): RouteContext`

**Purpose**: Get context for navigation analysis.

**Returns**:

```typescript
interface RouteContext {
  screens: string[]
  modals: string[]
  drawers: string[]
}
```

---

### 4.4 NavigationMediator API

#### `analyzeNavigationTarget(target: string, routes: RouteContext): NavigationInfo`

**Purpose**: Analyze navigation target to determine type.

**Parameters**:

- `target` (string): Navigation target
- `routes` (RouteContext): Available routes

**Returns**:

```typescript
interface NavigationInfo {
  type: 'internal' | 'external' | 'action' | 'toggle' | 'back'
  value: string
  isValid: boolean
}
```

**Example**:

```typescript
import { NavigationMediator } from '@proto-typed/core'

const mediator = new NavigationMediator()
const routes = routeManager.getRouteContext()

const info = mediator.analyzeNavigationTarget('Dashboard', routes)
// { type: 'internal', value: 'Dashboard', isValid: true }

const info2 = mediator.analyzeNavigationTarget('https://example.com', routes)
// { type: 'external', value: 'https://example.com', isValid: true }
```

#### `generateNavigationAttributes(target: string, routes: RouteContext): Record<string, string>`

**Purpose**: Generate HTML attributes for navigation.

**Returns**:

```typescript
{
  href?: string,
  'data-nav'?: string,
  'data-nav-type'?: string
}
```

**Example**:

```typescript
const attrs = mediator.generateNavigationAttributes('Profile', routes)
// { href: '#', 'data-nav': 'Profile', 'data-nav-type': 'internal' }
```

---

### 4.5 Theme API

#### `customPropertiesManager.setExternalTheme(themeName: string): void`

**Purpose**: Set UI theme.

**Parameters**:

- `themeName` (string): Theme name (neutral, slate, blue, etc.)

**Example**:

```typescript
import { customPropertiesManager } from '@proto-typed/core'

customPropertiesManager.setExternalTheme('blue')
```

#### `customPropertiesManager.generateAllCssVariables(isDark: boolean): string`

**Purpose**: Generate CSS variables declaration.

**Parameters**:

- `isDark` (boolean): Dark mode flag

**Returns**: CSS variable string

**Example**:

```typescript
const cssVars = customPropertiesManager.generateAllCssVariables(true)
// Returns: ":root { --primary: ...; --background: ...; }"
```

---

### 4.6 Error Handling

#### Error Types

```typescript
interface ProtoError {
  type: 'lexer' | 'parser' | 'builder' | 'render'
  severity: 'error' | 'warning'
  message: string
  line?: number
  column?: number
  token?: string
  suggestion?: string
}
```

#### Error Collection

```typescript
import { ErrorBus } from '@proto-typed/core'

// Get all errors
const errors = ErrorBus.getErrors()

// Get errors by type
const parseErrors = ErrorBus.getErrorsByType('parser')

// Clear errors
ErrorBus.clearErrors()

// Add custom error
ErrorBus.addError({
  type: 'render',
  severity: 'error',
  message: 'Failed to render component',
  line: 10,
  suggestion: 'Check component definition',
})
```

---

## 5. Testing Guidelines

### 5.1 Testing Philosophy

**Proto-typed uses runtime validation over automated tests**:

- ✅ **Manual testing** in running app
- ✅ **User feedback** for validation
- ✅ **Error reporting** in UI
- ❌ **No test suite** (by design)

**Why?**:

- DSL is visual - requires human evaluation
- Rapid iteration - tests slow down experimentation
- Error messages guide users in real-time

### 5.2 Creating Test Cases

When creating a test suite, focus on:

#### Unit Test Categories

**1. Lexer Tests**

- Token pattern matching
- Indentation tracking
- Error recovery

**Example**:

```typescript
describe('Lexer', () => {
  it('should tokenize button with variant', () => {
    const result = lexer.tokenize('@secondary[Click](action)')
    expect(result.tokens).toContainEqual(
      expect.objectContaining({ tokenType: ButtonSecondary })
    )
  })

  it('should handle indentation', () => {
    const input = `
screen Home:
  container:
    # Title
`
    const result = lexer.tokenize(input)
    const indents = result.tokens.filter((t) => t.tokenType === Indent)
    expect(indents).toHaveLength(2)
  })
})
```

**2. Parser Tests**

- Grammar rule validation
- CST structure correctness
- Error reporting

**Example**:

```typescript
describe('Parser', () => {
  it('should parse screen definition', () => {
    const tokens = lexer.tokenize('screen Home:')
    parser.input = tokens.tokens
    const cst = parser.viewDefinition()
    expect(cst.children.Screen).toBeDefined()
    expect(cst.children.Identifier).toBeDefined()
  })

  it('should report missing colon', () => {
    const tokens = lexer.tokenize('screen Home')
    parser.input = tokens.tokens
    parser.viewDefinition()
    expect(parser.errors).toHaveLength(1)
  })
})
```

**3. AST Builder Tests**

- Node construction correctness
- Prop extraction
- Children nesting

**Example**:

```typescript
describe('AST Builder', () => {
  it('should build button node with props', () => {
    const cst = parseDsl('@secondary-lg[Click](Next)')
    const ast = builder.visit(cst)
    expect(ast[0]).toEqual({
      type: 'Button',
      id: expect.any(String),
      props: {
        label: 'Click',
        action: 'Next',
        variant: 'secondary',
        size: 'lg',
      },
      children: [],
    })
  })

  it('should handle component props', () => {
    const cst = parseDsl(`
component Card:
  # %title
$Card:
  - Hello
`)
    const ast = builder.visit(cst)
    const instance = ast.find((n) => n.type === 'ComponentInstance')
    expect(instance.props.values).toEqual(['Hello'])
  })
})
```

**4. Renderer Tests**

- HTML output correctness
- CSS class application
- Navigation attribute generation

**Example**:

```typescript
describe('Renderer', () => {
  it('should render button with correct HTML', () => {
    const node: AstNode = {
      type: 'Button',
      id: 'btn-1',
      props: { label: 'Click', action: 'Next', variant: 'primary' },
      children: [],
    }
    const html = renderButton(node)
    expect(html).toContain('<button')
    expect(html).toContain('data-nav="Next"')
    expect(html).toContain('Click')
  })

  it('should render screen with children', () => {
    const node: AstNode = {
      type: 'Screen',
      id: 'screen-1',
      props: { name: 'Home' },
      children: [
        { type: 'Heading', props: { level: 1, text: 'Title' }, children: [] },
      ],
    }
    const html = renderScreen(node, renderNode)
    expect(html).toContain('<div id="screen-Home"')
    expect(html).toContain('<h1')
    expect(html).toContain('Title')
  })
})
```

**5. Navigation Tests**

- Route processing
- Navigation state management
- History tracking

**Example**:

```typescript
describe('RouteManager', () => {
  it('should process routes from AST', () => {
    const ast = parseDsl(`
screen Home:
  # Title
modal Confirm:
  # Message
`)
    const routes = routeManager.processRoutes(ast)
    expect(routes.screens.size).toBe(1)
    expect(routes.globals.size).toBe(1)
    expect(routes.screens.has('Home')).toBe(true)
    expect(routes.globals.has('Confirm')).toBe(true)
  })

  it('should navigate to screen', () => {
    routeManager.processRoutes(ast)
    const result = routeManager.navigate('Profile')
    expect(result).toBe(true)
    expect(routeManager.getRoutes().currentScreen).toBe('Profile')
  })

  it('should track navigation history', () => {
    routeManager.navigate('Home')
    routeManager.navigate('Profile')
    routeManager.goBack()
    expect(routeManager.getRoutes().currentScreen).toBe('Home')
  })
})
```

**6. Theme Tests**

- CSS variable generation
- Custom property merging
- Theme switching

**Example**:

```typescript
describe('CustomPropertiesManager', () => {
  it('should generate CSS variables', () => {
    customPropertiesManager.setExternalTheme('blue')
    const css = customPropertiesManager.generateAllCssVariables(true)
    expect(css).toContain('--primary:')
    expect(css).toContain('--background:')
  })

  it('should merge custom properties', () => {
    const stylesNode: AstNode = {
      type: 'Styles',
      props: {
        properties: [{ name: '--custom-color', value: '#ff0000' }],
      },
      children: [],
    }
    customPropertiesManager.processStylesConfig([stylesNode])
    const css = customPropertiesManager.generateAllCssVariables(true)
    expect(css).toContain('--custom-color: #ff0000')
  })
})
```

#### Integration Test Categories

**1. Full Parse-Render Pipeline**

```typescript
describe('Parse & Render Integration', () => {
  it('should parse and render complete screen', () => {
    const dsl = `
screen Dashboard:
  header:
    # Dashboard
    @ghost[Menu](MainMenu)
  
  container:
    card:
      ## Stats
      > Total Users: 1,234
      @[View Details](Users)
`
    const { ast } = parseAndBuildAst(dsl)
    const html = astToHtmlDocument(ast)

    expect(html).toContain('<!DOCTYPE html>')
    expect(html).toContain('<div id="screen-Dashboard"')
    expect(html).toContain('Dashboard')
    expect(html).toContain('Total Users: 1,234')
  })
})
```

**2. Component System**

```typescript
describe('Component System Integration', () => {
  it('should define and instantiate component with props', () => {
    const dsl = `
component UserCard:
  card:
    ## %name
    > %email

screen Users:
  list $UserCard:
    - John | john@example.com
    - Jane | jane@example.com
`
    const { ast } = parseAndBuildAst(dsl)
    const html = astToHtmlStringPreview(ast, { currentScreen: 'Users' })

    expect(html).toContain('John')
    expect(html).toContain('john@example.com')
    expect(html).toContain('Jane')
    expect(html).toContain('jane@example.com')
  })
})
```

**3. Navigation Flow**

```typescript
describe('Navigation Integration', () => {
  it('should handle multi-screen navigation', () => {
    const dsl = `
screen Home:
  @[Go to Profile](Profile)

screen Profile:
  @[Back](-1)
`
    const { ast } = parseAndBuildAst(dsl)
    routeManager.processRoutes(ast)

    expect(routeManager.getRoutes().currentScreen).toBe('Home')
    routeManager.navigate('Profile')
    expect(routeManager.getRoutes().currentScreen).toBe('Profile')
    routeManager.goBack()
    expect(routeManager.getRoutes().currentScreen).toBe('Home')
  })
})
```

### 5.3 Test Organization

```
packages/core/tests/
├── unit/
│   ├── lexer/
│   │   ├── indentation.test.ts
│   │   ├── button-tokens.test.ts
│   │   ├── layout-tokens.test.ts
│   │   └── error-recovery.test.ts
│   ├── parser/
│   │   ├── views.test.ts
│   │   ├── primitives.test.ts
│   │   ├── layouts.test.ts
│   │   └── error-reporting.test.ts
│   ├── builders/
│   │   ├── views.builder.test.ts
│   │   ├── primitives.builder.test.ts
│   │   └── components.builder.test.ts
│   ├── renderer/
│   │   ├── node-renderers.test.ts
│   │   ├── route-manager.test.ts
│   │   ├── theme-manager.test.ts
│   │   └── navigation-mediator.test.ts
│   └── utils/
│       ├── deterministic-ids.test.ts
│       └── icon-utils.test.ts
├── integration/
│   ├── parse-render.test.ts
│   ├── component-system.test.ts
│   ├── navigation-flow.test.ts
│   └── theme-system.test.ts
├── fixtures/
│   ├── complete-app.dsl
│   ├── component-examples.dsl
│   ├── layout-examples.dsl
│   └── error-cases.dsl
└── helpers/
    ├── parse-helpers.ts
    ├── render-helpers.ts
    └── assertion-helpers.ts
```

### 5.4 Test Fixtures

Create comprehensive DSL examples for testing:

**`fixtures/complete-app.dsl`**:

```dsl
component Header:
  header:
    # %appName
    @ghost[Menu](%menuAction)

component MetricCard:
  card:
    >>> %label
    # %value
    >> %change

modal ConfirmDelete:
  card:
    # Delete Item?
    > This action cannot be undone.
    row-end:
      @ghost[Cancel](close)
      @destructive[Delete](deleteAction)

drawer MainMenu:
  list:
    - Dashboard | Dashboard
    - Users | Users
    - Settings | Settings
    - #[Help](https://help.example.com)

screen Dashboard:
  $Header:
    - MyApp | MainMenu

  container-wide:
    stack:
      card:
        ## Welcome Back
        > You have 5 pending tasks.

      grid-3:
        $MetricCard:
          - Total Users | 1,234 | +12%
        $MetricCard:
          - Revenue | $45,678 | +8%
        $MetricCard:
          - Tasks | 89 | -3%

      row-end:
        @[View Users](Users)

  navigator:
    - Dashboard | Dashboard
    - Users | Users
    - Settings | Settings

screen Users:
  $Header:
    - MyApp | MainMenu

  container:
    # User Management

    list:
      - John Doe | john@example.com | @outline[Edit](editUser) | @destructive[Delete](ConfirmDelete)
      - Jane Smith | jane@example.com | @outline[Edit](editUser) | @destructive[Delete](ConfirmDelete)

    @[Add User](AddUser)

  navigator:
    - Dashboard | Dashboard
    - Users | Users
    - Settings | Settings

screen Settings:
  $Header:
    - MyApp | MainMenu

  container:
    card:
      ## Settings

      ___: App Name{Enter app name}
      ___email: Email{Enter email}

      [X] Enable notifications
      [ ] Dark mode

      row-end:
        @ghost[Cancel](-1)
        @[Save](saveSettings)

  navigator:
    - Dashboard | Dashboard
    - Users | Users
    - Settings | Settings
```

### 5.5 Test Utilities

**`helpers/parse-helpers.ts`**:

```typescript
export function parseDsl(input: string): AstNode[] {
  const { ast, errors } = parseAndBuildAst(input)
  if (errors.length > 0) {
    throw new Error(`Parse errors: ${errors.map((e) => e.message).join(', ')}`)
  }
  return ast
}

export function findNodeByType(
  ast: AstNode[],
  type: NodeType
): AstNode | undefined {
  for (const node of ast) {
    if (node.type === type) return node
    if (node.children) {
      const found = findNodeByType(node.children, type)
      if (found) return found
    }
  }
  return undefined
}

export function getAllNodesByType(ast: AstNode[], type: NodeType): AstNode[] {
  const found: AstNode[] = []
  for (const node of ast) {
    if (node.type === type) found.push(node)
    if (node.children) {
      found.push(...getAllNodesByType(node.children, type))
    }
  }
  return found
}
```

**`helpers/assertion-helpers.ts`**:

```typescript
export function expectHtmlToContainElement(
  html: string,
  tag: string,
  text?: string
) {
  const pattern = text
    ? new RegExp(`<${tag}[^>]*>.*${escapeRegex(text)}.*<\/${tag}>`, 's')
    : new RegExp(`<${tag}[^>]*>`)
  expect(html).toMatch(pattern)
}

export function expectHtmlToHaveAttribute(
  html: string,
  attr: string,
  value?: string
) {
  const pattern = value
    ? new RegExp(`${attr}="${escapeRegex(value)}"`)
    : new RegExp(`${attr}="[^"]*"`)
  expect(html).toMatch(pattern)
}

export function expectNodeStructure(node: AstNode, expected: Partial<AstNode>) {
  expect(node.type).toBe(expected.type)
  if (expected.props) {
    expect(node.props).toMatchObject(expected.props)
  }
  if (expected.children) {
    expect(node.children).toHaveLength(expected.children.length)
  }
}
```

### 5.6 Coverage Goals

Target test coverage for a comprehensive suite:

| Component          | Coverage Target | Priority |
| ------------------ | --------------- | -------- |
| Lexer              | 90%+            | High     |
| Parser             | 85%+            | High     |
| AST Builders       | 90%+            | High     |
| Renderers          | 85%+            | High     |
| RouteManager       | 90%+            | High     |
| NavigationMediator | 85%+            | Medium   |
| Theme System       | 80%+            | Medium   |
| Utilities          | 90%+            | Low      |

**Focus Areas**:

1. Token pattern matching (all syntax variants)
2. Error recovery and reporting
3. Component prop interpolation
4. Navigation state management
5. HTML attribute generation
6. CSS variable generation

---

## 6. Development Workflows

### 6.1 Adding New DSL Elements

**Step-by-Step Process**:

#### 1. Define Token

**File**: `packages/core/src/lexer/tokens/<category>.tokens.ts`

```typescript
import { createToken } from 'chevrotain'

export const Badge = createToken({
  name: 'Badge',
  pattern: /badge\[([^\]]+)\]/,
  line_breaks: false,
})

// Add to category token array
export const primitivesTokens = [
  // ... existing tokens
  Badge,
]
```

**Pattern Guidelines**:

- Use capturing groups `()` for data extraction
- Use non-capturing groups `(?:)` for optional parts
- Escape special regex characters: `\[`, `\]`, `\(`, `\)`, etc.
- Test pattern at regex101.com

#### 2. Add Parser Rule

**File**: `packages/core/src/parser/parser.ts`

```typescript
export class UiDslParser extends CstParser {
  // ... existing rules

  badgeElement = this.RULE('badgeElement', () => {
    this.CONSUME(Badge)
  })

  // Update primitiveElement to include badge
  primitiveElement = this.RULE('primitiveElement', () => {
    this.OR([
      // ... existing alternatives
      { ALT: () => this.SUBRULE(this.badgeElement) },
    ])
  })
}
```

**Rule Guidelines**:

- Use descriptive rule names (e.g., `badgeElement`)
- Use `CONSUME` for token matching
- Use `SUBRULE` for nested rules
- Use `OR` for alternatives
- Use `MANY` for repetition
- Handle indentation with `Indent`/`Outdent`

#### 3. Create AST Builder

**File**: `packages/core/src/parser/builders/<category>.builders.ts`

```typescript
export function buildBadgeElement(ctx: any): AstNode {
  const badgeToken = ctx.Badge[0]
  const match = badgeToken.image.match(/badge\[([^\]]+)\]/)
  const text = match?.[1] || ''

  return {
    type: 'Badge',
    id: generateDeterministicId('badge', text),
    props: {
      text,
    },
    children: [],
  }
}
```

**Update AST Builder**:

```typescript
// packages/core/src/parser/ast-builder.ts
export class AstBuilder extends BaseCstVisitor {
  badgeElement(ctx: any): AstNode {
    return buildBadgeElement(ctx)
  }
}
```

**Builder Guidelines**:

- Extract data from token via regex
- Generate deterministic ID
- Return AstNode with type, id, props, children
- Handle missing/malformed data gracefully

#### 4. Add Type Definition

**File**: `packages/core/src/types/ast-node.ts`

```typescript
// Add to NodeType union
export type NodeType =
  | 'Screen'
  | 'Modal'
  // ... existing types
  | 'Badge'

// Add props interface
export interface BadgeProps {
  text: string
}

// Add to AstNode discriminated union
export type AstNode =
  | { type: 'Screen'; id: string; props: ViewProps; children: AstNode[] }
  // ... existing types
  | { type: 'Badge'; id: string; props: BadgeProps; children: AstNode[] }
```

#### 5. Create Renderer

**File**: `packages/core/src/renderer/nodes/<category>.node.ts`

```typescript
import { AstNode, BadgeProps } from '../../types/ast-node'
import { elementStyles } from './styles/styles'

export function renderBadge(node: AstNode): string {
  const { text } = node.props as BadgeProps

  const baseClasses =
    'inline-flex items-center px-2 py-1 rounded-md text-xs font-medium'
  const inlineStyles =
    'background-color: var(--primary); color: var(--primary-foreground);'

  return `<span class="${baseClasses}" style="${inlineStyles}">${text}</span>`
}
```

**Update Node Renderer**:

```typescript
// packages/core/src/renderer/core/node-renderer.ts
import { renderBadge } from '../nodes/primitives.node'

const RENDERERS: Record<NodeType, typeof _render> = {
  // ... existing renderers
  Badge: (n) => renderBadge(n),
}
```

**Renderer Guidelines**:

- Use base Tailwind classes for structure/spacing
- Use CSS variables for colors (never hardcoded)
- Use inline styles for color application
- Import styles from `./styles/styles.ts`
- Handle props safely with type assertions
- Return HTML string

#### 6. Update Exports

**File**: `packages/core/src/index.ts`

```typescript
// Ensure new token is exported
export { Badge } from './lexer/tokens/primitives.tokens'

// Types are automatically exported via discriminated union
```

#### 7. Test in Running App

- Add badge to example DSL
- Check preview renders correctly
- Verify CSS variables apply
- Test in different themes

**Example DSL**:

```dsl
screen BadgeDemo:
  container:
    # Badge Examples
    > Here is a badge[New] inline.
    > Multiple badge[Hot] items badge[Sale] work.
```

### 6.2 Modifying Existing Elements

**Example**: Adding icon support to existing button

#### 1. Update Token (if needed)

Usually existing token pattern already captures needed data.

#### 2. Update Builder

```typescript
// packages/core/src/parser/builders/primitives.builders.ts
export function buildButtonElement(ctx: any): AstNode {
  // ... existing extraction

  // NEW: Extract icon info
  const { iconBefore, iconAfter, iconOnly } = extractButtonIcons(label)

  return {
    type: 'Button',
    id: generateDeterministicId('button', label, action),
    props: {
      label,
      action,
      variant,
      size,
      iconBefore, // NEW
      iconAfter, // NEW
      iconOnly, // NEW
    },
    children: [],
  }
}
```

#### 3. Update Type

```typescript
// packages/core/src/types/ast-node.ts
export interface ButtonProps {
  label: string
  action: string
  variant?: string
  size?: string
  iconBefore?: string // NEW
  iconAfter?: string // NEW
  iconOnly?: boolean // NEW
}
```

#### 4. Update Renderer

```typescript
// packages/core/src/renderer/nodes/primitives.node.ts
export function renderButton(node: AstNode): string {
  const { label, action, variant, size, iconBefore, iconAfter, iconOnly } =
    node.props as ButtonProps

  // NEW: Handle icons
  const iconBeforeHtml = iconBefore ? `<i data-lucide="${iconBefore}"></i>` : ''
  const iconAfterHtml = iconAfter ? `<i data-lucide="${iconAfter}"></i>` : ''

  const content = iconOnly
    ? iconBeforeHtml
    : `${iconBeforeHtml}${label}${iconAfterHtml}`

  // ... rest of rendering
}
```

### 6.3 Debugging Workflow

#### Lexer Debugging

```typescript
import { lexer } from '@proto-typed/core'

const input = '@secondary-lg[Click](action)'
const result = lexer.tokenize(input)

console.log(
  'Tokens:',
  result.tokens.map((t) => ({
    type: t.tokenType.name,
    image: t.image,
    startLine: t.startLine,
    startColumn: t.startColumn,
  }))
)

console.log('Errors:', result.errors)
```

#### Parser Debugging

```typescript
import { parser, lexer } from '@proto-typed/core'

const input = 'screen Home:'
const tokens = lexer.tokenize(input)
parser.input = tokens.tokens

const cst = parser.program()

console.log('CST:', JSON.stringify(cst, null, 2))
console.log('Parser Errors:', parser.errors)
```

#### AST Debugging

```typescript
import { parseAndBuildAst } from '@proto-typed/core'

const result = parseAndBuildAst(`
screen Home:
  container:
    @[Click](Next)
`)

console.log('AST:', JSON.stringify(result.ast, null, 2))
console.log('Errors:', result.errors)
```

#### Renderer Debugging

```typescript
import { parseAndBuildAst, astToHtmlStringPreview } from '@proto-typed/core'

const { ast } = parseAndBuildAst(dsl)
const html = astToHtmlStringPreview(ast)

console.log('HTML Output:', html)

// Check specific node rendering
import { renderButton } from '@proto-typed/core'
const buttonNode = {
  type: 'Button',
  props: { label: 'Test', action: 'test' },
  children: [],
}
console.log('Button HTML:', renderButton(buttonNode))
```

#### Route Debugging

```typescript
import { routeManager, parseAndBuildAst } from '@proto-typed/core'

const { ast } = parseAndBuildAst(dsl)
const routes = routeManager.processRoutes(ast)

console.log('Screens:', Array.from(routes.screens.keys()))
console.log('Modals:', routeManager.getRoutesByType('modal'))
console.log('Current Screen:', routes.currentScreen)

// Test navigation
routeManager.navigate('Profile')
console.log('After navigation:', routes.currentScreen)
```

### 6.4 Common Development Tasks

#### Task: Add New Button Variant

**1. Update Token** (if needed - existing pattern may already match)

**2. Update Builder**:

```typescript
// packages/core/src/parser/builders/primitives.builders.ts
function extractButtonVariant(ctx: any): string | undefined {
  if (ctx.ButtonInfo) return 'info' // NEW
  if (ctx.ButtonPrimary) return 'primary'
  // ... rest
}
```

**3. Update Renderer**:

```typescript
// packages/core/src/renderer/nodes/primitives.node.ts
function getButtonInlineStyles(variant?: string): string {
  switch (variant) {
    case 'info': // NEW
      return 'background-color: var(--accent); color: var(--accent-foreground);'
    case 'primary':
      return 'background-color: var(--primary); color: var(--primary-foreground);'
    // ... rest
  }
}
```

**4. Test**:

```dsl
screen Test:
  @info[Info Button](action)
```

#### Task: Add New Layout Preset

**1. Add Token**:

```typescript
// packages/core/src/lexer/tokens/layouts.tokens.ts
export const StackWide = createToken({
  name: 'StackWide',
  pattern: /stack-wide:/,
  longer_alt: Stack,
})
```

**2. Update Parser**:

```typescript
// Add to layoutElement OR alternatives
{
  ALT: () => this.CONSUME(StackWide)
}
```

**3. Update Builder**:

```typescript
// packages/core/src/parser/builders/layouts.builders.ts
export function buildLayoutElement(ctx: any): AstNode {
  let layoutType = 'container'

  if (ctx.StackWide) layoutType = 'stack-wide' // NEW
  // ... rest
}
```

**4. Update Renderer**:

```typescript
// packages/core/src/renderer/nodes/layouts.node.ts
const LAYOUT_CLASSES: Record<string, string> = {
  'stack-wide': 'flex flex-col gap-12 max-w-6xl', // NEW
  // ... rest
}
```

**5. Test**:

```dsl
screen Test:
  stack-wide:
    card:
      # Content 1
    card:
      # Content 2
```

#### Task: Improve Error Messages

**1. Add Suggestion**:

```typescript
// packages/core/src/utils/suggestions.ts
export function suggestCorrection(
  token: string,
  validOptions: string[]
): string {
  // Levenshtein distance or fuzzy match
  const closest = findClosestMatch(token, validOptions)
  return `Did you mean '${closest}'?`
}
```

**2. Use in Builder**:

```typescript
// packages/core/src/parser/builders/views.builders.ts
export function buildScreenElement(ctx: any): AstNode {
  const name = extractIdentifier(ctx)

  if (!name) {
    ErrorBus.addError({
      type: 'builder',
      severity: 'error',
      message: 'Screen requires a name',
      suggestion: 'Use: screen ScreenName:', // NEW
      line: ctx.Screen[0].startLine,
    })
  }

  // ... rest
}
```

---

## 7. Troubleshooting

### 7.1 Common Issues

#### Token Not Matching

**Symptoms**:

- Token not found in lexer output
- Parser errors about unexpected token

**Diagnosis**:

```typescript
const result = lexer.tokenize('your-input-here')
console.log(
  'Tokens:',
  result.tokens.map((t) => t.tokenType.name)
)
```

**Solutions**:

1. Check regex pattern in token definition
2. Verify token order (longer patterns first)
3. Test pattern at regex101.com
4. Check for conflicting patterns

**Example Fix**:

```typescript
// ❌ WRONG: Pattern too greedy
pattern: /container.*/

// ✅ CORRECT: Specific pattern
pattern: /container:/

// ❌ WRONG: Order issue (shorter first)
export const layoutTokens = [
  Container, // container:
  ContainerNarrow, // container-narrow:
]

// ✅ CORRECT: Longer patterns first
export const layoutTokens = [
  ContainerNarrow, // container-narrow:
  Container, // container:
]
```

#### Parser Rule Not Executing

**Symptoms**:

- CST missing expected children
- Parser errors

**Diagnosis**:

```typescript
parser.input = tokens.tokens
const cst = parser.program()
console.log('CST:', cst)
console.log('Parser Errors:', parser.errors)
```

**Solutions**:

1. Check rule is referenced in parent rule
2. Verify token consumption order
3. Check OR alternatives include your rule
4. Ensure rule is added to parser class

**Example Fix**:

```typescript
// ❌ WRONG: Rule defined but not referenced
badgeElement = this.RULE('badgeElement', () => {
  this.CONSUME(Badge)
})

// primitiveElement doesn't include badgeElement

// ✅ CORRECT: Rule referenced in parent
primitiveElement = this.RULE('primitiveElement', () => {
  this.OR([
    { ALT: () => this.SUBRULE(this.buttonElement) },
    { ALT: () => this.SUBRULE(this.badgeElement) }, // Added
  ])
})
```

#### AST Node Missing Props

**Symptoms**:

- AST node has empty or wrong props
- Renderer receives incorrect data

**Diagnosis**:

```typescript
const { ast } = parseAndBuildAst(input)
console.log('AST:', JSON.stringify(ast, null, 2))
```

**Solutions**:

1. Check regex extraction in builder
2. Verify token image property
3. Handle undefined cases
4. Test regex with actual token images

**Example Fix**:

```typescript
// ❌ WRONG: Regex doesn't match token pattern
const match = token.image.match(/badge-(\w+)/) // Token is badge[text]

// ✅ CORRECT: Regex matches token pattern
const match = token.image.match(/badge\[([^\]]+)\]/)

// ❌ WRONG: No fallback for failed match
const text = match[1] // Can crash if match is null

// ✅ CORRECT: Safe extraction with fallback
const text = match?.[1] || ''
```

#### HTML Not Rendering

**Symptoms**:

- Blank output
- Missing elements in preview

**Diagnosis**:

```typescript
const html = astToHtmlStringPreview(ast)
console.log('HTML Length:', html.length)
console.log('HTML Sample:', html.substring(0, 500))
```

**Solutions**:

1. Check node is in RENDERERS map
2. Verify renderNode is called recursively
3. Check CSS classes are valid
4. Verify screen visibility logic

**Example Fix**:

```typescript
// ❌ WRONG: Forgot to add to RENDERERS
const RENDERERS: Record<NodeType, typeof _render> = {
  Button: (n) => renderButton(n),
  // Badge missing
}

// ✅ CORRECT: Added to RENDERERS
const RENDERERS: Record<NodeType, typeof _render> = {
  Button: (n) => renderButton(n),
  Badge: (n) => renderBadge(n),
}

// ❌ WRONG: Not rendering children
export function renderCard(node: AstNode): string {
  return `<div class="card"></div>` // Children ignored
}

// ✅ CORRECT: Render children
export function renderCard(node: AstNode, _render: RenderFunction): string {
  const childrenHtml = node.children.map((child) => _render(child)).join('')
  return `<div class="card">${childrenHtml}</div>`
}
```

#### Navigation Not Working

**Symptoms**:

- Clicks don't navigate
- Modal doesn't open
- Back button fails

**Diagnosis**:

```typescript
const routes = routeManager.getRoutes()
console.log('Screens:', Array.from(routes.screens.keys()))
console.log('Modals:', routeManager.getRoutesByType('modal'))
console.log('Current:', routes.currentScreen)

const context = routeManager.getRouteContext()
const info = navigationMediator.analyzeNavigationTarget('TargetName', context)
console.log('Navigation Info:', info)
```

**Solutions**:

1. Check screen/modal name matches exactly (case-sensitive)
2. Verify route is processed
3. Check navigation attributes in HTML
4. Ensure navigation script is included (document mode)

**Example Fix**:

```typescript
// ❌ WRONG: Case mismatch
screen Profile:
  ...

@[Go to profile](profile)  // 'profile' != 'Profile'

// ✅ CORRECT: Case matches
@[Go to Profile](Profile)

// ❌ WRONG: Modal not processed as global
const routes = routeManager.processRoutes(ast)
// Modal inside screen children, not at top level

// ✅ CORRECT: Modal at top level
modal Confirm:
  ...

screen Home:
  @[Open](Confirm)
```

#### Theme Colors Not Applied

**Symptoms**:

- Elements have no color
- Theme switching doesn't work

**Diagnosis**:

```typescript
const css = customPropertiesManager.generateAllCssVariables(true)
console.log('CSS Variables:', css)
```

**Solutions**:

1. Check CSS variables in HTML `<style>` tag
2. Verify element uses `var(--varname)`
3. Ensure theme is set before render
4. Check dark mode flag

**Example Fix**:

```typescript
// ❌ WRONG: Hardcoded color
style = 'background-color: blue;'

// ✅ CORRECT: CSS variable
style = 'background-color: var(--primary);'

// ❌ WRONG: Forgot to process styles config
const html = astToHtmlDocument(ast)

// ✅ CORRECT: Process styles before render
customPropertiesManager.reset()
customPropertiesManager.processStylesConfig(stylesNodes)
const html = astToHtmlDocument(ast)
```

### 7.2 Error Messages Reference

Common error messages and their solutions:

| Error                       | Cause                                      | Solution                                 |
| --------------------------- | ------------------------------------------ | ---------------------------------------- |
| `MismatchedTokenException`  | Expected token not found                   | Check DSL syntax, verify token pattern   |
| `NoViableAltException`      | No matching parser rule                    | Verify element syntax, check token order |
| `Screen requires a name`    | Missing identifier after `screen`          | Add name: `screen ScreenName:`           |
| `Unexpected indent`         | Indentation without parent                 | Fix indentation alignment                |
| `Component not found`       | ComponentInstance refs undefined component | Define component before using            |
| `Invalid navigation target` | Target doesn't match any screen/modal      | Check name spelling and case             |
| `Props count mismatch`      | More/less props than `%variables`          | Match prop count to component variables  |

### 7.3 Performance Tips

**For Large DSL Files**:

1. Use components to reduce duplication
2. Avoid deeply nested structures (> 10 levels)
3. Use list + component instead of manual repetition

**For Development**:

1. Use preview mode (faster than document export)
2. Test with minimal DSL first
3. Use browser DevTools for HTML inspection

**For Testing**:

1. Mock RouteManager for unit tests
2. Use fixtures for integration tests
3. Test renderers in isolation

---

## Appendix A: Complete Token Reference

### Core Tokens

- `Identifier` - `/[A-Z][a-zA-Z0-9]*/` - Screen/modal/component names
- `Colon` - `/:(?:\r?\n)?/` - Block delimiter

### View Tokens

- `Screen` - `/screen /` - Screen definition
- `Modal` - `/modal /` - Modal definition
- `Drawer` - `/drawer /` - Drawer definition

### Button Tokens

- `ButtonPrimary` - `/@primary/`
- `ButtonSecondary` - `/@secondary/`
- `ButtonOutline` - `/@outline/`
- `ButtonGhost` - `/@ghost/`
- `ButtonDestructive` - `/@destructive/`
- `ButtonLink` - `/@link/`
- `ButtonSuccess` - `/@success/`
- `ButtonWarning` - `/@warning/`
- `ButtonMarker` - `/@/` - Default button
- `ButtonSizeXs` - `/-xs/`
- `ButtonSizeSm` - `/-sm/`
- `ButtonSizeMd` - `/-md/`
- `ButtonSizeLg` - `/-lg/`
- `ButtonLabel` - `/\[([^\]]+)\]/` - Button text
- `ButtonAction` - `/\(([^)]+)\)/` - Button action

### Typography Tokens

- `Heading` - `/#{1,6} (.+)/` - H1-H6
- `Paragraph` - `/> (.+)/` - Paragraph
- `Text` - `/>> (.+)/` - Text
- `MutedText` - `/>>> (.+)/` - Muted text
- `Note` - `/\*> (.+)/` - Note
- `Quote` - `/"> (.+)/` - Quote

### Link & Image Tokens

- `Link` - `/#\[([^\]]+)\]\(([^)]+)\)/` - External link
- `Image` - `/!\[([^\]]*)\]\(([^)]+)\)/` - Image

### Layout Tokens (Canonical Presets)

- `Container` - `/container:/`
- `ContainerNarrow` - `/container-narrow:/`
- `ContainerWide` - `/container-wide:/`
- `ContainerFull` - `/container-full:/`
- `Stack` - `/stack:/`
- `StackTight` - `/stack-tight:/`
- `StackLoose` - `/stack-loose:/`
- `StackFlush` - `/stack-flush:/`
- `RowStart` - `/row:/`
- `RowCenter` - `/row-center:/`
- `RowBetween` - `/row-between:/`
- `RowEnd` - `/row-end:/`
- `Grid2` - `/grid-2:/`
- `Grid3` - `/grid-3:/`
- `Grid4` - `/grid-4:/`
- `GridAuto` - `/grid-auto:/`
- `Card` - `/card:/`
- `CardCompact` - `/card-compact:/`
- `CardFeature` - `/card-feature:/`
- `Header` - `/header:/`
- `Sidebar` - `/sidebar:/`

### Structure Tokens

- `List` - `/list(?:\s+\$[A-Z][a-zA-Z0-9]*)?:/` - List container
- `Navigator` - `/navigator:/` - Bottom nav
- `Fab` - `/fab:/` - Floating action button
- `UnorderedListItem` - `/- (.+)/` - List item
- `Separator` - `/---/` - Horizontal rule

### Input Tokens

- `Input` - `/___(?:email|password|date|number|textarea)?:([^{[|]+)(?:\{([^}]+)\})?(?:\[([^\]]+)\])?(?:\|(.+))?/` - Input field
- `Checkbox` - `/\[(X| )\] (.+)/` - Checkbox
- `RadioOption` - `/\((X| )\) (.+)/` - Radio button

### Component Tokens

- `Component` - `/component /` - Component definition
- `ComponentInstance` - `/\$([A-Z][a-zA-Z0-9]*)/` - Component usage

### Style Tokens

- `Styles` - `/styles:/` - Styles block
- `CssProperty` - `/--[a-zA-Z-]+:\s*[^;]+;/` - CSS property

---

## Appendix B: AST Node Type Reference

Complete list of AST node types with props:

```typescript
type NodeType =
  | 'Screen' // { name: string }
  | 'Modal' // { name: string }
  | 'Drawer' // { name: string }
  | 'Button' // { label, action, variant?, size?, iconBefore?, iconAfter?, iconOnly? }
  | 'Link' // { label, url }
  | 'Image' // { alt, src }
  | 'Heading' // { level: 1-6, text }
  | 'Paragraph' // { text }
  | 'Text' // { text }
  | 'MutedText' // { text }
  | 'Note' // { text }
  | 'Quote' // { text }
  | 'Layout' // { layoutType, modifier? }
  | 'List' // { componentName?, isComponentBased }
  | 'UnorderedListItem' // { text }
  | 'Navigator' // { items: NavigatorItem[] }
  | 'NavigatorItem' // { label, target }
  | 'Fab' // { items: FabItem[] }
  | 'Separator' // {}
  | 'Input' // { type, label, placeholder?, options?, attributes? }
  | 'Checkbox' // { checked, label }
  | 'RadioOption' // { selected, label }
  | 'Select' // { label, options }
  | 'Component' // { name }
  | 'ComponentInstance' // { name, values? }
  | 'PropVariable' // { name }
  | 'Styles' // { properties: CssProperty[] }
```

---

## Appendix C: Renderer Output Patterns

Common HTML output patterns for reference:

**Button**:

```html
<button
  class="inline-flex items-center justify-center px-4 py-2 rounded-md transition-colors"
  style="background-color: var(--primary); color: var(--primary-foreground);"
  data-nav="ScreenName"
  data-nav-type="internal"
>
  Click Me
</button>
```

**Screen**:

```html
<div id="screen-Home" class="screen-container" data-screen="Home">
  <!-- children -->
</div>
```

**Modal**:

```html
<div id="modal-Confirm" class="modal-overlay hidden" data-modal="Confirm">
  <div class="modal-content">
    <!-- children -->
  </div>
</div>
```

**Card**:

```html
<div
  class="rounded-lg p-6"
  style="background-color: var(--card); border: 1px solid var(--border);"
>
  <!-- children -->
</div>
```

**Input**:

```html
<div class="flex flex-col gap-2">
  <label class="text-sm font-medium" style="color: var(--foreground);">
    Email
  </label>
  <input
    type="email"
    placeholder="Enter email"
    class="px-3 py-2 rounded-md"
    style="background-color: var(--background); border: 1px solid var(--input); color: var(--foreground);"
  />
</div>
```

---

**End of LLM Context Document**

_For questions or clarifications, refer to the source code in `packages/core/src/` or the .mdx documentation files._
