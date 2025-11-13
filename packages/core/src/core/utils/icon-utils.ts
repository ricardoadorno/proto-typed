/**
 * Icon utilities for Proto-Typed
 */

/**
 * Get Lucide icon name from text
 */
export function getIconName(text: string): string {
  // Remove common prefixes
  const cleaned = text.replace(/^(icon-|lucide-)/i, '')

  // Convert to PascalCase for Lucide
  return cleaned
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('')
}

/**
 * Check if a string is a valid icon name
 */
export function isValidIconName(name: string): boolean {
  return name.length > 0 && /^[a-z0-9-]+$/i.test(name)
}

/**
 * Check if text is a Lucide icon reference
 */
export function isLucideIcon(text: string): boolean {
  return text.startsWith('icon:') || text.startsWith('lucide:')
}

/**
 * Get Lucide SVG markup (placeholder - actual implementation would fetch from Lucide)
 */
export function getLucideSvg(iconName: string): string {
  // This is a placeholder - in real implementation, this would return actual Lucide SVG
  const name = getIconName(iconName)
  return `<svg class="lucide lucide-${name.toLowerCase()}" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/></svg>`
}

/**
 * Render text with icon support (placeholder)
 */
export function renderTextWithIcons(text: string): string {
  // Simple implementation - just returns text as-is
  // Real implementation would parse and replace icon references
  return text
}
