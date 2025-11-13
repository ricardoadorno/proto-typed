# Proto-Typed: Styling System

## Styling Philosophy

Proto-Typed's styling system is inspired by **shadcn/ui** design principles, combining:
- **CSS variables** for semantic theming
- **Tailwind CSS** for structural styling
- **OKLCH color space** for perceptual uniformity
- **Dark mode only** for simplicity

The core principle: **Separate structure from appearance**.

---

## Two-Layer Styling Approach

### Layer 1: Structure (Tailwind Classes)

**Purpose**: Layout, spacing, typography, positioning

**Applied via**: `class` attribute

**Examples**:
```html
<!-- Layout -->
<div class="flex items-center gap-4">

<!-- Spacing -->
<div class="px-4 py-2 rounded-md">

<!-- Typography -->
<h2 class="text-2xl font-bold">

<!-- Grid -->
<div class="grid grid-cols-2 gap-4">
```

**What Tailwind Does**:
- Flexbox/Grid layouts
- Padding, margin, gap
- Border radius
- Font size, weight
- Width, height
- Display properties

**What Tailwind Does NOT Do**:
- Colors (use CSS variables instead)
- Theme-specific values

---

### Layer 2: Appearance (CSS Variables)

**Purpose**: Colors, shadows, theme-specific styling

**Applied via**: `style` attribute (inline styles)

**Examples**:
```html
<!-- Background and text color -->
<div style="background-color: var(--primary); color: var(--primary-foreground);">

<!-- Border color -->
<div style="border-color: var(--border);">

<!-- Card background -->
<div style="background-color: var(--card); color: var(--card-foreground);">
```

**What CSS Variables Do**:
- All colors (backgrounds, text, borders)
- Theme-specific styling
- Global consistency

**Why Inline Styles?**:
- Easier to generate from renderers
- No need for external stylesheet
- Clear separation from Tailwind classes
- Works in both preview and export modes

---

## CSS Variable System

Proto-Typed uses **semantic CSS variables** based on shadcn/ui tokens. These variables are defined in the `:root` selector and can be overridden by themes or user customization.

### Core Variables

#### Background & Foreground

```css
:root {
  --background: oklch(0.12 0.02 220);     /* Page background (dark) */
  --foreground: oklch(0.95 0.02 220);     /* Primary text color (light) */
}
```

**Usage**:
```html
<body style="background-color: var(--background); color: var(--foreground);">
```

---

#### Primary Colors (Main Actions)

```css
:root {
  --primary: oklch(0.7 0.15 220);         /* Primary accent (blue) */
  --primary-foreground: oklch(0.95 0.02 220); /* Text on primary */
}
```

**Usage**:
```html
<button style="background-color: var(--primary); color: var(--primary-foreground);">
  Click Me
</button>
```

---

#### Secondary Colors (Alternative Actions)

```css
:root {
  --secondary: oklch(0.2 0.02 220);       /* Secondary background */
  --secondary-foreground: oklch(0.95 0.02 220); /* Text on secondary */
}
```

**Usage**:
```html
<button style="background-color: var(--secondary); color: var(--secondary-foreground);">
  Cancel
</button>
```

---

#### Muted Colors (Less Emphasis)

```css
:root {
  --muted: oklch(0.2 0.02 220);           /* Muted background */
  --muted-foreground: oklch(0.6 0.02 220); /* Muted text (gray) */
}
```

**Usage**:
```html
<p style="color: var(--muted-foreground);">
  Secondary information
</p>
```

---

#### Destructive Colors (Dangerous Actions)

```css
:root {
  --destructive: oklch(0.55 0.22 20);     /* Red for delete/destroy */
  --destructive-foreground: oklch(0.95 0.02 20); /* Text on destructive */
}
```

**Usage**:
```html
<button style="background-color: var(--destructive); color: var(--destructive-foreground);">
  Delete
</button>
```

---

#### Accent Colors (Highlighting)

```css
:root {
  --accent: oklch(0.2 0.02 220);          /* Accent background */
  --accent-foreground: oklch(0.95 0.02 220); /* Text on accent */
}
```

**Usage**:
```html
<div style="background-color: var(--accent); color: var(--accent-foreground);">
  Highlighted content
</div>
```

---

#### Card Colors (Elevated Surfaces)

```css
:root {
  --card: oklch(0.15 0.02 220);           /* Card background */
  --card-foreground: oklch(0.95 0.02 220); /* Text on card */
}
```

**Usage**:
```html
<div style="background-color: var(--card); color: var(--card-foreground);">
  Card content
</div>
```

---

#### Popover Colors (Overlays)

```css
:root {
  --popover: oklch(0.15 0.02 220);        /* Popover background */
  --popover-foreground: oklch(0.95 0.02 220); /* Text on popover */
}
```

