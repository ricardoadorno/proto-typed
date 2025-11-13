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
    title: 'Syntax and View Flow',
    items: [
      {
        slug: 'syntax',
        title: 'Basic Syntax',
        description:
          'How to write DSL blocks, indent, and comment code correctly.',
      },
      {
        slug: 'screen',
        title: 'Screens',
        description:
          'Defines the view flow: how to create screens, containers, and the main visual hierarchy.',
      },
      {
        slug: 'flow',
        title: 'Navigation Flow',
        description:
          'How screens connect to each other and how the DSL defines the navigation experience.',
      },
    ],
  },
  {
    title: 'Interface Primitives',
    items: [
      {
        slug: 'text',
        title: 'Text',
        description:
          'Renders titles, subtitles, and paragraphs within the interface.',
      },
      {
        slug: 'icon',
        title: 'Icon',
        description:
          'Adds visual symbols or inline icons to reinforce meaning.',
      },
      {
        slug: 'button',
        title: 'Button',
        description:
          'Creates interactive actions with configurable variants and behaviors.',
      },
      {
        slug: 'input',
        title: 'Inputs',
        description:
          'Captures user data such as text, passwords, and selections.',
      },
      {
        slug: 'link',
        title: 'Link',
        description:
          'Creates internal or external navigation links with accessible semantics.',
      },
    ],
  },
  {
    title: 'Layout and Structure',
    items: [
      {
        slug: 'container',
        title: 'Container',
        description:
          'Defines the content width and applies consistent spacing.',
      },
      {
        slug: 'stack',
        title: 'Stack',
        description: 'Stacks elements vertically with automatic spacing.',
      },
      {
        slug: 'row',
        title: 'Row',
        description:
          'Organizes elements horizontally and aligns content laterally.',
      },
      {
        slug: 'grid',
        title: 'Grid',
        description:
          'Creates responsive layouts with multiple columns and flexible alignments.',
      },
      {
        slug: 'card',
        title: 'Card',
        description:
          'Groups information into visual blocks, with optional background and borders.',
      },
      {
        slug: 'list',
        title: 'List',
        description:
          'Renders repetitive collections of elements or components.',
      },
    ],
  },
  {
    title: 'Navigation and Interactions',
    items: [
      {
        slug: 'navigator',
        title: 'Navigator',
        description: 'Manages routes, tabs, and screen-switching menus.',
      },
      {
        slug: 'modal',
        title: 'Modal',
        description:
          'Overlay window used for quick actions and event confirmation.',
      },
      {
        slug: 'drawer',
        title: 'Drawer',
        description: 'Persistent side panel used for additional context.',
      },
      {
        slug: 'fab',
        title: 'Floating Action Button (FAB)',
        description:
          'Global and persistent action displayed over the main content.',
      },
    ],
  },
  {
    title: 'Components and Reuse',
    items: [
      {
        slug: 'component-definition',
        title: 'Component Definition',
        description:
          'How to declare reusable components and their properties (%props).',
      },
      {
        slug: 'component-props',
        title: 'Component Properties',
        description:
          'How to interpolate values, create placeholders, and pass dynamic parameters.',
      },
      {
        slug: 'component-composition',
        title: 'Component Composition',
        description:
          'Best practices for combining components without redundancy.',
      },
    ],
  },
  {
    title: 'Themes and Styles',
    items: [
      // {
      //   slug: 'styles-block',
      //   title: 'Styles Block',
      //   description: 'Defines tokens, variables, and global styles applicable to the project.',
      // },
      {
        slug: 'themes',
        title: 'Themes',
        description:
          'Configures and customizes the visual theme — colors, spacing, and typography.',
      },
    ],
  },
  {
    title: 'Patterns and Best Practices',
    items: [
      {
        slug: 'naming',
        title: 'Naming and Consistency',
        description:
          'Rules for naming components, props, and files in a standardized way.',
      },
      {
        slug: 'composition-guidelines',
        title: 'Composition Guidelines',
        description:
          'How to combine elements without generating redundancy or visual conflict.',
      },
      {
        slug: 'error-patterns',
        title: 'Common Errors',
        description:
          'Catalog of anti-patterns (Do/Dont) with practical solutions.',
      },
    ],
  },
  {
    title: 'Examples',
    items: [
      {
        slug: 'login-screen',
        title: 'Login Screen',
        description:
          'Complete example with inputs, validation, and submission action.',
      },
      {
        slug: 'dashboard',
        title: 'Dashboard',
        description: 'Main screen with metric cards and side navigation.',
      },
      {
        slug: 'drawer-detail',
        title: 'Detail in Drawer',
        description:
          'Shows how to display dynamic information in a side panel.',
      },
      {
        slug: 'modal-flow',
        title: 'Flow with Modal',
        description:
          'Chains modal interactions and transitions between screens.',
      },
      {
        slug: 'list-cards',
        title: 'Card Listing',
        description:
          'Composition between List and Card to display dynamic collections.',
      },
    ],
  },
]

export const flatDocs = docSections.flatMap((section) => section.items)

export function findDocBySlug(slug: string) {
  return flatDocs.find((item) => item.slug === slug)
}

export default docSections
