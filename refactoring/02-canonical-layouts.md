# 02 - Canonical Layouts

## 🎯 Overview

Replace modifier-based layout syntax with **canonical preset layouts** that cover common UI patterns.

### The Change

**Before** (Modifiers):
```dsl
row-w50-center-p4:
  > Content

card-p6-m2:
  # Title
  
grid-cols3-gap4-p2:
  > Item 1
```

**After** (Canonical):
```dsl
container-wide:
  > Content

card:
  # Title
  
grid-3:
  > Item 1
```

---

## 📦 Layout Catalog

### Container Layouts

#### `container-narrow:`
**Purpose**: Centered narrow content (articles, forms)  
**Preset**: `max-w-2xl mx-auto px-4`  
**Use Case**: Blog posts, login forms

```dsl
container-narrow:
  # Article Title
  > Lorem ipsum dolor sit amet...
```

#### `container-wide:`
**Purpose**: Centered wide content (dashboards)  
**Preset**: `max-w-7xl mx-auto px-6`  
**Use Case**: Main app layout

```dsl
container-wide:
  # Dashboard
  > Wide content area
```

#### `container-full:`
**Purpose**: Edge-to-edge layout  
**Preset**: `w-full`  
**Use Case**: Hero sections, headers

```dsl
container-full:
  # Full Width Banner
```

---

### Stack Layouts (Vertical Flow)

#### `stack:`
**Purpose**: Vertical stack, default gap  
**Preset**: `flex flex-col gap-4`

```dsl
stack:
  @primary[Submit]
  @outline[Cancel]
```

#### `stack-tight:`
**Purpose**: Vertical stack, minimal gap  
**Preset**: `flex flex-col gap-2`

```dsl
stack-tight:
  > Line 1
  > Line 2
```

#### `stack-loose:`
**Purpose**: Vertical stack, large gap  
**Preset**: `flex flex-col gap-8`

```dsl
stack-loose:
  card:
    # Section 1
  card:
    # Section 2
```

---

### Row Layouts (Horizontal Flow)

#### `row-start:`
**Purpose**: Horizontal, left-aligned  
**Preset**: `flex items-center gap-4`

```dsl
row-start:
  @primary[Save]
  @outline[Cancel]
```

#### `row-center:`
**Purpose**: Horizontal, centered  
**Preset**: `flex items-center justify-center gap-4`

```dsl
row-center:
  > Centered content
```

#### `row-between:`
**Purpose**: Horizontal, space-between  
**Preset**: `flex items-center justify-between`

```dsl
row-between:
  # Title
  @ghost[Close]
```

#### `row-end:`
**Purpose**: Horizontal, right-aligned  
**Preset**: `flex items-center justify-end gap-4`

```dsl
row-end:
  @primary[Next]
```

---

### Grid Layouts

#### `grid-2:`, `grid-3:`, `grid-4:`
**Purpose**: Equal column grids  
**Preset**: `grid grid-cols-{n} gap-4`

```dsl
grid-3:
  card:
    # Item 1
  card:
    # Item 2
  card:
    # Item 3
```

#### `grid-auto:`
**Purpose**: Auto-fit responsive grid  
**Preset**: `grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4`

```dsl
grid-auto:
  card:
    # Card 1
  card:
    # Card 2
```

---

### Card Layouts

#### `card:`
**Purpose**: Bordered content box  
**Preset**: `border rounded-lg p-6 bg-card`

```dsl
card:
  # Card Title
  > Card content
```

#### `card-compact:`
**Purpose**: Card with minimal padding  
**Preset**: `border rounded-lg p-4 bg-card`

```dsl
card-compact:
  > Tight content
```

#### `card-feature:`
**Purpose**: Prominent card (for hero sections)  
**Preset**: `border-2 rounded-xl p-8 bg-card shadow-lg`

```dsl
card-feature:
  ## Featured Item
  > Premium content
```

---

### Special Layouts

#### `list:`
**Purpose**: Vertical list with dividers  
**Preset**: `divide-y`

```dsl
list:
  - Item 1
  - Item 2
  - Item 3
```

#### `header:`
**Purpose**: App header bar  
**Preset**: `sticky top-0 border-b bg-background/95 backdrop-blur px-4 py-3`

```dsl
header:
  row-between:
    # App Name
    @ghost[Menu]
```

#### `navigator:`
**Purpose**: Bottom navigation bar (mobile)  
**Preset**: `fixed bottom-0 w-full border-t bg-background flex justify-around py-2`

```dsl
navigator:
  - Home{home}(Home)
  - Profile{user}(Profile)
```

#### `sidebar:`
**Purpose**: Side panel/drawer content  
**Preset**: `h-full border-r bg-background p-4`

```dsl
sidebar:
  # Navigation
  list:
    - Dashboard
    - Settings
```

---

## 🔄 Migration Map

