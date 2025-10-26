# Tests

Este diretório contém todos os testes do monorepo.

## Estrutura

- `unit/` - Testes unitários com Vitest
- `e2e/` - Testes E2E com Playwright

## Rodando os Testes

### Testes Unitários (Vitest)

```bash
# Rodar testes em modo watch
pnpm test

# Rodar testes com UI
pnpm test:ui

# Rodar testes uma vez
pnpm test:run

# Rodar testes com coverage
pnpm test:coverage
```

### Testes E2E (Playwright)

```bash
# Rodar testes E2E
pnpm test:e2e

# Rodar testes E2E com UI
pnpm test:e2e:ui

# Rodar testes E2E em modo debug
pnpm test:e2e:debug
```

## Escrevendo Testes

### Testes Unitários

Crie arquivos com extensão `.test.ts` ou `.spec.ts` no diretório `unit/` ou em qualquer pacote do monorepo.

```typescript
import { describe, it, expect } from 'vitest'

describe('My Component', () => {
  it('should render correctly', () => {
    expect(true).toBe(true)
  })
})
```

### Testes E2E

Crie arquivos com extensão `.spec.ts` no diretório `e2e/`.

```typescript
import { test, expect } from '@playwright/test'

test('should navigate', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/Proto-Typed/)
})
```
