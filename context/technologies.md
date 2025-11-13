# Proto-Typed: Technologies & Libraries

## Technology Stack Overview

Proto-Typed uses modern JavaScript/TypeScript ecosystem tools with a focus on stability, type safety, and developer experience.

## Core Technologies

### Chevrotain (Parser Generator)

**Purpose**: Lexing and parsing infrastructure

**Why Chevrotain?**
- **JavaScript-native**: No external build step or grammar compilation
- **TypeScript-first**: Full type safety for parser rules
- **Performance**: Fast LL(k) parsing with lookahead
- **Error recovery**: Automatic error recovery and reporting
- **CST support**: Generates Concrete Syntax Trees for flexible AST building
- **Pure JavaScript**: No dependencies on native bindings

**Usage in Proto-Typed**:
```typescript
import { createToken, Lexer, CstParser } from 'chevrotain';

// Token definition
const Screen = createToken({
  name: 'Screen',
  pattern: /screen/
});

// Lexer
const lexer = new Lexer([Screen, /* ... */]);

// Parser
class ProtoTypedParser extends CstParser {
  constructor() {
    super(allTokens);
    this.performSelfAnalysis();
  }

  screenRule() {
    this.CONSUME(Screen);
    this.CONSUME(Identifier);
    this.CONSUME(Colon);
    // ...
  }
}
```

**Key Concepts**:
- **Tokens**: Lexical units (keywords, identifiers, literals)
- **Rules**: Grammar production rules (screenRule, buttonRule, etc.)
- **CST**: Concrete Syntax Tree with all parsing details
- **Visitor**: Pattern for traversing CST to build AST

**Resources**:
- Documentation: https://chevrotain.io/
- GitHub: https://github.com/chevrotain/chevrotain

---

### TypeScript

**Purpose**: Type safety and developer tooling

**Configuration**:
```json
// tsconfig.json (strict mode)
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler"
  }
}
```

**Usage Patterns**:
- **Discriminated unions** for AST nodes
- **Type guards** for runtime type checking
- **Generics** for reusable builders
- **Branded types** for IDs (e.g., `NodeId`)

**Example**:
```typescript
// Discriminated union for AST nodes
type AstNode =
  | ScreenNode
  | ModalNode
  | ButtonNode
  | ContainerNode;

interface ScreenNode extends BaseNode {
  type: 'Screen';  // Discriminator
  props: { name: string };
}

// Type guard
function isScreen(node: AstNode): node is ScreenNode {
  return node.type === 'Screen';
}
```

---

### nanoid (ID Generation)

**Purpose**: Generate unique IDs for AST nodes

**Why nanoid?**
- **Tiny**: 130 bytes
- **Fast**: 60% faster than UUID
- **Collision-resistant**: 21 characters, URL-safe
- **No dependencies**: Pure JavaScript

**Usage**:
```typescript
import { nanoid } from 'nanoid';

function generateId(prefix: string): string {
  return `${prefix}-${nanoid(8)}`;
}

// Example output: "screen-home-a1b2c3d4"
```

---

## Web Application Stack

### Next.js 15

**Purpose**: React framework for web playground

**Key Features Used**:
- **App Router**: File-based routing
- **Server Components**: Default server rendering
- **Turbopack**: Fast dev server (alternative to webpack)
- **Static Export**: Generate static site for GitHub Pages

**Configuration**:
```javascript
// next.config.mjs
const nextConfig = {
  output: 'export',  // Static site generation
  basePath: '/proto-typed',  // GitHub Pages path
  images: { unoptimized: true }  // No image optimization for static export
};
```

**File Structure**:
```
packages/web/
├── app/
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Homepage (editor + preview)
│   └── globals.css       # Tailwind + theme variables
├── components/
│   ├── editor.tsx        # Monaco editor wrapper
│   ├── preview.tsx       # HTML preview iframe
│   └── ui/               # Radix UI components
└── public/               # Static assets
```

---

### React 19

**Purpose**: UI library for web components

**Key Features Used**:
- **Hooks**: useState, useEffect, useCallback, useMemo
- **Server Components**: For static parts of the UI
- **Suspense**: For code splitting and async components

