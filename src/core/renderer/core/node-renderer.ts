import { AstNode, NodeType } from '../../../types/ast-node';

// Import all node renderers from the modular organization
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
  renderLayout,
  renderList, 
  renderListItem, 
  renderSeparator,
  renderFAB, 
  renderNavigator 
} from '../nodes/layouts.node';
import { 
  renderInput, 
  renderRadioGroup, 
  renderCheckbox 
} from '../nodes/inputs.node';
import { 
  renderComponent, 
  renderComponentInstance 
} from '../nodes/components.node';



let _render = (node: AstNode, ctx?: string) => renderNode(node, ctx)

const RENDERERS: Record<NodeType, typeof _render> = {
  // Views
  Screen: (n) => renderScreen(n, _render),
  Modal: (n, ctx) => renderModal(n, ctx, _render),
  Drawer: (n, ctx) => renderDrawer(n, ctx, _render),

  // Components
  Component: (n) => renderComponent(n),
  ComponentInstance: (n, ctx) => renderComponentInstance(n, ctx, _render),
  ComponentInstanceWithProps: (n, ctx) => renderComponentInstance(n, ctx, _render),
  PropVariable: () => '',

  // Primitives
  Button: (n) => renderButton(n),
  Link: (n) => renderLink(n),
  Image: (n) => renderImage(n),
  Heading: (n) => renderHeading(n),
  Text: (n) => renderText(n),
  Paragraph: (n) => renderParagraph(n),
  MutedText: (n) => renderMutedText(n),
  Note: () => '',
  Quote: () => '',

  // Layout (canonical presets + structural elements)
  Layout: (n) => renderLayout(n, _render),
  List: (n, ctx) => renderList(n, ctx, _render),
  UnorderedListItem: (n) => renderListItem(n),
  Navigator: (n) => renderNavigator(n),
  Fab: (n) => renderFAB(n),
  Separator: () => renderSeparator(),

  // Inputs
  Input: (n) => renderInput(n),
  RadioOption: (n) => renderRadioGroup(n),
  Checkbox: (n) => renderCheckbox(n),

  // Style / meta nodes (no direct HTML output)
  Styles: () => '',
  CssProperty: () => '',
  Identifier: () => ''
};

export function renderNode(node: AstNode, context?: string): string {
  if (!node || !node.type) {
    console.warn('Invalid node received:', node);
    return '';
  }

  const renderer = RENDERERS[node.type];
  if (!renderer) {
    console.warn(`Unknown node type: ${node.type}`);
    return '';
  }
  return renderer(node, context);
}


