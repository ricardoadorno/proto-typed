# Formatter & Linter - Documentação Técnica

## Visão Geral

Este documento descreve a implementação do **formatter** e **linter** para a linguagem DSL do Proto-Typed. Ambos os sistemas foram projetados para melhorar a experiência de desenvolvimento, oferecendo formatação automática e validações estruturais inteligentes.

---

## 1. Formatter (Formatação de Código)

### Localização
- `src/core/formatter/formatter.ts` - Lógica principal de formatação
- `src/core/formatter/format-provider.ts` - Integração com Monaco LSP
- `src/core/formatter/index.ts` - API pública

### Características Principais

#### 1.1 Idempotência
O formatter garante que formatar o mesmo código duas vezes produz resultados idênticos:
```typescript
formatDocument(formatDocument(code)) === formatDocument(code)
```

#### 1.2 Regras de Formatação

**Indentação:**
- 2 espaços por nível de aninhamento
- Blocos começam após `:` (dois pontos)
- Consistência automática em todo o documento

**Whitespace:**
- Remove trailing whitespace (espaços no final das linhas)
- Normaliza linhas vazias (máximo de 2 consecutivas)
- Preserva estrutura de blocos

**Preservação Semântica:**
- Nunca altera o significado do código
- Mantém comentários e conteúdo textual intactos
- Não reordena elementos

### 1.3 Integração com Monaco

O formatter está integrado ao Monaco Editor através de três providers:

**DocumentFormattingEditProvider:**
- Atalho: `Shift+Alt+F`
- Formata documento inteiro
- Disponível no menu de contexto

**DocumentRangeFormattingEditProvider:**
- Formata texto selecionado
- Mantém contexto do documento para consistência

**OnTypeFormattingEditProvider:**
- Triggers: `\n` (nova linha) e `:` (dois pontos)
- Remove trailing whitespace ao digitar
- Ajusta indentação automaticamente

### 1.4 Exemplo de Uso

**Antes da formatação:**
```
screen Home:
    container:
       # Welcome
          > This is a test
    stack:
      @primary[Click Me](Next)
```

**Depois da formatação:**
```
screen Home:
  container:
    # Welcome
    > This is a test
    stack:
      @primary[Click Me](Next)
```

### 1.5 API Pública

```typescript
// Formatar documento
formatDocument(code: string): string

// Verificar idempotência
isFormattingIdempotent(code: string): boolean

// Obter estatísticas
getFormattingStats(original: string, formatted: string): Stats

// Registrar provider no Monaco
registerFormattingProvider(monaco: Monaco, languageId?: string): void
```

---

## 2. Linter (Validação Estrutural)

### Localização
- `src/core/linter/linter.ts` - Lógica principal de linting
- `src/core/linter/index.ts` - API pública

### Características Principais

O linter vai além da validação sintática, detectando problemas estruturais e semânticos na DSL.

#### 2.1 Regras de Validação

##### Regra 1: Referências Indefinidas
**Código:** `PT-LINT-1001`, `PT-LINT-1002`
**Severidade:** Error

Detecta:
- Componentes usados mas não definidos (`$UndefinedComponent`)
- Destinos de navegação que não existem

Exemplo:
```
screen Home:
  container:
    $UndefinedComponent  // ❌ Error: Component "UndefinedComponent" is not defined
    @primary[Go](NonExistent)  // ❌ Error: Navigation target "NonExistent" does not exist
```

##### Regra 2: Definições Não Utilizadas
**Código:** `PT-LINT-2001`, `PT-LINT-2002`
**Severidade:** Warning

Detecta:
- Screens/modals/drawers definidos mas nunca referenciados
- Componentes definidos mas nunca instantiados

Exemplo:
```
component UnusedComponent:  // ⚠️ Warning: Never instantiated
  > Content

screen UnusedScreen:  // ⚠️ Warning: Never navigated to
  container:
    # Content
```

**Exceções:**
- O primeiro screen é sempre considerado usado (entry point)

##### Regra 3: Definições Duplicadas
**Código:** `PT-LINT-3001`, `PT-LINT-3002`
**Severidade:** Error

Detecta:
- Múltiplos screens/modals/drawers com mesmo nome
- Múltiplos componentes com mesmo nome

Exemplo:
```
screen Home:
  # First definition

screen Home:  // ❌ Error: Duplicate screen definition
  # Second definition
```

##### Regra 4: Navegação Inválida
**Código:** `PT-LINT-4xxx` (futuro)
**Severidade:** Warning/Info

Detecta (planejado para versões futuras):
- Loops de navegação (A → B → A)
- Dead ends (views sem caminho de volta)
- Views unreachable (inalcançáveis)

