import { AstNode } from '../../types/astNode';
import { routeManager } from './route-manager';
import { DocumentAdapter } from './route-manager/adapters/document-adapter';

/**
 * Generate a complete HTML document with all screens
 */
export function astToHtmlDocument(ast: AstNode | AstNode[]): string {
  const documentAdapter = new DocumentAdapter(routeManager);
  return documentAdapter.render(ast);
}