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
        title: 'Primitives',
        items: [
            { slug: 'text', title: 'Text', description: 'Títulos e parágrafos básicos da interface.' },
            { slug: 'button', title: 'Button', description: 'Botões de ação com variantes e destinos.' },
            { slug: 'input', title: 'Input', description: 'Campos de texto, senha e seleção.' },
            { slug: 'icon', title: 'Icon', description: 'Ícones embutidos e simbologia visual.' },
            { slug: 'link', title: 'Link', description: 'Links internos e externos com semântica clara.' },
        ],
    },
    {
        title: 'Layouts',
        items: [
            { slug: 'container', title: 'Container', description: 'Bloco base de largura controlada e espaçamento.' },
            { slug: 'stack', title: 'Stack', description: 'Empilhamento vertical de elementos com espaçamento.' },
            { slug: 'row', title: 'Row', description: 'Distribuição horizontal de elementos.' },
            { slug: 'grid', title: 'Grid', description: 'Grade responsiva de múltiplas colunas.' },
            { slug: 'card', title: 'Card', description: 'Bloco visual com fundo, bordas e padding.' },
            { slug: 'list', title: 'List', description: 'Coleção de elementos repetidos.' },
        ],
    },
    {
        title: 'Views & Navigation',
        items: [
            { slug: 'screen', title: 'Screen', description: 'Define uma tela navegável (view principal).' },
            { slug: 'modal', title: 'Modal', description: 'Janela sobreposta usada para interações rápidas.' },
            { slug: 'drawer', title: 'Drawer', description: 'Painel lateral com contexto persistente.' },
            { slug: 'navigator', title: 'Navigator', description: 'Menu de abas/tabs para alternar entre telas.' },
            { slug: 'fab', title: 'Floating Action Button (FAB)', description: 'Botão flutuante de ação global.' },
        ],
    },
    {
        title: 'Components',
        items: [
            { slug: 'component-definition', title: 'Component Definition', description: 'Como declarar componentes reutilizáveis.' },
            { slug: 'component-props', title: 'Component Props', description: 'Parâmetros e interpolação de valores.' },
            { slug: 'component-list', title: 'Component List', description: 'Renderização repetitiva com $Component.' },
            { slug: 'component-composition', title: 'Component Composition', description: 'Composição e boas práticas de reuso.' },
        ],
    },
    {
        title: 'Themes & Styles',
        items: [
            { slug: 'styles-block', title: 'Styles Block', description: 'Declaração de variáveis de estilo e tokens.' },
            { slug: 'themes', title: 'Themes', description: 'Temas padrão e personalização visual.' },
        ],
    },
    {
        title: 'Cookbook',
        items: [
            { slug: 'login-screen', title: 'Login Screen', description: 'Tela de login funcional com formulário e ação.' },
            { slug: 'dashboard', title: 'Dashboard', description: 'Layout principal com cards e navegação.' },
            { slug: 'drawer-detail', title: 'Drawer Detail', description: 'Exemplo de drawer com dados dinâmicos.' },
            { slug: 'modal-flow', title: 'Modal Flow', description: 'Fluxo de navegação usando modal e ação.' },
        ],
    },
]

export const flatDocs = docSections.flatMap((section) => section.items)

export function findDocBySlug(slug: string) {
    return flatDocs.find((item) => item.slug === slug)
}

export default docSections
