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
        title: 'Primitivos',
        items: [
            { slug: 'text', title: 'Texto', description: 'Títulos e parágrafos básicos da interface.' },
            { slug: 'button', title: 'Botão', description: 'Botões de ação com variantes e destinos.' },
            { slug: 'input', title: 'Entrada', description: 'Campos de texto, senha e seleção.' },
            { slug: 'icon', title: 'Ícone', description: 'Ícones embutidos e simbologia visual.' },
            { slug: 'link', title: 'Link', description: 'Links internos e externos com semântica clara.' },
        ],
    },
    {
        title: 'Layout',
        items: [
            { slug: 'container', title: 'Container', description: 'Bloco base de largura controlada e espaçamento.' },
            { slug: 'stack', title: 'Stack', description: 'Empilhamento vertical de elementos com espaçamento.' },
            { slug: 'row', title: 'Linha', description: 'Distribuição horizontal de elementos.' },
            { slug: 'grid', title: 'Grade', description: 'Grade responsiva de múltiplas colunas.' },
            { slug: 'card', title: 'Card', description: 'Bloco visual com fundo, bordas e padding.' },
            { slug: 'list', title: 'Lista', description: 'Coleção de elementos repetidos.' },
        ],
    },
    {
        title: 'Visões & Navegação',
        items: [
            { slug: 'screen', title: 'Tela', description: 'Define uma tela navegável (view principal).' },
            { slug: 'modal', title: 'Modal', description: 'Janela sobreposta usada para interações rápidas.' },
            { slug: 'drawer', title: 'Drawer', description: 'Painel lateral com contexto persistente.' },
            { slug: 'navigator', title: 'Navegador', description: 'Menu de abas/tabs para alternar entre telas.' },
            { slug: 'fab', title: 'Botão flutuante (FAB)', description: 'Botão flutuante de ação global.' },
        ],
    },
    {
        title: 'Componentes',
        items: [
            { slug: 'component-definition', title: 'Definição de componente', description: 'Como declarar componentes reutilizáveis.' },
            { slug: 'component-props', title: 'Propriedades de componente', description: 'Parâmetros e interpolação de valores.' },
            { slug: 'component-list', title: 'Lista de componentes', description: 'Renderização repetitiva com $Component.' },
            { slug: 'component-composition', title: 'Composição de componentes', description: 'Composição e boas práticas de reuso.' },
        ],
    },
    {
        title: 'Temas & Estilos',
        items: [
            { slug: 'styles-block', title: 'Bloco de estilos', description: 'Declaração de variáveis de estilo e tokens.' },
            { slug: 'themes', title: 'Temas', description: 'Temas padrão e personalização visual.' },
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
