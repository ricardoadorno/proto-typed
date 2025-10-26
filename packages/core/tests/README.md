# Testes do @proto-typed/core

Este diretório contém os testes unitários e de integração para o pacote `@proto-typed/core`.

## Estrutura de Testes

### Testes Unitários (`unit/`)

- **lexer.test.ts**: Testes para o tokenizador (Lexer)
  - Tokenização básica de elementos
  - Gerenciamento de indentação (Indent/Outdent)
  - Componentes e sintaxe especial
  - Tratamento de erros

- **parser.test.ts**: Testes para o analisador sintático (Parser)
  - Análise sintática de elementos básicos
  - Estruturas aninhadas
  - Componentes e atributos
  - Recuperação de erros

- **ast-builder.test.ts**: Testes para o construtor de AST
  - Conversão de CST para AST
  - Extração de atributos
  - Estruturas complexas
  - Geração de IDs determinísticos

- **error-bus.test.ts**: Testes para o sistema de pub/sub de erros
  - Singleton pattern
  - Emissão e coleta de erros
  - Deduplicação
  - Sistema de assinatura (subscribe/notify)

- **utils-deterministic-ids.test.ts**: Testes para geração de IDs
  - Geração determinística de IDs
  - Reutilização de IDs
  - Tratamento de duplicatas
  - Validação de IDs

- **renderer.test.ts**: Testes para renderização HTML
  - Renderização de documentos HTML completos
  - Renderização de preview
  - Navegação e atributos
  - Estilos e temas

### Testes de Integração (`integration/`)

- **end-to-end.test.ts**: Testes de fluxo completo
  - Pipeline completo DSL → HTML
  - Aplicações multi-tela
  - Sistema de componentes
  - Navegação entre telas
  - Gerenciamento de temas
  - Cenários do mundo real

## Executando os Testes

### Executar todos os testes

```bash
cd packages/core
pnpm test
```

### Executar testes em modo watch

```bash
pnpm test
```

### Executar testes uma vez

```bash
pnpm test:run
```

### Executar testes com UI interativa

```bash
pnpm test:ui
```

### Executar testes com cobertura

```bash
pnpm test:coverage
```

## Estrutura dos Testes

Cada arquivo de teste segue esta estrutura:

```typescript
import { describe, it, expect, beforeEach } from 'vitest'

describe('Módulo - Descrição', () => {
  beforeEach(() => {
    // Configuração antes de cada teste
  })

  describe('Funcionalidade Específica', () => {
    it('deve fazer algo específico', () => {
      // Arrange - Preparar
      const input = '...'

      // Act - Executar
      const result = funcao(input)

      // Assert - Verificar
      expect(result).toBeDefined()
      expect(result).toHaveProperty('prop')
    })
  })
})
```

## Cobertura de Testes

Os testes cobrem:

### Lexer (Tokenização)

- ✅ Tokenização de elementos básicos
- ✅ Gerenciamento de indentação
- ✅ Tokens especiais (brackets, equals, comma)
- ✅ Tratamento de erros

### Parser (Análise Sintática)

- ✅ Parsing de elementos básicos
- ✅ Estruturas aninhadas
- ✅ Atributos e propriedades
- ✅ Recuperação de erros

### AST Builder

- ✅ Construção de nós AST
- ✅ Extração de propriedades
- ✅ Hierarquia de elementos
- ✅ Componentes

### Error Bus

- ✅ Emissão de erros
- ✅ Coleta de erros
- ✅ Deduplicação
- ✅ Sistema de assinatura

### Utils

- ✅ Geração de IDs determinísticos
- ✅ Reutilização de IDs
- ✅ Validação de AST

### Renderer

- ✅ Renderização de HTML
- ✅ Navegação entre telas
- ✅ Temas e estilos
- ⚠️ Alguns testes precisam de ajuste (dependem da implementação exata)

### Integração

- ✅ Fluxo completo de parsing
- ✅ Renderização end-to-end
- ✅ Aplicações complexas
- ✅ Gerenciamento de rotas

## Observações

### Testes do Renderer

Alguns testes do renderer podem falhar pois dependem da implementação exata do HTML renderizado. Estes testes servem mais como documentação do comportamento esperado. Os testes mais importantes são:

1. Se o HTML é gerado sem erros
2. Se o conteúdo básico está presente
3. Se a estrutura geral está correta

### Testes de Integração

Os testes de integração são os mais importantes pois testam o fluxo completo:

- DSL → Lexer → Parser → AST Builder → Renderer → HTML

### Melhorias Futuras

1. Adicionar mais testes de snapshot para o renderer
2. Adicionar testes de performance
3. Adicionar testes de casos extremos (edge cases)
4. Melhorar cobertura de código
5. Adicionar testes de regressão

## Contribuindo

Ao adicionar novos recursos, certifique-se de:

1. Adicionar testes unitários para a nova funcionalidade
2. Adicionar testes de integração se necessário
3. Manter a cobertura de código acima de 80%
4. Seguir o padrão Arrange-Act-Assert
5. Usar nomes descritivos para os testes
6. Documentar casos especiais ou comportamentos não óbvios

## Comandos Úteis

```bash
# Executar apenas testes do lexer
pnpm test lexer

# Executar apenas testes de integração
pnpm test integration

# Executar com verbose
pnpm test -- --reporter=verbose

# Executar teste específico
pnpm test -- -t "should tokenize button element"
```
