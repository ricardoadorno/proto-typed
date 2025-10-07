# Proto-Typed DSL: LLM-Optimized Development Guide

## 🎯 Critical Context First

**BEFORE making ANY changes**: Read the actual implementation in `src/core/` to understand current token patterns, parsing rules, and AST structures. This file is a GUIDE - the SOURCE OF TRUTH is the code.

### Technology Stack
- **Parse Pipeline**: Chevrotain (Lexer → Parser → AST Builder → Renderer)
- **Frontend**: React 19 + TypeScript + Vite
- **Editor**: Monaco with custom DSL syntax
- **Testing Philosophy**: Runtime validation over automated tests (no test suite)

### Code Architecture
```
src/core/
├── lexer/tokens/        ← Token definitions by category
├── parser/              ← Grammar rules (parser.ts)
├── parser/builders/     ← CST → AST conversion by category
├── renderer/            ← AST → HTML generation
└── themes/              ← CSS variable system
```

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
Pattern: `(@{1,3})([_+\-=!]?)\[text\](?:\{icon\})?(?:\(action\))?`

**Size** (@ count):
- `@[Text]` → Large
- `@@[Text]` → Medium  
- `@@@[Text]` → Small

**Variants** (symbol after @):
- `@[Default]` → Default
- `@_[Ghost]` → Ghost
- `@+[Outline]` → Outline
- `@-[Secondary]` → Secondary
- `@=[Delete]` → Destructive
- `@![Warning]` → Warning

**Examples**:
```
@[Click Me](action)
@@+[Medium Outline]{icon}(action)
@@@=[Small Delete](delete)
```

#### **Links & Images** (`primitives.tokens.ts`)
```
#[Link Text](destination)
![Alt Text](image-url)
```

#### **Layout Elements** (`layouts.tokens.ts`)
All support **inline modifiers** with dash-separated syntax:

```
row-w50-center-p4:
col-h100-start-m2:
grid-cols3-gap4-p2:
container-wfull-center-stretch-p8:
```

**Available Modifiers**:
- **Size**: `w[num]`, `h[num]`, `wfull`, `hfull`, `wauto`, `hauto`
- **Justify**: `start`, `end`, `center`, `between`, `around`, `evenly`
- **Align**: `start`, `end`, `center`, `stretch`, `baseline`
- **Padding**: `p[num]`, `px[num]`, `py[num]`, `pl[num]`, `pr[num]`, `pt[num]`, `pb[num]`
- **Margin**: `m[num]`, `mx[num]`, `my[num]`, `ml[num]`, `mr[num]`, `mt[num]`, `mb[num]`
- **Grid**: `gap[num]`, `cols[1-12]`

#### **Structures** (`structures.tokens.ts`)
```
list:
  - Simple item
  - Complex item with content

card:
card-w75-p4:
header:
header-h100-center:
navigator:
  - icon text | destination
  - Home | HomeScreen
  - i-Settings Config | Settings
fab:
  - icon | destination
  - + | CreateScreen
  - i-Plus Add | CreateScreen
---  (separator)
```

**Navigator Format**:
- **Two parts**: `- text | destination` → Text without icon
- **Three parts**: `- text | icon | destination` → Text with icon prefix
- **Icon-first**: `- i-Home Home | HomeScreen` → Icon name (i-Home) + label (Home) as text

**Fab Format**:
- **Two parts**: `- icon | destination` → Icon and navigation target
- Icon can be text (emoji/character) or Lucide icon name (i-Plus)
- Example: `- + | CreateScreen` or `- i-Plus | CreateScreen`

#### **Forms** (`inputs.tokens.ts`)
Pattern: `___[\*\-]?(?::Label)?(?:\{Placeholder\})?(?:\[Options\])?`

```
___:Email{Enter email}
___*:Password{Enter password}
___-:Disabled{Can't edit}
___:Country{Select}[USA | Canada | Mexico]

[X] Checked checkbox
[ ] Unchecked checkbox
(X) Selected radio
( ) Unselected radio
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
  - `external` - URLs with `://` or `mailto:`
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

| Pattern | Component | Purpose |
|---------|-----------|---------|
| **Strategy** | `node-renderer.ts` | Map node types to renderers |
| **Singleton** | `routeManager`, `customPropertiesManager` | Global state management |
| **Facade/Gateway** | `route-manager-gateway.ts` | Simplify API for clients |
| **Mediator** | `navigation-mediator.ts` | Decouple navigation logic |
| **Template Method** | Render pipeline | Consistent render flow |
| **Pure Functions** | Node renderers | Predictable HTML generation |

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

### Layout Modifier Parsing

**IMPORTANT**: Layout modifiers are **inline** (not attributes). Parse from token image string.

Example from `layouts.builders.ts`:
```typescript
const rowToken = ctx.Row[0];
const modifiers = parseLayoutModifiers(rowToken.image);
// rowToken.image = "row-w50-center-p4"
// modifiers = { width: "50", justify: "center", padding: "4" }
```

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
  background, foreground, card, cardForeground, popover, popoverForeground
  
  // Semantic colors
  primary, primaryForeground
  secondary, secondaryForeground
  muted, mutedForeground
  accent, accentForeground
  destructive, destructiveForeground
  
  // UI elements
  border, input, ring
  
  // Charts
  chart1, chart2, chart3, chart4, chart5
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
  return 'background-color: var(--card); color: var(--card-foreground); border: 1px solid var(--border);';
}
```

3. **Use in renderer** (`nodes/*.node.ts`):
```typescript
import { elementStyles, getNewElementInlineStyles } from './styles/styles';

export function renderNewElement(node: AstNode): string {
  return `<div class="${elementStyles.newElement}" style="${getNewElementInlineStyles()}">${content}</div>`;
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
- ❌ Use attribute syntax for layout modifiers (they're inline)
- ❌ Use light color Tailwind classes
- ❌ Make assumptions - check `src/core/` implementation first

### ALWAYS
- ✅ Read token implementation before modifying syntax
- ✅ Use inline modifiers for layouts: `row-w50-center-p4:`
- ✅ Use @ count for button size, symbol for variant
- ✅ Validate with running app, not tests
- ✅ Ask user for feedback on functionality

---

## 📖 Quick Syntax Examples

### Complete Screen Example
```
screen Dashboard:
  header-h100-center-p4:
    # Dashboard
    @_[Settings](Settings)
  
  container-wfull-center-p8:
    row-between-center-m4:
      col-w50-start-p2:
        ## User Stats
        > Total Users: 1,234
        @[View Details](Users)
      
      col-w50-end-p2:
        ## Revenue
        >>> Last updated: 5 mins ago
        @+[Refresh](Refresh)
    
    list:
      - Recent activity item
      - Another update
  
  navigator:
    - i-Home Dashboard | Dashboard
    - i-Users Users | Users
    - i-Settings Settings | Settings
  
  fab:
    - + | CreateItem
```

### Component with Props Example
```
component ContactCard:
  card-p4-m2:
    # %name
    > Email: %email
    > Phone: %phone
    @@[Call](PhoneView)

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
