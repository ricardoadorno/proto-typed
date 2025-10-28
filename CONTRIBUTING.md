# Guia de Contribuição

Obrigado por contribuir com o Proto-Typed! Este documento fornece diretrizes para contribuir com o projeto.

## 📋 Tabela de Conteúdos

- [Configuração do Ambiente](#configuração-do-ambiente)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Padrões de Commit](#padrões-de-commit)
- [Processo de Desenvolvimento](#processo-de-desenvolvimento)
- [Testes](#testes)
- [Pull Requests](#pull-requests)

## 🛠️ Configuração do Ambiente

### Pré-requisitos

- Node.js 18+
- pnpm 9+
- Git

### Instalação

```bash
# Clonar repositório
git clone https://github.com/seu-usuario/proto-typed.git
cd proto-typed

# Instalar dependências
pnpm install

# Compilar core package
pnpm compile:core

# Iniciar desenvolvimento web
pnpm dev
```

## 📁 Estrutura do Projeto

```
proto-typed/
├── packages/
│   ├── core/         # Parser, Lexer, Renderer
│   ├── extension/    # VSCode Extension
│   └── web/          # Next.js Documentation Site
└── tests/            # Testes globais
```

## 📝 Padrões de Commit

Este projeto segue o padrão [Conventional Commits](https://www.conventionalcommits.org/).

### Formato

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Tipos Permitidos

| Tipo       | Descrição                        |
| ---------- | -------------------------------- |
| `feat`     | Nova funcionalidade              |
| `fix`      | Correção de bug                  |
| `docs`     | Alterações na documentação       |
| `style`    | Formatação, ponto e vírgula, etc |
| `refactor` | Refatoração de código            |
| `perf`     | Melhoria de performance          |
| `test`     | Adição ou modificação de testes  |
| `build`    | Mudanças no sistema de build     |
| `ci`       | Mudanças em CI/CD                |
| `chore`    | Tarefas de manutenção            |
| `revert`   | Reverter um commit anterior      |

### Exemplos

#### Feature

```bash
feat(parser): add support for custom components

Implements custom component parsing with props validation.
Includes support for nested components and type checking.

Closes #123
```

#### Bug Fix

```bash
fix(lexer): resolve token recognition in nested layouts

Fixed an issue where tokens were not correctly identified
inside nested layout structures.

Fixes #456
```

#### Documentation

```bash
docs: update installation guide with pnpm instructions
```

#### Refactor

```bash
refactor(core): improve error handling in renderer

- Centralize error messages
- Add better type safety
- Improve error recovery
```

#### Performance

```bash
perf(parser): optimize AST building for large files

Reduced parsing time by 40% for files > 1000 lines.
```

### Scopes Sugeridos

- `core` - Core package (parser, lexer, renderer)
- `extension` - VSCode extension
- `web` - Web documentation
- `parser` - Parser específico
- `lexer` - Lexer específico
- `renderer` - Renderer específico
- `ci` - Continuous Integration
- `deps` - Dependências

## 🔄 Processo de Desenvolvimento

### 1. Criar Branch

```bash
# Feature
git checkout -b feat/nova-funcionalidade

# Bug fix
git checkout -b fix/corrigir-bug

# Docs
git checkout -b docs/atualizar-readme
```

### 2. Desenvolver

```bash
# Watch mode para core
pnpm -F @proto-typed/core watch

# Dev mode para web
pnpm dev
```

### 3. Testar

```bash
# Type checking
pnpm typecheck

# Testes unitários
pnpm test:run

# Testes E2E
pnpm test:e2e

# Lint
pnpm lint

# Format
pnpm format
```

### 4. Commit

Os Git hooks irão:

- ✅ **Pre-commit**: Lint e format nos arquivos staged
- ✅ **Commit-msg**: Validar formato da mensagem
- ✅ **Pre-push**: Executar typecheck e testes

```bash
# Adicionar arquivos
git add .

# Commit (será validado automaticamente)
git commit -m "feat(parser): add new feature"
```

### 5. Push

```bash
# Push (testes serão executados automaticamente)
git push origin feat/nova-funcionalidade
```

## 🧪 Testes

### Testes Unitários (Vitest)

```bash
# Watch mode
pnpm test

# Run once
pnpm test:run

# Coverage
pnpm test:coverage

# UI
pnpm test:ui
```

### Testes E2E (Playwright)

```bash
# Run tests
pnpm test:e2e

# Debug mode
pnpm test:e2e:debug

# UI mode
pnpm test:e2e:ui
```

### Escrevendo Testes

#### Testes Unitários

```typescript
// packages/core/src/parser/__tests__/parser.test.ts
import { describe, it, expect } from 'vitest'
import { Parser } from '../parser'

describe('Parser', () => {
  it('should parse simple screen', () => {
    const result = Parser.parse('screen Home {}')
    expect(result.errors).toHaveLength(0)
  })
})
```

#### Testes E2E

```typescript
// tests/e2e/docs.spec.ts
import { test, expect } from '@playwright/test'

test('should navigate to docs', async ({ page }) => {
  await page.goto('/')
  await page.click('text=Documentation')
  await expect(page).toHaveURL(/\/docs/)
})
```

## 🔀 Pull Requests

### Checklist

Antes de abrir um PR, certifique-se de que:

- [ ] Código segue os padrões do projeto
- [ ] Testes foram adicionados/atualizados
- [ ] Documentação foi atualizada
- [ ] Commits seguem Conventional Commits
- [ ] Todos os testes passam
- [ ] Typecheck passa
- [ ] Lint passa
- [ ] Não há conflitos com a branch principal

### Template de PR

```markdown
## Descrição

Breve descrição das mudanças.

## Tipo de Mudança

- [ ] Bug fix (non-breaking change)
- [ ] New feature (non-breaking change)
- [ ] Breaking change
- [ ] Documentation update

## Como Testar

1. Passo 1
2. Passo 2
3. Passo 3

## Checklist

- [ ] Código revisado
- [ ] Testes adicionados
- [ ] Documentação atualizada
- [ ] CI/CD passa

## Screenshots (se aplicável)
```

## 💡 Dicas

### Bypassar Hooks (Não Recomendado)

```bash
# Apenas em emergências
git commit --no-verify
git push --no-verify
```

### Debug de Testes

```bash
# Vitest debug
pnpm test:ui

# Playwright debug
pnpm test:e2e:debug
```

### Limpar Cache

```bash
# Limpar node_modules
pnpm clean
node -e "require('fs').rmSync('node_modules', { recursive: true, force: true })"
pnpm install

# Limpar build
node -e "const fs=require('fs');const path=require('path');for (const dir of fs.readdirSync('packages')){const dist=path.join('packages',dir,'dist');if(fs.existsSync(dist)) fs.rmSync(dist,{recursive:true,force:true});}"
pnpm compile:core
```

## 🐛 Reportar Bugs

Ao reportar bugs, inclua:

1. Versão do Node.js
2. Versão do pnpm
3. Sistema operacional
4. Passos para reproduzir
5. Comportamento esperado vs real
6. Screenshots (se aplicável)

## ❓ Dúvidas

Se tiver dúvidas:

1. Verifique a [documentação](./README.md)
2. Procure em [issues existentes](https://github.com/seu-usuario/proto-typed/issues)
3. Abra uma nova issue com a tag `question`

---

Obrigado por contribuir! 🎉
