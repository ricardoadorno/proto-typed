import { AstNode } from '../../types/astNode';
import { generateNavigationAttributes, generateHrefAttribute } from './navigationHelper';
import { elementStyles, getMarginClasses, getFormControlClasses, getScreenClasses } from './styles';

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
  
  // Check if screen has header, bottom nav, or FAB to add appropriate classes
  const hasHeader = screen.elements?.some(element => element.type === 'Header') || false;
  const hasBottomNav = screen.elements?.some(element => element.type === 'BottomNav') || false;
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
  
  const screenClasses = getScreenClasses([screenName.toLowerCase(), ...layoutClasses]);
  
  return `
  <div class="${screenClasses}" style="display: flex; flex-direction: column; min-height: 100vh;">
      <div style="flex: 1;">
        ${elementsHtml}
      </div>
      ${fabHtml}
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
  }
  
  switch (node.type) {
    case 'Screen':
    case 'screen':
      return renderScreenDirect(node);
    
    case 'component':
      // Components are stored but not directly rendered - they're instantiated
      return '';
    
    case 'component_instance':
      return renderComponentInstance(node, context);
    
    case 'modal':
      return renderModal(node, context);
      
    case 'Input':
      return renderInput(node);

    case 'Button':
      return renderButton(node, context);
      
    case 'Heading':
      return renderHeading(node);
      
    case 'Link':
      return renderLink(node);
      
    case 'Image':
      return renderImage(node);
      
    case 'OrderedList':
      return renderOrderedList(node);
      
    case 'UnorderedList':
      return renderUnorderedList(node);
      
    case 'Paragraph':
      return renderParagraph(node);
      
    case 'RadioGroup':
      return renderRadioGroup(node);
      
    case 'Select':
      return renderSelect(node);
      
    case 'Checkbox':
      return renderCheckbox(node);
      
    case 'Row':
      return renderRow(node, context);
      
    case 'Col':
      return renderCol(node, context);
      
    case 'List':
      return renderList(node, context);

    case 'ListItem':
      return renderListItem(node);
      
    case 'ComplexListItem':
      return renderComplexListItem(node);
      
    case 'Card':
      return renderCard(node, context);
      
    case 'Separator':
      return renderSeparator();
      
    case 'Header':
      return renderHeader(node);

    case 'BottomNav':
      return renderBottomNav(node);
        
    case 'drawer':
      return renderDrawer(node, context);

    case 'NavItem':
      return renderNavItem(node);
    
    case 'DrawerItem':
      return renderDrawerItem(node);

    case 'FAB':
      return renderFAB(node);
          
    case 'FABItem':
      return renderFABItem(node);
        
    default:
      console.warn(`Unknown node type: ${node.type}`);
      return '';
  }
}

/**
 * Render component instance
 */
function renderComponentInstance(node: AstNode, context?: string): string {
  const componentName = node.name;
  const components = findComponentDefinitions();
  const componentDef = components.find(comp => comp.name === componentName);
  
  if (!componentDef) {
    console.warn(`Component not found: ${componentName}`);
    return `<div class="component-instance error" data-component="${componentName}">Component not found: ${componentName}</div>`;
  }
  
  const componentElements = componentDef.elements || [];
  return componentElements
    .map(element => nodeToHtml(element, context))
    .join('\n');
}

/**
 * Render modal element
 */
function renderModal(node: AstNode, context?: string): string {
  const modalElements = node.elements ? node.elements.map(el => nodeToHtml(el, context)).join('\n') : '';
  
  return `<div class="modal hidden" id="modal-${node.name}" data-modal="${node.name}">
    <div class="modal-backdrop fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div class="modal-content bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4 p-6 relative" onclick="event.stopPropagation()">
        <button class="modal-close absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" onclick="toggleElement('${node.name}')">&times;</button>
        ${modalElements}
      </div>
    </div>
  </div>`;
}

/**
 * Render input element
 */
function renderInput(node: AstNode): string {
  const inputProps = node.props as any;
  let inputHtml = '';
  
  if (inputProps?.label) {
    inputHtml += `<label class="${elementStyles.label}">${inputProps.label}:${inputProps.required ? ' <span class="text-red-500">*</span>' : ''}\n`;
  }
  
  inputHtml += `  <input class="${elementStyles.input}" placeholder="${inputProps?.placeholder || ''}" />`;

  if (inputProps?.label) {
    inputHtml += '\n</label>';
  }
  
  return inputHtml;
}

/**
 * Render button element
 */
function renderButton(node: AstNode, context?: string): string {
  const buttonProps = node.props as any;
  const { children, href: buttonHref } = buttonProps || {};
  const buttonText = children || '';
  
  const buttonNavAttrs = generateNavigationAttributes(buttonHref);
  const marginClasses = getMarginClasses(context);
  const buttonClasses = `${elementStyles.button} ${marginClasses}`;
  
  return `<button class="${buttonClasses}" ${buttonNavAttrs}>${buttonText}</button>`;
}

/**
 * Render heading element
 */
function renderHeading(node: AstNode): string {
  const props = node.props as any;
  const level = props?.level || 1;
  const headingClasses = elementStyles.heading[level as keyof typeof elementStyles.heading] || elementStyles.heading[1];
  
  return `<h${level} class="${headingClasses}">${props?.children || ''}</h${level}>`;
}

/**
 * Render link element
 */
function renderLink(node: AstNode): string {
  const props = node.props as any;
  const href = props?.href || '#';
  const linkText = props?.children || '';
  
  const linkNavAttrs = generateNavigationAttributes(href);
  const linkHref = generateHrefAttribute(href);
  
  return `<a class="${elementStyles.link}" ${linkHref} ${linkNavAttrs}>${linkText}</a>`;
}

/**
 * Render image element
 */
function renderImage(node: AstNode): string {
  const props = node.props as any;
  const src = props?.src || '';
  const alt = props?.alt || '';
  return `<img src="${src}" alt="${alt}" class="${elementStyles.image}" />`;
}

/**
 * Render ordered list element
 */
function renderOrderedList(node: AstNode): string {
  const props = node.props as any;
  const olItems = (props?.items || [])
    .map((item: string) => `<li class="${elementStyles.listItem}">${item}</li>`)
    .join('\n');
  return `<ol class="${elementStyles.orderedList}">${olItems}</ol>`;
}

/**
 * Render unordered list element
 */
function renderUnorderedList(node: AstNode): string {
  const props = node.props as any;
  const ulItems = (props?.items || [])
    .map((item: string) => `<li class="${elementStyles.listItem}">${item}</li>`)
    .join('\n');
  return `<ul class="${elementStyles.unorderedList}">${ulItems}</ul>`;
}

/**
 * Render paragraph element
 */
function renderParagraph(node: AstNode): string {
  const props = node.props as any;
  const rawVariant = props?.variant;
  const effectiveVariant = 
    typeof rawVariant === 'string' && (rawVariant in elementStyles.paragraph) 
    ? rawVariant as keyof typeof elementStyles.paragraph
    : 'default';
  
  const paragraphClasses = elementStyles.paragraph[effectiveVariant];
  
  return `<p class="${paragraphClasses}">${props?.children || ''}</p>`;
}

/**
 * Render radio group element
 */
function renderRadioGroup(node: AstNode): string {
  const props = node.props as any;
  const radioName = `radio-group-${Math.random().toString(36).substring(7)}`;
  const radioOptions = (props?.options || [])
    .map((option: { label: string, selected: boolean }) => `
      <label class="${getFormControlClasses()} mb-2">
        <input type="radio" name="${radioName}" ${option.selected ? 'checked' : ''} class="${elementStyles.radio}" />
        <span class="text-gray-700 dark:text-gray-300">${option.label}</span>
      </label>
    `)
    .join('\n');
  return `<div class="space-y-2">${radioOptions}</div>`;
}

/**
 * Render select element
 */
function renderSelect(node: AstNode): string {
  const selectProps = node.props as any;
  let selectHtml = '';
  
  if (selectProps?.label) {
    selectHtml += `<label class="${elementStyles.label}">${selectProps.label}:${selectProps.required ? ' <span class="text-red-500">*</span>' : ''}\n`;
  }
  
  const optionsHtml = (selectProps?.options || [])
    .map((option: string) => {
      if (selectProps?.placeholder && option === selectProps.options[0]) {
        return `<option value="" disabled selected>${selectProps.placeholder}</option>
