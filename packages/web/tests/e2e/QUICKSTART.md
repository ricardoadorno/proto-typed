# 🚀 Quick Start - Testes E2E Proto-Typed

## Execução Imediata (Modo UI - Recomendado)

```bash
cd packages/web
pnpm test:e2e:ui
```

Isso abrirá uma interface gráfica onde você pode:
- ✅ Ver todos os 357 testes
- ✅ Executar testes individuais
- ✅ Debug visual
- ✅ Ver screenshots e traces
- ✅ Filtrar por nome

## Executar Todos os Testes

```bash
cd packages/web
pnpm test:e2e
```

## Executar Teste Específico

```bash
cd packages/web
pnpm test:e2e playground-basic.spec.ts
```

## Ver Relatório

Após executar os testes:

```bash
pnpm exec playwright show-report
```

## Troubleshooting

### Browsers não instalados?
```bash
pnpm exec playwright install
```

### Timeout no servidor?
O Next.js com Turbopack leva 30-60s para iniciar. Isso é normal.

Se continuar com timeout, edite `playwright.config.ts` linha 61:
```typescript
timeout: 180 * 1000, // Aumentar para 3 minutos
```

### Quer ver o browser durante os testes?
```bash
cd packages/web
pnpm test:e2e:headed
```

## Estrutura dos Testes

- `playground-basic.spec.ts` - Testes básicos do editor e preview
- `playground-completion.spec.ts` - Autocompletion do Monaco
- `playground-preview.spec.ts` - Renderização de elementos
- `playground-navigation.spec.ts` - Navegação entre telas
- `playground-errors.spec.ts` - Tratamento de erros
- `playground-export.spec.ts` - Export e features extras

## Dicas

1. **Use o modo UI** - É muito mais fácil para debug
2. **Execute por arquivo** - Mais rápido que executar todos de uma vez
3. **Use --headed** - Para ver o que está acontecendo
4. **Use --debug** - Para debug passo-a-passo

## Exemplos de Comandos

```bash
# Executar apenas testes de autocompletion
pnpm test:e2e playground-completion.spec.ts

# Executar em modo debug
pnpm test:e2e:debug

# Executar apenas no Chromium
pnpm test:e2e --project=chromium

# Executar com UI
pnpm test:e2e:ui
```

## Validação Rápida

Para confirmar que tudo está funcionando:

```bash
# Listar todos os testes
pnpm test:e2e --list

# Deve mostrar: "Total: 357 tests in 6 files"
```

---

**📚 Para mais detalhes, veja `README.md` e `VALIDATION.md`**
