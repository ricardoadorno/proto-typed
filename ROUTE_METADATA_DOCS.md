# Route Metadata Implementation

## Visão Geral

A implementação de metadados no Route Manager agora permite mapear screens, componentes, modais e drawers em um objeto unificado que facilita a compreensão do contexto pelo cliente.

## Funcionalidades

### RouteMetadata Interface

```typescript
interface RouteMetadata {
  screens: RouteInfo[];
  components: RouteInfo[];
  modals: RouteInfo[];
  drawers: RouteInfo[];
  defaultScreen?: string;
  currentScreen?: string;
  totalRoutes: number;
}
```

### RouteInfo Interface

```typescript
interface RouteInfo {
  id: string;
  name: string;
  type: 'screen' | 'modal' | 'drawer' | 'component';
  isActive?: boolean;
  isDefault?: boolean;
  index?: number;
}
```

## Como Usar

### 1. Obtendo Metadata Durante o Rendering

```typescript
import { astToHtmlString } from './core/renderer/ast-to-html-string';

const options: RenderOptions = {
  currentScreen: 'Profile',
};

const html = astToHtmlString(ast, options);

// Os metadados estão automaticamente incluídos em options.routeMetadata
console.log(options.routeMetadata);
```

### 2. Obtendo Metadata Sem Renderizar

```typescript
import { getRouteMetadata } from './core/renderer/ast-to-html-string';

const metadata = getRouteMetadata(ast, 'Profile');

console.log('Screens disponíveis:', metadata.screens);
console.log('Componentes:', metadata.components);
console.log('Modais:', metadata.modals);
console.log('Drawers:', metadata.drawers);
```

### 3. Usando os Metadados no Cliente

```typescript
// RenderOptions agora inclui contexto completo
interface RenderOptions {
  currentScreen?: string | null;
  routeMetadata?: RouteMetadata;
  availableRoutes?: {
    screens: string[];
    modals: string[];
    drawers: string[];
    components: string[];
  };
}
```

## Exemplo Prático

### DSL Input:
```dsl
screen Home:
  # Página Principal
  @[Abrir Config](SettingsModal)
  $UserCard

component UserCard:
  card:
    # Informações do Usuário
    > João da Silva

modal SettingsModal:
  # Configurações
  > Opções da aplicação
```

### Metadata Output:
```json
{
  "screens": [
    {
      "id": "home",
      "name": "Home",
      "type": "screen",
      "isActive": true,
      "isDefault": true,
      "index": 0
    }
  ],
  "components": [
    {
      "id": "usercard",
      "name": "UserCard",
      "type": "component",
      "isActive": false
    }
  ],
  "modals": [
    {
      "id": "settingsmodal",
      "name": "SettingsModal",
      "type": "modal",
      "isActive": false
    }
  ],
  "drawers": [],
  "defaultScreen": "home",
  "currentScreen": "home",
  "totalRoutes": 3
}
```

## Benefícios

1. **Contexto Unificado**: Todos os tipos de rotas (screens, modais, drawers, componentes) em uma estrutura consistente
2. **Navegação Informada**: Cliente sabe quais rotas estão disponíveis para navegação
3. **Estado da Aplicação**: Informação sobre qual tela está ativa e quais elementos estão visíveis
4. **Flexibilidade**: Pode obter metadados com ou sem renderização
5. **Performance**: Metadados são gerados uma vez durante o processamento das rotas

## Casos de Uso

- **Navegação Dinâmica**: Criar menus baseados nas screens disponíveis
- **Validação de Rotas**: Verificar se uma rota de destino existe antes de navegar
- **UI Condicional**: Mostrar/esconder elementos baseado no contexto atual
- **Debug/Analytics**: Rastrear navegação e uso de componentes
- **Auto-complete**: Sugerir rotas válidas em editores ou formulários

## Integração com Pipeline Existente

A implementação é totalmente compatível com o pipeline existente:
- `RouteManager` agora expõe `getMetadata()`
- `RenderOptions` foi estendido com informações de contexto
- `astToHtmlString` automaticamente injeta metadados
- Adaptadores existentes continuam funcionando sem modificações

Esta implementação fornece uma base sólida para funcionalidades avançadas de navegação e gerenciamento de estado na aplicação.