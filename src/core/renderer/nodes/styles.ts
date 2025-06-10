/**
 * Central styles management for renderer components
 * Separates styling logic from rendering logic
 */

// Basic element styles optimized for dark mode only
export const elementStyles = {
  // Button variants
  button: 'inline-flex items-center justify-center px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200',
  buttonGhost: 'inline-flex items-center justify-center px-4 py-2 rounded-lg bg-transparent hover:bg-gray-800 text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors duration-200',
  buttonOutline: 'inline-flex items-center justify-center px-4 py-2 rounded-lg bg-transparent border border-gray-600 hover:bg-gray-700 text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors duration-200',
  buttonSecondary: 'inline-flex items-center justify-center px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 text-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors duration-200',
  buttonDestructive: 'inline-flex items-center justify-center px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors duration-200',
  buttonWarning: 'inline-flex items-center justify-center px-4 py-2 rounded-lg bg-yellow-600 hover:bg-yellow-700 text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-colors duration-200',
  
  // Form elements
  input: 'w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 bg-gray-700 text-white',
  label: 'block text-sm font-medium text-gray-300 mb-2',
  select: 'w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 bg-gray-700 text-white',
  checkbox: 'w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-600 ring-offset-gray-800 focus:ring-2',
  radio: 'w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 focus:ring-blue-600 ring-offset-gray-800 focus:ring-2',
    // Typography
  heading: {
    1: 'text-4xl font-bold text-white mb-6',
    2: 'text-3xl font-bold text-white mb-5',
    3: 'text-2xl font-bold text-white mb-4',
    4: 'text-xl font-bold text-white mb-3',
    5: 'text-lg font-bold text-white mb-2',
    6: 'text-base font-bold text-white mb-2'
  },
  
  paragraph: {
    default: 'text-gray-300 mb-4 leading-relaxed',
    note: 'text-sm text-gray-400 mb-3 italic',
    quote: 'border-l-4 border-blue-500 pl-4 text-gray-400 italic mb-4'
  },
  
  link: 'text-blue-400 hover:text-blue-300 underline transition-colors duration-200',
    // Layout components
  container: 'container mx-auto px-4',
  card: 'bg-gray-800 rounded-xl border border-gray-700 shadow-lg p-6 mb-6',
  row: 'flex flex-wrap gap-4 mb-4',
  col: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
  
  // Lists
  orderedList: 'list-decimal list-inside space-y-2 mb-4 text-gray-300',
  unorderedList: 'list-disc list-inside space-y-2 mb-4 text-gray-300',
  listItem: 'mb-2',
  
  // Complex list items
  simpleListItem: 'flex justify-between items-center p-3 bg-gray-800 border border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200',
  complexListItem: 'flex items-center justify-between p-4 bg-gray-800 border border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200',  // Mobile components
  header: 'sticky top-0 left-0 right-0 z-50 bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 backdrop-blur-md bg-opacity-95 shadow-xl border-b border-gray-700/50 px-6 py-4 flex items-center justify-between min-h-[72px]',
  headerTitle: 'text-xl md:text-2xl font-bold text-white truncate mr-4 mb-0',
  headerActions: 'flex items-center gap-3',
  headerButton: 'px-3 py-2 rounded-lg bg-gray-700/70 hover:bg-gray-600/80 text-gray-200 hover:text-white transition-all duration-200 border border-gray-600/50 hover:border-gray-500 shadow-md hover:shadow-lg transform hover:scale-105',
  headerIcon: 'w-5 h-5 mr-2',
  headerBrand: 'flex items-center gap-3',
  headerLogo: 'w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg',
  bottomNav: 'sticky bottom-0 left-0 right-0 bg-gray-800/95 backdrop-blur-md border-t border-gray-700/50 flex flex-row justify-around py-2 z-50 w-full shadow-2xl',
  navItem: 'flex flex-col items-center justify-center py-2 px-3 text-xs font-medium text-gray-400 hover:text-blue-400 active:text-blue-500 transition-all duration-200 rounded-lg hover:bg-gray-700/50 min-w-[60px]',
  navItemIcon: 'mb-1 text-lg',
  navItemLabel: 'text-xs font-medium',
  drawerItem: 'flex items-center w-full px-4 py-3 text-left text-gray-300 hover:bg-gray-700/70 transition-all duration-200 rounded-lg mx-2 my-1',
  drawerItemIcon: 'mr-3 text-lg flex-shrink-0',
  drawerItemLabel: 'font-medium',  // FAB
  fab: 'sticky bottom-25  w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-2xl hover:shadow-blue-500/25 flex items-center justify-center text-xl font-bold text-white transition-all duration-300 transform hover:scale-110 z-40 ml-auto mt-auto',
  fabContainer: 'sticky   right-6 z-40 flex flex-col items-end',
  fabItemsList: 'mb-8 space-y-6 opacity-0 transform translate-y-4 transition-all duration-300 pointer-events-none',
  fabItem: 'flex items-center justify-end',
  fabItemBtn: 'w-12 h-12 mb-3 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center text-lg text-white transition-all duration-200 transform hover:scale-110 shadow-lg hover:shadow-xl',
  fabItemLabel: 'mr-3 bg-gray-800 text-white px-3 py-1 rounded-lg text-sm font-medium shadow-lg whitespace-nowrap',
    // Modal and drawer
  modalBackdrop: 'modal-backdrop fixed inset-0 bg-black/60 flex items-center justify-center z-50',
  modalContent: 'modal-content bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 p-6 relative',
  modalClose: 'modal-close absolute top-4 right-4 text-gray-400 hover:text-gray-200 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-700 transition-colors',
  drawer: 'drawer fixed top-0 left-0 z-40 w-64 h-screen bg-gray-800 border-r border-gray-700 shadow-lg transform -translate-x-full transition-transform duration-300 ease-in-out',
  
  // Utility
  separator: 'my-6 border-gray-700',
  image: 'max-w-full h-auto rounded-lg shadow-md'
} as const;

/**
 * Get margin classes based on context
 */
export function getMarginClasses(context?: string): string {
  return context === 'header' ? '' : 'mr-4 mb-4';
}

/**
 * Get button classes based on context and variant
 */
export function getButtonClasses(context?: string, variant?: string): string {
  if (context === 'header') {
    return elementStyles.headerButton;
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
