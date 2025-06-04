import { AstNode } from '../../types/astNode';
import { generateNavigationAttributes, generateHrefAttribute } from './navigationHelper';

// Global variable to store component definitions
let globalComponentDefinitions: AstNode[] = [];

/**
 * Set the available component definitions
 */
export function setComponentDefinitions(components: AstNode[]) {
  globalComponentDefinitions = components;
}

/**
 * Find all component definitions that are available in the current context
 */
function findComponentDefinitions(): AstNode[] {
  return globalComponentDefinitions;
}

/**
 * Helper function to render screen directly without circular dependency
 */
function renderScreenDirect(screen: AstNode): string {
  const screenName = screen.name || '';
  
  // Check if screen has header, bottom nav, drawer, or FAB to add appropriate classes
  const hasHeader = screen.elements?.some(element => element.type === 'Header') || false;
  const hasBottomNav = screen.elements?.some(element => element.type === 'BottomNav') || false;
  const hasDrawer = screen.elements?.some(element => element.type === 'Drawer') || false;
  const hasFAB = screen.elements?.some(element => element.type === 'FAB') || false;
  
  const layoutClasses = [];
  if (hasHeader) layoutClasses.push('has-header');
  if (hasBottomNav) layoutClasses.push('has-bottom-nav');
  if (hasFAB) layoutClasses.push('has-fab');
  
  // Separate FAB elements from other elements for proper positioning
  const fabElements = screen.elements?.filter(element => element.type === 'FAB') || [];
  const otherElements = screen.elements?.filter(element => element.type !== 'FAB') || [];
  
  const elementsHtml = otherElements
    ?.filter(element => element != null)
    .map(element => nodeToHtml(element))
    .join('\n      ') || '';
    
  const fabHtml = fabElements
    ?.map(element => nodeToHtml(element))
    .join('\n      ') || '';
  
  // Add drawer overlay if drawer is present
  const drawerOverlay = hasDrawer ? '\n      <div class="drawer-overlay"></div>' : '';
  
  return `
  <div class="screen container ${screenName.toLowerCase()} ${layoutClasses.join(' ')}" style="display: flex; flex-direction: column; min-height: 100vh;">
      <div style="flex: 1;">
        ${elementsHtml}
      </div>
      ${fabHtml}${drawerOverlay}
  </div>
  `.trim();
}

/**
 * Convert an AST node to HTML
 */
