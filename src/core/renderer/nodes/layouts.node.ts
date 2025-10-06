import { AstNode } from '../../../types/ast-node';
import { elementStyles } from './styles/styles';

/**
 * Get base layout classes with override support
 */
function getLayoutClasses(elementType: keyof typeof elementStyles, modifiers: any): string {
  let baseClasses = elementStyles[elementType] as string;
  
  // Simple override logic: if custom modifiers are present, remove conflicting defaults
  if (modifiers) {
    // Remove default gap if custom gap is specified
    if (modifiers.gap) {
      baseClasses = baseClasses.replace(/gap-\d+/g, '').replace(/sm:gap-\d+/g, '');
    }
    
    // Remove default grid-cols if custom columns are specified
    if (modifiers.columns) {
      baseClasses = baseClasses.replace(/grid-cols-\d+/g, '').replace(/sm:grid-cols-\d+/g, '').replace(/lg:grid-cols-\d+/g, '');
    }
    
    // Remove default padding if custom padding is specified
    if (modifiers.padding || modifiers.paddingX || modifiers.paddingY) {
      baseClasses = baseClasses.replace(/p-\d+/g, '').replace(/px-\d+/g, '').replace(/py-\d+/g, '')
                              .replace(/sm:p-\d+/g, '').replace(/sm:px-\d+/g, '').replace(/sm:py-\d+/g, '');
    }
    
    // Remove default margin if custom margin is specified
    if (modifiers.margin || modifiers.marginX || modifiers.marginY) {
      baseClasses = baseClasses.replace(/m-\d+/g, '').replace(/mx-\d+/g, '').replace(/my-\d+/g, '')
                              .replace(/sm:m-\d+/g, '').replace(/sm:mx-\d+/g, '').replace(/sm:my-\d+/g, '');
    }
  }
  
  // Clean up extra spaces
  return baseClasses.replace(/\s+/g, ' ').trim();
}

/**
 * Convert layout modifiers to CSS classes
 */
export function buildModifierClasses(modifiers: any): string {
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
  if (modifiers.justifyContent) {
    const justifyValue = modifiers.justifyContent;
    switch (justifyValue) {
      case 'start': classes.push('justify-start'); break;
      case 'end': classes.push('justify-end'); break;
      case 'center': classes.push('justify-center'); break;
      case 'between': classes.push('justify-between'); break;
      case 'around': classes.push('justify-around'); break;
      case 'evenly': classes.push('justify-evenly'); break;
    }
  }
  
  // Align items (cross axis)
  if (modifiers.alignItems) {
    const alignValue = modifiers.alignItems;
    switch (alignValue) {
      case 'start': classes.push('items-start'); break;
      case 'end': classes.push('items-end'); break;
      case 'center': classes.push('items-center'); break;
      case 'stretch': classes.push('items-stretch'); break;
      case 'baseline': classes.push('items-baseline'); break;
    }
  }
  
  // Legacy support for separate justify/align properties
  if (modifiers.justify && !modifiers.justifyContent) {
    const justifyValue = modifiers.justify;
    switch (justifyValue) {
      case 'start': classes.push('justify-start'); break;
      case 'end': classes.push('justify-end'); break;
      case 'center': classes.push('justify-center'); break;
      case 'between': classes.push('justify-between'); break;
      case 'around': classes.push('justify-around'); break;
      case 'evenly': classes.push('justify-evenly'); break;
    }
  }
  
  if (modifiers.align && !modifiers.alignItems) {
    const alignValue = modifiers.align;
    switch (alignValue) {
      case 'start': classes.push('items-start'); break;
      case 'end': classes.push('items-end'); break;
      case 'center': classes.push('items-center'); break;
      case 'stretch': classes.push('items-stretch'); break;
      case 'baseline': classes.push('items-baseline'); break;
    }
  }

  // Gap (for grid and flex containers)
  if (modifiers.gap) {
    classes.push(`gap-${modifiers.gap}`);
  }

  // Grid columns
  if (modifiers.columns) {
    classes.push(`grid-cols-${modifiers.columns}`);
  }

  // Padding modifiers
  if (modifiers.padding) {
    classes.push(`p-${modifiers.padding}`);
  }
  if (modifiers.paddingX) {
    classes.push(`px-${modifiers.paddingX}`);
  }
  if (modifiers.paddingY) {
    classes.push(`py-${modifiers.paddingY}`);
  }

  // Margin modifiers
  if (modifiers.margin) {
    classes.push(`m-${modifiers.margin}`);
  }
  if (modifiers.marginX) {
    classes.push(`mx-${modifiers.marginX}`);
  }
  if (modifiers.marginY) {
    classes.push(`my-${modifiers.marginY}`);
  }

  return classes.join(' ');
}

/**
 * Render row element (horizontal flex container)
 */
export function renderRow(node: AstNode, context?: string, nodeRenderer?: (node: AstNode, context?: string) => string): string {
  const baseClasses = getLayoutClasses('row', node.props);
  const modifierClasses = buildModifierClasses(node.props);
  const rowElements = node.children && nodeRenderer ? 
    node.children.map(child => nodeRenderer(child, context)).join('\n') : '';
  
  return `<div class="${baseClasses} ${modifierClasses}">${rowElements}</div>`;
}

/**
 * Render col element (vertical flex container)
 */
export function renderCol(node: AstNode, context?: string, nodeRenderer?: (node: AstNode, context?: string) => string): string {
  const baseClasses = getLayoutClasses('col', node.props);
  const modifierClasses = buildModifierClasses(node.props);
  const colElements = node.children && nodeRenderer ? 
    node.children.map(child => nodeRenderer(child, context)).join('\n') : '';
  
  return `<div class="${baseClasses} ${modifierClasses}">${colElements}</div>`;
}

/**
 * Render grid element
 */
export function renderGrid(node: AstNode, context?: string, nodeRenderer?: (node: AstNode, context?: string) => string): string {
  const baseClasses = getLayoutClasses('grid', node.props);
  const modifierClasses = buildModifierClasses(node.props);
  const gridElements = node.children && nodeRenderer ? 
    node.children.map(child => nodeRenderer(child, context)).join('\n') : '';
  
  return `<div class="${baseClasses} ${modifierClasses}">${gridElements}</div>`;
}

/**
 * Render container element
 */
export function renderContainer(node: AstNode, context?: string, nodeRenderer?: (node: AstNode, context?: string) => string): string {
  const baseClasses = getLayoutClasses('container', node.props);
  const modifierClasses = buildModifierClasses(node.props);
  const containerElements = node.children && nodeRenderer ? 
    node.children.map(child => nodeRenderer(child, context)).join('\n') : '';
  
  return `<div class="${baseClasses} ${modifierClasses}">${containerElements}</div>`;
}

/**
 * Render separator element
 */
export function renderSeparator(): string {
  return `<hr class="${elementStyles.separator}" />`;
}