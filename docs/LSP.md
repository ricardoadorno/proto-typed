# LSP - Language Server Protocol

## Visão Geral

A versão **0.0.2** do ProtoTyped introduz suporte completo ao **Language Server Protocol (LSP)** com funcionalidades de **lint**, **formatter** e **code actions** (quick fixes).

O módulo LSP está localizado em `src/core/lsp/` e fornece uma API modular e reutilizável para análise e formatação de código DSL.

## Arquitetura

### Estrutura de Arquivos

```
src/core/lsp/
├── index.ts           # API principal e exports
├── types.ts           # Tipos LSP (Diagnostic, CodeAction, etc.)
├── diagnostics.ts     # Conversão de ProtoError para LSP Diagnostic
├── linter.ts          # Linter usando parser e validações
├── formatter.ts       # Formatter baseado em AST
└── code-actions.ts    # Quick fixes usando sistema de sugestões
```

### Componentes

#### 1. **Types** (`types.ts`)

Define tipos LSP compatíveis com o protocolo padrão:

- `Diagnostic`: Representa problemas no código
- `DiagnosticSeverity`: Error, Warning, Information, Hint
- `CodeAction`: Ações de correção/refatoração
- `TextEdit`: Mudanças no texto
- `Range` e `Position`: Localização no documento

#### 2. **Diagnostics** (`diagnostics.ts`)

Converte erros do `ErrorBus` para diagnósticos LSP:

```typescript
import { getDiagnosticsFromErrorBus } from './core/lsp/diagnostics';

const errorBus = ErrorBus.get();
const result = getDiagnosticsFromErrorBus(errorBus);

console.log(`Erros: ${result.errorCount}`);
console.log(`Warnings: ${result.warningCount}`);
```

#### 3. **Linter** (`linter.ts`)

Analisa código e retorna diagnósticos:

```typescript
import { lint } from './core/lsp';

const code = `
Screen Home:
  Button primery: Click me
`;

const result = lint(code);

result.diagnostics.forEach(diagnostic => {
  console.log(`[${diagnostic.severity}] ${diagnostic.message}`);
  console.log(`Linha ${diagnostic.range.start.line + 1}`);
});
```

**Funções disponíveis:**

- `lint(text, uri?, options?)`: Lint completo
- `lintErrors(text, uri?)`: Apenas erros
- `lintErrorsAndWarnings(text, uri?)`: Erros e warnings
- `hasErrors(text)`: Verifica se há erros
- `isValid(text)`: Verifica se código é válido

#### 4. **Formatter** (`formatter.ts`)

Formata código DSL com indentação e espaçamento corretos:

```typescript
import { format } from './core/lsp';

const unformatted = `
Screen Home:
Button primary:Click me
Text:Welcome
`;

const result = format(unformatted, {
  tabSize: 2,
  insertSpaces: true,
  trimTrailingWhitespace: true,
  insertFinalNewline: true,
});

if (result) {
  console.log(result[0].newText); // Código formatado
}
```

**Opções de formatação:**

- `tabSize`: Tamanho da tab em espaços (padrão: 2)
- `insertSpaces`: Usar espaços ao invés de tabs (padrão: true)
- `trimTrailingWhitespace`: Remover espaços no final das linhas
- `insertFinalNewline`: Adicionar nova linha no final
- `trimFinalNewlines`: Remover linhas vazias extras no final
- `maxLineLength`: Comprimento máximo da linha

#### 5. **Code Actions** (`code-actions.ts`)

Fornece quick fixes baseados em sugestões:

```typescript
import { getAllCodeActions } from './core/lsp';

const lintResult = lint(code);
const actions = getAllCodeActions(lintResult.diagnostics, code);

actions.forEach(action => {
  console.log(action.title); // Ex: "Change to 'primary'"
  console.log(action.kind);  // Ex: "quickfix"
});
```

**Tipos de code actions suportados:**

- Correção de typos em button variants (`primery` → `primary`)
- Correção de typos em button sizes (`mdm` → `md`)
- Correção de typos em input types (`emial` → `email`)
- Correção de layout modifiers inválidos

## API Principal

### Análise Completa