export function nodeToHtml(node: AstNode, context?: string): string {
    if (!node || !node.type) {
    console.warn('Invalid node received:', node);
    return '';
  }    switch (node.type) {
    case 'Screen':
    case 'screen':
      return renderScreenDirect(node);
    
    case 'component':
      // Components are stored but not directly rendered - they're instantiated
      return '';
      case 'component_instance':
      // Lookup the component definition from all available components
      const componentName = node.name;
      const components = findComponentDefinitions();
      const componentDef = components.find(comp => comp.name === componentName);
      
      if (!componentDef) {
        console.warn(`Component not found: ${componentName}`);
        return `<div class="component-instance error" data-component="${componentName}">Component not found: ${componentName}</div>`;
      }      // Render all elements from the component definition
      const componentElements = componentDef.elements || [];
      return componentElements
        .map(element => nodeToHtml(element, context))
        .join('\n');    case 'modal':
      const modalElements = node.elements ? node.elements.map(el => nodeToHtml(el, context)).join('\n') : '';
      
      return `<div class="modal hidden" id="modal-${node.name}" data-modal="${node.name}">
        <div class="modal-backdrop fixed inset-0 bg-black/60  flex items-center justify-center z-50">
          <div class="modal-content bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 p-6 relative" onclick="event.stopPropagation()">
            <button class="modal-close absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" onclick="toggleElement('${node.name}')">&times;</button>
            ${modalElements}
          </div>
        </div>
      </div>`;
        
    case 'Input':
      const inputProps = node.props || {};
      let inputHtml = '';
      
      // Only create label if it exists
      if (inputProps.label) {
        inputHtml += `<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">${inputProps.label}:${inputProps.required ? ' <span class="text-red-500">*</span>' : ''}\n`;
      }
        // Create the input element with all attributes
      const inputClasses = 'w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400';
      
      inputHtml += `  <input class="${inputClasses}"  />`;
      
      // Close the label if it was opened
      if (inputProps.label) {
        inputHtml += '\n</label>';
      }
      
      return inputHtml;case 'Button':      const buttonProps = node.props || {};
      const { children, icon, href: buttonHref, variant = 'primary', size = 'md' } = buttonProps;
      const buttonText = children || '';
      const buttonIcon = icon ? `<span class="inline-flex items-center mr-2">${icon}</span>` : '';
        // Use navigation helper for button actions
      const buttonNavAttrs = generateNavigationAttributes(buttonHref);
      
      // Tailwind classes based on variant and size
      const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200';
        const variantClassMap: Record<string, string> = {
        primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
        secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900 focus:ring-gray-500',
        outline: 'border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 focus:ring-blue-500',
        ghost: 'text-gray-700 hover:bg-gray-100 focus:ring-gray-500',
        danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500'
      };
      
      const sizeClassMap: Record<string, string> = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-3 text-base'
      };
      
      const variantClasses = variantClassMap[variant] || variantClassMap.primary;
      const sizeClasses = sizeClassMap[size] || sizeClassMap.md;
      
      // Adjust margin for header context
      const marginClasses = context === 'header' ? '' : 'mr-4 mb-4';
      
      const buttonClasses = `${baseClasses} ${variantClasses} ${sizeClasses} ${marginClasses}`;
      
      return `<button class="${buttonClasses}" ${buttonNavAttrs}>${buttonIcon}${buttonText}</button>`;
    case 'Heading':
      const level = node.props?.level || 1;
      const headingClassMap: Record<number, string> = {
        1: 'text-4xl font-bold text-gray-900 dark:text-white mb-6',
        2: 'text-3xl font-bold text-gray-900 dark:text-white mb-5',
        3: 'text-2xl font-bold text-gray-900 dark:text-white mb-4',
        4: 'text-xl font-bold text-gray-900 dark:text-white mb-3',
        5: 'text-lg font-bold text-gray-900 dark:text-white mb-2',
        6: 'text-base font-bold text-gray-900 dark:text-white mb-2'
      };
      
      const headingClasses = headingClassMap[level] || headingClassMap[1];
      
      return `<h${level} class="${headingClasses}">${node.props?.children || ''}</h${level}>`;
      case 'Link':
      const href = node.props?.href || '#';
      const linkText = node.props?.children || '';
      
      // Use navigation helper for links
      const linkNavAttrs = generateNavigationAttributes(href);
      const linkHref = generateHrefAttribute(href);
      
      const linkClasses = 'text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline transition-colors duration-200';
      
      return `<a class="${linkClasses}" ${linkHref} ${linkNavAttrs}>${linkText}</a>`;
        case 'Image':
      const src = node.props?.src || '';
      const alt = node.props?.alt || '';
      return `<img src="${src}" alt="${alt}" class="max-w-full h-auto rounded-lg shadow-md" />`;
          case 'OrderedList':
      const olItems = (node.props?.items || [])
        .map((item: string) => `<li class="mb-2">${item}</li>`)
        .join('\n');
      return `<ol class="list-decimal list-inside space-y-2 mb-4 text-gray-700 dark:text-gray-300">${olItems}</ol>`;
        case 'UnorderedList':
      const ulItems = (node.props?.items || [])
        .map((item: string) => `<li class="mb-2">${item}</li>`)
        .join('\n');
      return `<ul class="list-disc list-inside space-y-2 mb-4 text-gray-700 dark:text-gray-300">${ulItems}</ul>`;
        case 'Paragraph':
      const paragraphClassMap = {
        default: 'text-gray-700 dark:text-gray-300 mb-4 leading-relaxed',
        note: 'text-sm text-gray-600 dark:text-gray-400 mb-3 italic',
        quote: 'border-l-4 border-blue-500 pl-4 text-gray-600 dark:text-gray-400 italic mb-4'
      };
      type ParagraphVariantKey = keyof typeof paragraphClassMap;

      const rawVariant = node.props?.variant;
      // Determine the key to use for classMap, defaulting to 'default'
      const effectiveVariant: ParagraphVariantKey = 
        typeof rawVariant === 'string' && (rawVariant in paragraphClassMap) 
        ? rawVariant as ParagraphVariantKey // Cast is safe due to the check
        : 'default';
      
      const paragraphClasses = paragraphClassMap[effectiveVariant];
      
      return `<p class="${paragraphClasses}">${node.props?.children || ''}</p>`;
          case 'RadioGroup':
      const radioName = `radio-group-${Math.random().toString(36).substring(7)}`;
      const radioOptions = (node.props?.options || [])
        .map((option: { label: string, selected: boolean }) => `
          <label class="flex items-center space-x-3 mb-2 cursor-pointer">
            <input type="radio" name="${radioName}" ${option.selected ? 'checked' : ''} class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
            <span class="text-gray-700 dark:text-gray-300">${option.label}</span>
          </label>
        `)
        .join('\n');
      return `<div class="space-y-2">${radioOptions}</div>`;
        case 'Select':
      const selectProps = node.props || {};
      let selectHtml = '';
      
      // Only create label if it exists
      if (selectProps.label) {
        selectHtml += `<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">${selectProps.label}:${selectProps.required ? ' <span class="text-red-500">*</span>' : ''}\n`;
      }
      
      const selectClasses = 'w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-400';
      
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
      
      selectHtml += `  <select class="${selectClasses}">${optionsHtml}</select>`;
      
      // Only close the label if it was opened
      if (selectProps.label) {
        selectHtml += '\n</label>';
      }
      
      return selectHtml;
        case 'Checkbox':
      const checked = node.props?.checked || false;
      const label = node.props?.label || '';
      return `
        <label class="flex items-center space-x-3 cursor-pointer">
          <input type="checkbox" ${checked ? 'checked' : ''} class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
          <span class="text-gray-700 dark:text-gray-300">${label}</span>
        </label>
      `;    case 'Row':
      const rowElements = node.elements?.flat().map(element => nodeToHtml(element, context)).join('\n') || '';
      return `<div class="flex flex-wrap gap-4 mb-4">${rowElements}</div>`;
    case 'Col':
      const colElements = node.elements?.flat().map(element => nodeToHtml(element, context)).join('\n') || '';
      return `<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">${colElements}</div>`;
    case 'List':
      const listItems = node.elements?.flat().map(item => nodeToHtml(item, context)).join('\n') || '';
      return `<div class="space-y-3">${listItems}</div>`;case 'ListItem':
      const { text } = node.props || {};
      
      // Handle simple text-based list items
      return `
        <div class="flex justify-between items-center p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
          <span class="text-gray-700 dark:text-gray-300">${text || ''}</span>
        </div>
      `;    case 'ComplexListItem':
      const { leadingImage, mainText, subText, trailingImage } = node.props || {};
      
      // Handle complex list items with images and subtexts
      return `
        <div class="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
          <img src="${leadingImage || ''}" alt="Leading image" class="w-10 h-10 object-cover rounded-full" />
          <div class="flex-1 mx-4">
            <div class="text-gray-900 dark:text-white font-medium">${mainText || ''}</div>
            <div class="text-sm text-gray-500 dark:text-gray-400">${subText || ''}</div>
          </div>
          <img src="${trailingImage || ''}" alt="Trailing image" class="w-8 h-8 object-cover rounded" />
        </div>
      `;    case 'Card':
      const cardElements = node.elements?.flat().map(element => nodeToHtml(element, context)).join('\n') || '';
      return `<article class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg p-6 mb-6">${cardElements}</article>`;
        case 'Separator':
      return `<hr class="my-6 border-gray-200 dark:border-gray-700">`;
      case 'Header':
      const headerElements = node.elements?.flat().map(element => nodeToHtml(element, 'header')).join('\n') || '';
      return `<header class="header fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 shadow-sm  border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center justify-between">${headerElements}</header>`;case 'BottomNav':
      const navItems = node.elements?.map(item => {
        if (item.type === 'NavItem') {
          const { label, icon, action } = item.props || {};
            // Use navigation helper for nav items
          const navAttrs = generateNavigationAttributes(action);
          
          return `
            <button class="flex flex-col items-center justify-center py-2 px-1 text-xs font-medium text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-500 transition-colors duration-200" ${navAttrs}>
              <span class="mb-1">${icon || ''}</span>
              <span>${label || ''}</span>
            </button>
          `;        }
        return '';      }).join('') || '';
      return `<nav class="bottom bottom-nav bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex flex-row justify-around py-1 z-50" style="margin-top: auto; order: 999;">${navItems}</nav>`;
      
    case 'Drawer':
    case 'drawer':
        // Handle named drawers (new pattern) like modals
        if (node.name) {
          const drawerElements = node.elements ? node.elements.map(el => nodeToHtml(el, context)).join('\n') : '';
          return `<div class="drawer-container hidden" id="drawer-${node.name}" data-drawer="${node.name}">
            <div class="drawer-overlay fixed inset-0 bg-black bg-opacity-30 z-[1050]"></div>
            <aside class="drawer-content fixed top-0 left-0 z-[1100] w-64 h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-lg transform -translate-x-full transition-transform duration-300 ease-in-out">
              <div class="p-4">
                <button class="drawer-close absolute top-4 right-4 text-gray-500 hover:text-gray-700" data-nav="${node.name}" data-nav-type="internal">&times;</button>
                ${drawerElements}
              </div>
            </aside>
          </div>`;
        } else {
          // Handle legacy drawer items pattern
          const drawerItems = node.elements?.map(item => {
            if (item.type === 'DrawerItem') {
              const { label, icon, action } = item.props || {};
              // Use navigation helper for drawer items
              const navAttrs = generateNavigationAttributes(action);
              
              return `
                <button class="flex items-center w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors duration-200" ${navAttrs}>
                  <span class="mr-3 text-lg">${icon || ''}</span>
                  <span>${label || ''}</span>
                </button>
              `;
            }
            return '';
          }).join('') || '';
          return `<aside class="drawer fixed top-0 left-0 z-40 w-64 h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-lg transform -translate-x-full transition-transform duration-300 ease-in-out">${drawerItems}</aside>`;
        }

    case 'NavItem':
      const { label: navLabel, icon: navIcon, action: navAction } = node.props || {};
      // Use navigation helper for nav items
      const navItemAttrs = generateNavigationAttributes(navAction);
      
      return `
        <button class="flex flex-col items-center justify-center py-2 px-1 text-xs font-medium text-gray-500 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-500 transition-colors duration-200" ${navItemAttrs}>
          <span class="mb-1">${navIcon || ''}</span>
          <span>${navLabel || ''}</span>
        </button>
      `;
    
    case 'DrawerItem':
      const { label: drawerLabel, icon: drawerIcon, action: drawerAction } = node.props || {};
      
      // Use navigation helper for drawer items
      const drawerItemAttrs = generateNavigationAttributes(drawerAction);
      
      return `
        <button class="flex items-center w-full px-4 py-3 text-left text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors duration-200" ${drawerItemAttrs}>
          <span class="mr-3 text-lg">${drawerIcon || ''}</span>
          <span>${drawerLabel || ''}</span>
        </button>
      `;        case 'FAB':
      const { icon: fabIcon, action: fabAction } = node.props || {};
      
      // Use navigation helper for FAB actions
      const fabAttrs = generateNavigationAttributes(fabAction);
      
      // Check if FAB has fab_items
      const fabItems = node.elements?.filter(el => el.type === 'FABItem') || [];
      
      if (fabItems.length > 0) {
        // Generate fab items HTML
        const fabItemsHtml = fabItems.map(item => {
          const itemProps = item.props as any; // Cast to any to access dynamic properties
          const { icon: itemIcon, label: itemLabel, action: itemAction } = itemProps || {};
          const itemAttrs = generateNavigationAttributes(itemAction);
          
          return `
            <div class="fab-item">
              <button class="fab-item-btn w-12 h-12 rounded-full flex items-center justify-center text-lg" ${itemAttrs}>
                ${itemIcon || ''}
              </button>
              ${itemLabel ? `<span class="fab-item-label">${itemLabel}</span>` : ''}
            </div>
          `;
        }).join('');
        
        return `
          <div class="fab-container">
            <div class="fab-items-list">
              ${fabItemsHtml}
            </div>
            <button class="fab w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold" onclick="toggleFAB(this)" ${fabAttrs}>
              ${fabIcon || '+'}
            </button>
          </div>
        `;
      } else {
        // Simple FAB without items
        return `
          <button class="fab w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold" ${fabAttrs}>
            ${fabIcon || '+'}
          </button>
        `;
      }
        case 'FABItem':
      const fabItemProps = node.props as any; // Cast to any for dynamic properties
      const { icon: fabItemIcon, label: fabItemLabel, action: fabItemAction } = fabItemProps || {};
      const fabItemAttrs = generateNavigationAttributes(fabItemAction);
      
      return `
        <div class="fab-item flex items-center">
          <button class="fab-item-btn w-10 h-10 rounded-full flex items-center justify-center text-sm transition-all duration-200 transform hover:scale-110" ${fabItemAttrs}>
            ${fabItemIcon || ''}
          </button>
          <span class="fab-item-label ml-2 text-sm font-medium">${fabItemLabel || ''}</span>
        </div>
      `;
      
    default:
      console.warn(`Unknown node type: ${node.type}`);
      return '';
  }
}