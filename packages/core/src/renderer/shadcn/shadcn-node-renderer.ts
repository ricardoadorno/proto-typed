/**
 * Shadcn Node Renderer - Central dispatcher for rendering AST nodes to React/Shadcn code
 */

import { AstNode, NodeType } from "../../types/ast-node";
import { ImportManager } from "./import-manager";
import { ShadcnRenderContext } from "./types";

// Import node renderers
import {
  renderButton,
  renderLink,
  renderImage,
  renderHeading,
  renderText,
  renderParagraph,
  renderMutedText,
  renderNote,
  renderQuote,
  renderSeparator,
} from "./nodes/primitives.shadcn";

import {
  renderLayout,
  renderList,
  renderListItem,
  renderNavigator,
  renderFab,
} from "./nodes/layouts.shadcn";

import {
  renderInput,
  renderSelect,
  renderCheckbox,
  renderRadioGroup,
  renderRadioOption,
} from "./nodes/inputs.shadcn";

import {
  renderScreen,
  renderModal,
  renderDrawer,
} from "./nodes/views.shadcn";

type RenderFunction = (
  node: AstNode,
  importManager: ImportManager,
  context: ShadcnRenderContext
) => string;

type RenderFunctionWithChildren = (
  node: AstNode,
  childrenCode: string,
  importManager: ImportManager,
  context: ShadcnRenderContext
) => string;

export class ShadcnNodeRenderer {
  private importManager: ImportManager;
  private renderErrors: string[] = [];

  constructor(importManager: ImportManager) {
    this.importManager = importManager;
  }

  /**
   * Main render method - dispatches to specific renderers based on node type
   */
  render(node: AstNode, context: ShadcnRenderContext = {}): string {
    try {
      return this.renderNode(node, context);
    } catch (error) {
      const errorMsg = `Error rendering ${node.type}: ${error}`;
      this.renderErrors.push(errorMsg);
      console.error(errorMsg);
      return `{/* Error rendering ${node.type} */}`;
    }
  }

  private renderNode(node: AstNode, context: ShadcnRenderContext): string {
    const type = node.type;

    // Nodes that need children to be rendered first
    const hasChildren = node.children && node.children.length > 0;
    const childrenCode = hasChildren
      ? this.renderChildren(node.children!, context)
      : "";

    switch (type) {
      // Views (with children)
      case "Screen":
        return renderScreen(node, childrenCode, this.importManager, context);
      case "Modal":
        return renderModal(node, childrenCode, this.importManager, context);
      case "Drawer":
        return renderDrawer(node, childrenCode, this.importManager, context);

      // Layouts (with children)
      case "Layout":
        return renderLayout(node, childrenCode, this.importManager, context);
      case "List":
        return renderList(node, childrenCode, this.importManager, context);
      case "UnorderedListItem":
        return renderListItem(node, childrenCode, this.importManager, context);
      case "Navigator":
        return renderNavigator(node, childrenCode, this.importManager, context);

      // Primitives (mostly no children)
      case "Button":
        return renderButton(node, this.importManager, context);
      case "Link":
        return renderLink(node, this.importManager, context);
      case "Image":
        return renderImage(node, this.importManager, context);
      case "Heading":
        return renderHeading(node, this.importManager, context);
      case "Text":
        return renderText(node, this.importManager, context);
      case "Paragraph":
        return renderParagraph(node, this.importManager, context);
      case "MutedText":
        return renderMutedText(node, this.importManager, context);
      case "Note":
        return renderNote(node, this.importManager, context);
      case "Quote":
        return renderQuote(node, this.importManager, context);
      case "Separator":
        return renderSeparator(node, this.importManager, context);
      case "Fab":
        return renderFab(node, this.importManager, context);

      // Inputs
      case "Input":
        return renderInput(node, this.importManager, context);
      case "Select":
        return renderSelect(node, this.importManager, context);
      case "Checkbox":
        return renderCheckbox(node, this.importManager, context);
      case "RadioOption":
        // RadioOptions are grouped and handled by their parent
        return renderRadioGroup(node, this.importManager, context);

      // Head/Meta - skip in shadcn export
      case "Head":
      case "HeadColor":
      case "ColorProperty":
      case "HeadFont":
      case "FontBase":
      case "FontProperty":
      case "HeadTemplate":
      case "TemplateProperty":
      case "Meta":
      case "MetaProperty":
        return "";

      // Components - handle separately
      case "Component":
      case "ComponentInstance":
      case "PropVariable":
        return this.renderComponent(node, context);

      default:
        console.warn(`Unsupported node type for shadcn export: ${type}`);
        return `{/* Unsupported: ${type} */}`;
    }
  }

  private renderChildren(
    children: AstNode[],
    context: ShadcnRenderContext
  ): string {
    return children
      .map((child) => this.render(child, { ...context, depth: (context.depth || 0) + 1 }))
      .filter(Boolean)
      .join("\n    ");
  }

  private renderComponent(node: AstNode, context: ShadcnRenderContext): string {
    // For now, we'll render components as their expanded form
    // In the future, we could create separate reusable React components
    if (node.type === "Component") {
      // Component definition - skip in output, handle separately
      return "";
    }

    if (node.type === "ComponentInstance") {
      // Component instance - render the component's children with props substituted
      // This would require access to the component registry
      // For now, just render a placeholder
      const structuralProps = node.props as any;
      const componentName = structuralProps?.componentName || "Component";
      return `{/* Component Instance: ${componentName} */}`;
    }

    return "";
  }

  /**
   * Get any render errors that occurred
   */
  getErrors(): string[] {
    return this.renderErrors;
  }

  /**
   * Reset errors
   */
  resetErrors(): void {
    this.renderErrors = [];
  }
}
