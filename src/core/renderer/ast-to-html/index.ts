import { AstNode } from '../../../types/astNode';
import { RenderOptions } from '../../../types/render';
import { generateNavigationScript } from '../navigation-service';
import { setComponentDefinitions } from '../nodes/component-nodes';
import { processAstNodes } from './ast-processor';
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
    const processedData = processAstNodes(nodes);
    const { screens, components, globalModals, globalDrawers } = processedData;
    
    // Register components with the renderer
    setComponentDefinitions(components);
    
    // Render screens and global elements
    const screensHtml = renderAllScreens(screens, currentScreen);
    const globalElementsHtml = renderGlobalElements(globalModals, globalDrawers);

    // Add a wrapper div with body-like styles for proper rendering within the preview container
    const result = `<div class="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white relative" >

    ${screensHtml}${globalElementsHtml}

    <script>
      ${generateNavigationScript()}
    </script>
    </div>`;
    
    return result;
  } catch (error: any) {
    // Re-throw the error so it can be caught by the parsing hook
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
  const processedData = processAstNodes(nodes);
  const { screens, components, globalModals, globalDrawers } = processedData;
  
  // Register components with the renderer
  setComponentDefinitions(components);

  // Generate the HTML for all screens with styles to hide all but the first
  const screensHtml = screens
    .filter(screen => screen && screen.name)
    .map((screen, index) => renderScreenForDocument(screen, index))
    .join('\n\n');
  
  // Render global modals and drawers
  const globalElementsHtml = renderGlobalElements(globalModals, globalDrawers);
  
  // Generate navigation script
  const navigationScript = generateNavigationScript();

  // Create the full HTML document using template
  return generateHtmlDocumentTemplate(screensHtml, globalElementsHtml, navigationScript);
}
