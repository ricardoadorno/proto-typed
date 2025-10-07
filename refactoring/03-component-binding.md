# 03 - Component Binding System

## 🎯 Overview

Replace **positional prop binding** with **explicit named binding**, eliminating the `%` symbol and making component usage self-documenting.

### The Change

**Before** (Positional with `%`):
```dsl
component UserCard:
  card:
    # %name
    > Email: %email
    > Phone: %phone

$UserCard:
  - John Doe | john@email.com | 555-1234
  - Jane Smith | jane@email.com | 555-5678
```

**After** (Named Binding):
```dsl
component UserCard:
  card:
    # name
    > Email: email
    > Phone: phone

$UserCard: name: John Doe | email: john@email.com | phone: 555-1234
$UserCard: name: Jane Smith | email: jane@email.com | phone: 555-5678
```

---

## 📋 Syntax Specification

### Component Definition

**Pattern**: `component <Name>:`

Inside the component body, use **plain identifiers** as placeholders:

```dsl
component ProductCard:
  card:
    # title
    > price
    > description
    @primary[Buy](buyAction)
```

**Rules**:
- Identifiers are kebab-case or camelCase
- No `%` prefix needed
- Identifiers represent data slots

### Component Instantiation

#### Single Instance with Props

**Pattern**: `$<Name>: prop: value | prop: value | ...`

```dsl
$ProductCard: title: Laptop | price: $999 | description: High-performance laptop
```

**Rules**:
- Props on **single line** after component name
- Format: `propName: propValue`
- Multiple props separated by `|`
- Whitespace around `:` and `|` is trimmed

#### List of Instances

**Pattern**: `list $<Name>:`

```dsl
list $ProductCard:
  - title: Laptop | price: $999 | description: High-performance
  - title: Mouse | price: $29 | description: Wireless mouse
  - title: Keyboard | price: $79 | description: Mechanical keyboard
```

**Rules**:
- Each list item starts with `-`
- Props follow same format as single instance
- Indentation required

---

## 🔄 Prop Interpolation

### In Component Template

Placeholders are **plain identifiers** matching prop names:

```dsl
component ContactCard:
  card:
    row-between:
      stack-tight:
        # name
        > role
      @ghost[Edit](editContact)
    > Email: email
    > Phone: phone
```

### At Instantiation

Props are provided as **key-value pairs**:

```dsl
$ContactCard: name: Alice | role: Engineer | email: alice@co.com | phone: 555-0001
```

### Interpolation Rules

1. **Exact match**: Placeholder `name` matches prop `name`
2. **Text replacement**: Entire text node replaced if it's only the placeholder
3. **Inline replacement**: Placeholder within text replaced with value

**Examples**:

```dsl
# name              → <h1>Alice</h1>
> Email: email      → <p>Email: alice@co.com</p>
> role at company   → <p>Engineer at company</p>
```

---

## 🛠️ Technical Implementation

### 1. Token Definition

**File**: `src/core/lexer/tokens/components.tokens.ts`

```typescript
import { createToken } from 'chevrotain';

// Component definition
export const Component = createToken({ 
  name: 'Component', 
  pattern: /component\s+([a-zA-Z][a-zA-Z0-9]*):/ 
});

// Component instantiation (simple)
export const ComponentUse = createToken({ 
  name: 'ComponentUse', 
  pattern: /\$([a-zA-Z][a-zA-Z0-9]*)/ 
});

// Prop binding (key: value)
export const PropBinding = createToken({ 
  name: 'PropBinding', 
  pattern: /([a-zA-Z][a-zA-Z0-9-_]*)\s*:\s*([^|]+)/ 
});

// Prop separator
export const PropSeparator = createToken({ 
  name: 'PropSeparator', 
  pattern: /\|/ 
});
```

### 2. Parser Rule

**File**: `src/core/parser/parser.ts`

```typescript
// Component definition
private componentDefinition(): void {
  this.CONSUME(Component); // component Name:
  this.CONSUME(Indent);
  this.MANY(() => this.SUBRULE(this.element)); // template content
  this.CONSUME(Outdent);
}

// Component instantiation (single)
private componentUse(): void {
  this.CONSUME(ComponentUse); // $ComponentName
  this.OPTION(() => {
    this.CONSUME(Colon); // :
    this.AT_LEAST_ONE_SEP({
      SEP: PropSeparator, // |
      DEF: () => this.CONSUME(PropBinding) // prop: value
    });
  });
}

// Component list
private componentList(): void {
  this.CONSUME(List); // list
  this.CONSUME(ComponentUse); // $ComponentName
  this.CONSUME(Colon); // :
  this.CONSUME(Indent);
  this.AT_LEAST_ONE(() => {
    this.CONSUME(ListItem); // -
    this.AT_LEAST_ONE_SEP({
      SEP: PropSeparator, // |
      DEF: () => this.CONSUME(PropBinding) // prop: value
    });
  });
  this.CONSUME(Outdent);
}
```

