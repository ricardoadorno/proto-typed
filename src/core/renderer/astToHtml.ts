import { AstNode } from '../../types/astNode';
import { 
  RenderOptions, 
  ProcessedAstData, 
  ScreenRenderConfig 
} from '../../types/render';
import { generateNavigationScript } from './navigationHelper';
import { renderNode } from './node-renderer';
import { setComponentDefinitions } from './nodes/component-nodes';

/**
 * Parse and separate AST nodes into screens and components
 */
function processAstNodes(ast: AstNode | AstNode[]): ProcessedAstData {
  const nodes = Array.isArray(ast) ? ast : [ast];
  
  const screens = nodes.filter(node => node.type === 'Screen' || node.type === 'screen');
  const components = nodes.filter(node => node.type === 'component');
  
  return { screens, components, globalModals: [], globalDrawers: [] };
}

/**
 * Extract global modals and drawers from screens
 */
function extractGlobalElements(screens: AstNode[]): { modals: AstNode[], drawers: AstNode[] } {
  const modals: AstNode[] = [];
  const drawers: AstNode[] = [];
  
  screens.forEach(screen => {    const modalElements = screen.elements?.filter(element => 
      element.type?.toLowerCase() === 'modal'
    ) || [];
    const drawerElements = screen.elements?.filter(element => 
      element.type?.toLowerCase() === 'drawer'
    ) || [];
    
    modals.push(...modalElements);
    drawers.push(...drawerElements);
  });
  
  return { modals, drawers };
}

/**
 * Determine screen visibility style
 */
function getScreenVisibilityStyle(screenName: string, index: number, currentScreen?: string | null): string {
  if (currentScreen) {
    return screenName === currentScreen.toLowerCase() ? '' : 'style="display:none"';
  }
  return index === 0 ? '' : 'style="display:none"';
}

/**
 * Generate layout classes for a screen
 */
function generateLayoutClasses(screen: AstNode): string[] {
  const layoutClasses: string[] = [];
    const hasHeader = screen.elements?.some(element => element.type === 'Header') || false;
  const hasNavigator = screen.elements?.some(element => element.type === 'Navigator') || false;
  
  if (hasHeader) layoutClasses.push('has-header');
  if (hasNavigator) layoutClasses.push('has-navigator');
  
  return layoutClasses;
}

/**
 * Render a single screen to HTML with full configuration
 */
function renderScreen(config: ScreenRenderConfig): string {
  const { screen, index, currentScreen } = config;
  
  const screenName = screen.name?.toLowerCase() || '';
  const style = getScreenVisibilityStyle(screenName, index, currentScreen);
  const layoutClasses = generateLayoutClasses(screen);
    // Check if screen has header, navigator, or FAB to add appropriate classes
  const hasHeader = screen.elements?.some(element => element.type === 'Header') || false;
  const hasNavigator = screen.elements?.some(element => element.type === 'Navigator') || false;
  const hasFAB = screen.elements?.some(element => element.type === 'FAB') || false;
  
  if (hasHeader) layoutClasses.push('has-header');
  if (hasNavigator) layoutClasses.push('has-navigator');
  if (hasFAB) layoutClasses.push('has-fab');
    // Separate header, content, FAB, and navigator for proper positioning
  const headerElements = screen.elements?.filter(element => element.type === 'Header') || [];
  const fabElements = screen.elements?.filter(element => element.type === 'FAB') || [];
  const navigatorElements = screen.elements?.filter(element => element.type === 'Navigator') || [];
  const contentElements = screen.elements?.filter(element => 
    element.type !== 'Header' && element.type !== 'FAB' && element.type !== 'Navigator'
  ) || [];
  
  const headerHtml = headerElements
    ?.map(element => renderNode(element))
    .join('\n') || '';
    
  const contentHtml = contentElements
    ?.filter(element => element != null)
    .map(element => renderNode(element))
    .join('\n      ') || '';
    
  const fabHtml = fabElements
    ?.map(element => renderNode(element))
    .join('\n') || '';
      const navigatorHtml = navigatorElements
    ?.map(element => renderNode(element))
    .join('\n') || '';  return `
  <div id="${screenName}-screen" class="screen container ${screenName} ${layoutClasses.join(' ')} flex flex-col min-h-screen relative" ${style}>
      ${headerHtml}
      <div class="min-h-[812px] flex-1 p-4 py-10 relative">
        ${contentHtml}
      </div>
      ${fabHtml}
      ${navigatorHtml}
  </div>`;
}

/**
 * Convert a single screen to HTML (simplified version for component usage)
 * This is used by nodeRenderer for individual screen rendering
 */
export function screenToHtml(screen: AstNode): string {
  const screenName = screen.name || '';
    // Check if screen has header, navigator, or FAB to add appropriate classes
  const hasHeader = screen.elements?.some(element => element.type === 'Header') || false;
  const hasNavigator = screen.elements?.some(element => element.type === 'Navigator') || false;
  const hasFAB = screen.elements?.some(element => element.type === 'FAB') || false;
  
  const layoutClasses = [];
  if (hasHeader) layoutClasses.push('has-header');
  if (hasNavigator) layoutClasses.push('has-navigator');
  if (hasFAB) layoutClasses.push('has-fab');
    // Separate header, content, FAB, and navigator for proper positioning
  const headerElements = screen.elements?.filter(element => element.type === 'Header') || [];
  const fabElements = screen.elements?.filter(element => element.type === 'FAB') || [];
  const navigatorElements = screen.elements?.filter(element => element.type === 'Navigator') || [];
  const contentElements = screen.elements?.filter(element => 
    element.type !== 'Header' && element.type !== 'FAB' && element.type !== 'Navigator' &&
    // Keep all elements except named modals and drawers (they'll be rendered globally)
    !(element.type === 'modal' && element.name) &&
    !(element.type === 'drawer' && element.name)
  ) || [];
  
  const headerHtml = headerElements
    ?.map(element => renderNode(element))
    .join('\n') || '';
    
  const contentHtml = contentElements
    ?.filter(element => element != null)
    .map(element => renderNode(element))
    .join('\n      ') || '';
    
  const fabHtml = fabElements
    ?.map(element => renderNode(element))
    .join('\n') || '';
      const navigatorHtml = navigatorElements
    ?.map(element => renderNode(element))
    .join('\n') || '';    return `
  <div class="screen container ${screenName.toLowerCase()} ${layoutClasses.join(' ')} flex flex-col min-h-full relative">
      ${headerHtml}
      <div class="flex-1 p-4 relative">
        ${contentHtml}
      </div>
      ${fabHtml}
      ${navigatorHtml}
  </div>
  `.trim();
}

