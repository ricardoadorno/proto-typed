# 08 - Design Tokens

## 🎯 Overview

Define the **design token system** that maps DSL elements to CSS classes and shadcn theme variables. This creates a consistent design language across all rendered components.

---

## 🎨 Token Categories

### Button Tokens

#### `btn.variant.*`

Maps button variants to CSS variables:

```typescript
const buttonVariantTokens = {
  'btn.variant.primary': {
    background: 'var(--primary)',
    foreground: 'var(--primary-foreground)',
    border: 'transparent',
  },
  'btn.variant.secondary': {
    background: 'var(--secondary)',
    foreground: 'var(--secondary-foreground)',
    border: 'transparent',
  },
  'btn.variant.outline': {
    background: 'transparent',
    foreground: 'var(--foreground)',
    border: 'var(--border)',
  },
  'btn.variant.ghost': {
    background: 'transparent',
    foreground: 'var(--foreground)',
    border: 'transparent',
    hover: 'var(--accent)',
  },
  'btn.variant.destructive': {
    background: 'var(--destructive)',
    foreground: 'var(--destructive-foreground)',
    border: 'transparent',
  },
  'btn.variant.link': {
    background: 'transparent',
    foreground: 'var(--primary)',
    border: 'none',
    textDecoration: 'underline',
  },
  'btn.variant.success': {
    background: 'var(--success)',
    foreground: 'var(--success-foreground)',
    border: 'transparent',
  },
  'btn.variant.warning': {
    background: 'var(--warning)',
    foreground: 'var(--warning-foreground)',
    border: 'transparent',
  },
};
```

---

#### `btn.size.*`

Maps button sizes to Tailwind classes:

```typescript
const buttonSizeTokens = {
  'btn.size.xs': 'text-xs px-2 py-1',
  'btn.size.sm': 'text-sm px-3 py-1.5',
  'btn.size.md': 'text-base px-4 py-2',
  'btn.size.lg': 'text-lg px-6 py-3',
};
```

---

#### `btn.base`

Base button classes (structure, no colors):

```typescript
const buttonBaseToken = 'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
```

---

### Input Tokens

#### `field.kind.*`

Maps input types to HTML input types:

```typescript
const fieldKindTokens = {
  'field.kind.text': 'text',
  'field.kind.email': 'email',
  'field.kind.password': 'password',
  'field.kind.date': 'date',
  'field.kind.number': 'number',
  'field.kind.url': 'url',
  'field.kind.tel': 'tel',
};
```

---

#### `field.base`

Base input classes:

```typescript
const fieldBaseToken = 'w-full px-3 py-2 rounded-md transition-colors focus:outline-none focus:ring-2';
```

---

#### `field.styles`

Input color tokens (CSS variables):

```typescript
const fieldStylesToken = {
  background: 'var(--input)',
  foreground: 'var(--foreground)',
  border: '1px solid var(--border)',
  focusRing: 'var(--ring)',
};
```

---

### Layout Tokens

#### `layout.*`

Maps canonical layouts to Tailwind preset classes:

```typescript
const layoutTokens = {
  // Containers
  'layout.container-narrow': 'max-w-2xl mx-auto px-4',
  'layout.container-wide': 'max-w-7xl mx-auto px-6',
  'layout.container-full': 'w-full',
  
  // Stacks
  'layout.stack': 'flex flex-col gap-4',
  'layout.stack-tight': 'flex flex-col gap-2',
  'layout.stack-loose': 'flex flex-col gap-8',
  
  // Rows
  'layout.row-start': 'flex items-center gap-4',
  'layout.row-center': 'flex items-center justify-center gap-4',
  'layout.row-between': 'flex items-center justify-between',
  'layout.row-end': 'flex items-center justify-end gap-4',
  
  // Grids
  'layout.grid-2': 'grid grid-cols-2 gap-4',
  'layout.grid-3': 'grid grid-cols-3 gap-4',
  'layout.grid-4': 'grid grid-cols-4 gap-4',
  'layout.grid-auto': 'grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4',
  
  // Cards
  'layout.card': 'border rounded-lg p-6',
  'layout.card-compact': 'border rounded-lg p-4',
  'layout.card-feature': 'border-2 rounded-xl p-8 shadow-lg',
  
  // Special
  'layout.header': 'sticky top-0 border-b px-4 py-3',
  'layout.sidebar': 'h-full border-r p-4',
  'layout.list': 'divide-y',
};
```

