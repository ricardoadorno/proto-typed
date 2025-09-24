/**
 * Document Adapter
 * Adapter for full HTML document generation using the route manager
 */

import { RouteManager, renderScreenForDocument } from '../index';
import { AstNode } from '../../../../types/astNode';
import { setComponentDefinitions } from '../../nodes/component-nodes';
import { renderNode } from '../../nodes/node-renderer';
import { generateNavigationScript } from '../script-generator';

/**
 * Document adapter for full HTML document generation
 */
export class DocumentAdapter {
  private routeManager: RouteManager;

  constructor(routeManager: RouteManager) {
    this.routeManager = routeManager;
  }

  /**
   * Generate complete HTML document with all screens
   */
  render(ast: AstNode | AstNode[]): string {
    try {
      // Process routes through the route manager
      this.routeManager.processRoutes(ast);

      return this.generateDocumentHtml();
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * Generate full HTML document
   */
  private generateDocumentHtml(): string {
    // Register components with the renderer
    const componentRoutes = this.routeManager.getRoutesByType('component');
    const componentNodes = componentRoutes.map(route => route.node);
    setComponentDefinitions(componentNodes);
    
    // Generate screens HTML with visibility styles
    const screenRoutes = this.routeManager.getScreenRoutes();
    const screensHtml = screenRoutes
      .filter(route => route.node && route.name)
      .map((route, index) => renderScreenForDocument(route.node, index))
      .join('\n\n');
    
    // Render global elements
    const globalElementsHtml = this.renderGlobalElements();
    
    // Generate navigation script
    const navigationScript = generateNavigationScript();

    // Create the full HTML document
    return this.generateHtmlDocumentTemplate(screensHtml, globalElementsHtml, navigationScript);
  }

  /**
   * Render global elements (modals and drawers)
   */
  private renderGlobalElements(): string {
    const modalRoutes = this.routeManager.getRoutesByType('modal');
    const drawerRoutes = this.routeManager.getRoutesByType('drawer');
    
    const modalsHtml = modalRoutes.length > 0 
      ? modalRoutes.map(route => renderNode(route.node)).join('\n') 
      : '';
    
    const drawersHtml = drawerRoutes.length > 0 
      ? drawerRoutes.map(route => renderNode(route.node)).join('\n') 
      : '';
    
    if (modalsHtml || drawersHtml) {
      return '\n\n' + [modalsHtml, drawersHtml].filter(Boolean).join('\n') + '\n';
    }
    
    return '';
  }

  /**
   * Generate HTML document template
   */
  private generateHtmlDocumentTemplate(
    screensHtml: string,
    globalElementsHtml: string,
    navigationScript: string
  ): string {
    const scripts = {
      tailwindCdn: `<script src="https://cdn.tailwindcss.com?plugins=forms,typography,aspect-ratio,line-clamp"></script>`,
      tailwindConfig: `<script>tailwind.config = { darkMode: 'class', theme: { extend: {} } };</script>`,
      darkModeScript: `<script>document.documentElement.classList.add('dark');</script>`,
      lucideScript: `<script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>`,
      lucideInitScript: `<script>
        document.addEventListener('DOMContentLoaded', function() {
          if (typeof lucide !== 'undefined') {
            lucide.createIcons();
          }
        });
      </script>`
    }

    return `
<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  ${scripts.tailwindCdn}
  ${scripts.tailwindConfig}
  ${scripts.lucideScript}
  <title>Exported Screens</title>
  <style>
    html, body { 
      min-height: 100%; 
      background: linear-gradient(to bottom right, #0f172a, #1e293b);
    }
    .screen { transition: background 0.3s; }
  </style>
</head>
<body class="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 pb-8">  ${screensHtml}${globalElementsHtml}  ${scripts.darkModeScript}
  ${scripts.lucideInitScript}  <script>
    ${navigationScript}
  </script>
</body>
</html>  `.trim();
  }
}