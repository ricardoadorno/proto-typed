import { AstNode } from '../../../types/ast-node';
import { elementStyles } from './styles/styles';

/**
 * Render row element
 */
export function renderRow(node: AstNode, context?: string, nodeRenderer?: (node: AstNode, context?: string) => string): string {
  const rowElements = node.elements && nodeRenderer ? 
    node.elements.flat().map(element => nodeRenderer(element, context)).join('\n') : '';
  return `<div class="${elementStyles.row}">${rowElements}</div>`;
}

/**
 * Render container element
 */
export function renderContainer(node: AstNode, context?: string, nodeRenderer?: (node: AstNode, context?: string) => string): string {
  const children = node.elements && nodeRenderer ?
    node.elements.flat().map(element => nodeRenderer(element, context)).join('\n') : '';
  return `<div class="${elementStyles.container}">${children}</div>`;
}

/**
 * Render col element
 */
export function renderCol(node: AstNode, context?: string, nodeRenderer?: (node: AstNode, context?: string) => string): string {
  const colElements = node.elements && nodeRenderer ? 
    node.elements.flat().map(element => nodeRenderer(element, context)).join('\n') : '';
  return `<div class="${elementStyles.col}">${colElements}</div>`;
}

/**
 * Render grid element
 */
export function renderGrid(node: AstNode, context?: string, nodeRenderer?: (node: AstNode, context?: string) => string): string {
  const children = node.elements && nodeRenderer ?
    node.elements.flat().map(element => nodeRenderer(element, context)).join('\n') : '';
  return `<div class="${elementStyles.grid}">${children}</div>`;
}

/**
 * Render separator element
 */
export function renderSeparator(): string {
  return `<hr class="${elementStyles.separator}">`;
}

/**
 * Render empty div element
 */
export function renderEmptyDiv(): string {
  return `<div class="${elementStyles.emptyDiv}"></div>`;
}
