/**
 * Navigation Analysis
 * Analyze navigation targets to determine their type and validity
 */

/**
 * Navigation target analysis result
 */
export interface NavigationTarget {
  type: 'internal' | 'external' | 'action' | 'toggle' | 'back';
  value: string;
  isValid: boolean;
}

/**
 * Analyze a navigation target to determine its type
 */
export function analyzeNavigationTarget(target: string | undefined): NavigationTarget {
  if (!target || target.trim() === '') {
    return { type: 'internal', value: '', isValid: false };
  }
  const trimmedTarget = target.trim();

  // Check for back navigation
  if (trimmedTarget === '-1') {
    return { type: 'back', value: trimmedTarget, isValid: true };
  }

  // Check for toggle actions (drawer, modal, etc.)
  if (trimmedTarget.match(/^toggle\w*\(\)$/) || trimmedTarget.match(/^toggle-\w+$/)) {
    return { type: 'toggle', value: trimmedTarget, isValid: true };
  }

  // Check if it's an external URL
  if (trimmedTarget.includes('://') || trimmedTarget.startsWith('mailto:')) {
    return { type: 'external', value: trimmedTarget, isValid: true };
  }

  // Check if it's a JavaScript action (contains parentheses or dots)
  if (trimmedTarget.includes('(') || trimmedTarget.includes('.')) {
    return { type: 'action', value: trimmedTarget, isValid: true };
  }

  // Otherwise, it's an internal screen navigation
  return { type: 'internal', value: trimmedTarget, isValid: true };
}