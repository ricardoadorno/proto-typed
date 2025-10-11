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
  
  // Button sizes - fixed width and height for consistent appearance
  buttonLarge: 'w-32 h-12 text-base',   // 128x48px
  buttonMedium: 'w-24 h-10 text-sm',    // 96x40px
  buttonSmall: 'w-8 h-8 text-xs bg-red-500',       // 32x32px (quadrado para ícones)
  buttonExtraSmall: 'w-6 h-6 text-xs', // 24x24px (quadrado para ícones)
  
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

  paragraph: {
    default: 'mb-4 leading-relaxed',
    text: 'leading-relaxed',
    paragraph: 'mb-4 leading-relaxed',
    muted: 'leading-relaxed',
    note: 'px-4 py-2 m-2 shadow-lg',
    quote: 'px-4 py-2 m-2 shadow-lg border-l-4'
  },
  
  link: 'underline transition-colors duration-200',

  // Layout components - responsive by default using only existing tokens
  container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8', // Responsive container with proper constraints
  grid: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6', // Auto-responsive grid
  card: 'bg-card border border-border rounded-lg shadow-sm p-4 sm:p-6 transition-shadow hover:shadow-md', // Responsive card with proper theming  
  row: 'flex flex-wrap gap-4 sm:gap-6', // Responsive row with flexible wrapping
  col: 'flex flex-col gap-4', // Column layout with consistent spacing
  
  // Lists - using base classes only
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
 * Get button classes based on context, variant and size
 */
export function getButtonClasses(variant?: string, size?: string): string {
  // Get base button variant class
  let variantClass = '';
  switch (variant) {
    case 'ghost':
      variantClass = elementStyles.buttonGhost;
      break;
    case 'outline':
      variantClass = elementStyles.buttonOutline;
      break;
    case 'secondary':
      variantClass = elementStyles.buttonSecondary;
      break;
    case 'destructive':
      variantClass = elementStyles.buttonDestructive;
      break;
    case 'warning':
      variantClass = elementStyles.buttonWarning;
      break;
    default:
      variantClass = elementStyles.button;
      break;
  }

  // Get size class
  let sizeClass = '';
  switch (size) {
    case 'extra-small':
      sizeClass = elementStyles.buttonExtraSmall;
      break;
    case 'small':
      sizeClass = elementStyles.buttonSmall;
      break;
    case 'medium':
      sizeClass = elementStyles.buttonMedium;
      break;
    case 'large':
    default:
      sizeClass = elementStyles.buttonLarge;
      break;
  }

  // Remove default padding from variant class and add size-specific styling
  const baseClass = variantClass.replace(/px-\d+|py-\d+|text-\w+/g, '').trim();
  
  return `${baseClass} ${sizeClass}`;
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
export function getContainerInlineStyles(): string {
  return 'background-color: var(--background);';
}

export function getGridInlineStyles(): string {
  return 'background-color: var(--background);';
}

export function getRowInlineStyles(): string {
  return 'background-color: var(--background);';
}

export function getColInlineStyles(): string {
  return 'background-color: var(--background);';
}

/**
 * Enhanced card inline styles - responsive by default
 */
export function getCardInlineStyles(): string {
  return 'background-color: var(--card); border-radius: var(--radius); border-color: var(--border);';
}

/**
 * Generate layout modifier styles using CSS variables
 */
export function getLayoutModifierInlineStyles(modifiers: any): string {
  const styles: string[] = [];
  
  // Custom spacing using CSS variables
  if (modifiers.padding) {
    styles.push(`padding: ${modifiers.padding};`);
  }
  if (modifiers.margin) {
    styles.push(`margin: ${modifiers.margin};`);
  }
  
  // Custom colors using CSS variables
  if (modifiers.background) {
    styles.push(`background-color: var(--${modifiers.background});`);
  }
  
  // Border radius using CSS variables
  if (modifiers.rounded !== false) {
    styles.push('border-radius: var(--radius);');
  }
  
  return styles.join(' ');
}

/**
 * Generate inline styles for list elements using CSS variables
 */
export function getListInlineStyles(): string {
  return 'color: var(--foreground);';
}

// Unordered list (ul) container inline styles
export function getUnorderedListInlineStyles(): string {
  return 'margin: 0 0 1rem 1rem; color: var(--foreground);';
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

export function getModalContentInlineStyles(): string {
  return 'background-color: var(--card); border-radius: var(--radius); border: 1px solid var(--border);';
}

export function getModalCloseInlineStyles(): string {
  return 'color: var(--muted-foreground);';
}

export function getDrawerInlineStyles(): string {
  return 'background-color: var(--card); border-right: 1px solid var(--border);';
}