---

#### `layout.styles`

Layout color tokens:

```typescript
const layoutStylesTokens = {
  card: {
    background: 'var(--card)',
    foreground: 'var(--card-foreground)',
    border: 'var(--border)',
  },
  header: {
    background: 'var(--background)',
    foreground: 'var(--foreground)',
    border: 'var(--border)',
  },
  sidebar: {
    background: 'var(--background)',
    foreground: 'var(--foreground)',
    border: 'var(--border)',
  },
};
```

---

### Typography Tokens

#### `text.heading.*`

Heading size classes:

```typescript
const headingTokens = {
  'text.heading.h1': 'text-4xl font-bold mb-4',
  'text.heading.h2': 'text-3xl font-bold mb-3',
  'text.heading.h3': 'text-2xl font-semibold mb-3',
  'text.heading.h4': 'text-xl font-semibold mb-2',
  'text.heading.h5': 'text-lg font-medium mb-2',
  'text.heading.h6': 'text-base font-medium mb-2',
};
```

---

#### `text.paragraph.*`

Paragraph variants:

```typescript
const paragraphTokens = {
  'text.paragraph.default': 'mb-4',
  'text.paragraph.text': 'mb-0',
  'text.paragraph.muted': 'mb-4',
  'text.paragraph.note': 'mb-4 p-3 border-l-4',
  'text.paragraph.quote': 'mb-4 pl-4 border-l-2 italic',
};
```

---

#### `text.styles`

Typography color tokens:

```typescript
const textStylesTokens = {
  default: {
    color: 'var(--foreground)',
  },
  muted: {
    color: 'var(--muted-foreground)',
  },
  note: {
    color: 'var(--foreground)',
    borderColor: 'var(--accent)',
    background: 'var(--accent)/10',
  },
  quote: {
    color: 'var(--muted-foreground)',
    borderColor: 'var(--border)',
  },
};
```

---

### Link & Image Tokens

#### `link.base`

Link classes:

```typescript
const linkBaseToken = 'text-primary underline-offset-4 hover:underline transition-colors';
```

#### `link.styles`

```typescript
const linkStylesToken = {
  color: 'var(--primary)',
};
```

---

#### `image.base`

Image classes:

```typescript
const imageBaseToken = 'max-w-full h-auto rounded-md';
```

---

### View Tokens

#### `view.screen`

Screen wrapper classes:

```typescript
const screenToken = 'min-h-screen';
```

#### `view.modal`

Modal overlay and dialog classes:

```typescript
const modalTokens = {
  overlay: 'fixed inset-0 bg-black/50 backdrop-blur-sm z-50',
  dialog: 'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg p-6 rounded-lg shadow-lg z-50',
};
```

#### `view.drawer`

Drawer classes:

```typescript
const drawerTokens = {
  overlay: 'fixed inset-0 bg-black/50 backdrop-blur-sm z-50',
  panel: 'fixed top-0 bottom-0 left-0 w-80 shadow-lg z-50',
};
```

#### `view.styles`

View color tokens:

```typescript
const viewStylesTokens = {
  screen: {
    background: 'var(--background)',
    foreground: 'var(--foreground)',
  },
  modal: {
    background: 'var(--card)',
    foreground: 'var(--card-foreground)',
    border: 'var(--border)',
  },
  drawer: {
    background: 'var(--card)',
    foreground: 'var(--card-foreground)',
    border: 'var(--border)',
  },
};
```

---

## 🔧 Token System Architecture

### Token Resolution Flow

```
DSL Element → Token Key → CSS Classes + Inline Styles → HTML
```

**Example**:

```dsl
@primary-lg[Save](save)
```

**Resolution**:
1. DSL Parser: `{ variant: 'primary', size: 'lg', label: 'Save' }`
2. Token Lookup:
   - `btn.base` → `inline-flex items-center justify-center...`
   - `btn.size.lg` → `text-lg px-6 py-3`
   - `btn.variant.primary` → `{ background: 'var(--primary)', ... }`
3. HTML Output:
```html
<button class="inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors text-lg px-6 py-3"
        style="background-color: var(--primary); color: var(--primary-foreground); border: 1px solid transparent;">
  Save
</button>
```

---

### Token File Structure

**Proposed location**: `src/core/renderer/tokens/`

```
src/core/renderer/tokens/
├── button-tokens.ts
├── input-tokens.ts
├── layout-tokens.ts
├── typography-tokens.ts
├── view-tokens.ts
└── index.ts
```

