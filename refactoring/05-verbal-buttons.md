# 05 - Verbal Buttons

## 🎯 Overview

Replace cryptic button codes with **word-based variants and sizes**, preserving `@` as the cognitive anchor for interactivity.

### The Change

**Before** (Symbol Codes):
```dsl
@[Save](save)           → Large default
@@+[Edit](edit)         → Medium outline
@@@=[Delete](delete)    → Small destructive
@_[Close](close)        → Large ghost
```

**After** (Verbal):
```dsl
@primary-lg[Save](save)        → Large primary
@outline-md[Edit](edit)        → Medium outline
@destructive-sm[Delete](delete) → Small destructive
@ghost-lg[Close](close)        → Large ghost
```

---

## 📋 Button Syntax

### Pattern

**Full syntax**: `@<variant>-<size>[Label]{icon}(action)`

**Components**:
- `@` - **Required**: Interaction marker (preserved icon)
- `<variant>` - **Required**: Button style (verbal)
- `-<size>` - **Optional**: Size modifier (default: `md`)
- `[Label]` - **Required**: Button text
- `{icon}` - **Optional**: Lucide icon name
- `(action)` - **Optional**: Click target/action

### Minimal Syntax

```dsl
@primary[Click Me]              → Medium primary button (default size)
@outline[Cancel]                → Medium outline button
```

---

## 🎨 Button Variants

### `@primary`

**Purpose**: Main call-to-action  
**Style**: Filled with primary color  
**CSS**: `background: var(--primary); color: var(--primary-foreground);`

```dsl
@primary[Save Changes](save)
@primary-lg[Get Started](signup)
@primary-sm[Apply](apply)
```

---

### `@secondary`

**Purpose**: Secondary actions  
**Style**: Filled with secondary color  
**CSS**: `background: var(--secondary); color: var(--secondary-foreground);`

```dsl
@secondary[Learn More](docs)
@secondary-md[View Details](details)
```

---

### `@outline`

**Purpose**: Less prominent actions  
**Style**: Border only, transparent background  
**CSS**: `border: 1px solid var(--border); color: var(--foreground);`

```dsl
@outline[Cancel](-1)
@outline-sm[Edit](edit)
```

---

### `@ghost`

**Purpose**: Subtle actions, icon buttons  
**Style**: No border, transparent, hover shows background  
**CSS**: `background: transparent; hover:background: var(--accent);`

```dsl
@ghost{menu}(openMenu)
@ghost-sm{x}(close)
@ghost-lg[Skip](skip)
```

---

### `@destructive`

**Purpose**: Dangerous actions (delete, remove)  
**Style**: Red/destructive color  
**CSS**: `background: var(--destructive); color: var(--destructive-foreground);`

```dsl
@destructive[Delete Account](confirmDelete)
@destructive-sm{trash}(delete)
```

---

### `@link`

**Purpose**: Text-only button, looks like link  
**Style**: Underlined text, no background/border  
**CSS**: `text-decoration: underline; color: var(--primary);`

```dsl
@link[Learn More](docs)
@link-sm[Terms](terms)
```

---

### `@success`

**Purpose**: Positive confirmation actions  
**Style**: Green/success color  
**CSS**: `background: var(--success); color: var(--success-foreground);`

```dsl
@success[Confirm](confirm)
@success-lg[Approve](approve)
```

---

### `@warning`

**Purpose**: Caution actions  
**Style**: Yellow/warning color  
**CSS**: `background: var(--warning); color: var(--warning-foreground);`

```dsl
@warning[Proceed with Caution](proceed)
@warning-md{alert-triangle}(warn)
```

---

## 📏 Size Modifiers

### `xs` - Extra Small

**Use**: Compact UIs, tags, badges  
**Padding**: `px-2 py-1`  
**Font**: `text-xs`

```dsl
@primary-xs[View](view)
@ghost-xs{edit}(edit)
```

---

### `sm` - Small

**Use**: Dense layouts, tables  
**Padding**: `px-3 py-1.5`  
**Font**: `text-sm`

```dsl
@outline-sm[Cancel](cancel)
@destructive-sm{trash}(delete)
```

---

### `md` - Medium (Default)

**Use**: Standard buttons  
**Padding**: `px-4 py-2`  
**Font**: `text-base`

```dsl
@primary[Submit](submit)
@outline-md[Back](-1)
```

**Note**: `-md` can be omitted (default):
```dsl
@primary[Submit](submit)  ≡  @primary-md[Submit](submit)
```

---

### `lg` - Large

**Use**: Hero sections, prominent CTAs  
**Padding**: `px-6 py-3`  
**Font**: `text-lg`

```dsl
@primary-lg[Get Started](signup)
@success-lg[Confirm Order](checkout)
```

---

## 🎯 Icons

Icons are **optional** and use Lucide icon names:

```dsl
@primary{save}[Save](save)                    → Icon + Label
@ghost{menu}(openMenu)                        → Icon only (no label)
@outline{download}[Download](download)        → Icon + Label
@destructive-sm{trash}(delete)                → Icon only, small
```