**Usage**:
```html
<div style="background-color: var(--popover); color: var(--popover-foreground);">
  Popover content
</div>
```

---

#### Border & Input Colors

```css
:root {
  --border: oklch(0.25 0.02 220);         /* Border color */
  --input: oklch(0.15 0.02 220);          /* Input background */
  --ring: oklch(0.7 0.15 220);            /* Focus ring */
}
```

**Usage**:
```html
<input
  class="px-3 py-2 rounded-md border"
  style="background-color: var(--input); border-color: var(--border);"
/>
```

---

#### Border Radius

```css
:root {
  --radius: 0.5rem;                       /* Global border radius */
}
```

**Usage**:
```html
<div style="border-radius: var(--radius);">
  Rounded corners
</div>
```

---

### Additional Variant Colors

Proto-Typed extends shadcn/ui with additional button variants:

```css
:root {
  --success: oklch(0.6 0.15 140);         /* Green for success */
  --success-foreground: oklch(0.95 0.02 140);

  --warning: oklch(0.7 0.15 60);          /* Yellow for warnings */
  --warning-foreground: oklch(0.1 0.02 60);
}
```

**Usage**:
```html
<button style="background-color: var(--success); color: var(--success-foreground);">
  Save
</button>

<button style="background-color: var(--warning); color: var(--warning-foreground);">
  Caution
</button>
```

---

## OKLCH Color Space

Proto-Typed uses **OKLCH** (Oklab Lightness Chroma Hue) for all colors instead of traditional HSL or RGB.

### What is OKLCH?

OKLCH is a perceptually uniform color space that makes it easier to create harmonious color schemes.

**Format**: `oklch(L C H)`
- **L** (Lightness): 0 (black) to 1 (white)
- **C** (Chroma): 0 (gray) to ~0.4 (vivid)
- **H** (Hue): 0-360 degrees

**Example**:
```css
oklch(0.7 0.15 220)
     │   │   └── Hue: 220° (blue)
     │   └────── Chroma: 0.15 (moderate saturation)
     └────────── Lightness: 0.7 (bright)
```

---

### Why OKLCH?

#### Perceptual Uniformity

In HSL, a lightness of 50% looks different across hues:
- `hsl(0, 100%, 50%)` (red) appears brighter than
- `hsl(240, 100%, 50%)` (blue)

In OKLCH, lightness is consistent:
- `oklch(0.7 0.15 0)` (red) appears as bright as
- `oklch(0.7 0.15 240)` (blue)

This makes it easier to create balanced color schemes.

---

#### Easier to Generate Scales

Creating a lightness scale in OKLCH is straightforward:

```css
/* Dark to light scale with same hue and chroma */
--color-1: oklch(0.2 0.15 220);
--color-2: oklch(0.4 0.15 220);
--color-3: oklch(0.6 0.15 220);
--color-4: oklch(0.8 0.15 220);
```

All colors have the same hue (blue) and chroma (saturation), but different lightness—guaranteed to look harmonious.

---

#### Better Dark Mode Support

OKLCH handles dark colors better than HSL, avoiding muddy or washed-out colors.

**Example**:
```css
/* HSL dark blue: muddy */
hsl(220, 50%, 10%)

/* OKLCH dark blue: crisp */
oklch(0.12 0.05 220)
```

---

### OKLCH in Proto-Typed

All theme colors use OKLCH:

```css
:root {
  /* Background: very dark, low chroma */
  --background: oklch(0.12 0.02 220);

  /* Foreground: very light, low chroma */
  --foreground: oklch(0.95 0.02 220);

  /* Primary: medium lightness, vivid chroma */
  --primary: oklch(0.7 0.15 220);

  /* Border: slightly lighter than background */
  --border: oklch(0.25 0.02 220);
}
```

**Color Relationships**:
- **Background** (0.12) → **Border** (0.25) → **Card** (0.15): Subtle layering
- **Primary** (0.7) and **Foreground** (0.95): High contrast for readability
- All use same hue (220°): Cohesive color scheme

---

## Theme System

Proto-Typed includes **12 pre-defined themes**, each with a different primary hue.

### Available Themes

| Theme | Primary Hue | Description |
|-------|------------|-------------|
| `neutral` | 220° | Gray (default) |
| `stone` | 25° | Warm gray |
| `slate` | 220° | Blue-gray |
| `gray` | 220° | True gray |
| `zinc` | 220° | Cool gray |
| `red` | 20° | Red accent |
| `rose` | 350° | Pink-red |
| `orange` | 40° | Orange accent |
| `green` | 140° | Green accent |
| `blue` | 220° | Blue accent |
| `yellow` | 60° | Yellow accent |
| `violet` | 280° | Purple accent |