**Example Component**:
```typescript
'use client';

import { useState } from 'react';
import { lexer, parser, astBuilder, astToHtmlStringPreview } from '@proto-typed/core';

export function Editor() {
  const [code, setCode] = useState('');
  const [preview, setPreview] = useState('');

  const handleCodeChange = (value: string) => {
    setCode(value);
    const html = compile(value);
    setPreview(html);
  };

  return (
    <div>
      <MonacoEditor value={code} onChange={handleCodeChange} />
      <PreviewPanel html={preview} />
    </div>
  );
}
```

---

### Monaco Editor

**Purpose**: Code editor component (powers VSCode)

**Package**: `@monaco-editor/react`

**Features Used**:
- **Syntax highlighting**: Custom language definition for `.pty`
- **Autocomplete**: Snippets for DSL keywords
- **Error reporting**: Integration with Chevrotain error messages
- **Theming**: Dark mode integration

**Configuration**:
```typescript
import Editor from '@monaco-editor/react';

<Editor
  language="proto-typed"
  theme="vs-dark"
  value={code}
  onChange={handleChange}
  options={{
    minimap: { enabled: false },
    fontSize: 14,
    lineNumbers: 'on',
    scrollBeyondLastLine: false
  }}
/>
```

---

### Tailwind CSS v4

**Purpose**: Utility-first CSS framework

**Why Tailwind?**
- **Utility classes**: Fast prototyping
- **No runtime**: Classes are statically extracted
- **Type-safe**: Integration with TypeScript via tailwind-merge
- **Customizable**: Extend with CSS variables

**Configuration**:
```javascript
// tailwind.config.ts
export default {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Use CSS variables for theming
        primary: 'var(--primary)',
        secondary: 'var(--secondary)',
        // ...
      }
    }
  }
};
```

**Usage Pattern**:
```typescript
// Structural classes only (spacing, layout)
const classes = 'flex items-center gap-4 px-4 py-2 rounded-md';

// Colors via CSS variables (inline styles)
const styles = 'background-color: var(--primary); color: var(--primary-foreground);';

return `<div class="${classes}" style="${styles}">Content</div>`;
```

---

### Radix UI

**Purpose**: Unstyled, accessible UI components

**Packages Used**:
- `@radix-ui/react-dialog`: Modal dialogs
- `@radix-ui/react-dropdown-menu`: Dropdowns
- `@radix-ui/react-select`: Custom selects
- `@radix-ui/react-tabs`: Tab navigation
- `@radix-ui/react-tooltip`: Tooltips

**Why Radix?**
- **Accessibility**: ARIA-compliant by default
- **Unstyled**: Full control over appearance
- **Composable**: Build complex components from primitives
- **Type-safe**: Full TypeScript support

**Example**:
```typescript
import * as Dialog from '@radix-ui/react-dialog';

<Dialog.Root>
  <Dialog.Trigger>Open</Dialog.Trigger>
  <Dialog.Portal>
    <Dialog.Overlay className="overlay" />
    <Dialog.Content className="content">
      <Dialog.Title>Title</Dialog.Title>
      <Dialog.Description>Description</Dialog.Description>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>
```

---

### Lucide Icons

**Purpose**: Icon library

**Package**: `lucide-react`

**Why Lucide?**
- **Tree-shakeable**: Only import icons you use
- **Consistent**: All icons use the same stroke width
- **Customizable**: Size, color, stroke width props
- **React-friendly**: Native React components

**Usage**:
```typescript
import { Play, Download, Settings } from 'lucide-react';

<Play size={16} strokeWidth={2} className="text-primary" />
```

---

## VSCode Extension Stack

### VSCode Extension API

**Purpose**: Integrate with VSCode

**Key APIs Used**:
- **Language Support**: Register `.pty` file type
- **Webview**: Embed HTML preview panel
- **Commands**: Register commands like "Open Preview"
- **TextDocument**: Read file content

**Example**:
```typescript
import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  // Register file type
  vscode.languages.registerDocumentSelector({
    language: 'proto-typed',
    scheme: 'file',
    pattern: '**/*.pty'
  });

  // Register command
  const command = vscode.commands.registerCommand(
    'proto-typed.openPreview',
    () => {
      const panel = vscode.window.createWebviewPanel(
        'protoTypedPreview',
        'Proto-Typed Preview',
        vscode.ViewColumn.Two,
        { enableScripts: true }
      );
      panel.webview.html = getPreviewHtml();
    }
  );

  context.subscriptions.push(command);
}
```

