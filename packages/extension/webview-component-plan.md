# Plano de Implementação – Novo Componente de Playground na Extensão

## 1. Visão Geral
- Criar um novo componente React para o webview da extensão VS Code que replique a experiência do playground web, permitindo edição de código DSL e pré-visualização em tempo real.
- Modularizar tanto o lado do host (extensão) quanto o lado do webview para facilitar evolução futura e reutilização de partes (ex.: barra de ferramentas, painel de preview, hooks de parsing).
- Garantir comunicação bidirecional robusta usando a API `vscode.postMessage` (webview → host) e `webview.postMessage` (host → webview), com contrato de mensagens versionado.

## 2. Estrutura de Pastas Proposta (tudo sob `packages/extension`)
```
packages/
  extension/
    src/
      panels/
        playground/
          playground-panel.ts        // Gerencia criação e mensagens do WebviewPanel
          message-types.ts           // Tipagem compartilhada de mensagens (host)
      messaging/
        message-router.ts            // Observa webviews e roteia mensagens para handlers registrados
      utils/
        asset-loader.ts              // Resolve URIs para assets do webview
    webview/
      src/
        app/
          playground-app.tsx         // Componente raiz do novo playground
          components/
            editor-transport.tsx     // Sincroniza texto do editor via mensagens
            preview-surface.tsx      // Renderiza HTML emitido por @proto-typed/core
            toolbar.tsx              // Botões de exemplo, exportação, seleção de tema
            screen-navigator.tsx     // Lista e navega entre telas detectadas
            error-panel.tsx          // Mostra erros do ErrorBus
          hooks/
            use-playground-state.ts   // Abstrai useParse + estado vindo do host
            use-vscode-messaging.ts   // Encapsula acquireVsCodeApi + listeners
        messaging/
          message-types.ts            // Versão webview dos tipos (espelhados)
        main.tsx                     // Bootstrap React e registro de listeners
      dist/                         // Saída do bundler (ignored no git)
```

## 3. Fluxo de Comunicação
### 3.1 Host → Webview
- Evento `DSL_UPDATE`: enviado após debounce sempre que o documento ativo é alterado.
- Evento `THEME_UPDATE`: sincroniza tema escolhido no VS Code para o preview.
- Evento `FOCUS_EDITOR`: instruções do host para forçar foco no editor, se necessário.

### 3.2 Webview → Host
- Evento `REQUEST_EXAMPLES`: webview pede lista de exemplos (host pode carregar de `exampleConfigs` para manter single source of truth).
- Evento `SET_DSL_CONTENT`: usuário trocou para um exemplo; host atualiza editor (usa `TextEditorEdit`).
- Evento `EXPORT_HTML`: webview solicita que host grave HTML exportado usando APIs de workspace.
- Evento `LOG_EVENT`: para debugging (host decide se loga ou ignora).

### 3.3 Tipagem
- Todos os eventos implementam `type` e `version` (`1` inicialmente) para permitir evolução.
- `packages/extension/src/panels/playground/messageTypes.ts` compartilha discriminated union `PlaygroundMessage` com generics para `payload`.
- Webview importa tipos do host através de build step dentro da própria pasta da extensão (sem novos pacotes). Alternativa: duplicar tipos e manter teste unitário garantindo sincronização.

## 4. Responsabilidades por Módulo
### 4.1 `playground-panel.ts`
- Cria `WebviewPanel`, injeta HTML carregando assets do bundler (`media/playground/index.js/css`).
- Registra listeners `panel.webview.onDidReceiveMessage` e delega para `messageRouter` com contexto (documento, workspace).
- Expõe métodos `sendDslContent(document)`, `dispose()`, `reveal(column)`.
- Mantém estado mínimo (ex.: último texto enviado) para evitar mensagens duplicadas.

### 4.2 `message-router.ts`
- Estrutura estilo pub/sub: `registerHandler(type, handler)`.
- Normaliza mensagens (valida `version`, `type`) antes de chamar handler.
- Reúso futuro para outros painéis (analytics, docs etc.).

### 4.3 `asset-loader.ts`
- Recebe `context.extensionUri` e converte caminhos relativos (`media/playground/index.js`) em URIs seguros via `webview.asWebviewUri`.
- Gera HTML base com CSP, incluindo nonce para scripts inline.

