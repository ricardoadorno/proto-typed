export interface TocItem {
    path: string;
    label: string;
}

export interface TocSection {
    id: string;
    label: string;
    items: TocItem[];
}

export interface TocDocument {
    sections: TocSection[];
    contents?: TocContent[];
}

// Load MDX content files for docs pages
const mdxModules = import.meta.glob<(props: any) => any>("./sections/*.mdx", { eager: true });

interface TocContentMeta {
    path: string;
    title: string;
    excerpt?: string;
    contentFile?: string; 
}

const sections: TocSection[] = [
    {
        id: "overview",
        label: "Visão Geral",
        items: [
            { path: "/docs", label: "Começar" },
            { path: "/docs/syntax", label: "Sintaxe Básica" },
        ],
    },
    {
        id: "primitives",
        label: "Elementos Básicos",
        items: [
            { path: "/docs/primitives", label: "Primitivos" },
            { path: "/docs/buttons", label: "Botões" },
            { path: "/docs/inputs-forms", label: "Formulários" },
            { path: "/docs/typography", label: "Tipografia" },
            { path: "/docs/icons", label: "Ícones" },
        ],
    },
    {
        id: "layout",
        label: "Layout & Estrutura",
        items: [
            { path: "/docs/layout-system", label: "Sistema de Layout" },
            { path: "/docs/structures-content", label: "Estruturas de Conteúdo" },
        ],
    },
    {
        id: "advanced",
        label: "Recursos Avançados",
        items: [
            { path: "/docs/components-props", label: "Componentes e Props" },
            { path: "/docs/navigation", label: "Navegação" },
            { path: "/docs/navigation-overlays", label: "Modals e Drawers" },
            { path: "/docs/theming-styles", label: "Temas e Estilos" },
        ],
    },
    {
        id: "resources",
        label: "Recursos",
        items: [
            { path: "/docs/examples", label: "Exemplos" },
            { path: "/docs/troubleshooting", label: "Solução de Problemas" },
        ],
    },
];

const contentMeta: TocContentMeta[] = [
    {
        path: "/docs",
        title: "Começar",
        excerpt: "Introdução ao Proto-Typed DSL e editor",
        contentFile: "./sections/getting-started.mdx",
    },
    {
        path: "/docs/syntax",
        title: "Sintaxe Básica",
        excerpt: "Visão geral da sintaxe e regras do DSL",
        contentFile: "./sections/syntax.mdx",
    },
    {
        path: "/docs/primitives",
        title: "Primitivos",
        excerpt: "Elementos básicos: textos, títulos, imagens, links",
        contentFile: "./sections/primitives.mdx",
    },
    {
        path: "/docs/buttons",
        title: "Botões",
        excerpt: "Tamanhos, variantes, ícones e ações",
        contentFile: "./sections/buttons.mdx",
    },
    {
        path: "/docs/inputs-forms",
        title: "Formulários",
        excerpt: "Inputs, selects, checkboxes, radio buttons",
        contentFile: "./sections/inputs-forms.mdx",
    },
    {
        path: "/docs/typography",
        title: "Tipografia",
        excerpt: "Headings, body text, notas e citações",
        contentFile: "./sections/typography.mdx",
    },
    {
        path: "/docs/icons",
        title: "Ícones",
        excerpt: "Lucide Icons e como usá-los",
        contentFile: "./sections/icons.mdx",
    },
    {
        path: "/docs/layout-system",
        title: "Sistema de Layout",
        excerpt: "Container, row, col, grid e modificadores",
        contentFile: "./sections/layout-system.mdx",
    },
    {
        path: "/docs/structures-content",
        title: "Estruturas de Conteúdo",
        excerpt: "List, card, header, navigator, FAB, separator",
        contentFile: "./sections/structures-content.mdx",
    },
    {
        path: "/docs/components-props",
        title: "Componentes e Props",
        excerpt: "Blocos reutilizáveis com interpolação de props",
        contentFile: "./sections/components-props.mdx",
    },
    {
        path: "/docs/navigation",
        title: "Navegação",
        excerpt: "Screens, links, botões e fluxos de navegação",
        contentFile: "./sections/navigation.mdx",
    },
    {
        path: "/docs/navigation-overlays",
        title: "Modals e Drawers",
        excerpt: "Overlays nomeados para navegação",
        contentFile: "./sections/navigation-overlays.mdx",
    },
    {
        path: "/docs/theming-styles",
        title: "Temas e Estilos",
        excerpt: "Sistema de temas, CSS variables e customização",
        contentFile: "./sections/theming-styles.mdx",
    },
    {
        path: "/docs/examples",
        title: "Exemplos",
        excerpt: "Exemplos práticos e padrões comuns",
        contentFile: "./sections/examples.mdx",
    },
    {
        path: "/docs/troubleshooting",
        title: "Solução de Problemas",
        excerpt: "Erros comuns e como resolvê-los",
        contentFile: "./sections/troubleshooting.mdx",
    },
];

const contents: TocContent[] = contentMeta.map((p) => {
    let MdxComponent: any | undefined = undefined;
    if (p.contentFile) {
        const mdxPath = p.contentFile;
        if (mdxModules[mdxPath as keyof typeof mdxModules]) {
            const mod = mdxModules[mdxPath as keyof typeof mdxModules] as unknown as any;
            MdxComponent = (mod as any)?.default ?? (mod as any);
        }
    }
    return {
        path: p.path,
        title: p.title,
        excerpt: p.excerpt,
        MdxComponent,
    } as TocContent;
});

const toc: TocDocument = { sections, contents };

export default toc;

export interface TocContent {
    path: string;
    title: string;
    excerpt?: string;
    MdxComponent?: (props: any) => any;
}
