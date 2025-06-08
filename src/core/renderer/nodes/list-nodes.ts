import { AstNode } from '../../../types/astNode';
import { elementStyles } from './styles';

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
    .map((item: string) => `<li class="${elementStyles.listItem}">${item}</li>`)
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
    </div>
  `;
}

/**
 * Render complex list item element
 */
export function renderComplexListItem(node: AstNode): string {
  const props = node.props as any;
  const { leadingImage, mainText, subText, trailingImage } = props || {};
  
  return `
    <div class="${elementStyles.complexListItem}">
      <img src="${leadingImage || ''}" alt="Leading image" class="w-10 h-10 object-cover rounded-full" />
      <div class="flex-1 mx-4">
        <div class="text-gray-900 dark:text-white font-medium">${mainText || ''}</div>
        <div class="text-sm text-gray-500 dark:text-gray-400">${subText || ''}</div>
      </div>
      <img src="${trailingImage || ''}" alt="Trailing image" class="w-8 h-8 object-cover rounded" />
    </div>
  `;
}
