import { AstNode } from '@shared'; //ast-node';
import { elementStyles, getButtonClasses, getButtonInlineStyles, getHeadingInlineStyles, getParagraphInlineStyles, getLinkInlineStyles } from './styles/styles';
import { isLucideIcon, getLucideSvg, renderTextWithIcons } from '@shared'; //icon-utils';
import { NavigationMediator } from '../infrastructure/navigation-mediator';
import { withAssetPath } from '@shared'; //base-path';

/**
 * @function renderButton
 * @description Renders a 'Button' AST node to its HTML representation.
 *
 * @param {AstNode} node - The 'Button' AST node.
 * @returns {string} The HTML string for the button.
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
 * @function renderLink
 * @description Renders a 'Link' AST node to its HTML representation.
 *
 * @param {AstNode} node - The 'Link' AST node.
 * @returns {string} The HTML string for the link.
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
 * @function renderImage
 * @description Renders an 'Image' AST node to its HTML representation.
 *
 * @param {AstNode} node - The 'Image' AST node.
 * @returns {string} The HTML string for the image.
 */
export function renderImage(node: AstNode): string {
  const props = node.props as any;
  const src = props?.src || '';
  const alt = props?.alt || '';
  const resolvedSrc = withAssetPath(src);
  return `<img src="${resolvedSrc}" alt="${alt}" class="${elementStyles.image}" />`;
}

/**
 * @function renderHeading
 * @description Renders a 'Heading' AST node to its HTML representation.
 *
 * @param {AstNode} node - The 'Heading' AST node.
 * @returns {string} The HTML string for the heading.
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
 * @function renderText
 * @description Renders a 'Text' AST node to its HTML representation.
 *
 * @param {AstNode} node - The 'Text' AST node.
 * @returns {string} The HTML string for the text.
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
 * @function renderParagraph
 * @description Renders a 'Paragraph' AST node to its HTML representation.
 *
 * @param {AstNode} node - The 'Paragraph' AST node.
 * @returns {string} The HTML string for the paragraph.
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
 * @function renderMutedText
 * @description Renders a 'MutedText' AST node to its HTML representation.
 *
 * @param {AstNode} node - The 'MutedText' AST node.
 * @returns {string} The HTML string for the muted text.
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
