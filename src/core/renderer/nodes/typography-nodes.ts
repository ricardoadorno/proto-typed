import { AstNode } from '../../../types/astNode';
import { elementStyles } from './styles';

/**
 * Render heading element
 */
export function renderHeading(node: AstNode): string {
  const props = node.props as any;
  const level = props?.level || 1;
  const headingClasses = elementStyles.heading[level as keyof typeof elementStyles.heading] || elementStyles.heading[1];
  
  return `<h${level} class="${headingClasses}">${props?.children || ''}</h${level}>`;
}

/**
 * Render paragraph element
 */
export function renderParagraph(node: AstNode): string {
  const props = node.props as any;
  const rawVariant = props?.variant;
  const effectiveVariant = 
    typeof rawVariant === 'string' && (rawVariant in elementStyles.paragraph) 
    ? rawVariant as keyof typeof elementStyles.paragraph
    : 'default';
  
  const paragraphClasses = elementStyles.paragraph[effectiveVariant];
  
  return `<p class="${paragraphClasses}">${props?.children || ''}</p>`;
}
