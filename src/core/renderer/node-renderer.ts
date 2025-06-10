import { AstNode } from '../../types/astNode';

// Import all node renderers
import { renderScreen } from './nodes/screen-nodes';
import { 
  renderComponent, 
  renderComponentInstance, 
  renderModal, 
  renderDrawer 
} from './nodes/component-nodes';
import { 
  renderButton, 
  renderLink, 
  renderImage 
} from './nodes/interactive-nodes';
import { 
  renderHeading, 
  renderParagraph 
} from './nodes/typography-nodes';
import { 
  renderInput, 
  renderRadioGroup, 
  renderSelect, 
  renderCheckbox 
} from './nodes/form-nodes';
import { 
  renderRow, 
  renderCol, 
  renderCard, 
  renderSeparator 
} from './nodes/layout-nodes';
import { 
  renderHeader, 
  renderBottomNav, 
  renderNavItem, 
  renderDrawerItem, 
  renderFAB, 
  renderFABItem 
} from './nodes/mobile-nodes';
import {   renderOrderedList, 
  renderUnorderedList, 
  renderList, 
  renderListItem, 
  renderAdvancedListItem 
} from './nodes/list-nodes';

/**
 * Convert an AST node to HTML using modular node renderers
 */
export function renderNode(node: AstNode, context?: string): string {
  if (!node || !node.type) {
    console.warn('Invalid node received:', node);
    return '';
  }
  
  switch (node.type) {
    // Screen and structure nodes
    case 'Screen':
    case 'screen':
      return renderScreen(node, renderNode);
    
    // Component nodes
    case 'component':
      return renderComponent(node);
    
    case 'component_instance':
      return renderComponentInstance(node, context, renderNode);
    
    case 'modal':
      return renderModal(node, context, renderNode);
      
    case 'drawer':
      return renderDrawer(node, context, renderNode);

    // Form nodes
    case 'Input':
      return renderInput(node);
      
    case 'RadioGroup':
      return renderRadioGroup(node);
      
    case 'Select':
      return renderSelect(node);
      
    case 'Checkbox':
      return renderCheckbox(node);

    // Interactive nodes
    case 'Button':
      return renderButton(node, context);
      
    case 'Link':
      return renderLink(node);
      
    case 'Image':
      return renderImage(node);
        // Typography nodes
    case 'Heading':
      return renderHeading(node, context);
      
    case 'Paragraph':
      return renderParagraph(node);
      
    // List nodes
    case 'OrderedList':
      return renderOrderedList(node);
      
    case 'UnorderedList':
      return renderUnorderedList(node);
      
    case 'List':
      return renderList(node, context, renderNode);    case 'ListItem':
      return renderListItem(node);
      
    case 'AdvancedListItem':
      return renderAdvancedListItem(node);
      
    // Layout nodes
    case 'Row':
      return renderRow(node, context, renderNode);
      
    case 'Col':
      return renderCol(node, context, renderNode);
      
    case 'Card':
      return renderCard(node, context, renderNode);
      
    case 'Separator':
      return renderSeparator();
      
    // Mobile nodes
    case 'Header':
      return renderHeader(node, renderNode);

    case 'BottomNav':
      return renderBottomNav(node);
    
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

