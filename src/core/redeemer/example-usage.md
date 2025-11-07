# Redeemer: AST → React/shadcn Components

## Conceito

O **Redeemer** converte AST do proto-typed em **componentes React** que usam **shadcn/ui**, ao invés de HTML estático com CDN.

## Comparação: HTML vs React/shadcn

### ❌ Atual (HTML Export)

```html
<!DOCTYPE html>
<html>
<head>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/lucide@latest"></script>
  <style>:root { --accent: #...; }</style>
</head>
<body>
  <div class="screen">
    <div class="flex flex-col gap-4">
      <h1 class="text-4xl font-bold">Dashboard</h1>
      <button class="inline-flex items-center..." style="background: var(--accent)">
        Click me
      </button>
      <input type="text" class="..." placeholder="Enter text" />
    </div>
  </div>
  <script>/* navigation logic */</script>
</body>
</html>
```

**Problemas:**
- Não reutilizável em projetos React/Next.js
- Depende de CDN (sem tree-shaking)
- Difícil de estender ou customizar
- Sem TypeScript

### ✅ Proposto (React/shadcn Export)

```tsx
'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

/**
 * Dashboard - Generated from proto-typed DSL
 */
export function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      <div className="flex flex-col gap-4">
        <h1 className="text-4xl font-bold">Dashboard</h1>
        <Button>Click me</Button>
        <Input placeholder="Enter text" />
      </div>
    </div>
  );
}
```

**Vantagens:**
- ✅ Reutilizável em projetos React/Next.js
- ✅ Tree-shaking automático (bundle menor)
- ✅ Componentes shadcn/ui (customizáveis)
- ✅ TypeScript ready
- ✅ Pode ser estendido facilmente
- ✅ Integra com estado React (useState, useContext, etc)

## Uso

### Básico

```typescript
import { astToReactComponent } from '@/core/redeemer/ast-to-react-component';
import { parseAndBuildAST } from '@/core/parser/parse-and-build-ast';

// Parse DSL
const dslCode = `
Screen "Dashboard"
  Layout stack
    Heading 1 "Welcome"
    Button "Get Started" @home
    Input "Email" placeholder="Enter email"
`;

const ast = parseAndBuildAST(dslCode);

// Convert to React component
const reactCode = astToReactComponent(ast, {
  componentName: 'Dashboard',
  isClientComponent: true
});

console.log(reactCode);
```

### Saída

```tsx
'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

/**
 * Dashboard - Generated from proto-typed DSL
 */
export function Dashboard() {
  return (
    <div className="min-h-screen bg-background" data-screen="Dashboard">
      <div className="flex flex-col gap-4">
        <h1 className="text-4xl font-bold tracking-tight">Welcome</h1>
        <Button onClick={() => navigateTo('home')}>Get Started</Button>
        <div className="space-y-2">
          <label className="text-sm font-medium">Email</label>
          <Input placeholder="Enter email" />
        </div>
      </div>
    </div>
  );
}
```

## Exemplos de Conversão

### 1. Botões

**DSL:**
```
Button "Save" primary
Button "Cancel" secondary
Button "Delete" danger i-trash
```

**React/shadcn:**
```tsx
<Button variant="default">Save</Button>
<Button variant="secondary">Cancel</Button>
<Button variant="destructive">
  <Trash className="mr-2 h-4 w-4" />
  Delete
</Button>
```

### 2. Modal

**DSL:**
```
Modal "Settings"
  Heading 2 "User Settings"
  Input "Username" placeholder="Enter username"
  Button "Save" primary
```

**React/shadcn:**
```tsx
<Dialog>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>User Settings</DialogTitle>
    </DialogHeader>
    <div className="space-y-2">
      <label className="text-sm font-medium">Username</label>
      <Input placeholder="Enter username" />
    </div>
    <Button>Save</Button>
  </DialogContent>
</Dialog>
```

### 3. Drawer

**DSL:**
```
Drawer "Menu"
  Heading 3 "Navigation"
  Link "Home" @home
  Link "Profile" @profile
  Separator
  Link "Logout" @logout
```

**React/shadcn:**
```tsx
<Sheet>
  <SheetContent side="left">
    <SheetHeader>
      <SheetTitle>Navigation</SheetTitle>
    </SheetHeader>
    <Link href="/home" className="text-primary hover:underline">Home</Link>
    <Link href="/profile" className="text-primary hover:underline">Profile</Link>
    <Separator />
    <Link href="/logout" className="text-primary hover:underline">Logout</Link>
  </SheetContent>
</Sheet>
```

