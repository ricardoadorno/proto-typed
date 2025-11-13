# Proto-Typed: Architecture

## System Architecture

Proto-Typed follows a **layered compiler architecture** with clear separation of concerns. The system transforms DSL text into HTML through a series of well-defined stages.

## Repository Structure

```
proto-typed/
├── packages/
│   ├── core/           # DSL engine (lexer, parser, renderer)
│   ├── web/            # Next.js web playground
│   └── extension/      # VSCode extension
├── .github/            # CI/CD and copilot instructions
└── context/            # LLM context documentation
```

This is a **pnpm workspace monorepo** where each package has distinct responsibilities but shares common tooling.

## Core Package Architecture

The `@proto-typed/core` package is the heart of the system. It implements a classic compiler pipeline:

```
┌─────────────┐
│  DSL Text   │
└──────┬──────┘
       │
       v
┌─────────────┐
│   Lexer     │  (Tokenization)
└──────┬──────┘
       │
       v
┌─────────────┐
│   Tokens    │  (Token stream)
└──────┬──────┘
       │
       v
┌─────────────┐
│   Parser    │  (Syntax analysis)
└──────┬──────┘
       │
       v
┌─────────────┐
│     CST     │  (Concrete Syntax Tree)
└──────┬──────┘
       │
       v
┌─────────────┐
│ AST Builder │  (Semantic analysis)
└──────┬──────┘
       │
       v
┌─────────────┐
│     AST     │  (Abstract Syntax Tree)
└──────┬──────┘
       │
       v
┌─────────────┐
│  Renderer   │  (Code generation)
└──────┬──────┘
       │
       v
┌─────────────┐
│    HTML     │  (Output)
└─────────────┘
```

## Layer 1: Lexical Analysis (Lexer)

**Location**: `packages/core/src/lexer/`

**Responsibility**: Convert raw text into tokens

**Key Files**:
- `lexer.ts`: Main lexer using Chevrotain
- `tokens/`: Token definitions organized by category

**Token Categories**:
```
tokens/
├── views.tokens.ts         # screen, modal, drawer, component
├── primitives.tokens.ts    # buttons, links, images, text
├── layouts.tokens.ts       # container, stack, row, grid, card, etc.
├── inputs.tokens.ts        # input, checkbox, select, radio, textarea
├── components.tokens.ts    # Component instantiation ($ComponentName)
├── head.tokens.ts          # title, meta, favicon
└── meta.tokens.ts          # Indent, Outdent, Newline, etc.
```

**Special Tokens**:
- `Indent`/`Outdent`: Track indentation-based nesting (like Python)
- `Newline`: Significant whitespace
- `Colon`: Marks block start (e.g., `screen Home:`)

**Example Tokenization**:
```
Input:
screen Home:
  ## Welcome

Tokens:
[Screen, Identifier("Home"), Colon, Newline, Indent,
 Heading, StringContent("Welcome"), Newline, Outdent]
```

## Layer 2: Syntax Analysis (Parser)

**Location**: `packages/core/src/parser/`

**Responsibility**: Build Concrete Syntax Tree (CST) from tokens

**Key Files**:
- `parser.ts`: Main Chevrotain parser class
- `rules/`: Grammar rules organized by category

**Grammar Rule Categories**:
```
rules/
├── views.rules.ts          # screenRule, modalRule, drawerRule, componentRule
├── primitives.rules.ts     # buttonRule, linkRule, imageRule, textRule
├── layouts.rules.ts        # containerRule, stackRule, rowRule, etc.
├── inputs.rules.ts         # inputRule, checkboxRule, selectRule, etc.
├── components.rules.ts     # componentInstanceRule
├── head.rules.ts           # titleRule, metaRule, faviconRule
└── meta.rules.ts           # Generic rules for nesting, blocks
```

**Parsing Strategy**:
- **Top-down recursive descent** (LL(k) parser)
- **Indentation-sensitive**: Uses `Indent`/`Outdent` tokens for nesting
- **Context-free grammar**: Each rule is independent
- **Error recovery**: Chevrotain provides automatic error recovery