#### 2.2 Destinos Especiais

O linter reconhece destinos especiais que não são validados:
- `-1` ou `(-1)`: Navegar de volta
- URLs externas: `http://`, `https://`
- Âncoras: `#section`

#### 2.3 Integração com ErrorBus

O linter se integra perfeitamente ao sistema existente de erros:

```typescript
// Fluxo de integração (parse-and-build-ast.ts)
1. Lexer tokeniza → coleta erros
2. Parser cria CST → coleta erros
3. Builder cria AST → coleta erros
4. Linter valida AST → adiciona warnings/errors
5. Todos os erros vão para ErrorBus
6. Monaco exibe markers no editor
```

#### 2.4 Coleta de Contexto

O linter percorre toda a AST coletando:

**Definições:**
- Views (screens, modals, drawers) com nome e tipo
- Components com nome e props utilizadas

**Referências:**
- Instâncias de componentes (`$ComponentName`)
- Destinos de navegação (buttons, links, navigator, FAB)

**Validações Cross-Reference:**
- Verifica se todas as referências têm definições correspondentes
- Identifica definições não utilizadas
- Detecta duplicações

#### 2.5 API Pública

```typescript
// Executar linting
lintDocument(ast: AstNode[]): LintResult

// Utilitários
getAllDiagnostics(result: LintResult): ProtoError[]
hasErrors(result: LintResult): boolean
hasWarnings(result: LintResult): boolean
getLintSummary(result: LintResult): string

// Tipos
interface LintResult {
  errors: ProtoError[];
  warnings: ProtoError[];
  info: ProtoError[];
}
```

---

## 3. Fluxo de Execução

### 3.1 Fluxo Completo de Parsing com Formatter e Linter

```
Usuario digita código
        ↓
Monaco Editor
        ↓
┌───────────────────────┐
│  parseAndBuildAst()   │
└───────────────────────┘
        ↓
┌───────────────────────┐
│  1. Lexer (tokenize)  │
│     - Tokenização     │
│     - Erros lexer     │
└───────────────────────┘
        ↓
┌───────────────────────┐
│  2. Parser (CST)      │
│     - Parse grammar   │
│     - Erros parser    │
└───────────────────────┘
        ↓
┌───────────────────────┐
│  3. Builder (AST)     │
│     - Constrói AST    │
│     - Erros builder   │
└───────────────────────┘
        ↓
┌───────────────────────┐
│  4. ID Generator      │
│     - IDs únicos      │
└───────────────────────┘
        ↓
┌───────────────────────┐
│  5. Linter            │← NOVO
│     - Valida estrutura│
│     - Warnings/Errors │
└───────────────────────┘
        ↓
┌───────────────────────┐
│  ErrorBus.bulk()      │
│  - Coleta todos erros │
└───────────────────────┘
        ↓
┌───────────────────────┐
│  Monaco Markers       │
│  - Exibe no editor    │
└───────────────────────┘
```

### 3.2 Fluxo de Formatação

```
Usuario pressiona Shift+Alt+F
        ↓
Monaco Editor
        ↓
DocumentFormattingEditProvider
        ↓
formatDocument(code)
        ↓
┌───────────────────────┐
│  1. Split em linhas   │
└───────────────────────┘
        ↓
┌───────────────────────┐
│  2. Analisa estrutura │
│     - Detecta blocos  │
│     - Rastreia indent │
└───────────────────────┘
        ↓
┌───────────────────────┐
│  3. Aplica regras     │
│     - Indentação 2sp  │
│     - Remove trailing │
│     - Normaliza vazias│
└───────────────────────┘
        ↓
┌───────────────────────┐
│  4. Retorna TextEdit  │
└───────────────────────┘
        ↓
Monaco aplica edição
```

---

## 4. Testes e Validação

### 4.1 Arquivo de Testes
`test-formatter-linter.ts` contém casos de teste que validam:

**Formatter:**
- ✅ Normalização de indentação
- ✅ Idempotência
- ✅ Remoção de trailing whitespace
- ✅ Preservação de conteúdo

**Linter:**
- ✅ Detecção de componentes não definidos
- ✅ Detecção de componentes não usados
- ✅ Detecção de navegação inválida
- ✅ Integração com ErrorBus

### 4.2 Executar Testes

```bash
npx tsx test-formatter-linter.ts
```

Resultado esperado: **5/5 testes passando**

---

## 5. Decisões de Design

### 5.1 Por que Formatar Todo o Documento?

**Decisão:** O range formatter formata o documento inteiro, não apenas a seleção.

**Razionale:**
- Garante consistência em todo o arquivo
- Evita indentação quebrada em blocos parciais
- Simplifica implementação
- Idempotência é mais fácil de garantir

