import { AstNode } from '../../../types/ast-node';
import { elementStyles, getListInlineStyles, getUnorderedListInlineStyles, getFabInlineStyles, getNavigatorInlineStyles } from './styles/styles';
import { findComponentDefinitions, substitutePropsInElement } from './components.node';
import { NavigationMediator } from '../infrastructure/navigation-mediator';
import { isLucideIcon, getLucideSvg } from '../../../utils/icon-utils';

/**
 * Canonical Layout Presets
 * Each layout type maps to predefined Tailwind classes + shadcn styling
 */
const LAYOUT_PRESETS: Record<string, string> = {
  // Containers
  'container': 'max-w-5xl mx-auto px-4',
  'container-narrow': 'max-w-2xl mx-auto px-4',
  'container-wide': 'max-w-7xl mx-auto px-6',
  'container-full': 'w-full',
  
  // Stacks (Vertical)
  'stack': 'flex flex-col gap-4',
  'stack-tight': 'flex flex-col gap-2',
  'stack-loose': 'flex flex-col gap-8',
  
  // Rows (Horizontal)
  'row-start': 'flex items-center gap-4',
  'row-center': 'flex items-center justify-center gap-4',
  'row-between': 'flex items-center justify-between',
  'row-end': 'flex items-center justify-end gap-4',
  
  // Grids
  'grid-2': 'grid grid-cols-2 gap-4',
  'grid-3': 'grid grid-cols-3 gap-4',
  'grid-4': 'grid grid-cols-4 gap-4',
  'grid-auto': 'grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4',
  
  // Cards
  'card': 'border rounded-lg p-6',
  'card-compact': 'border rounded-lg p-4',
  'card-feature': 'border-2 rounded-xl p-8 shadow-lg',
  
  // Special
  'header': 'sticky top-0 border-b px-4 py-3',
  'sidebar': 'h-full border-r p-4',
};

/**
 * Get inline styles for layout based on type
 */
function getLayoutInlineStyles(layoutType: string): string {
  // Only cards, header, and sidebar get background colors
  // All other layouts (stacks, grids, containers, rows) are transparent
  
  if (layoutType.startsWith('card')) {
    return 'background-color: var(--card); color: var(--card-foreground); border-color: var(--border);';
  }
  
  if (layoutType === 'header' || layoutType === 'sidebar') {
    return 'background-color: var(--background); border-color: var(--border);';
  }
  
  // Transparent for stacks, grids, containers, rows
  return '';
}

/**
 * Render layout element with canonical preset
 */
export function renderLayout(node: AstNode, _render: (node: AstNode, context?: string) => string): string {
  const { layoutType } = node.props as any;
  const classes = LAYOUT_PRESETS[layoutType] || '';
  const styles = getLayoutInlineStyles(layoutType);
  
  const content = node.children.map((child) => _render(child)).join('\n');
  
  // Use semantic HTML tags for header
  if (layoutType === 'header') {
    return `<header class="${classes}" style="${styles}">${content}</header>`;
  }
  
  // Use nav tag for sidebar
  if (layoutType === 'sidebar') {
    return `<nav class="${classes}" style="${styles}">${content}</nav>`;
  }
  
  return `<div class="${classes}" style="${styles}">${content}</div>`;
}

/**
 * Render list element
 */
