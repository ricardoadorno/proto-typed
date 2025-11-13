# Proto-Typed: Rendering Pipeline

## Pipeline Overview

The rendering pipeline transforms DSL text into HTML through a series of well-defined stages. Each stage has a specific responsibility and clear boundaries.

```
┌─────────────────────────────────────────────────────────────┐
│                     DSL SOURCE TEXT                         │
│  "screen Home:\n  ## Welcome"                               │
└────────────────────┬────────────────────────────────────────┘
                     │
                     v
┌─────────────────────────────────────────────────────────────┐
│                   STAGE 1: LEXER                            │
│  Tokenizes text into tokens                                 │
│  [Screen, Identifier("Home"), Colon, Newline, Indent, ...]  │
└────────────────────┬────────────────────────────────────────┘
                     │
                     v
┌─────────────────────────────────────────────────────────────┐
│                   STAGE 2: PARSER                           │
│  Builds Concrete Syntax Tree (CST)                          │
│  { name: "screenRule", children: { ... } }                  │
└────────────────────┬────────────────────────────────────────┘
                     │
                     v
┌─────────────────────────────────────────────────────────────┐
│                 STAGE 3: AST BUILDER                        │
│  Converts CST to Abstract Syntax Tree                       │
│  { type: "Screen", props: { name: "Home" }, children: [...]}│
└────────────────────┬────────────────────────────────────────┘
                     │
                     v
┌─────────────────────────────────────────────────────────────┐
│                  STAGE 4: RENDERER                          │
│  Generates HTML from AST                                    │
│  "<div data-screen='Home'>...</div>"                        │
└────────────────────┬────────────────────────────────────────┘
                     │
                     v
┌─────────────────────────────────────────────────────────────┐
│                     HTML OUTPUT                             │
│  Final HTML (preview or export)                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Stage 1: Lexical Analysis (Lexer)

**Location**: `packages/core/src/lexer/`

**Input**: Raw DSL text (string)

**Output**: Token stream (array of tokens)

### Process

1. **Text Processing**: Read DSL text character by character
2. **Pattern Matching**: Match against token patterns (regexes)
3. **Token Creation**: Create token objects with type and value
4. **Indentation Tracking**: Insert `Indent`/`Outdent` tokens based on whitespace

### Token Structure

```typescript
interface Token {
  tokenType: TokenType;    // Token definition
  image: string;           // Matched text
  startOffset: number;     // Character offset in source
  endOffset: number;       // End offset
  startLine: number;       // Line number
  endLine: number;         // End line
  startColumn: number;     // Column number
  endColumn: number;       // End column
}
```

### Example Transformation

**Input**:
```
screen Home:
  ## Welcome
```

**Output**:
```javascript
[
  { tokenType: Screen, image: 'screen', startLine: 1, startColumn: 1 },
  { tokenType: Identifier, image: 'Home', startLine: 1, startColumn: 8 },
  { tokenType: Colon, image: ':', startLine: 1, startColumn: 12 },
  { tokenType: Newline, image: '\n', startLine: 1, startColumn: 13 },
  { tokenType: Indent, image: '  ', startLine: 2, startColumn: 1 },
  { tokenType: Heading, image: '##', startLine: 2, startColumn: 3 },
  { tokenType: StringContent, image: 'Welcome', startLine: 2, startColumn: 6 },
  { tokenType: Newline, image: '\n', startLine: 2, startColumn: 13 },
  { tokenType: Outdent, image: '', startLine: 3, startColumn: 1 }
]
```

### Key Tokens

| Token | Pattern | Purpose |
|-------|---------|---------|
| `Screen` | `/screen/` | Screen declaration |
| `Modal` | `/modal/` | Modal declaration |
| `Drawer` | `/drawer/` | Drawer declaration |
| `Component` | `/component/` | Component definition |
| `Container` | `/container(-narrow)?/` | Container layouts |
| `Stack` | `/stack(-tight)?/` | Stack layouts |
| `Button` | `/@(\w+-)*(\w+)?\[.*?\]\(.*?\)/` | Button with variants |
| `Heading` | `/#{1,4}/` | Headings (h1-h4) |
| `Text` | `/>{1,3}/` | Text paragraphs |
| `Identifier` | `/[A-Za-z_][A-Za-z0-9_]*/` | Names |
| `Colon` | `/:/` | Block marker |
| `Indent` | (synthetic) | Indentation increase |
| `Outdent` | (synthetic) | Indentation decrease |
| `Newline` | `/\n/` | Line breaks |

