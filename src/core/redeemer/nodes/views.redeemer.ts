import { AstNode } from '../../../types/ast-node';
import { ImportManager } from '../infrastructure/import-manager';

type RedeemNodeFn = (node: AstNode, depth: number) => string;

/**
 * Convert Screen AST node to main component structure
 */
export function redeemScreen(node: AstNode, depth: number, redeemNode: RedeemNodeFn): string {
  const props = node.props as any;
  const { name } = props;

  const children = node.children.map(child => redeemNode(child, depth + 1)).join('\n');

  return `<div className="min-h-screen bg-background" data-screen="${name}">
${children}
</div>`;
}

/**
 * Convert Modal AST node to shadcn Dialog component
 */
export function redeemModal(node: AstNode, depth: number, redeemNode: RedeemNodeFn, importManager: ImportManager): string {
  const props = node.props as any;
  const { name } = props;

  // Add Dialog components to imports
  importManager.addShadcnComponent('Dialog');
  importManager.addShadcnComponent('DialogContent');
  importManager.addShadcnComponent('DialogHeader');
  importManager.addShadcnComponent('DialogTitle');
  importManager.addShadcnComponent('DialogDescription');
  importManager.addReactImport('useState');

  const children = node.children.map(child => redeemNode(child, depth + 1)).join('\n');

  // Extract title if first child is a Heading
  let title = name;
  let description = '';
  let content = children;

  if (node.children.length > 0 && node.children[0].type === 'Heading') {
    const headingProps = node.children[0].props as any;
    title = headingProps.content || name;
    content = node.children.slice(1).map(child => redeemNode(child, depth + 1)).join('\n');
  }

  return `<Dialog>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>${title}</DialogTitle>
    </DialogHeader>
${content}
  </DialogContent>
</Dialog>`;
}

/**
 * Convert Drawer AST node to shadcn Sheet component
 */
export function redeemDrawer(node: AstNode, depth: number, redeemNode: RedeemNodeFn, importManager: ImportManager): string {
  const props = node.props as any;
  const { name } = props;

  // Add Sheet components to imports
  importManager.addShadcnComponent('Sheet');
  importManager.addShadcnComponent('SheetContent');
  importManager.addShadcnComponent('SheetHeader');
  importManager.addShadcnComponent('SheetTitle');
  importManager.addShadcnComponent('SheetDescription');
  importManager.addReactImport('useState');

  const children = node.children.map(child => redeemNode(child, depth + 1)).join('\n');

  // Extract title if first child is a Heading
  let title = name;
  let content = children;

  if (node.children.length > 0 && node.children[0].type === 'Heading') {
    const headingProps = node.children[0].props as any;
    title = headingProps.content || name;
    content = node.children.slice(1).map(child => redeemNode(child, depth + 1)).join('\n');
  }

  return `<Sheet>
  <SheetContent side="left">
    <SheetHeader>
      <SheetTitle>${title}</SheetTitle>
    </SheetHeader>
${content}
  </SheetContent>
</Sheet>`;
}
