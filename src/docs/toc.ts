export interface DocItem {
  slug: string;
  title: string;
}

const toc: DocItem[] = [
  { slug: 'getting-started', title: 'Getting Started' },
  { slug: 'primitives', title: 'Primitives' },
  { slug: 'typography', title: 'Typography' },
  { slug: 'buttons', title: 'Buttons' },
  { slug: 'inputs-forms', title: 'Inputs & Forms' },
  { slug: 'components-props', title: 'Components & Props' },
  { slug: 'structures-content', title: 'Structures & Content' },
  { slug: 'layout-system', title: 'Layout System' },
  { slug: 'navigation', title: 'Navigation' },
  { slug: 'navigation-overlays', title: 'Navigation & Overlays' },
  { slug: 'theming-styles', title: 'Theming & Styles' },
  { slug: 'icons', title: 'Icons' },
  { slug: 'examples', title: 'Examples' },
  { slug: 'troubleshooting', title: 'Troubleshooting' },
];

export default toc;
