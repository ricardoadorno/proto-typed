# Proto-Typed: Development Philosophy

## Core Principles

Proto-Typed is built on a set of strong philosophical convictions that guide every design decision. These principles prioritize simplicity, pragmatism, and developer experience over complexity and feature completeness.

---

## 1. Runtime Validation Over Automated Tests

**Philosophy**: The best way to validate functionality is to run the application and see it work.

**What This Means**:

- Manual testing in the browser is the primary validation method
- Automated tests exist but are not the primary focus
- User feedback and real-world usage validate the tool
- Visual inspection catches bugs that tests might miss

**Rationale**:

- Proto-Typed is a visual tool—seeing the output is essential
- DSL changes are often breaking by nature, making tests brittle
- Rapid iteration is more important than test coverage
- The compiler pipeline has clear stages, making bugs easy to isolate

**In Practice**:

```bash
# Development workflow
pnpm dev                    # Start web app
# Edit DSL → See preview → Validate visually
# Iterate rapidly without test maintenance overhead
```

**Not Ignored**:

- Tests exist for critical parsing logic
- TypeScript provides compile-time safety
- ESLint catches common errors
- Manual testing is systematic, not random

**Example**:
Instead of writing 50 unit tests for button rendering:

1. Write 1-2 critical tests for parser correctness
2. Create a visual "kitchen sink" prototype with all button variants
3. Render it in the web app and visually verify
4. Gather user feedback on real prototypes

---

## 2. Simplicity Over Complexity

**Philosophy**: The simplest solution that works is the best solution.

**What This Means**:

- Prefer clear, straightforward code over clever abstractions
- Avoid premature optimization
- Keep the codebase readable for newcomers
- Don't add features "just in case"

**Rationale**:

- Complexity compounds over time
- Simple code is easier to debug and maintain
- Proto-Typed is a small tool with a focused scope
- Users benefit from predictable, understandable behavior

**In Practice**:

- Pure functions for rendering instead of complex class hierarchies
- Flat file structure instead of deep nesting
- Explicit code over implicit magic
- Direct dependencies over abstraction layers

**Example**:

```typescript
// Simple: Direct mapping from NodeType to renderer
const RENDERERS: Record<NodeType, RenderFunction> = {
  Button: (node) => renderButton(node),
  Container: (node) => renderContainer(node),
  // ...
}

// Complex (avoided): Abstract visitor pattern with multiple dispatch
class RenderVisitor implements NodeVisitor {
  visit(node: AstNode): void {
    node.accept(this)
  }
  visitButton(button: ButtonNode): void {
    /* ... */
  }
  visitContainer(container: ContainerNode): void {
    /* ... */
  }
}
```

The simple version is easier to understand, debug, and extend.

---

## 3. Convention Over Configuration

**Philosophy**: Provide sensible defaults and canonical patterns instead of configuration options.

**What This Means**:

- Layouts are **canonical presets** (e.g., `stack-tight`, `row-center`)
- No inline modifiers or dynamic parsing
- Fixed grammar with clear syntax
- Minimal user-facing configuration

**Rationale**:

- Reduces decision fatigue
- Makes the DSL more consistent and predictable
- Easier to learn—fewer options to remember
- Faster parsing—no dynamic rules

**In Practice**:

```
# Canonical layout: stack-tight
stack-tight:
  > Item 1
  > Item 2

# NOT: stack gap-2 (no dynamic modifiers)
```

Each layout has a predefined class mapping:

```typescript
const layoutStyles = {
  stack: 'flex flex-col gap-4',
  'stack-tight': 'flex flex-col gap-2',
  'row-center': 'flex items-center justify-center gap-4',
  // ...
}
```

**Benefits**:

- Users learn 15 layouts instead of infinite combinations
- Consistent output across all prototypes
- No edge cases from unexpected configurations

---

## 4. Mobile-First Design

**Philosophy**: Design for mobile first, scale up to desktop.

**What This Means**:

- Native mobile UI patterns (navigator, drawers, bottom sheets)
- Touch-friendly button sizes
- Vertical-scrolling layouts by default
- Responsive by default (via Tailwind)

**Rationale**:

- Most modern apps prioritize mobile
- Mobile constraints force better UX decisions
- Desktop scaling is easier than mobile shrinking

**In Practice**:

- `navigator:` renders as a bottom navigation bar (mobile pattern)
- Drawers default to bottom sheets
- Default button size is `md` (tap-friendly)
- Containers are responsive without media queries

