# Monaco Editor Integration for proto-typed DSL

This module provides complete Monaco Editor integration for the proto-typed DSL, including syntax highlighting, IntelliSense, and error markers.

## 📁 Directory Structure

```
editor/
├── README.md                 ← This file
├── index.ts                  ← Public API (exports & initialization)
├── constants.ts              ← Language ID and token type definitions
├── completion/
│   └── dsl-completion.ts     ← IntelliSense/autocomplete provider
├── components/
│   └── dsl-editor.tsx        ← React editor component
├── hooks/
│   └── use-monaco-dsl.ts     ← Monaco initialization hook
├── language/
│   └── dsl-language.ts       ← Language definition & tokenization
└── theme/
    └── dsl-theme.ts          ← Dark theme definition
```

## 🚀 Quick Start

### Using the DSLEditor Component

```tsx
import { DSLEditor } from '@/core/editor';

function MyApp() {
  const [code, setCode] = useState('screen Home:\n\t# Welcome');
  const [errors, setErrors] = useState<ParsedError[]>([]);

  return (
    <DSLEditor
      value={code}
      onChange={setCode}
      errors={errors}
      height="100vh"
      theme="proto-typed-dark"
    />
  );
}
```

### Manual Initialization

```tsx
import { initializeMonacoDSL, getDSLEditorOptions } from '@/core/editor';
import { Editor } from '@monaco-editor/react';

function ManualEditor() {
  const handleBeforeMount = (monaco: Monaco) => {
    initializeMonacoDSL(monaco);
  };

  return (
    <Editor
      language="proto-typed-dsl"
      theme="proto-typed-dark"
      options={getDSLEditorOptions()}
      beforeMount={handleBeforeMount}
    />
  );
}
```

## 📋 Module Details

### constants.ts
Defines core constants:
- **DSL_LANGUAGE_ID**: Language identifier (`'proto-typed-dsl'`)
- **DSL_TOKEN_TYPES**: Token type mapping for syntax highlighting

All token types align with **actual DSL implementation** from `src/core/lexer/tokens/`.

### completion/dsl-completion.ts
Provides context-aware autocomplete (IntelliSense) for all DSL elements:

**Completion Categories:**
- **Views**: `screen`, `modal`, `drawer`
- **Typography**: `#` to `######`, `>`, `>>`, `>>>`, `*>`, `">`
- **Buttons**: All size/variant combinations (`@`, `@@`, `@@@` with `_`, `+`, `-`, `=`, `!`)
- **Links & Images**: `#[text](dest)`, `![alt](url)`
- **Layouts**: `row`, `col`, `grid`, `container` (with and without modifiers)
- **Structures**: `list`, `card`, `header`, `navigator`, `fab`, `---`
- **Forms**: `___`, `___*`, `___-`, checkboxes, radios, selects
- **Components**: `component`, `$Component`, `list $Component:`, `%propName`
- **Styles**: `styles:`, CSS variables

**CRITICAL**: Only includes elements that **actually exist** in the DSL. No fictional elements.

### language/dsl-language.ts
Registers the DSL language with Monaco and defines:

**Monarch Tokenizer:**
- Pattern matching for all DSL syntax
- Accurate token classification for syntax highlighting
- Handles inline modifiers (`row-w50-center-p4:`)
- Navigator format detection (`- text | dest`, `- i-Icon Label | dest`)

**Language Configuration:**
- Bracket matching: `{}`, `[]`, `()`
- Auto-closing pairs
- Indentation rules (increase after `:`)
- Comment configuration

### theme/dsl-theme.ts
Dark theme optimized for DSL syntax highlighting.

**Color Scheme:**
- **Views** (`screen`, `modal`, `drawer`): Red (`#ff6b6b`)
- **Components**: Green (`#4ade80`)
- **Buttons/Links**: Blue (`#60a5fa`)
- **Layouts/Structures**: Pink (`#ec4899`)
- **Typography**: Green shades (`#34d399`)
- **Forms**: Purple (`#a855f7`)
- **Delimiters**: Yellow (`#ffe66d`)

**Design Philosophy:**
- Dark mode only (no light theme)
- High contrast for readability
- Semantic color mapping

### components/dsl-editor.tsx
React component wrapping Monaco Editor with DSL-specific features.

**Features:**
- Auto-initialization via `useMonacoDSL` hook
- Error marker integration (shows parse errors inline)
- Loading state handling
- Error state handling

**Props:**
```typescript
interface DSLEditorProps {
  value: string;                    // Code content
  onChange: (value?: string) => void; // Change handler
  height?: string;                  // Editor height (default: "100%")
  theme?: string;                   // Theme name (default: "proto-typed-dark")
  errors?: ParsedError[];           // Parse errors to display
}
```