### Indentation Handling

Proto-Typed tracks indentation levels to generate `Indent`/`Outdent` tokens:

```
screen Home:           # Indent level 0
  container:           # Indent level 1 → Insert Indent token
    ## Welcome         # Indent level 2 → Insert Indent token
  stack:               # Indent level 1 → Insert Outdent token
    > Text             # Indent level 2 → Insert Indent token
                       # End of file → Insert 2 Outdent tokens
```

This allows the parser to handle nesting without counting spaces.

---

## Stage 2: Syntax Analysis (Parser)

**Location**: `packages/core/src/parser/`

**Input**: Token stream (from lexer)

**Output**: Concrete Syntax Tree (CST)

### Process

1. **Top-Down Parsing**: Start from root rule (e.g., `documentRule`)
2. **Rule Matching**: Match tokens against grammar rules
3. **CST Construction**: Build tree structure preserving all syntax details
4. **Error Recovery**: Handle syntax errors and continue parsing

### Grammar Rules

Each element has a corresponding parser rule:

```typescript
class ProtoTypedParser extends CstParser {
  // View rules
  screenRule() {
    this.CONSUME(Screen);
    this.CONSUME(Identifier);
    this.CONSUME(Colon);
    this.OPTION(() => {
      this.CONSUME(Newline);
      this.CONSUME(Indent);
      this.MANY(() => this.SUBRULE(this.elementRule));
      this.CONSUME(Outdent);
    });
  }

  // Layout rules
  containerRule() {
    this.CONSUME(Container);
    this.CONSUME(Colon);
    this.OPTION(() => {
      this.CONSUME(Newline);
      this.CONSUME(Indent);
      this.MANY(() => this.SUBRULE(this.elementRule));
      this.CONSUME(Outdent);
    });
  }

  // Primitive rules
  headingRule() {
    this.CONSUME(Heading);
    this.CONSUME(StringContent);
    this.CONSUME(Newline);
  }

  // Generic element dispatch
  elementRule() {
    this.OR([
      { ALT: () => this.SUBRULE(this.screenRule) },
      { ALT: () => this.SUBRULE(this.containerRule) },
      { ALT: () => this.SUBRULE(this.headingRule) },
      // ... 40+ alternatives
    ]);
  }
}
```

### CST Structure

The CST preserves all parsing information:

```javascript
{
  name: "screenRule",
  children: {
    Screen: [{ image: "screen", startLine: 1, startColumn: 1 }],
    Identifier: [{ image: "Home", startLine: 1, startColumn: 8 }],
    Colon: [{ image: ":", startLine: 1, startColumn: 12 }],
    Newline: [{ image: "\n", startLine: 1, startColumn: 13 }],
    Indent: [{ image: "  ", startLine: 2, startColumn: 1 }],
    elementRule: [
      {
        name: "elementRule",
        children: {
          headingRule: [{
            name: "headingRule",
            children: {
              Heading: [{ image: "##", startLine: 2, startColumn: 3 }],
              StringContent: [{ image: "Welcome", startLine: 2, startColumn: 6 }],
              Newline: [{ image: "\n", startLine: 2, startColumn: 13 }]
            }
          }]
        }
      }
    ],
    Outdent: [{ image: "", startLine: 3, startColumn: 1 }]
  }
}
```

### Error Handling

Chevrotain provides automatic error recovery:

1. **Detection**: Identify unexpected tokens
2. **Recovery**: Skip tokens until valid state
3. **Reporting**: Collect error messages
4. **Continue**: Parse remaining input

---

## Stage 3: Semantic Analysis (AST Builder)

**Location**: `packages/core/src/parser/builders/`

**Input**: Concrete Syntax Tree (CST)