**Icon positioning**:
- `{icon}[Label]` → Icon before label
- Label can be omitted for icon-only buttons

---

## 🔗 Actions

Actions specify what happens on click:

### Screen Navigation
```dsl
@primary[Next](NextScreen)           → Navigate to screen
@outline[Go Back](-1)                → History back
```

### Modal/Drawer Toggle
```dsl
@ghost{menu}(MainMenu)               → Open drawer named MainMenu
@primary[Confirm](ConfirmDialog)    → Open modal named ConfirmDialog
```

### External Links
```dsl
@link[Documentation](https://docs.example.com)
@outline[Email Us](mailto:support@example.com)
```

### JavaScript Actions
```dsl
@primary[Submit](submitForm())
@destructive[Delete](handleDelete())
```

### Close/Dismiss
```dsl
@ghost{x}(close)                     → Close current modal/drawer
```

---

## 🛠️ Technical Implementation

### 1. Token Definition

**File**: `src/core/lexer/tokens/primitives.tokens.ts`

```typescript
import { createToken } from 'chevrotain';

// Button pattern: @<variant>-<size>[Label]{icon}(action)
// Variant: required word
// Size: optional suffix
// Label: required in brackets
// Icon: optional in braces
// Action: optional in parentheses

export const Button = createToken({
  name: 'Button',
  pattern: /@(primary|secondary|outline|ghost|destructive|link|success|warning)(?:-(xs|sm|md|lg))?\[([^\]]+)\](?:\{([^}]+)\})?(?:\(([^)]+)\))?/
});

// Alternative: icon-only button (no label)
export const ButtonIconOnly = createToken({
  name: 'ButtonIconOnly',
  pattern: /@(primary|secondary|outline|ghost|destructive|link|success|warning)(?:-(xs|sm|md|lg))?\{([^}]+)\}(?:\(([^)]+)\))?/
});
```

### 2. Parser Rule

**File**: `src/core/parser/parser.ts`

```typescript
private button(): void {
  this.OR([
    { ALT: () => this.CONSUME(Button) },
    { ALT: () => this.CONSUME(ButtonIconOnly) },
  ]);
}
```

### 3. AST Builder

**File**: `src/core/parser/builders/primitives.builders.ts`

```typescript
export interface ButtonNode extends AstNode {
  type: 'Button';
  props: {
    variant: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'link' | 'success' | 'warning';
    size: 'xs' | 'sm' | 'md' | 'lg';
    label?: string;
    icon?: string;
    action?: string;
  };
}

export function buildButton(ctx: Context): ButtonNode {
  const token = ctx.Button?.[0] || ctx.ButtonIconOnly?.[0];
  if (!token) throw new Error('Button token not found');
  
  let match;
  let variant, size, label, icon, action;
  
  if (ctx.Button) {
    // Full button with label
    match = token.image.match(/@(primary|secondary|outline|ghost|destructive|link|success|warning)(?:-(xs|sm|md|lg))?\[([^\]]+)\](?:\{([^}]+)\})?(?:\(([^)]+)\))?/);
    if (match) {
      [, variant, size, label, icon, action] = match;
    }
  } else {
    // Icon-only button
    match = token.image.match(/@(primary|secondary|outline|ghost|destructive|link|success|warning)(?:-(xs|sm|md|lg))?\{([^}]+)\}(?:\(([^)]+)\))?/);
    if (match) {
      [, variant, size, icon, action] = match;
    }
  }
  
  return {
    type: 'Button',
    id: generateId('button'),
    props: {
      variant: variant as ButtonNode['props']['variant'],
      size: (size as ButtonNode['props']['size']) || 'md',
      label: label?.trim(),
      icon: icon?.trim(),
      action: action?.trim(),
    },
    children: []
  };
}
```

### 4. Renderer

**File**: `src/core/renderer/nodes/primitives.node.ts`

```typescript
import { elementStyles, getButtonInlineStyles } from './styles/styles';
import { NavigationMediator } from '../infrastructure/navigation-mediator';

export function renderButton(node: AstNode): string {
  const { variant, size, label, icon, action } = node.props as ButtonNode['props'];
  
  // Get base classes and variant-specific styles
  const baseClasses = elementStyles.button;
  const sizeClass = getSizeClass(size);
  const classes = `${baseClasses} ${sizeClass}`;
  const inlineStyles = getButtonInlineStyles(variant);
  
  // Generate navigation attributes
  const navAttrs = action 
    ? NavigationMediator.generateNavigationAttributes(action)
    : '';
  
  // Build button content
  let content = '';
  if (icon) {
    content += `<i data-lucide="${icon}" class="w-4 h-4"></i>`;
  }
  if (label) {
    content += icon ? ` ${label}` : label;
  }
  
  return `
    <button class="${classes}" style="${inlineStyles}" ${navAttrs}>
      ${content}
    </button>
  `;
}

function getSizeClass(size: ButtonNode['props']['size']): string {
  const sizeMap = {
    xs: 'text-xs px-2 py-1',
    sm: 'text-sm px-3 py-1.5',
    md: 'text-base px-4 py-2',
    lg: 'text-lg px-6 py-3',
  };
  return sizeMap[size] || sizeMap.md;
}
```

