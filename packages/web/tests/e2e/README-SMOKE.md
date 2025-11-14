# 🚀 Testes E2E - Smoke Tests

## O que são Smoke Tests?

Testes **rápidos e essenciais** que validam que o playground **não está quebrado**. Rodam em segundos e dão feedback imediato.

---

## ⚡ Execução Rápida

### Teste Principal (Recomendado)
```bash
cd packages/web
pnpm test:e2e
```

**O que faz:**
- ✅ Roda 10 testes essenciais
- ✅ Mostra resultados no CLI (reporter=list)
- ✅ Falha rápido se algo estiver quebrado
- ✅ Usa seu servidor na porta 3002

**Saída esperada:**
```
✓  should load playground page (2s)
✓  should have Monaco editor (5s)
✓  should have preview panel (1s)
✓  should render default example (3s)
✓  should have Export HTML button (1s)
✓  should have View Documentation link (1s)
✓  should have example buttons (1s)
✓  should update preview when example is clicked (3s)
✓  should show screen count when DSL has screens (2s)
✓  should not crash with invalid DSL (2s)

10 passed (21s)
```

---

## 🔍 Ver o Browser (Debug Visual)

```bash
cd packages/web
pnpm test:e2e:headed
```

Abre o browser e você vê o que está acontecendo.

---

## 🎯 Testes Incluídos

| Teste | O que valida | Tempo |
|-------|--------------|-------|
| Load page | Página carrega com título | ~2s |
| Monaco editor | Editor está presente e visível | ~5s |
| Preview panel | Preview está renderizando | ~1s |
| Default example | Preview tem conteúdo inicial | ~3s |
| Export button | Botão de export existe | ~1s |
| Docs link | Link para documentação existe | ~1s |
| Example buttons | Tem exemplos para clicar | ~1s |
| Example click | Clicar em exemplo atualiza preview | ~3s |
| Screen count | Mostra contagem de screens | ~2s |
| Invalid DSL | Não quebra com syntax inválido | ~2s |

**Total: ~21 segundos**

---

## 📊 Interpretando Resultados

### ✅ Tudo passou
```
10 passed (21s)
```
**Ação:** Continue desenvolvendo! Tudo está funcionando.

### ❌ Algo falhou
```
✓  should load playground page (2s)
✗  should have Monaco editor (timeout)

Error: Timeout 30000ms exceeded
```

**O que fazer:**
1. Verificar se Next.js está rodando na 3002
2. Verificar console do Next.js por erros
3. Executar com `--headed` para ver o que está acontecendo

---

## 🛠️ Troubleshooting

### "baseURL não responde"
**Causa:** Next.js não está rodando
**Solução:**
```bash
# Em outro terminal
pnpm dev
```

### "Monaco editor não carrega"
**Causa:** Monaco demorou mais de 30s
**Solução:** Aumentar timeout (normal em máquinas lentas)

### "Preview vazio"
**Causa:** Parser teve erro
**Solução:** Verificar console do browser com `--headed`

---

## 🔧 Comandos Disponíveis

```bash
# Smoke tests (rápido)
pnpm test:e2e

# Todos os testes (demora mais)
pnpm test:e2e:all

# Ver no browser
pnpm test:e2e:headed

# Debug passo-a-passo
pnpm test:e2e:debug
```

---

## 💡 Filosofia dos Smoke Tests

**Rápido > Completo**
- Validam o essencial em segundos
- Falham rápido se algo está quebrado
- Rodam no CLI sem interação
- Feedback imediato para desenvolvedores

**Para testes completos, use `pnpm test:e2e:all`**

---

## 📝 Quando Rodar

- ✅ Antes de commit
- ✅ Depois de mudar código do editor
- ✅ Depois de mudar código do preview
- ✅ Depois de pull do git
- ✅ Quando algo parece quebrado

---

## 🎯 Resultado Esperado

Com seu **Next.js rodando na 3002**, ao executar `pnpm test:e2e`, você deve ver:

```
Running 10 tests using 3 workers

✓  should load playground page (chromium) (2s)
✓  should have Monaco editor (chromium) (5s)
✓  should have preview panel (chromium) (1s)
...

10 passed (21s)
```

**Se todos passarem = Playground está funcionando!** ✅

---

**Próximo passo:** Execute `pnpm test:e2e` agora! 🚀