### hooks/use-monaco-dsl.ts
Custom React hook for Monaco initialization.

**Responsibilities:**
- Wait for Monaco to load
- Initialize DSL language, theme, and completions
- Track initialization state
- Handle initialization errors

**Returns:**
```typescript
{
  monaco: Monaco | null;      // Monaco instance (null until loaded)
  isInitialized: boolean;     // True when DSL is ready
  error: string | null;       // Error message if initialization failed
}
```

### index.ts
Public API for the editor module.

**Exports:**
- `DSLEditor`: React component
- `useMonacoDSL`: Initialization hook
- `initializeMonacoDSL(monaco)`: Setup function
- `getDSLEditorOptions()`: Default editor configuration

## 🎯 Syntax Alignment

**All editor features align with the ACTUAL DSL syntax documented in:**
- `copilot-instructions.md` (comprehensive reference)
- `README.md` (user-facing documentation)
- `src/core/lexer/tokens/` (source of truth for token patterns)

### Syntax Examples Supported

**Views:**
```dsl
screen Home:
modal Confirm:
drawer Menu:
```

**Buttons:**
```dsl
@[Large Button](action)
@@+[Medium Outline](action)
@@@=[Small Delete](delete)
@[With Icon]{icon-name}(action)
```

**Layouts with Modifiers:**
```dsl
row-w50-center-p4:
col-h100-start-m2:
grid-cols3-gap4-p2:
container-wfull-center-p8:
```

**Navigator:**
```dsl
navigator:
  - Home | HomeScreen
  - Settings | settings | SettingsScreen
  - i-User Profile | ProfileScreen
```

**Components:**
```dsl
component UserCard:
  card:
    # %name
    > Email: %email

$UserCard:
  - John | john@email.com

list $UserCard:
  - Jane | jane@email.com
  - Bob | bob@email.com
```

## 🔧 Extending the Editor

### Adding New Completions

Edit `completion/dsl-completion.ts`:

```typescript
{
  label: 'new-element',
  kind: monaco.languages.CompletionItemKind.Keyword,
  insertText: 'new-element ${1:value}:\n\t$0',
  insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
  documentation: 'Description of new element',
  range: range,
}
```

### Adding New Token Types

1. **Add to `constants.ts`:**
```typescript
export const DSL_TOKEN_TYPES = {
  // ... existing types
  newElement: 'keyword.new-element',
};
```

2. **Add to `language/dsl-language.ts`:**
```typescript
tokenizer: {
  root: [
    // ... existing rules
    [/\bnew-element\b/, 'keyword.new-element'],
  ]
}
```

3. **Add to `theme/dsl-theme.ts`:**
```typescript
rules: [
  // ... existing rules
  { token: 'keyword.new-element', foreground: 'color-hex', fontStyle: 'bold' },
]
```

## ⚠️ Critical Rules

### DO NOT
- ❌ Add completions for non-existent DSL elements
- ❌ Reference fictional token patterns
- ❌ Use light theme colors
- ❌ Hardcode element names without checking actual implementation

### ALWAYS
- ✅ Verify syntax in `copilot-instructions.md` before adding features
- ✅ Check `src/core/lexer/tokens/` for actual token patterns
- ✅ Test completions in the running app
- ✅ Use semantic naming for token types
- ✅ Maintain consistency across constants, language, theme, and completions

## 📚 References

- **DSL Syntax**: `copilot-instructions.md`
- **Token Definitions**: `src/core/lexer/tokens/`
- **Parser Rules**: `src/core/parser/parser.ts`
- **Renderer**: `src/core/renderer/`
- **Monaco Editor**: https://microsoft.github.io/monaco-editor/

## 🎨 Color Reference

| Element | Color | Token Type |
|---------|-------|------------|
| Views (screen, modal, drawer) | `#ff6b6b` (red) | `keyword.view` |
| Components | `#4ade80` (green) | `keyword.component` |
| Component instances | `#f59e0b` (orange) | `variable.component` |
| Props | `#f59e0b` (orange, italic) | `variable.prop` |
| Buttons/Links | `#60a5fa` (blue) | `keyword.button`, `keyword.link` |
| Layouts/Structures | `#ec4899` (pink) | `keyword.layout`, `keyword.structure` |
| Typography | `#34d399` (green) | `markup.*` |
| Forms | `#a855f7` (purple) | `keyword.input`, `keyword.checkbox`, `keyword.radio` |
| Delimiters | `#ffe66d` (yellow) | `delimiter.*` |
| Styles | `#a78bfa` (purple) | `keyword.styles` |
| CSS Variables | `#8b5cf6` (purple) | `variable.css` |

---

**Last Updated**: After major refactoring to align with actual DSL implementation
**Status**: ✅ Production Ready
