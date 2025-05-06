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
      let inputHtml = '';
      
      // Only create label if it exists
      if (inputProps.label) {
        inputHtml += `<label>${inputProps.label}:${inputProps.required ? ' *' : ''}\n`;
      }
      
      // Create the input element with all attributes
      const inputAttributes = {
        ...inputProps,
        // Remove properties that aren't HTML attributes
        label: undefined,
        children: undefined
      };
      
      inputHtml += `  <input ${attributesToHtml(inputAttributes)} />`;
      
      // Close the label if it was opened
      if (inputProps.label) {
        inputHtml += '\n</label>';
      }
      
      return inputHtml;
      
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
      const selectProps = node.props || {};
      let selectHtml = '';
      
      // Only create label if it exists
      if (selectProps.label) {
        selectHtml += `<label>${selectProps.label}:${selectProps.required ? ' *' : ''}\n`;
      }
      
      // Create the select element with proper attributes
      const selectAttributes = {
        ...selectProps,
        // Remove properties that are handled separately
        label: undefined,
        options: undefined,
        children: undefined
      };
      
      // Create options from array
      const optionsHtml = (selectProps.options || [])
        .map((option: string) => {
          if (selectProps.placeholder && option === selectProps.options[0]) {
            return `<option value="" disabled selected>${selectProps.placeholder}</option>
<option value="${option}">${option}</option>`;
          }
          return `<option value="${option}">${option}</option>`;
        })
        .join('\n');
      
      selectHtml += `  <select ${attributesToHtml(selectAttributes)}>${optionsHtml}</select>`;
      
      // Only close the label if it was opened
      if (selectProps.label) {
        selectHtml += '\n</label>';
      }
      
      return selectHtml;
      
    case 'Checkbox':
      const checked = node.props?.checked || false;
      const label = node.props?.label || '';
      return `
        <label>
          <input type="checkbox" ${checked ? 'checked' : ''} />
          <span>${label}</span>
        </label>
      `;
      
    case 'Row':
      const rowElements = node.elements?.flat().map(element => nodeToHtml(element)).join('\n') || '';
      return `<div >${rowElements}</div>`;
      
    case 'Col':
      const colElements = node.elements?.flat().map(element => nodeToHtml(element)).join('\n') || '';
      return `<div class="grid">${colElements}</div>`;
      
    case 'Card':
      const cardElements = node.elements?.flat().map(element => nodeToHtml(element)).join('\n') || '';
      return `<article class="card">${cardElements}</article>`;
      
    case 'Separator':
      return `<hr>`;
      
    default:
      console.warn(`Unknown node type: ${node.type}`);
      return '';
  }
}