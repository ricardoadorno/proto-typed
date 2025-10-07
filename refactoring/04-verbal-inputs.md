# 04 - Verbal Inputs

## 🎯 Overview

Replace cryptic input suffixes with **explicit type keywords**, making form fields self-documenting and easier to understand.

### The Change

**Before** (Symbolic Suffixes):
```dsl
___:Email{Enter email}
___*:Password{Enter password}
___-:Disabled{Can't edit}
___:Country{Select}[USA | Canada | Mexico]
```

**After** (Verbal Types):
```dsl
___text: Email | placeholder: Enter email
___password: Password | placeholder: Enter password
___text: Disabled | disabled
___select: Country | options: [USA | Canada | Mexico]
```

---

## 📋 Input Types

### Text Input

**Pattern**: `___text: Label | attributes`

```dsl
___text: Full Name | placeholder: John Doe
___text: Username | placeholder: username | required
___text: Search | placeholder: Search... | clearable
```

**Attributes**:
- `placeholder: <text>` - Placeholder text
- `value: <text>` - Default value
- `hint: <text>` - Help text below input
- `required` - Required field (flag)
- `disabled` - Disabled state (flag)
- `readonly` - Read-only (flag)
- `clearable` - Show clear button (flag)

**Renders to**: `<input type="text" />`

---

### Email Input

**Pattern**: `___email: Label | attributes`

```dsl
___email: Email Address | placeholder: user@example.com | required
___email: Contact Email | hint: We'll never share your email
```

**Attributes**: Same as text + browser validation

**Renders to**: `<input type="email" />`

---

### Password Input

**Pattern**: `___password: Label | attributes`

```dsl
___password: Password | placeholder: Enter password | required
___password: Confirm Password | reveal-toggle
___password: New Password | hint: Must be 8+ characters | required
```

**Attributes**: Same as text + `reveal-toggle` for show/hide button

**Renders to**: `<input type="password" />`

---

### Date Input

**Pattern**: `___date: Label | attributes`

```dsl
___date: Birthday | hint: Choose from calendar
___date: Start Date | min: 2025-01-01 | max: 2025-12-31
___date: Appointment | value: 2025-10-15 | required
```

**Attributes**:
- All text attributes
- `min: <date>` - Minimum date (YYYY-MM-DD)
- `max: <date>` - Maximum date (YYYY-MM-DD)

**Renders to**: `<input type="date" />`

---

### Number Input

**Pattern**: `___number: Label | attributes`

```dsl
___number: Age | min: 0 | max: 120 | required
___number: Quantity | value: 1 | step: 1
___number: Price | placeholder: 0.00 | step: 0.01
```

**Attributes**:
- All text attributes
- `min: <number>` - Minimum value
- `max: <number>` - Maximum value
- `step: <number>` - Increment step

**Renders to**: `<input type="number" />`

---

### Select Dropdown

**Pattern**: `___select: Label | options: [Option1 | Option2 | ...]`

```dsl
___select: Country | options: [USA | Canada | Mexico | UK]
___select: State | options: [CA | NY | TX] | required
___select: Size | options: [Small | Medium | Large] | value: Medium
```

**Special Attributes**:
- `options: [...]` - **Required** list of choices
- `multiple` - Allow multiple selection (flag)
- `clearable` - Allow clearing selection (flag)

**Renders to**: `<select>` with `<option>` elements

---

### Textarea

**Pattern**: `___textarea: Label | attributes`

```dsl
___textarea: Bio | placeholder: Tell us about yourself | rows: 4
___textarea: Comments | hint: Max 500 characters | required
___textarea: Description | value: Default text here
```

**Attributes**:
- All text attributes
- `rows: <number>` - Number of visible rows
- `cols: <number>` - Number of visible columns (optional)

**Renders to**: `<textarea>`

---

### URL Input

**Pattern**: `___url: Label | attributes`

```dsl
___url: Website | placeholder: https://example.com
___url: Portfolio | hint: Must be a valid URL | required
```

**Attributes**: Same as text + browser URL validation

**Renders to**: `<input type="url" />`

---

### Tel Input

**Pattern**: `___tel: Label | attributes`

```dsl
___tel: Phone Number | placeholder: (555) 123-4567
___tel: Mobile | pattern: [0-9]{3}-[0-9]{3}-[0-9]{4}
```

**Attributes**:
- All text attributes
- `pattern: <regex>` - Validation pattern

**Renders to**: `<input type="tel" />`

---

## 🎚️ Checkbox & Radio (Unchanged)

These already have clear syntax and will remain as-is:

