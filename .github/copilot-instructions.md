# Proto-Typed DSL: LLM-Optimized Development Guide

## 🎯 Critical Context First

**BEFORE making ANY changes**: Read the actual implementation in `packages/core/src/` to understand current token patterns, parsing rules, and AST structures. This file is a GUIDE - the SOURCE OF TRUTH is the code.

### Technology Stack

- **Parse Pipeline**: Chevrotain (Lexer → Parser → AST Builder → Renderer)
- **Core**: TypeScript compiler library (pnpm workspace package)
- **Web Frontend**: Next.js 15 + React 19 + TypeScript
- **Editor**: Monaco Editor with custom DSL language registration
- **VSCode Extension**: Webview-based preview with message passing
- **Testing Philosophy**: Runtime validation over automated tests (philosophy over tooling)

### Monorepo Structure

```
proto-typed/
├── packages/
│   ├── core/              ← DSL compiler engine
│   │   └── src/
│   │       ├── lexer/tokens/        # Token definitions by category (9 files)
│   │       ├── parser/              # Grammar rules + CST
│   │       ├── parser/builders/     # CST → AST conversion (10 files)
│   │       ├── renderer/            # AST → HTML (3-tier architecture)
│   │       ├── themes/              # CSS variable system (shadcn-based)
│   │       ├── types/               # TypeScript type definitions
│   │       └── utils/               # Icon utils, ID generation, suggestions
│   ├── web/               ← Next.js web application
│   │   └── src/
│   │       ├── app/                 # Next.js 13+ App Router
│   │       ├── components/          # React UI components (editor, preview, docs)
│   │       ├── hooks/               # use-parse.ts (main parsing hook)
│   │       └── examples/            # Example DSL code
│   └── extension/         ← VSCode extension
│       ├── src/                     # Extension host code
│       │   ├── extension.ts         # Entry point
│       │   ├── messaging/           # Message router (host ↔ webview)
│       │   ├── panels/              # Webview panel management
│       │   └── language/            # IntelliSense completion provider
│       └── webview/                 # React webview app (uses @proto-typed/core)
└── .github/
    └── copilot-instructions.md      ← This file
```

### Package Dependencies

```
@proto-typed/core (compiler library)
  └─ chevrotain (lexer/parser), lucide (icons)

@web/app (Next.js playground)
  └─ @proto-typed/core
  └─ next, react, @monaco-editor/react, tailwindcss

@proto-typed/extension (VSCode)
  └─ @proto-typed/core
  └─ vscode API
  └─ Webview React app → @proto-typed/core
```

---

## 🏛️ Codebase Architecture Deep Dive

### Compiler Pipeline Overview

The DSL engine follows a classic compiler architecture with 5 distinct phases:

```
┌─────────────────────────────────────────────────────────────────┐
│  DSL Text Input                                                  │
│  "screen Home:\n  button-primary Click me"                       │
└─────────────────────────────────────────────────────────────────┘
                               ↓
┌─────────────────────────────────────────────────────────────────┐
│  PHASE 1: LEXER (packages/core/src/lexer/)                      │
│  tokenize(text: string)                                          │
│    ├─ Custom indentation matcher (matchIndentBase)              │
│    ├─ Regex-based token matching (precedence-ordered)           │
│    └─ Returns: { tokens: IToken[], errors: LexError[] }         │
└─────────────────────────────────────────────────────────────────┘
                               ↓
┌─────────────────────────────────────────────────────────────────┐
│  PHASE 2: PARSER (packages/core/src/parser/)                    │
│  parser.program()                                                │
│    ├─ OR([screen, modal, drawer, component, head, meta])        │
│    ├─ element() dispatcher for nested content                   │
│    ├─ Indent/Outdent-aware nesting                              │
│    └─ Returns: CST (Concrete Syntax Tree)                       │
└─────────────────────────────────────────────────────────────────┘
                               ↓
┌─────────────────────────────────────────────────────────────────┐
│  PHASE 3: AST BUILDER (packages/core/src/parser/builders/)      │
│  AstBuilder.visit(cst)                                           │
│    ├─ Delegates to builder functions by node type               │
│    ├─ Validates props (builder-validation.ts)                   │
│    ├─ Collects errors (non-throwing)                            │
│    └─ Returns: AstNode[] (partial tree even with errors)        │
└─────────────────────────────────────────────────────────────────┘
                               ↓
┌─────────────────────────────────────────────────────────────────┐
│  PHASE 4: ID GENERATION (packages/core/src/utils/)              │
│  generateDeterministicIds(ast, previousAst)                      │
│    ├─ Path-based stable ID generation                           │
│    ├─ Reuses IDs from previousAst for unchanged nodes           │
│    └─ Returns: AstNode[] with IDs filled (React key stability)  │
└─────────────────────────────────────────────────────────────────┘
                               ↓
┌─────────────────────────────────────────────────────────────────┐
│  PHASE 5: RENDERER (packages/core/src/renderer/)                │
│  astToHtmlDocument() or astToHtmlStringPreview()                 │
│    ├─ Route processing (screens, modals, drawers)               │
│    ├─ Theme processing (CSS variables)                          │
│    ├─ Node-by-node HTML generation (40+ renderers)              │
│    └─ Returns: HTML string (standalone or preview)              │
└─────────────────────────────────────────────────────────────────┘
```

### Token System Architecture (packages/core/src/lexer/tokens/)

**9 Category Files + 1 Index:**

| File | Tokens | Purpose |
|------|--------|---------|
| **core.tokens.ts** | WhiteSpace, NewLine, Colon, Identifier, Indent, Outdent | Fundamental language structure |
| **views.tokens.ts** | Screen, Modal, Drawer | Container views for UI |
| **primitives.tokens.ts** | Button variants, Text, Heading, Link, Image, Paragraph | Basic UI elements |
| **layouts.tokens.ts** | Container variants, Stack, Row, Grid, Card, Header, List, Navigator, Separator, Fab | Layout presets (30+ tokens) |
| **inputs.tokens.ts** | Input, RadioOption, Checkbox | Form controls |
| **components.tokens.ts** | Component, ComponentInstance, PropVariable | Component system |
| **head.tokens.ts** | Head, HeadColor, HeadFont, HeadTemplate, properties | Theme configuration |
| **meta.tokens.ts** | Meta, MetaVersion, MetaTitle, MetaValue | Document metadata |
| **index.ts** | allTokens array (exports) | Central export with **precedence ordering** |

**Critical Pattern: Token Precedence**

The `allTokens` array order determines matching priority:

```typescript
export const allTokens = [
  // 1. Structural tokens first
  NewLine, WhiteSpace, Indent, Outdent,

  // 2. Keywords before identifiers
  Screen, Modal, Drawer, Component,

  // 3. Specific button variants before generic ButtonMarker
  ButtonPrimary, ButtonSecondary, ButtonOutline, ..., ButtonMarker,

  // 4. RadioOption/Checkbox BEFORE Input (more specific patterns first)
  RadioOption, Checkbox, Input,

  // 5. Identifier before PropertyValue to avoid capturing component names
  Identifier, PropertyValue, MetaValue
]
```

**Why this matters:** If `Input` comes before `RadioOption`, radio patterns won't match correctly.

**Token Creation Pattern:**

```typescript
export const ButtonPrimary = createToken({
  name: 'ButtonPrimary',              // Parser reference name
  pattern: /button-primary|btn-primary/,  // Regex alternatives
  label: 'primary button',            // Error message display name
})
```

### Parser System Architecture (packages/core/src/parser/rules/)

**9 Rule Files Mirroring Token Structure:**