### 3. AST Builder

**File**: `src/core/parser/builders/components.builders.ts`

```typescript
interface ComponentDefNode extends AstNode {
  type: 'ComponentDefinition';
  props: { name: string };
  children: AstNode[]; // template
}

interface ComponentUseNode extends AstNode {
  type: 'ComponentUse';
  props: { 
    componentName: string;
    bindings: Record<string, string>; // { prop: value }
  };
  children: [];
}

export function buildComponentDefinition(ctx: Context): ComponentDefNode {
  const match = ctx.Component[0].image.match(/component\s+([a-zA-Z][a-zA-Z0-9]*):/);
  const name = match?.[1] || '';
  
  return {
    type: 'ComponentDefinition',
    id: generateId('component-def'),
    props: { name },
    children: ctx.element?.map(buildElement) || []
  };
}

export function buildComponentUse(ctx: Context): ComponentUseNode {
  const match = ctx.ComponentUse[0].image.match(/\$([a-zA-Z][a-zA-Z0-9]*)/);
  const componentName = match?.[1] || '';
  
  // Parse prop bindings
  const bindings: Record<string, string> = {};
  
  if (ctx.PropBinding) {
    ctx.PropBinding.forEach(token => {
      const propMatch = token.image.match(/([a-zA-Z][a-zA-Z0-9-_]*)\s*:\s*(.+)/);
      if (propMatch) {
        const [, key, value] = propMatch;
        bindings[key.trim()] = value.trim();
      }
    });
  }
  
  return {
    type: 'ComponentUse',
    id: generateId('component-use'),
    props: { componentName, bindings },
    children: []
  };
}

export function buildComponentList(ctx: Context): AstNode {
  const match = ctx.ComponentUse[0].image.match(/\$([a-zA-Z][a-zA-Z0-9]*)/);
  const componentName = match?.[1] || '';
  
  // Parse each list item
  const items: ComponentUseNode[] = [];
  
  ctx.ListItem?.forEach((_, index) => {
    const bindings: Record<string, string> = {};
    
    // Get prop bindings for this list item
    const itemBindings = ctx.PropBinding?.[index];
    if (itemBindings) {
      // Parse all bindings for this item
      itemBindings.forEach(token => {
        const propMatch = token.image.match(/([a-zA-Z][a-zA-Z0-9-_]*)\s*:\s*(.+)/);
        if (propMatch) {
          const [, key, value] = propMatch;
          bindings[key.trim()] = value.trim();
        }
      });
    }
    
    items.push({
      type: 'ComponentUse',
      id: generateId('component-use'),
      props: { componentName, bindings },
      children: []
    });
  });
  
  return {
    type: 'List',
    id: generateId('list'),
    props: { componentBased: true },
    children: items
  };
}
```

### 4. Renderer

**File**: `src/core/renderer/nodes/components.node.ts`

```typescript
// Store component definitions
const componentRegistry: Map<string, AstNode[]> = new Map();

export function registerComponent(name: string, template: AstNode[]): void {
  componentRegistry.set(name, template);
}

export function renderComponentDefinition(node: AstNode): string {
  const { name } = node.props as any;
  registerComponent(name, node.children);
  return ''; // Definitions don't render, just register
}

export function renderComponentUse(node: AstNode, _render: RenderFunction): string {
  const { componentName, bindings } = node.props as any;
  
  // Get component template
  const template = componentRegistry.get(componentName);
  if (!template) {
    return `<!-- Component ${componentName} not found -->`;
  }
  
  // Clone template and interpolate props
  const interpolated = interpolateProps(template, bindings, _render);
  
  return interpolated;
}

function interpolateProps(
  nodes: AstNode[], 
  bindings: Record<string, string>,
  _render: RenderFunction
): string {
  return nodes.map(node => {
    // Handle text nodes with placeholders
    if (node.type === 'Paragraph' || node.type === 'Text' || node.type === 'Heading') {
      let text = node.props.text as string;
      
      // Replace placeholders
      Object.entries(bindings).forEach(([key, value]) => {
        // Exact match (entire text is placeholder)
        if (text.trim() === key) {
          text = value;
        } else {
          // Inline match (placeholder within text)
          const regex = new RegExp(`\\b${key}\\b`, 'g');
          text = text.replace(regex, value);
        }
      });
      
      // Render with interpolated text
      return _render({ ...node, props: { ...node.props, text } });
    }
    
    // Recursively process children
    if (node.children && node.children.length > 0) {
      const interpolatedChildren = interpolateProps(node.children, bindings, _render);
      // This is tricky - need to reconstruct the parent with interpolated children
      // For now, render parent and replace children content
      const rendered = _render(node);
      // TODO: Better child replacement strategy
      return rendered;
    }
    
    return _render(node);
  }).join('');
}
```