```dsl
[X] Checked checkbox
[ ] Unchecked checkbox

(X) Selected radio option
( ) Unselected radio option
```

---

## 🛠️ Technical Implementation

### 1. Token Definition

**File**: `src/core/lexer/tokens/inputs.tokens.ts`

```typescript
import { createToken } from 'chevrotain';

// Base field token pattern: ___<type>: Label | attributes
export const FieldText = createToken({ 
  name: 'FieldText', 
  pattern: /___text:/ 
});

export const FieldEmail = createToken({ 
  name: 'FieldEmail', 
  pattern: /___email:/ 
});

export const FieldPassword = createToken({ 
  name: 'FieldPassword', 
  pattern: /___password:/ 
});

export const FieldDate = createToken({ 
  name: 'FieldDate', 
  pattern: /___date:/ 
});

export const FieldNumber = createToken({ 
  name: 'FieldNumber', 
  pattern: /___number:/ 
});

export const FieldSelect = createToken({ 
  name: 'FieldSelect', 
  pattern: /___select:/ 
});

export const FieldTextarea = createToken({ 
  name: 'FieldTextarea', 
  pattern: /___textarea:/ 
});

export const FieldUrl = createToken({ 
  name: 'FieldUrl', 
  pattern: /___url:/ 
});

export const FieldTel = createToken({ 
  name: 'FieldTel', 
  pattern: /___tel:/ 
});

// Attribute tokens
export const FieldLabel = createToken({ 
  name: 'FieldLabel', 
  pattern: /([^|]+)/ 
});

export const FieldAttribute = createToken({ 
  name: 'FieldAttribute', 
  pattern: /([a-z]+):\s*([^|]+)/ 
});

export const FieldFlag = createToken({ 
  name: 'FieldFlag', 
  pattern: /(required|disabled|readonly|clearable|multiple|reveal-toggle)/ 
});

export const FieldOptions = createToken({ 
  name: 'FieldOptions', 
  pattern: /options:\s*\[([^\]]+)\]/ 
});

// Pipe separator
export const Pipe = createToken({ 
  name: 'Pipe', 
  pattern: /\|/ 
});
```

### 2. Parser Rule

**File**: `src/core/parser/parser.ts`

```typescript
private inputField(): void {
  // Match field type
  this.OR([
    { ALT: () => this.CONSUME(FieldText) },
    { ALT: () => this.CONSUME(FieldEmail) },
    { ALT: () => this.CONSUME(FieldPassword) },
    { ALT: () => this.CONSUME(FieldDate) },
    { ALT: () => this.CONSUME(FieldNumber) },
    { ALT: () => this.CONSUME(FieldSelect) },
    { ALT: () => this.CONSUME(FieldTextarea) },
    { ALT: () => this.CONSUME(FieldUrl) },
    { ALT: () => this.CONSUME(FieldTel) },
  ]);
  
  // Parse label (required)
  this.CONSUME(FieldLabel);
  
  // Parse attributes (optional)
  this.MANY(() => {
    this.CONSUME(Pipe);
    this.OR2([
      { ALT: () => this.CONSUME(FieldAttribute) }, // key: value
      { ALT: () => this.CONSUME(FieldFlag) },      // flag
      { ALT: () => this.CONSUME(FieldOptions) },   // options: [...]
    ]);
  });
}
```

### 3. AST Builder

**File**: `src/core/parser/builders/inputs.builders.ts`

