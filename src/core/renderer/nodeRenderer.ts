import { AstNode } from '../../types/astNode';
import { attributesToHtml } from './utils';
import { screenToHtml } from './screenRenderer';

/**
 * Convert an AST node to HTML
 */
export function nodeToHtml(node: AstNode): string {
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
      
    case 'Checkbox':
      const checked = node.props?.checked || false;
      const label = node.props?.label || '';
      return `
        <label>
          <input type="checkbox" ${checked ? 'checked' : ''} />
          <span>${label}</span>
        </label>
      `;
      
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