**Example CST** (simplified):
```javascript
{
  name: "screenRule",
  children: {
    Screen: [{ image: "screen" }],
    Identifier: [{ image: "Home" }],
    Colon: [{ image: ":" }],
    block: [{
      children: {
        Heading: [{ image: "##" }],
        StringContent: [{ image: "Welcome" }]
      }
    }]
  }
}
```

## Layer 3: Semantic Analysis (AST Builder)

**Location**: `packages/core/src/parser/builders/`

**Responsibility**: Convert CST to Abstract Syntax Tree (AST)

**Key Files**:
- `ast-builder.ts`: Main visitor that orchestrates CST traversal
- `*.builders.ts`: Builder functions for each node type

**Builder Categories**:
```
builders/
├── views.builders.ts       # buildScreen, buildModal, buildDrawer, buildComponent
├── primitives.builders.ts  # buildButton, buildLink, buildImage, buildText
├── layouts.builders.ts     # buildContainer, buildStack, buildRow, etc.
├── inputs.builders.ts      # buildInput, buildCheckbox, buildSelect, etc.
├── components.builders.ts  # buildComponentInstance
└── head.builders.ts        # buildTitle, buildMeta, buildFavicon
```

**AST Node Structure**:
Every AST node implements this interface:
```typescript
interface BaseNode {
  type: NodeType;           // Discriminated union type
  id: string;               // Unique identifier
  props: Record<string, any>; // Node-specific properties
  children: AstNode[];      // Nested nodes
}
```

**Example AST**:
```javascript
{
  type: "Screen",
  id: "screen-home-abc123",
  props: { name: "Home" },
  children: [
    {
      type: "Heading",
      id: "heading-xyz789",
      props: { level: 2, text: "Welcome" },
      children: []
    }
  ]
}
```

## Layer 4: Code Generation (Renderer)

**Location**: `packages/core/src/renderer/`

**Responsibility**: Transform AST into HTML

The renderer uses a **3-tier layered architecture**:

### Tier 1: Top-Level Adapters (Public API)

**Files**:
- `ast-to-html-document.ts`: Export to standalone HTML
- `ast-to-html-string-preview.ts`: Preview HTML fragment for SPA

**Purpose**: Provide different output formats for different contexts

**Example Output**:
```javascript
// Preview (SPA embedding)
astToHtmlStringPreview(ast) → '<div data-screen="Home">...</div>'

// Export (standalone document)
astToHtmlDocument(ast, theme) → '<!DOCTYPE html><html>...</html>'
```

### Tier 2: Infrastructure Layer (Services & Patterns)

**Files**:
- `route-manager-gateway.ts`: Simplified facade for React components
- `navigation-mediator.ts`: Analyzes navigation targets
- `html-render-helper.ts`: Shared rendering utilities

**Design Patterns**:
- **Facade/Gateway**: `route-manager-gateway.ts` simplifies RouteManager API
- **Mediator**: `navigation-mediator.ts` decouples navigation logic

### Tier 3: Core Layer (Business Logic)

**Files**:
- `core/node-renderer.ts`: Central dispatcher (Strategy pattern)
- `core/route-manager.ts`: Navigation state manager (Singleton)
- `core/theme-manager.ts`: CSS variable manager (Singleton)

**Node Renderer Strategy**:
```typescript
const RENDERERS: Record<NodeType, RenderFunction> = {
  Screen: (node) => renderScreen(node),
  Modal: (node) => renderModal(node),
  Button: (node) => renderButton(node),
  Container: (node) => renderContainer(node),
  // ... 40+ renderers
};

function render(node: AstNode): string {
  return RENDERERS[node.type](node);
}
```

### Node Renderers (Pure Functions)

**Location**: `packages/core/src/renderer/nodes/`

**Organization**:
```
nodes/
├── views.node.ts           # Screen, Modal, Drawer
├── primitives.node.ts      # Button, Link, Image, Heading, Text
├── layouts.node.ts         # Container, Stack, Row, Grid, Card
├── inputs.node.ts          # Input, Checkbox, Select, Radio, Textarea
├── components.node.ts      # Component definition & instantiation
└── head.node.ts            # Meta tags, title, favicon
```