### 5. Type Definitions

**File**: `src/types/ast-node.ts`

```typescript
export interface ComponentDefinitionNode extends AstNode {
  type: 'ComponentDefinition';
  props: { name: string };
  children: AstNode[]; // template
}

export interface ComponentUseNode extends AstNode {
  type: 'ComponentUse';
  props: { 
    componentName: string;
    bindings: Record<string, string>;
  };
  children: [];
}
```

---

## 🧪 Examples

### Example 1: User Card

**Definition**:
```dsl
component UserCard:
  card:
    row-between:
      stack-tight:
        # name
        > role
      @ghost{more-vertical}(showMenu)
    > email
    > phone
```

**Usage (Single)**:
```dsl
$UserCard: name: Alice Johnson | role: Senior Engineer | email: alice@company.com | phone: 555-0123
```

**Usage (List)**:
```dsl
list $UserCard:
  - name: Alice Johnson | role: Senior Engineer | email: alice@company.com | phone: 555-0123
  - name: Bob Smith | role: Product Manager | email: bob@company.com | phone: 555-0124
  - name: Carol White | role: Designer | email: carol@company.com | phone: 555-0125
```

### Example 2: Product Card

**Definition**:
```dsl
component ProductCard:
  card:
    ![product image](imageUrl)
    # title
    ## price
    > description
    row-end:
      @primary[Add to Cart](addToCart)
```

**Usage**:
```dsl
grid-3:
  $ProductCard: title: Laptop | price: $999 | description: High-performance laptop | imageUrl: /laptop.jpg
  $ProductCard: title: Mouse | price: $29 | description: Wireless mouse | imageUrl: /mouse.jpg
  $ProductCard: title: Keyboard | price: $79 | description: Mechanical keyboard | imageUrl: /keyboard.jpg
```

### Example 3: Stat Card

**Definition**:
```dsl
component StatCard:
  card-compact:
    > label
    # value
    > change
```

**Usage**:
```dsl
grid-4:
  $StatCard: label: Total Users | value: 1,234 | change: +12% this month
  $StatCard: label: Revenue | value: $45,678 | change: +8% this month
  $StatCard: label: Active Sessions | value: 89 | change: -3% this month
  $StatCard: label: Conversion Rate | value: 3.2% | change: +0.5% this month
```

---

## 🔄 Migration Strategy

### Automatic Migration Tool

```typescript
function migrateComponentSyntax(oldDsl: string): string {
  let newDsl = oldDsl;
  
  // Step 1: Remove % from template placeholders
  newDsl = newDsl.replace(/%([a-zA-Z][a-zA-Z0-9_-]*)/g, '$1');
  
  // Step 2: Convert positional instantiation to named
  // Pattern: - Value1 | Value2 | Value3
  // Need component definition to infer prop names
  // This requires AST analysis - complex migration
  
  return newDsl;
}
```

### Manual Migration Guide

1. **Update component definitions**:
   - Remove `%` from all placeholders
   - Optionally add `props:` declaration for clarity

2. **Update component instantiations**:
   - Single: Add prop names: `$Card: title: X | desc: Y`
   - List: Add prop names to each item: `- title: X | desc: Y`

3. **Verify interpolation**:
   - Check that prop names match placeholders exactly
   - Test with various data values

---

## 📋 Checklist

### Lexer
- [ ] Define `Component`, `ComponentUse`, `PropBinding` tokens
- [ ] Update token export list

### Parser
- [ ] Add `componentDefinition()` rule
- [ ] Add `componentUse()` rule (single)
- [ ] Add `componentList()` rule
- [ ] Handle prop binding parsing

### AST Builder
- [ ] Build `ComponentDefinitionNode` with name and template
- [ ] Build `ComponentUseNode` with bindings map
- [ ] Parse prop bindings into key-value pairs

### Renderer
- [ ] Create component registry (Map)
- [ ] Implement `renderComponentDefinition()` (register only)
- [ ] Implement `renderComponentUse()` with interpolation
- [ ] Handle placeholder replacement (exact + inline)
- [ ] Recursively process nested nodes

### Types
- [ ] Define `ComponentDefinitionNode` interface
- [ ] Define `ComponentUseNode` interface
- [ ] Update `NodeType` union

### Documentation
- [ ] Update component examples
- [ ] Document prop binding syntax
- [ ] Create migration guide

### Testing
- [ ] Test simple placeholders (exact match)
- [ ] Test inline placeholders (within text)
- [ ] Test list instantiation
- [ ] Test nested components
- [ ] Verify registry isolation

---

**Next**: See [04 - Verbal Inputs](./04-verbal-inputs.md) for type-explicit form fields.
