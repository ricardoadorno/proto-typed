# 01 - Vision & Principles

## 🎯 Strategic Vision

### The Problem with Current Syntax

The current Proto-Typed DSL uses **symbolic/concise syntax** that optimizes for brevity over clarity:

```dsl
row-w50-center-p4:
  @@+[Edit](edit)
  ___*:Password{Enter}

component UserCard:
  > %name - %email

$UserCard:
  - John | john@email.com
```

**Issues**:
- Requires memorization of symbols (`@@+`, `*`, `%`, `-w50`)
- Modifier chains are cryptic (`row-w50-center-p4`)
- Positional props lack clarity
- Steep learning curve for non-technical users

### The Refactoring Vision

Transform to **verbal/semantic syntax** that uses words over codes:

```dsl
card:
  @outline-sm[Edit](edit)
  ___password: Password | placeholder: Enter

component UserCard:
  > name - email

$UserCard: name: John | email: john@email.com
```

**Benefits**:
- Self-documenting syntax
- Cognitive anchors preserved (`@` = action, `___` = input)
- Explicit binding over positional
- Lower learning curve

---

## 🧭 Core Design Principles

### 1. **Verbal Over Symbolic**

Replace cryptic codes with readable words:
- ❌ `@@+` → ✅ `@outline-sm`
- ❌ `row-w50-center-p4` → ✅ `card`, `grid-3`
- ❌ `___*` → ✅ `___password`

### 2. **Preserve Cognitive Anchors**

Keep icons that carry strong mental models:
- `@` → Interactivity/Actions (buttons)
- `___` → Input fields (visual "blank space")

### 3. **Explicit Over Implicit**

Make relationships visible:
- ❌ `- John | john@email.com` (position-based) → ✅ `name: John | email: john@email.com` (named)
- ❌ `%name` (interpolation symbol) → ✅ `name` (placeholder identifier)

### 4. **Canonical Over Customizable**

Provide presets that cover 90% of use cases:
- ❌ `row-w50-center-p4-gap-2-m-4` (infinite combinations) → ✅ `card`, `grid-3`, `stack-gap-4` (curated catalog)

### 5. **Consistent Connectors**

Establish semantic meaning for punctuation:
- `:` → Association (name → value)
- `|` → Concatenation (multiple attributes)
- `[]` → Visual labels
- `()` → Destinations/Actions

---

## 📐 Architectural Principles

### Layered Changes

```
┌─────────────────────────────────────────┐
│  DSL Syntax (User-Facing)               │  ← Primary changes
├─────────────────────────────────────────┤
│  Lexer/Tokens                           │  ← Token pattern updates
├─────────────────────────────────────────┤
│  Parser/Grammar                         │  ← Grammar rule changes
├─────────────────────────────────────────┤
│  AST Structure                          │  ← Node type adjustments
├─────────────────────────────────────────┤
│  Renderer/HTML                          │  ← Output mapping
├─────────────────────────────────────────┤
│  Design Tokens                          │  ← CSS/class mappings
└─────────────────────────────────────────┘
```

### Non-Breaking Evolution

- **Phase 1**: Introduce new syntax alongside old
- **Phase 2**: Emit warnings for deprecated patterns
- **Phase 3**: Provide migration tools
- **Phase 4**: Remove old syntax (major version)

### Parser Strategy

**Tolerant Parsing** during transition:
```typescript
// Accept both syntaxes temporarily
Button ::= ButtonOld | ButtonNew
ButtonOld ::= "@@" Variant "[" Label "]"  // emit warning
ButtonNew ::= "@" VerbalVariant "-" Size "[" Label "]"
```

---

## 🎓 Learning Curve Optimization

### Target Audiences

1. **Designers** - Visual thinkers, prefer clear names over codes
2. **Product Managers** - Need readable syntax for collaboration
3. **Developers** - Appreciate consistency and predictability

### Readability Goals

**Sentence-like structure**:
```dsl
___email: Email Address | placeholder: user@example.com | required

@primary-lg[Submit Form](submitAction)
```

Reads almost like: "Email input labeled 'Email Address' with placeholder 'user@example.com', required. Primary large button labeled 'Submit Form' calling submitAction."

**Self-discovery**:
- IntelliSense shows: `@primary`, `@outline`, `@destructive`
- Auto-complete suggests: `___text`, `___email`, `___password`
- Documentation examples use real words

---

## ✅ Success Criteria

### Quantitative Metrics

- [ ] **50% reduction** in syntax documentation length
- [ ] **<5 symbols** memorization required (currently ~15+)
- [ ] **100% backward compatibility** during transition period
- [ ] **Zero performance degradation** in parser/renderer

### Qualitative Metrics

- [ ] New users can create basic screens **without documentation**
- [ ] Syntax reads like **natural language descriptions**
- [ ] Error messages are **self-explanatory**
- [ ] Migration from old syntax is **automated**

### Technical Validation

- [ ] All existing examples render identically
- [ ] Parser warnings guide users to new syntax
- [ ] Monaco IntelliSense supports both syntaxes
- [ ] HTML output remains unchanged (same classes/structure)

---

## 🚧 Constraints & Boundaries

### What Changes

- ✅ DSL syntax (user-facing text)
- ✅ Token patterns and parser grammar
- ✅ AST node properties (e.g., `variant` values)
- ✅ Documentation and examples

### What Stays the Same

- ❌ Renderer output (HTML structure, classes)
- ❌ shadcn theming system
- ❌ Navigation semantics
- ❌ Component instantiation logic (only prop syntax changes)
- ❌ Editor infrastructure (Monaco, error handling)

### Technology Stack Stability

- **Chevrotain**: No version changes
- **React/TypeScript**: No framework changes
- **Tailwind/shadcn**: No styling system changes
- **Monaco Editor**: Language definition updates only

---

## 🗺️ Roadmap

### Phase 1: Foundation (Weeks 1-2)
- [ ] Finalize canonical layout catalog
- [ ] Define verbal token dictionaries (variants, sizes, types)
- [ ] Update grammar documentation

### Phase 2: Core Implementation (Weeks 3-6)
- [ ] Implement layout presets (02-canonical-layouts.md)
- [ ] Refactor component binding (03-component-binding.md)
- [ ] Update input system (04-verbal-inputs.md)
- [ ] Migrate button syntax (05-verbal-buttons.md)

### Phase 3: Integration (Weeks 7-8)
- [ ] Consolidate text/primitives (06-text-primitives.md)
- [ ] Enforce grammar rules (07-grammar-connectors.md)
- [ ] Map design tokens (08-design-tokens.md)

### Phase 4: Migration (Weeks 9-10)
- [ ] Build migration tooling (09-migration-strategy.md)
- [ ] Update all examples
- [ ] Release with backward compatibility

---

## 📚 References

- **Current Syntax**: See `copilot-instructions.md`
- **Architecture**: Renderer layered design
- **Theming**: shadcn-based CSS variables
- **Parsing**: Chevrotain lexer/parser pattern

---

**Next Steps**: Review [02 - Canonical Layouts](./02-canonical-layouts.md) for the first major syntax change.
