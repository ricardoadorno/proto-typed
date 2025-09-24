# Route Manager Refactoring - Sistema de Rotas Unificado

## Resumo da Refatoração

Esta refatoração criou um sistema unificado de gerenciamento de rotas que centraliza a lógica de processamento de screens, modals e drawers, eliminando código duplicado e providenciando uma arquitetura mais limpa e extensível.

## Arquitetura

### Core Components

#### 1. RouteManager (`src/core/renderer/route-manager/route-manager.ts`)
- **Classe central** que processa AST nodes e organiza todas as rotas
- **Responsabilidades:**
  - Processar nodes e categorizá-los em screens e elementos globais
  - Manter coleção unificada de rotas com metadata
  - Prover interface para acessar rotas por tipo/nome
  - Criar contexto de renderização para adapters

#### 2. Tipos (`src/core/renderer/route-manager/types.ts`)
- **ScreenRoute**: Representa telas completas com índice e configuração padrão
- **GlobalRoute**: Representa modals/drawers com estado de visibilidade
- **RouteCollection**: Coleção indexada de todas as rotas
- **RouteRenderContext**: Contexto compartilhado para renderização

### Adapters Pattern

#### PreviewAdapter (`src/core/renderer/route-manager/adapters/preview-adapter.ts`)
- **Responsabilidade**: Renderização para preview in-app
- **Características:**
  - Container div com estilos body-like
  - Registro de componentes
  - Renderização de screens e elementos globais
  - Script de navegação integrado

#### DocumentAdapter (`src/core/renderer/route-manager/adapters/document-adapter.ts`)
- **Responsabilidade**: Geração de documento HTML completo
- **Características:**
  - Documento HTML completo com head/body
  - Scripts externos (Tailwind, Lucide)
  - Múltiplas screens com visibilidade controlada
  - Template de documento otimizado

## Benefícios Alcançados

### 1. Eliminação de Duplicação
- **Antes**: Lógica duplicada em `astToHtmlString` e `astToHtmlDocument`
- **Depois**: Lógica centralizada no RouteManager com adapters especializados

### 2. Separação de Responsabilidades
- **RouteManager**: Apenas processamento e organização de rotas
- **Adapters**: Lógica específica de renderização
- **Navigation Service**: Permanece independente

### 3. Extensibilidade
- Novos tipos de renderização podem ser facilmente adicionados com novos adapters
- RouteManager pode ser estendido para novos tipos de rotas
- Interface consistente para todos os adapters

### 4. Manutenibilidade
- Código mais limpo e focado
- Testes mais fáceis (cada componente tem responsabilidade específica)
- Mudanças isoladas (modificar preview não afeta document)

## Interface Refatorada

### Antes
```typescript
// Lógica duplicada
function astToHtmlString(ast, options) {
  const nodes = Array.isArray(ast) ? ast : [ast];
  const { screens, components, modals, drawers } = processGlobalNodes(nodes);
  setComponentDefinitions(components);
  // ... lógica específica preview
}

function astToHtmlDocument(ast) {
  const nodes = Array.isArray(ast) ? ast : [ast];
  const { screens, components, modals, drawers } = processGlobalNodes(nodes);
  setComponentDefinitions(components);
  // ... lógica específica document
}
```

### Depois
```typescript
// Lógica unificada através de adapters
function astToHtmlString(ast, options) {
  const previewAdapter = new PreviewAdapter(routeManager);
  return previewAdapter.render(ast, options);
}

function astToHtmlDocument(ast) {
  const documentAdapter = new DocumentAdapter(routeManager);
  return documentAdapter.render(ast);
}
```

## Próximos Passos

1. **Navigation Service Integration**: Integrar o navigation-service para usar RouteCollection
2. **Testing**: Adicionar testes unitários para RouteManager e adapters
3. **Performance**: Otimizar caching de rotas processadas
4. **Features**: Adicionar suporte a nested routes ou route guards

## Estrutura de Arquivos

```
src/core/renderer/route-manager/
├── index.ts                    # Exports principais
├── types.ts                    # Interfaces TypeScript
├── route-manager.ts            # Classe central
└── adapters/
    ├── preview-adapter.ts      # Adapter para preview in-app
    └── document-adapter.ts     # Adapter para documento HTML
```

Esta refatoração mantém a funcionalidade existente enquanto estabelece uma base sólida para futuras extensões e melhorias no sistema de navegação.