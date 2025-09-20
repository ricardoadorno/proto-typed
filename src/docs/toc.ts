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
        label: "Overview",
        items: [{ path: "/docs", label: "Getting Started" }],
    },
    {
        id: "guide",
        label: "Guides",
        items: [
            { path: "/docs/syntax", label: "Syntax Guide" },
            { path: "/docs/navigation", label: "Navigation" },
            { path: "/docs/components", label: "Components" },
            { path: "/docs/examples", label: "Examples" },
            { path: "/docs/troubleshooting", label: "Troubleshooting" },
        ],
    },
    {
        id: "components",
        label: "Components",
        items: [
            { path: "/docs/typography", label: "Typography" },
            { path: "/docs/interactive", label: "Interactive" },
            { path: "/docs/icons", label: "Iconography" },
            { path: "/docs/forms", label: "Forms" },
            { path: "/docs/layout", label: " Layout Primitives" },
            { path: "/docs/structure", label: "Content Structures" },
            { path: "/docs/navigation-overlays", label: "Navigation & Overlays" },
        ],
    },
];

const contentMeta: TocContentMeta[] = [
    {
        path: "/docs",
        title: "Getting Started",
        excerpt: "Learn the basics of the DSL, editor, and live preview.",
        contentFile: "./sections/getting-started.mdx",
    },
    {
        path: "/docs/syntax",
        title: "Syntax Guide",
        excerpt: "Complete overview of the DSL building blocks and rules.",
        contentFile: "./sections/syntax.mdx",
    },
    {
        path: "/docs/navigation",
        title: "Navigation",
        excerpt: "Screens, links, buttons, and named overlays for app flows.",
        contentFile: "./sections/navigation.mdx",
    },
    {
        path: "/docs/components",
        title: "Components Overview",
        excerpt: "Create reusable blocks and compose UIs with clarity.",
        contentFile: "./sections/components.mdx",
    },
    {
        path: "/docs/examples",
        title: "Examples",
        excerpt: "Practical snippets demonstrating common patterns and layouts.",
        contentFile: "./sections/examples.mdx",
    },
    {
        path: "/docs/troubleshooting",
        title: "Troubleshooting",
        excerpt: "Common issues, parsing tips, and how to recover fast.",
        contentFile: "./sections/troubleshooting.mdx",
    },
    {
        path: "/docs/typography",
        title: "Typography",
        excerpt: "Headings, body text, notes, and quotes.",
        contentFile: "./sections/typography.mdx",
    },
    {
        path: "/docs/interactive",
        title: "Interactive Elements",
        excerpt: "Buttons, links, images, and interactivity patterns.",
        contentFile: "./sections/interactive.mdx",
    },
    {
        path: "/docs/icons",
        title: "Iconography",
        excerpt: "Working with icons in the design system.",
        contentFile: "./sections/icons.mdx",
    },
    {
        path: "/docs/forms",
        title: "Forms",
        excerpt: "Inputs, passwords, disabled states, and selects.",
        contentFile: "./sections/forms.mdx",
    },
    {
        path: "/docs/layout",
        title: "Layout Primitives",
        excerpt: "Container, rows, columns, grid, and cards.",
        contentFile: "./sections/layout.mdx",
    },
    {
        path: "/docs/structure",
        title: "Content Structures",
        excerpt: "Lists and other rich content structures.",
        contentFile: "./sections/structure.mdx",
    },
    {
        path: "/docs/navigation-overlays",
        title: "Navigation & Overlays",
        excerpt: "Modals and drawers as named elements.",
        contentFile: "./sections/navigation-overlays.mdx",
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
