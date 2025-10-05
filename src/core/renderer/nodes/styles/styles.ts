/**
 * Central styles management for renderer components
 * Uses CSS variables from shadcn theming system for customizable styling
 */

// Basic element styles using CSS variables for theming
export const elementStyles = {
  // Button variants - now using inline styles with CSS variables
  button: 'inline-flex items-center justify-center px-4 py-2 focus:outline-none focus:ring-2 transition-colors duration-200',
  buttonGhost: 'inline-flex items-center justify-center px-4 py-2 focus:outline-none focus:ring-2 transition-colors duration-200',
  buttonOutline: 'inline-flex items-center justify-center px-4 py-2 focus:outline-none focus:ring-2 transition-colors duration-200',
  buttonSecondary: 'inline-flex items-center justify-center px-4 py-2 focus:outline-none focus:ring-2 transition-colors duration-200',
  buttonDestructive: 'inline-flex items-center justify-center px-4 py-2 focus:outline-none focus:ring-2 transition-colors duration-200',
  buttonWarning: 'inline-flex items-center justify-center px-4 py-2 focus:outline-none focus:ring-2 transition-colors duration-200',
  
  // Form elements - using base classes only
  input: 'w-full px-3 py-2 shadow-sm focus:outline-none focus:ring-2 transition-colors',
  label: 'block text-sm font-medium mb-2',
  select: 'w-full px-3 py-2 shadow-sm focus:outline-none focus:ring-2 transition-colors',
  checkbox: 'w-4 h-4 rounded focus:ring-2 transition-colors',
  radio: 'w-4 h-4 focus:ring-2 transition-colors',

  // Typography - using base classes only
  heading: {
    1: 'text-4xl font-bold mb-6',
    2: 'text-3xl font-bold mb-5',
    3: 'text-2xl font-bold mb-4',
    4: 'text-xl font-bold mb-3',
    5: 'text-lg font-bold mb-2',
    6: 'text-base font-bold mb-2'
  },
  
  // Header-specific headings (smaller, no margins/padding)
  headerHeading: {
    1: 'text-lg font-bold',
    2: 'text-lg font-bold',
    3: 'text-base font-bold',
    4: 'text-base font-bold',
    5: 'text-sm font-bold',
    6: 'text-sm font-bold'
  },

  paragraph: {
    default: 'mb-4 leading-relaxed',
    text: 'leading-relaxed',
    paragraph: 'mb-4 leading-relaxed',
    muted: 'leading-relaxed',
    note: 'px-4 py-2 m-2 shadow-lg',
    quote: 'px-4 py-2 m-2 shadow-lg border-l-4'
  },
  
  link: 'underline transition-colors duration-200',

  // Layout components - using base classes only
  container: 'container mx-auto px-4',
  grid: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6',
  card: 'shadow-lg p-6 mb-6',
  row: 'flex flex-wrap gap-4 mb-4',
  col: 'grid grid-cols-1 @md:grid-cols-2 @lg:grid-cols-3 gap-6',
  
  // Lists - using base classes only
  orderedList: 'list-decimal list-inside space-y-2 mb-4',
  unorderedList: 'list-disc list-inside space-y-2 mb-4',
  listItem: 'mb-2',
  
  // List items - using base classes only
  simpleListItem: 'flex justify-between items-center p-3 shadow-sm hover:shadow-md transition-shadow duration-200',
  
  // Mobile components using CSS variables
  header: 'sticky top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border px-6 py-4 flex items-center justify-between min-h-[72px]',
  headerTitle: 'text-xl md:text-2xl font-bold text-foreground truncate mr-4 mb-0',
  navigator: 'sticky bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md border-t border-border flex flex-row justify-around py-2 z-50 w-full shadow-2xl',
  navItem: 'flex flex-col items-center justify-center py-2 px-3 text-xs font-medium text-muted-foreground hover:text-primary active:text-primary/80 transition-all duration-200 rounded-[--radius] hover:bg-accent min-w-[60px]',
  navItemIcon: 'mb-1 text-lg',
  navItemLabel: 'text-xs font-medium',

  // FAB using CSS variables
  fab: 'w-14 h-14 rounded-full bg-primary shadow-2xl flex items-center justify-center text-xl font-bold text-primary-foreground z-40',
  fabContainer: 'sticky bottom-20 right-6 left-auto z-40 flex flex-col items-end justify-end p-0 pb-4 ml-auto w-auto',
  fabItemsList: 'mb-8 space-y-6 opacity-0 transform translate-y-4 pointer-events-none',
  fabItem: 'flex items-center justify-end',
  fabItemBtn: 'w-12 h-12 mb-3 rounded-full bg-secondary flex items-center justify-center text-lg text-secondary-foreground shadow-lg',
  fabItemLabel: 'mr-3 bg-popover text-popover-foreground px-3 py-1 rounded-[--radius] text-sm font-medium shadow-lg whitespace-nowrap',

  // Modal and drawer using CSS variables
  modalBackdrop: 'modal-backdrop absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50',
  modalContent: 'modal-content bg-card rounded-[--radius] shadow-xl max-w-md w-full mx-4 p-6 relative border border-border',
  modalClose: 'modal-close absolute top-4 right-4 text-muted-foreground hover:text-foreground w-8 h-8 flex items-center justify-center rounded-full hover:bg-accent transition-colors',
  drawer: 'drawer absolute top-0 left-0 z-40 w-64 h-full bg-card border-r border-border shadow-lg transform -translate-x-full transition-transform duration-300 ease-in-out',

  // Utility using CSS variables
  separator: 'my-6 border-border',
  image: 'max-w-full h-auto rounded-[--radius] shadow-md'
} as const;

/**
 * Get button classes based on context and variant
 */
