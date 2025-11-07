import { AstNode } from '../../../types/ast-node';
import { ImportManager } from '../infrastructure/import-manager';

type RedeemNodeFn = (node: AstNode, depth: number) => string;

/**
 * Convert Layout AST node to appropriate container div
 */
export function redeemLayout(node: AstNode, depth: number, redeemNode: RedeemNodeFn): string {
  const props = node.props as any;
  const { layoutType } = props;

  const classes: string[] = [];

  // Map layout types to Tailwind classes
  switch (layoutType) {
    case 'container':
      classes.push('container mx-auto px-4');
      break;
    case 'container-narrow':
      classes.push('container mx-auto max-w-3xl px-4');
      break;
    case 'container-wide':
      classes.push('container mx-auto max-w-7xl px-4');
      break;
    case 'stack':
      classes.push('flex flex-col gap-4');
      break;
    case 'stack-tight':
      classes.push('flex flex-col gap-2');
      break;
    case 'stack-loose':
      classes.push('flex flex-col gap-8');
      break;
    case 'row-start':
      classes.push('flex flex-row items-center gap-4');
      break;
    case 'row-center':
      classes.push('flex flex-row items-center justify-center gap-4');
      break;
    case 'row-between':
      classes.push('flex flex-row items-center justify-between gap-4');
      break;
    case 'grid-2':
      classes.push('grid grid-cols-1 md:grid-cols-2 gap-4');
      break;
    case 'grid-3':
      classes.push('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4');
      break;
    case 'grid-4':
      classes.push('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4');
      break;
    case 'card':
      classes.push('rounded-lg border bg-card text-card-foreground shadow-sm p-6');
      break;
    case 'header':
      classes.push('flex items-center justify-between border-b bg-background px-4 py-3');
      break;
    case 'sidebar':
      classes.push('w-64 border-r bg-background p-4');
      break;
    default:
      classes.push('flex flex-col gap-4');
  }

  const className = classes.join(' ');
  const children = node.children.map(child => redeemNode(child, depth + 1)).join('\n');

  return `<div className="${className}">
${children}
</div>`;
}

/**
 * Convert List AST node to appropriate list element
 */
export function redeemList(node: AstNode, depth: number, redeemNode: RedeemNodeFn): string {
  const children = node.children.map(child => {
    if (child.type === 'UnorderedListItem') {
      const itemContent = child.children.map(c => redeemNode(c, depth + 2)).join(' ');
      return `  <li className="py-2">${itemContent}</li>`;
    }
    return redeemNode(child, depth + 1);
  }).join('\n');

  return `<ul className="space-y-2">
${children}
</ul>`;
}

/**
 * Convert Separator AST node to shadcn Separator
 */
export function redeemSeparator(node: AstNode, importManager: ImportManager): string {
  importManager.addShadcnComponent('Separator');
  return `<Separator />`;
}

/**
 * Convert Navigator AST node to navigation menu
 */
export function redeemNavigator(node: AstNode, depth: number, redeemNode: RedeemNodeFn): string {
  const children = node.children.map(child => redeemNode(child, depth + 1)).join('\n');

  return `<nav className="flex gap-4 border-b px-4 py-2">
${children}
</nav>`;
}