**Output**: Abstract Syntax Tree (AST)

### Process

1. **CST Traversal**: Visit each CST node using the Visitor pattern
2. **Data Extraction**: Extract relevant data from CST context
3. **Node Construction**: Build typed AST nodes
4. **Tree Assembly**: Link parent and child nodes

### AST Builder Visitor

```typescript
class AstBuilder extends BaseProtoTypedVisitor {
  constructor() {
    super();
    this.validateVisitor();
  }

  screenRule(ctx: ScreenRuleCstChildren): AstNode {
    const name = ctx.Identifier[0].image;
    const children = ctx.elementRule
      ? ctx.elementRule.map(child => this.visit(child))
      : [];

    return {
      type: 'Screen',
      id: generateId('screen', name),
      props: { name },
      children
    };
  }

  headingRule(ctx: HeadingRuleCstChildren): AstNode {
    const level = ctx.Heading[0].image.length; // Count #'s
    const text = ctx.StringContent[0].image;

    return {
      type: 'Heading',
      id: generateId('heading'),
      props: { level, text },
      children: []
    };
  }

  // ... builders for all 40+ node types
}
```

### AST Node Types

Every AST node has this structure:

```typescript
interface AstNode {
  type: NodeType;              // Discriminated union type
  id: string;                  // Unique identifier
  props: Record<string, any>;  // Node-specific properties
  children: AstNode[];         // Nested nodes
}

type NodeType =
  | 'Screen' | 'Modal' | 'Drawer' | 'Component'
  | 'Container' | 'Stack' | 'Row' | 'Grid' | 'Card'
  | 'Button' | 'Link' | 'Image' | 'Heading' | 'Text'
  | 'Input' | 'Checkbox' | 'Select' | 'Radio' | 'Textarea'
  // ... 40+ types
```

### Example AST

**Input DSL**:
```
screen Home:
  container:
    ## Welcome
    @[Click Me](Settings)
```

**Output AST**:
```javascript
{
  type: 'Screen',
  id: 'screen-home-abc123',
  props: { name: 'Home' },
  children: [
    {
      type: 'Container',
      id: 'container-xyz789',
      props: { variant: 'container' },
      children: [
        {
          type: 'Heading',
          id: 'heading-def456',
          props: { level: 2, text: 'Welcome' },
          children: []
        },
        {
          type: 'Button',
          id: 'button-ghi789',
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
  ]
}
```

### ID Generation

Each node gets a unique ID for DOM references:

```typescript
import { nanoid } from 'nanoid';

function generateId(prefix: string, name?: string): string {
  const suffix = nanoid(8);
  return name
    ? `${prefix}-${name.toLowerCase()}-${suffix}`
    : `${prefix}-${suffix}`;
}

// Examples:
// generateId('screen', 'Home') → "screen-home-a1b2c3d4"
// generateId('button') → "button-x9y8z7w6"
```

---

## Stage 4: Code Generation (Renderer)

**Location**: `packages/core/src/renderer/`

**Input**: Abstract Syntax Tree (AST)

**Output**: HTML string (preview or export)

### Rendering Architecture (3 Tiers)

#### Tier 1: Top-Level Adapters

**Files**:
- `ast-to-html-document.ts`: Export to standalone HTML
- `ast-to-html-string-preview.ts`: Preview HTML fragment

**Purpose**: Different output formats for different contexts

##### Preview Mode (`ast-to-html-string-preview.ts`)

**Use Case**: Web playground, VSCode extension preview

**Output**: HTML fragment for embedding in SPA

```typescript
export function astToHtmlStringPreview(ast: AstNode): string {
  // Initialize singletons
  routeManager.reset();
  customPropertiesManager.reset();

  // Process AST
  const html = render(ast);

  // Return fragment (no <html>, <head>, etc.)
  return html;
}
```

**Example Output**:
```html
<div id="screen-home-abc" data-screen="Home" class="screen" style="display: block;">
  <div class="max-w-7xl mx-auto px-4">
    <h2 class="text-2xl font-bold" style="color: var(--foreground);">Welcome</h2>
    <button onclick="navigateTo('Settings')">Click Me</button>
  </div>
</div>
```

