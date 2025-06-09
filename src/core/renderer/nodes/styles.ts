/**
 * Central styles management for renderer components
 * Separates styling logic from rendering logic
 */

// Basic element styles optimized for dark mode only
export const elementStyles = {
  // Button - simplified without variants
  button: 'inline-flex items-center justify-center px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200',
  
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
  complexListItem: 'flex items-center justify-between p-4 bg-gray-800 border border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200',
    // Mobile components
  header: 'header fixed top-0 left-0 right-0 z-50 bg-gray-800 shadow-sm border-gray-700 px-4 py-3 flex items-center justify-between',
  bottomNav: 'bottom bottom-nav bg-gray-800 border-t border-gray-700 flex flex-row justify-around py-1 z-50',
  navItem: 'flex flex-col items-center justify-center py-2 px-1 text-xs font-medium text-gray-400 hover:text-blue-500 transition-colors duration-200',
  drawerItem: 'flex items-center w-full px-4 py-3 text-left text-gray-300 hover:bg-gray-700 transition-colors duration-200',
    // FAB
  fab: 'w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold',
  fabItem: 'flex items-center',
  fabItemBtn: 'w-10 h-10 rounded-full flex items-center justify-center text-sm transition-all duration-200 transform hover:scale-110',
  fabItemLabel: 'ml-2 text-sm font-medium',
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