| File | Rules | Pattern |
|------|-------|---------|
| **core.rules.ts** | `program`, `element` dispatcher, helper methods | Top-level grammar + routing |
| **views.rules.ts** | `screen`, `modal`, `drawer` | View container parsing |
| **primitives.rules.ts** | `buttonElement`, `textElement`, `headingElement`, `linkElement`, `imageElement` | UI primitive parsing |
| **layouts.rules.ts** | `layoutElement`, `listElement`, `navigatorElement`, `fabElement`, `separatorElement` | Layout and structure parsing |
| **inputs.rules.ts** | `inputElement`, `radioElement`, `checkboxElement`, `selectElement` | Form control parsing |
| **components.rules.ts** | `componentDefinition`, `componentInstanceElement` | Component system parsing |
| **head.rules.ts** | `headBlock`, `headColorProperty`, `headFontProperty`, `headTemplateProperty` | Theme config parsing |
| **meta.rules.ts** | `metaBlock`, `metaVersionProperty`, `metaTitleProperty` | Metadata parsing |
| **index.ts** | Exports all rule definition functions | Central export |

**Key Pattern: Rule Definition Functions**

All rules use this pattern:

```typescript
export const defineViewRules: RuleDefinitionFunction = function(this: IParser): void {
  // 'this' is the parser instance
  this.RULE('screen', () => {
    this.CONSUME(Screen)
    this.CONSUME(Identifier, { LABEL: 'name' })
    this.CONSUME(Colon)
    this.OPTION(() => {
      this.SUBRULE(this.consumeIndentedElements)
    })
  })
}
```

**Critical Helper Methods (core.rules.ts):**

1. **`consumeIndentedElements()`** - Handles Python-like nesting:
   ```typescript
   this.CONSUME(Indent)
   this.MANY(() => this.SUBRULE(this.element))
   this.CONSUME(Outdent)
   ```

2. **`containerWithOptionalContent()`** - Parses layouts with optional children:
   ```typescript
   container:           # No children, self-closing
   container:           # With children
     text Hello
   ```

3. **`listWithOptionalContent()`** - Parses list structures:
   ```typescript
   list:
     - Item 1
     - Item 2
   ```

**Central Element Dispatcher:**

The `element` rule acts as a routing point for all nested content:

```typescript
this.RULE('element', () => {
  this.OR([
    { ALT: () => this.SUBRULE(this.componentInstanceElement) },
    { ALT: () => this.SUBRULE(this.buttonElement) },
    { ALT: () => this.SUBRULE(this.layoutElement) },
    { ALT: () => this.SUBRULE(this.textElement) },
    { ALT: () => this.SUBRULE(this.headingElement) },
    // ... 20+ alternatives
  ])
})
```

**Why this matters:** Adding a new element requires:
1. Token definition
2. Parser rule
3. Add to `element` dispatcher OR alternatives

### AST Builder System (packages/core/src/parser/builders/)

**10 Builder Files + 1 Validation:**

| File | Builders | Responsibility |
|------|----------|----------------|
| **core.builders.ts** | Utility functions | `parseLayoutModifiers`, `parseListItem`, `parseNavigatorItem` |
| **builder-validation.ts** | Validation helpers | `validateViewName`, `validatePropName`, error collection |
| **views.builders.ts** | `buildScreen`, `buildModal`, `buildDrawer` | View container CST → AST |
| **primitives.builders.ts** | `buildButtonElement`, `buildTextElement`, `buildHeadingElement`, etc. | UI primitive CST → AST |
| **layouts.builders.ts** | `buildLayoutElement`, `buildListElement`, etc. | Layout CST → AST |
| **inputs.builders.ts** | `buildInputElement`, `buildRadioElement`, `buildCheckboxElement` | Form control CST → AST |
| **components.builders.ts** | `buildComponentDefinition`, `buildComponentInstanceElement` | Component system CST → AST |
| **head.builders.ts** | `buildHeadBlock`, property builders | Theme config CST → AST |
| **meta.builders.ts** | `buildMetaBlock`, property builders | Metadata CST → AST |
| **index.ts** | Central exports | All builder functions |

**Builder Function Pattern:**

```typescript
export function buildScreen(ctx: CstContext, visitor: CstVisitor): AstNode {
  // 1. Extract tokens from CST context
  const nameToken = ctx.name?.[0] as IToken | undefined
  const name = nameToken?.image || ''

  // 2. Validate (collect errors, don't throw)
  if (!name.match(/^[A-Z][a-zA-Z0-9]*$/)) {
    visitor.__builderErrors?.push({
      stage: 'builder',
      severity: 'error',
      code: ERROR_CODES.BLD_INVALID_PROPS,
      message: `Screen name must start with uppercase letter`,
      line: nameToken?.startLine,
      column: nameToken?.startColumn
    })
  }

  // 3. Recursively visit children
  const children = ctx.element
    ? ctx.element.map((el) => visitor.visit(el as CstNode))
    : []

  // 4. Return AST node (ID filled later)
  return {
    type: 'Screen',
    id: '',  // generateDeterministicIds() fills this
    props: { name },
    children,
  }
}
```

**Critical Pattern: Error Collection Instead of Throwing**

Builders **never throw** - they collect errors in `visitor.__builderErrors`:

```typescript
// ❌ DON'T
if (invalid) throw new Error('Invalid!')

// ✅ DO
if (invalid) {
  visitor.__builderErrors?.push({
    stage: 'builder',
    severity: 'error',
    code: ERROR_CODES.BLD_INVALID_PROPS,
    message: 'Invalid prop value',
    line, column
  })
}
```

**Why this matters:** Live editors need to show all errors, not crash on the first one.

**Visitor Pattern Integration (ast-builder.ts):**

```typescript
class AstBuilder extends BaseUiDslCstVisitor {
  __builderErrors: ProtoError[] = []

  screen(ctx: Context) {
    return buildScreen(ctx, this)
  }

  buttonElement(ctx: Context) {
    return buildButtonElement(ctx, this)
  }

  // ... 30+ methods delegating to builder functions
}
```

### Type System Architecture (packages/core/src/types/)

**6 Type Definition Files:**

| File | Purpose | Key Types |
|------|---------|-----------|
| **ast-node.ts** | Core AST types | `NodeType` (union of 50+ types), `AstNode<P>`, props interfaces |
| **errors.ts** | Error system | `ProtoError` (discriminated union), `ERROR_CODES`, `Severity`, `Stage` |
| **routing.ts** | Route management | `ScreenRoute`, `GlobalRoute`, `RouteCollection`, `RouteMetadata` |
| **render.ts** | Renderer types | `RenderContext`, `RenderOptions`, `NodeRenderer` |
| **parser.ts** | Parser types | `IParser`, `CstContext`, `CstVisitor` |
| **dom.ts** | DOM event types | `MouseEvent` (browser event types) |

**Critical Type Pattern: Discriminated Unions**

```typescript
// NodeType union enables exhaustive checking
export type NodeType =
  | 'Screen' | 'Modal' | 'Drawer'
  | 'Button' | 'Link' | 'Image'
  | 'Layout' | 'List' | 'Navigator'
  // ... 50+ types

// Generic AstNode with typed props
export interface AstNode<P extends NodeProps = NodeProps> {
  type: NodeType
  id: string
  children: AstNode[]
  props: P
}

// Specific node interfaces
export interface ButtonNode extends AstNode<ButtonProps> {
  type: 'Button'
  props: ButtonProps
}
```

**Error Type Pattern (Discriminated by Stage):**

```typescript
export type ProtoError =
  | (ProtoErrorBase & { stage: 'lexer'; token?: string })
  | (ProtoErrorBase & { stage: 'parser'; rule?: string; unexpected?: string })
  | (ProtoErrorBase & { stage: 'builder'; builder?: string; nodeType?: string })
  | (ProtoErrorBase & { stage: 'renderer'; renderer?: string })
  | (ProtoErrorBase & { stage: 'editor'; action?: string })

// Type-safe access to stage-specific properties
if (error.stage === 'parser') {
  console.log(error.rule)  // TypeScript knows this exists
}
```

**Error Code Convention:**

```typescript
export const ERROR_CODES = {
  // Lexer errors (1000s)
  LEX_INVALID_TOKEN: 'PT-LEX-1001',
  LEX_UNEXPECTED_CHAR: 'PT-LEX-1002',

  // Parser errors (1000s)
  PARSE_SYNTAX_ERROR: 'PT-PARSE-1001',
  PARSE_UNEXPECTED_TOKEN: 'PT-PARSE-1002',

  // Builder errors (2000s)
  BLD_INVALID_PROPS: 'PT-BLD-2002',
  BLD_MISSING_REQUIRED: 'PT-BLD-2003',

  // Renderer errors (3000s)
  REND_GENERIC_ERROR: 'PT-REND-3001',
  REND_INVALID_NODE: 'PT-REND-3002',

  // Editor errors (4000s)
  EDIT_PARSE_FAILURE: 'PT-EDIT-4001',
}
```

