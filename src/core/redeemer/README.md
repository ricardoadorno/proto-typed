# Redeemer - AST to React/shadcn Converter

## 📋 Visão Geral

O **Redeemer** é um sistema que converte a AST do proto-typed em **componentes React prontos para produção** que utilizam **shadcn/ui**, ao invés de exportar apenas HTML estático.

## 🎯 Problema que Resolve

**Antes (HTML Export):**
- Export gera HTML standalone com CDN
- Não pode ser usado em projetos React/Next.js
- Difícil de customizar e estender
- Sem type safety

**Depois (Redeemer):**
- Export gera componentes React/TypeScript
- Usa shadcn/ui (customizável e production-ready)
- Pode ser copiado direto para projetos
- Full TypeScript support

## 🏗️ Arquitetura

```
src/core/redeemer/
├── ast-to-react-component.ts          # Main converter
├── infrastructure/
│   ├── import-manager.ts              # Gerencia imports (React, shadcn, etc)
│   └── component-generator.ts         # Gera código completo do componente
├── nodes/
│   ├── primitives.redeemer.ts         # Button, Text, Heading, etc
│   ├── layouts.redeemer.ts            # Container, Stack, Grid, etc
│   ├── inputs.redeemer.ts             # Input, Select, Checkbox, etc
│   └── views.redeemer.ts              # Screen, Modal, Drawer
├── templates/
│   └── component-template.ts          # Templates de componente
├── example-usage.md                   # Exemplos de uso
└── README.md                          # Este arquivo
```

## 🚀 Como Usar

### 1. Conversão Básica

```typescript
import { astToReactComponent } from '@/core/redeemer/ast-to-react-component';
import { parseAndBuildAST } from '@/core/parser/parse-and-build-ast';

const dslCode = `
Screen "Dashboard"
  Heading 1 "Welcome"
  Button "Get Started" primary
`;

const ast = parseAndBuildAST(dslCode);
const reactCode = astToReactComponent(ast, {
  componentName: 'Dashboard',
  isClientComponent: true
});

console.log(reactCode);
```

### 2. Output

```tsx
'use client';

import { Button } from '@/components/ui/button';

/**
 * Dashboard - Generated from proto-typed DSL
 */
export function Dashboard() {
  return (
    <div className="min-h-screen bg-background" data-screen="Dashboard">
      <h1 className="text-4xl font-bold tracking-tight">Welcome</h1>
      <Button>Get Started</Button>
    </div>
  );
}
```

## 📦 Componentes Suportados

| DSL Node | React Output | shadcn Component |
|----------|--------------|------------------|
| `Button` | `<Button>` | ✅ shadcn/ui |
| `Input` | `<Input>` | ✅ shadcn/ui |
| `Select` | `<Select>` | ✅ shadcn/ui |
| `Checkbox` | `<Checkbox>` | ✅ shadcn/ui |
| `Modal` | `<Dialog>` | ✅ shadcn/ui |
| `Drawer` | `<Sheet>` | ✅ shadcn/ui |
| `Separator` | `<Separator>` | ✅ shadcn/ui |
| `Link` | `<Link>` | Next.js Link |
| `Image` | `<Image>` | Next.js Image |
| `Heading` | `<h1-h6>` | Semantic HTML |
| `Text` | `<span>` | Semantic HTML |
| `Paragraph` | `<p>` | Semantic HTML |

## 🎨 Mapeamento de Estilos

### Button Variants

| DSL Variant | shadcn Variant |
|-------------|----------------|
| `primary` | `default` |
| `secondary` | `secondary` |
| `danger` | `destructive` |
| `ghost` | `ghost` |
| `outline` | `outline` |

### Layout Types

| DSL Layout | Tailwind Classes |
|------------|------------------|
| `container` | `container mx-auto px-4` |
| `stack` | `flex flex-col gap-4` |
| `row-center` | `flex flex-row items-center justify-center gap-4` |
| `grid-3` | `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4` |
| `card` | `rounded-lg border bg-card shadow-sm p-6` |

## 🔧 API

### `astToReactComponent(ast, options)`

Converte AST em código React/TypeScript.

