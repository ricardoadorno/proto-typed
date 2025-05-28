import { AstNode } from '../../types/astNode';
import { nodeToHtml } from './nodeRenderer';
import { generateCompleteNavigationScript } from './navigationHelper';

/**
 * Generate a complete HTML document with all screens
 */
export function astToHtmlDocument(ast: AstNode | AstNode[]): string {
  const screens = Array.isArray(ast) ? ast : [ast];
    // Generate the HTML for all screens with styles to hide all but the first
  const screensHtml = screens
    .filter(screen => screen && screen.type === 'Screen' && screen.name)
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
      
      return `
  <div class="screen container ${screenName} ${layoutClasses.join(' ')}" ${style}>
      ${elementsHtml}
  </div>`;
    })
    .join('\n\n');
  
  // Create the full HTML document
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.min.css"
    >  <title>Exported Screens</title>
</head>
<body>
  ${screensHtml}
    <script>
    ${generateCompleteNavigationScript()}
  </script>
</body>
</html>
  `.trim();
}