# Proto-Typed Extension Test Plan

## Plano de Testes Robusto para LSP e Extensão VSCode

> Baseado nas melhores práticas do Microsoft LSP Sample, Vue.js Language Tools (Volar), e VS Code Extension Testing Guide

---

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Arquitetura de Testes](#arquitetura-de-testes)
3. [Setup e Configuração](#setup-e-configuração)
4. [Tipos de Testes](#tipos-de-testes)
5. [Estrutura de Arquivos](#estrutura-de-arquivos)
6. [Executando os Testes](#executando-os-testes)
7. [Guia de Implementação](#guia-de-implementação)
8. [Debugging](#debugging)
9. [CI/CD Integration](#cicd-integration)
10. [Troubleshooting](#troubleshooting)

---

## 🎯 Visão Geral

Este plano de testes garante a qualidade e confiabilidade da extensão Proto-Typed através de uma estratégia de testes em múltiplas camadas:

### **Objetivos**

- ✅ **Cobertura Completa**: Todas as funcionalidades LSP testadas
- ✅ **Integração Real**: Testes com VSCode real (não mocks)
- ✅ **Confiabilidade**: Testes determinísticos e estáveis
- ✅ **Manutenibilidade**: Código de teste limpo e reutilizável
- ✅ **Performance**: Testes rápidos e eficientes

### **Filosofia de Testes**

Seguimos a abordagem de **testing pyramid**:

```
        ┌─────────────┐
        │   E2E (10%) │  ← Electron VSCode Tests
        ├─────────────┤
        │Integration  │  ← LSP Engine + Adapters
        │   (30%)     │
        ├─────────────┤
        │  Unit Tests │  ← Components isolados
        │   (60%)     │
        └─────────────┘
```

---

## 🏗️ Arquitetura de Testes

### **1. Unit Tests (Vitest)**

Testes isolados de componentes individuais:

- Language Engine
- Adapters (VSCode, Monaco)
- Parsing e AST
- Diagnostics
- Completions
- Hover
- Code Actions

### **2. Integration Tests (Vitest + vscode-test)**

Testes de integração entre componentes:

- Language Server <-> Extension Host
- TextDocument lifecycle
- Diagnostics Collection
- Command registration
- Configuration updates

### **3. End-to-End Tests (Mocha + @vscode/test-electron)**

Testes em ambiente real do VSCode:

- User workflows completos
- UI interactions
- Webview communication
- Real file operations
- Extension activation

---

## ⚙️ Setup e Configuração

### **Dependências Necessárias**

```json
{
  "devDependencies": {
    "@vscode/test-electron": "^2.4.1",
    "vitest": "^2.0.0",
    "@vitest/ui": "^2.0.0",
    "mocha": "^10.7.3",
    "chai": "^5.1.2",
    "vscode-languageserver-protocol": "^3.17.5",
    "vscode-languageserver-textdocument": "^1.0.12",
    "vscode-uri": "^3.0.8",
    "glob": "^11.0.0"
  }
}
```

### **Configuração Vitest**

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/**/*.{test,spec}.{js,ts}', '!tests/e2e/**/*'],
    exclude: ['node_modules', 'dist', 'out', 'tests/e2e/**/*'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.d.ts', 'src/test/**/*', 'src/**/*.test.ts'],
    },
  },
})
```

---

## 🧪 Tipos de Testes

### **1. Unit Tests - Language Engine**

#### **1.1 Diagnostics Tests**

Testar detecção e formatação de erros:

```typescript
// tests/unit/diagnostics.test.ts
import { describe, it, expect } from 'vitest'
import { createEngine } from '@proto-typed/core/language'
import { TextDocument } from 'vscode-languageserver-textdocument'

describe('Diagnostics', () => {
  it('should detect syntax errors', () => {
    const engine = createEngine(mockHost)
    const doc = TextDocument.create(
      'file:///test.pty',
      'proto-typed',
      1,
      'screen Home' // Missing colon
    )

    engine.open(doc)
    const diagnostics = engine.getDiagnostics(doc.uri)

    expect(diagnostics).toHaveLength(1)
    expect(diagnostics[0].message).toContain('Expected colon')
    expect(diagnostics[0].severity).toBe(1) // Error
  })

  it('should clear diagnostics for valid DSL', () => {
    const engine = createEngine(mockHost)
    const doc = TextDocument.create(
      'file:///test.pty',
      'proto-typed',
      1,
      'screen Home:\n  # Title'
    )

    engine.open(doc)
    const diagnostics = engine.getDiagnostics(doc.uri)

    expect(diagnostics).toHaveLength(0)
  })

  it('should detect multiple errors', () => {
    const engine = createEngine(mockHost)
    const doc = TextDocument.create(
      'file:///test.pty',
      'proto-typed',
      1,
      'screen Home\nmodal Settings' // Both missing colons
    )

    engine.open(doc)
    const diagnostics = engine.getDiagnostics(doc.uri)

    expect(diagnostics.length).toBeGreaterThanOrEqual(2)
  })
})
```

#### **1.2 Completions Tests**

Testar autocompletar contextual:

```typescript
// tests/unit/completions.test.ts
import { describe, it, expect } from 'vitest'
import { createEngine } from '@proto-typed/core/language'
import { TextDocument } from 'vscode-languageserver-textdocument'

describe('Completions', () => {
  it('should provide view keywords at start of line', () => {
    const engine = createEngine(mockHost)
    const doc = TextDocument.create('file:///test.pty', 'proto-typed', 1, 's')

    engine.open(doc)
    const completions = engine.getCompletions({
      textDocument: { uri: doc.uri },
      position: { line: 0, character: 1 },
    })

    expect(completions.items).toContainEqual(
      expect.objectContaining({ label: 'screen' })
    )
    expect(completions.items).toContainEqual(
      expect.objectContaining({ label: 'modal' })
    )
  })

  it('should provide button variants after @', () => {
    const engine = createEngine(mockHost)
    const doc = TextDocument.create('file:///test.pty', 'proto-typed', 1, '@')

    engine.open(doc)
    const completions = engine.getCompletions({
      textDocument: { uri: doc.uri },
      position: { line: 0, character: 1 },
    })

    expect(
      completions.items.some((item) => item.label.includes('primary'))
    ).toBe(true)
    expect(
      completions.items.some((item) => item.label.includes('secondary'))
    ).toBe(true)
  })

  it('should provide layout completions after indentation', () => {
    const engine = createEngine(mockHost)
    const doc = TextDocument.create(
      'file:///test.pty',
      'proto-typed',
      1,
      'screen Home:\n  c'
    )

    engine.open(doc)
    const completions = engine.getCompletions({
      textDocument: { uri: doc.uri },
      position: { line: 1, character: 3 },
    })

    expect(completions.items).toContainEqual(
      expect.objectContaining({ label: 'container:' })
    )
    expect(completions.items).toContainEqual(
      expect.objectContaining({ label: 'card:' })
    )
  })

  it('should provide snippets with placeholders', () => {
    const engine = createEngine(mockHost)
    const doc = TextDocument.create(
      'file:///test.pty',
      'proto-typed',
      1,
      'screen'
    )

    engine.open(doc)
    const completions = engine.getCompletions({
      textDocument: { uri: doc.uri },
      position: { line: 0, character: 6 },
    })

    const screenCompletion = completions.items.find(
      (item) => item.label === 'screen'
    )
    expect(screenCompletion?.insertText).toContain('${1:Name}')
    expect(screenCompletion?.insertTextFormat).toBe(2) // Snippet
  })
})
```

#### **1.3 Hover Tests**

Testar documentação ao passar o mouse:

```typescript
// tests/unit/hover.test.ts
import { describe, it, expect } from 'vitest'
import { createEngine } from '@proto-typed/core/language'
import { TextDocument } from 'vscode-languageserver-textdocument'

describe('Hover', () => {
  it('should show documentation for screen keyword', () => {
    const engine = createEngine(mockHost)
    const doc = TextDocument.create(
      'file:///test.pty',
      'proto-typed',
      1,
      'screen Home:'
    )

    engine.open(doc)
    const hover = engine.getHover({
      textDocument: { uri: doc.uri },
      position: { line: 0, character: 2 }, // Within 'screen'
    })

    expect(hover).not.toBeNull()
    expect(hover?.contents).toContain('screen')
    expect(hover?.contents).toContain('container')
  })

  it('should show documentation for button variant', () => {
    const engine = createEngine(mockHost)
    const doc = TextDocument.create(
      'file:///test.pty',
      'proto-typed',
      1,
      '@primary[Click](action)'
    )

    engine.open(doc)
    const hover = engine.getHover({
      textDocument: { uri: doc.uri },
      position: { line: 0, character: 3 }, // Within '@primary'
    })

    expect(hover).not.toBeNull()
    expect(hover?.contents).toContain('primary')
    expect(hover?.contents).toContain('button')
  })

  it('should return null for unknown tokens', () => {
    const engine = createEngine(mockHost)
    const doc = TextDocument.create(
      'file:///test.pty',
      'proto-typed',
      1,
      'unknownKeyword'
    )

    engine.open(doc)
    const hover = engine.getHover({
      textDocument: { uri: doc.uri },
      position: { line: 0, character: 5 },
    })

    expect(hover).toBeNull()
  })
})
```

#### **1.4 Code Actions Tests**

Testar quick fixes:

```typescript
// tests/unit/code-actions.test.ts
import { describe, it, expect } from 'vitest'
import { createEngine } from '@proto-typed/core/language'
import { TextDocument } from 'vscode-languageserver-textdocument'

describe('Code Actions', () => {
  it('should provide quick fix for missing colon', () => {
    const engine = createEngine(mockHost)
    const doc = TextDocument.create(
      'file:///test.pty',
      'proto-typed',
      1,
      'screen Home'
    )

    engine.open(doc)
    const diagnostics = engine.getDiagnostics(doc.uri)
    const actions = engine.getCodeActions({
      textDocument: { uri: doc.uri },
      range: diagnostics[0].range,
      context: { diagnostics },
    })

    expect(actions).toHaveLength(1)
    expect(actions[0].title).toContain('colon')
    expect(actions[0].kind).toBe('quickfix')
  })

  it('should provide fix for missing indentation', () => {
    const engine = createEngine(mockHost)
    const doc = TextDocument.create(
      'file:///test.pty',
      'proto-typed',
      1,
      'screen Home:\n# Title' // Missing indentation
    )

    engine.open(doc)
    const diagnostics = engine.getDiagnostics(doc.uri)
    const actions = engine.getCodeActions({
      textDocument: { uri: doc.uri },
      range: diagnostics[0].range,
      context: { diagnostics },
    })

    expect(actions.length).toBeGreaterThan(0)
    expect(actions[0].title).toContain('indent')
  })
})
```

---

### **2. Integration Tests - VSCode Adapter**

#### **2.1 Document Lifecycle Tests**

```typescript
// tests/integration/document-lifecycle.test.ts
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { createEngine } from '@proto-typed/core/language'
import { TextDocument } from 'vscode-languageserver-textdocument'

describe('Document Lifecycle', () => {
  let engine: ReturnType<typeof createEngine>
  let diagnosticsReceived: Array<{ uri: string; diagnostics: any[] }>

  beforeEach(() => {
    diagnosticsReceived = []
    engine = createEngine(mockHost)

    engine.onDiagnostics((uri, diagnostics) => {
      diagnosticsReceived.push({ uri, diagnostics })
    })
  })

  it('should handle document open', () => {
    const doc = TextDocument.create(
      'file:///test.pty',
      'proto-typed',
      1,
      'screen Home:'
    )

    engine.open(doc)

    expect(diagnosticsReceived).toHaveLength(1)
    expect(diagnosticsReceived[0].uri).toBe(doc.uri)
  })

  it('should handle document update', () => {
    const doc1 = TextDocument.create(
      'file:///test.pty',
      'proto-typed',
      1,
      'screen Home:'
    )

    engine.open(doc1)
    diagnosticsReceived = []

    const doc2 = TextDocument.create(
      'file:///test.pty',
      'proto-typed',
      2,
      'screen Home\n  # Title'
    )

    engine.update(doc2)

    expect(diagnosticsReceived).toHaveLength(1)
    expect(diagnosticsReceived[0].diagnostics.length).toBe(0)
  })

  it('should handle document close', () => {
    const doc = TextDocument.create(
      'file:///test.pty',
      'proto-typed',
      1,
      'screen Home:'
    )

    engine.open(doc)
    engine.close(doc.uri)

    const diagnostics = engine.getDiagnostics(doc.uri)
    expect(diagnostics).toHaveLength(0)
  })

  it('should not leak memory on document close', () => {
    const doc = TextDocument.create(
      'file:///test.pty',
      'proto-typed',
      1,
      'screen Home:'
    )

    engine.open(doc)
    const initialCount = diagnosticsReceived.length

    engine.close(doc.uri)

    // Update after close should not trigger diagnostics
    engine.update(doc)
    expect(diagnosticsReceived.length).toBe(initialCount)
  })
})
```

#### **2.2 Configuration Tests**

```typescript
// tests/integration/configuration.test.ts
import { describe, it, expect } from 'vitest'
import { createEngine } from '@proto-typed/core/language'

describe('Configuration', () => {
  it('should respect maxNumberOfProblems setting', () => {
    const engine = createEngine(mockHost)
    const doc = TextDocument.create(
      'file:///test.pty',
      'proto-typed',
      1,
      'screen\nmodal\ndrawer\ncomponent' // 4 errors
    )

    engine.open(doc)
    const diagnostics = engine.getDiagnostics(doc.uri)

    // Should respect limit set in config
    expect(diagnostics.length).toBeLessThanOrEqual(3)
  })
})
```

---

### **3. End-to-End Tests - Real VSCode**

#### **3.1 Extension Activation Tests**

```typescript
// tests/e2e/suite/activation.test.ts
import * as assert from 'assert'
import * as vscode from 'vscode'

suite('Extension Activation', () => {
  test('should activate for .pty files', async () => {
    const doc = await vscode.workspace.openTextDocument({
      language: 'proto-typed',
      content: 'screen Home:',
    })

    await vscode.window.showTextDocument(doc)

    const extension = vscode.extensions.getExtension('proto-typed.proto-typed')
    assert.ok(extension, 'Extension should be registered')
    assert.ok(extension.isActive, 'Extension should be active')
  })

  test('should register commands', async () => {
    const commands = await vscode.commands.getCommands()

    assert.ok(
      commands.includes('proto-typed.showPreview'),
      'Preview command should be registered'
    )
  })
})
```

#### **3.2 LSP E2E Tests**

```typescript
// tests/e2e/suite/lsp.test.ts
import * as assert from 'assert'
import * as vscode from 'vscode'
import { sleep, getDocUri } from '../helpers'

suite('LSP Integration', () => {
  test('should provide completions', async () => {
    const docUri = getDocUri('test.pty')
    const doc = await vscode.workspace.openTextDocument(docUri)
    await vscode.window.showTextDocument(doc)
    await sleep(2000) // Wait for LSP activation

    const position = new vscode.Position(0, 1)
    const completions =
      await vscode.commands.executeCommand<vscode.CompletionList>(
        'vscode.executeCompletionItemProvider',
        docUri,
        position
      )

    assert.ok(completions, 'Should provide completions')
    assert.ok(
      completions.items.some((item) => item.label === 'screen'),
      'Should include screen keyword'
    )
  })

  test('should provide hover documentation', async () => {
    const docUri = getDocUri('hover.pty')
    const doc = await vscode.workspace.openTextDocument(docUri)
    await vscode.window.showTextDocument(doc)
    await sleep(2000)

    const position = new vscode.Position(0, 2) // Within 'screen'
    const hovers = await vscode.commands.executeCommand<vscode.Hover[]>(
      'vscode.executeHoverProvider',
      docUri,
      position
    )

    assert.ok(hovers && hovers.length > 0, 'Should provide hover')
    const hoverText = (hovers[0].contents[0] as vscode.MarkdownString).value
    assert.ok(hoverText.includes('screen'), 'Hover should contain screen info')
  })

  test('should show diagnostics for errors', async () => {
    const docUri = getDocUri('error.pty')
    const doc = await vscode.workspace.openTextDocument(docUri)
    await vscode.window.showTextDocument(doc)
    await sleep(2000)

    const diagnostics = vscode.languages.getDiagnostics(docUri)
    assert.ok(diagnostics.length > 0, 'Should have diagnostics')
    assert.strictEqual(diagnostics[0].severity, vscode.DiagnosticSeverity.Error)
  })

  test('should provide code actions', async () => {
    const docUri = getDocUri('error.pty')
    const doc = await vscode.workspace.openTextDocument(docUri)
    await vscode.window.showTextDocument(doc)
    await sleep(2000)

    const diagnostics = vscode.languages.getDiagnostics(docUri)
    const range = diagnostics[0].range

    const actions = await vscode.commands.executeCommand<vscode.Command[]>(
      'vscode.executeCodeActionProvider',
      docUri,
      range
    )

    assert.ok(actions && actions.length > 0, 'Should provide code actions')
  })
})
```

#### **3.3 Webview E2E Tests**

```typescript
// tests/e2e/suite/webview.test.ts
import * as assert from 'assert'
import * as vscode from 'vscode'
import { sleep } from '../helpers'

suite('Webview Integration', () => {
  test('should open preview panel', async () => {
    const doc = await vscode.workspace.openTextDocument({
      language: 'proto-typed',
      content: 'screen Home:\n  # Welcome',
    })

    await vscode.window.showTextDocument(doc)
    await sleep(1000)

    await vscode.commands.executeCommand('proto-typed.showPreview')
    await sleep(2000)

    // Verify webview is open (check via extension API)
    const extension = vscode.extensions.getExtension('proto-typed.proto-typed')
    const api = extension?.exports

    assert.ok(api?.getCurrentPanel(), 'Preview panel should be open')
  })

  test('should sync document changes to webview', async () => {
    const doc = await vscode.workspace.openTextDocument({
      language: 'proto-typed',
      content: 'screen Home:',
    })

    await vscode.window.showTextDocument(doc)
    await vscode.commands.executeCommand('proto-typed.showPreview')
    await sleep(2000)

    // Edit document
    const edit = new vscode.WorkspaceEdit()
    edit.insert(doc.uri, new vscode.Position(1, 0), '\n  # New content')
    await vscode.workspace.applyEdit(edit)
    await sleep(1000)

    const extension = vscode.extensions.getExtension('proto-typed.proto-typed')
    const api = extension?.exports
    const lastHtml = api?.getLastRenderedHtml()

    assert.ok(lastHtml?.includes('New content'), 'Webview should update')
  })
})
```

---

## 📁 Estrutura de Arquivos

```
packages/extension/tests/
├── README.md                          # Este documento
├── vitest.config.ts                   # Config Vitest
├── setup.ts                           # Setup global para testes
│
├── unit/                              # Testes unitários
│   ├── diagnostics.test.ts           # Diagnostics engine
│   ├── completions.test.ts           # Completions engine
│   ├── hover.test.ts                 # Hover engine
│   ├── code-actions.test.ts          # Code actions
│   └── semantic-tokens.test.ts       # Semantic tokens
│
├── integration/                       # Testes de integração
│   ├── document-lifecycle.test.ts    # Open/Update/Close
│   ├── configuration.test.ts         # Settings
│   ├── vscode-adapter.test.ts        # VSCode adapter
│   └── monaco-adapter.test.ts        # Monaco adapter
│
├── e2e/                               # Testes E2E
│   ├── extension.e2e.spec.ts         # Runner principal
│   ├── tsconfig.json                 # Config TypeScript
│   ├── helpers.ts                    # Utilities
│   ├── fixtures/                     # Test files
│   │   ├── test.pty
│   │   ├── hover.pty
│   │   └── error.pty
│   └── suite/                        # Test suites
│       ├── index.ts                  # Suite setup
│       ├── activation.test.ts        # Extension activation
│       ├── lsp.test.ts              # LSP features
│       └── webview.test.ts          # Webview integration
│
└── __mocks__/                         # Mocks reutilizáveis
    ├── host.ts                       # Mock LanguageHost
    └── vscode.ts                     # Mock VSCode API
```

---

## 🚀 Executando os Testes

### **Unit Tests**

```bash
# Watch mode (desenvolvimento)
pnpm test

# Run once (CI)
pnpm test:run

# Coverage
pnpm test:coverage

# UI
pnpm test:ui

# Specific file
pnpm vitest run tests/unit/diagnostics.test.ts
```

### **Integration Tests**

```bash
# All integration tests
pnpm test:integration

# Specific test
pnpm vitest run tests/integration/document-lifecycle.test.ts
```

### **E2E Tests**

```bash
# Compile and run E2E
pnpm test:e2e

# Debug mode
pnpm test:e2e:debug

# Update snapshots
pnpm test:e2e:update-snapshots
```

### **All Tests**

```bash
# Run everything
pnpm test:all

# CI mode
pnpm test:ci
```

---

## 🔧 Guia de Implementação

### **Step 1: Setup Inicial**

1. **Instalar dependências**:

```bash
pnpm add -D @vscode/test-electron mocha chai glob
```

2. **Configurar Vitest** (já existe)

3. **Criar estrutura de pastas**:

```bash
mkdir -p tests/{unit,integration,e2e/suite,e2e/fixtures,__mocks__}
```

### **Step 2: Implementar Unit Tests**

1. **Criar mock do LanguageHost**:

```typescript
// tests/__mocks__/host.ts
import { parseAndBuildAst } from '@proto-typed/core'
import type { LanguageHost } from '@proto-typed/core/language'

export function createMockHost(): LanguageHost {
  return {
    parse(text: string, uri: string) {
      const ast = parseAndBuildAst(text)
      const errors = ast.__errors || []
      return { ast, errors }
    },
  }
}
```

2. **Implementar testes de cada feature** (exemplos acima)

### **Step 3: Implementar Integration Tests**

1. **Testar lifecycle de documentos**
2. **Testar adaptadores**
3. **Testar configurações**

### **Step 4: Implementar E2E Tests**

1. **Setup E2E runner**:

```typescript
// tests/e2e/extension.e2e.spec.ts
import * as path from 'path'
import { runTests } from '@vscode/test-electron'

async function main() {
  try {
    const extensionDevelopmentPath = path.resolve(__dirname, '../../')
    const extensionTestsPath = path.resolve(__dirname, './suite/index')
    const testWorkspace = path.resolve(__dirname, '../fixtures')

    await runTests({
      extensionDevelopmentPath,
      extensionTestsPath,
      launchArgs: [testWorkspace, '--disable-extensions'],
    })
  } catch (err) {
    console.error('Failed to run tests:', err)
    process.exit(1)
  }
}

main()
```

2. **Implementar test suites** (exemplos acima)

### **Step 5: CI/CD Integration**

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm test:run
      - run: pnpm test:coverage

  e2e-tests:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest, macos-latest]
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'pnpm'
      - run: pnpm install
      - run: xvfb-run -a pnpm test:e2e
        if: runner.os == 'Linux'
      - run: pnpm test:e2e
        if: runner.os != 'Linux'
```

---

## 🐛 Debugging

### **Debug Unit Tests**

```json
// .vscode/launch.json
{
  "type": "node",
  "request": "launch",
  "name": "Debug Unit Tests",
  "runtimeExecutable": "pnpm",
  "runtimeArgs": ["vitest", "run", "${file}"],
  "console": "integratedTerminal"
}
```

### **Debug E2E Tests**

```json
{
  "type": "extensionHost",
  "request": "launch",
  "name": "Debug E2E Tests",
  "runtimeExecutable": "${execPath}",
  "args": [
    "--extensionDevelopmentPath=${workspaceFolder}",
    "--extensionTestsPath=${workspaceFolder}/dist/tests/e2e/suite/index",
    "${workspaceFolder}/tests/e2e/fixtures"
  ],
  "outFiles": ["${workspaceFolder}/dist/**/*.js"]
}
```

---

## 🔍 Troubleshooting

### **Problema: Testes E2E não rodam**

**Solução**:

```bash
# 1. Verificar compilação
pnpm run compile

# 2. Verificar fixtures
ls -la tests/e2e/fixtures/

# 3. Limpar cache
rm -rf .vscode-test/
```

### **Problema: Memory leaks nos testes**

**Solução**:

```typescript
afterEach(() => {
  // Limpar listeners
  engine.close(doc.uri)

  // Limpar subscriptions
  subscriptions.forEach((sub) => sub.dispose())
  subscriptions = []
})
```

### **Problema: Testes flaky**

**Solução**:

```typescript
// Aumentar timeouts
await sleep(2000) // Em vez de 500ms

// Adicionar retries
test.retry(3, 'should provide hover', async () => {
  // Test code
})
```

---

## 📊 Métricas de Qualidade

### **Cobertura Esperada**

- Unit Tests: **> 80%**
- Integration Tests: **> 70%**
- E2E Tests: **Critical paths**

### **Performance**

- Unit Tests: **< 5s**
- Integration Tests: **< 30s**
- E2E Tests: **< 2min**

---

## 📚 Referências

### **Documentação Oficial**

- [VSCode Extension Testing](https://code.visualstudio.com/api/working-with-extensions/testing-extension)
- [LSP Specification](https://microsoft.github.io/language-server-protocol/)
- [vscode-test Documentation](https://github.com/microsoft/vscode-test)

### **Exemplos de Referência**

- [Microsoft LSP Sample](https://github.com/microsoft/vscode-extension-samples/tree/main/lsp-sample)
- [Vue Language Tools (Volar)](https://github.com/vuejs/language-tools)
- [TypeScript VSCode Extension](https://github.com/microsoft/vscode/tree/main/extensions/typescript-language-features)

---

## ✅ Checklist de Implementação

### **Fase 1: Unit Tests** (2-3 dias)

- [ ] Criar mocks reutilizáveis
- [ ] Implementar diagnostics tests
- [ ] Implementar completions tests
- [ ] Implementar hover tests
- [ ] Implementar code actions tests
- [ ] Configurar coverage

### **Fase 2: Integration Tests** (2-3 dias)

- [ ] Document lifecycle tests
- [ ] VSCode adapter tests
- [ ] Configuration tests
- [ ] Memory leak tests

### **Fase 3: E2E Tests** (3-4 dias)

- [ ] Setup E2E runner
- [ ] Extension activation tests
- [ ] LSP integration tests
- [ ] Webview tests
- [ ] Fixtures preparation

### **Fase 4: CI/CD** (1-2 dias)

- [ ] GitHub Actions workflow
- [ ] Test reporting
- [ ] Coverage reporting
- [ ] Cross-platform tests

---

## 🎯 Conclusão

Este plano fornece uma estratégia completa e robusta para testar a extensão Proto-Typed. Seguindo estas diretrizes, você terá:

✅ **Confiança** no código através de testes abrangentes
✅ **Manutenibilidade** com código de teste limpo
✅ **Documentação** viva através dos testes
✅ **Qualidade** garantida em todos os níveis

**Próximos Passos**:

1. Revisar este documento com o time
2. Priorizar implementação (Unit → Integration → E2E)
3. Configurar CI/CD desde o início
4. Manter testes atualizados com features novas

---

**Versão**: 1.0.0  
**Última Atualização**: 2025-01-09  
**Autor**: Proto-Typed Team
