# Proto-Typed DSL Refactoring - Master Index

## 📋 Overview

This refactoring transforms Proto-Typed from a **symbolic/concise syntax** to a **verbal/semantic syntax**, making the language more intuitive and readable while preserving cognitive anchors for key interactions.

### Core Philosophy Shift

**Before**: `row-w50-center-p4:`, `@@+[Text]`, `%propName`  
**After**: `container-wide:`, `@outline-sm[Text]`, `name: John`

**Preserved Icons**:
- `@` → Interactivity/Actions (buttons)
- `___` → Input/Entry fields

### Scope

- ✅ Canonical Layouts (replaces Structures)
- ✅ Components with explicit binding
- ✅ Verbal Inputs
- ✅ Verbal Buttons
- ✅ Text/Primitives/Views consolidation
- ✅ Global grammar coherence

---

## 📚 Refactoring Documents

### [01 - Vision & Principles](./01-vision-principles.md)
Strategic overview, design philosophy, and success criteria for the refactoring.

### [02 - Canonical Layouts](./02-canonical-layouts.md)
Migration from modifier-based layouts to preset canonical layouts.
- Catalog of layouts (`card:`, `grid-3:`, `stack-gap-4:`)
- Parser/AST/Renderer changes
- Migration examples

### [03 - Component Binding System](./03-component-binding.md)
Explicit prop binding replacing positional `%` interpolation.
- New syntax: `$UserCard: name: John | email: john@email.com`
- Template placeholder system
- Parser/AST/Renderer changes

### [04 - Verbal Inputs](./04-verbal-inputs.md)
Type-explicit input fields with attributes.
- Pattern: `___text: Name | placeholder: Your name`
- Type system (`text`, `email`, `password`, `date`)
- Automatic select promotion via `options:`

### [05 - Verbal Buttons](./05-verbal-buttons.md)
Word-based button variants and sizes.
- Pattern: `@primary-lg[Save](save)`
- Variants: `primary`, `outline`, `destructive`, `link`, etc.
- Size modifiers: `xs`, `sm`, `md`, `lg`

### [06 - Text & Primitives](./06-text-primitives.md)
Consolidation of typography, links, images, and views.
- Text levels review
- Link/Image syntax (`#[Label](target)`, `![Alt](src)`)
- Screen/Modal/Drawer stability

### [07 - Grammar & Connectors](./07-grammar-connectors.md)
Global syntax rules and connector semantics.
- `:` → Association (name → value)
- `|` → Concatenation/Stacking
- `[]` → Visual labels
- `()` → Destination/Action

### [08 - Design Tokens](./08-design-tokens.md)
Token system for buttons, inputs, and layouts.
- `btn.variant.*`, `btn.size.*`
- `field.kind.*`
- `layout.*` presets

### [09 - Migration Strategy](./09-migration-strategy.md)
Backward compatibility and migration tooling.
- Parser tolerance for old syntax
- Warning system
- Automated migration utilities

---

## 🎯 Implementation Order

**Phase 1**: Foundation (01, 07, 08)  
**Phase 2**: Core Systems (02, 03, 04, 05)  
**Phase 3**: Consolidation (06)  
**Phase 4**: Migration (09)

---

## 📊 Current vs. New Syntax Comparison

| Feature | Current | New |
|---------|---------|-----|
| **Layouts** | `row-w50-center-p4:` | `card:`, `grid-3:`, `container-wide:` |
| **Components** | `- John \| john@email.com`<br>`> %name` | `$UserCard: name: John \| email: john@email.com`<br>`> name` |
| **Inputs** | `___*:Password{Enter}` | `___password: Password \| placeholder: Enter` |
| **Buttons** | `@@+[Edit]` | `@outline-sm[Edit]` |
| **Text** | `#`, `>`, `>>`, `>>>` | (unchanged, reviewed) |

---

## 🚀 Getting Started

1. Read [01 - Vision & Principles](./01-vision-principles.md) for strategic context
2. Review individual feature documents (02-08) for technical details
3. Check [09 - Migration Strategy](./09-migration-strategy.md) for backward compatibility
4. Follow implementation order above

---

**Status**: Planning Phase  
**Last Updated**: 2025-10-07