---

## 5. Dark Mode Only

**Philosophy**: Support one theme well instead of two themes poorly.

**What This Means**:

- No light mode support
- All themes are dark variants
- CSS variables are tuned for dark backgrounds
- Simplified theme system

**Rationale**:

- Most modern tools use dark mode
- Maintaining two modes doubles complexity
- Dark mode is better for prototyping (less eye strain)
- Easier to ensure good contrast ratios

**In Practice**:

```css
:root {
  /* All colors assume dark background */
  --background: oklch(0.12 0.02 220); /* Dark */
  --foreground: oklch(0.95 0.02 220); /* Light text */
  --primary: oklch(0.7 0.15 220); /* Vivid accent */
}
```

**Not a Limitation**:

- Users can override CSS variables if needed
- Exported HTML is just CSS—users can modify it

---

## 6. Semantic Styling Only

**Philosophy**: Use CSS variables for colors, Tailwind for structure.

**What This Means**:

- **NEVER** hardcode colors like `bg-blue-500` or `text-white`
- **ALWAYS** use semantic tokens: `var(--primary)`, `var(--muted-foreground)`
- Tailwind is for spacing, layout, and structure only

**Rationale**:

- Ensures consistent theming across all prototypes
- Users can override theme colors globally
- Follows shadcn/ui design system principles
- Easier to maintain and scale

**Pattern**:

```typescript
// ✅ Correct
const classes = 'px-4 py-2 rounded-md flex items-center'
const styles =
  'background-color: var(--primary); color: var(--primary-foreground);'
return `<button class="${classes}" style="${styles}">Text</button>`

// ❌ Wrong
const classes = 'px-4 py-2 rounded-md bg-blue-500 text-white'
return `<button class="${classes}">Text</button>`
```

**Benefits**:

- Theme changes update all elements automatically
- No hard-to-find color references
- Consistent with modern design systems

---

## 7. No Runtime Framework Dependencies

**Philosophy**: Generated HTML should be pure and portable.

**What This Means**:

- Exported HTML uses vanilla JavaScript only
- No React, Vue, or other framework in output
- Tailwind CSS via CDN (optional)
- Navigation logic is plain DOM manipulation

**Rationale**:

- Portability: HTML works anywhere
- No build step for exported prototypes
- Easier to hand off to non-developers
- Smaller file sizes

**Example Generated Code**:

```html
<script>
  // Pure vanilla JavaScript
  const screens = { Home: 'screen-home-id', Settings: 'screen-settings-id' }

  function navigateTo(screenName) {
    document.querySelectorAll('[data-screen]').forEach((screen) => {
      screen.style.display = 'none'
    })
    document.querySelector(`[data-screen="${screenName}"]`).style.display =
      'block'
    history.pushState({ screen: screenName }, '', `#${screenName}`)
  }
</script>
```

**No Dependencies**:

- No npm install required to view exported HTML
- Open in any browser, works immediately
- Can be hosted anywhere (GitHub Pages, S3, etc.)

---

## 8. Text-Based Workflow

**Philosophy**: Everything is text, version control friendly.

**What This Means**:

- DSL is plain text (`.pty` files)
- No binary formats or databases
- Git-friendly diffs
- Easy to share and collaborate

**Rationale**:

- Version control works natively
- Easy to review changes in pull requests
- No proprietary lock-in
- Text editors work everywhere

**Example**:

```diff
screen Home:
  header:
-   ## Welcome
+   ## Welcome to Proto-Typed

  container:
+   > Get started by creating your first prototype
    @[Get Started](Onboarding)
