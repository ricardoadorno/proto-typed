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
    posts?: TocPost[];
}

// Load external JSON content files for posts
const contentModules = import.meta.glob<{ default: { content: string } }>("./posts/*.json", { eager: true });

interface TocPostMeta {
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

const postMeta: TocPostMeta[] = [
    {
        path: "/docs",
        title: "Getting Started",
        excerpt: "Overview of the Proto-Typed DSL and how to use the editor.",
        contentFile: "./posts/getting-started.json",
    },
    {
        path: "/docs/syntax",
        title: "Syntax Guide",
        excerpt: "All core syntax: screens, components, text, and actions.",
        contentFile: "./posts/syntax.json",
    },
    {
        path: "/docs/examples",
        title: "Examples",
        excerpt: "Practical examples to copy and modify.",
        contentFile: "./posts/examples.json",
    },
    {
        path: "/docs/troubleshooting",
        title: "Troubleshooting",
        excerpt: "Common errors and how to fix them.",
        contentFile: "./posts/troubleshooting.json",
    },
    { path: "/docs/components", title: "Components", excerpt: "Reusable blocks with $ComponentName.", contentFile: "./posts/components.json" },
    { path: "/docs/typography", title: "Typography", excerpt: "Headings, text, quotes, and notes.", contentFile: "./posts/typography.json" },
    { path: "/docs/forms", title: "Forms", excerpt: "Inputs, selects, and validation.", contentFile: "./posts/forms.json" },
    { path: "/docs/interactive", title: "Interactive", excerpt: "Buttons, links, and images.", contentFile: "./posts/interactive.json" },
    { path: "/docs/layout", title: "Layout", excerpt: "Containers, grids, and flex.", contentFile: "./posts/layout.json" },
    { path: "/docs/lists", title: "Lists", excerpt: "Advanced list item syntax.", contentFile: "./posts/lists.json" },
    { path: "/docs/mobile", title: "Mobile", excerpt: "Header, navigator, and FAB.", contentFile: "./posts/mobile.json" },
    { path: "/docs/modals", title: "Modals", excerpt: "Named togglable elements.", contentFile: "./posts/modals.json" },
    { path: "/docs/navigation", title: "Navigation", excerpt: "Internal navigation patterns.", contentFile: "./posts/navigation.json" },
    { path: "/docs/screens", title: "Screens", excerpt: "Screen declarations and routing.", contentFile: "./posts/screens.json" },
    { path: "/docs/known-issues", title: "Known Issues", excerpt: "Current limitations.", contentFile: "./posts/known-issues.json" },
];

const posts: TocPost[] = postMeta.map((p) => {
    let content: string | undefined = undefined;
    if (p.contentFile) {
        const mod = contentModules[p.contentFile as keyof typeof contentModules];
        content = (mod as any)?.default?.content;
    }
    return {
        path: p.path,
        title: p.title,
        excerpt: p.excerpt,
        content,
    } as TocPost;
});

const toc: TocDocument = { sections, posts };

export default toc;

export interface TocPost {
    path: string;
    title: string;
    excerpt?: string;
    content?: string;
}
