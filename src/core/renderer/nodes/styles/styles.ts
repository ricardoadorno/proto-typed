/**
 * Central styles management for renderer components
 * Uses CSS variables from shadcn theming system for customizable styling
 */

// Basic element styles using CSS variables for theming
export const elementStyles = {
  // Button variants - now using CSS variables
  button: 'inline-flex items-center justify-center px-4 py-2 rounded-[--radius] bg-primary hover:bg-primary/90 text-primary-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors duration-200',
  buttonGhost: 'inline-flex items-center justify-center px-4 py-2 rounded-[--radius] bg-transparent hover:bg-accent text-foreground hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors duration-200',
  buttonOutline: 'inline-flex items-center justify-center px-4 py-2 rounded-[--radius] bg-background border border-input hover:bg-accent text-foreground hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors duration-200',
  buttonSecondary: 'inline-flex items-center justify-center px-4 py-2 rounded-[--radius] bg-secondary hover:bg-secondary/80 text-secondary-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors duration-200',
  buttonDestructive: 'inline-flex items-center justify-center px-4 py-2 rounded-[--radius] bg-destructive hover:bg-destructive/90 text-destructive-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors duration-200',
  buttonWarning: 'inline-flex items-center justify-center px-4 py-2 rounded-[--radius] bg-yellow-600 hover:bg-yellow-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-colors duration-200',
  
  // Form elements using CSS variables
  input: 'w-full px-3 py-2 border border-input rounded-[--radius] shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-input bg-background text-foreground',
  label: 'block text-sm font-medium text-foreground mb-2',
  select: 'w-full px-3 py-2 border border-input rounded-[--radius] shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-input bg-background text-foreground',
  checkbox: 'w-4 h-4 text-primary bg-background border-input rounded focus:ring-primary ring-offset-background focus:ring-2',
  radio: 'w-4 h-4 text-primary bg-background border-input focus:ring-primary ring-offset-background focus:ring-2',

  // Typography using CSS variables
  heading: {
    1: 'text-4xl font-bold text-foreground mb-6',
    2: 'text-3xl font-bold text-foreground mb-5',
    3: 'text-2xl font-bold text-foreground mb-4',
    4: 'text-xl font-bold text-foreground mb-3',
    5: 'text-lg font-bold text-foreground mb-2',
    6: 'text-base font-bold text-foreground mb-2'
  },
  
  // Header-specific headings (smaller, no margins/padding)
  headerHeading: {
    1: 'text-lg font-bold text-foreground',
    2: 'text-lg font-bold text-foreground',
    3: 'text-base font-bold text-foreground',
    4: 'text-base font-bold text-foreground',
    5: 'text-sm font-bold text-foreground',
    6: 'text-sm font-bold text-foreground'
  },

  paragraph: {
    default: 'text-foreground mb-4 leading-relaxed',
    text: 'text-foreground leading-relaxed',
    paragraph: 'text-foreground mb-4 leading-relaxed',
    muted: 'text-muted-foreground leading-relaxed',
    note: 'bg-destructive text-destructive-foreground px-4 py-2 rounded-[--radius] m-2 shadow-lg',
    quote: 'bg-muted text-muted-foreground px-4 py-2 rounded-[--radius] m-2 shadow-lg border-l-4 border-primary'
  },
  
  link: 'text-primary hover:text-primary/80 underline transition-colors duration-200',

  // Layout components using CSS variables
  container: 'container mx-auto px-4',
  grid: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6',
  card: 'bg-card rounded-[--radius] border border-border shadow-lg p-6 mb-6',
  row: 'flex flex-wrap gap-4 mb-4',
  col: 'grid grid-cols-1 @md:grid-cols-2 @lg:grid-cols-3 gap-6',
  
  // Lists using CSS variables
  orderedList: 'list-decimal list-inside space-y-2 mb-4 text-foreground',
  unorderedList: 'list-disc list-inside space-y-2 mb-4 text-foreground',
  listItem: 'mb-2',
  
  // List items using CSS variables
  simpleListItem: 'flex justify-between items-center p-3 bg-card border border-border rounded-[--radius] shadow-sm hover:shadow-md transition-shadow duration-200',
  
  // Mobile components using CSS variables
  header: 'sticky top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border px-6 py-4 flex items-center justify-between min-h-[72px]',
  headerTitle: 'text-xl md:text-2xl font-bold text-foreground truncate mr-4 mb-0',
  navigator: 'sticky bottom-0 left-0 right-0 bg-background/95 backdrop-blur-md border-t border-border flex flex-row justify-around py-2 z-50 w-full shadow-2xl',
  navItem: 'flex flex-col items-center justify-center py-2 px-3 text-xs font-medium text-muted-foreground hover:text-primary active:text-primary/80 transition-all duration-200 rounded-[--radius] hover:bg-accent min-w-[60px]',
  navItemIcon: 'mb-1 text-lg',
  navItemLabel: 'text-xs font-medium',
  drawerItem: 'flex items-center w-full px-4 py-3 text-left text-foreground rounded-[--radius] mx-2 my-1 hover:bg-accent',
  drawerItemIcon: 'mr-3 text-lg flex-shrink-0',
  drawerItemLabel: 'font-medium',

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
