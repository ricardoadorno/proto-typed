import { AstNode } from '../../../types/astNode';
import { type RenderOptions } from '../../../types/render';
import { routeManager } from '../route-manager';
import { PreviewAdapter } from '../route-manager/adapters/preview-adapter';
import { DocumentAdapter } from '../route-manager/adapters/document-adapter';

/**
 * Convert AST to HTML string representation with pagination for in-app preview
 * This version treats the container div as the "body" by adding appropriate styles
 */
export function astToHtmlString(ast: AstNode | AstNode[], { currentScreen }: RenderOptions = {}): string {
  const previewAdapter = new PreviewAdapter(routeManager);
  return previewAdapter.render(ast, { currentScreen });
}

/**
 * Generate a complete HTML document with all screens
 */
export function astToHtmlDocument(ast: AstNode | AstNode[]): string {
  const documentAdapter = new DocumentAdapter(routeManager);
  return documentAdapter.render(ast);
}