```typescript
export interface FieldNode extends AstNode {
  type: 'Field';
  props: {
    kind: 'text' | 'email' | 'password' | 'date' | 'number' | 'select' | 'textarea' | 'url' | 'tel';
    label: string;
    attributes: {
      placeholder?: string;
      value?: string;
      hint?: string;
      min?: string | number;
      max?: string | number;
      step?: string | number;
      rows?: number;
      cols?: number;
      pattern?: string;
      options?: string[];
    };
    flags: {
      required?: boolean;
      disabled?: boolean;
      readonly?: boolean;
      clearable?: boolean;
      multiple?: boolean;
      revealToggle?: boolean;
    };
  };
}

export function buildInputField(ctx: Context): FieldNode {
  // Determine field type
  let kind: FieldNode['props']['kind'];
  if (ctx.FieldText) kind = 'text';
  else if (ctx.FieldEmail) kind = 'email';
  else if (ctx.FieldPassword) kind = 'password';
  else if (ctx.FieldDate) kind = 'date';
  else if (ctx.FieldNumber) kind = 'number';
  else if (ctx.FieldSelect) kind = 'select';
  else if (ctx.FieldTextarea) kind = 'textarea';
  else if (ctx.FieldUrl) kind = 'url';
  else if (ctx.FieldTel) kind = 'tel';
  else kind = 'text';
  
  // Extract label
  const label = ctx.FieldLabel[0].image.trim();
  
  // Parse attributes
  const attributes: FieldNode['props']['attributes'] = {};
  const flags: FieldNode['props']['flags'] = {};
  
  // Process FieldAttribute tokens (key: value)
  ctx.FieldAttribute?.forEach(token => {
    const match = token.image.match(/([a-z]+):\s*(.+)/);
    if (match) {
      const [, key, value] = match;
      attributes[key] = value.trim();
    }
  });
  
  // Process FieldFlag tokens
  ctx.FieldFlag?.forEach(token => {
    const flag = token.image.trim();
    if (flag === 'required') flags.required = true;
    else if (flag === 'disabled') flags.disabled = true;
    else if (flag === 'readonly') flags.readonly = true;
    else if (flag === 'clearable') flags.clearable = true;
    else if (flag === 'multiple') flags.multiple = true;
    else if (flag === 'reveal-toggle') flags.revealToggle = true;
  });
  
  // Process FieldOptions token
  if (ctx.FieldOptions) {
    const match = ctx.FieldOptions[0].image.match(/options:\s*\[([^\]]+)\]/);
    if (match) {
      attributes.options = match[1].split('|').map(opt => opt.trim());
    }
  }
  
  return {
    type: 'Field',
    id: generateId('field'),
    props: { kind, label, attributes, flags },
    children: []
  };
}
```

### 4. Renderer

**File**: `src/core/renderer/nodes/inputs.node.ts`

```typescript
import { elementStyles, getInputInlineStyles } from './styles/styles';

export function renderField(node: AstNode): string {
  const { kind, label, attributes, flags } = node.props as FieldNode['props'];
  
  // Generate field ID
  const fieldId = `field-${node.id}`;
  
  // Render based on kind
  if (kind === 'select') {
    return renderSelect(fieldId, label, attributes, flags);
  } else if (kind === 'textarea') {
    return renderTextarea(fieldId, label, attributes, flags);
  } else {
    return renderInput(fieldId, kind, label, attributes, flags);
  }
}

function renderInput(
  id: string, 
  type: string, 
  label: string, 
  attrs: FieldNode['props']['attributes'],
  flags: FieldNode['props']['flags']
): string {
  const placeholder = attrs.placeholder || label;
  const value = attrs.value || '';
  
  // Build HTML attributes
  const htmlAttrs = [
    `type="${type}"`,
    `id="${id}"`,
    `name="${id}"`,
    `placeholder="${placeholder}"`,
    value ? `value="${value}"` : '',
    flags.required ? 'required' : '',
    flags.disabled ? 'disabled' : '',
    flags.readonly ? 'readonly' : '',
    attrs.min !== undefined ? `min="${attrs.min}"` : '',
    attrs.max !== undefined ? `max="${attrs.max}"` : '',
    attrs.step !== undefined ? `step="${attrs.step}"` : '',
    attrs.pattern ? `pattern="${attrs.pattern}"` : '',
  ].filter(Boolean).join(' ');
  
  const inputHtml = `<input class="${elementStyles.input}" style="${getInputInlineStyles()}" ${htmlAttrs} />`;
  
  // Wrap with label and optional hint
  let html = `
    <div class="field-wrapper mb-4">
      <label for="${id}" class="block mb-2" style="color: var(--foreground);">${label}</label>
      ${inputHtml}
      ${attrs.hint ? `<p class="mt-1 text-sm" style="color: var(--muted-foreground);">${attrs.hint}</p>` : ''}
    </div>
  `;
  
  // Add reveal toggle for password
  if (type === 'password' && flags.revealToggle) {
    html = html.replace('</div>', `
      <button type="button" class="reveal-toggle" onclick="togglePassword('${id}')">
        Show
      </button>
    </div>`);
  }
  
  return html;
}

function renderSelect(
  id: string,
  label: string,
  attrs: FieldNode['props']['attributes'],
  flags: FieldNode['props']['flags']
): string {
  const options = attrs.options || [];
  
  const htmlAttrs = [
    `id="${id}"`,
    `name="${id}"`,
    flags.required ? 'required' : '',
    flags.disabled ? 'disabled' : '',
    flags.multiple ? 'multiple' : '',
  ].filter(Boolean).join(' ');
  
  const optionsHtml = options.map(opt => {
    const selected = opt === attrs.value ? 'selected' : '';
    return `<option value="${opt}" ${selected}>${opt}</option>`;
  }).join('');
  
  return `
    <div class="field-wrapper mb-4">
      <label for="${id}" class="block mb-2" style="color: var(--foreground);">${label}</label>
      <select class="${elementStyles.select}" style="${getInputInlineStyles()}" ${htmlAttrs}>
        ${optionsHtml}
      </select>
      ${attrs.hint ? `<p class="mt-1 text-sm" style="color: var(--muted-foreground);">${attrs.hint}</p>` : ''}
    </div>
  `;
}

function renderTextarea(
  id: string,
  label: string,
  attrs: FieldNode['props']['attributes'],
  flags: FieldNode['props']['flags']
): string {
  const placeholder = attrs.placeholder || label;
  const value = attrs.value || '';
  const rows = attrs.rows || 4;
  
  const htmlAttrs = [
    `id="${id}"`,
    `name="${id}"`,
    `placeholder="${placeholder}"`,
    `rows="${rows}"`,
    attrs.cols !== undefined ? `cols="${attrs.cols}"` : '',
    flags.required ? 'required' : '',
    flags.disabled ? 'disabled' : '',
    flags.readonly ? 'readonly' : '',
  ].filter(Boolean).join(' ');
  
  return `
    <div class="field-wrapper mb-4">
      <label for="${id}" class="block mb-2" style="color: var(--foreground);">${label}</label>
      <textarea class="${elementStyles.textarea}" style="${getInputInlineStyles()}" ${htmlAttrs}>${value}</textarea>
      ${attrs.hint ? `<p class="mt-1 text-sm" style="color: var(--muted-foreground);">${attrs.hint}</p>` : ''}
    </div>
  `;
}
```