```

Clear, readable diffs that show exactly what changed.

---

## 9. Fixed Grammar, No Plugins

**Philosophy**: The DSL grammar is fixed and intentionally limited.

**What This Means**:

- No plugin system
- No custom elements
- No user-defined syntax extensions
- Fixed set of supported elements

**Rationale**:

- Keeps the language simple and learnable
- Avoids fragmentation (no "Proto-Typed dialects")
- Easier to maintain and evolve
- Forces focus on core use case (prototyping)

**What You Can't Do** (by design):

- Add custom layout types
- Extend grammar with new syntax
- Create third-party element libraries

**What You Can Do**:

- Use components for reusable UI blocks
- Override CSS variables for styling
- Propose additions to the core grammar

**Analogy**:
Proto-Typed is like Markdown—fixed syntax, widely understood, no dialects.

---

## 10. For Prototyping, Not Production

**Philosophy**: Proto-Typed is a prototyping tool, not a production framework.

**What This Means**:

- Optimized for speed and iteration, not performance
- No state management, API integration, or backend logic
- Visual fidelity matters more than code quality
- Throwaway code is acceptable

**Rationale**:

- Prototypes are temporary by nature
- Production code has different requirements (testing, performance, accessibility)
- Specialization enables better tooling for the specific use case

**Use Cases**:

- ✅ Rapid wireframing
- ✅ User flow testing
- ✅ Stakeholder demos
- ✅ Design handoff
- ❌ Production applications
- ❌ E-commerce sites
- ❌ Complex SPAs with state management

**Analogy**:
Proto-Typed is to production code what Figma is to Photoshop—specialized for the task.

---

## 11. Batteries Included

**Philosophy**: Everything you need to prototype is built-in.

**What This Means**:

- Comprehensive element library (40+ node types)
- 12 pre-defined themes
- Navigation system included
- Component system built-in
- Export functionality ready

**Rationale**:

- Users shouldn't need external tools
- Consistent experience across all prototypes
- Lower barrier to entry
- Faster time to first prototype

**Out of the Box**:

```
screen Home:
  header:
    ## My App

  navigator:
    - [Home](Home) | home
    - [Profile](Profile) | user
    - [Settings](Settings) | settings
```

This just works—no configuration, no setup, no plugins.

---

## 12. Perceptual Uniformity (OKLCH)

**Philosophy**: Use perceptually uniform color spaces for theming.

**What This Means**:

- All theme colors use OKLCH format
- Lightness and chroma scales are perceptually consistent
- Better than HSL for dark mode

**Rationale**:

- Consistent contrast ratios across hues
- Easier to generate harmonious color scales
- Modern CSS standard

**Example**:

```css
:root {
  /* OKLCH: oklch(Lightness Chroma Hue) */
  --primary: oklch(0.7 0.15 220); /* Blue */
  --secondary: oklch(0.6 0.12 280); /* Purple */

  /* Same lightness = same perceived brightness */
  --success: oklch(0.7 0.15 140); /* Green */
  --warning: oklch(0.7 0.15 60); /* Yellow */
}
```

All accent colors have the same lightness (0.7), ensuring consistent visual weight.

---

## 13. TypeScript Strict Mode

**Philosophy**: Type safety everywhere, no escape hatches.

**What This Means**:

- `strict: true` in tsconfig.json
- No `any` types allowed
- Full type coverage for AST nodes
- Type guards for runtime type checking

**Rationale**:

- Catches bugs at compile time
- Better IDE autocomplete and refactoring
- Self-documenting code
- Easier to onboard new contributors

**Example**:

```typescript
// Discriminated union for type safety
type AstNode = ScreenNode | ModalNode | ButtonNode | /* ... */;

interface ScreenNode extends BaseNode {
  type: 'Screen';  // Literal type for discrimination
  props: { name: string };
  children: AstNode[];
}

// Type guard
function isScreen(node: AstNode): node is ScreenNode {
  return node.type === 'Screen';
}

// Usage
if (isScreen(node)) {
  console.log(node.props.name);  // TypeScript knows node is ScreenNode
}
```

---

## 14. Pure Functions for Rendering

**Philosophy**: Renderers should be pure functions with no side effects.

**What This Means**:

- Input: AstNode → Output: HTML string
- No global state mutation
- Deterministic output
- Testable in isolation

**Rationale**:

- Easier to test and debug
- Predictable behavior
- Can be parallelized or memoized
- Composable

**Example**:

```typescript
// Pure function: same input → same output
export function renderButton(node: AstNode): string {
  const { variant = 'primary', size = 'md', text, target } = node.props

  const classes = buttonStyles[variant][size]
  const styles = getButtonInlineStyles(variant)
  const onclick = getOnClickHandler(target)

  return `<button class="${classes}" style="${styles}" onclick="${onclick}">${text}</button>`
}
```

No side effects, no mutations, just transformation.

---

## 15. Pragmatic Over Dogmatic

**Philosophy**: Use the right tool for the job, even if it breaks a rule.

**What This Means**:

- Singleton pattern for RouteManager (state is inherently global)
- Inline styles for CSS variables (easier than external stylesheet)
- Manual testing over 100% coverage (visual validation matters)

**Rationale**:

- Dogma leads to over-engineering
- Practical solutions beat theoretical purity
- Proto-Typed is a small tool—pragmatism wins

**Example**:

```typescript
// Singleton for RouteManager (breaks "avoid singletons" rule)
// But navigation state IS global—this is the pragmatic choice
class RouteManager {
  private static instance: RouteManager
  private screens: Map<string, string> = new Map()

