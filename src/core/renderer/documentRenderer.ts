import { AstNode } from '../../types/astNode';
import { nodeToHtml } from './nodeRenderer';

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
      
      const elementsHtml = screen.elements
        ?.filter(element => element != null)
        .map(element => nodeToHtml(element))
        .join('\n      ') || '';
      
      return `
  <div class="screen container ${screenName}" ${style}>
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
    >
  <title>Exported Screens</title>
</head>
<body>
  ${screensHtml}
    <script>
    function showScreen(screenName) {
      const screens = document.querySelectorAll('.screen');
      screens.forEach(screen => {
        if (screen.className.includes(screenName.toLowerCase())) {
          screen.style.display = 'block';
        } else {
          screen.style.display = 'none';
        }
      });
    }
    
    // Handle link clicks for navigation
    document.addEventListener('click', function(e) {
      if (e.target && e.target.tagName === 'A') {
        const href = e.target.getAttribute('href');
        if (href && href.startsWith('#')) {
          e.preventDefault();
          const screenName = href.substring(1);
          showScreen(screenName);
        }
      }
    });
  </script>
</body>
</html>
  `.trim();
}