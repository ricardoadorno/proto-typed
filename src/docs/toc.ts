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

// Load external content files for docs pages
// Support both JSON (with { content: string }) and Markdown (.md as raw string)
const jsonModules = import.meta.glob<{ default: { content: string } }>("./sections/*.json", { eager: true });
const mdModules = import.meta.glob<string>("./sections/*.md", { as: "raw", eager: true });

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
            { path: "/docs/examples", label: "Examples" },
            { path: "/docs/troubleshooting", label: "Troubleshooting" },
        ],
    },
    {
        id: "elements",
        label: "Elements",
        items: [
            { path: "/docs/components", label: "Components" },
            { path: "/docs/typography", label: "Typography" },
            { path: "/docs/forms", label: "Forms" },
            { path: "/docs/interactive", label: "Interactive" },
            { path: "/docs/layout", label: "Layout" },
            { path: "/docs/lists", label: "Lists" },
            { path: "/docs/mobile", label: "Mobile" },
            { path: "/docs/modals", label: "Modals" },
            { path: "/docs/navigation", label: "Navigation" },
            { path: "/docs/screens", label: "Screens" },
        ],
    },
    {
        id: "meta",
        label: "Meta",
        items: [{ path: "/docs/known-issues", label: "Known Issues" }],
    },
];

const contentMeta: TocContentMeta[] = [
    {
        path: "/docs",
        title: "Getting Started",
        excerpt: "Overview of the Proto-Typed DSL and how to use the editor.",
        contentFile: "./sections/getting-started.json",
    },
    {
        path: "/docs/syntax",
        title: "Syntax Guide",
        excerpt: "All core syntax: screens, components, text, and actions.",
        contentFile: "./sections/syntax.json",
    },
    {
        path: "/docs/examples",
        title: "Examples",
        excerpt: "Practical examples to copy and modify.",
        contentFile: "./sections/examples.json",
    },
    {
        path: "/docs/troubleshooting",
        title: "Troubleshooting",
        excerpt: "Common errors and how to fix them.",
        contentFile: "./sections/troubleshooting.json",
    },
    { path: "/docs/components", title: "Components", excerpt: "Reusable blocks with $ComponentName.", contentFile: "./sections/components.json" },
    { path: "/docs/typography", title: "Typography", excerpt: "Headings, text, quotes, and notes.", contentFile: "./sections/typography.json" },
    { path: "/docs/forms", title: "Forms", excerpt: "Inputs, selects, and validation.", contentFile: "./sections/forms.json" },
    { path: "/docs/interactive", title: "Interactive", excerpt: "Buttons, links, and images.", contentFile: "./sections/interactive.json" },
    { path: "/docs/layout", title: "Layout", excerpt: "Containers, grids, and flex.", contentFile: "./sections/layout.json" },
    { path: "/docs/lists", title: "Lists", excerpt: "Advanced list item syntax.", contentFile: "./sections/lists.json" },
    { path: "/docs/mobile", title: "Mobile", excerpt: "Header, navigator, and FAB.", contentFile: "./sections/mobile.json" },
    { path: "/docs/modals", title: "Modals", excerpt: "Named togglable elements.", contentFile: "./sections/modals.json" },
    { path: "/docs/navigation", title: "Navigation", excerpt: "Internal navigation patterns.", contentFile: "./sections/navigation.json" },
    { path: "/docs/screens", title: "Screens", excerpt: "Screen declarations and routing.", contentFile: "./sections/screens.json" },
    { path: "/docs/known-issues", title: "Known Issues", excerpt: "Current limitations.", contentFile: "./sections/known-issues.json" },
];

const contents: TocContent[] = contentMeta.map((p) => {
    let content: string | undefined = undefined;
    if (p.contentFile) {
        const jsonPath = p.contentFile;
        const mdPath = p.contentFile.replace(/\.json$/i, ".md");

        if (mdModules[mdPath as keyof typeof mdModules]) {
            content = mdModules[mdPath as keyof typeof mdModules] as unknown as string;
        } else if (jsonModules[jsonPath as keyof typeof jsonModules]) {
            const mod = jsonModules[jsonPath as keyof typeof jsonModules];
            content = (mod as any)?.default?.content;
        }
    }
    return {
        path: p.path,
        title: p.title,
        excerpt: p.excerpt,
        content,
    } as TocContent;
});

const toc: TocDocument = { sections, contents };

export default toc;

export interface TocContent {
    path: string;
    title: string;
    excerpt?: string;
    content?: string;
}