**Alternativa considerada:** Formatar apenas linhas selecionadas
**Problema:** Pode quebrar contexto de indentação

### 5.2 Por que Linter Roda Após Builder?

**Decisão:** Linter executa após AST ser construída com IDs.

**Razionale:**
- Precisa de AST completa para análise estrutural
- Erros de sintaxe já foram capturados (lexer/parser)
- Pode focar em validações semânticas
- Evita rodar em código quebrado

**Proteção:** Só roda se não há erros fatais

### 5.3 Por que Usar ErrorBus?

**Decisão:** Reutilizar ErrorBus existente para linter.

**Razionale:**
- Sistema já testado e integrado
- Monaco já consome erros do ErrorBus
- Dedupe automático
- Suporta severidades (error, warning, info)
- Consistente com arquitetura existente

**Alternativa considerada:** Sistema separado de warnings
**Problema:** Duplicação de código e lógica

### 5.4 Formatter: 2 Espaços vs 4 Espaços

**Decisão:** 2 espaços por nível de indentação.

**Razionale:**
- Padrão comum em DSLs modernas
- Economiza espaço horizontal
- Facilita leitura em níveis profundos
- Consistente com exemplos existentes

### 5.5 Linter: Entry Point Screen

**Decisão:** O primeiro screen nunca gera warning de "unused".

**Razionale:**
- É o ponto de entrada da aplicação
- Sempre será usado como tela inicial
- Evita falsos positivos

---

## 6. Possíveis Melhorias Futuras

### 6.1 Formatter
- [ ] Alinhar propriedades em listas (pipes `|`)
- [ ] Preservar comentários inline
- [ ] Configuração de indent size
- [ ] Format-on-save configurable

### 6.2 Linter
- [ ] Validar props de componentes (props usadas vs fornecidas)
- [ ] Detectar loops de navegação
- [ ] Detectar dead ends (sem volta)
- [ ] Validar ícones existentes
- [ ] Sugerir quick fixes (ações de correção)
- [ ] Validar URLs externas
- [ ] Análise de acessibilidade (a11y)

### 6.3 Integração
- [ ] Code actions (quick fixes) no Monaco
- [ ] Hover tooltips com documentação
- [ ] Rename refactoring (renomear screen/component)
- [ ] Go to definition (Ctrl+Click)
- [ ] Find all references

---

## 7. Troubleshooting

### Problema: Formatter não está formatando
**Solução:** Verifique se `formatOnType` e `formatOnPaste` estão habilitados nas opções do editor.

### Problema: Linter não detecta erros
**Solução:** Verifique se há erros de sintaxe primeiro. Linter só roda com AST válida.

### Problema: Warnings não aparecem no editor
**Solução:** Verifique se ErrorBus.subscribe() está sendo chamado no hook do Monaco.

### Problema: Formatting está lento
**Solução:** Formatter é executado síncronamente. Para arquivos grandes, considere adicionar debounce no on-type formatter.

---

## 8. Códigos de Erro

| Código | Categoria | Severidade | Descrição |
|--------|-----------|------------|-----------|
| PT-LINT-1001 | Referência | Error | Component não definido |
| PT-LINT-1002 | Referência | Error | Destino de navegação não existe |
| PT-LINT-2001 | Definição | Warning | View não utilizado |
| PT-LINT-2002 | Definição | Warning | Component não utilizado |
| PT-LINT-3001 | Duplicação | Error | View duplicado |
| PT-LINT-3002 | Duplicação | Error | Component duplicado |

---

## 9. Referências

### Arquivos Relacionados
- `src/core/formatter/` - Módulo de formatação
- `src/core/linter/` - Módulo de linting
- `src/core/parser/parse-and-build-ast.ts` - Integração com parsing
- `src/core/editor/index.ts` - Registro no Monaco
- `src/core/error-bus.ts` - Sistema de erros

### Padrões Seguidos
- LSP (Language Server Protocol) - Para formatação e diagnósticos
- Visitor Pattern - Para travessia de AST
- Pub/Sub Pattern - Para ErrorBus
- Singleton Pattern - Para ErrorBus

---

## 10. Conclusão

O sistema de formatter e linter adiciona duas funcionalidades essenciais ao Proto-Typed:

1. **Formatter**: Garante código consistente e bem formatado automaticamente
2. **Linter**: Detecta problemas estruturais antes da renderização

Ambos se integram perfeitamente com a arquitetura existente, reutilizando ErrorBus e Monaco, sem quebrar a API pública. O sistema é extensível, permitindo adição de novas regras de formatação e linting no futuro.
