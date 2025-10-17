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
        title: 'Guia',
        items: [
            { slug: 'getting-started', title: 'Getting Started' },
            { slug: 'primitives', title: 'Primitives' },
            { slug: 'typography', title: 'Typography' },
        ],
    },
    {
        title: 'Componentes',
        items: [
            { slug: 'buttons', title: 'Buttons' },
            { slug: 'inputs-forms', title: 'Inputs & Forms' },
            { slug: 'components-props', title: 'Components & Props' },
            { slug: 'structures-content', title: 'Structures & Content' },
        ],
    },
    {
        title: 'Layout & Navegação',
        items: [
            { slug: 'layout-system', title: 'Layout System' },
            { slug: 'navigation', title: 'Navigation' },
            { slug: 'navigation-overlays', title: 'Navigation & Overlays' },
        ],
    },
    {
        title: 'Estilo',
        items: [
            { slug: 'theming-styles', title: 'Theming & Styles' },
            { slug: 'icons', title: 'Icons' },
        ],
    },
    {
        title: 'Recursos',
        items: [
            { slug: 'examples', title: 'Examples' },
            { slug: 'troubleshooting', title: 'Troubleshooting' },
        ],
    },
]

export const flatDocs = docSections.flatMap((section) => section.items)

export function findDocBySlug(slug: string) {
    return flatDocs.find((item) => item.slug === slug)
}

export default docSections
