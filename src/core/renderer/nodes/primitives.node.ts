import { AstNode } from '../../../types/ast-node';
import { elementStyles, getButtonClasses, getButtonInlineStyles, getHeadingInlineStyles, getParagraphInlineStyles, getLinkInlineStyles } from './styles/styles';
import { isLucideIcon, getLucideSvg, renderTextWithIcons } from '../../../utils/icon-utils';
import { NavigationMediator } from '../infrastructure/navigation-mediator';

/**
 * Render button element
 */
export function renderButton(node: AstNode): string {
  const buttonProps = node.props as any;
  const { text, action, variant, icon, size } = buttonProps || {};
  const buttonText = text || '';
  
  const buttonNavAttrs = NavigationMediator.generateNavigationAttributes(action);
  const buttonClasses = `${getButtonClasses(variant, size)}`;
  const buttonInlineStyles = getButtonInlineStyles(variant || 'primary');
  
  // Strategy 1: Explicit icon prop (legacy support)
  if (icon) {
    if (isLucideIcon(icon)) {
      const iconSvg = getLucideSvg(icon);
      return `<button class="${buttonClasses}" style="${buttonInlineStyles}" ${buttonNavAttrs}>${iconSvg}${buttonText ? ' ' + buttonText : ''}</button>`;
    }
  }
  
  // Strategy 2: Use the global renderTextWithIcons utility
  // This handles any combination:
  // - "i-home" -> icon only
  // - "i-home Dashboard" -> icon + text
  // - "Click i-plus here" -> text + icon + text
  const renderedContent = renderTextWithIcons(buttonText);
  
  return `<button class="${buttonClasses}" style="${buttonInlineStyles}" ${buttonNavAttrs}>${renderedContent}</button>`;
}

/**
 * Render link element
 */
export function renderLink(node: AstNode): string {
  const props = node.props as any;
  const destination = props?.destination || '#';
  const linkText = props?.text || '';

  const linkNavAttrs = NavigationMediator.generateNavigationAttributes(destination);
  const linkHref = NavigationMediator.generateHrefAttribute(destination);

  // Support inline icons in link text
  const renderedContent = renderTextWithIcons(linkText);

  return `<a class="${elementStyles.link}" style="${getLinkInlineStyles()}" ${linkHref} ${linkNavAttrs}>${renderedContent}</a>`;
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
export function renderHeading(node: AstNode): string {
  const props = node.props as any;
  const level = props?.level || 1;
  const content = props?.content || '';
  
  // Use header-specific styles when in header context
  const headingStyles = elementStyles.heading[level as keyof typeof elementStyles.heading] || elementStyles.heading[1];
  
  // Support inline icons in heading text
  const renderedContent = renderTextWithIcons(content);
  
  return `<h${level} class="${headingStyles}" style="${getHeadingInlineStyles()}">${renderedContent}</h${level}>`;
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
  const inlineStyles = getParagraphInlineStyles(effectiveVariant);
  const content = props?.content || '';
  
  // Support inline icons in text content
  const renderedContent = renderTextWithIcons(content);
  
  return `<span class="${textClasses}" style="${inlineStyles}">${renderedContent}</span>`;
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
  const inlineStyles = getParagraphInlineStyles(effectiveVariant);
  const content = props?.content || '';
  
  // Support inline icons in paragraph content
  const renderedContent = renderTextWithIcons(content);
  
  return `<p class="${paragraphClasses}" style="${inlineStyles}">${renderedContent}</p>`;
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
  const inlineStyles = getParagraphInlineStyles(effectiveVariant);
  const content = props?.content || '';
  
  // Support inline icons in muted text content
  const renderedContent = renderTextWithIcons(content);
  
  return `<span class="${mutedClasses}" style="${inlineStyles}">${renderedContent}</span>`;
}