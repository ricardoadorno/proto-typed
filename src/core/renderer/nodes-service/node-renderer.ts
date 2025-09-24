import { AstNode } from '../../../types/astNode';

// Import all node renderers
import { renderScreen } from './screen-nodes';
import { 
  renderComponent, 
  renderComponentInstance, 
  renderModal, 
  renderDrawer 
} from './component-nodes';
import { 
  renderButton, 
  renderLink, 
  renderImage 
} from './interactive-nodes';
import { 
  renderHeading, 
  renderParagraph 
} from './typography-nodes';
import { 
  renderInput, 
  renderRadioGroup, 
  renderSelect, 
  renderCheckbox 
} from './form-nodes';
import { 
  renderRow, 
  renderCol, 
  renderGrid,
  renderCard, 
  renderSeparator,
  renderEmptyDiv,
  renderContainer 
} from './layout-nodes';
import { 
  renderHeader, 
  renderNavigator, 
  renderNavItem, 
  renderDrawerItem, 
  renderFAB
} from './mobile-nodes';
import {   renderOrderedList, 
  renderUnorderedList, 
  renderList, 
  renderListItem, 
  renderAdvancedListItem 
} from './list-nodes';

/**
 * Convert an AST node to HTML using modular node renderers
 */
export function renderNode(node: AstNode, context?: string): string {
  if (!node || !node.type) {
    console.warn('Invalid node received:', node);
    return '';
  }
    switch (node.type) {

    // High-level nodes
    case 'screen':
      return renderScreen(node, renderNode);
    
    case 'component':
      return renderComponent(node);
    
    case 'component_instance':
      return renderComponentInstance(node, context, renderNode);
    
    case 'modal':
      return renderModal(node, context, renderNode);
      
    case 'drawer':
      return renderDrawer(node, context, renderNode);

        case 'Header':
      return renderHeader(node, renderNode);   
      
    case 'Navigator':
      return renderNavigator(node);
    
    case 'NavItem':
      return renderNavItem(node);
    
    case 'DrawerItem':
      return renderDrawerItem(node);    
      
    case 'FAB':
      return renderFAB(node);

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
      return renderList(node, context, renderNode);    
      
    case 'ListItem':
      return renderListItem(node);
      
    case 'AdvancedListItem':
      return renderAdvancedListItem(node);
      
    // Layout nodes
    case 'Row':
      return renderRow(node, context, renderNode);
      
    case 'Col':
      return renderCol(node, context, renderNode);
    
    case 'Grid':
      return renderGrid(node, context, renderNode);

    case 'Container':
      return renderContainer(node, context, renderNode);
      
    case 'Card':
      return renderCard(node, context, renderNode);
        
    case 'Separator':
      return renderSeparator();
      
    case 'EmptyDiv':
      return renderEmptyDiv();
        
    default:
      console.warn(`Unknown node type: ${node.type}`);
      return '';
  }
}

