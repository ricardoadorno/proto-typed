import { AstNode } from '../../types/ast-node';
import { ImportManager } from './infrastructure/import-manager';
import { ComponentGenerator } from './infrastructure/component-generator';
import { redeemButton, redeemLink, redeemHeading, redeemText, redeemParagraph, redeemImage } from './nodes/primitives.redeemer';
import { redeemLayout, redeemList, redeemSeparator } from './nodes/layouts.redeemer';
import { redeemInput, redeemSelect, redeemCheckbox } from './nodes/inputs.redeemer';
import { redeemScreen, redeemModal, redeemDrawer } from './nodes/views.redeemer';

/**
 * Main redeemer - converts AST to React component code with shadcn/ui
 */
export class AstToReactRedeemer {
  private importManager: ImportManager;
  private componentGenerator: ComponentGenerator;

  constructor() {
    this.importManager = new ImportManager();
    this.componentGenerator = new ComponentGenerator(this.importManager);
  }

  /**
   * Convert AST to complete React component file content
   */
  redeem(ast: AstNode | AstNode[], options?: RedeemOptions): string {
    const astArray = Array.isArray(ast) ? ast : [ast];

    // Reset for each conversion
    this.importManager.reset();

    // Process each node and collect JSX
    const jsx = astArray.map(node => this.redeemNode(node)).join('\n\n');

    // Generate complete component file
    return this.componentGenerator.generateComponentFile({
      componentName: options?.componentName || 'GeneratedComponent',
      jsx,
      includeClientDirective: options?.isClientComponent ?? true
    });
  }

  /**
   * Convert a single AST node to JSX
   */
  private redeemNode(node: AstNode, depth: number = 0): string {
    const indent = '  '.repeat(depth);

    // Render based on node type
    let jsx: string;

    switch (node.type) {
      // Primitives
      case 'Button':
        jsx = redeemButton(node, this.importManager);
        break;
      case 'Link':
        jsx = redeemLink(node, this.importManager);
        break;
      case 'Heading':
        jsx = redeemHeading(node);
        break;
      case 'Text':
      case 'MutedText':
        jsx = redeemText(node);
        break;
      case 'Paragraph':
        jsx = redeemParagraph(node);
        break;
      case 'Image':
        jsx = redeemImage(node);
        break;

      // Layouts
      case 'Layout':
        jsx = redeemLayout(node, depth, (n, d) => this.redeemNode(n, d));
        break;
      case 'List':
        jsx = redeemList(node, depth, (n, d) => this.redeemNode(n, d));
        break;
      case 'Separator':
        jsx = redeemSeparator(node, this.importManager);
        break;

      // Inputs
      case 'Input':
        jsx = redeemInput(node, this.importManager);
        break;
      case 'Select':
        jsx = redeemSelect(node, this.importManager);
        break;
      case 'Checkbox':
        jsx = redeemCheckbox(node, this.importManager);
        break;

      // Views
      case 'Screen':
        jsx = redeemScreen(node, depth, (n, d) => this.redeemNode(n, d));
        break;
      case 'Modal':
        jsx = redeemModal(node, depth, (n, d) => this.redeemNode(n, d), this.importManager);
        break;
      case 'Drawer':
        jsx = redeemDrawer(node, depth, (n, d) => this.redeemNode(n, d), this.importManager);
        break;

      default:
        jsx = `{/* Unknown node type: ${node.type} */}`;
    }

    return indent + jsx;
  }
}

export interface RedeemOptions {
  componentName?: string;
  isClientComponent?: boolean;
  includeComments?: boolean;
}

/**
 * Convenience function to convert AST to React component
 */
export function astToReactComponent(ast: AstNode | AstNode[], options?: RedeemOptions): string {
  const redeemer = new AstToReactRedeemer();
  return redeemer.redeem(ast, options);
}