**Why this matters:** Consistent error codes enable filtering, telemetry, documentation.

---

## 📋 DSL Syntax Reference (Current Implementation)

### Token Categories (see `src/core/lexer/tokens/`)

#### **Views** (`views.tokens.ts`)

```
screen ScreenName:
modal ModalName:
drawer DrawerName:
```

#### **Typography** (`primitives.tokens.ts`)

```
# to ###### → Heading (levels 1-6)
>           → Paragraph
>>          → Text
>>>         → MutedText
*>          → Note
">          → Quote
```

#### **Buttons** (`primitives.tokens.ts`)

Pattern: `@<variant>?-<size>?\[text\]\(action\)`

**Variants** (optional, defaults to primary):

- `@primary[Text]` → Primary (default)
- `@secondary[Text]` → Secondary
- `@outline[Text]` → Outline
- `@ghost[Text]` → Ghost
- `@destructive[Text]` → Destructive
- `@link[Text]` → Link
- `@success[Text]` → Success
- `@warning[Text]` → Warning

**Sizes** (optional, defaults to md):

- `-xs` → Extra Small
- `-sm` → Small
- `-md` → Medium (default)
- `-lg` → Large

**Examples**:

```
@[Click Me](action)              → Primary, medium
@secondary-lg[Submit](submit)    → Secondary, large
@outline-sm[Cancel](close)       → Outline, small
@destructive[Delete](delete)     → Destructive, medium
```

#### **Links & Images** (`primitives.tokens.ts`)

```
#[Link Text](destination)
![Alt Text](image-url)
```

#### **Layout Elements** (`layouts.tokens.ts`)

Canonical preset layouts with predefined Tailwind classes and shadcn styling.

**Containers**:

```
container:          → Standard container with max-width
container-narrow:   → Narrow container (sm max-width)
container-wide:     → Wide container (lg max-width)
container-full:     → Full-width container
```

**Stacks** (Vertical flow):

```
stack:              → Standard vertical stack (gap-4)
stack-tight:        → Tight vertical stack (gap-2)
stack-loose:        → Loose vertical stack (gap-8)
stack-flush:        → No gap vertical stack
```

**Rows** (Horizontal flow):

```
row:          → Row with items at start
row-center:         → Row with items centered
row-between:        → Row with space-between
row-end:            → Row with items at end
```

**Grids**:

```
grid-2:             → 2-column grid
grid-3:             → 3-column grid
grid-4:             → 4-column grid
grid-auto:          → Auto-fit grid
```

**Cards**:

```
card:               → Standard card with padding
card-compact:       → Compact card (less padding)
card-feature:       → Feature card (more prominent)
```

**Special**:

```
header:             → Page header layout
sidebar:            → Sidebar layout
list:               → List container
navigator:          → Bottom navigation bar
fab:                → Floating action button
```

**Separator**:

```
---                 → Horizontal separator
```

#### **Forms** (`inputs.tokens.ts`)

Pattern: `___<type>?: Label{placeholder}[options] | attributes`

**Input Types** (optional, defaults to text):

- `email`, `password`, `date`, `number`, `textarea`

**Format**:

```
___: Label{placeholder}                    → Text input
___email: Email{Enter email}               → Email input
___password: Password{Enter password}      → Password input
___date: Date{Select date}                 → Date picker
___number: Quantity{Enter number}          → Number input
___textarea: Message{Type message}         → Textarea
___: Country{Select}[USA | Canada | Mexico] → Select dropdown

[X] Checked checkbox label
[ ] Unchecked checkbox label
(X) Selected radio label
( ) Unselected radio label
```

**Attributes** (optional, pipe-separated):

```
___: Email{Enter email} | required placeholder="Email address"
```

#### **Components** (`components.tokens.ts`)

```
component UserCard:
  > Component content here
  > Use %propName for variables

$UserCard                           ← Simple instantiation
$UserCard:                          ← With props (see below)
  - Name | Email | Phone            ← Pipe-separated prop values

list $UserCard:                     ← Component-based list
  - John | john@email.com | 555-1234
  - Jane | jane@email.com | 555-5678
```

**Prop Variables**: Use `%propName` inside component to interpolate values

#### **Styles** (`styles.tokens.ts`)

```
styles:
  --primary-color: #3b82f6;
  --font-size: 16px;
```

---

## 🏗️ Renderer Architecture

### Design Philosophy: Layered Architecture with Clean Separation

The renderer follows a **3-tier layered architecture** with clear boundaries and responsibilities:

```
┌─────────────────────────────────────────────────────────────┐
│  Top-Level Adapters (Public API)                            │
│  • ast-to-html-document.ts   - Full HTML doc with CDN       │
│  • ast-to-html-string-preview.ts - Preview HTML for SPA     │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│  Infrastructure Layer (Services & Patterns)                  │
│  • route-manager-gateway.ts  - Facade for SPA clients       │
│  • navigation-mediator.ts    - Navigation analysis          │
│  • html-render-helper.ts     - Screen rendering utilities   │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│  Core Layer (Business Logic)                                │
│  • node-renderer.ts    - Central dispatcher (Strategy)      │
│  • route-manager.ts    - Navigation state & routes          │
│  • theme-manager.ts    - CSS variables & theming            │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│  Node Renderers (Pure Functions)                            │
│  • views.node.ts       - Screen, Modal, Drawer              │
│  • primitives.node.ts  - Button, Link, Text, Image          │
│  • layouts.node.ts     - Row, Col, Grid, Container          │
│  • structures.node.ts  - List, Card, Header, Navigator      │
│  • inputs.node.ts      - Input, Checkbox, Radio             │
│  • components.node.ts  - Component system                   │
└─────────────────────────────────────────────────────────────┘
```

### Core Layer Components

#### **node-renderer.ts** - Central Dispatcher

- **Pattern**: Strategy Pattern
- **Purpose**: Map `NodeType` to specialized renderer functions
- **Key Feature**: `RENDERERS` object with type-safe mapping

```typescript
const RENDERERS: Record<NodeType, typeof _render> = {
  Button: (n) => renderButton(n),
  Screen: (n) => renderScreen(n, _render),
  // ... 40+ node types
}
```

- **Usage**: Single entry point for all AST → HTML conversion
- **Extensibility**: Add new node type = add to RENDERERS map

#### **route-manager.ts** - Navigation State Management

- **Pattern**: Singleton Service
- **Responsibilities**:
  - Process AST nodes into `RouteCollection` (screens, modals, drawers, components)
  - Maintain navigation history with back/forward support
  - Detect screen structure changes and reset history appropriately
  - Provide route metadata and context for rendering
- **Key Methods**:
  - `processRoutes(ast, options)` - Organize nodes by type
  - `findNodesByType(nodes, type)` - Recursive AST traversal
  - `navigate(target)` / `goBack()` - Navigation operations
  - `createRenderContext(mode, options)` - Context for rendering pipeline
- **State Management**: Tracks `currentScreen`, `navigationHistory`, `currentHistoryIndex`

#### **theme-manager.ts** - CSS Variable System

- **Pattern**: Singleton Service (`CustomPropertiesManager`)
- **Responsibilities**:
  - Merge theme CSS variables with user-defined custom properties
  - Process `styles:` blocks from DSL
  - Generate complete CSS variable declarations
- **Key Methods**:
  - `processStylesConfig(stylesNodes)` - Extract custom properties from AST
  - `generateAllCssVariables(isDark)` - Combine theme + custom variables
  - `setExternalTheme(themeName)` - UI theme selector integration
- **Flow**: External theme (UI) + DSL styles (`styles:`) = Complete CSS

### Infrastructure Layer Components

