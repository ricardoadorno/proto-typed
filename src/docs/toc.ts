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
    contentFile?: string; // MDX only
}

const sections: TocSection[] = [
    {
        id: "overview",
        label: "Overview",
        items: [{ path: "/docs", label: "Getting Started" }],
    },
    // {
    //     id: "guide",
    //     label: "Guides",
    //     items: [
    //         { path: "/docs/syntax", label: "Syntax Guide" },
    //          { path: "/docs/navigation", label: "Navigation" },
    // { path: "/docs/components", label: "Components" },
    //         { path: "/docs/examples", label: "Examples" },
    //         { path: "/docs/troubleshooting", label: "Troubleshooting" },
    //     ],
    // },
    {
        id: "elements",
        label: "Elements",
        items: [
            { path: "/docs/screens", label: "Screens" },
            { path: "/docs/typography", label: "Typography" },
            { path: "/docs/forms", label: "Forms" },
            { path: "/docs/interactive", label: "Interactive" },
            { path: "/docs/layout", label: "Layout" },
            { path: "/docs/lists", label: "Lists" },
            { path: "/docs/mobile", label: "Mobile" },
            { path: "/docs/modals", label: "Modals" },
            
        ],
    },
    // {
    //     id: "meta",
    //     label: "Meta",
    //     items: [{ path: "/docs/known-issues", label: "Known Issues" }],
    // },
];

const contentMeta: TocContentMeta[] = [
    {
        path: "/docs",
        title: "Getting Started",
        excerpt: "Overview of the Proto-Typed DSL and how to use the editor.",
        contentFile: "./sections/getting-started.mdx",
    },
    {
        path: "/docs/syntax",
        title: "Syntax Guide",
        excerpt: "All core syntax: screens, components, text, and actions.",
        contentFile: "./sections/syntax.mdx",
    },
    {
        path: "/docs/examples",
        title: "Examples",
        excerpt: "Practical examples to copy and modify.",
        contentFile: "./sections/examples.mdx",
    },
    {
        path: "/docs/troubleshooting",
        title: "Troubleshooting",
        excerpt: "Common errors and how to fix them.",
        contentFile: "./sections/troubleshooting.mdx",
    },
    { path: "/docs/components", title: "Components", excerpt: "Reusable blocks with $ComponentName.", contentFile: "./sections/components.mdx" },
    { path: "/docs/typography", title: "Typography", excerpt: "Headings, text, quotes, and notes.", contentFile: "./sections/typography.mdx" },
    { path: "/docs/forms", title: "Forms", excerpt: "Inputs, selects, and validation.", contentFile: "./sections/forms.mdx" },
    { path: "/docs/interactive", title: "Interactive", excerpt: "Buttons, links, and images.", contentFile: "./sections/interactive.mdx" },
    { path: "/docs/layout", title: "Layout", excerpt: "Containers, grids, and flex.", contentFile: "./sections/layout.mdx" },
    { path: "/docs/lists", title: "Lists", excerpt: "Advanced list item syntax.", contentFile: "./sections/lists.mdx" },
    { path: "/docs/mobile", title: "Mobile", excerpt: "Header, navigator, and FAB.", contentFile: "./sections/mobile.mdx" },
    { path: "/docs/modals", title: "Modals", excerpt: "Named togglable elements.", contentFile: "./sections/modals.mdx" },
    { path: "/docs/navigation", title: "Navigation", excerpt: "Internal navigation patterns.", contentFile: "./sections/navigation.mdx" },
    { path: "/docs/screens", title: "Screens", excerpt: "Screen declarations and routing.", contentFile: "./sections/screens.mdx" },
    { path: "/docs/known-issues", title: "Known Issues", excerpt: "Current limitations.", contentFile: "./sections/known-issues.mdx" },
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