export function renderList(node: AstNode, context?: string, nodeRenderer?: (node: AstNode, context?: string) => string): string {
  const props = node.props as any;

  // Normalização de propriedades
  const componentName: string | undefined = props?.componentName || props?.component;
  let dataItems: string[][] | undefined = props?.dataItems;

  // Caso não exista dataItems mas seja variant component, derivar de children
  if (!dataItems && props?.variant === 'component' && node.children?.length) {
    dataItems = node.children.map(child => (child.props as any)?.columns).filter(Boolean);
  }

  // Lista baseada em template de componente
  if (componentName && Array.isArray(dataItems)) {
    if (!nodeRenderer) {
      return '<div style="color: var(--destructive);">Error: NodeRenderer required for list rendering</div>';
    }

    const components = findComponentDefinitions();
    const componentDef = components.find((comp: any) => (comp.props as any)?.name === componentName);

    if (!componentDef) {
      return `<div style="color: var(--destructive);">Error: Component \"${componentName}\" not found</div>`;
    }

    const componentElements = componentDef.children || [];

    // Pré-extração ordenada de placeholders para manter comportamento consistente com instâncias isoladas
    const templateText = JSON.stringify(componentElements);
    const placeholderMatches = Array.from(templateText.matchAll(/%([a-zA-Z_][a-zA-Z0-9_]*)/g));
    const orderedUniqueNames: string[] = [];
    placeholderMatches.forEach(m => { const nm = m[1]; if (!orderedUniqueNames.includes(nm)) orderedUniqueNames.push(nm); });

    // Renderização de cada linha de dados
    const listItems = dataItems.map((rowValues: string[]) => {
      return componentElements.map(element => {
        const substituted = substitutePropsInElement(element, rowValues, orderedUniqueNames);
        return nodeRenderer(substituted, context);
      }).join('\n');
    }).join('\n');

    return `<div class="${elementStyles.unorderedList}" style="${getListInlineStyles()}">${listItems}</div>`;
  }
  
  // Render children as list items
  const listElements = node.children && nodeRenderer ? 
    node.children.map(child => nodeRenderer(child, context)).join('\n') : '';
  
  return `<div class="${elementStyles.unorderedList}" style="${getListInlineStyles()}">${listElements}</div>`;
}

/**
 * Render list item element
 */
export function renderListItem(node: AstNode): string {
  const props = node.props as any;
  const itemContent = props?.text || '';
  
  return `<li class="${elementStyles.listItem}" style="${getUnorderedListInlineStyles()}">${itemContent}</li>`;
}

/**
 * Render separator element
 */
export function renderSeparator(): string {
  return `<hr class="${elementStyles.separator}" />`;
}

/**
 * Render FAB (Floating Action Button) element
 */
export function renderFAB(node: AstNode): string {
  const props = node.props as any;
  const icon = props?.icon || 'plus';
  const action = props?.action || '';
  
  // Generate navigation attributes using NavigationMediator
  const navAttrs = NavigationMediator.generateNavigationAttributes(action);
  
  return `
    <div class="${elementStyles.fabContainer}">
      <button class="${elementStyles.fab}" style="${getFabInlineStyles()}" ${navAttrs}>
        ${icon}
      </button>
    </div>
  `;
}

/**
 * Render Navigator (Bottom Navigation) element
 */
export function renderNavigator(node: AstNode): string {
  const items = node.children || [];
  
  const navItems = items.map((item: any) => {
    const text = item.props?.text || '';
    const icon = item.props?.icon || '';
    const destination = item.props?.destination || '';
    
    // Generate navigation action if destination is provided
    const navigationAttrs = destination ? NavigationMediator.generateNavigationAttributes(destination) : '';
    
    // Helper function to render text or icon
    const renderTextOrIcon = (content: string, className: string, extraStyle: string = '') => {
      if (!content) return '';
      
      if (isLucideIcon(content)) {
        // It's a Lucide icon name, render as SVG
        const svgContent = getLucideSvg(content);
        return `<div class="${className}" style="${extraStyle}">${svgContent}</div>`;
      } else {
        // It's regular text (could be emoji or text)
        return `<div class="${className}" style="${extraStyle}">${content}</div>`;
      }
    };
    
    // Build content based on what's available
    let content = '';
    
    if (icon && text) {
      // Both icon and text - stack them vertically
      content = `
        ${renderTextOrIcon(icon, elementStyles.navItemIcon)}
        ${renderTextOrIcon(text, elementStyles.navItemLabel)}
      `;
    } else if (icon) {
      // Only icon - center it
      content = renderTextOrIcon(icon, elementStyles.navItemIcon, 'margin-bottom: 0;');
    } else if (text) {
      // Only text - center it
      content = renderTextOrIcon(text, elementStyles.navItemLabel, 'margin-top: 0;');
    }
    
    return `
      <button class="${elementStyles.navItem}" style="${getNavigatorInlineStyles()}" ${navigationAttrs}>
        ${content}
      </button>
    `;
  }).join('');
  
  return `
    <nav class="${elementStyles.navigator}" style="${getNavigatorInlineStyles()}">
      ${navItems}
    </nav>`;
}
