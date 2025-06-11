/**
 * Navigation Service Types
 * Defines interfaces and types for the navigation system
 */

/**
 * Navigation handler options for click events
 */
export interface NavigationHandlerOptions {
  onInternalNavigate?: (screenName: string) => void;
  onToggle?: (elementName: string) => void;
  onBack?: () => void;
}

export interface NavigationTarget {
  type: 'internal' | 'external' | 'action' | 'toggle' | 'back';
  value: string;
  isValid: boolean;
}

