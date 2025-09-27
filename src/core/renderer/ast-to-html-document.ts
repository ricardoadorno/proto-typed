import { AstNode } from '../../types/astNode';
import { DocumentStrategy } from './route-manager/strategy/document-strategy';
import { routeManager } from './route-manager/route-manager';

/**
 * Generate a complete HTML document with all screens
 */
export function astToHtmlDocument(ast: AstNode | AstNode[]): string {
  const documentStrategy = new DocumentStrategy(routeManager);
  return documentStrategy.render(ast);
}