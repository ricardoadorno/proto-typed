/**
 * Convert text to URL-friendly slug
 */

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Extract plain text from React children or HTML
 */
export function extractText(content: any): string {
  if (typeof content === 'string') {
    return content;
  }
  if (Array.isArray(content)) {
    return content.map(extractText).join('');
  }
  if (content?.props?.children) {
    return extractText(content.props.children);
  }
  return '';
}