### 4.4 `use-vscode-messaging.ts`
- Obtém `const vscode = acquireVsCodeApi()` apenas uma vez, mantém referência compartilhada.
- Expõe `sendMessage` e registra `window.addEventListener('message', ...)`, roteando para callbacks fornecidos.
- Gerencia `state` persistente via `vscode.setState` para restaurar última sessão quando webview reabre.

### 4.5 `use-playground-state.ts`
- Encapsula lógica de `useParse` + store local do texto (valor inicial vindo do host).
- Quando recebe `DSL_UPDATE`, chama `handleParse` e sincroniza estado (HTML, metadata, erros).
- Ao mudar de tela via `navigateToScreen`, envia eventos ao host se necessário (ex.: log).
- Expõe API consumida por componentes (`dsl`, `setDsl`, `metadata`, `currentScreen`, `errors`, `exportHtml()`).

### 4.6 Componentes React
- `editor-transport`: Renderiza editor (pode usar o wrapper já existente no projeto ou uma instância simples baseada em `textarea`) com conteúdo controlado; envia `SET_DSL_CONTENT` ao host quando usuário escolhe exemplo.
- `preview-surface`: Recebe `renderedHtml`, injeta via `dangerouslySetInnerHTML`, com `createClickHandler` disparando navegação (já fornecida por `useParse`).
- `toolbar`: Contém botões de exemplo, exportação, seleção de tema; usa `use-vscode-messaging` para interagir com host.
- `screen-navigator`: Renderiza lista de telas (`metadata.screens`), atualiza `currentScreen` via `navigateToScreen` do hook.
- `error-panel`: Observa `ErrorBus` (exposto via hook) e exibe mensagens formatadas.

## 5. Sequência de Implementação
1. **Setup do Bundler**: configurar Vite/esbuild para `packages/extension/webview`, apontando entrada `main.tsx` e output `dist`, sem criar novo pacote externo.
2. **Criar infraestrutura host**: mover lógica atual de `extension.ts` para `playground-panel.ts` com novo fluxo de mensagens; manter comando `proto-typed.showPreview` instanciando painel.
3. **Mensagens tipadas**: definir `message-types.ts` (host) e gerar espelho para webview; implementar `message-router.ts` com validação básica.
4. **Hook de messaging (webview)**: implementar `use-vscode-messaging.ts` que utiliza apenas React + API VS Code (sem libs adicionais).
5. **Hook de estado do playground**: adaptar `useParse` para aceitar conteúdo inicial do host e integrar com messaging reaproveitando somente `@proto-typed/core`.
6. **Construir componentes visuais**: montar `PlaygroundApp` usando novos componentes modulares.
7. **Integração host ↔ webview**: enviar `DSL_UPDATE` no comando inicial e a cada modificação, tratar eventos inversos (exportação, seleção de exemplo).
8. **Persistência de estado**: utilizar `vscode.setState/getState` para restaurar DSL e tela corrente quando painel reabre.
9. **Testes**: criar testes de unidade para `messageRouter`, `usePlaygroundState` (mock `parseAndBuildAst`) e testes de integração usando `@vscode/test-electron` para garantir que mensagens fluem corretamente.
10. **Documentação**: atualizar `webview-playground.md` com referência ao novo componente e instruções de build/watch.

## 6. Considerações de Segurança e Performance
- CSP: adicionar nonce para scripts inline; evitar dependências externas não confiáveis. Se usar CDNs, atualizar meta CSP dinamicamente com domínios específicos.
- Debounce: manter debounce de ~300ms no host para evitar floods. No webview, usar `useEffect` leve ou `requestAnimationFrame` para renderizar HTML pesado sem travar UI.
- Tamanho do bundle: monitorar com relatório do bundler e garantir que dependemos apenas de `@proto-typed/core` além de React já disponível.
- Erros: qualquer exceção do `useParse` deve ser capturada e enviada ao host (`LOG_EVENT`), onde pode ser mostrado em `vscode.window.showErrorMessage` opcionais.

## 7. Próximos Passos
- Aprovar plano de estrutura e mensagens.
- Implantar pipeline de build com CI (garantir que `pnpm -F @proto-typed/extension run compile` falhe se bundle não existir).
- Definir padrão de versionamento (`version` nos payloads) para futura compatibilidade.