  static getInstance(): RouteManager {
    if (!RouteManager.instance) {
      RouteManager.instance = new RouteManager()
    }
    return RouteManager.instance
  }
}
```

**Not Pragmatic**:

- Passing RouteManager through every function call
- Using dependency injection for a simple tool
- Over-abstracting for "future flexibility"

---

## Philosophy in Action: Design Decisions

### Decision: Canonical Layouts Only

**Philosophical Foundations**:

- **Convention over configuration**: Sensible defaults
- **Simplicity over complexity**: Fixed presets, not dynamic parsing

**Result**:

```typescript
// Each layout is a canonical preset
const layoutStyles = {
  container: 'max-w-7xl mx-auto px-4',
  'container-narrow': 'max-w-2xl mx-auto px-4',
  stack: 'flex flex-col gap-4',
  'stack-tight': 'flex flex-col gap-2',
  // ...
}
```

**Alternative Rejected**:
Dynamic modifiers like `container[max-width: 800px]` would:

- Increase complexity
- Require parsing arbitrary CSS
- Break convention over configuration principle

---

### Decision: No Light Mode

**Philosophical Foundations**:

- **Simplicity over complexity**: Support one theme well
- **Pragmatic over dogmatic**: Most users prefer dark mode

**Result**:

- Single theme system
- Better contrast ratios
- Easier maintenance

**Alternative Rejected**:
Supporting light mode would:

- Double CSS variable definitions
- Require testing both modes
- Complicate theme system
- Provide marginal value (most prototypes use dark mode)

---

### Decision: Manual Testing Priority

**Philosophical Foundations**:

- **Runtime validation over tests**: Visual tools need visual validation
- **Pragmatic over dogmatic**: Fast iteration beats test coverage

**Result**:

- Rapid development velocity
- Visual inspection catches layout bugs
- User feedback validates design

**Alternative Rejected**:
Aiming for 100% test coverage would:

- Slow down iteration
- Create brittle tests (DSL changes often)
- Miss visual bugs (tests can't validate appearance)

---

## Philosophy for Contributors

When contributing to Proto-Typed, ask yourself:

1. **Does this add complexity?** If yes, is it worth it?
2. **Can this be simpler?** Always try the simplest solution first.
3. **Does this follow conventions?** Consistency matters.
4. **Is this a hardcoded color?** Use CSS variables instead.
5. **Can I validate this visually?** Run the app and check the output.
6. **Is this type-safe?** No `any` types allowed.
7. **Is this function pure?** Renderers should be deterministic.
8. **Is this for prototyping?** Don't add production-focused features.

---

## Anti-Patterns to Avoid

Based on these philosophies, here are explicit anti-patterns to avoid:

### ❌ Hardcoded Colors

```typescript
// Bad
return `<button class="bg-blue-500 text-white">Click</button>`

// Good
return `<button class="px-4 py-2" style="background-color: var(--primary); color: var(--primary-foreground);">Click</button>`
```

### ❌ Over-Abstraction

```typescript
// Bad
class AbstractButtonFactory {
  abstract createButton(props: ButtonProps): Button
}

// Good
function renderButton(node: AstNode): string {
  return `<button>${node.props.text}</button>`
}
```

### ❌ Dynamic Parsing for Layouts

```typescript
// Bad
const layoutPattern = /container\[(.*?)\]/

// Good
const layoutStyles = {
  container: 'max-w-7xl mx-auto',
  'container-narrow': 'max-w-2xl mx-auto',
}
```

### ❌ Production-Focused Features

```typescript
// Bad: Adding state management
import { createStore } from 'redux'

// Good: Keep it simple
const screens = { Home: 'home-id' }
```

---

## Summary

Proto-Typed's philosophy can be summarized as:

**"Simplicity, pragmatism, and visual validation over complexity, dogma, and automated testing."**

This philosophy guides every design decision and ensures the tool remains:

- **Easy to learn**: Simple syntax, clear conventions
- **Fast to use**: Rapid iteration, instant feedback
- **Pleasant to maintain**: Clean code, minimal dependencies
- **Focused on prototyping**: Not trying to be a production framework

When in doubt, ask: "Does this make prototyping faster and simpler?" If the answer is no, don't do it.
