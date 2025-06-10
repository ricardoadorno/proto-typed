import { AstNode } from '../../../types/astNode';
import { elementStyles } from './styles';

/**
 * Render row element
 */
export function renderRow(node: AstNode, context?: string, nodeRenderer?: (node: AstNode, context?: string) => string): string {
  const rowElements = node.elements && nodeRenderer ? 
    node.elements.flat().map(element => nodeRenderer(element, context)).join('\n') : '';
  return `<div class="${elementStyles.row}">${rowElements}</div>`;
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
 * Render card element
 */
export function renderCard(node: AstNode, context?: string, nodeRenderer?: (node: AstNode, context?: string) => string): string {
  const cardElements = node.elements && nodeRenderer ? 
    node.elements.flat().map(element => nodeRenderer(element, context)).join('\n') : '';
  return `<article class="${elementStyles.card}">${cardElements}</article>`;
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
