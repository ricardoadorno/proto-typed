# 07 - Grammar & Connectors

## 🎯 Overview

Define **global syntax rules** and establish **semantic meaning** for punctuation connectors used throughout the DSL.

---

## 🔗 Connector Semantics

### `:` (Colon) - Association

**Meaning**: Associates a **name** with **value** or **content block**

**Usage**:

1. **Layout declarations**:
   ```dsl
   card:
   container-wide:
   stack:
   ```

2. **View declarations**:
   ```dsl
   screen Home:
   modal Dialog:
   drawer Menu:
   ```

3. **Component declarations**:
   ```dsl
   component UserCard:
   ```

4. **Field labels**:
   ```dsl
   ___text: Full Name
   ___email: Email Address
   ```

5. **Prop binding** (key-value):
   ```dsl
   $Card: title: Hello | description: World
   ```

**Rule**: Colon **always** precedes content/value and may trigger indentation.

---

### `|` (Pipe) - Concatenation/Stacking

**Meaning**: Separates **multiple attributes** or **prop values** on the same line

**Usage**:

1. **Input attributes**:
   ```dsl
   ___email: Email | placeholder: you@example.com | required
   ```

2. **Component props**:
   ```dsl
   $UserCard: name: John | email: john@email.com | phone: 555-1234
   ```

3. **Select options**:
   ```dsl
   ___select: Country | options: [USA | Canada | Mexico]
   ```

4. **Navigator items** (if verbal):
   ```dsl
   - label: Home | icon: home | destination: Home
   ```

**Rule**: Pipe **never** starts or ends a line; it's always between values.

---

### `[]` (Brackets) - Visual Labels

**Meaning**: Encloses **user-visible text** (labels, alt text)

**Usage**:

1. **Button labels**:
   ```dsl
   @primary[Click Me]
   @outline-sm[Cancel]
   ```

2. **Link labels**:
   ```dsl
   #[Read More](article)
   ```

3. **Image alt text** (with `!`):
   ```dsl
   ![Logo Image](/logo.png)
   ```

4. **Select options list**:
   ```dsl
   options: [Option1 | Option2 | Option3]
   ```

**Rule**: Brackets **always** contain display text, never code.

---

### `()` (Parentheses) - Destinations/Actions

**Meaning**: Specifies **where to go** or **what to do** on interaction

**Usage**:

1. **Button actions**:
   ```dsl
   @primary[Save](saveAction)
   @outline[Go Back](-1)
   ```

2. **Link destinations**:
   ```dsl
   #[Home](Home)
   #[External](https://example.com)
   ```

3. **FAB actions**:
   ```dsl
   fab{plus}(addItem)
   ```

4. **Navigator destinations** (if positional):
   ```dsl
   - Home{home}(Home)
   ```

**Rule**: Parentheses are **optional** (e.g., button with no action is valid).

---

### `{}` (Braces) - Icons/Metadata

**Meaning**: Specifies **icon names** or **metadata** (non-visible)

**Usage**:

1. **Button icons**:
   ```dsl
   @primary{save}[Save]
   @ghost{menu}(openMenu)
   ```

2. **FAB icons**:
   ```dsl
   fab{plus}(addItem)
   ```

3. **Navigator icons** (if positional):
   ```dsl
   - Home{home}(Home)
   ```

**Rule**: Braces **never** contain user-visible text, only icon names.

---

### `-` (Dash) - List Items

**Meaning**: Marks a **list item** or **array element**

**Usage**:

1. **Simple lists**:
   ```dsl
   list:
     - Item 1
     - Item 2
   ```

2. **Component list instances**:
   ```dsl
   list $Card:
     - title: Card 1 | description: First
     - title: Card 2 | description: Second
   ```

3. **Navigator items**:
   ```dsl
   navigator:
     - label: Home | icon: home | destination: Home
   ```

**Rule**: Dash **must** be at the start of a line (after indentation).

---

### `@` (At Sign) - Interactivity

**Meaning**: Marks **interactive elements** (buttons)

**Usage**:

```dsl
@primary[Click Me]
@outline-sm{icon}[Label](action)
```

**Rule**: Always followed by variant name (verbal).

---

### `___` (Underscores) - Input Fields

**Meaning**: Visual metaphor for **blank space to fill in**

**Usage**:

```dsl
___text: Name
___email: Email | required
___password: Password | reveal-toggle
```

**Rule**: Always followed by field type (verbal).

---

### `#` (Hash) - Headings or Links

**Meaning**: Context-dependent (typography vs. links)

**Usage**:

1. **Headings** (alone or repeated):
   ```dsl
   # Heading 1
   ## Heading 2
   ```

2. **Links** (with brackets):
   ```dsl
   #[Link Text](destination)
   ```

**Rule**: If followed by `[`, it's a link; otherwise, it's a heading.

---

## 📏 Indentation Rules

