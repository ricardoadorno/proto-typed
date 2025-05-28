import { AstNode } from '../../types/astNode';
import { attributesToHtml } from './utils';
import { screenToHtml } from './screenRenderer';
import { generateNavigationAttributes, generateOnClickHandler, generateHrefAttribute } from './navigationHelper';

/**
 * Convert an AST node to HTML
 */
export function nodeToHtml(node: AstNode, context?: string): string {
  
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
      
      return inputHtml;    case 'Button':
      const buttonProps = node.props || {};
      const { children, icon, href: buttonHref, ...otherProps } = buttonProps;
      const buttonText = children || '';
      const buttonIcon = icon ? `<span class="button-icon">${icon}</span> ` : '';
      
      // Use navigation helper for button actions
      const buttonNavAttrs = generateNavigationAttributes(buttonHref);
      const buttonOnClick = generateOnClickHandler(buttonHref);
      
      // Remove default margin if button is in header context
      const buttonStyle = context === 'header' ? '' : 'style="margin: 1rem 1rem 1rem 0"';
      
      return `<button ${buttonStyle} ${attributesToHtml(otherProps)} ${buttonNavAttrs}${buttonOnClick}>${buttonIcon}${buttonText}</button>`;
      
    case 'Heading':
      const level = node.props?.level || 1;
      return `<h${level}>${node.props?.children || ''}</h${level}>`;
          case 'Link':
      const href = node.props?.href || '#';
      const linkText = node.props?.children || '';
      
      // Use navigation helper for links
      const linkNavAttrs = generateNavigationAttributes(href);
      const linkHref = generateHrefAttribute(href);
      
      return `<a ${linkHref} ${linkNavAttrs}>${linkText}</a>`;
      
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
      const rowElements = node.elements?.flat().map(element => nodeToHtml(element, context)).join('\n') || '';
      return `<div >${rowElements}</div>`;
        case 'Col':
      const colElements = node.elements?.flat().map(element => nodeToHtml(element, context)).join('\n') || '';
      return `<div class="grid">${colElements}</div>`;
        case 'List':
      const listItems = node.elements?.flat().map(item => nodeToHtml(item, context)).join('\n') || '';
      return `<div class="list">${listItems}</div>`;
      
    case 'ListItem':
      const { leadingImage, mainText, subText, trailingImage } = node.props || {};
      return `
        <div class="list-item">
          <img src="${leadingImage || ''}" alt="Leading image" class="list-item-image" />
          <div class="list-item-content">
            <div class="list-item-main-text">${mainText || ''}</div>
            <div class="list-item-sub-text">${subText || ''}</div>
          </div>
          <img src="${trailingImage || ''}" alt="Trailing image" class="list-item-image" />
        </div>
      `;        case 'Card':
      const cardElements = node.elements?.flat().map(element => nodeToHtml(element, context)).join('\n') || '';
      return `<article class="card">${cardElements}</article>`;
      
    case 'Separator':
      return `<hr>`;    // Mobile Layout Components
    case 'Header':
      const headerElements = node.elements?.flat().map(element => nodeToHtml(element, 'header')).join('\n') || '';
      return `<header class="header">${headerElements}</header>`;    case 'BottomNav':
      const navItems = node.elements?.map(item => {
        if (item.type === 'NavItem') {
          const { label, icon, action } = item.props || {};
          
          // Use navigation helper for nav items
          const navAttrs = generateNavigationAttributes(action);
          const onClick = generateOnClickHandler(action);
          
          return `
            <button class="nav-item" ${navAttrs}${onClick}>
              <span class="nav-icon">${icon || ''}</span>
              <span class="nav-label">${label || ''}</span>
            </button>
          `;
        }
        return '';
      }).join('') || '';
      return `<nav class="bottom-nav">${navItems}</nav>`;    
      
      case 'Drawer':
      const drawerItems = node.elements?.map(item => {
        if (item.type === 'DrawerItem') {
          const { label, icon, action } = item.props || {};
          
          // Use navigation helper for drawer items
          const navAttrs = generateNavigationAttributes(action);
          const onClick = generateOnClickHandler(action);
          
          return `
            <button class="drawer-item" ${navAttrs}${onClick}>
              <span class="drawer-icon">${icon || ''}</span>
              <span class="drawer-label">${label || ''}</span>
            </button>
          `;
        }
        return '';
      }).join('') || '';
      return `<aside class="drawer">${drawerItems}</aside>`;case 'NavItem':
      const { label: navLabel, icon: navIcon, action: navAction } = node.props || {};
      
      // Use navigation helper for nav items
      const navItemAttrs = generateNavigationAttributes(navAction);
      const navItemOnClick = generateOnClickHandler(navAction);
      
      return `
        <button class="nav-item" ${navItemAttrs}${navItemOnClick}>
          <span class="nav-icon">${navIcon || ''}</span>
          <span class="nav-label">${navLabel || ''}</span>
        </button>
      `;

    case 'DrawerItem':
      const { label: drawerLabel, icon: drawerIcon, action: drawerAction } = node.props || {};
      
      // Use navigation helper for drawer items
      const drawerItemAttrs = generateNavigationAttributes(drawerAction);
      const drawerItemOnClick = generateOnClickHandler(drawerAction);
      
      return `
        <button class="drawer-item" ${drawerItemAttrs}${drawerItemOnClick}>
          <span class="drawer-icon">${drawerIcon || ''}</span>
          <span class="drawer-label">${drawerLabel || ''}</span>
        </button>
      `;
      
    default:
      console.warn(`Unknown node type: ${node.type}`);
      return '';
  }
}