**Parâmetros:**
- `ast`: `AstNode | AstNode[]` - AST do proto-typed
- `options`: `RedeemOptions` (opcional)
  - `componentName`: `string` - Nome do componente (default: `'GeneratedComponent'`)
  - `isClientComponent`: `boolean` - Adicionar `'use client'` (default: `true`)
  - `includeComments`: `boolean` - Incluir comentários JSDoc (default: `true`)

**Retorna:** `string` - Código completo do componente

### Exemplo com Opções

```typescript
const reactCode = astToReactComponent(ast, {
  componentName: 'LoginScreen',
  isClientComponent: true,
  includeComments: true
});
```

## 🔌 Integração no Playground

### Adicionar Botão de Export

No `src/app/page.tsx`:

```tsx
import { astToReactComponent } from '@/core/redeemer/ast-to-react-component';
import { exportDocument } from '@/utils/export-document';

// Adicionar handler
const handleExportReact = () => {
  if (!ast || (Array.isArray(ast) && ast.length === 0)) {
    toast.error('No code to export');
    return;
  }

  try {
    const reactCode = astToReactComponent(ast, {
      componentName: 'GeneratedComponent',
      isClientComponent: true
    });

    // Download as .tsx file
    const blob = new Blob([reactCode], { type: 'text/typescript' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'component.tsx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success('Component exported successfully');
  } catch (error) {
    console.error('Export failed:', error);
    toast.error('Failed to export component');
  }
};

// Adicionar no UI
<div className="flex gap-2">
  <Button onClick={handleExport} variant="outline" size="sm">
    <Download className="h-4 w-4 mr-2" />
    Export HTML
  </Button>
  <Button onClick={handleExportReact} variant="default" size="sm">
    <Code className="h-4 w-4 mr-2" />
    Export React
  </Button>
</div>
```

## 📝 Exemplo Completo

### Input DSL:

```
Screen "ContactForm"
  Layout container-narrow
    Heading 1 "Contact Us"
    Paragraph "We'd love to hear from you"

    Layout stack
      Input "Name" placeholder="Your name"
      Input "Email" placeholder="your@email.com"
      Select "Subject" options=["General", "Support", "Sales"]

      Layout stack-tight
        Checkbox "Subscribe to newsletter"

      Layout row-between
        Button "Cancel" secondary
        Button "Send" primary i-send
```

### Output React:

```tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Send } from 'lucide-react';

/**
 * ContactForm - Generated from proto-typed DSL
 */
export function ContactForm() {
  return (
    <div className="min-h-screen bg-background" data-screen="ContactForm">
      <div className="container mx-auto max-w-3xl px-4">
        <h1 className="text-4xl font-bold tracking-tight">Contact Us</h1>
        <p>We'd love to hear from you</p>

        <div className="flex flex-col gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Name</label>
            <Input placeholder="Your name" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input placeholder="your@email.com" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Subject</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select option" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="support">Support</SelectItem>
                <SelectItem value="sales">Sales</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="subscribe-to-newsletter" />
              <label htmlFor="subscribe-to-newsletter" className="text-sm font-medium">
                Subscribe to newsletter
              </label>
            </div>
          </div>

          <div className="flex flex-row items-center justify-between gap-4">
            <Button variant="secondary">Cancel</Button>
            <Button>
              <Send className="mr-2 h-4 w-4" />
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
```

## ✨ Próximas Melhorias

- [ ] Server Components support (sem 'use client')
- [ ] Multi-file export (um arquivo por Screen)
- [ ] State management (useState, useReducer)
- [ ] Form validation (zod + react-hook-form)
- [ ] API integration patterns
- [ ] Storybook stories generation
- [ ] Unit tests generation
- [ ] Accessibility improvements
- [ ] Animation presets (framer-motion)
- [ ] Responsive utilities

## 📚 Links Úteis

- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [Lucide Icons](https://lucide.dev)

## 🤝 Contribuindo

Para adicionar suporte a novos componentes:

1. Adicionar tipo no `ast-node.ts`
2. Criar redeemer em `nodes/*.redeemer.ts`
3. Adicionar no switch case em `ast-to-react-component.ts`
4. Atualizar documentação

## 📄 Licença

Same as proto-typed project.
