# Arquitetura Desacoplada com Webview Realtime

> Referências consultadas: documentação oficial do VS Code sobre [Webviews](https://code.visualstudio.com/api/extension-guides/webview), seção de [mensageria](https://code.visualstudio.com/api/extension-guides/webview#passing-messages-between-the-webview-and-extension), guia de [testes de extensões](https://code.visualstudio.com/api/working-with-extensions/testing-extension), exemplo oficial [`webview-sample`](https://github.com/microsoft/vscode-extension-samples/tree/main/webview-sample), artigos do VS Code Blog sobre retenção de contexto/performance e discussões recorrentes em fóruns (StackOverflow, GitHub Issues) sobre `vscode.postMessage`, `acquireVsCodeApi` e testes e2e de extensões.

## 1. Objetivos de Arquitetura
- Garantir atualização em tempo real: qualquer alteração no editor deve refletir imediatamente no webview, com latência controlada por debounce.
- Desacoplar responsabilidades: host VS Code responsável por I/O, persistência e debounce; webview focado em estado de UI e interpretação do DSL.
- Fornecer um contrato de mensagens resiliente e versionado, evitando dependências implícitas entre host e webview.
- Possibilitar testes de integração automatizados que validem o fluxo fim a fim (editor → host → webview → host).
- Manter toda a implementação confinada ao pacote da extensão, reutilizando somente `@proto-typed/core` e dependências já disponíveis.

## 2. Visão em Camadas
```
┌───────────────┐
│   VS Code UI  │ (Editor, Painéis, Command Palette)
└──────┬────────┘
       │ onDidChangeTextDocument, commands.registerCommand
┌──────▼────────┐
│  Host Layer   │ (extension.ts + playground-panel)
│ - Debounce / buffering
│ - Persistência (setState, workspaceStorage)
│ - Resolução de assets via webview.asWebviewUri
└──────┬────────┘ postMessage()
       │
┌──────▼────────┐
│ Messaging Bus │ (message-router tipado, versionado, validado)
└──────┬────────┘ window.postMessage
       │
┌──────▼────────┐
│ Webview Layer │ (React + hooks)
│ - Estado DSL / AST
│ - Renderização HTML
│ - Interações UI
└──────┬────────┘
       │ postMessage()
┌──────▼────────┐
│ Core Services │ (@proto-typed/core, editor embutido, gerenciador de tema)
└───────────────┘
```

## 3. Contrato de Mensagens
- **Envelope comum** (contrato compartilhado entre host e webview):
  ```ts
  export const MESSAGE_VERSION = 1 as const

  export interface MessageEnvelope<Type extends string, Payload> {
    type: Type
    version: typeof MESSAGE_VERSION
    timestamp: number
    payload: Payload
    requestId?: string // permite correlacionar respostas (ACK/erros)
  }
  ```
- **Eventos Host → Webview**:
  - `DSL_UPDATE`: payload `{ text: string; uri: string; languageId: string }`
  - `STATE_RESTORE`: payload `{ dsl: string; screen: string | null }`
  - `THEME_SYNC`: payload `{ themeId: string }`
- **Eventos Webview → Host**:
  - `REQUEST_EXPORT`: payload `{ html: string; suggestedFileName: string }`
  - `REQUEST_SET_TEXT`: payload `{ text: string; reason: 'example-select' | 'restore' }`
  - `LOG_EVENT`: payload `{ level: 'info' | 'warn' | 'error'; message: string }`
  - `NAVIGATION_UPDATE`: payload `{ screen: string }`
- **Eventos de handshake**:
  - `HANDSHAKE_INIT`: enviado pelo host logo após carregar o HTML (payload `{ sessionId: string }`).
  - `HANDSHAKE_ACK`: enviado pelo webview para confirmar (payload `{ sessionId: string; capabilities: string[] }`). A partir do ACK o host começa a transmitir `DSL_UPDATE`.
- Mensagens são roteadas por um módulo dedicado (`message-router.ts`) que valida `version`, converte `timestamp` para `Date`, publica logs padronizados e utiliza validação manual simples (sem bibliotecas adicionais) para garantir formato consistente. Conforme docs oficiais, `console.log` no host facilita depuração via Developer Tools.

## 4. Fluxo Realtime
1. **Captura de texto** (`vscode.workspace.onDidChangeTextDocument`): host identifica alterações no documento alvo, aplica debounce de 200–300 ms (recomendação recorrente em exemplos oficiais e fóruns para equilibrar responsividade e evitar saturar o canal). O serviço ignora eventos que chegam do próprio `REQUEST_SET_TEXT` para evitar loops.
2. **Envio ao webview**: host chama `panel.webview.postMessage(MessageEnvelope<DSLUpdate>)`. O Webview mantém apenas uma fila de mensagem pendente; mensagens mais antigas são descartadas se uma nova chega antes do processamento (`last-write-wins`). Recomendado nas threads do VS Code GitHub para evitar acumular backlog quando o usuário digita rapidamente.
3. **Processamento no webview**: `window.addEventListener('message', handler)` (padrão documentado) injeta a nova string no hook `usePlaygroundState`, que chama `handleParse`. O parse roda em `requestIdleCallback` (fallback `setTimeout`) para não bloquear UI. O handler valida o `requestId` e devolve `ACK`/`NACK` (`LOG_EVENT` com `level: 'error'`) em caso de falha.
4. **Resposta ao host (opcional)**: quando o usuário seleciona um exemplo ou navega para outra tela, o webview envia `REQUEST_SET_TEXT` ou `NAVIGATION_UPDATE`. O host decide aplicar a mudança no editor usando `TextEditor.edit` (docs: `vscode.TextEditor`). A resposta positiva retorna como `HANDSHAKE_ACK`/`ACK`, mantendo rastreabilidade.
5. **Persistência**: host usa `panel.webview.postMessage(STATE_RESTORE)` quando painel reabre, e `webview` chama `vscode.setState` (API oficial) após cada atualização para manter cópia local em caso de recarregamento.

## 5. Modularização Recomendada
- **Host**:
- `playground-panel` encapsula `WebviewPanel`, gerando HTML com CSP via `webview.asWebviewUri` e cuidando de nonce (docs oficiais reforçam a necessidade). Implementa `Disposable`.
- `text-document-synchronizer` observa o editor ativo, aplica debounce e expõe eventos `onExternalChange`, `onInternalApply` para evitar loops.
- `command-registry` registra `proto-typed.showPreview` e injeta dependências (`text-document-synchronizer`, `playground-panel`, `message-router`) como parâmetros, simplificando testes unitários e integração (pode residir no mesmo arquivo enquanto mantiver funções separadas).
- `message-router` expõe `registerHandler`/`send`. Ele também emite eventos de telemetria agregada (ex.: quantidade de mensagens por sessão) útil para diagnósticos.
- **Webview**:
  - `VscodeBridgeProvider` expõe `sendMessage`, `onMessage`, `setPersistentState`, encapsulando `acquireVsCodeApi` e evitando múltiplas instâncias conforme recomendação da doc.
- `dsl-store` (implementado com Context API e hooks de React) centraliza DSL, AST, metadata, erros e sinaliza origem da mudança (`editor` vs `webview`) para controle do sincronizador, evitando novas dependências.
  - UI modularizada com componentes de apresentação (`EditorTransport`, `PreviewSurface`, `Toolbar`, `ScreenNavigator`, `ErrorPanel`), cada um consumindo apenas a parte relevante do estado.

## 6. Estratégia de Testes de Integração
### 6.1 Framework
- Utilizar o runner oficial `@vscode/test-electron` (docs: testing guide). Ele permite subir uma instância do VS Code e executar testes Mocha dentro do host real.
- Combinar com Playwright para validar DOM do webview se desejado (porém requer exposição da URL do webview; alternativa é instrumentar mensagens).

### 6.2 Cenários Essenciais
1. **Fluxo básico**:
   - Abrir arquivo `.pty` com conteúdo conhecido.
   - Disparar comando `proto-typed.showPreview`.
   - Aguardar `HANDSHAKE_ACK` do webview e depois `DSL_UPDATE` emitido pelo host.
   - Simular digitação via `TextEditor.edit` e validar que o webview retornou `ACK` e atualizou metadados (`NAVIGATION_UPDATE` após `handleParse`).
2. **Seleção de exemplo → editor**:
   - Simular mensagem `REQUEST_SET_TEXT` enviada pelo webview.
   - Verificar que o host aplica alteração no editor e retorna `ACK` seguido de novo `DSL_UPDATE` (garante round trip completo).
3. **Exportação**:
   - Webview envia `REQUEST_EXPORT` com HTML.
   - Host grava arquivo em diretório temporário via `vscode.workspace.fs.writeFile`.
   - Teste valida existência do arquivo e se recebeu confirmação (`ACK` com `requestId` original).
4. **Persistência**:
   - Simular fechamento e reabertura do painel (`playground-panel.dispose()` e instanciar novamente).
   - Validar que `STATE_RESTORE` é emitido, `HANDSHAKE_ACK` recebido e que o estado (DSL, tela ativa) foi restaurado através de `vscode.setState`.

### 6.3 Instrumentação de Testes
- `playground-panel` aceita dependências via construtor (injeção explícita do `message-router` e `text-document-synchronizer`), permitindo substituir por doubles nos testes sem `proxyquire`.
- Utilizar `vscode.env.uiKind === vscode.UIKind.Web` como filtro para pular testes quando rodando em ambientes não suportados (orientação presente no guia oficial).
- Registrar listeners de teste com `panel.webview.onDidReceiveMessage` e armazenar mensagens em fila para asserções; evitar `showInformationMessage` nos testes, usando `console.log` (capturado pelo runner).
- Fornecer utilitário `awaitMessage(type)` que resolve quando mensagem esperada chegar, evitando sleeps arbitrários.

### 6.4 Mocks e Smoke Tests
- Mockar `@proto-typed/core` para simular parse rápido nos testes de integração (reduz tempo). Para smoke tests em CI noturno, executar parse real usando fixtures.
- Criar smoke test separado que abre o webview real e inspeciona DOM via `webviewView.webview.postMessage({ type: 'INTERNAL_DEBUG_SNAPSHOT' })`, retornando HTML para validações simples sem precisar de Playwright.

## 7. Boas Práticas Complementares
- **Retenção**: usar `retainContextWhenHidden: true` apenas quando realmente necessário; docs alertam que consome memória extra. Em ambos os casos, limpe timers/observadores no `dispose`.
- **CSP**: gerar nonce único cada vez que HTML carrega e injetar no `<script>` inline (requisito explícito da doc). Eliminar `unsafe-eval` e usar assets locais. Se precisar de CDN, adicionar domínio explicitamente no CSP e justificar.
- **Performance**: considerar `MessageChannel` ou lote via `requestAnimationFrame` no webview para atualizações de alta frequência. Monitorar tamanho da mensagem e, se necessário, aplicar compressão simples implementada no próprio projeto (sem novas bibliotecas).
- **Erros**: webview captura exceções e envia `LOG_EVENT` com `level: 'error'`/`requestId`; host pode registrar telemetria e mostrar toast apenas para falhas críticas, alinhado às diretrizes de UX do VS Code.
- **Telemetria opcional**: utilizar `vscode.env.machineId` apenas para métricas agregadas, nunca para identificação pessoal (conforme política MS).

## 8. Checklist de Implementação
- [ ] Implementar `message-router` com validação de versão.
- [ ] Extrair `text-document-synchronizer` e integrar com `playground-panel`.
- [ ] Criar `VscodeBridgeProvider` + `DslStore` no webview.
- [ ] Configurar bundler com saída determinística e assets locais para respeitar CSP.
- [ ] Escrever testes e2e descritos acima com `@vscode/test-electron` + fixtures.
- [ ] Adicionar script `pnpm -F @proto-typed/extension test:webview` que execute apenas cenários do painel.
- [ ] Documentar fluxo no README da extensão e manter diagrama atualizado.

---

Essa abordagem segue as recomendações oficiais para webviews e traz as menores dependências possíveis entre host e conteúdo, enquanto fornece uma base sólida para evoluir o playground sem comprometer responsividade ou confiabilidade. Testes de integração garantem que o ciclo editor → preview continue íntegro mesmo após refactors.***
