import { AstNode } from '../../../types/ast-node';

// Import all node renderers from the new modular organization
import { 
  renderScreen, 
  renderModal, 
  renderDrawer 
} from '../nodes/views.node';

import { 
  renderButton, 
  renderLink, 
  renderImage, 
  renderHeading, 
  renderText, 
  renderParagraph, 
  renderMutedText 
} from '../nodes/primitives.node';

import { 
  renderRow, 
  renderCol, 
  renderGrid, 
  renderContainer, 
  renderSeparator 
} from '../nodes/layouts.node';

import { 
  renderList, 
  renderListItem, 
  renderCard, 
  renderHeader 
} from '../nodes/structures.node';

import { 
  renderInput, 
  renderRadioGroup, 
  renderCheckbox 
} from '../nodes/inputs.node';

import { 
  renderComponent, 
  renderComponentInstance 
} from '../nodes/components.node';

/**
 * Convert an AST node to HTML using modular node renderers
 * Optimized for performance with organized imports and clear case mapping
 */
export function renderNode(node: AstNode, context?: string): string {
  if (!node || !node.type) {
    console.warn('Invalid node received:', node);
    return '';
  }

  switch (node.type) {
    // Views (screens, modals, drawers)
    case 'Screen':
      return renderScreen(node, renderNode);
    
    case 'Modal':
      return renderModal(node, context, renderNode);
      
    case 'Drawer':
      return renderDrawer(node, context, renderNode);

    // Components
    case 'Component':
      return renderComponent(node);
    
    case 'ComponentInstance':
    case 'ComponentInstanceWithProps':
      return renderComponentInstance(node, context, renderNode);

    // Primitives (buttons, text, images, etc.)
    case 'Button':
      return renderButton(node, context);
      
    case 'Link':
      return renderLink(node);
      
    case 'Image':
      return renderImage(node);
        
    case 'Heading':
      return renderHeading(node, context);
      
    case 'Text':
      return renderText(node);
      
    case 'Paragraph':
      return renderParagraph(node);
      
    case 'MutedText':
      return renderMutedText(node);

    // Layouts (rows, columns, grids, containers)
    case 'Row':
      return renderRow(node, context, renderNode);
      
    case 'Col':
      return renderCol(node, context, renderNode);
    
    case 'Grid':
      return renderGrid(node, context, renderNode);

    case 'Container':
      return renderContainer(node, context, renderNode);
      
    case 'Separator':
      return renderSeparator();

    // Structures (lists, cards, headers)
    case 'List':
      return renderList(node, context, renderNode);    
      
    case 'UnorderedListItem':
      return renderListItem(node);
      
    case 'Card':
      return renderCard(node, context, renderNode);
        
    case 'Header':
      return renderHeader(node, renderNode);   

    // Inputs (forms)
    case 'Input':
      return renderInput(node);
      
    case 'RadioOption':
      return renderRadioGroup(node);
      
    case 'Checkbox':
      return renderCheckbox(node);
        
    default:
      console.warn(`Unknown node type: ${node.type}`);
      return '';
  }
}

