/**
 * Navigation History Management
 * Track navigation history to enable back navigation
 */

let navigationHistory: string[] = [];
let currentScreenIndex = -1;

/**
 * Add a screen to navigation history
 */
export function addToHistory(screenName: string): void {
  // Remove any screens after current position (when navigating after going back)
  navigationHistory = navigationHistory.slice(0, currentScreenIndex + 1);
  
  // Don't add the same screen consecutively
  if (navigationHistory[currentScreenIndex] !== screenName) {
    navigationHistory.push(screenName);
    currentScreenIndex++;
  }
}

/**
 * Navigate back to previous screen
 * Returns the previous screen name or null if no history
 */
export function navigateBack(): string | null {
  if (currentScreenIndex > 0) {
    currentScreenIndex--;
    return navigationHistory[currentScreenIndex];
  }
  return null;
}

/**
 * Get current screen from history
 */
export function getCurrentScreen(): string | null {
  return currentScreenIndex >= 0 ? navigationHistory[currentScreenIndex] : null;
}

/**
 * Get current screen index
 */
export function getCurrentScreenIndex(): number {
  return currentScreenIndex;
}

/**
 * Get full navigation history
 */
export function getNavigationHistory(): string[] {
  return [...navigationHistory];
}

/**
 * Reset navigation history
 */
export function resetNavigationHistory(): void {
  navigationHistory = [];
  currentScreenIndex = -1;
}