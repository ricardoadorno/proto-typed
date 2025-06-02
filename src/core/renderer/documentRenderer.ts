import { AstNode } from '../../types/astNode';
import { nodeToHtml, setComponentDefinitions } from './nodeRenderer';
import { generateCompleteNavigationScript } from './navigationHelper';

/**
 * Generate a complete HTML document with all screens
 */
export function astToHtmlDocument(ast: AstNode | AstNode[]): string {
  const nodes = Array.isArray(ast) ? ast : [ast];  
  
  // Separate screens and components
  const screens = nodes.filter(node => node.type === 'Screen' || node.type === 'screen');
  const components = nodes.filter(node => node.type === 'component');
  
  // Register components with the renderer
  setComponentDefinitions(components);

  // Generate the HTML for all screens with styles to hide all but the first
  const screensHtml = screens
    .filter(screen => screen && screen.name)
    .map((screen, index) => {
      const screenName = screen.name?.toLowerCase() || '';
      const style = index === 0 ? '' : 'style="display:none"';

      // Check if screen has header or bottom nav to add appropriate classes
      const hasHeader = screen.elements?.some(element => element.type === 'Header') || false;
      const hasBottomNav = screen.elements?.some(element => element.type === 'BottomNav') || false;

      const layoutClasses = [];
      if (hasHeader) layoutClasses.push('has-header');
      if (hasBottomNav) layoutClasses.push('has-bottom-nav');

      const elementsHtml = screen.elements
        ?.filter(element => element != null)
        .map(element => nodeToHtml(element))
        .join('\n      ') || '';

      // Add Tailwind container and screen classes, and id for navigation
      return `
  <div id="${screenName}-screen" class="screen container mx-auto px-4 py-8 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 ${screenName} ${layoutClasses.join(' ')}" ${style}>
      ${elementsHtml}
  </div>`;
    })
    .join('\n\n');

  // Tailwind CDN and dark mode script for export
  const tailwindCdn = `<script src=\"https://cdn.tailwindcss.com?plugins=forms,typography,aspect-ratio,line-clamp\"></script>`;
  const tailwindConfig = `<script>tailwind.config = { darkMode: 'class', theme: { extend: {} } };</script>`;
  const darkModeScript = `<script>(function(){try{var e=window.matchMedia('(prefers-color-scheme: dark)').matches;var d=document.documentElement;d.classList[e?'add':'remove']('dark');}catch(_){}})();</script>`;

  // Create the full HTML document
  return `
<!DOCTYPE html>
<html lang=\"en\">
<head>
  <meta charset=\"UTF-8\">
  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">
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
<body class=\"min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 pb-8\">
  ${screensHtml}
  ${darkModeScript}
  <script>
    ${generateCompleteNavigationScript()}
  </script>
</body>
</html>
  `.trim();
}