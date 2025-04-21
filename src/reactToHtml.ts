import { AstNode } from './types/astNode';

/**
 * Convert AST to HTML string representation
 */
export function reactToHtml(ast: AstNode | AstNode[]): string {
  const screens = Array.isArray(ast) ? ast : [ast];
  
  // Generate the HTML for all screens
  const screensHtml = screens
    .filter(screen => screen && screen.type === 'Screen' && screen.name)
    .map(screen => screenToHtml(screen))
    .join('\n\n');
  
  // Create the full HTML document
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Exported Screens</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 1rem;
    }
    
    .screen {
      margin-bottom: 2rem;
      padding: 1rem;
      border: 1px solid #e1e4e8;
      border-radius: 6px;
    }
    
    button {
      background-color: #0366d6;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 8px 16px;
      cursor: pointer;
      font-size: 14px;
      margin-right: 8px;
      margin-bottom: 8px;
    }
    
    button:hover {
      background-color: #0255b3;
    }
    
    select {
      width: 100%;
      padding: 8px;
      margin-bottom: 16px;
      border-radius: 4px;
      border: 1px solid #ddd;
    }
    
    input[type="checkbox"], input[type="radio"] {
      margin-right: 8px;
    }
    
    label {
      display: block;
      margin-bottom: 8px;
    }
    
    .checkbox-group, .radio-group {
      margin: 1rem 0;
    }
    
    p.note {
      margin: 1em 0;
      padding: 1em;
      background-color: #f6f8fa;
      border-left: 4px solid #0366d6;
    }
    
    p.quote {
      margin: 1em 0;
      padding: 1em;
      background-color: #f8f9fa;
      border-left: 4px solid #34495e;
      font-style: italic;
      color: #2c3e50;
    }
    
    .nav-buttons {
      margin-bottom: 20px;
      display: flex;
      flex-wrap: wrap;
    }
    
    img {
      max-width: 100%;
    }
  </style>
</head>
<body>
  ${generateNavigationButtons(screens)}
  ${screensHtml}
  
  <script>
    // Simple navigation script
    function showScreen(screenName) {
      const screens = document.querySelectorAll('.screen');
      screens.forEach(screen => {
        if (screen.classList.contains(screenName.toLowerCase())) {
          screen.style.display = 'block';
        } else {
          screen.style.display = 'none';
        }
      });
    }
    
    // Show the first screen by default
    document.addEventListener('DOMContentLoaded', function() {
      const firstScreenButton = document.querySelector('.nav-buttons button');
      if (firstScreenButton) {
        firstScreenButton.click();
      }
    });
  </script>
</body>
</html>
  `.trim();
}

/**
 * Generate navigation buttons for screens
 */
function generateNavigationButtons(screens: AstNode[]): string {
  if (screens.length <= 1) return '';
  
  const buttons = screens
    .map(screen => {
      const screenName = screen.name || '';
      return `<button onclick="showScreen('${screenName}')">${screenName}</button>`;
    })
    .join('\n      ');
  
  return `
  <div class="nav-buttons">
      ${buttons}
  </div>
  `;
}

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
  <div class="screen ${screenName.toLowerCase()}">
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
      return `<button ${attributesToHtml(buttonProps)}>${buttonProps?.children || ''}</button>`;
      
    case 'Heading':
      const level = node.props?.level || 1;
      return `<h${level}>${node.props?.children || ''}</h${level}>`;
      
    case 'Link':
      const href = node.props?.href || '#';
      return `<a href="${href}" target="_blank" rel="noopener noreferrer">${node.props?.children || ''}</a>`;
      
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
        .map((option: { label: string, selected: boolean }, index: number) => `
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
        .map((option: { label: string, checked: boolean }, index: number) => `
          <label>
            <input type="checkbox" ${option.checked ? 'checked' : ''} />
            <span>${option.label}</span>
          </label>
        `)
        .join('\n');
      return `<div class="checkbox-group">${checkboxOptions}</div>`;
      
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
