import { AstNode } from '../../../types/ast-node';
import { elementStyles, getButtonClasses } from './styles/styles';
import { isLucideIcon, getLucideSvg } from '../../../utils/icon-utils';
import { NavigationMediator } from '../infrastructure/navigation-mediator';

/**
 * Render button element
 */
export function renderButton(node: AstNode, context?: string): string {
  const buttonProps = node.props as any;
  const { children, href: buttonHref, variant } = buttonProps || {};
  const buttonText = children || '';
  
  const buttonNavAttrs = NavigationMediator.generateNavigationAttributes(buttonHref);
  const buttonClasses = `${getButtonClasses(context, variant)}`;
    // Check if the button text is a Lucide icon name
  if (isLucideIcon(buttonText)) {
    const iconSvg = getLucideSvg(buttonText);
    return `<button class="${buttonClasses}" ${buttonNavAttrs}>${iconSvg}</button>`;
  }
  
  return `<button class="${buttonClasses}" ${buttonNavAttrs}>${buttonText} </button>`;
}

/**
 * Render link element
 */
export function renderLink(node: AstNode): string {
  const props = node.props as any;
  const href = props?.href || '#';
  const linkText = props?.children || '';

  const linkNavAttrs = NavigationMediator.generateNavigationAttributes(href);
  const linkHref = NavigationMediator.generateHrefAttribute(href);

  return `<a class="${elementStyles.link}" ${linkHref} ${linkNavAttrs}>${linkText}</a>`;
}

/**
 * Render image element
 */
export function renderImage(node: AstNode): string {
  const props = node.props as any;
  const src = props?.src || '';
  const alt = props?.alt || '';
  return `<img src="${src}" alt="${alt}" class="${elementStyles.image}" />`;
}



/**
 * Render heading element
 */
export function renderHeading(node: AstNode, context?: string): string {
  const props = node.props as any;
  const level = props?.level || 1;
  
  // Use header-specific styles when in header context
  const headingStyles = context === 'header' 
    ? elementStyles.headerHeading[level as keyof typeof elementStyles.headerHeading] || elementStyles.headerHeading[1]
    : elementStyles.heading[level as keyof typeof elementStyles.heading] || elementStyles.heading[1];
  
  return `<h${level} class="${headingStyles}">${props?.children || ''}</h${level}>`;
}

/**
 * Render text element (simple text without padding)
 */
export function renderText(node: AstNode): string {
  const props = node.props as any;
  const rawVariant = props?.variant;
  const effectiveVariant = 
    typeof rawVariant === 'string' && (rawVariant in elementStyles.paragraph) 
    ? rawVariant as keyof typeof elementStyles.paragraph
    : 'text';
  
  const textClasses = elementStyles.paragraph[effectiveVariant];
  
  return `<span class="${textClasses}">${props?.children || ''}</span>`;
}

/**
 * Render paragraph element (text with padding bottom)
 */
export function renderParagraph(node: AstNode): string {
  const props = node.props as any;
  const rawVariant = props?.variant;
  const effectiveVariant = 
    typeof rawVariant === 'string' && (rawVariant in elementStyles.paragraph) 
    ? rawVariant as keyof typeof elementStyles.paragraph
    : 'paragraph';
  
  const paragraphClasses = elementStyles.paragraph[effectiveVariant];
  
  return `<p class="${paragraphClasses}">${props?.children || ''}</p>`;
}

/**
 * Render muted text element (gray text without padding)
 */
export function renderMutedText(node: AstNode): string {
  const props = node.props as any;
  const rawVariant = props?.variant;
  const effectiveVariant = 
    typeof rawVariant === 'string' && (rawVariant in elementStyles.paragraph) 
    ? rawVariant as keyof typeof elementStyles.paragraph
    : 'muted';
  
  const mutedClasses = elementStyles.paragraph[effectiveVariant];
  
  return `<span class="${mutedClasses}">${props?.children || ''}</span>`;
}