### Indent-Based Blocks

The DSL uses **indentation** (Python-style) to denote nested content:

```dsl
card:
  # Title
  > Content
  
  stack:
    @primary[Button 1]
    @outline[Button 2]
```

**Rules**:
- **Indent** after `:` for nested content
- **Outdent** to close a block
- Use **2 spaces** (recommended) or tabs consistently

### Tokens

- `Indent` - Increase nesting level
- `Outdent` - Decrease nesting level
- Parser automatically handles indentation via Chevrotain

---

## 🔤 Identifier Rules

### View Names

**Pattern**: PascalCase

```dsl
screen HomePage:
modal ConfirmDialog:
drawer MainMenu:
```

**Rules**:
- Start with uppercase letter
- No spaces, use camelCase or PascalCase

---

### Component Names

**Pattern**: PascalCase

```dsl
component UserCard:
component ProductGrid:

$UserCard: ...
$ProductGrid: ...
```

**Rules**: Same as view names

---

### Prop Names

**Pattern**: camelCase or kebab-case

```dsl
$Card: title: Hello | description: World
$Card: user-name: John | email-address: john@email.com
```

**Rules**:
- Start with lowercase letter
- Use camelCase or kebab-case consistently

---

### Layout Names

**Pattern**: kebab-case

```dsl
container-wide:
stack-tight:
grid-3:
```

**Rules**: Lowercase with dashes (predefined catalog)

---

### Field Types

**Pattern**: lowercase keywords

```dsl
___text:
___email:
___password:
```

**Rules**: Lowercase, no spaces (predefined types)

---

### Button Variants

**Pattern**: lowercase keywords

```dsl
@primary:
@outline:
@destructive:
```

**Rules**: Lowercase, no spaces (predefined variants)

---

## 🧩 Syntax Patterns

### Pattern: Layout Block

```
<layout-name>:
  <content>
  <content>
```

Example:
```dsl
card:
  # Title
  > Content
```

---

### Pattern: View Declaration

```
<view-type> <ViewName>:
  <content>
  <content>
```

Example:
```dsl
screen Home:
  # Welcome
  > Content here
```

---

### Pattern: Component Declaration

```
component <ComponentName>:
  <template>
  <template>
```

Example:
```dsl
component UserCard:
  card:
    # name
    > email
```

---

### Pattern: Component Instantiation

```
$<ComponentName>: <prop>: <value> | <prop>: <value>
```

Example:
```dsl
$UserCard: name: John | email: john@email.com
```

---

### Pattern: Input Field

```
___<type>: <Label> | <attr>: <value> | <flag>
```

Example:
```dsl
___email: Email Address | placeholder: you@example.com | required
```

---

### Pattern: Button

```
@<variant>-<size>[<Label>]{<icon>}(<action>)
```

Example:
```dsl
@primary-lg[Get Started]{arrow-right}(signup)
```

---

### Pattern: List

```
list:
  - <item>
  - <item>
```

Example:
```dsl
list:
  - Simple item text
  - Another item
```

---

### Pattern: Component List

```
list $<ComponentName>:
  - <prop>: <value> | <prop>: <value>
  - <prop>: <value> | <prop>: <value>
```

Example:
```dsl
list $UserCard:
  - name: Alice | email: alice@email.com
  - name: Bob | email: bob@email.com
```

---

## 🚨 Syntax Errors

### Common Mistakes

1. **Missing colon**:
   ```dsl
   card  ← ERROR (should be card:)
   ```

2. **Pipe at start/end**:
   ```dsl
   ___text: Name | | required  ← ERROR (double pipe)
   ___text: Name |  ← ERROR (trailing pipe)
   ```

3. **Mixed brackets**:
   ```dsl
   @primary(Click Me]  ← ERROR (mismatched)
   ```

4. **Missing label**:
   ```dsl
   @primary(action)  ← ERROR (no label)
   @primary[Label](action)  ← OK
   ```

5. **Inconsistent indentation**:
   ```dsl
   card:
     # Title
       > Content  ← ERROR (extra indent)
   ```

---

## 📋 Checklist

### Grammar Rules
- [ ] Document all connector semantics
- [ ] Define identifier naming conventions
- [ ] Specify indentation rules
- [ ] List common syntax errors

### Parser
- [ ] Enforce colon after declarations
- [ ] Validate pipe usage (no start/end)
- [ ] Check bracket/paren/brace matching
- [ ] Handle indentation consistently

### Error Messages
- [ ] Clear error for missing colon
- [ ] Helpful suggestion for mismatched brackets
- [ ] Indentation error with line numbers
- [ ] Unknown identifier with suggestions

### Documentation
- [ ] Syntax cheatsheet with all connectors
- [ ] Pattern reference for each element type
- [ ] Error troubleshooting guide

---

**Next**: See [08 - Design Tokens](./08-design-tokens.md) for CSS/class token mappings.