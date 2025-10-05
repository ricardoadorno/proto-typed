import { AstNode } from '../../../types/ast-node';
import { elementStyles } from './styles/styles';

/**
 * Convert layout modifiers to CSS classes
 */
function buildModifierClasses(modifiers: any): string {
  if (!modifiers) return '';
  
  const classes: string[] = [];
  
  // Width
  if (modifiers.width) {
    if (modifiers.width === 'full') {
      classes.push('w-full');
    } else if (modifiers.width === 'auto') {
      classes.push('w-auto');
    } else {
      classes.push(`w-[${modifiers.width}%]`);
    }
  }
  
  // Height
  if (modifiers.height) {
    if (modifiers.height === 'full') {
      classes.push('h-full');
    } else if (modifiers.height === 'auto') {
      classes.push('h-auto');
    } else {
      classes.push(`h-[${modifiers.height}%]`);
    }
  }
  
  // Justify content (main axis)
  if (modifiers.justify) {
    switch (modifiers.justify) {
      case 'start': classes.push('justify-start'); break;
      case 'end': classes.push('justify-end'); break;
      case 'center': classes.push('justify-center'); break;
      case 'between': classes.push('justify-between'); break;
      case 'around': classes.push('justify-around'); break;
      case 'evenly': classes.push('justify-evenly'); break;
    }
  }
  
  // Align items (cross axis)
  if (modifiers.align) {
    switch (modifiers.align) {
      case 'start': classes.push('items-start'); break;
      case 'end': classes.push('items-end'); break;
      case 'center': classes.push('items-center'); break;
      case 'stretch': classes.push('items-stretch'); break;
      case 'baseline': classes.push('items-baseline'); break;
    }
  }
  
  return classes.join(' ');
}

/**
 * Render row element (horizontal flex container)
 */
export function renderRow(node: AstNode, context?: string, nodeRenderer?: (node: AstNode, context?: string) => string): string {
  const modifierClasses = buildModifierClasses(node.props);
  const rowElements = node.children && nodeRenderer ? 
    node.children.map(child => nodeRenderer(child, context)).join('\n') : '';
  
  return `<div class="${elementStyles.row} ${modifierClasses}">${rowElements}</div>`;
}

/**
 * Render col element (vertical flex container)
 */
export function renderCol(node: AstNode, context?: string, nodeRenderer?: (node: AstNode, context?: string) => string): string {
  const modifierClasses = buildModifierClasses(node.props);
  const colElements = node.children && nodeRenderer ? 
    node.children.map(child => nodeRenderer(child, context)).join('\n') : '';
  
  return `<div class="${elementStyles.col} ${modifierClasses}">${colElements}</div>`;
}

/**
 * Render grid element
 */
export function renderGrid(node: AstNode, context?: string, nodeRenderer?: (node: AstNode, context?: string) => string): string {
  const modifierClasses = buildModifierClasses(node.props);
  const gridElements = node.children && nodeRenderer ? 
    node.children.map(child => nodeRenderer(child, context)).join('\n') : '';
  
  return `<div class="${elementStyles.grid} ${modifierClasses}">${gridElements}</div>`;
}

/**
 * Render container element
 */
export function renderContainer(node: AstNode, context?: string, nodeRenderer?: (node: AstNode, context?: string) => string): string {
  const modifierClasses = buildModifierClasses(node.props);
  const containerElements = node.children && nodeRenderer ? 
    node.children.map(child => nodeRenderer(child, context)).join('\n') : '';
  
  return `<div class="${elementStyles.container} ${modifierClasses}">${containerElements}</div>`;
}

/**
 * Render separator element
 */
export function renderSeparator(): string {
  return `<hr class="${elementStyles.separator}" />`;
}