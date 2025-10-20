export interface DocItem {
  slug: string
  title: string
  description?: string
}

export interface DocSection {
  title: string
  items: DocItem[]
}

export const docSections: DocSection[] = [
  {
    title: 'Sintaxe e Fluxo de View',
    items: [
      {
        slug: 'syntax',
        title: 'Sintaxe básica',
        description: 'Como escrever blocos DSL, identar e comentar código de forma correta.',
      },
      {
        slug: 'screen',
        title: 'Telas (Screens)',
        description: 'Define o fluxo de visualização: como criar telas, containers e a hierarquia visual principal.',
      },
      {
        slug: 'flow',
        title: 'Fluxo de navegação',
        description: 'Como as telas se conectam entre si e como o DSL define a experiência de navegação.',
      },
    ],
  },
  {
    title: 'Primitivos de Interface',
    items: [
      {
        slug: 'text',
        title: 'Texto',
        description: 'Renderiza títulos, subtítulos e parágrafos dentro da interface.',
      },
      {
        slug: 'icon',
        title: 'Ícone',
        description: 'Adiciona símbolos visuais ou ícones inline para reforçar significado.',
      },
      {
        slug: 'button',
        title: 'Botão',
        description: 'Cria ações interativas com variantes e comportamentos configuráveis.',
      },
      {
        slug: 'input',
        title: 'Campo de entrada',
        description: 'Captura dados do usuário como texto, senhas e seleções.',
      },
      {
        slug: 'link',
        title: 'Link',
        description: 'Cria vínculos de navegação interna ou externa com semântica acessível.',
      },
    ],
  },
  {
    title: 'Layout e Estrutura',
    items: [
      {
        slug: 'container',
        title: 'Container',
        description: 'Delimita a largura do conteúdo e aplica espaçamento consistente.',
      },
      {
        slug: 'stack',
        title: 'Stack',
        description: 'Empilha elementos verticalmente com espaçamento automático.',
      },
      {
        slug: 'row',
        title: 'Linha (Row)',
        description: 'Organiza elementos horizontalmente e alinha conteúdo lateral.',
      },
      {
        slug: 'grid',
        title: 'Grade (Grid)',
        description: 'Cria layouts responsivos com múltiplas colunas e alinhamentos flexíveis.',
      },
      {
        slug: 'card',
        title: 'Card',
        description: 'Agrupa informações em blocos visuais, com fundo e bordas opcionais.',
      },
      {
        slug: 'list',
        title: 'Lista',
        description: 'Renderiza coleções repetitivas de elementos ou componentes.',
      },
    ],
  },
  {
    title: 'Navegação e Interações',
    items: [
      {
        slug: 'navigator',
        title: 'Navegador',
        description: 'Gerencia rotas, abas e menus de troca de tela.',
      },
      {
        slug: 'modal',
        title: 'Modal',
        description: 'Janela sobreposta usada para ações rápidas e confirmação de eventos.',
      },
      {
        slug: 'drawer',
        title: 'Drawer',
        description: 'Painel lateral persistente usado para contexto adicional.',
      },
      {
        slug: 'fab',
        title: 'Botão Flutuante (FAB)',
        description: 'Ação global e persistente exibida sobre o conteúdo principal.',
      },
    ],
  },
  {
    title: 'Componentes e Reuso',
    items: [
      {
        slug: 'component-definition',
        title: 'Definição de componente',
        description: 'Como declarar componentes reutilizáveis e suas propriedades (%props).',
      },
      {
        slug: 'component-props',
        title: 'Propriedades de componente',
        description: 'Como interpolar valores, criar placeholders e passar parâmetros dinâmicos.',
      },
      {
        slug: 'component-list',
        title: 'Lista de componentes',
        description: 'Renderiza múltiplas instâncias de um mesmo componente com dados variados.',
      },
      {
        slug: 'component-composition',
        title: 'Composição de componentes',
        description: 'Boas práticas para combinar componentes sem redundância.',
      },
    ],
  },
  {
    title: 'Temas e Estilos',
    items: [
      {
        slug: 'styles-block',
        title: 'Bloco de estilos',
        description: 'Define tokens, variáveis e estilos globais aplicáveis ao projeto.',
      },
      {
        slug: 'themes',
        title: 'Temas',
        description: 'Configura e personaliza o tema visual — cores, espaçamentos e tipografia.',
      },
    ],
  },
  {
    title: 'Padrões e Boas Práticas',
    items: [
      {
        slug: 'naming',
        title: 'Nomeação e consistência',
        description: 'Regras para nomear componentes, props e arquivos de forma padronizada.',
      },
      {
        slug: 'composition-guidelines',
        title: 'Diretrizes de composição',
        description: 'Como combinar elementos sem gerar redundância ou conflito visual.',
      },
      {
        slug: 'error-patterns',
        title: 'Erros comuns',
        description: 'Catálogo de anti-padrões (Do/Don’t) com soluções práticas.',
      },
    ],
  },
  {
    title: 'Exemplos',
    items: [
      {
        slug: 'login-screen',
        title: 'Tela de Login',
        description: 'Exemplo completo com inputs, validação e ação de envio.',
      },
      {
        slug: 'dashboard',
        title: 'Dashboard',
        description: 'Tela principal com cards de métricas e navegação lateral.',
      },
      {
        slug: 'drawer-detail',
        title: 'Detalhe no Drawer',
        description: 'Mostra como exibir informações dinâmicas em um painel lateral.',
      },
      {
        slug: 'modal-flow',
        title: 'Fluxo com Modal',
        description: 'Encadeia interações modais e transições entre telas.',
      },
      {
        slug: 'list-cards',
        title: 'Listagem de Cards',
        description: 'Composição entre List e Card para exibir coleções dinâmicas.',
      },
    ],
  },
]

export const flatDocs = docSections.flatMap((section) => section.items)

export function findDocBySlug(slug: string) {
  return flatDocs.find((item) => item.slug === slug)
}

export default docSections