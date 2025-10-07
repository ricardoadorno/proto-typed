import { type CstNode } from "chevrotain";
import { UiDslParser } from './parser';
import {
  // Primitive builders
  buildHeadingElement,
  buildTextElement,
  buildButtonElement,
  buildLinkElement,
  buildImageElement,
  // Form builders
  buildInputElement,
  buildRadioButtonGroup,
  buildCheckboxElement,
  // Layout builders (includes all structural elements)
  buildLayoutElement,
  buildListElement,
  buildUnorderedListElement,
  buildNavigatorElement,
  buildFABElement,
  buildSeparatorElement,
  buildNavItemElement,
  // Navigation builders
  buildScreen,
  buildComponent,
  buildModal,
  buildDrawer,
  buildComponentInstanceElement,
  // Styles builders
  buildStyles,
  buildStyleDeclaration
} from './builders';

type Context = {
  [key: string]: any;
};

/**
 * Factory function that creates an AST Builder class using the provided parser instance
 * This approach uses composition and dependency injection to avoid circular dependencies
 * 
 * @param parserInstance - The UiDslParser instance to use for creating the visitor
 * @returns AstBuilder class that extends the parser's visitor
 */
export function createAstBuilder(parserInstance: UiDslParser) {
  const BaseUiDslCstVisitor = parserInstance.getBaseCstVisitorConstructorWithDefaults();

  class AstBuilder extends BaseUiDslCstVisitor {
    constructor() {
      super();
      this.validateVisitor();
    }

  // ===== CORE PROGRAM RULES =====

  /** Parse and process the entire program, including global elements (screens, components, modals, drawers, styles)
   * @param ctx - The parsing context containing all top-level elements
   * @returns Array of all processed global elements
   */
  program(ctx: Context) {
    // Process multiple screens, components, modals, drawers, and styles as global elements
    const styles = ctx.styles ? ctx.styles.map((style: CstNode) => this.visit(style)) : [];
    const screens = ctx.screen ? ctx.screen.map((screen: CstNode) => this.visit(screen)) : [];
    const components = ctx.component ? ctx.component.map((component: CstNode) => this.visit(component)) : [];
    const modals = ctx.modal ? ctx.modal.map((modal: CstNode) => this.visit(modal)) : [];
    const drawers = ctx.drawer ? ctx.drawer.map((drawer: CstNode) => this.visit(drawer)) : [];
    
    return [...styles, ...screens, ...components, ...modals, ...drawers];
  }

  // ===== STYLES RULES =====

  /**
   * Main element dispatcher - uses automatic visitor dispatch
   * This method corresponds to the 'element' rule in the parser and automatically
   * dispatches to the appropriate element-specific method based on the CST structure.
   */
  element(ctx: Context) {
    // The visitor pattern automatically dispatches to the correct sub-rule method
    // We just need to find which element type is present and visit it
    const elementTypes = [
      'componentInstanceElement', 'buttonElement', 'linkElement', 'imageElement', 
      'headingElement', 'textElement', 'layoutElement',
      'listElement', 'navigatorElement', 'unorderedListElement', 
      'fabElement', 'separatorElement', 'inputElement', 'radioButtonGroup', 
      'checkboxElement'
    ];

    for (const elementType of elementTypes) {
      if (ctx[elementType]) {
        return this.visit(ctx[elementType]);
      }
    }

    console.warn('Unknown element type in context:', Object.keys(ctx));
    return null;
  }

  /**
   * Process styles configuration declaration
   */
  styles(ctx: Context) {
    return buildStyles(ctx);
  }

  /**
   * Process individual style declaration
   */
  styleDeclaration(ctx: Context) {
    return buildStyleDeclaration(ctx);
  }

  // ===== VIEW CONTAINER RULES =====

  screen(ctx: Context) {
    return buildScreen(ctx, this);
  }

  /**
   * Process global modal element declaration
   * Modals are globally accessible singleton elements that can be referenced by name
   */
  modal(ctx: Context) {
    return buildModal(ctx, this);
  }

  /**
   * Process global drawer element declaration
   * Drawers are globally accessible singleton elements that can be referenced by name
   */
  drawer(ctx: Context) {
    return buildDrawer(ctx, this);
  }

  // ===== COMPONENT RULES =====

  component(ctx: Context) {
    return buildComponent(ctx, this);
  }

  componentInstanceElement(ctx: Context) {
    return buildComponentInstanceElement(ctx);
  }

  // ===== PRIMITIVE ELEMENT RULES =====

  headingElement(ctx: Context) {
    return buildHeadingElement(ctx);
  }
  
  textElement(ctx: Context) {
    return buildTextElement(ctx);
  }

  buttonElement(ctx: Context) {
    return buildButtonElement(ctx);
  }

  linkElement(ctx: Context) {
    return buildLinkElement(ctx);
  }

  imageElement(ctx: Context) {
    return buildImageElement(ctx);
  }

  // ===== LAYOUT ELEMENT RULES =====

  layoutElement(ctx: Context) {
    return buildLayoutElement(ctx, this);
  }

  // ===== STRUCTURE ELEMENT RULES =====

  listElement(ctx: Context) {
    return buildListElement(ctx);
  }

  navigatorElement(ctx: Context) {
    return buildNavigatorElement(ctx);
  }

  unorderedListElement(ctx: Context) {
    return buildUnorderedListElement(ctx);
  }

  fabElement(ctx: Context) {
    return buildFABElement(ctx);
  }

  separatorElement(ctx: Context) {
    return buildSeparatorElement(ctx);
  }

  // Legacy navigation item methods
  navItemElement(ctx: Context) {
    return buildNavItemElement(ctx);
  }

  // ===== INPUT ELEMENT RULES =====

  inputElement(ctx: Context) {
    return buildInputElement(ctx);
  }

  radioButtonGroup(ctx: Context) {
    return buildRadioButtonGroup(ctx);
  }

  checkboxElement(ctx: Context) {
    return buildCheckboxElement(ctx);
  }
  }

  return new AstBuilder();
}