#### **route-manager-gateway.ts** - Facade Pattern

- **Purpose**: Simplify RouteManager API for SPA clients
- **Benefits**:
  - Clean, focused API for React components
  - Hides internal complexity of RouteManager
  - Manages event handlers for navigation
- **Key APIs**:
  - `initialize(ast, options)` - Setup route system
  - `getRouteMetadata()` - Get all route info
  - `navigateTo(target)` / `goBack()` - Navigation controls
  - `createNavigationClickHandler()` - React event handler factory
- **Pattern**: Gateway shields clients from RouteManager internals

#### **navigation-mediator.ts** - Navigation Analysis

- **Pattern**: Mediator Pattern
- **Purpose**: Decouple navigation logic from node renderers
- **Key Responsibilities**:
  - Analyze navigation targets to determine type (internal/external/action/toggle/back)
  - Generate appropriate HTML attributes (`href`, `data-nav`, `data-nav-type`)
  - Support modal/drawer toggle actions
- **Key Methods**:
  - `analyzeNavigationTarget(target, routes)` → `{ type, value, isValid }`
  - `generateHrefAttribute(target)` → `href="..."` string
  - `generateNavigationAttributes(target)` → data attributes object
- **Navigation Types**:
  - `internal` - Screen navigation (`#ScreenName`)
  - `external` - URLs with `://``
  - `action` - JavaScript calls (contains `()` or `.`)
  - `toggle` - Modal/Drawer activation (matches modal/drawer names)
  - `back` - History back (`-1`)

#### **html-render-helper.ts** - Screen Rendering Utilities

- **Purpose**: Shared screen rendering logic
- **Key Functions**:
  - `renderAllScreens(screens, currentScreen)` - Preview mode rendering
  - `renderScreenForDocument(screen, index, currentScreen)` - Document export
  - `renderGlobalElements(routeManager)` - Modals/Drawers rendering
  - `generateLayoutClasses(screen)` - Detect header/navigator/Fab presence
- **Pattern**: Utility functions used by top-level adapters

### Node Renderers Layer

**Pure Functions** that convert AST nodes to HTML strings:

- **views.node.ts**: Screen, Modal, Drawer with visibility management
- **primitives.node.ts**: Button (with icon support), Link, Image, Heading, Text/Paragraph
- **layouts.node.ts**: Row, Col, Grid, Container with modifier parsing
- **structures.node.ts**: List, Card, Header, Navigator, Fab, Separator
- **inputs.node.ts**: Input (text/password/select), Checkbox, Radio
- **components.node.ts**: Component definition storage and instantiation

**Key Characteristics**:

- Import infrastructure services (NavigationMediator, styles)
- No direct state mutation
- Recursive rendering via `_render` callback
- Apply Tailwind classes + inline styles

### Top-Level Adapters

#### **ast-to-html-document.ts**

- **Purpose**: Generate standalone HTML document
- **Includes**:
  - Full `<!DOCTYPE html>` structure
  - Tailwind CDN + plugins (forms, typography)
  - Lucide icons CDN
  - Navigation JavaScript with event delegation
  - CSS variables in `<style>` tag
- **Flow**:
  1. Reset `customPropertiesManager`
  2. Process styles config
  3. Process routes via `routeManager`
  4. Set route context
  5. Render screens + global elements
  6. Generate navigation script
  7. Clear route context
- **Use Case**: Export prototype as downloadable HTML

#### **ast-to-html-string-preview.ts**

- **Purpose**: Generate HTML fragment for SPA embedding
- **Differences from Document**:
  - No `<html>` wrapper (just content divs)
  - No CDN includes (SPA already has them)
  - Returns preview HTML string for React iframe/preview
- **Use Case**: Real-time preview in editor

### Key Design Patterns Summary

| Pattern             | Component                                 | Purpose                     |
| ------------------- | ----------------------------------------- | --------------------------- |
| **Strategy**        | `node-renderer.ts`                        | Map node types to renderers |
| **Singleton**       | `routeManager`, `customPropertiesManager` | Global state management     |
| **Facade/Gateway**  | `route-manager-gateway.ts`                | Simplify API for clients    |
| **Mediator**        | `navigation-mediator.ts`                  | Decouple navigation logic   |
| **Template Method** | Render pipeline                           | Consistent render flow      |
| **Pure Functions**  | Node renderers                            | Predictable HTML generation |

### Critical Rendering Flow

```
1. AST Input
   ↓
2. customPropertiesManager.reset()
   ↓
3. customPropertiesManager.processStylesConfig(stylesNodes)
   ↓
4. routeManager.processRoutes(ast, options)
   ↓
5. routeManager.setRouteContext()
   ↓
6. Render screens via node-renderer.ts
   ↓
7. Render global elements (modals/drawers)
   ↓
8. Generate navigation script (document) or return HTML (preview)
   ↓
9. routeManager.clearRouteContext()
   ↓