### 5. Styles

**File**: `src/core/renderer/nodes/styles/styles.ts`

```typescript
export const elementStyles = {
  // ... existing styles
  
  button: 'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
};

export function getButtonInlineStyles(variant: ButtonNode['props']['variant']): string {
  const variantStyles = {
    primary: `
      background-color: var(--primary);
      color: var(--primary-foreground);
      border: 1px solid transparent;
    `,
    secondary: `
      background-color: var(--secondary);
      color: var(--secondary-foreground);
      border: 1px solid transparent;
    `,
    outline: `
      background-color: transparent;
      color: var(--foreground);
      border: 1px solid var(--border);
    `,
    ghost: `
      background-color: transparent;
      color: var(--foreground);
      border: 1px solid transparent;
    `,
    destructive: `
      background-color: var(--destructive);
      color: var(--destructive-foreground);
      border: 1px solid transparent;
    `,
    link: `
      background-color: transparent;
      color: var(--primary);
      border: none;
      text-decoration: underline;
    `,
    success: `
      background-color: var(--success);
      color: var(--success-foreground);
      border: 1px solid transparent;
    `,
    warning: `
      background-color: var(--warning);
      color: var(--warning-foreground);
      border: 1px solid transparent;
    `,
  };
  
  const base = `
    border-radius: var(--radius);
  `;
  
  return (base + (variantStyles[variant] || variantStyles.primary)).trim();
}
```

---

## 🧪 Examples

### Action Buttons

```dsl
row-end:
  @outline[Cancel](-1)
  @primary[Save Changes](save)
```

### Icon Buttons

```dsl
row-between:
  @ghost{menu}(openMenu)
  # App Title
  @ghost{settings}(Settings)
```

### Size Variations

```dsl
stack:
  @primary-xs[Tiny](action)
  @primary-sm[Small](action)
  @primary-md[Medium](action)
  @primary-lg[Large](action)
```

### Variant Showcase

```dsl
grid-2:
  @primary[Primary](action)
  @secondary[Secondary](action)
  @outline[Outline](action)
  @ghost[Ghost](action)
  @destructive[Destructive](action)
  @link[Link](action)
  @success[Success](action)
  @warning[Warning](action)
```

---

## 🔄 Migration Map

| Old | New | Notes |
|-----|-----|-------|
| `@[Text]` | `@primary-lg[Text]` | Large → lg |
| `@@[Text]` | `@primary-md[Text]` or `@primary[Text]` | Medium is default |
| `@@@[Text]` | `@primary-sm[Text]` | Small → sm |
| `@_[Text]` | `@ghost-lg[Text]` | Ghost variant |
| `@@_[Text]` | `@ghost-md[Text]` or `@ghost[Text]` | Ghost medium |
| `@+[Text]` | `@outline-lg[Text]` | Outline variant |
| `@@+[Text]` | `@outline-md[Text]` or `@outline[Text]` | Outline medium |
| `@-[Text]` | `@secondary-lg[Text]` | Secondary variant |
| `@@-[Text]` | `@secondary-md[Text]` or `@secondary[Text]` | Secondary medium |
| `@=[Text]` | `@destructive-lg[Text]` | Destructive variant |
| `@@=[Text]` | `@destructive-md[Text]` or `@destructive[Text]` | Destructive medium |
| `@![Text]` | `@warning-lg[Text]` | Warning variant |
| `@@![Text]` | `@warning-md[Text]` or `@warning[Text]` | Warning medium |

---

## 📋 Checklist

### Lexer
- [ ] Define `Button` and `ButtonIconOnly` tokens
- [ ] Update token patterns for verbal variants
- [ ] Remove old button tokens (`@`, `@@`, `@@@` with symbols)

### Parser
- [ ] Update button parsing rule
- [ ] Handle both label and icon-only patterns

### AST Builder
- [ ] Extract variant, size, label, icon, action
- [ ] Default size to `md` if omitted
- [ ] Build `ButtonNode` with all props

### Renderer
- [ ] Implement `renderButton()` with variant/size mapping
- [ ] Generate navigation attributes via `NavigationMediator`
- [ ] Render Lucide icons
- [ ] Apply shadcn button styles

### Styles
- [ ] Define base button classes
- [ ] Create `getButtonInlineStyles()` for all variants
- [ ] Use CSS variables for colors

### Documentation
- [ ] Document all variants and sizes
- [ ] Create button showcase examples
- [ ] Migration guide from symbol codes

### Testing
- [ ] Test all variant/size combinations
- [ ] Test icon rendering
- [ ] Test navigation actions
- [ ] Verify accessibility (focus, keyboard)

---

**Next**: See [06 - Text & Primitives](./06-text-primitives.md) for typography consolidation.