##### Export Mode (`ast-to-html-document.ts`)

**Use Case**: Download standalone HTML file

**Output**: Complete HTML document with CDN dependencies

```typescript
export function astToHtmlDocument(ast: AstNode, themeName: string = 'neutral'): string {
  // Initialize singletons
  routeManager.reset();
  customPropertiesManager.reset();
  customPropertiesManager.setTheme(themeName);

  // Process AST
  const bodyHtml = render(ast);
  const themeStyles = customPropertiesManager.generateRootStyles();
  const navigationScript = routeManager.generateNavigationScript();

  // Build complete HTML document
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${getTitle()}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    ${themeStyles}
    .screen { display: none; }
    .screen:first-child { display: block; }
  </style>
</head>
<body style="background-color: var(--background); color: var(--foreground);">
  ${bodyHtml}
  <script>
    ${navigationScript}
  </script>
</body>
</html>`;
}
```

**Example Output**:
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    :root {
      --primary: oklch(0.7 0.15 220);
      --background: oklch(0.12 0.02 220);
      /* ... all CSS variables */
    }
    .screen { display: none; }
    .screen:first-child { display: block; }
  </style>
</head>
<body style="background-color: var(--background);">
  <!-- All screens rendered as hidden divs -->
  <div id="screen-home-abc" data-screen="Home" class="screen">...</div>
  <div id="screen-settings-xyz" data-screen="Settings" class="screen">...</div>

  <script>
    // Navigation functions
    function navigateTo(screenName) { /* ... */ }
    function toggleModal(modalName) { /* ... */ }
  </script>
</body>
</html>
```

#### Tier 2: Infrastructure Layer

**Files**:
- `route-manager-gateway.ts`: Facade for React components
- `navigation-mediator.ts`: Navigation target analysis
- `html-render-helper.ts`: Shared rendering utilities

##### Navigation Mediator

**Purpose**: Analyze navigation targets and determine handler type

```typescript
class NavigationMediator {
  analyzeTarget(target: string): NavigationInfo {
    // External URL: contains ://
    if (target.includes('://')) {
      return {
        type: 'external',
        handler: `window.open('${target}', '_blank')`
      };
    }

    // JavaScript action: contains () or .
    if (target.includes('()') || target.includes('.')) {
      return {
        type: 'action',
        handler: target
      };
    }

    // History back: negative number
    if (target.match(/^-\d+$/)) {
      return {
        type: 'back',
        handler: `history.go(${target})`
      };
    }

    // Modal/Drawer toggle: check if exists
    if (routeManager.hasModal(target)) {
      return {
        type: 'toggle',
        handler: `toggleModal('${target}')`
      };
    }

    // Default: internal navigation
    return {
      type: 'internal',
      handler: `navigateTo('${target}')`
    };
  }
}
```

#### Tier 3: Core Layer

##### Node Renderer (Strategy Pattern)

**File**: `core/node-renderer.ts`

**Purpose**: Dispatch rendering to specific node renderers

```typescript
import { renderScreen, renderModal, renderDrawer } from '../nodes/views.node';
import { renderButton, renderLink, renderHeading, renderText } from '../nodes/primitives.node';
import { renderContainer, renderStack, renderRow, renderGrid, renderCard } from '../nodes/layouts.node';
// ... more imports

const RENDERERS: Record<NodeType, (node: AstNode) => string> = {
  // Views
  Screen: (node) => renderScreen(node),
  Modal: (node) => renderModal(node),
  Drawer: (node) => renderDrawer(node),
  Component: (node) => renderComponent(node),

  // Layouts
  Container: (node) => renderContainer(node),
  Stack: (node) => renderStack(node),
  Row: (node) => renderRow(node),
  Grid: (node) => renderGrid(node),
  Card: (node) => renderCard(node),

  // Primitives
  Button: (node) => renderButton(node),
  Link: (node) => renderLink(node),
  Image: (node) => renderImage(node),
  Heading: (node) => renderHeading(node),
  Text: (node) => renderText(node),

  // Inputs
  Input: (node) => renderInput(node),
  Checkbox: (node) => renderCheckbox(node),
  Select: (node) => renderSelect(node),

  // ... 40+ renderers
};

export function render(node: AstNode): string {
  const renderer = RENDERERS[node.type];
  if (!renderer) {
    console.warn(`No renderer for type: ${node.type}`);
    return '';
  }
  return renderer(node);
}
```