10. Return HTML string
```

### When Modifying Renderer Code

1. **Adding New Node Type**:
   - Add renderer function in appropriate `nodes/*.node.ts`
   - Add to `RENDERERS` map in `node-renderer.ts`
   - Use `NavigationMediator` for any navigation attributes
   - Import styles from `nodes/styles/styles.ts`

2. **Changing Navigation Behavior**:
   - Modify `navigation-mediator.ts` for target analysis
   - Update `route-manager.ts` for state management
   - Update navigation script in `ast-to-html-document.ts`

3. **Adding Layout Modifiers**:
   - Update modifier parsing in `parser/builders/layouts.builders.ts`
   - Apply modifiers in `renderer/nodes/layouts.node.ts`
   - Use Tailwind classes + inline styles

4. **Theming Changes**:
   - Update `themes/theme-definitions.ts` for theme variables
   - Use `customPropertiesManager` for DSL `styles:` blocks
   - Ensure dark mode compatibility (no light colors)

---

## 🌐 Web Application Architecture (packages/web/)

### Next.js App Structure

The web package provides the online playground at https://ricardoadorno.github.io/proto-typed/

```
packages/web/src/
├── app/                              # Next.js 13+ App Router
│   ├── [lang]/                       # i18n routes (en, pt)
│   │   ├── page.tsx                 # Home (redirects to /playground)
│   │   ├── playground/
│   │   │   └── page.tsx            # Main playground page
│   │   ├── docs/
│   │   │   ├── [slug]/page.tsx     # Dynamic doc pages (MDX)
│   │   │   └── layout.tsx          # Docs layout with sidebar
│   │   ├── changelog/
│   │   ├── principles/
│   │   └── known-errors/
│   ├── layout.tsx                   # Root layout (theme provider)
│   ├── globals.css                  # Global styles + CSS variables
│   └── page.tsx                     # Root redirect
├── components/
│   ├── editor/
│   │   └── dsl-editor.tsx          # Monaco editor wrapper
│   ├── ui/                          # shadcn/ui components
│   │   ├── editor-panel.tsx        # Editor panel with toolbar
│   │   ├── preview-panel.tsx       # Preview with device frames
│   │   ├── preview-device.tsx      # Mobile/tablet/desktop frames
│   │   ├── ast-modal.tsx           # AST visualization modal
│   │   └── ... (30+ UI components)
│   ├── docs/                        # Documentation components
│   │   ├── docs-code-preview.tsx   # Live DSL preview in docs
│   │   ├── docs-sidebar.tsx        # Sidebar navigation
│   │   ├── docs-toc.tsx            # Table of contents
│   │   └── mdx-components.tsx      # Custom MDX components
│   └── layouts/
│       ├── docs-layout.tsx         # Docs page layout
│       └── components/
│           ├── docs-header.tsx
│           └── docs-footer.tsx
├── hooks/
│   ├── use-parse.ts                # 🔥 MAIN PARSING HOOK
│   ├── use-navigation.ts           # Navigation state management
│   ├── use-theme.ts                # Theme switching
│   └── ... (utility hooks)
├── lib/
│   ├── get-dictionary.ts           # i18n dictionary loader
│   └── ... (utilities)
└── examples/
    └── index.ts                     # Example DSL snippets
```

### Key React Components

#### **1. Playground Page (`app/[lang]/playground/page.tsx`)**

Main interactive editor with three-panel layout:

```typescript
export default function PlaygroundPage() {
  const [input, setInput] = useState(initialExample)
  const [currentScreen, setCurrentScreen] = useState<string | null>(null)

  // Main parsing hook orchestrates the entire pipeline
  const {
    ast,
    renderedHtml,
    errors,
    metadata,
    handleParse,
    navigateToScreen,
    createClickHandler
  } = useParse({ currentScreen })

  // Debounced parsing (300ms)
  useEffect(() => {
    const timer = setTimeout(() => handleParse(input), 300)
    return () => clearTimeout(timer)
  }, [input])

  return (
    <div className="grid grid-cols-2 gap-4">
      <EditorPanel value={input} onChange={setInput} errors={errors} />
      <PreviewPanel html={renderedHtml} onClick={createClickHandler()} />
      <MetadataPanel ast={ast} errors={errors} metadata={metadata} />
    </div>
  )
}
```

#### **2. `use-parse.ts` - Central Parsing Hook** 🔥

This is the **heart of the web application** - orchestrates the entire DSL pipeline:

```typescript
export function useParse(options?: { currentScreen?: string }) {
  const [ast, setAst] = useState<AstNode[]>([])
  const [renderedHtml, setRenderedHtml] = useState('')
  const [errors, setErrors] = useState<ProtoError[]>([])
  const [metadata, setMetadata] = useState<RouteMetadata>({})
  const [previousAst, setPreviousAst] = useState<AstNode[]>([])

  const handleParse = useCallback((text: string) => {
    try {
      // PHASE 1-4: Lexer → Parser → AST Builder → ID Generation
      const astWithErrors = parseAndBuildAst(text, previousAst)

      // Store for next parse (ID reuse)
      setPreviousAst(astWithErrors)

      // PHASE 5: Render AST to HTML
      const html = astToHtmlStringPreview(astWithErrors, {
        currentScreen: options?.currentScreen
      })

      // Extract route metadata
      const routeMetadata = routeManagerGateway.getRouteMetadata()

      // Update state
      setAst(astWithErrors)
      setRenderedHtml(html)
      setErrors(astWithErrors.__errors || [])
      setMetadata(routeMetadata)

    } catch (error) {
      // Graceful degradation - show error in UI
      setErrors([{
        stage: 'editor',
        severity: 'fatal',
        code: ERROR_CODES.EDIT_PARSE_FAILURE,
        message: error.message
      }])
    }
  }, [previousAst, options?.currentScreen])

  const navigateToScreen = useCallback((screen: string) => {
    routeManagerGateway.navigateTo(screen)
    handleParse(/* re-render with new currentScreen */)
  }, [handleParse])

  const createClickHandler = useCallback(() => {
    return routeManagerGateway.createNavigationClickHandler((screen) => {
      navigateToScreen(screen)
    })
  }, [navigateToScreen])

  return {
    ast,
    renderedHtml,
    errors,
    metadata,
    handleParse,
    navigateToScreen,
    createClickHandler
  }
}
```

**Why this matters:**
- Single source of truth for parsing state
- Handles debouncing, error recovery, ID reuse
- Integrates route manager for navigation
- Used by both playground and docs code previews

#### **3. Monaco Editor Integration (`components/editor/dsl-editor.tsx`)**

Custom Monaco editor with DSL language registration:

```typescript
import Editor from '@monaco-editor/react'
import { registerProtoTypedLanguage } from '@proto-typed/core/editor'

export function DSLEditor({ value, onChange, errors }: DSLEditorProps) {
  const handleEditorWillMount = useCallback((monaco: Monaco) => {
    // Register custom DSL language
    registerProtoTypedLanguage(monaco)

    // Configure language features
    monaco.languages.setLanguageConfiguration('proto-typed', {
      comments: { lineComment: '//' },
      brackets: [['(', ')'], ['[', ']']],
      autoClosingPairs: [
        { open: '[', close: ']' },
        { open: '(', close: ')' },
      ]
    })

    // Register completion provider
    monaco.languages.registerCompletionItemProvider('proto-typed', {
      provideCompletionItems: (model, position) => {
        return {
          suggestions: [
            { label: 'screen', kind: monaco.languages.CompletionItemKind.Keyword },
            { label: 'button-primary', kind: monaco.languages.CompletionItemKind.Function },
            // ... 100+ suggestions
          ]
        }
      }
    })

    // Show errors as markers
    monaco.editor.setModelMarkers(model, 'proto-typed', errors.map(err => ({
      startLineNumber: err.line || 1,
      startColumn: err.column || 1,
      endLineNumber: err.line || 1,
      endColumn: err.column || 100,
      message: err.message,
      severity: err.severity === 'error'
        ? monaco.MarkerSeverity.Error
        : monaco.MarkerSeverity.Warning
    })))
  }, [errors])

  return (
    <Editor
      language="proto-typed"
      theme="vs-dark"
      value={value}
      onChange={onChange}
      beforeMount={handleEditorWillMount}
      options={{
        minimap: { enabled: false },
        fontSize: 14,
        lineNumbers: 'on',
        roundedSelection: false,
        scrollBeyondLastLine: false,
        automaticLayout: true
      }}
    />
  )
}
```

#### **4. Preview Panel with Device Frames (`components/ui/preview-panel.tsx`)**

Shows rendered HTML in device mockups:

```typescript
export function PreviewPanel({ html, onClick }: PreviewPanelProps) {
  const [device, setDevice] = useState<'mobile' | 'tablet' | 'desktop'>('mobile')
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    if (iframeRef.current) {
      const doc = iframeRef.current.contentDocument
      if (doc) {
        doc.open()
        doc.write(wrapHtmlForPreview(html))
        doc.close()
      }
    }
  }, [html])

  return (
    <div className="preview-panel">
      <div className="toolbar">
        <DeviceSelector value={device} onChange={setDevice} />
        <ExportButton onClick={() => exportDocument(html)} />
      </div>

      <PreviewDevice device={device}>
        <iframe
          ref={iframeRef}
          className="w-full h-full"
          sandbox="allow-scripts allow-same-origin"
        />
      </PreviewDevice>
    </div>
  )
}
```

#### **5. Docs Live Preview (`components/docs/docs-code-preview.tsx`)**

Embeds live DSL preview in MDX documentation:

```tsx
export function DocsCodePreview({ code }: { code: string }) {
  const { renderedHtml, errors } = useParse()

  useEffect(() => {
    handleParse(code)
  }, [code])

  return (
    <div className="docs-preview">
      <pre><code>{code}</code></pre>
      {errors.length === 0 ? (
        <div className="preview" dangerouslySetInnerHTML={{ __html: renderedHtml }} />
      ) : (
        <ErrorList errors={errors} />
      )}
    </div>
  )
}
```

### Web Application Data Flow

```
┌─────────────────────────────────────────────────────────────┐
│  User types in Monaco Editor                                │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│  onChange event → setInput(newValue)                        │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│  useEffect debounces (300ms) → handleParse(input)           │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│  use-parse.ts calls parseAndBuildAst(text, previousAst)    │
│    └─ Phases 1-4: Lexer → Parser → Builder → ID Gen        │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│  use-parse.ts calls astToHtmlStringPreview(ast)             │
│    └─ Phase 5: Renderer (route manager, theme manager)     │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│  React state updates:                                        │
│    - setAst(astWithErrors)                                   │
│    - setRenderedHtml(html)                                   │
│    - setErrors(ast.__errors)                                 │
│    - setMetadata(routeMetadata)                              │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│  React re-renders:                                           │
│    - EditorPanel shows errors as markers                     │
│    - PreviewPanel updates iframe with new HTML              │
│    - MetadataPanel shows AST/errors/routes                   │
└─────────────────────────────────────────────────────────────┘
```

### Web Application Key Patterns

**1. Debounced Parsing:**
```typescript
useEffect(() => {
  const timer = setTimeout(() => handleParse(input), 300)
  return () => clearTimeout(timer)
}, [input])
```

**2. Error Boundaries:**
```typescript
<ErrorBoundary fallback={<ErrorDisplay />}>
  <PlaygroundPage />
