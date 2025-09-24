import { AstNode } from '../../../types/astNode';
import { type ProcessedAstData, type RenderOptions } from '../../../types/render';
import { generateNavigationScript } from '../navigation-service';
import { setComponentDefinitions } from '../nodes-service/component-nodes';
import { renderAllScreens, renderScreenForDocument } from './screen-renderer';
import { renderGlobalElements } from './global-elements';
import { generateHtmlDocumentTemplate } from './document-template';

/**
 * Convert AST to HTML string representation with pagination for in-app preview
 * This version treats the container div as the "body" by adding appropriate styles
 */
export function astToHtmlString(ast: AstNode | AstNode[], { currentScreen }: RenderOptions = {}): string {
  const nodes = Array.isArray(ast) ? ast : [ast];
  
  if (nodes.length === 0) return '';
  
  try {
    // Process AST nodes
    const globalNodes = processGlobalNodes(nodes);
    const { screens, components, modals, drawers } = globalNodes;
    
    // Register components with the renderer
    setComponentDefinitions(components);
    
    // Render screens and global elements
    const screensHtml = renderAllScreens(screens, currentScreen);
    const globalElementsHtml = renderGlobalElements(modals, drawers);

    // Add a wrapper div with body-like styles for proper rendering within the preview container
    const result = `<div class="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white relative" >

    ${screensHtml}
    ${globalElementsHtml}

    <script>
      ${generateNavigationScript()}
    </script>
    </div>`;
    
    return result;
  } catch (error: any) {
    throw error;
  }
}

/**
 * Generate a complete HTML document with all screens
 */
export function astToHtmlDocument(ast: AstNode | AstNode[]): string {
  const nodes = Array.isArray(ast) ? ast : [ast];  
  
  if (nodes.length === 0) return '';
  
  // Process AST nodes using existing helper
  const globalNodes = processGlobalNodes(nodes);
  const { screens, components, modals, drawers } = globalNodes;
  
  // Register components with the renderer
  setComponentDefinitions(components);

  // Generate the HTML for all screens with styles to hide all but the first
  const screensHtml = screens
    .filter(screen => screen && screen.name)
    .map((screen, index) => renderScreenForDocument(screen, index))
    .join('\n\n');
  
  // Render global modals and drawers
  const globalElementsHtml = renderGlobalElements(modals, drawers);
  
  // Generate navigation script
  const navigationScript = generateNavigationScript();

  // Create the full HTML document using template
  return generateHtmlDocumentTemplate(screensHtml, globalElementsHtml, navigationScript);
}


export function processGlobalNodes(ast: AstNode | AstNode[]): ProcessedAstData {
  const nodes = Array.isArray(ast) ? ast : [ast];
  
  const screens = nodes.filter(node => node.type === 'screen');
  const components = nodes.filter(node => node.type === 'component');
  
  const modals = nodes.filter(node => node.type === 'modal' && node.name);
  const drawers = nodes.filter(node => node.type === 'drawer' && node.name);
  
  return { screens, components, modals, drawers };
}