---

### TextMate Grammar

**Purpose**: Syntax highlighting for `.pty` files

**File**: `packages/extension/syntaxes/proto-typed.tmLanguage.json`

**Structure**:
```json
{
  "scopeName": "source.proto-typed",
  "patterns": [
    {
      "name": "keyword.control.proto-typed",
      "match": "\\b(screen|modal|drawer|component)\\b"
    },
    {
      "name": "entity.name.tag.proto-typed",
      "match": "\\b(container|stack|row|grid|card)\\b"
    }
  ]
}
```

**Token Scopes**:
- `keyword.control`: Views (screen, modal, drawer)
- `entity.name.tag`: Layouts (container, stack, row)
- `entity.name.function`: Components ($ComponentName)
- `string.quoted`: Text content

---

## Build & Development Tools

### pnpm (Package Manager)

**Purpose**: Monorepo package management

**Why pnpm?**
- **Disk efficiency**: Shared dependencies via hard links
- **Workspace support**: First-class monorepo support
- **Fast**: Faster than npm/yarn
- **Strict**: No phantom dependencies

**Workspace Configuration**:
```yaml
# pnpm-workspace.yaml
packages:
  - 'packages/*'
```

**Common Commands**:
```bash
# Install all dependencies
pnpm install

# Run script in specific package
pnpm -F @proto-typed/core build

# Run script in all packages
pnpm -r build

# Add dependency to specific package
pnpm -F @web/app add react
```

---

### Vitest (Testing Framework)

**Purpose**: Unit testing for core package

**Why Vitest?**
- **Fast**: Vite-powered, parallel execution
- **Compatible**: Jest-compatible API
- **TypeScript**: Native TypeScript support
- **Watch mode**: Fast re-runs on file changes

**Configuration**:
```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html']
    }
  }
});
```

**Example Test**:
```typescript
import { describe, it, expect } from 'vitest';
import { lexer } from '../src/lexer/lexer';

describe('Lexer', () => {
  it('should tokenize screen declaration', () => {
    const input = 'screen Home:';
    const result = lexer.tokenize(input);

    expect(result.tokens).toHaveLength(3);
    expect(result.tokens[0].tokenType.name).toBe('Screen');
    expect(result.tokens[1].tokenType.name).toBe('Identifier');
    expect(result.tokens[2].tokenType.name).toBe('Colon');
  });
});
```

---

### Playwright (E2E Testing)

**Purpose**: End-to-end testing for web app

**Why Playwright?**
- **Multi-browser**: Test Chrome, Firefox, Safari
- **Headless**: Fast CI execution
- **Auto-wait**: Automatic waiting for elements
- **Debugging**: UI mode for debugging tests

**Example Test**:
```typescript
import { test, expect } from '@playwright/test';

test('editor compiles DSL to HTML', async ({ page }) => {
  await page.goto('/');

  // Type DSL code
  await page.fill('.monaco-editor textarea', 'screen Home:\n  ## Welcome');

  // Check preview updates
  const preview = page.frameLocator('iframe');
  await expect(preview.locator('h2')).toContainText('Welcome');
});
```

---

### ESLint (Linting)

**Purpose**: Code quality and consistency

**Configuration**:
```javascript
// eslint.config.js
export default [
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': 'error',
      'prefer-const': 'error',
      'no-console': 'warn'
    }
  }
];
```

---

### Prettier (Code Formatting)

**Purpose**: Automatic code formatting

**Configuration**:
```json
// .prettierrc
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "es5",
  "printWidth": 100,
  "tabWidth": 2
}
```

---

## Runtime Dependencies

### Core Package
```json
{
  "dependencies": {
    "chevrotain": "^11.0.3",
    "nanoid": "^5.0.4"
  }
}
```

### Web Package
```json
{
  "dependencies": {
    "@monaco-editor/react": "^4.6.0",
    "@proto-typed/core": "workspace:*",
    "@radix-ui/react-*": "^1.1.0",
    "lucide-react": "^0.344.0",
    "next": "^15.0.0",
    "react": "^19.0.0",
    "tailwindcss": "^4.0.0"
  }
}
```