</ErrorBoundary>
```

**3. Iframe Sandboxing:**
```typescript
<iframe sandbox="allow-scripts allow-same-origin" />
```
Prevents preview code from accessing parent window.

**4. ID Reuse for React Performance:**
```typescript
const astWithErrors = parseAndBuildAst(text, previousAst)
setPreviousAst(astWithErrors)  // Next parse reuses IDs
```

**5. Route Manager Integration:**
```typescript
const createClickHandler = () => {
  return routeManagerGateway.createNavigationClickHandler((screen) => {
    navigateToScreen(screen)
  })
}
```

---

## 🔌 VSCode Extension Architecture (packages/extension/)

### Extension Structure

```
packages/extension/
├── src/                              # Extension host code
│   ├── extension.ts                 # 🔥 ENTRY POINT
│   ├── language/
│   │   └── completion.ts            # IntelliSense completion provider
│   ├── messaging/
│   │   ├── message-router.ts        # Host ↔ webview communication
│   │   └── message-types.ts         # Type-safe message definitions
│   ├── panels/
│   │   └── playground/
│   │       └── playground-panel.ts  # Webview panel management
│   ├── utils/
│   │   └── text-document-synchronizer.ts  # Editor → webview sync
│   └── test/                        # Extension tests (Mocha)
├── webview/                          # React webview app
│   ├── src/
│   │   ├── hooks/
│   │   │   ├── use-playground-state.ts  # Webview parsing state
│   │   │   ├── use-navigation.ts        # Navigation state
│   │   │   └── use-vscode-messaging.ts  # VSCode API wrapper
│   │   ├── messaging/
│   │   │   └── message-types.ts     # Shared with host
│   │   └── App.tsx                  # Webview React app
│   ├── index.html                   # Webview HTML template
│   ├── vite.config.ts               # Vite build config
│   └── package.json
├── syntaxes/
│   └── proto-typed.tmLanguage.json  # TextMate grammar
├── snippets/
│   └── snippets.json                # Code snippets
├── icons/                            # Extension icons
├── language-configuration.json       # Language config
└── package.json                     # Extension manifest
```

### Extension Host Code

#### **1. Extension Entry Point (`extension.ts`)** 🔥

```typescript
let messageRouter: MessageRouter | null = null
let synchronizer: TextDocumentSynchronizer | null = null
let currentPanel: PlaygroundPanel | null = null

export function activate(context: vscode.ExtensionContext) {
  console.log('proto-typed extension activated')

  // Initialize message router (type-safe host-webview communication)
  messageRouter = new MessageRouter({ logMessages: true })

  // Initialize text document synchronizer (300ms debounce)
  synchronizer = new TextDocumentSynchronizer({
    debounceMs: 300,
    filterLanguageIds: ['proto-typed'],  // Only .pty files
    logChanges: true
  })

  // Register IntelliSense completion provider
  context.subscriptions.push(
    vscode.languages.registerCompletionItemProvider(
      { language: 'proto-typed' },
      createCompletionProvider(),
      ':', '-', '@', '#', '_'  // Trigger characters
    )
  )

  // Register command: "Proto-Typed: Open Preview to the Side"
  context.subscriptions.push(
    vscode.commands.registerCommand('proto-typed.showPreview', () => {
      const columnToShowIn = vscode.window.activeTextEditor
        ? vscode.window.activeTextEditor.viewColumn! + 1
        : vscode.ViewColumn.Two

      if (currentPanel) {
        // Panel exists, just reveal it
        currentPanel.reveal(columnToShowIn)
      } else {
        // Create new panel
        currentPanel = PlaygroundPanel.create({
          extensionContext: context,
          messageRouter,
          synchronizer
        }, columnToShowIn)

        // Clear reference when panel is closed
        currentPanel.onDidDispose(() => {
          currentPanel = null
        })
      }
    })
  )
}

export function deactivate() {
  messageRouter = null
  synchronizer = null
  currentPanel = null
}
```

#### **2. Message Router (`messaging/message-router.ts`)**

Type-safe bidirectional communication:

```typescript
export class MessageRouter {
  private handlers = new Map<string, MessageHandler<any>>()
  private panel: vscode.WebviewPanel | null = null
  private options: MessageRouterOptions

  constructor(options: MessageRouterOptions = {}) {
    this.options = options
  }

  setPanel(panel: vscode.WebviewPanel) {
    this.panel = panel

    // Listen to messages from webview
    panel.webview.onDidReceiveMessage(
      (message: Message) => this.handleMessage(message),
      null,
      []
    )
  }

  registerHandler<T extends Message>(
    type: T['type'],
    handler: MessageHandler<T>
  ) {
    this.handlers.set(type, handler)
  }

  async handleMessage(message: Message) {
    if (this.options.logMessages) {
      console.log('[MessageRouter] Received:', message.type, message.payload)
    }

    const handler = this.handlers.get(message.type)
    if (handler) {
      await handler(message)
    } else {
      console.warn('[MessageRouter] No handler for:', message.type)
    }
  }

  sendToWebview<T extends Message>(message: T) {
    if (!this.panel) {
      console.error('[MessageRouter] No panel set')
      return
    }

    if (this.options.logMessages) {
      console.log('[MessageRouter] Sending:', message.type, message.payload)
    }

    this.panel.webview.postMessage(message)
  }
}
```

#### **3. Message Types (`messaging/message-types.ts`)**

Shared between host and webview:

```typescript
// Discriminated union for type-safe messages
export type Message =
  // Host → Webview
  | { type: 'TEXT_CHANGED'; payload: { text: string; changes: TextChange[] } }
  | { type: 'THEME_CHANGED'; payload: { theme: string } }
  | { type: 'EXPORT_COMPLETE'; payload: { success: boolean; path?: string } }

  // Webview → Host
  | { type: 'REQUEST_EXPORT'; payload: { html: string; suggestedFileName: string } }
  | { type: 'LOG_EVENT'; payload: { level: 'info' | 'warn' | 'error'; message: string } }
  | { type: 'NAVIGATION_UPDATE'; payload: { screen: string } }
  | { type: 'REQUEST_SET_TEXT'; payload: { text: string; reason: string } }

export type MessageHandler<T extends Message> = (message: T) => void | Promise<void>
```

#### **4. Text Document Synchronizer (`utils/text-document-synchronizer.ts`)**

Debounced editor-to-webview sync:

```typescript
export class TextDocumentSynchronizer {
  private messageRouter: MessageRouter
  private debounceMs: number
  private filterLanguageIds: string[]
  private timeout: NodeJS.Timeout | null = null

  constructor(options: SynchronizerOptions) {
    this.debounceMs = options.debounceMs || 300
    this.filterLanguageIds = options.filterLanguageIds || []

    // Listen to text document changes
    vscode.workspace.onDidChangeTextDocument(
      (event) => this.handleDocumentChange(event),
      null,
      []
    )

    // Listen to active editor changes
    vscode.window.onDidChangeActiveTextEditor(
      (editor) => this.handleEditorChange(editor),
      null,
      []
    )
  }

  setMessageRouter(router: MessageRouter) {
    this.messageRouter = router
  }

  private handleDocumentChange(event: vscode.TextDocumentChangeEvent) {
    // Filter by language ID
    if (!this.filterLanguageIds.includes(event.document.languageId)) {
      return
    }

    // Debounce changes
    if (this.timeout) {
      clearTimeout(this.timeout)
    }

    this.timeout = setTimeout(() => {
      this.messageRouter.sendToWebview({
        type: 'TEXT_CHANGED',
        payload: {
          text: event.document.getText(),
          changes: event.contentChanges.map(change => ({
            range: {
              start: { line: change.range.start.line, character: change.range.start.character },
              end: { line: change.range.end.line, character: change.range.end.character }
            },
            text: change.text
          }))
        }
      })
    }, this.debounceMs)
  }

