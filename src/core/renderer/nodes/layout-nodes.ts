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
  
  // Padding
  if (modifiers.padding) {
    classes.push(`p-${modifiers.padding}`);
  }
  if (modifiers.paddingX) {
    classes.push(`px-${modifiers.paddingX}`);
  }
  if (modifiers.paddingY) {
    classes.push(`py-${modifiers.paddingY}`);
  }
  if (modifiers.paddingLeft) {
    classes.push(`pl-${modifiers.paddingLeft}`);
  }
  if (modifiers.paddingRight) {
    classes.push(`pr-${modifiers.paddingRight}`);
  }
  if (modifiers.paddingTop) {
    classes.push(`pt-${modifiers.paddingTop}`);
  }
  if (modifiers.paddingBottom) {
    classes.push(`pb-${modifiers.paddingBottom}`);
  }
  
  // Margin
  if (modifiers.margin) {
    classes.push(`m-${modifiers.margin}`);
  }
  if (modifiers.marginX) {
    classes.push(`mx-${modifiers.marginX}`);
  }
  if (modifiers.marginY) {
    classes.push(`my-${modifiers.marginY}`);
  }
  if (modifiers.marginLeft) {
    classes.push(`ml-${modifiers.marginLeft}`);
  }
  if (modifiers.marginRight) {
    classes.push(`mr-${modifiers.marginRight}`);
  }
  if (modifiers.marginTop) {
    classes.push(`mt-${modifiers.marginTop}`);
  }
  if (modifiers.marginBottom) {
    classes.push(`mb-${modifiers.marginBottom}`);
  }
  
  // Gap
  if (modifiers.gap) {
    classes.push(`gap-${modifiers.gap}`);
  }
  
  // Grid columns
  if (modifiers.gridCols) {
    classes.push(`grid-cols-${modifiers.gridCols}`);
  }
  
  return classes.join(' ');
}

/**
 * Render row element
 */
export function renderRow(node: AstNode, context?: string, nodeRenderer?: (node: AstNode, context?: string) => string): string {
  const modifierClasses = buildModifierClasses(node.modifiers);
  const baseClasses = elementStyles.row;
  const allClasses = modifierClasses ? `${baseClasses} ${modifierClasses}` : baseClasses;
  
  const rowElements = node.elements && nodeRenderer ? 
    node.elements.flat().map(element => nodeRenderer(element, context)).join('\n') : '';
  return `<div class="${allClasses}">${rowElements}</div>`;
}

/**
 * Render container element
 */
export function renderContainer(node: AstNode, context?: string, nodeRenderer?: (node: AstNode, context?: string) => string): string {
  const modifierClasses = buildModifierClasses(node.modifiers);
  const baseClasses = elementStyles.container;
  const allClasses = modifierClasses ? `${baseClasses} ${modifierClasses}` : baseClasses;
  
  const children = node.elements && nodeRenderer ?
    node.elements.flat().map(element => nodeRenderer(element, context)).join('\n') : '';
  return `<div class="${allClasses}">${children}</div>`;
}

/**
 * Render col element
 */
export function renderCol(node: AstNode, context?: string, nodeRenderer?: (node: AstNode, context?: string) => string): string {
  const modifierClasses = buildModifierClasses(node.modifiers);
  const baseClasses = elementStyles.col;
  const allClasses = modifierClasses ? `${baseClasses} ${modifierClasses}` : baseClasses;
  
  const colElements = node.elements && nodeRenderer ? 
    node.elements.flat().map(element => nodeRenderer(element, context)).join('\n') : '';
  return `<div class="${allClasses}">${colElements}</div>`;
}

/**
 * Render grid element
 */
export function renderGrid(node: AstNode, context?: string, nodeRenderer?: (node: AstNode, context?: string) => string): string {
  const modifierClasses = buildModifierClasses(node.modifiers);
  const baseClasses = elementStyles.grid;
  const allClasses = modifierClasses ? `${baseClasses} ${modifierClasses}` : baseClasses;
  
  const children = node.elements && nodeRenderer ?
    node.elements.flat().map(element => nodeRenderer(element, context)).join('\n') : '';
  return `<div class="${allClasses}">${children}</div>`;
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
