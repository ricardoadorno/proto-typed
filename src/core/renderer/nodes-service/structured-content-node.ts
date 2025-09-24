import { AstNode } from '../../../types/astNode';
import { elementStyles, getButtonClasses } from './styles';
import { generateNavigationAttributes } from '../navigation-service';
import { isLucideIcon, getLucideSvg } from '../../../utils/icon-utils';

/**
 * Render ordered list element
 */
export function renderOrderedList(node: AstNode): string {
  const props = node.props as any;
  const olItems = (props?.items || [])
    .map((item: string) => `<li class="${elementStyles.listItem}">${item}</li>`)
    .join('\n');
  return `<ol class="${elementStyles.orderedList}">${olItems}</ol>`;
}

/**
 * Render unordered list element
 */
export function renderUnorderedList(node: AstNode): string {
  const props = node.props as any;
  const ulItems = (props?.items || [])
    .map((item: any) => {
      // Handle object items with text property
      if (typeof item === 'object' && item.text) {
        return `<li class="${elementStyles.listItem}">${item.text}</li>`;
      }
      // Handle string items (fallback)
      return `<li class="${elementStyles.listItem}">${item}</li>`;
    })
    .join('\n');
  return `<ul class="${elementStyles.unorderedList}">${ulItems}</ul>`;
}

/**
 * Render list element
 */
export function renderList(node: AstNode, context?: string, nodeRenderer?: (node: AstNode, context?: string) => string): string {
  const listItems = node.elements && nodeRenderer ? 
    node.elements.flat().map(item => nodeRenderer(item, context)).join('\n') : '';
  return `<div class="space-y-3">${listItems}</div>`;
}

/**
 * Render list item element
 */
export function renderListItem(node: AstNode): string {
  const props = node.props as any;
  const { text } = props || {};
  
  return `
    <div class="${elementStyles.simpleListItem}">
      <span class="text-gray-700 dark:text-gray-300">${text || ''}</span>
    </div>  `;
}

/**
 * Render advanced list item element with flexible syntax
 * Supports: - [optional_link_text](optional_link)text{subtitle}[btn](action)@[variant][btn](action)
 * 
 * Examples that this handles:
 * - [Star](star)Important Task{Complete Project}[Mark Complete](complete)
 * - [Project](ProjectPage)Bug Report{Fix Login Issue}@=[Close](close)@_[Comment](comment)
 * - Simple text item (falls back to UnorderedListItem)
 * - Just some text with @+[Button](action)
 * - [Link Only](destination)
 * - Text only with no special features
 * - {Just a subtitle}
 * - Multiple buttons[Save](save)@![Cancel](cancel)@=[Delete](delete)
 * - Task with variants@_[Ghost](ghost)@+[Outline](outline)@-[Secondary](secondary)
 */
export function renderAdvancedListItem(node: AstNode): string {
  const props = node.props as any;
  const { initialLink, linkText, subtitle, buttons, textSegments } = props || {};

  // Determine the main content to display
  let mainContent = '';
  let isClickableItem = false;

  // Priority for main content:
  // 1. If there are text segments (free text), use those
  // 2. If there's linkText but no text segments, use linkText
  // 3. If only subtitle exists, use subtitle
  // 4. Fallback to generic text

  if (textSegments && textSegments.length > 0) {
    mainContent = textSegments.join(' ').trim();
  } else if (linkText) {
    mainContent = linkText;
  } else if (subtitle) {
    mainContent = subtitle;
  } else {
    mainContent = 'List item';
  }

  // Determine if this item should be clickable
  isClickableItem = !!(initialLink && linkText);

  // Build the main content section
  const mainContentHtml = `
    <div class="flex-1">
      <div class="text-gray-100 font-medium text-base">
        ${mainContent}
      </div>
      ${subtitle && mainContent !== subtitle ? `
        <div class="text-gray-400 text-sm mt-1">
          ${subtitle}
        </div>
      ` : ''}
    </div>
  `;
  // Add action buttons
  let buttonsHtml = '';
  if (buttons && buttons.length > 0) {
    buttonsHtml = buttons.map((button: any) => {
      const { text, action, variant = 'default' } = button;
      const buttonNavAttrs = generateNavigationAttributes(action);
      const buttonClasses = getButtonClasses('list', variant);
      
      // Check if the button text is a Lucide icon name
      if (isLucideIcon(text)) {
        const iconSvg = getLucideSvg(text);
        return `
          <button class="${buttonClasses} ml-2" ${buttonNavAttrs}>
            ${iconSvg}
          </button>
        `;
      }
      
      return `
        <button class="${buttonClasses} ml-2" ${buttonNavAttrs}>
          ${text}
        </button>
      `;
    }).join('');
  }
  // Create navigation attributes for the entire item if it should be clickable
  const itemNavAttrs = isClickableItem ? generateNavigationAttributes(initialLink) : '';
  const itemClasses = isClickableItem ? 
    `${elementStyles.simpleListItem} hover:bg-gray-700 transition-colors duration-200` : 
    elementStyles.simpleListItem;

  // Add visual indicator for clickable items
  const clickableIndicator = isClickableItem ? 
    `<span class="text-blue-400 text-xs mr-2">🔗</span>` : '';

  return `
    <div class="${itemClasses}" ${itemNavAttrs}>
      <div class="flex items-center justify-between w-full">
        <div class="flex items-center flex-1">
          ${clickableIndicator}
          ${mainContentHtml}
        </div>
        <div class="flex items-center space-x-2">
          ${buttonsHtml}
        </div>
      </div>
    </div>
  `;
}

/**
 * Render header element
 */
export function renderHeader(node: AstNode, nodeRenderer?: (node: AstNode, context?: string) => string): string {
  if (!node.elements || !nodeRenderer) {
    return `<header class="${elementStyles.header}"></header>`;
  }
  
  // Render all content elements inside the header
  const content = node.elements.flat()
    .map(element => nodeRenderer(element, 'header'))
    .join('');
  
  return `<header class="${elementStyles.header}">${content}</header>`;
}

/**
 * Render card element
 */
export function renderCard(node: AstNode, context?: string, nodeRenderer?: (node: AstNode, context?: string) => string): string {
  const cardElements = node.elements && nodeRenderer ? 
    node.elements.flat().map(element => nodeRenderer(element, context)).join('\n') : '';
  return `<article class="${elementStyles.card}">${cardElements}</article>`;
}