/**
 * Table of contents utilities
 */

export interface TocItem {
  id: string;
  title: string;
  level: number;
}

export interface DocItem {
  slug: string;
  title: string;
  content?: string;
}

export interface DocSection {
  title: string;
  items: DocItem[];
}

export function extractToc(content: string): TocItem[] {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  const toc: TocItem[] = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const title = match[2];
    const id = title.toLowerCase().replace(/[^\w]+/g, '-');

    toc.push({ id, title, level });
  }

  return toc;
}

// Documentation sections structure
export const docSections: DocSection[] = [
  {
    title: 'Getting Started',
    items: [
      { slug: 'introduction', title: 'Introduction' },
      { slug: 'quick-start', title: 'Quick Start' },
    ]
  },
  {
    title: 'Core Concepts',
    items: [
      { slug: 'syntax', title: 'Syntax' },
      { slug: 'components', title: 'Components' },
    ]
  }
];

// Flat list of all docs for easy lookup
export const flatDocs: DocItem[] = docSections.flatMap(section => section.items);

// Find a doc by slug
export function findDocBySlug(slug: string): DocItem | undefined {
  return flatDocs.find(doc => doc.slug === slug);
}

export default docSections;
