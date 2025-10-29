/**
 * Generate webview content with device mockup
 * Takes HTML content from astToHtmlStringPreview and wraps it with device frame
 */
import {
  getDeviceMockupStyles,
  renderIphoneMockup,
} from './webview/deviceMockup'

export function getWebviewContent(
  previewHtml: string,
  logoUri?: string,
  screenButtons?: string,
  currentScreen?: string
) {
  const deviceStyles = getDeviceMockupStyles()

  return `<!DOCTYPE html>
<html lang="en" class="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Proto-Typed Preview</title>
    
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com?plugins=forms,typography,aspect-ratio,line-clamp"></script>
    <script>
      tailwind.config = { 
        darkMode: 'class', 
        theme: { extend: {} } 
      };
    </script>
    
    <!-- Lucide Icons -->
    <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>
    
    <style>${deviceStyles}</style>
</head>
<body>
    <div class="preview-header">
        ${logoUri ? `<img src="${logoUri}" alt="Proto-Typed" class="preview-logo" />` : ''}
        <span class="preview-title">Proto-Typed Preview</span>
        ${currentScreen ? `<span class="current-screen">Screen: ${currentScreen}</span>` : ''}
    </div>
    <!-- Debug: screenButtons length: ${screenButtons?.length || 0} -->
    ${screenButtons ? `<div class="screen-navigation">${screenButtons}</div>` : '<div style="padding: 8px 20px; background: #ff0000; color: white;">⚠️ No screen buttons generated</div>'}
    <div class="preview-container">${renderIphoneMockup(previewHtml)}</div>
    
    <!-- Initialize dark mode and Lucide icons -->
    <script>
      document.documentElement.classList.add('dark');
      
      // Initialize Lucide icons
      if (typeof lucide !== 'undefined') {
        lucide.createIcons();
      }
      
      // Reinitialize icons when DOM changes (for dynamic content)
      const observer = new MutationObserver(() => {
        if (typeof lucide !== 'undefined') {
          lucide.createIcons();
        }
      });
      
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
      
      // Communication with VS Code
      const vscode = acquireVsCodeApi();
      
      window.navigateToScreen = function(screenName) {
        console.log('🔄 Navigating to screen:', screenName);
        vscode.postMessage({
          command: 'navigateToScreen',
          screen: screenName
        });
      };
      
      // Debug: Log when page loads
      console.log('✅ Webview loaded');
      console.log('📍 Screen buttons container:', document.querySelector('.screen-navigation'));
      console.log('📍 Device content:', document.querySelector('.device-content'));
      
      // Handle clicks in rendered content (buttons, links, etc.)
      const deviceContent = document.querySelector('.device-content');
      if (deviceContent) {
        deviceContent.addEventListener('click', function(e) {
          const target = e.target;
          
          // Check if clicked element or parent has data-action or data-destination
          let element = target;
          let maxDepth = 5;
          let depth = 0;
          
          while (element && depth < maxDepth) {
            const action = element.getAttribute?.('data-action');
            const destination = element.getAttribute?.('data-destination');
            
            if (action || destination) {
              e.preventDefault();
              e.stopPropagation();
              
              const targetScreen = destination || action;
              if (targetScreen && targetScreen !== '-1' && targetScreen !== 'close') {
                navigateToScreen(targetScreen);
              }
              return;
            }
            
            element = element.parentElement;
            depth++;
          }
        });
      }
    </script>
</body>
</html>`
}