**Characteristics**:
- **Pure functions**: No side effects, deterministic output
- **HTML generation**: Return HTML strings
- **Recursive rendering**: Call `render(child)` for nested nodes
- **Styling integration**: Use CSS variables + Tailwind classes

**Example Renderer**:
```typescript
export function renderButton(node: AstNode): string {
  const { variant = 'primary', size = 'md', text, target } = node.props;

  const classes = buttonStyles[variant][size]; // Tailwind classes
  const styles = getButtonInlineStyles(variant); // CSS variable styles
  const onclick = navigation-mediator.getOnClickHandler(target);

  return `<button class="${classes}" style="${styles}" onclick="${onclick}">${text}</button>`;
}
```

## State Management: RouteManager

**Location**: `packages/core/src/renderer/core/route-manager.ts`

**Pattern**: Singleton

**Responsibilities**:
1. **Route collection**: Store all screens, modals, drawers
2. **Component definitions**: Store reusable component templates
3. **Navigation state**: Track current screen, history
4. **Navigation logic**: Generate onclick handlers

**Key Methods**:
```typescript
class RouteManager {
  // Route registration
  addScreen(name: string, html: string): void
  addModal(name: string, html: string): void
  addDrawer(name: string, html: string): void

  // Component management
  storeComponentDefinition(name: string, node: AstNode): void
  getComponentDefinition(name: string): AstNode | undefined

  // Navigation
  navigateTo(screenName: string): void
  toggleModal(modalName: string): void
  goBack(): void

  // Script generation
  generateNavigationScript(): string
}
```

**Navigation Script**:
The RouteManager generates a JavaScript bundle that handles client-side navigation:
```javascript
// Injected into HTML
<script>
const screens = { Home: 'screen-home-id', Settings: 'screen-settings-id' };
const modals = { Confirm: 'modal-confirm-id' };

function navigateTo(screenName) {
  // Hide all screens
  // Show target screen
  // Update history
}

function toggleModal(modalName) {
  // Toggle modal visibility
}
</script>
```

## State Management: ThemeManager (CustomPropertiesManager)

**Location**: `packages/core/src/renderer/core/theme-manager.ts`

**Pattern**: Singleton

**Responsibilities**:
1. **Theme definitions**: Store 12 pre-defined themes
2. **Custom overrides**: Merge user `styles:` block
3. **CSS generation**: Output `:root {}` variable declarations

**Key Methods**:
```typescript
class CustomPropertiesManager {
  // Theme selection
  setTheme(themeName: string): void

  // Custom properties
  setCustomProperties(properties: Record<string, string>): void

  // CSS generation
  generateRootStyles(): string
}
```

**Output Example**:
```css
:root {
  --primary: oklch(0.7 0.15 220);
  --primary-foreground: oklch(0.95 0.02 220);
  --background: oklch(0.12 0.02 220);
  /* ... all CSS variables */
}
```

## Design Patterns Summary

| Pattern | Location | Purpose |
|---------|----------|---------|
| **Strategy** | `node-renderer.ts` | Map NodeType to renderer functions |
| **Singleton** | `route-manager.ts`, `theme-manager.ts` | Global state management |
| **Facade/Gateway** | `route-manager-gateway.ts` | Simplified API for React |
| **Mediator** | `navigation-mediator.ts` | Decouple navigation analysis |
| **Pure Functions** | `nodes/*.node.ts` | Deterministic HTML generation |
| **Visitor** | `ast-builder.ts` | Traverse CST and build AST |

## Data Flow Example

Let's trace how this DSL is processed:

```
screen Home:
  @[Click Me](Settings)
```

### Step 1: Lexer
```javascript
[
  { type: 'Screen', image: 'screen' },
  { type: 'Identifier', image: 'Home' },
  { type: 'Colon', image: ':' },
  { type: 'Newline', image: '\n' },
  { type: 'Indent', image: '  ' },
  { type: 'Button', image: '@[Click Me](Settings)' },
  { type: 'Newline', image: '\n' },
  { type: 'Outdent', image: '' }
]
```