Use a função `analyze` para obter lint, format e code actions de uma vez:

```typescript
import { analyze } from './core/lsp';

const result = analyze(code, 'file:///path/to/file.pt', {
  tabSize: 2,
  insertSpaces: true,
});

console.log('Diagnostics:', result.lint.diagnostics);
console.log('Format edits:', result.format);
console.log('Code actions:', result.codeActions);
```

### API LSP Unificada

```typescript
import LSP from './core/lsp';

// Lint
const lintResult = LSP.lint(code);

// Format
const formatResult = LSP.format(code, { tabSize: 2, insertSpaces: true });

// Code Actions
const actions = LSP.getCodeActions(lintResult.diagnostics, code);

// Análise completa
const analysis = LSP.analyze(code);
```

## Integração com ErrorBus

O LSP integra-se perfeitamente com o sistema ErrorBus existente:

```typescript
import { ErrorBus } from './core/error-bus';
import { parseAndBuildAst } from './core/parser/parse-and-build-ast';
import { getDiagnosticsFromErrorBus } from './core/lsp';

// Clear previous errors
ErrorBus.get().clear();

// Parse (errors are collected automatically)
parseAndBuildAst(code);

// Get diagnostics
const result = getDiagnosticsFromErrorBus(ErrorBus.get());
```

## Integração com Monaco Editor

O LSP pode ser facilmente integrado ao Monaco Editor para fornecer:

- **Diagnósticos em tempo real** (squiggly lines)
- **Code actions** (lâmpada de quick fix)
- **Formatação automática** (Format Document)

Exemplo de integração:

```typescript
import * as monaco from 'monaco-editor';
import { lint, format, getAllCodeActions } from './core/lsp';

// Register diagnostics provider
monaco.languages.registerCodeActionProvider('proto-typed-dsl', {
  provideCodeActions: (model, range, context) => {
    const code = model.getValue();
    const lintResult = lint(code);

    return {
      actions: getAllCodeActions(lintResult.diagnostics, code).map(action => ({
        title: action.title,
        kind: action.kind,
        edit: {
          edits: action.edit?.changes?.['']?.map(edit => ({
            range: edit.range,
            text: edit.newText,
          })) || [],
        },
      })),
      dispose: () => {},
    };
  },
});

// Register format provider
monaco.languages.registerDocumentFormattingEditProvider('proto-typed-dsl', {
  provideDocumentFormattingEdits: (model, options) => {
    const code = model.getValue();
    return format(code, options) || [];
  },
});
```

## Validações Implementadas

O linter usa o sistema de validação existente em `builder-validation.ts`:

### Validações de Componentes

- ✅ Nomes de componentes devem começar com letra maiúscula
- ✅ Props obrigatórias devem estar presentes
- ✅ Tipos de props devem ser válidos

### Validações de Botões

- ✅ Variants válidos: `primary`, `secondary`, `outline`, `ghost`, `destructive`, `link`, `success`, `warning`
- ✅ Sizes válidos: `xs`, `sm`, `md`, `lg`
- ✅ Label é obrigatório

### Validações de Inputs

- ✅ Tipos válidos: `text`, `email`, `password`, `number`, `date`, `textarea`, `select`
- ✅ Label é obrigatório

### Validações de Layouts

- ✅ Modifiers válidos: `center`, `start`, `end`, `between`, `around`, `evenly`, `tight`, `loose`, `flush`, `compact`, `narrow`, `wide`, `full`, `auto`

### Validações de Views

- ✅ Nomes de Screen/Modal/Drawer devem começar com letra maiúscula
- ✅ Nome é obrigatório

## Sistema de Sugestões

O LSP usa o algoritmo de Levenshtein distance (implementado em `suggestions.ts`) para sugerir correções:

```typescript
import { suggestButtonVariant } from './core/utils/suggestions';

const suggestion = suggestButtonVariant('primery');
console.log(suggestion); // 'primary'
```

**Funções de sugestão disponíveis:**

- `suggestButtonVariant(input)`
- `suggestButtonSize(input)`
- `suggestInputType(input)`
- `suggestLayoutModifier(input)`
- `suggestClosest(input, dictionary, maxDistance)`

## Exemplos de Uso