##### Route Manager (Singleton)

**File**: `core/route-manager.ts`

**Purpose**: Manage navigation state and generate navigation script

```typescript
class RouteManager {
  private static instance: RouteManager;
  private screens: Map<string, { id: string; html: string }> = new Map();
  private modals: Map<string, { id: string; html: string }> = new Map();
  private components: Map<string, AstNode> = new Map();

  static getInstance(): RouteManager {
    if (!RouteManager.instance) {
      RouteManager.instance = new RouteManager();
    }
    return RouteManager.instance;
  }

  reset(): void {
    this.screens.clear();
    this.modals.clear();
    this.components.clear();
  }

  addScreen(name: string, id: string, html: string): void {
    this.screens.set(name, { id, html });
  }

  addModal(name: string, id: string, html: string): void {
    this.modals.set(name, { id, html });
  }

  storeComponentDefinition(name: string, node: AstNode): void {
    this.components.set(name, node);
  }

  generateNavigationScript(): string {
    const screenMap = Array.from(this.screens.entries())
      .map(([name, { id }]) => `  '${name}': '${id}'`)
      .join(',\n');

    return `
const screens = {
${screenMap}
};

function navigateTo(screenName) {
  document.querySelectorAll('[data-screen]').forEach(screen => {
    screen.style.display = 'none';
  });
  const targetScreen = document.getElementById(screens[screenName]);
  if (targetScreen) {
    targetScreen.style.display = 'block';
    history.pushState({ screen: screenName }, '', \`#\${screenName}\`);
  }
}

function toggleModal(modalName) {
  const modal = document.getElementById(\`modal-\${modalName}\`);
  if (modal) {
    modal.style.display = modal.style.display === 'none' ? 'block' : 'none';
  }
}

// Handle browser back/forward
window.addEventListener('popstate', (event) => {
  if (event.state && event.state.screen) {
    navigateTo(event.state.screen);
  }
});

// Initialize first screen
const firstScreen = Object.keys(screens)[0];
if (firstScreen) {
  navigateTo(firstScreen);
}
`;
  }
}
```

##### Theme Manager (Singleton)

**File**: `core/theme-manager.ts`

**Purpose**: Manage CSS variables for theming

```typescript
class CustomPropertiesManager {
  private static instance: CustomPropertiesManager;
  private currentTheme: ThemeDefinition;
  private customProperties: Record<string, string> = {};

  static getInstance(): CustomPropertiesManager {
    if (!CustomPropertiesManager.instance) {
      CustomPropertiesManager.instance = new CustomPropertiesManager();
    }
    return CustomPropertiesManager.instance;
  }

  setTheme(themeName: string): void {
    this.currentTheme = themeDefinitions[themeName] || themeDefinitions.neutral;
  }

  setCustomProperties(properties: Record<string, string>): void {
    this.customProperties = { ...this.customProperties, ...properties };
  }

  generateRootStyles(): string {
    const themeProps = this.currentTheme;
    const mergedProps = { ...themeProps, ...this.customProperties };

    const cssVars = Object.entries(mergedProps)
      .map(([key, value]) => `  ${key}: ${value};`)
      .join('\n');

    return `:root {\n${cssVars}\n}`;
  }
}
```

### Node Renderers (Pure Functions)

**Location**: `packages/core/src/renderer/nodes/`

Each renderer is a pure function that takes an AST node and returns HTML.

#### Example: Button Renderer

```typescript
// nodes/primitives.node.ts
export function renderButton(node: AstNode): string {
  const { variant = 'primary', size = 'md', text, target } = node.props;

  // Get Tailwind classes
  const classes = buttonStyles[variant][size];

  // Get CSS variable styles
  const styles = getButtonInlineStyles(variant);

  // Get onclick handler
  const onclick = navigationMediator.getOnClickHandler(target);

  return `<button class="${classes}" style="${styles}" onclick="${onclick}">${text}</button>`;
}

// Styling helper
const buttonStyles = {
  primary: {
    xs: 'inline-flex items-center px-2 py-1 text-xs rounded-md',
    sm: 'inline-flex items-center px-3 py-1.5 text-sm rounded-md',
    md: 'inline-flex items-center px-4 py-2 text-base rounded-md',
    lg: 'inline-flex items-center px-6 py-3 text-lg rounded-md'
  },
  secondary: { /* ... */ },
  destructive: { /* ... */ }
};

function getButtonInlineStyles(variant: string): string {
  switch (variant) {
    case 'primary':
      return 'background-color: var(--primary); color: var(--primary-foreground);';
    case 'secondary':
      return 'background-color: var(--secondary); color: var(--secondary-foreground);';
    case 'destructive':
      return 'background-color: var(--destructive); color: var(--destructive-foreground);';
    default:
      return '';
  }
}
```

#### Example: Container Renderer

```typescript
// nodes/layouts.node.ts
export function renderContainer(node: AstNode): string {
  const { variant = 'container' } = node.props;

  // Get classes
  const classes = layoutStyles[variant];

  // Render children recursively
  const childrenHtml = node.children.map(child => render(child)).join('');

  return `<div class="${classes}">${childrenHtml}</div>`;
}

const layoutStyles = {
  'container': 'max-w-7xl mx-auto px-4',
  'container-narrow': 'max-w-2xl mx-auto px-4'
};
```

#### Example: Screen Renderer

```typescript
// nodes/views.node.ts
export function renderScreen(node: AstNode): string {
  const { name } = node.props;
  const { id } = node;

  // Register screen with RouteManager
  const childrenHtml = node.children.map(child => render(child)).join('');
  routeManager.addScreen(name, id, childrenHtml);

  // Render screen div
  return `<div id="${id}" data-screen="${name}" class="screen">${childrenHtml}</div>`;
}
```

---

## Complete Pipeline Example

Let's trace a complete example end-to-end:

### Input DSL

```
theme: blue

screen Home:
  container:
    ## Welcome
    @[Go to Settings](Settings)

screen Settings:
  container:
    ## Settings
    @[Back](-1)
```

### Stage 1: Lexer Output

```javascript
[
  { tokenType: Theme, image: 'theme' },
  { tokenType: Colon, image: ':' },
  { tokenType: Identifier, image: 'blue' },
  { tokenType: Newline, image: '\n' },
  { tokenType: Screen, image: 'screen' },
  { tokenType: Identifier, image: 'Home' },
  { tokenType: Colon, image: ':' },
  // ... more tokens
]
```

### Stage 2: Parser Output (CST)

```javascript
{
  name: 'documentRule',
  children: {
    themeRule: [{
      children: {
        Theme: [{ image: 'theme' }],
        Identifier: [{ image: 'blue' }]
      }
    }],
    screenRule: [
      {
        children: {
          Screen: [{ image: 'screen' }],
          Identifier: [{ image: 'Home' }],
          elementRule: [/* container, heading, button */]
        }
      },
      {
        children: {
          Screen: [{ image: 'screen' }],
          Identifier: [{ image: 'Settings' }],
          elementRule: [/* container, heading, button */]
        }
      }
    ]
  }
}
```

### Stage 3: AST Builder Output

```javascript
{
  type: 'Document',
  id: 'document-root',
  props: { theme: 'blue' },
  children: [
    {
      type: 'Screen',
      id: 'screen-home-abc123',
      props: { name: 'Home' },
      children: [
        {
          type: 'Container',
          id: 'container-xyz789',
          props: { variant: 'container' },
          children: [
            {
              type: 'Heading',
              id: 'heading-def456',
              props: { level: 2, text: 'Welcome' },
              children: []
            },
            {
              type: 'Button',
              id: 'button-ghi789',
              props: {
                variant: 'primary',
                size: 'md',
                text: 'Go to Settings',
                target: 'Settings'
              },
              children: []
            }
          ]
        }
      ]
    },
    {
      type: 'Screen',
      id: 'screen-settings-jkl012',
      props: { name: 'Settings' },
      children: [/* ... */]
    }
  ]
}
```

### Stage 4: Renderer Output (Export)

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    :root {
      --primary: oklch(0.7 0.15 220);
      --background: oklch(0.12 0.02 220);
      --foreground: oklch(0.95 0.02 220);
      /* ... all CSS variables */
    }
    .screen { display: none; }
    .screen:first-child { display: block; }
  </style>
</head>
<body style="background-color: var(--background); color: var(--foreground);">
  <div id="screen-home-abc123" data-screen="Home" class="screen">
    <div class="max-w-7xl mx-auto px-4">
      <h2 class="text-2xl font-bold" style="color: var(--foreground);">Welcome</h2>
      <button
        class="inline-flex items-center px-4 py-2 rounded-md"
        style="background-color: var(--primary); color: var(--primary-foreground);"
        onclick="navigateTo('Settings')"
      >
        Go to Settings
      </button>
    </div>
  </div>

  <div id="screen-settings-jkl012" data-screen="Settings" class="screen">
    <div class="max-w-7xl mx-auto px-4">
      <h2 class="text-2xl font-bold" style="color: var(--foreground);">Settings</h2>
      <button
        class="inline-flex items-center px-4 py-2 rounded-md"
        style="background-color: var(--primary); color: var(--primary-foreground);"
        onclick="history.go(-1)"
      >
        Back
      </button>
    </div>
  </div>

  <script>
    const screens = {
      'Home': 'screen-home-abc123',
      'Settings': 'screen-settings-jkl012'
    };

    function navigateTo(screenName) {
      document.querySelectorAll('[data-screen]').forEach(screen => {
        screen.style.display = 'none';
      });
      const targetScreen = document.getElementById(screens[screenName]);
      if (targetScreen) {
        targetScreen.style.display = 'block';
        history.pushState({ screen: screenName }, '', `#${screenName}`);
      }
    }

    window.addEventListener('popstate', (event) => {
      if (event.state && event.state.screen) {
        navigateTo(event.state.screen);
      }
    });

    const firstScreen = Object.keys(screens)[0];
    if (firstScreen) {
      navigateTo(firstScreen);
    }
  </script>