export function getButtonClasses(context?: string, variant?: string): string {
  if (context === 'header') {
    return '';
  }
  
  // Return appropriate button variant class
  switch (variant) {
    case 'ghost':
      return elementStyles.buttonGhost;
    case 'outline':
      return elementStyles.buttonOutline;
    case 'secondary':
      return elementStyles.buttonSecondary;
    case 'destructive':
      return elementStyles.buttonDestructive;
    case 'warning':
      return elementStyles.buttonWarning;
    default:
      return elementStyles.button;
  }
}

/**
 * Generate form control wrapper classes
 */
export function getFormControlClasses(): string {
  return 'flex items-center space-x-3 cursor-pointer';
}

/**
 * Generate screen layout classes
 */
export function getScreenClasses(layoutClasses: string[]): string {
  const baseClasses = 'screen container';
  return `${baseClasses} ${layoutClasses.join(' ')}`;
}

/**
 * Generate inline styles for button variants using CSS variables
 */
export function getButtonInlineStyles(variant: 'primary' | 'ghost' | 'outline' | 'secondary' | 'destructive' | 'warning'): string {
  const baseStyle = 'border-radius: var(--radius); focus-ring-color: var(--ring);';
  
  switch (variant) {
    case 'primary':
      return `${baseStyle} background-color: var(--primary); color: var(--primary-foreground);`;
    case 'ghost':
      return `${baseStyle} background-color: transparent; color: var(--foreground);`;
    case 'outline':
      return `${baseStyle} background-color: var(--background); border: 1px solid var(--input); color: var(--foreground);`;
    case 'secondary':
      return `${baseStyle} background-color: var(--secondary); color: var(--secondary-foreground);`;
    case 'destructive':
      return `${baseStyle} background-color: var(--destructive); color: var(--destructive-foreground);`;
    case 'warning':
      return `${baseStyle} background-color: #dc7609; color: white;`;
    default:
      return `${baseStyle} background-color: var(--primary); color: var(--primary-foreground);`;
  }
}

/**
 * Generate inline styles for form elements using CSS variables
 */
export function getInputInlineStyles(): string {
  return 'border: 1px solid var(--input); border-radius: var(--radius); background-color: var(--background); color: var(--foreground); ring-color: var(--ring);';
}

export function getLabelInlineStyles(): string {
  return 'color: var(--foreground);';
}

export function getSelectInlineStyles(): string {
  return 'border: 1px solid var(--input); border-radius: var(--radius); background-color: var(--background); color: var(--foreground); ring-color: var(--ring);';
}

export function getCheckboxInlineStyles(): string {
  return 'accent-color: var(--primary); background-color: var(--background); border: 1px solid var(--input); ring-color: var(--primary);';
}

export function getRadioInlineStyles(): string {
  return 'accent-color: var(--primary); background-color: var(--background); border: 1px solid var(--input); ring-color: var(--primary);';
}

/**
 * Generate inline styles for typography elements using CSS variables
 */
export function getHeadingInlineStyles(): string {
  return 'color: var(--foreground);';
}

export function getParagraphInlineStyles(variant: 'default' | 'text' | 'paragraph' | 'muted' | 'note' | 'quote'): string {
  const baseStyle = 'border-radius: var(--radius);';
  
  switch (variant) {
    case 'muted':
      return 'color: var(--muted-foreground);';
    case 'note':
      return `${baseStyle} background-color: var(--destructive); color: var(--destructive-foreground);`;
    case 'quote':
      return `${baseStyle} background-color: var(--muted); color: var(--muted-foreground); border-left-color: var(--primary);`;
    default:
      return 'color: var(--foreground);';
  }
}

export function getLinkInlineStyles(): string {
  return 'color: var(--primary);';
}

/**
 * Generate inline styles for layout elements using CSS variables
 */
export function getCardInlineStyles(): string {
  return 'background-color: var(--card); border-radius: var(--radius); border: 1px solid var(--border);';
}

/**
 * Generate inline styles for list elements using CSS variables
 */
export function getListInlineStyles(): string {
  return 'color: var(--foreground);';
}

export function getListItemInlineStyles(): string {
  return 'background-color: var(--card); border: 1px solid var(--border); border-radius: var(--radius);';
}

/**
 * Generate inline styles for mobile/navigation elements using CSS variables
 */
export function getHeaderInlineStyles(): string {
  return 'background-color: var(--background); border-bottom-color: var(--border);';
}

export function getHeaderTitleInlineStyles(): string {
  return 'color: var(--foreground);';
}

export function getNavigatorInlineStyles(): string {
  return 'background-color: var(--background); border-top-color: var(--border);';
}

export function getNavItemInlineStyles(): string {
  return 'color: var(--muted-foreground); border-radius: var(--radius);';
}

/**
 * Generate inline styles for FAB elements using CSS variables
 */
export function getFabInlineStyles(): string {
  return 'background-color: var(--primary); color: var(--primary-foreground);';
}

export function getFabItemBtnInlineStyles(): string {
  return 'background-color: var(--secondary); color: var(--secondary-foreground);';
}

export function getFabItemLabelInlineStyles(): string {
  return 'background-color: var(--popover); color: var(--popover-foreground); border-radius: var(--radius);';
}

/**
 * Generate inline styles for modal and drawer elements using CSS variables
 */
export function getModalBackdropInlineStyles(): string {
  return 'background-color: var(--background);';
}

export function getModalContentInlineStyles(): string {
  return 'background-color: var(--card); border-radius: var(--radius); border: 1px solid var(--border);';
}

export function getModalCloseInlineStyles(): string {
  return 'color: var(--muted-foreground);';
}

export function getDrawerInlineStyles(): string {
  return 'background-color: var(--card); border-right: 1px solid var(--border);';
}