<option value="${option}">${option}</option>`;
      }
      return `<option value="${option}">${option}</option>`;
    })
    .join('\n');
  
  selectHtml += `  <select class="${elementStyles.select}">${optionsHtml}</select>`;
  
  if (selectProps?.label) {
    selectHtml += '\n</label>';
  }
  
  return selectHtml;
}

/**
 * Render checkbox element
 */
function renderCheckbox(node: AstNode): string {
  const props = node.props as any;
  const checked = props?.checked || false;
  const label = props?.label || '';
  return `
    <label class="${getFormControlClasses()}">
      <input type="checkbox" ${checked ? 'checked' : ''} class="${elementStyles.checkbox}" />
      <span class="text-gray-700 dark:text-gray-300">${label}</span>
    </label>
  `;
}

/**
 * Render row element
 */
function renderRow(node: AstNode, context?: string): string {
  const rowElements = node.elements?.flat().map(element => nodeToHtml(element, context)).join('\n') || '';
  return `<div class="${elementStyles.row}">${rowElements}</div>`;
}

/**
 * Render col element
 */
function renderCol(node: AstNode, context?: string): string {
  const colElements = node.elements?.flat().map(element => nodeToHtml(element, context)).join('\n') || '';
  return `<div class="${elementStyles.col}">${colElements}</div>`;
}

/**
 * Render list element
 */
function renderList(node: AstNode, context?: string): string {
  const listItems = node.elements?.flat().map(item => nodeToHtml(item, context)).join('\n') || '';
  return `<div class="space-y-3">${listItems}</div>`;
}

/**
 * Render list item element
 */
function renderListItem(node: AstNode): string {
  const props = node.props as any;
  const { text } = props || {};
  
  return `
    <div class="${elementStyles.simpleListItem}">
      <span class="text-gray-700 dark:text-gray-300">${text || ''}</span>
    </div>
  `;
}

/**
 * Render complex list item element
 */
function renderComplexListItem(node: AstNode): string {
  const props = node.props as any;
  const { leadingImage, mainText, subText, trailingImage } = props || {};
  
  return `
    <div class="${elementStyles.complexListItem}">
      <img src="${leadingImage || ''}" alt="Leading image" class="w-10 h-10 object-cover rounded-full" />
      <div class="flex-1 mx-4">
        <div class="text-gray-900 dark:text-white font-medium">${mainText || ''}</div>
        <div class="text-sm text-gray-500 dark:text-gray-400">${subText || ''}</div>
      </div>
      <img src="${trailingImage || ''}" alt="Trailing image" class="w-8 h-8 object-cover rounded" />
    </div>
  `;
}

/**
 * Render card element
 */
function renderCard(node: AstNode, context?: string): string {
  const cardElements = node.elements?.flat().map(element => nodeToHtml(element, context)).join('\n') || '';
  return `<article class="${elementStyles.card}">${cardElements}</article>`;
}

/**
 * Render separator element
 */
function renderSeparator(): string {
  return `<hr class="${elementStyles.separator}">`;
}

/**
 * Render header element
 */
function renderHeader(node: AstNode): string {
  const headerElements = node.elements?.flat().map(element => nodeToHtml(element, 'header')).join('\n') || '';
  return `<header class="${elementStyles.header}">${headerElements}</header>`;
}

/**
 * Render bottom navigation element
 */
function renderBottomNav(node: AstNode): string {
  const navItems = node.elements?.map(item => {
    if (item.type === 'NavItem') {
      const navItemProps = item.props as any;
      const { label, icon, action } = navItemProps || {};
      const navAttrs = generateNavigationAttributes(action);
      
      return `
        <button class="${elementStyles.navItem}" ${navAttrs}>
          <span class="mb-1">${icon || ''}</span>
          <span>${label || ''}</span>
        </button>
      `;
    }
    return '';
  }).join('') || '';
  return `<nav class="${elementStyles.bottomNav}" style="margin-top: auto; order: 999;">${navItems}</nav>`;
}

/**
 * Render drawer element
 */
function renderDrawer(node: AstNode, context?: string): string {
  // Only handle named drawers (modern pattern)
  if (!node.name) {
    console.warn('Drawer element requires a name. Legacy unnamed drawers are deprecated.');
    return '';
  }

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
}

/**
 * Render navigation item element
 */
function renderNavItem(node: AstNode): string {
  const navItemProps = node.props as any;
  const { label: navLabel, icon: navIcon, action: navAction } = navItemProps || {};
  const navItemAttrs = generateNavigationAttributes(navAction);
  
  return `
    <button class="${elementStyles.navItem}" ${navItemAttrs}>
      <span class="mb-1">${navIcon || ''}</span>
      <span>${navLabel || ''}</span>
    </button>
  `;
}

/**
 * Render drawer item element
 */
function renderDrawerItem(node: AstNode): string {
  const drawerItemProps = node.props as any;
  const { label: drawerLabel, icon: drawerIcon, action: drawerAction } = drawerItemProps || {};
  const drawerItemAttrs = generateNavigationAttributes(drawerAction);
  
  return `
    <button class="${elementStyles.drawerItem}" ${drawerItemAttrs}>
      <span class="mr-3 text-lg">${drawerIcon || ''}</span>
      <span>${drawerLabel || ''}</span>
    </button>
  `;
}

/**
 * Render FAB (Floating Action Button) element
 */
function renderFAB(node: AstNode): string {
  const fabProps = node.props as any;
  const { icon: fabIcon, action: fabAction } = fabProps || {};
  const fabAttrs = generateNavigationAttributes(fabAction);
  
  const fabItems = node.elements?.filter(el => el.type === 'FABItem') || [];
  
  if (fabItems.length > 0) {
    const fabItemsHtml = fabItems.map(item => {
      const itemProps = item.props as any;
      const { icon: itemIcon, label: itemLabel, action: itemAction } = itemProps || {};
      const itemAttrs = generateNavigationAttributes(itemAction);
      
      return `
        <div class="${elementStyles.fabItem}">
          <button class="${elementStyles.fabItemBtn} w-12 h-12 rounded-full text-lg" ${itemAttrs}>
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
        <button class="${elementStyles.fab}" onclick="toggleFAB(this)" ${fabAttrs}>
          ${fabIcon || '+'}
        </button>
      </div>
    `;
  } else {
    return `
      <button class="${elementStyles.fab}" ${fabAttrs}>
        ${fabIcon || '+'}
      </button>
    `;
  }
}

/**
 * Render FAB item element
 */
function renderFABItem(node: AstNode): string {
  const fabItemProps = node.props as any;
  const { icon: fabItemIcon, label: fabItemLabel, action: fabItemAction } = fabItemProps || {};
  const fabItemAttrs = generateNavigationAttributes(fabItemAction);
  
  return `
    <div class="${elementStyles.fabItem}">
      <button class="${elementStyles.fabItemBtn}" ${fabItemAttrs}>
        ${fabItemIcon || ''}
      </button>
      <span class="${elementStyles.fabItemLabel}">${fabItemLabel || ''}</span>
    </div>
  `;
}