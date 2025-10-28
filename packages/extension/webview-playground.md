# Integração do Playground React na Webview da Extensão

## 1. Objetivo
- Reutilizar a experiência do playground web (`packages/web/src/app/[lang]/playground-client.tsx:1`) dentro da extensão VS Code, garantindo renderização em tempo real do DSL via `@proto-typed/core`.
- Padronizar o fluxo de build do bundle React que abastece o webview e sincronizar os estados de edição, navegação e metadados com o host da extensão (`packages/extension/src/extension.ts:1`).

## 2. Componentes Reutilizáveis
- **Playground React** – `packages/web/src/app/[lang]/playground-client.tsx:1`: contém a tela principal, seleção de exemplos, exportação e o preview responsivo.
- **Hook de parsing** – `packages/web/src/hooks/use-parse.ts:1`: encapsula todo o ciclo `parseAndBuildAst` → `astToHtmlStringPreview`, gerencia metadados de rotas e eventos de navegação.
- **Core DSL** – `packages/core`: fornece `parseAndBuildAst`, `astToHtmlDocument`, `astToHtmlStringPreview`, `RouteManagerGateway` e `ErrorBus`.
- **Extensão atual** – `packages/extension/src/extension.ts:1`: já cria um `WebviewPanel` e atualiza HTML bruto; será ajustada para carregar o bundle React e trocar mensagens com o webview.

## 3. Arquitetura Proposta
- O bundle React roda dentro do webview e executa o hook `useParse`, mantendo a paridade de UX com o playground web.
- O host da extensão envia o conteúdo do editor para o webview via `postMessage`, acionando `handleParse` no React.
- Eventos disparados no webview (ex.: `navigateToScreen`, seleção de exemplo, exportação) retornam ao host conforme necessário. A navegação pode permanecer dentro do webview porque o `RouteManagerGateway` já está encapsulado pelo hook.
- O build do webview gera `index.html` + assets estáticos. A extensão converte caminhos para `webview.asWebviewUri` e injeta no painel.

## 4. Pipeline de Build do Webview
- Criar uma entry React dedicada (ex.: `packages/extension/webview/src/main.tsx`) que importe `PlaygroundPage` (ou uma versão refatorada para pacote compartilhado, ver seção 6).
- Adicionar ferramentas de bundling simples (Vite ou esbuild) para gerar saída em `packages/extension/webview/dist`. Esse output deve conter:
  - `index.html` com `root` e scripts já empacotados.
  - Assets (JS/CSS) sem dependências externas não permitidas pelo CSP (se precisar de CDN, incluir via script interno com nonce).
- Incluir script `pnpm -F @proto-typed/extension run build:webview` que compile o bundle antes do `pnpm run compile`. Atualizar `vscode:prepublish` para encadear `build:webview`.

## 5. Comunicação Host ↔ Webview
### 5.1 Host (extensão)
- Dentro do comando `proto-typed.showPreview`, depois de criar o painel, carregar `index.html` do bundle.
- Registrar `panel.webview.onDidReceiveMessage` para tratar ações vindas do React (ex.: solicitar exportação via API do host).
- Substituir a lógica atual de `updateWebview()` por envio de mensagem:
  ```ts
  function sendDocumentToWebview(panel: vscode.WebviewPanel, document: vscode.TextDocument) {
    panel.webview.postMessage({
      type: 'DSL_UPDATE',
      payload: document.getText(),
      uri: document.uri.toString(),
    })
  }
  ```
- Reaproveitar debounce de `onDidChangeTextDocument` para evitar flood.

### 5.2 Webview (React)
- No `main.tsx`, inicializar o app com um provider que exponha `onMessage` do VS Code:
  ```ts
  const vscode = acquireVsCodeApi()
  window.addEventListener('message', (event) => {
    if (event.data?.type === 'DSL_UPDATE') {
      playgroundStore.setDsl(event.data.payload)
    }
  })
  ```
- Adaptar `PlaygroundPage` para buscar o texto do DSL a partir do estado global (contexto ou Zustand) em vez de armazenar localmente apenas os exemplos. O `useEffect` que hoje chama `handleParse(input)` pode ser disparado sempre que `dsl` mudar.
- Para navegação ou outras ações que precisem informar o host (ex.: abrir documentação externa via `vscode.open`), usar `vscode.postMessage({ type: 'OPEN_DOCS', lang })`.

## 6. Reaproveitamento de Código Sem Novos Módulos
- Manter todo o código do webview dentro do pacote `packages/extension`, reaproveitando apenas os utilitários que já existem no monorepo.
- O hook `useParse` pode ser importado diretamente do workspace atual; caso precise de ajustes (ex.: remover dependência de Next), faça-os dentro da própria pasta da extensão criando uma variante local que use somente `@proto-typed/core`.
- Componentes que dependem de APIs específicas do Next (como `next/link`) devem receber wrappers simples dentro da extensão para que a lógica de UI continue funcional sem introduzir novos pacotes.
- Evitar adicionar bibliotecas de estado externas; priorizar React state ou utilitários já existentes. Mantemos a dependência exclusiva em `@proto-typed/core` além das bibliotecas já disponíveis no módulo da extensão.

## 7. CSP e Recursos Estáticos
- O webview restringe fontes externas. Prefira embutir CSS/JS no bundle ou hospedar em `media/` dentro da extensão e acessar via `webview.asWebviewUri`.
- Caso seja necessário usar Tailwind CDN ou Lucide CDN, configurar `Content-Security-Policy` com `nonce` e gerar as tags dinamicamente no host ao montar o HTML base (ver `packages/extension/src/extension.ts:48` para o exemplo atual).

## 8. Atualização em Tempo Real
- O React continua responsável por `handleParse`, garantindo feedback imediato e metadados ricos (`metadata`, `error`, `currentScreen`). Isso reproduz exatamente o comportamento observado no playground web.
- O host apenas garante sincronização com o editor ativo e pode armazenar `lastRenderedHtml` para permitir restauração instantânea ao reabrir a aba (similar a `lastRenderedHtml` existente hoje).
- Para documentos grandes, considerar throttling adicional ou envio incremental (opcional).

## 9. Rotina Recomendada de Desenvolvimento
- `pnpm -F @web/app dev` continua servindo de ambiente de referência visual sem impactar a extensão.
- `pnpm -F @proto-typed/extension run dev:webview` (script local) executa o bundler em modo watch dentro do próprio pacote da extensão.
- `pnpm -F @proto-typed/extension run compile` deve incluir:
  1. Build do bundle webview.
  2. Compilação TypeScript da extensão.
- Adicionar testes e2e no mesmo pacote (`packages/extension/src/test`) para garantir que o painel carrega o React e responde a mensagens.

## 10. Pontos de Atenção
- Conferir tamanho final do bundle para não degradar tempo de carregamento do painel.
- Manter compatibilidade com `workspace:*` do `@proto-typed/core` (evitar múltiplas cópias da lib no bundle).
- Revisar temas e CSS custom properties; se usar `customPropertiesManager` no webview, inicializar o tema antes do primeiro parse para garantir consistência visual.
- Validar que o webview continua funcional em ambientes offline (sem CDN) e respeita o CSP imposto pelo VS Code.