### Exemplo 1: Validação Simples

```typescript
import { lint, isValid } from './core/lsp';

const code = `
Screen Home:
  Button primary: Click me
  Text: Welcome
`;

if (isValid(code)) {
  console.log('✅ Código válido!');
} else {
  const result = lint(code);
  console.log(`❌ ${result.errorCount} erro(s) encontrado(s)`);
}
```

### Exemplo 2: Formatação

```typescript
import { format, needsFormatting } from './core/lsp';

const code = `Screen Home:
Button primary:Click me`;

if (needsFormatting(code)) {
  const result = format(code);
  console.log('Código formatado:', result[0].newText);
}
```

### Exemplo 3: Code Actions

```typescript
import { lint, getAllCodeActions } from './core/lsp';

const code = `
Screen Home:
  Button primery: Click me
`;

const lintResult = lint(code);
const actions = getAllCodeActions(lintResult.diagnostics, code);

actions.forEach(action => {
  console.log(`💡 ${action.title}`);
  // Apply the edit
  if (action.edit?.changes) {
    const edits = Object.values(action.edit.changes).flat();
    edits.forEach(edit => {
      console.log(`  Replace '${extractText(edit.range)}' with '${edit.newText}'`);
    });
  }
});
```

### Exemplo 4: Análise Completa

```typescript
import { analyze } from './core/lsp';

const code = `
Screen Home:
  Container wide:
    Button primery lg: Click me
    Input emial: Your email
`;

const result = analyze(code);

console.log('=== Análise Completa ===');
console.log(`Erros: ${result.lint.errorCount}`);
console.log(`Warnings: ${result.lint.warningCount}`);
console.log(`Code Actions: ${result.codeActions.length}`);
console.log(`Precisa formatação: ${result.format !== null}`);
```

## Benefícios

### 1. **Modularidade**

Toda a lógica LSP está no `core`, permitindo uso em:
- Monaco Editor (web)
- VS Code Extension (futuro)
- CLI tools
- Build systems

### 2. **Reutilização**

Usa infraestrutura existente:
- `ErrorBus` para gerenciamento de erros
- `builder-validation.ts` para validações
- `suggestions.ts` para correções
- `parseAndBuildAst` para parsing

### 3. **Type Safety**

Todos os tipos LSP são fortemente tipados com TypeScript.

### 4. **Extensibilidade**

Fácil adicionar novas validações e code actions:

```typescript
// Adicionar nova validação em builder-validation.ts
export function validateNewRule(visitor, value, line, column) {
  if (!isValid(value)) {
    addBuilderError(visitor, {
      stage: 'builder',
      severity: 'warning',
      code: ERROR_CODES.BLD_CUSTOM,
      message: 'Custom validation message',
      line,
      column,
    });
  }
}

// Adicionar nova sugestão em suggestions.ts
export function suggestNewRule(input: string): string | null {
  const VALID_VALUES = ['option1', 'option2', 'option3'];
  return suggestClosest(input, VALID_VALUES);
}

// Adicionar code action em code-actions.ts
// Será automaticamente detectado pelo error code
```

## Roadmap

### Versão 0.0.3 (Planejado)

- [ ] Hover information (documentação ao passar o mouse)
- [ ] Auto-completion melhorado
- [ ] Rename symbol
- [ ] Find references
- [ ] Go to definition

### Versão 0.1.0 (Planejado)

- [ ] Standalone LSP server
- [ ] VS Code Extension
- [ ] Semantic tokens (syntax highlighting melhorado)
- [ ] Folding ranges
- [ ] Document symbols

## Contribuindo

Para adicionar novas funcionalidades ao LSP:

1. **Adicionar validação**: Edite `builder-validation.ts`
2. **Adicionar sugestão**: Edite `suggestions.ts`
3. **Adicionar code action**: Edite `code-actions.ts`
4. **Adicionar tipo de erro**: Edite `types/errors.ts`

## Referências

- [Language Server Protocol Specification](https://microsoft.github.io/language-server-protocol/)
- [Monaco Editor API](https://microsoft.github.io/monaco-editor/api/index.html)
- [Chevrotain Parser](https://chevrotain.io/)
