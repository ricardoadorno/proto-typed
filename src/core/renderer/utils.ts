/**
 * Escape HTML special characters
 */
export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Convert object attributes to HTML attribute string
 */
export function attributesToHtml(props: Record<string, any>): string {
  if (!props) return '';
  
  return Object.entries(props)
    .filter(([key]) => key !== 'children') // Skip the children prop
    .map(([key, value]) => {
      if (typeof value === 'boolean') {
        return value ? key : '';
      }
      
      if (typeof value === 'string') {
        return `${key}="${escapeHtml(value)}"`;
      }
      
      if (typeof value === 'number') {
        return `${key}="${value}"`;
      }
      
      return '';
    })
    .filter(Boolean)
    .join(' ');
}