### Step 2: Parser
```javascript
{
  name: 'screenRule',
  children: {
    Screen: [{ image: 'screen' }],
    Identifier: [{ image: 'Home' }],
    block: [{
      children: {
        Button: [{ image: '@[Click Me](Settings)' }]
      }
    }]
  }
}
```

### Step 3: AST Builder
```javascript
{
  type: 'Screen',
  id: 'screen-home-abc',
  props: { name: 'Home' },
  children: [
    {
      type: 'Button',
      id: 'button-xyz',
      props: {
        variant: 'primary',
        size: 'md',
        text: 'Click Me',
        target: 'Settings'
      },
      children: []
    }
  ]
}
```

### Step 4: Renderer
```html
<div id="screen-home-abc" data-screen="Home" class="screen">
  <button
    class="inline-flex items-center px-4 py-2 rounded-md"
    style="background-color: var(--primary); color: var(--primary-foreground);"
    onclick="navigateTo('Settings')"
  >
    Click Me
  </button>
</div>
```

## Package Dependencies

### Core Package
```
@proto-typed/core
├── chevrotain         # Parser generator
├── nanoid             # ID generation
└── (no runtime deps)  # Output is pure HTML + CSS + vanilla JS
```

### Web Package
```
@web/app
├── next               # Framework
├── react              # UI library
├── @monaco-editor/react  # Code editor
├── @radix-ui/*        # UI components
├── tailwindcss        # Styling
└── @proto-typed/core  # DSL engine
```

### Extension Package
```
@vscode/extension
├── vscode             # Extension API
└── @proto-typed/core  # DSL engine
```

## Build & Compilation

### Core Package
```bash
# TypeScript compilation
pnpm -F @proto-typed/core build

# Output: dist/ with ESM and CommonJS
```

### Web Package
```bash
# Next.js build
pnpm -F @web/app build

# Output: .next/ for static hosting
```

### Extension Package
```bash
# Compile all: extension + webview + core
pnpm compile

# Output: packages/extension/dist/
```

## Entry Points

### Core Package Exports
```typescript
// packages/core/src/index.ts
export { lexer } from './lexer/lexer';
export { parser } from './parser/parser';
export { astBuilder } from './parser/builders/ast-builder';
export { astToHtmlDocument } from './renderer/ast-to-html-document';
export { astToHtmlStringPreview } from './renderer/ast-to-html-string-preview';
export { themeDefinitions } from './themes/theme-definitions';
export type { AstNode, NodeType } from './types/ast-node';
```

### Web Package Entry
```typescript
// packages/web/app/page.tsx
import {
  lexer,
  parser,
  astBuilder,
  astToHtmlStringPreview
} from '@proto-typed/core';

// Real-time preview pipeline
const tokens = lexer.tokenize(dslText);
const cst = parser.parse(tokens);
const ast = astBuilder.visit(cst);
const html = astToHtmlStringPreview(ast);
```

### Extension Package Entry
```typescript
// packages/extension/src/extension.ts
import * as vscode from 'vscode';
import { PreviewPanel } from './webview/preview-panel';

export function activate(context: vscode.ExtensionContext) {
  const command = vscode.commands.registerCommand(
    'proto-typed.openPreview',
    () => PreviewPanel.createOrShow(context)
  );
  context.subscriptions.push(command);
}
```

## Critical Architecture Principles

1. **Separation of Concerns**: Each layer has a single responsibility
2. **Unidirectional Flow**: Data flows in one direction through the pipeline
3. **Pure Functions**: Renderers are deterministic and side-effect free
4. **Singleton State**: RouteManager and ThemeManager are global singletons
5. **Strategy Pattern**: Renderers are pluggable via the RENDERERS map
6. **Type Safety**: Full TypeScript coverage with strict mode
7. **No Runtime Dependencies**: Core output is pure HTML/CSS/JS
