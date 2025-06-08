import { AstNode } from '../../types/astNode';
import { nodeToHtml, setComponentDefinitions } from './nodeRenderer';
import { RenderOptions } from '../../types/renderOptions';
import { generateNavigationScript } from './navigationHelper';

/**
 * Processed AST data structure for rendering
 */
interface ProcessedAstData {
  screens: AstNode[];
  components: AstNode[];
  globalModals: AstNode[];
}

/**
 * Screen rendering configuration
 */
interface ScreenRenderConfig {
  screen: AstNode;
  index: number;
  currentScreen?: string | null;
}

/**
 * Parse and separate AST nodes into screens and components
 */
function processAstNodes(ast: AstNode | AstNode[]): ProcessedAstData {
  const nodes = Array.isArray(ast) ? ast : [ast];
  
  const screens = nodes.filter(node => node.type === 'Screen' || node.type === 'screen');
  const components = nodes.filter(node => node.type === 'component');
  
  return { screens, components, globalModals: [] };
}

/**
 * Extract global modals from screens
 */
function extractGlobalModals(screens: AstNode[]): AstNode[] {
  const modals: AstNode[] = [];
  
  screens.forEach(screen => {
    const modalElements = screen.elements?.filter(element => element.type === 'modal') || [];
    modals.push(...modalElements);
  });
  
  return modals;
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
  const hasBottomNav = screen.elements?.some(element => element.type === 'BottomNav') || false;
  
  if (hasHeader) layoutClasses.push('has-header');
  if (hasBottomNav) layoutClasses.push('has-bottom-nav');
  
  return layoutClasses;
}

/**
 * Render screen elements HTML
 */
function renderScreenElements(screen: AstNode): string {
  return screen.elements
    ?.filter(element => element != null && element.type !== 'Drawer' && element.type !== 'modal')
    .map(element => nodeToHtml(element))
    .join('\n      ') || '';
}

/**
 * Render a single screen to HTML with full configuration
 */
function renderScreen(config: ScreenRenderConfig): string {
  const { screen, index, currentScreen } = config;
  
  const screenName = screen.name?.toLowerCase() || '';
  const style = getScreenVisibilityStyle(screenName, index, currentScreen);
  const layoutClasses = generateLayoutClasses(screen);
  const elementsHtml = renderScreenElements(screen);
  
  return `
  <div id="${screenName}-screen" class="screen container ${screenName} ${layoutClasses.join(' ')}" ${style}>
      ${elementsHtml}
  </div>`;
}

/**
 * Convert a single screen to HTML (simplified version for component usage)
 * This is used by nodeRenderer for individual screen rendering
 */