---

### Theme Structure

Each theme defines the same CSS variables with different hues:

```typescript
// Example: Blue theme
export const blueTheme: ThemeDefinition = {
  '--background': 'oklch(0.12 0.02 220)',
  '--foreground': 'oklch(0.95 0.02 220)',
  '--primary': 'oklch(0.7 0.15 220)',      // Blue hue
  '--primary-foreground': 'oklch(0.95 0.02 220)',
  '--secondary': 'oklch(0.2 0.02 220)',
  '--secondary-foreground': 'oklch(0.95 0.02 220)',
  '--muted': 'oklch(0.2 0.02 220)',
  '--muted-foreground': 'oklch(0.6 0.02 220)',
  '--destructive': 'oklch(0.55 0.22 20)',  // Red (always)
  '--destructive-foreground': 'oklch(0.95 0.02 20)',
  '--accent': 'oklch(0.2 0.02 220)',
  '--accent-foreground': 'oklch(0.95 0.02 220)',
  '--card': 'oklch(0.15 0.02 220)',
  '--card-foreground': 'oklch(0.95 0.02 220)',
  '--popover': 'oklch(0.15 0.02 220)',
  '--popover-foreground': 'oklch(0.95 0.02 220)',
  '--border': 'oklch(0.25 0.02 220)',
  '--input': 'oklch(0.15 0.02 220)',
  '--ring': 'oklch(0.7 0.15 220)',
  '--radius': '0.5rem',
  '--success': 'oklch(0.6 0.15 140)',      // Green (always)
  '--success-foreground': 'oklch(0.95 0.02 140)',
  '--warning': 'oklch(0.7 0.15 60)',       // Yellow (always)
  '--warning-foreground': 'oklch(0.1 0.02 60)'
};
```

**Note**: Destructive, success, and warning colors use fixed hues across all themes for consistency.

---

### Using Themes in DSL

**Syntax**:
```
theme: themeName
```

**Example**:
```
theme: blue

screen Home:
  container:
    ## Blue Theme
    @[Click Me](Settings)
```

**Effect**: All CSS variables are set to the blue theme values.

---

### Custom Theme Overrides

Users can override specific CSS variables:

**Syntax**:
```
styles:
  --primary: oklch(0.7 0.2 280)
  --primary-foreground: oklch(0.95 0.02 280)
```

**Example**:
```
theme: neutral

styles:
  --primary: oklch(0.7 0.2 280)
  --primary-foreground: oklch(0.95 0.02 280)
  --radius: 1rem

screen Home:
  container:
    ## Custom Purple Primary
    @[Click Me](Settings)
```

**Effect**: Starts with neutral theme, but overrides primary color to purple and border radius to 1rem.

---

## Styling Patterns in Renderers

### Pattern 1: Base Classes + Inline Styles

**Used for**: Most elements

```typescript
export function renderButton(node: AstNode): string {
  const { variant = 'primary', size = 'md', text, target } = node.props;

  // Layer 1: Tailwind classes (structure)
  const classes = buttonStyles[variant][size];

  // Layer 2: CSS variables (appearance)
  const styles = getButtonInlineStyles(variant);

  // Combine
  return `<button class="${classes}" style="${styles}" onclick="${onclick}">${text}</button>`;
}

// Structure: spacing, layout, typography
const buttonStyles = {
  primary: {
    md: 'inline-flex items-center px-4 py-2 rounded-md font-medium transition-colors'
  }
};

// Appearance: colors via CSS variables
function getButtonInlineStyles(variant: string): string {
  switch (variant) {
    case 'primary':
      return 'background-color: var(--primary); color: var(--primary-foreground);';
    case 'secondary':
      return 'background-color: var(--secondary); color: var(--secondary-foreground);';
    default:
      return '';
  }
}
```

---

### Pattern 2: Classes Only (No Color)

**Used for**: Layouts, grids, containers

```typescript
export function renderContainer(node: AstNode): string {
  const { variant = 'container' } = node.props;

  // Only Tailwind classes (no colors needed)
  const classes = layoutStyles[variant];

  const childrenHtml = node.children.map(child => render(child)).join('');

  return `<div class="${classes}">${childrenHtml}</div>`;
}

const layoutStyles = {
  'container': 'max-w-7xl mx-auto px-4',
  'container-narrow': 'max-w-2xl mx-auto px-4',
  'stack': 'flex flex-col gap-4',
  'row-center': 'flex items-center justify-center gap-4'
};
```

---

### Pattern 3: Inline Styles Only (Dynamic Values)

**Used for**: Custom properties, user overrides