  private handleEditorChange(editor: vscode.TextEditor | undefined) {
    if (!editor || !this.filterLanguageIds.includes(editor.document.languageId)) {
      return
    }

    // Send full text when switching editors
    this.messageRouter.sendToWebview({
      type: 'TEXT_CHANGED',
      payload: {
        text: editor.document.getText(),
        changes: []
      }
    })
  }
}
```

#### **5. IntelliSense Completion Provider (`language/completion.ts`)**

```typescript
export function createCompletionProvider(): vscode.Disposable {
  return vscode.languages.registerCompletionItemProvider(
    { language: 'proto-typed' },
    {
      provideCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position
      ): vscode.CompletionItem[] {
        const linePrefix = document.lineAt(position).text.substr(0, position.character)

        const completions: vscode.CompletionItem[] = []

        // View keywords
        completions.push(
          {
            label: 'screen',
            kind: vscode.CompletionItemKind.Keyword,
            detail: 'Create a new screen',
            insertText: new vscode.SnippetString('screen ${1:Name}:\n\t$0')
          },
          {
            label: 'modal',
            kind: vscode.CompletionItemKind.Keyword,
            detail: 'Create a modal',
            insertText: new vscode.SnippetString('modal ${1:Name}:\n\t$0')
          }
        )

        // Layout presets
        completions.push(
          { label: 'container:', kind: vscode.CompletionItemKind.Class },
          { label: 'container-narrow:', kind: vscode.CompletionItemKind.Class },
          { label: 'stack:', kind: vscode.CompletionItemKind.Class },
          { label: 'stack-tight:', kind: vscode.CompletionItemKind.Class },
          { label: 'row-center:', kind: vscode.CompletionItemKind.Class },
          // ... 30+ layout completions
        )

        // Button variants
        completions.push(
          { label: 'button-primary', kind: vscode.CompletionItemKind.Function },
          { label: 'button-secondary', kind: vscode.CompletionItemKind.Function },
          // ... button variants
        )

        return completions
      }
    },
    ':', '-', '@', '#', '_'  // Trigger characters
  )
}
```

### Webview React App

#### **6. Webview Playground State (`webview/src/hooks/use-playground-state.ts`)**

```typescript
export function usePlaygroundState() {
  const [input, setInput] = useState('')
  const { ast, renderedHtml, errors, metadata, handleParse } = useParse()
  const { sendMessage, registerHandler } = useVSCodeMessaging()

  // Listen to text changes from host
  useEffect(() => {
    registerHandler('TEXT_CHANGED', (message) => {
      setInput(message.payload.text)
    })

    registerHandler('THEME_CHANGED', (message) => {
      // Update theme
    })
  }, [registerHandler])

  // Parse when input changes
  useEffect(() => {
    handleParse(input)
  }, [input, handleParse])

  // Send export request to host
  const requestExport = useCallback(() => {
    sendMessage({
      type: 'REQUEST_EXPORT',
      payload: {
        html: renderedHtml,
        suggestedFileName: 'prototype.html'
      }
    })
  }, [renderedHtml, sendMessage])

  return {
    input,
    ast,
    renderedHtml,
    errors,
    metadata,
    requestExport
  }
}
```

#### **7. VSCode Messaging Hook (`webview/src/hooks/use-vscode-messaging.ts`)**

```typescript
// Acquire VSCode API (only available in webview context)
const vscode = acquireVsCodeApi()

export function useVSCodeMessaging() {
  const handlers = useRef(new Map<string, MessageHandler<any>>())

  // Listen to messages from host
  useEffect(() => {
    const messageHandler = (event: MessageEvent) => {
      const message = event.data as Message
      const handler = handlers.current.get(message.type)
      if (handler) {
        handler(message)
      }
    }

    window.addEventListener('message', messageHandler)
    return () => window.removeEventListener('message', messageHandler)
  }, [])

  const sendMessage = useCallback(<T extends Message>(message: T) => {
    vscode.postMessage(message)
  }, [])

  const registerHandler = useCallback(<T extends Message>(
    type: T['type'],
    handler: MessageHandler<T>
  ) => {
    handlers.current.set(type, handler)
  }, [])

  return { sendMessage, registerHandler }
}
```

### Extension Communication Flow

```
┌─────────────────────────────────────────────────────────────┐
│  User types in VSCode editor (.pty file)                    │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│  onDidChangeTextDocument event                               │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│  TextDocumentSynchronizer debounces (300ms)                  │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│  MessageRouter.sendToWebview({                               │
│    type: 'TEXT_CHANGED',                                     │
│    payload: { text: document.getText() }                     │
│  })                                                           │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│  Webview receives message via window.postMessage()           │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│  use-vscode-messaging.ts handler triggered                   │
│    → setInput(message.payload.text)                          │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│  useEffect → handleParse(input)                              │
│    → parseAndBuildAst() → astToHtmlStringPreview()           │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│  React re-renders webview with updated preview               │
└─────────────────────────────────────────────────────────────┘
```

### Extension Key Patterns

**1. Singleton Webview Panel:**
```typescript
if (currentPanel) {
  currentPanel.reveal()  // Show existing panel
} else {
  currentPanel = PlaygroundPanel.create(...)  // Create new panel
}
```

**2. Type-Safe Message Passing:**
```typescript
// Discriminated union ensures type safety
type Message =
  | { type: 'TEXT_CHANGED'; payload: { text: string } }
  | { type: 'REQUEST_EXPORT'; payload: { html: string } }

// Type-safe handler registration
messageRouter.registerHandler('TEXT_CHANGED', (msg) => {
  console.log(msg.payload.text)  // TypeScript knows this exists
})
```

**3. Debounced Synchronization:**
```typescript
setTimeout(() => {
  messageRouter.sendToWebview({ type: 'TEXT_CHANGED', payload: { text } })
}, 300)
```

**4. Webview State Persistence:**
```typescript
// VSCode API provides state persistence across reloads
const vscode = acquireVsCodeApi()
vscode.setState({ input: currentInput })