### 5. Styles

**File**: `src/core/renderer/nodes/styles/styles.ts`

```typescript
export const elementStyles = {
  // ... existing styles
  
  input: 'w-full px-3 py-2 rounded-md transition-colors focus:outline-none focus:ring-2',
  select: 'w-full px-3 py-2 rounded-md transition-colors focus:outline-none focus:ring-2',
  textarea: 'w-full px-3 py-2 rounded-md transition-colors focus:outline-none focus:ring-2 resize-vertical',
};

export function getInputInlineStyles(): string {
  return `
    background-color: var(--input);
    color: var(--foreground);
    border: 1px solid var(--border);
  `.trim();
}
```

---

## 🧪 Examples

### Login Form

```dsl
screen Login:
  container-narrow:
    card:
      # Sign In
      
      stack:
        ___email: Email | placeholder: you@example.com | required
        ___password: Password | placeholder: Enter password | required | reveal-toggle
        
        row-between:
          [X] Remember me
          #[Forgot password?](forgot)
        
        @primary[Sign In](login)
        @outline[Create Account](signup)
```

### Profile Form

```dsl
screen EditProfile:
  container-narrow:
    # Edit Profile
    
    stack:
      ___text: Full Name | value: John Doe | required
      ___email: Email | value: john@example.com | disabled | hint: Contact support to change email
      ___tel: Phone | placeholder: (555) 123-4567
      ___date: Birthday | max: 2010-01-01
      ___select: Country | options: [USA | Canada | UK | Australia] | value: USA
      ___textarea: Bio | placeholder: Tell us about yourself | rows: 5 | hint: Max 500 characters
      
      row-end:
        @outline[Cancel](-1)
        @primary[Save Changes](save)
```

---

## 📋 Checklist

### Lexer
- [ ] Define all field type tokens (`FieldText`, `FieldEmail`, etc.)
- [ ] Define attribute/flag/options tokens
- [ ] Update token export list

### Parser
- [ ] Add `inputField()` rule with type alternatives
- [ ] Parse label, attributes, flags, options
- [ ] Handle pipe-separated attributes

### AST Builder
- [ ] Build `FieldNode` with kind, label, attributes, flags
- [ ] Parse attribute key-value pairs
- [ ] Extract options array from `options: [...]`

### Renderer
- [ ] Implement `renderField()` dispatcher
- [ ] Implement `renderInput()` for text/email/password/etc.
- [ ] Implement `renderSelect()` with options
- [ ] Implement `renderTextarea()`
- [ ] Apply shadcn input styles

### Styles
- [ ] Define input/select/textarea base classes
- [ ] Create `getInputInlineStyles()` with CSS variables

### Documentation
- [ ] Document all field types and attributes
- [ ] Create form examples
- [ ] Migration guide from old syntax

### Testing
- [ ] Test all field types render correctly
- [ ] Test attribute combinations
- [ ] Test accessibility (labels, hints, aria)

---

**Next**: See [05 - Verbal Buttons](./05-verbal-buttons.md) for word-based button variants.
