import { AstNode } from '../../../types/astNode';
import { type ProcessedAstData, type RenderOptions } from '../../../types/render';
import { generateNavigationScript } from '../navigation-service';
import { setComponentDefinitions } from '../nodes-service/component-nodes';
import { renderAllScreens, renderScreenForDocument } from './screen-renderer';
import { renderNode } from '../nodes-service/node-renderer';

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


// TODO: Refactor to a separate service file if it grows more complex

/**
 * Process AST nodes to categorize them into screens, components, modals, and drawers
 */
export function processGlobalNodes(ast: AstNode | AstNode[]): ProcessedAstData {
  const nodes = Array.isArray(ast) ? ast : [ast];
  
  const screens = nodes.filter(node => node.type === 'screen');
  const components = nodes.filter(node => node.type === 'component');
  
  const modals = nodes.filter(node => node.type === 'modal' && node.name);
  const drawers = nodes.filter(node => node.type === 'drawer' && node.name);
  
  return { screens, components, modals, drawers };
}

/**
 * Render global modals and drawers HTML
 */
export function renderGlobalElements(modals: AstNode[], drawers: AstNode[]): string {
  const modalsHtml = modals.length > 0 
    ? modals.map(modal => renderNode(modal)).join('\n') 
    : '';
  
  const drawersHtml = drawers.length > 0 
    ? drawers.map(drawer => renderNode(drawer)).join('\n') 
    : '';
  
  if (modalsHtml || drawersHtml) {
    return '\n\n' + [modalsHtml, drawersHtml].filter(Boolean).join('\n') + '\n';
  }
  
  return '';
}

/**
 * Generate HTML document template
 */
export function generateHtmlDocumentTemplate(
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