| Old Syntax | New Canonical | Notes |
|------------|---------------|-------|
| `row-center-p4:` | `row-center:` | Padding absorbed into preset |
| `col-start-gap2:` | `stack-tight:` | Named for semantic meaning |
| `grid-cols3-gap4:` | `grid-3:` | Gap standardized |
| `card-p6:` | `card:` | Padding standardized |
| `container-wfull-center:` | `container-wide:` | Width simplified |
| `row-between-center:` | `row-between:` | Alignment absorbed |

---

## 🛠️ Technical Implementation

### 1. Token Definition

**File**: `src/core/lexer/tokens/layouts.tokens.ts`

```typescript
import { createToken } from 'chevrotain';

// Container layouts
export const ContainerNarrow = createToken({ name: 'ContainerNarrow', pattern: /container-narrow:/ });
export const ContainerWide = createToken({ name: 'ContainerWide', pattern: /container-wide:/ });
export const ContainerFull = createToken({ name: 'ContainerFull', pattern: /container-full:/ });

// Stack layouts
export const Stack = createToken({ name: 'Stack', pattern: /stack:/ });
export const StackTight = createToken({ name: 'StackTight', pattern: /stack-tight:/ });
export const StackLoose = createToken({ name: 'StackLoose', pattern: /stack-loose:/ });

// Row layouts
export const RowStart = createToken({ name: 'RowStart', pattern: /row-start:/ });
export const RowCenter = createToken({ name: 'RowCenter', pattern: /row-center:/ });
export const RowBetween = createToken({ name: 'RowBetween', pattern: /row-between:/ });
export const RowEnd = createToken({ name: 'RowEnd', pattern: /row-end:/ });

// Grid layouts
export const Grid2 = createToken({ name: 'Grid2', pattern: /grid-2:/ });
export const Grid3 = createToken({ name: 'Grid3', pattern: /grid-3:/ });
export const Grid4 = createToken({ name: 'Grid4', pattern: /grid-4:/ });
export const GridAuto = createToken({ name: 'GridAuto', pattern: /grid-auto:/ });

// Card layouts
export const Card = createToken({ name: 'Card', pattern: /card:/ });
export const CardCompact = createToken({ name: 'CardCompact', pattern: /card-compact:/ });
export const CardFeature = createToken({ name: 'CardFeature', pattern: /card-feature:/ });

// Special layouts
export const Header = createToken({ name: 'Header', pattern: /header:/ });
export const Sidebar = createToken({ name: 'Sidebar', pattern: /sidebar:/ });
export const Navigator = createToken({ name: 'Navigator', pattern: /navigator:/ });
export const List = createToken({ name: 'List', pattern: /list:/ });

// Export all layout tokens
export const layoutTokens = [
  ContainerNarrow, ContainerWide, ContainerFull,
  Stack, StackTight, StackLoose,
  RowStart, RowCenter, RowBetween, RowEnd,
  Grid2, Grid3, Grid4, GridAuto,
  Card, CardCompact, CardFeature,
  Header, Sidebar, Navigator, List
];
```

### 2. Parser Rule

**File**: `src/core/parser/parser.ts`

```typescript
// Replace old layout rules with canonical layouts
private layoutElement(): void {
  this.OR([
    // Containers
    { ALT: () => this.CONSUME(ContainerNarrow) },
    { ALT: () => this.CONSUME(ContainerWide) },
    { ALT: () => this.CONSUME(ContainerFull) },
    
    // Stacks
    { ALT: () => this.CONSUME(Stack) },
    { ALT: () => this.CONSUME(StackTight) },
    { ALT: () => this.CONSUME(StackLoose) },
    
    // Rows
    { ALT: () => this.CONSUME(RowStart) },
    { ALT: () => this.CONSUME(RowCenter) },
    { ALT: () => this.CONSUME(RowBetween) },
    { ALT: () => this.CONSUME(RowEnd) },
    
    // Grids
    { ALT: () => this.CONSUME(Grid2) },
    { ALT: () => this.CONSUME(Grid3) },
    { ALT: () => this.CONSUME(Grid4) },
    { ALT: () => this.CONSUME(GridAuto) },
    
    // Cards
    { ALT: () => this.CONSUME(Card) },
    { ALT: () => this.CONSUME(CardCompact) },
    { ALT: () => this.CONSUME(CardFeature) },
    
    // Special
    { ALT: () => this.CONSUME(Header) },
    { ALT: () => this.CONSUME(Sidebar) },
    { ALT: () => this.CONSUME(List) },
  ]);
  
  this.CONSUME(Indent);
  this.MANY(() => this.SUBRULE(this.element));
  this.CONSUME(Outdent);
}
```

### 3. AST Builder

**File**: `src/core/parser/builders/layouts.builders.ts`

```typescript
export function buildLayoutElement(ctx: Context): AstNode {
  // Determine layout type from token
  let layoutType: LayoutType;
  
  if (ctx.ContainerNarrow) layoutType = 'container-narrow';
  else if (ctx.ContainerWide) layoutType = 'container-wide';
  else if (ctx.ContainerFull) layoutType = 'container-full';
  else if (ctx.Stack) layoutType = 'stack';
  else if (ctx.StackTight) layoutType = 'stack-tight';
  // ... (all other types)
  
  return {
    type: 'Layout',
    id: generateId('layout'),
    props: { layoutType },
    children: ctx.element?.map(buildElement) || []
  };
}
```