</body>
</html>
```

---

## Performance Considerations

### Lexer Performance
- **O(n)** complexity where n = source length
- Single pass through source text
- Regex matching is fast for most tokens

### Parser Performance
- **O(n)** complexity where n = number of tokens
- LL(k) parsing with minimal backtracking
- CST construction is lightweight

### AST Builder Performance
- **O(n)** complexity where n = number of CST nodes
- Single traversal of CST
- Minimal allocations

### Renderer Performance
- **O(n)** complexity where n = number of AST nodes
- Single traversal of AST
- String concatenation (could be optimized with StringBuilder)

**Overall**: The entire pipeline is **O(n)** where n = source length.

---

## Error Handling Throughout Pipeline

### Lexer Errors
```javascript
const result = lexer.tokenize(source);
if (result.errors.length > 0) {
  console.error('Lexer errors:', result.errors);
}
```

### Parser Errors
```javascript
const cst = parser.parse(tokens);
if (parser.errors.length > 0) {
  console.error('Parser errors:', parser.errors);
}
```

### AST Builder Errors
```javascript
try {
  const ast = astBuilder.visit(cst);
} catch (error) {
  console.error('AST builder error:', error);
}
```

### Renderer Errors
```javascript
try {
  const html = render(ast);
} catch (error) {
  console.error('Renderer error:', error);
}
```

---

## Summary

The rendering pipeline is:
1. **Deterministic**: Same input → same output
2. **Unidirectional**: Data flows in one direction
3. **Layered**: Clear separation between stages
4. **Extensible**: New node types added by implementing builder + renderer
5. **Type-safe**: Full TypeScript coverage
6. **Performant**: Linear complexity throughout

Each stage transforms the representation:
- **Text** → **Tokens** → **CST** → **AST** → **HTML**

This clean architecture makes the system easy to understand, debug, and extend.