export function screenToHtml(screen: AstNode): string {
  const screenName = screen.name || '';
  
  // Check if screen has header or bottom nav to add appropriate classes
  const hasHeader = screen.elements?.some(element => element.type === 'Header') || false;
  const hasBottomNav = screen.elements?.some(element => element.type === 'BottomNav') || false;
  
  const layoutClasses = [];
  if (hasHeader) layoutClasses.push('has-header');
  if (hasBottomNav) layoutClasses.push('has-bottom-nav');
  
  const elementsHtml = screen.elements
    ?.filter(element => element != null && element.type !== 'modal')
    .map(element => nodeToHtml(element))
    .join('\n      ') || '';
  
  return `
  <div class="screen container ${screenName.toLowerCase()} ${layoutClasses.join(' ')}">
      ${elementsHtml}
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
 * Render global modals HTML
 */
function renderGlobalModals(globalModals: AstNode[]): string {
  if (globalModals.length === 0) return '';
  
  return '\n\n' + globalModals
    .map(modal => nodeToHtml(modal))
    .join('\n') + '\n';
}

/**
 * Convert AST to HTML string representation with pagination for in-app preview
 */
export function astToHtmlString(ast: AstNode | AstNode[], { currentScreen }: RenderOptions = {}): string {
  const nodes = Array.isArray(ast) ? ast : [ast];
  
  if (nodes.length === 0) return '';
  
  // Process AST nodes
  const processedData = processAstNodes(nodes);
  const { screens, components } = processedData;
  
  // Register components with the renderer
  setComponentDefinitions(components);
  
  // Extract global modals
  const globalModals = extractGlobalModals(screens);
  
  // Render screens and global modals
  const screensHtml = renderAllScreens(screens, currentScreen);
  const globalModalsHtml = renderGlobalModals(globalModals);
  
  return `${screensHtml}${globalModalsHtml}`;
}

/**
 * Render a single screen to HTML for document export with enhanced styling
 */
function renderScreenForDocument(screen: AstNode, index: number): string {
  const screenName = screen.name?.toLowerCase() || '';
  const style = index === 0 ? '' : 'style="display:none"';
  
  // Check if screen has header or bottom nav to add appropriate classes
  const hasHeader = screen.elements?.some(element => element.type === 'Header') || false;
  const hasBottomNav = screen.elements?.some(element => element.type === 'BottomNav') || false;
  const layoutClasses = [];
  if (hasHeader) layoutClasses.push('has-header');
  if (hasBottomNav) layoutClasses.push('has-bottom-nav');
  
  const elementsHtml = screen.elements
    ?.filter(element => element != null && element.type !== 'Drawer' && element.type !== 'modal')
    .map(element => nodeToHtml(element))
    .join('\n      ') || '';

  // Add Tailwind container and screen classes, and id for navigation
  return `
  <div id="${screenName}-screen" class="screen container mx-auto px-4 py-8 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 ${screenName} ${layoutClasses.join(' ')}" ${style}>
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

  // Extract global modals
  const globalModals = extractGlobalModals(screens);

  // Generate the HTML for all screens with styles to hide all but the first
  const screensHtml = screens
    .filter(screen => screen && screen.name)
    .map((screen, index) => renderScreenForDocument(screen, index))
    .join('\n\n');

  // Render global modals
  const globalModalsHtml = renderGlobalModals(globalModals);

  // Tailwind CDN and dark mode script for export
  const tailwindCdn = `<script src="https://cdn.tailwindcss.com?plugins=forms,typography,aspect-ratio,line-clamp"></script>`;
  const tailwindConfig = `<script>tailwind.config = { darkMode: 'class', theme: { extend: {} } };</script>`;
  const darkModeScript = `<script>(function(){try{var e=window.matchMedia('(prefers-color-scheme: dark)').matches;var d=document.documentElement;d.classList[e?'add':'remove']('dark');}catch(_){}})();</script>`;  // Create the full HTML document
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  ${tailwindCdn}
  ${tailwindConfig}
  <title>Exported Screens</title>
  <style>
    html, body { min-height: 100%; background: linear-gradient(to bottom right, #f8fafc, #e0e7ff); }
    @media (prefers-color-scheme: dark) {
      html, body { background: linear-gradient(to bottom right, #0f172a, #1e293b); }
    }
    .screen { transition: background 0.3s; }
  </style>
</head>
<body class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 pb-8">
  ${screensHtml}${globalModalsHtml}  ${darkModeScript}
  <script>
    ${generateNavigationScript()}
    
    // FAB toggle functionality
    function toggleFAB(fabButton) {
      const fabContainer = fabButton.closest('.fab-container');
      const fabItemsList = fabContainer.querySelector('.fab-items-list');
      const fabItems = fabItemsList.querySelectorAll('.fab-item');
      const isOpen = fabItemsList.classList.contains('show');
      
      if (isOpen) {
        // Close FAB
        fabItems.forEach((item, index) => {
          setTimeout(() => {
            item.classList.remove('show');
          }, index * 50);
        });
        
        setTimeout(() => {
          fabItemsList.classList.remove('show');
        }, fabItems.length * 50);
        
        // Rotate FAB icon
        fabButton.style.transform = 'rotate(0deg)';
      } else {
        // Open FAB
        fabItemsList.classList.add('show');
        
        fabItems.forEach((item, index) => {
          setTimeout(() => {
            item.classList.add('show');
          }, index * 50);
        });
        
        // Rotate FAB icon
        fabButton.style.transform = 'rotate(45deg)';
      }
    }
    
    // Close FAB when clicking outside
    document.addEventListener('click', function(event) {
      const fabContainers = document.querySelectorAll('.fab-container');
      fabContainers.forEach(container => {
        if (!container.contains(event.target)) {
          const fabItemsList = container.querySelector('.fab-items-list');
          const fabItems = container.querySelectorAll('.fab-item');
          const fabButton = container.querySelector('.fab');
          
          if (fabItemsList && fabItemsList.classList.contains('show')) {
            fabItems.forEach((item, index) => {
              setTimeout(() => {
                item.classList.remove('show');
              }, index * 50);
            });
            
            setTimeout(() => {
              fabItemsList.classList.remove('show');
            }, fabItems.length * 50);
            
            if (fabButton) {
              fabButton.style.transform = 'rotate(0deg)';
            }
          }
        }
      });
    });
  </script>
</body>
</html>  `.trim();
}