### Extension Package
```json
{
  "dependencies": {
    "@proto-typed/core": "workspace:*"
  },
  "devDependencies": {
    "@types/vscode": "^1.85.0",
    "vscode": "^1.1.37"
  }
}
```

---

## Output Technologies

The generated HTML uses:

1. **Vanilla JavaScript**: No framework dependencies
2. **CSS Variables**: For theming
3. **Tailwind CDN**: For utility classes (export mode only)
4. **Native DOM APIs**: For navigation logic

**Example Generated HTML**:
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Prototype</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    :root {
      --primary: oklch(0.7 0.15 220);
      /* ... CSS variables */
    }
  </style>
</head>
<body>
  <div id="screen-home" data-screen="Home" class="screen">
    <!-- ... content -->
  </div>

  <script>
    // Vanilla JavaScript navigation
    function navigateTo(screenName) {
      document.querySelectorAll('[data-screen]').forEach(s => s.style.display = 'none');
      document.querySelector(`[data-screen="${screenName}"]`).style.display = 'block';
      history.pushState({ screen: screenName }, '', `#${screenName}`);
    }
  </script>
</body>
</html>
```

---

## Color Technology: OKLCH

**Purpose**: Perceptually uniform color space

**Why OKLCH?**
- **Perceptual uniformity**: Equal changes in value = equal perceptual changes
- **Better than HSL**: Avoids hue shifting in dark colors
- **Modern**: Native CSS support in modern browsers
- **Predictable**: Lightness/chroma scales are intuitive

**Format**: `oklch(L C H)`
- **L**: Lightness (0-1)
- **C**: Chroma/saturation (0-0.4)
- **H**: Hue (0-360 degrees)

**Example**:
```css
:root {
  --primary: oklch(0.7 0.15 220);  /* Blue primary */
  --primary-foreground: oklch(0.95 0.02 220);  /* Light text on primary */
}
```

**Benefits for Theming**:
- Consistent contrast ratios across hues
- Easier to generate color scales
- Better dark mode support

---

## Development vs Production

### Development
- **Web**: Next.js dev server with Turbopack (fast HMR)
- **Extension**: Watch mode with automatic recompilation
- **Core**: TypeScript watch mode

### Production
- **Web**: Static site exported to GitHub Pages
- **Extension**: Compiled to `.vsix` package
- **Core**: Published to npm as dual ESM/CommonJS

---

## Browser Compatibility

### Generated HTML
- **Modern browsers**: Chrome 90+, Firefox 88+, Safari 14+
- **CSS Variables**: Full support
- **OKLCH**: Polyfill for older browsers (not included by default)
- **JavaScript**: ES2022 (can be transpiled if needed)

### Web Playground
- **React 19**: Modern browsers only
- **Monaco Editor**: Chrome, Firefox, Safari (latest versions)
- **Tailwind**: No IE11 support

---

## Key Technology Decisions

| Technology | Alternative Considered | Why Chosen |
|------------|----------------------|------------|
| **Chevrotain** | ANTLR, PEG.js | JavaScript-native, TypeScript support, CST |
| **Next.js** | Vite + React | Static export, SEO, app router |
| **Tailwind** | CSS-in-JS, Sass | Utility-first, no runtime, performance |
| **Radix UI** | Headless UI, Shadcn | Unstyled primitives, accessibility |
| **pnpm** | npm, yarn | Monorepo support, disk efficiency |
| **Vitest** | Jest | Faster, Vite integration, modern API |
| **OKLCH** | HSL, RGB | Perceptual uniformity, modern |

---

## Summary

Proto-Typed's technology stack is intentionally minimal and modern:
- **Core**: Pure TypeScript with Chevrotain (no runtime dependencies)
- **Web**: Next.js + React + Tailwind (standard React stack)
- **Extension**: VSCode API + Webview (native integration)
- **Output**: Vanilla HTML/CSS/JS (no framework lock-in)

This ensures:
- **Fast compilation**: Chevrotain is fast, TypeScript compiles quickly
- **Type safety**: Full TypeScript coverage
- **Small bundle**: Minimal dependencies
- **Future-proof**: Modern standards, widely adopted tools