```typescript
export function renderCustomElement(node: AstNode): string {
  const { backgroundColor, textColor } = node.props;

  // Only inline styles (no Tailwind classes)
  const styles = `background-color: ${backgroundColor}; color: ${textColor};`;

  return `<div style="${styles}">Content</div>`;
}
```

---

### Pattern 4: Combined Classes + Border Colors

**Used for**: Cards, inputs, bordered elements

```typescript
export function renderCard(node: AstNode): string {
  // Tailwind classes for structure
  const classes = 'rounded-lg border p-6';

  // CSS variables for appearance
  const styles = 'background-color: var(--card); border-color: var(--border); color: var(--card-foreground);';

  const childrenHtml = node.children.map(child => render(child)).join('');

  return `<div class="${classes}" style="${styles}">${childrenHtml}</div>`;
}
```

---

## Critical Styling Rules

### ✅ ALWAYS

1. **Use CSS variables for ALL colors**:
   ```html
   <!-- ✅ Correct -->
   <button style="background-color: var(--primary);">Click</button>

   <!-- ❌ Wrong -->
   <button class="bg-blue-500">Click</button>
   ```

2. **Use Tailwind for structure/spacing only**:
   ```html
   <!-- ✅ Correct -->
   <div class="flex items-center gap-4">

   <!-- ❌ Wrong -->
   <div class="flex items-center gap-4 bg-gray-800">
   ```

3. **Reference semantic tokens**:
   ```css
   /* ✅ Correct */
   color: var(--foreground);
   background-color: var(--card);

   /* ❌ Wrong */
   color: white;
   background-color: #1a1a1a;
   ```

4. **Use OKLCH for custom colors**:
   ```css
   /* ✅ Correct */
   --custom: oklch(0.7 0.15 280);

   /* ❌ Wrong */
   --custom: #8b5cf6;
   ```

---

### ❌ NEVER

1. **Never use hardcoded Tailwind color classes**:
   ```html
   <!-- ❌ Never -->
   <div class="bg-blue-500 text-white">

   <!-- ✅ Use instead -->
   <div style="background-color: var(--primary); color: var(--primary-foreground);">
   ```

2. **Never use dark mode prefixes**:
   ```html
   <!-- ❌ Never -->
   <div class="dark:bg-gray-900">

   <!-- ✅ Use instead -->
   <div style="background-color: var(--background);">
   ```

3. **Never use non-semantic variable names**:
   ```css
   /* ❌ Never */
   --blue-500: oklch(0.7 0.15 220);

   /* ✅ Use instead */
   --primary: oklch(0.7 0.15 220);
   ```

4. **Never mix RGB/HEX with OKLCH**:
   ```css
   /* ❌ Never */
   --primary: #3b82f6;

   /* ✅ Use instead */
   --primary: oklch(0.7 0.15 220);
   ```

---

## Responsive Design

Tailwind's responsive modifiers work automatically:

```typescript
const layoutStyles = {
  'grid-2': 'grid grid-cols-1 md:grid-cols-2 gap-4',
  'grid-3': 'grid grid-cols-1 md:grid-cols-3 gap-4'
};
```

**Behavior**:
- Mobile (default): `grid-cols-1` (single column)
- Desktop (`md:` breakpoint): `grid-cols-2` (two columns)

No media queries needed—Tailwind handles it.

---

## Accessibility Considerations

### Color Contrast

All color pairs are designed for WCAG AA compliance:

```css
/* High contrast pairs */
--primary: oklch(0.7 0.15 220);              /* Lightness: 0.7 */
--primary-foreground: oklch(0.95 0.02 220);  /* Lightness: 0.95 */

/* Contrast ratio: > 7:1 (AAA level) */
```

### Focus Rings

All interactive elements should have focus rings:

```typescript
const classes = 'focus:outline-none focus:ring-2';
const styles = 'focus:ring-color: var(--ring);';
```

---

## Dark Mode Only

Proto-Typed **only supports dark mode**. This simplifies the theming system:

- No `@media (prefers-color-scheme: dark)` queries
- No light mode color definitions
- All colors assume dark background
- Better contrast ratios (light text on dark background)

**Rationale**:
- Most modern tools use dark mode
- Easier to maintain one theme well
- Simpler for users (no mode switching)

---

## Summary

Proto-Typed's styling system:
- **Two-layer approach**: Tailwind (structure) + CSS variables (appearance)
- **Semantic tokens**: Based on shadcn/ui design system
- **OKLCH colors**: Perceptually uniform color space
- **12 themes**: Pre-defined color schemes
- **Custom overrides**: User can override any CSS variable
- **Dark mode only**: Simplified theming
- **Accessible**: High contrast, WCAG compliant

**Key Principle**: Always use CSS variables for colors, never hardcode.