/**
 * Render all screens to HTML
 */
function renderAllScreens(screens: AstNode[], currentScreen?: string | null): string {
  return screens
    .filter(screen => screen && screen.name)
    .map((screen, index) => renderScreen({
      screen,
      index,
      currentScreen
    }))
    .join('\n\n');
}

/**
 * Render global modals and drawers HTML
 */
function renderGlobalElements(modals: AstNode[], drawers: AstNode[]): string {
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
 * Convert AST to HTML string representation with pagination for in-app preview
 * This version treats the container div as the "body" by adding appropriate styles
 */
export function astToHtmlString(ast: AstNode | AstNode[], { currentScreen }: RenderOptions = {}): string {
  const nodes = Array.isArray(ast) ? ast : [ast];
  
  if (nodes.length === 0) return '';
  
  // Process AST nodes
  const processedData = processAstNodes(nodes);
  const { screens, components } = processedData;
  
  // Register components with the renderer
  setComponentDefinitions(components);
  
  // Extract global modals and drawers
  const globalElements = extractGlobalElements(screens);
  
  // Render screens and global elements
  const screensHtml = renderAllScreens(screens, currentScreen);
  const globalElementsHtml = renderGlobalElements(globalElements.modals, globalElements.drawers);  // Add a wrapper div with body-like styles for proper rendering within the preview container
  const result = `<div class="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white relative" >

  ${screensHtml}${globalElementsHtml}

  <script>
    ${generateNavigationScript()}
  </script>
  </div>`;
  
  return result;
}

/**
 * Render a single screen to HTML for document export with enhanced styling
 */
function renderScreenForDocument(screen: AstNode, index: number): string {
  const screenName = screen.name?.toLowerCase() || '';
  const style = index === 0 ? '' : 'style="display:none"';
    // Check if screen has header or navigator to add appropriate classes
  const hasHeader = screen.elements?.some(element => element.type === 'Header') || false;
  const hasNavigator = screen.elements?.some(element => element.type === 'Navigator') || false;
  const layoutClasses = [];
  if (hasHeader) layoutClasses.push('has-header');
  if (hasNavigator) layoutClasses.push('has-navigator');
    const elementsHtml = screen.elements
    ?.filter(element => {
      // Keep all elements except named modals and drawers (they'll be rendered globally)
      if (element.type === 'modal' || element.type === 'drawer') {
        // Only filter out elements that have names (global elements)
        return !element.name;
      }
      return element != null;
    })
    .map(element => renderNode(element))
    .join('\n      ') || '';

  // Add Tailwind container and screen classes, and id for navigation
  return `
  <div id="${screenName}-screen" class="screen container mx-auto  ${screenName} ${layoutClasses.join(' ')}" ${style}>
      ${elementsHtml}
  </div>`;
}

/**
 * Generate a complete HTML document with all screens
 */
export function astToHtmlDocument(ast: AstNode | AstNode[]): string {
  const nodes = Array.isArray(ast) ? ast : [ast];  
  
  if (nodes.length === 0) return '';
  
  // Process AST nodes using existing helper
  const processedData = processAstNodes(nodes);
  const { screens, components } = processedData;
  
  // Register components with the renderer
  setComponentDefinitions(components);

  // Extract global modals and drawers
  const globalElements = extractGlobalElements(screens);

  // Generate the HTML for all screens with styles to hide all but the first
  const screensHtml = screens
    .filter(screen => screen && screen.name)
    .map((screen, index) => renderScreenForDocument(screen, index))
    .join('\n\n');
  // Render global modals and drawers
  const globalElementsHtml = renderGlobalElements(globalElements.modals, globalElements.drawers);
  
  // Tailwind CDN and dark mode configuration for export
  const tailwindCdn = `<script src="https://cdn.tailwindcss.com?plugins=forms,typography,aspect-ratio,line-clamp"></script>`;
  const tailwindConfig = `<script>tailwind.config = { darkMode: 'class', theme: { extend: {} } };</script>`;
  const darkModeScript = `<script>document.documentElement.classList.add('dark');</script>`;
  const lucideScript = `<script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>`;
  const lucideInitScript = `<script>
    document.addEventListener('DOMContentLoaded', function() {
      if (typeof lucide !== 'undefined') {
        lucide.createIcons();
      }
    });
  </script>`;

  // Create the full HTML document
  return `
<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  ${tailwindCdn}
  ${tailwindConfig}
  ${lucideScript}
  <title>Exported Screens</title>
  <style>
    html, body { 
      min-height: 100%; 
      background: linear-gradient(to bottom right, #0f172a, #1e293b);
    }
    .screen { transition: background 0.3s; }
  </style>
</head>
<body class="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 pb-8">  ${screensHtml}${globalElementsHtml}  ${darkModeScript}
  ${lucideInitScript}  <script>
    ${generateNavigationScript()}
  </script>
</body>
</html>  `.trim();
}