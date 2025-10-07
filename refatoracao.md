# Proto-Typed DSL RefactoringO comando AT foi preterido. Use schtasks.exe em seu lugar.



> **📚 This document has been reorganized into a structured documentation set.**  N�o h� suporte para o pedido.

> **See `refactoring/00-INDEX.md` for the complete refactoring plan.**

---

## 📋 Quick Navigation

This refactoring documentation is now split into focused documents:

### Core Documents
- **[00-INDEX.md](./refactoring/00-INDEX.md)** - Master index and overview
- **[01-vision-principles.md](./refactoring/01-vision-principles.md)** - Strategic vision and design principles
- **[02-canonical-layouts.md](./refactoring/02-canonical-layouts.md)** - Layout system refactoring
- **[03-component-binding.md](./refactoring/03-component-binding.md)** - Component prop binding system
- **[04-verbal-inputs.md](./refactoring/04-verbal-inputs.md)** - Input field types and attributes
- **[05-verbal-buttons.md](./refactoring/05-verbal-buttons.md)** - Button variants and sizes
- **[06-text-primitives.md](./refactoring/06-text-primitives.md)** - Typography and primitives
- **[07-grammar-connectors.md](./refactoring/07-grammar-connectors.md)** - Global syntax rules
- **[08-design-tokens.md](./refactoring/08-design-tokens.md)** - Design token system
- **[09-migration-strategy.md](./refactoring/09-migration-strategy.md)** - Migration plan and tooling

---

## 🎯 Summary: Vision

**Current State**: Symbolic/concise syntax (ex.: `row-w50-p4`, `@@+`, `%prop`)

**Target State**: Verbal/semantic syntax with preserved cognitive anchors:
- `@` → Interactivity/Actions (buttons)
- `___` → Input/Entry fields (forms)

**Scope**: 
- ✅ Canonical Layouts (replaces modifier chains)
- ✅ Components with explicit binding (replaces `%` interpolation)
- ✅ Verbal Inputs (replaces symbolic suffixes)
- ✅ Verbal Buttons (replaces @ count + symbols)
- ✅ Text/Primitives/Views (consolidation)
- ✅ Global grammar coherence

**Core Philosophy**: Words over codes, explicit over implicit, canonical over customizable.

---

## 🚀 Getting Started

1. **Read the Vision**: Start with [01-vision-principles.md](./refactoring/01-vision-principles.md)
2. **Understand Components**: Review each feature document (02-09)
3. **Check Implementation Order**: Follow the phased approach in the index
4. **Review Migration Plan**: See [09-migration-strategy.md](./refactoring/09-migration-strategy.md)

---

## 📊 Before/After Quick Reference

| Feature | Current Syntax | New Syntax |
|---------|----------------|------------|
| **Layouts** | `row-w50-center-p4:` | `row-center:`, `card:`, `grid-3:` |
| **Components** | `- John \| john@email.com`<br>`> %name` | `$UserCard: name: John \| email: john@email.com`<br>`> name` |
| **Inputs** | `___*:Password{Enter}` | `___password: Password \| placeholder: Enter` |
| **Buttons** | `@@+[Edit](edit)` | `@outline-md[Edit](edit)` or `@outline[Edit](edit)` |
| **Text** | `#`, `>`, `>>>` | (unchanged) |

---

## ⚡ Implementation Status

- [ ] Phase 1: Foundation (Vision, Grammar, Tokens)
- [ ] Phase 2: Core Systems (Layouts, Components, Inputs, Buttons)
- [ ] Phase 3: Consolidation (Text/Primitives)
- [ ] Phase 4: Migration (Tooling, Documentation)

---

**For detailed technical specifications, implementation guidelines, and migration tools, see the individual documents in `refactoring/`.**