### 4. Renderer

**File**: `src/core/renderer/nodes/layouts.node.ts`

```typescript
const LAYOUT_PRESETS: Record<string, string> = {
  // Containers
  'container-narrow': 'max-w-2xl mx-auto px-4',
  'container-wide': 'max-w-7xl mx-auto px-6',
  'container-full': 'w-full',
  
  // Stacks
  'stack': 'flex flex-col gap-4',
  'stack-tight': 'flex flex-col gap-2',
  'stack-loose': 'flex flex-col gap-8',
  
  // Rows
  'row-start': 'flex items-center gap-4',
  'row-center': 'flex items-center justify-center gap-4',
  'row-between': 'flex items-center justify-between',
  'row-end': 'flex items-center justify-end gap-4',
  
  // Grids
  'grid-2': 'grid grid-cols-2 gap-4',
  'grid-3': 'grid grid-cols-3 gap-4',
  'grid-4': 'grid grid-cols-4 gap-4',
  'grid-auto': 'grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4',
  
  // Cards
  'card': 'border rounded-lg p-6',
  'card-compact': 'border rounded-lg p-4',
  'card-feature': 'border-2 rounded-xl p-8 shadow-lg',
  
  // Special
  'header': 'sticky top-0 border-b px-4 py-3',
  'sidebar': 'h-full border-r p-4',
  'list': 'divide-y',
};

export function renderLayout(node: AstNode, _render: RenderFunction): string {
  const { layoutType } = node.props as any;
  const classes = LAYOUT_PRESETS[layoutType] || '';
  const styles = getLayoutInlineStyles(layoutType);
  
  const content = node.children.map(_render).join('');
  
  return `<div class="${classes}" style="${styles}">${content}</div>`;
}

function getLayoutInlineStyles(layoutType: string): string {
  const baseStyles = 'background-color: var(--background); color: var(--foreground);';
  
  if (layoutType.startsWith('card')) {
    return `${baseStyles} background-color: var(--card); color: var(--card-foreground); border-color: var(--border);`;
  }
  
  if (layoutType === 'header' || layoutType === 'sidebar') {
    return `${baseStyles} background-color: var(--background); border-color: var(--border);`;
  }
  
  return baseStyles;
}
```

### 5. Type Definitions

**File**: `src/types/ast-node.ts`

```typescript
export type LayoutType =
  | 'container-narrow'
  | 'container-wide'
  | 'container-full'
  | 'stack'
  | 'stack-tight'
  | 'stack-loose'
  | 'row-start'
  | 'row-center'
  | 'row-between'
  | 'row-end'
  | 'grid-2'
  | 'grid-3'
  | 'grid-4'
  | 'grid-auto'
  | 'card'
  | 'card-compact'
  | 'card-feature'
  | 'header'
  | 'sidebar'
  | 'list';

export interface LayoutNode extends AstNode {
  type: 'Layout';
  props: { layoutType: LayoutType };
  children: AstNode[];
}
```

---

## 🧪 Examples & Tests

### Before/After Comparisons

**Example 1: Dashboard Layout**

Before:
```dsl
container-wfull-center-p8:
  row-between-center-m4:
    card-w50-p4:
      > Stats
    card-w50-p4:
      > Chart
```

After:
```dsl
container-wide:
  row-between:
    card:
      > Stats
    card:
      > Chart
```

**Example 2: Form Layout**

Before:
```dsl
col-center-p4-gap4:
  ___:Email{Enter email}
  ___*:Password{Enter password}
  @[Submit](submit)
```

After:
```dsl
stack:
  ___email: Email | placeholder: Enter email
  ___password: Password | placeholder: Enter password
  @primary[Submit](submit)
```

---

## 📋 Checklist

### Lexer
- [ ] Define all canonical layout tokens
- [ ] Remove old modifier-based tokens
- [ ] Update token export list

### Parser
- [ ] Add `layoutElement()` rule with OR alternatives
- [ ] Remove old modifier parsing logic
- [ ] Handle indentation for nested content

### AST Builder
- [ ] Map tokens to `LayoutNode` with `layoutType`
- [ ] Build children recursively
- [ ] Remove modifier extraction logic

### Renderer
- [ ] Create `LAYOUT_PRESETS` mapping
- [ ] Implement `renderLayout()` with preset classes
- [ ] Apply shadcn color variables via inline styles
- [ ] Add to `RENDERERS` map in `node-renderer.ts`

### Types
- [ ] Define `LayoutType` union
- [ ] Create `LayoutNode` interface
- [ ] Update `NodeType` union to include 'Layout'

### Documentation
- [ ] Update examples to use canonical layouts
- [ ] Create layout catalog reference
- [ ] Add migration guide

### Testing
- [ ] Verify all presets render correctly
- [ ] Test nesting (e.g., `card` inside `grid-3`)
- [ ] Validate responsive behavior

---

**Next**: See [03 - Component Binding](./03-component-binding.md) for explicit prop system.