**Example (`button-tokens.ts`)**:

```typescript
export const buttonTokens = {
  base: 'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
  
  variants: {
    primary: {
      background: 'var(--primary)',
      foreground: 'var(--primary-foreground)',
      border: 'transparent',
    },
    // ... other variants
  },
  
  sizes: {
    xs: 'text-xs px-2 py-1',
    sm: 'text-sm px-3 py-1.5',
    md: 'text-base px-4 py-2',
    lg: 'text-lg px-6 py-3',
  },
};

export function getButtonClasses(size: string): string {
  return `${buttonTokens.base} ${buttonTokens.sizes[size] || buttonTokens.sizes.md}`;
}

export function getButtonStyles(variant: string): string {
  const variantToken = buttonTokens.variants[variant] || buttonTokens.variants.primary;
  return `
    background-color: ${variantToken.background};
    color: ${variantToken.foreground};
    border: 1px solid ${variantToken.border};
    border-radius: var(--radius);
  `.trim();
}
```

---

## 🎨 shadcn Variable Mapping

All tokens use **shadcn CSS variables** for theming:

### Core Variables

```css
--background
--foreground
--card
--card-foreground
--popover
--popover-foreground
--primary
--primary-foreground
--secondary
--secondary-foreground
--muted
--muted-foreground
--accent
--accent-foreground
--destructive
--destructive-foreground
--border
--input
--ring
--radius
```

### Custom Variables (for refactoring)

Add success and warning variants:

```css
--success: oklch(0.7 0.15 145);
--success-foreground: oklch(0.98 0 0);
--warning: oklch(0.75 0.15 85);
--warning-foreground: oklch(0.15 0 0);
```

**Location**: `src/core/themes/theme-definitions.ts`

---

## 📋 Implementation Checklist

### Token Files
- [ ] Create `src/core/renderer/tokens/` directory
- [ ] Implement `button-tokens.ts`
- [ ] Implement `input-tokens.ts`
- [ ] Implement `layout-tokens.ts`
- [ ] Implement `typography-tokens.ts`
- [ ] Implement `view-tokens.ts`
- [ ] Create `index.ts` barrel export

### Token Functions
- [ ] `getButtonClasses(size)` and `getButtonStyles(variant)`
- [ ] `getInputClasses()` and `getInputStyles()`
- [ ] `getLayoutClasses(type)` and `getLayoutStyles(type)`
- [ ] `getHeadingClasses(level)` and `getTextStyles(variant)`

### Renderer Integration
- [ ] Update `renderButton()` to use token functions
- [ ] Update `renderField()` to use token functions
- [ ] Update `renderLayout()` to use token functions
- [ ] Update `renderHeading()` to use token functions

### Theme System
- [ ] Add `--success` and `--success-foreground` to themes
- [ ] Add `--warning` and `--warning-foreground` to themes
- [ ] Update `theme-definitions.ts` with new variables
- [ ] Test all themes with new tokens

### Documentation
- [ ] Document token system architecture
- [ ] Create token reference guide
- [ ] Provide examples for each token category

---

## 🧪 Token Testing

### Verify Token Resolution

```typescript
// Test button token resolution
const primaryLg = getButtonClasses('lg');
const primaryStyles = getButtonStyles('primary');

console.assert(primaryLg.includes('text-lg px-6 py-3'));
console.assert(primaryStyles.includes('var(--primary)'));
```

### Visual Token Catalog

Create a demo screen showcasing all tokens:

```dsl
screen TokenCatalog:
  # Design Tokens
  
  ## Buttons
  stack:
    row-start:
      @primary-xs[XS]
      @primary-sm[SM]
      @primary-md[MD]
      @primary-lg[LG]
    
    row-start:
      @primary[Primary]
      @secondary[Secondary]
      @outline[Outline]
      @ghost[Ghost]
      @destructive[Destructive]
      @link[Link]
      @success[Success]
      @warning[Warning]
  
  ## Layouts
  grid-3:
    card-compact:
      > Card Compact
    card:
      > Card Default
    card-feature:
      > Card Feature
  
  ## Typography
  stack:
    # Heading 1
    ## Heading 2
    ### Heading 3
    > Paragraph
    >>> Muted Text
```

---

**Next**: See [09 - Migration Strategy](./09-migration-strategy.md) for backward compatibility plan.