// Restore state on reload
const previousState = vscode.getState()
setInput(previousState?.input || '')
```

**5. Snippet Support:**
```json
// snippets/snippets.json
{
  "Screen with Container": {
    "prefix": "screen-container",
    "body": [
      "screen ${1:Name}:",
      "\tcontainer:",
      "\t\t${2:content}"
    ]
  }
}
```

---

## 🔧 Development Directives

### When Adding/Modifying DSL Elements

1. **Token** (`src/core/lexer/tokens/*.tokens.ts`):
   - Define regex pattern with Chevrotain's `createToken`
   - Use capturing groups `()` for extraction
   - Use non-capturing groups `(?:)` for optional parts
   - **NO StringLiteral token** - this DSL doesn't use it

2. **Parser Rule** (`src/core/parser/parser.ts`):
   - Add parsing rule using CstParser methods
   - Handle `Indent`/`Outdent` for nesting
   - Use helper methods for common patterns

3. **AST Builder** (`src/core/parser/builders/*.builders.ts`):
   - Extract data from CST context
   - Build AST node with `{ type, id, props, children }`
   - Parse inline modifiers (see `parseLayoutModifiers()`)

4. **Renderer** (`src/core/renderer/nodes/*.node.ts`):
   - Convert AST node to HTML string
   - Apply props as HTML attributes/classes
   - Support navigation actions

5. **Type Definitions** (`src/types/ast-node.ts`):
   - Add to `NodeType` union
   - Define props interface if needed

### Layout System

**IMPORTANT**: Layouts are now **canonical presets** - no inline modifiers or dynamic parsing.

Each layout token represents a complete, pre-configured layout with predefined Tailwind classes and shadcn styling. Instead of modifiers like `row-w50-center-p4`, you use semantic layout names like `row-center`, `stack-tight`, `container-narrow`.

**Migration Example**:

```typescript
// OLD (with modifiers - NO LONGER SUPPORTED)
row-w50-center-p4:
  content

// NEW (canonical presets)
row-center:
  content
```

**No parsing needed** - layout tokens map directly to predefined CSS classes in the renderer.

### Component Props System

**Data Flow**:

1. List with component: `list $UserCard:`
2. Items with pipe-separated values: `- John | john@email.com | 555-1234`
3. Props extracted and matched to component variables
4. `%name`, `%email`, `%phone` interpolated in component template

---

## 🎨 Styling System: shadcn-Inspired Architecture

### Design Philosophy

The styling system is based on **shadcn/ui** design patterns, using CSS custom properties (variables) for theming and Tailwind CSS for utility classes. This approach provides:

- **Theme flexibility**: Easy theme switching via CSS variables
- **Consistency**: All components reference the same color tokens
- **Customizability**: Users can override variables via `styles:` block
- **Dark mode by default**: All themes optimized for dark mode

### CSS Variables Structure (`themes/theme-definitions.ts`)

Based on shadcn's theming system with **OKLCH color space** for better perceptual uniformity:

```typescript
interface ThemeColors {
  // Core colors
  background
  foreground
  card
  cardForeground
  popover
  popoverForeground

  // Semantic colors
  primary
  primaryForeground
  secondary
  secondaryForeground
  muted
  mutedForeground
  accent
  accentForeground
  destructive
  destructiveForeground

  // UI elements
  border
  input
  ring

  // Charts
  chart1
  chart2
  chart3
  chart4
  chart5
}
```

**Available Themes**: neutral, stone, slate, gray, zinc, red, rose, orange, green, blue, yellow, violet

### Styling Implementation Pattern

#### 1. **Base Classes** (`nodes/styles/styles.ts`)

Define Tailwind utility classes WITHOUT colors:

```typescript
button: 'inline-flex items-center justify-center px-4 py-2 focus:outline-none focus:ring-2 transition-colors'
```

#### 2. **Inline Styles with CSS Variables**

Apply colors via inline styles referencing CSS variables:

```typescript
getButtonInlineStyles(variant): string {
  return `background-color: var(--primary); color: var(--primary-foreground); border-radius: var(--radius);`
}
```

#### 3. **Component Rendering**

Combine base classes + inline styles:

```typescript
<button class="${buttonClasses}" style="${getButtonInlineStyles(variant)}">
```

### shadcn Pattern Implementation

**DO** ✅:

```typescript
// Use CSS variable references
style="background-color: var(--primary); color: var(--primary-foreground);"

// Base classes without color
class="inline-flex items-center justify-center px-4 py-2 rounded-md"

// Semantic naming from shadcn
var(--card), var(--muted-foreground), var(--border), var(--ring)
```

**DON'T** ❌:

```typescript
// Hardcoded Tailwind color classes
class="bg-blue-500 text-white"

// Dark mode prefixes (not needed)
class="bg-gray-800 dark:bg-gray-900"

// Non-semantic color tokens
var(--blue-500), var(--gray-800)
```

### Tailwind + CSS Variables Integration

#### Element Style Pattern:

```typescript
// 1. Define base classes (structure + spacing)
const baseClasses = 'inline-flex items-center justify-center px-4 py-2 rounded-md transition-colors';

// 2. Generate inline styles (colors from CSS variables)
const inlineStyles = 'background-color: var(--primary); color: var(--primary-foreground);';

// 3. Render with both
<button class="${baseClasses}" style="${inlineStyles}">Click</button>
```

#### Common CSS Variable Patterns:

- **Buttons**: `var(--primary)`, `var(--secondary)`, `var(--destructive)`
- **Text**: `var(--foreground)`, `var(--muted-foreground)`
- **Backgrounds**: `var(--background)`, `var(--card)`, `var(--popover)`
- **Borders**: `var(--border)`, `var(--input)`
- **Interactive**: `var(--ring)`, `var(--accent)`
- **Radius**: `var(--radius)` for border-radius consistency

### Theme System Flow

1. **Theme Definition** (`theme-definitions.ts`):
   - Define OKLCH color values for light and dark modes
   - Export as Theme interface

2. **CSS Variable Generation**:
   - `generateThemeCssVariables(theme, isDark)` creates CSS variable declarations
   - Example: `--primary: oklch(0.922 0 0);`

3. **User Custom Properties** (`styles:` block):
   - User can override any variable: `--primary-color: #3b82f6;`
   - CustomPropertiesManager merges theme + user variables

4. **Component Rendering**:
   - Components reference variables: `var(--primary)`
   - Theme changes update all components automatically

### Adding New Styled Elements

When creating new DSL elements that need styling:

1. **Add base classes** to `elementStyles` in `nodes/styles/styles.ts`:

```typescript
newElement: 'flex items-center px-4 py-2 rounded-md transition-colors'
```

2. **Create inline style function**:

```typescript
export function getNewElementInlineStyles(): string {
  return 'background-color: var(--card); color: var(--card-foreground); border: 1px solid var(--border);'
}
```

3. **Use in renderer** (`nodes/*.node.ts`):

```typescript
import { elementStyles, getNewElementInlineStyles } from './styles/styles'

export function renderNewElement(node: AstNode): string {
  return `<div class="${elementStyles.newElement}" style="${getNewElementInlineStyles()}">${content}</div>`
}
```

### Code Style Mandates

#### Tailwind CSS

- **DARK MODE ONLY** - never use `dark:` prefix
- **NO hardcoded colors** - always use CSS variables
- Base classes: structure, spacing, typography
- Example: `flex items-center px-4 py-2 rounded-md` ✅
- Avoid: `bg-blue-500 text-white` ❌

#### CSS Variables

- **ALWAYS use semantic shadcn tokens**
- Primary: `var(--primary)`, `var(--primary-foreground)`
- Secondary: `var(--secondary)`, `var(--secondary-foreground)`
- Muted: `var(--muted)`, `var(--muted-foreground)`
- Destructive: `var(--destructive)`, `var(--destructive-foreground)`
- UI: `var(--border)`, `var(--input)`, `var(--ring)`, `var(--radius)`

#### TypeScript

- Use `interface` over `type` for objects
- Discriminated unions for AST nodes
- Explicit null handling

#### React

- Functional components only
- Error boundaries for parsing
- Debounced parsing for performance

---

## 🚨 Critical Rules

### DO NOT

- ❌ Create test files unless explicitly requested
- ❌ Reference StringLiteral token (doesn't exist)
- ❌ Use inline modifiers for layouts (use canonical presets instead)
- ❌ Use old button syntax with @ count and symbols
- ❌ Use light color Tailwind classes
- ❌ Make assumptions - check `src/core/` implementation first

### ALWAYS

- ✅ Read token implementation before modifying syntax
- ✅ Use canonical layout presets: `row-center`, `stack-tight`, `container-narrow`
- ✅ Use variant and size modifiers for buttons: `@secondary-lg[Text]`
- ✅ Use declarative input types: `___email:`, `___password:`, `___textarea:`
- ✅ Validate with running app, not tests
- ✅ Ask user for feedback on functionality

---

## 📖 Quick Syntax Examples

### Complete Screen Example

```
screen Dashboard:
  header:
    # Dashboard
    @ghost[Settings](Settings)

  container:
    row-between:
      card:
        ## User Stats
        > Total Users: 1,234
        @[View Details](Users)

      card:
        ## Revenue
        >>> Last updated: 5 mins ago
        @outline[Refresh](Refresh)

    list:
      - Recent activity item
      - Another update

  navigator:
    - Home | Dashboard
    - Users | Users
    - Settings | Settings

  fab:
    - + | CreateItem
```

### Component with Props Example

```
component ContactCard:
  card:
    # %name
    > Email: %email
    > Phone: %phone
    @secondary[Call](PhoneView)

screen Contacts:
  list $ContactCard:
    - John Doe | john@email.com | 555-1234
    - Jane Smith | jane@email.com | 555-5678
```

---

## 🔍 Debugging Workflow

1. **Check Token Pattern**: Does regex match intended syntax?
2. **Verify Parser Rule**: Is CST structure correct?
3. **Inspect AST**: Are props extracted properly?
4. **Test Renderer**: Does HTML output match expectations?
5. **Runtime Validation**: Does it work in the running app?

Use browser DevTools, not tests. Gather user feedback for validation.

---

**Remember**: This file guides you. The code in `src/core/` is the truth. When in doubt, read the implementation.
