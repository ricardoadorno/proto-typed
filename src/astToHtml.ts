import { AstNode } from './types/astNode';

/**
 * Convert AST to HTML string representation with pagination for in-app preview
 */
export function astToHtml(ast: AstNode | AstNode[]): string {
  const screens = Array.isArray(ast) ? ast : [ast];
  
  if (screens.length === 0) return '';
  
  // Generate the HTML for all screens, with unique IDs and display:none (except first)
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
  <div id="${screenName}-screen" class="screen container ${screenName}" ${style}>
      ${elementsHtml}
  </div>`;
    })
    .join('\n\n');
  
  return `${screensHtml}`;
}

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

// Navigation is now handled through Link elements

/**
 * Convert a single screen to HTML
 */
function screenToHtml(screen: AstNode): string {
  const screenName = screen.name || '';
  
  const elementsHtml = screen.elements
    ?.filter(element => element != null)
    .map(element => nodeToHtml(element))
    .join('\n      ') || '';
  
  return `
  <div class="screen container ${screenName.toLowerCase()}">
      ${elementsHtml}
  </div>
  `.trim();
}

/**
 * Convert an AST node to HTML
 */
function nodeToHtml(node: AstNode): string {
  if (!node || !node.type) {
    console.warn('Invalid node received:', node);
    return '';
  }
  
  switch (node.type) {
    case 'Screen':
      return screenToHtml(node);
      
    case 'Input':
      const inputProps = node.props || {};
      return `<input ${attributesToHtml(inputProps)} />`;
      
    case 'Button':
      const buttonProps = node.props || {};
      return `<button style="margin: 1rem 1rem 1rem 0" ${attributesToHtml(buttonProps)}>${buttonProps?.children || ''}</button>`;
      
    case 'Heading':
      const level = node.props?.level || 1;
      return `<h${level}>${node.props?.children || ''}</h${level}>`;
        
    case 'Link':
      const href = node.props?.href || '#';
      // Check if this is an internal navigation link (a screen name) or an external link
      const isInternalLink = !href.includes('://') && !href.startsWith('mailto:');
      
      if (isInternalLink) {
        // For internal links, use the href as a screen identifier with a hash prefix
        return `<a href="#${href}" data-screen-link="${href}">${node.props?.children || ''}</a>`;
      } else {
        // For external links, open in a new tab
        return `<a href="${href}" target="_blank" rel="noopener noreferrer">${node.props?.children || ''}</a>`;
      }
      
    case 'Image':
      const src = node.props?.src || '';
      const alt = node.props?.alt || '';
      return `<img src="${src}" alt="${alt}" style="max-width: 100%;" />`;
        
    case 'OrderedList':
      const olItems = (node.props?.items || [])
        .map((item: string) => `<li>${item}</li>`)
        .join('\n');
      return `<ol>${olItems}</ol>`;
      
    case 'UnorderedList':
      const ulItems = (node.props?.items || [])
        .map((item: string) => `<li>${item}</li>`)
        .join('\n');
      return `<ul>${ulItems}</ul>`;
      
    case 'Paragraph':
      const variant = node.props?.variant || 'default';
      return `<p class="${variant}">${node.props?.children || ''}</p>`;
        
    case 'RadioGroup':
      const radioName = `radio-group-${Math.random().toString(36).substring(7)}`;
      const radioOptions = (node.props?.options || [])
        .map((option: { label: string, selected: boolean }) => `
          <label>
            <input type="radio" name="${radioName}" ${option.selected ? 'checked' : ''} />
            <span>${option.label}</span>
          </label>
        `)
        .join('\n');
      return `<div class="radio-group">${radioOptions}</div>`;
      
    case 'Select':
      const options = (node.props?.options || [])
        .map((option: string) => `<option value="${option}">${option}</option>`)
        .join('\n');
      return `<select>${options}</select>`;
        
    case 'CheckboxGroup':
      const checkboxOptions = (node.props?.options || [])
        .map((option: { label: string, checked: boolean }) => `
          <label>
            <input type="checkbox" ${option.checked ? 'checked' : ''} />
            <span>${option.label}</span>
          </label>
        `)
        .join('\n');
      return `<div class="checkbox-group">${checkboxOptions}</div>`;
      
    case 'Grid':
      const gridElements = node.elements?.map(element => nodeToHtml(element)).join('\n') || '';
      return `<div class="grid">${gridElements}</div>`;
      
    case 'Row':
      const rowElements = node.elements?.map(element => nodeToHtml(element)).join('\n') || '';
      const rowClass = node.props?.className || 'row';
      return `<div class="${rowClass}">${rowElements}</div>`;
      
    case 'Column':
      const colElements = node.elements?.map(element => nodeToHtml(element)).join('\n') || '';
      const colClass = node.props?.className || 'column';
      return `<div class="${colClass}">${colElements}</div>`;
      
    case 'Card':
      const cardElements = node.elements?.map(element => nodeToHtml(element)).join('\n') || '';
      return `<article class="card">${cardElements}</article>`;
      
    case 'Separator':
      return `<hr>`;
      
    default:
      console.warn(`Unknown node type: ${node.type}`);
      return '';
  }
}

/**
 * Convert object attributes to HTML attribute string
 */
function attributesToHtml(props: Record<string, any>): string {
  if (!props) return '';
  
  return Object.entries(props)
    .filter(([key]) => key !== 'children') // Skip the children prop
    .map(([key, value]) => {
      if (typeof value === 'boolean') {
        return value ? key : '';
      }
      
      if (typeof value === 'string') {
        return `${key}="${escapeHtml(value)}"`;
      }
      
      if (typeof value === 'number') {
        return `${key}="${value}"`;
      }
      
      return '';
    })
    .filter(Boolean)
    .join(' ');
}

/**
 * Escape HTML special characters
 */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