### 4. Form com Select

**DSL:**
```
Layout stack
  Heading 2 "Create Account"
  Input "Name" placeholder="Full name"
  Input "Email" placeholder="email@example.com"
  Select "Country" options=["USA", "Canada", "Mexico"]
  Checkbox "Accept terms"
  Button "Sign Up" primary
```

**React/shadcn:**
```tsx
<div className="flex flex-col gap-4">
  <h2 className="text-3xl font-semibold tracking-tight">Create Account</h2>

  <div className="space-y-2">
    <label className="text-sm font-medium">Name</label>
    <Input placeholder="Full name" />
  </div>

  <div className="space-y-2">
    <label className="text-sm font-medium">Email</label>
    <Input placeholder="email@example.com" />
  </div>

  <div className="space-y-2">
    <label className="text-sm font-medium">Country</label>
    <Select>
      <SelectTrigger>
        <SelectValue placeholder="Select option" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="usa">USA</SelectItem>
        <SelectItem value="canada">Canada</SelectItem>
        <SelectItem value="mexico">Mexico</SelectItem>
      </SelectContent>
    </Select>
  </div>

  <div className="flex items-center space-x-2">
    <Checkbox id="accept-terms" />
    <label htmlFor="accept-terms" className="text-sm font-medium">
      Accept terms
    </label>
  </div>

  <Button>Sign Up</Button>
</div>
```

## Layouts Suportados

| DSL Layout | React/Tailwind Output |
|------------|----------------------|
| `container` | `<div className="container mx-auto px-4">` |
| `container-narrow` | `<div className="container mx-auto max-w-3xl px-4">` |
| `stack` | `<div className="flex flex-col gap-4">` |
| `stack-tight` | `<div className="flex flex-col gap-2">` |
| `row-center` | `<div className="flex flex-row items-center justify-center gap-4">` |
| `row-between` | `<div className="flex flex-row items-center justify-between gap-4">` |
| `grid-2` | `<div className="grid grid-cols-1 md:grid-cols-2 gap-4">` |
| `grid-3` | `<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">` |
| `card` | `<div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">` |
| `header` | `<div className="flex items-center justify-between border-b bg-background px-4 py-3">` |

## Próximos Passos

### Para integrar no playground:

1. **Adicionar botão "Export React"** no `src/app/page.tsx`:

```tsx
const handleExportReact = () => {
  if (!ast || (Array.isArray(ast) && ast.length === 0)) {
    return;
  }

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
};
```

2. **Adicionar no UI**:

```tsx
<div className="flex gap-2">
  <Button onClick={handleExport}>Export HTML</Button>
  <Button onClick={handleExportReact} variant="secondary">
    Export React
  </Button>
</div>
```

### Melhorias Futuras:

- [ ] Suporte para Server Components (sem 'use client')
- [ ] Geração de múltiplos arquivos (um por Screen)
- [ ] Adicionar hooks customizados (useState, useForm, etc)
- [ ] Gerar tipos TypeScript para props
- [ ] Integrar com react-hook-form para formulários
- [ ] Adicionar testes unitários para componentes gerados
- [ ] Suporte para animações (framer-motion)
- [ ] Code splitting automático

## Vantagens do Redeemer

### Para Desenvolvedores:
1. **Prototipagem Rápida**: Escreve DSL → gera componentes prontos
2. **Aprendizado**: Vê como componentes shadcn são usados
3. **Base Inicial**: Ponto de partida para customização
4. **Best Practices**: Código gerado segue padrões React/Next.js

### Para o Projeto:
1. **Diferencial Competitivo**: Exporta código reutilizável, não só HTML
2. **Ecossistema**: Integra com tooling React existente
3. **Produção Ready**: Código gerado pode ir direto para produção
4. **Type Safety**: TypeScript por padrão

## Conclusão

O **Redeemer** transforma o proto-typed de uma ferramenta de prototipagem em um **gerador de código produção-ready**, exportando componentes React/shadcn ao invés de HTML estático.

Isso torna o output **100x mais útil** para desenvolvedores que querem usar o código gerado em seus projetos.
