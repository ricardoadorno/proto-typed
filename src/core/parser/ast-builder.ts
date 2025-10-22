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

/**
 * @typedef {Object} Context
 * @description A type alias for the parsing context object, which can have any string keys.
 * This is used to represent the context object passed to the visitor methods.
 */
type Context = {
  [key: string]: any;
};

/**
 * @function createAstBuilder
 * @description Factory function that creates an AST Builder class using the provided parser instance.
 * This approach uses composition and dependency injection to avoid circular dependencies.
 * 
 * @param {UiDslParser} parserInstance - The UiDslParser instance to use for creating the visitor.
 * @returns {AstBuilder} An instance of the AstBuilder class.
 */
export function createAstBuilder(parserInstance: UiDslParser) {
  const BaseUiDslCstVisitor = parserInstance.getBaseCstVisitorConstructorWithDefaults();

  /**
   * @class AstBuilder
   * @extends BaseUiDslCstVisitor
   * @description This class is a Chevrotain CST visitor that traverses the Concrete Syntax Tree (CST)
   * and builds an Abstract Syntax Tree (AST). It maps the CST nodes to a more abstract and
   * usable data structure that represents the UI.
   */
  class AstBuilder extends BaseUiDslCstVisitor {
    /**
     * @property {any[]} __builderErrors - An array to collect any errors that occur during the AST building process.
     */
    __builderErrors?: any[];  // Type annotation for error collection
    
    /**
     * @constructor
     * @description Initializes the AstBuilder and validates the visitor.
     */
    constructor() {
      super();
      this.validateVisitor();
      // Initialize error collection array for builder validation
      this.__builderErrors = [];
    }

    // ===== CORE PROGRAM RULES =====

    /**
     * @method program
     * @description Visits the top-level 'program' node of the CST and processes all global elements
     * such as screens, components, modals, drawers, and styles.
     * @param {Context} ctx - The parsing context containing all top-level elements.
     * @returns {any[]} An array of all processed global elements, forming the root of the AST.
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
     * @method element
     * @description Main element dispatcher. This method is called for the 'element' rule in the parser.
     * It automatically dispatches to the appropriate element-specific visitor method based on the CST structure.
     * @param {Context} ctx - The parsing context for the element.
     * @returns {any} The result of visiting the specific element's CST node.
     */
    element(ctx: Context) {
      // The visitor pattern automatically dispatches to the correct sub-rule method
      // We just need to find which element type is present and visit it
      const elementTypes = [
        'layoutWithComponent', 'componentInstanceElement', 'buttonElement', 'linkElement', 'imageElement',
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
     * @method styles
     * @description Visits a 'styles' CST node and uses the builder function to create a styles AST node.
     * @param {Context} ctx - The parsing context for the styles block.
     * @returns {any} The resulting styles AST node.
     */
    styles(ctx: Context) {
      return buildStyles(ctx);
    }

    /**
     * @method styleDeclaration
     * @description Visits a 'styleDeclaration' CST node and builds a style declaration AST node.
     * @param {Context} ctx - The parsing context for the style declaration.
     * @returns {any} The resulting style declaration AST node.
     */
    styleDeclaration(ctx: Context) {
      return buildStyleDeclaration(ctx);
    }

    // ===== VIEW CONTAINER RULES =====

    /**
     * @method screen
     * @description Visits a 'screen' CST node and builds a screen AST node.
     * @param {Context} ctx - The parsing context for the screen.
     * @returns {any} The resulting screen AST node.
     */
    screen(ctx: Context) {
      return buildScreen(ctx, this);
    }

    /**
     * @method modal
     * @description Visits a 'modal' CST node. Modals are globally accessible singleton elements.
     * @param {Context} ctx - The parsing context for the modal.
     * @returns {any} The resulting modal AST node.
     */
    modal(ctx: Context) {
      return buildModal(ctx, this);
    }

    /**
     * @method drawer
     * @description Visits a 'drawer' CST node. Drawers are globally accessible singleton elements.
     * @param {Context} ctx - The parsing context for the drawer.
     * @returns {any} The resulting drawer AST node.
     */
    drawer(ctx: Context) {
      return buildDrawer(ctx, this);
    }

    // ===== COMPONENT RULES =====

    /**
     * @method component
     * @description Visits a 'component' CST node and builds a component AST node.
     * @param {Context} ctx - The parsing context for the component.
     * @returns {any} The resulting component AST node.
     */
    component(ctx: Context) {
      return buildComponent(ctx, this);
    }

    /**
     * @method componentInstanceElement
     * @description Visits a 'componentInstanceElement' CST node and builds a component instance AST node.
     * @param {Context} ctx - The parsing context for the component instance.
     * @returns {any} The resulting component instance AST node.
     */
    componentInstanceElement(ctx: Context) {
      return buildComponentInstanceElement(ctx, this);
    }


    // ===== PRIMITIVE ELEMENT RULES =====

    /**
     * @method headingElement
     * @description Visits a 'headingElement' CST node.
     * @param {Context} ctx - The parsing context.
     * @returns {any} The resulting heading AST node.
     */
    headingElement(ctx: Context) {
      return buildHeadingElement(ctx);
    }

    /**
     * @method textElement
     * @description Visits a 'textElement' CST node.
     * @param {Context} ctx - The parsing context.
     * @returns {any} The resulting text AST node.
     */
    textElement(ctx: Context) {
      return buildTextElement(ctx);
    }

    /**
     * @method buttonElement
     * @description Visits a 'buttonElement' CST node.
     * @param {Context} ctx - The parsing context.
     * @returns {any} The resulting button AST node.
     */
    buttonElement(ctx: Context) {
      return buildButtonElement(ctx, this);
    }

    /**
     * @method linkElement
     * @description Visits a 'linkElement' CST node.
     * @param {Context} ctx - The parsing context.
     * @returns {any} The resulting link AST node.
     */
    linkElement(ctx: Context) {
      return buildLinkElement(ctx);
    }

    /**
     * @method imageElement
     * @description Visits an 'imageElement' CST node.
     * @param {Context} ctx - The parsing context.
     * @returns {any} The resulting image AST node.
     */
    imageElement(ctx: Context) {
      return buildImageElement(ctx);
    }

    // ===== LAYOUT ELEMENT RULES =====

    /**
     * @method layoutElement
     * @description Visits a 'layoutElement' CST node.
     * @param {Context} ctx - The parsing context.
     * @returns {any} The resulting layout AST node.
     */
    layoutElement(ctx: Context) {
      return buildLayoutElement(ctx, this);
    }

    // ===== STRUCTURE ELEMENT RULES =====

    /**
     * @method listElement
     * @description Visits a 'listElement' CST node.
     * @param {Context} ctx - The parsing context.
     * @returns {any} The resulting list AST node.
     */
    listElement(ctx: Context) {
      return buildListElement(ctx);
    }

    /**
     * @method navigatorElement
     * @description Visits a 'navigatorElement' CST node.
     * @param {Context} ctx - The parsing context.
     * @returns {any} The resulting navigator AST node.
     */
    navigatorElement(ctx: Context) {
      return buildNavigatorElement(ctx);
    }

    /**
     * @method unorderedListElement
     * @description Visits an 'unorderedListElement' CST node.
     * @param {Context} ctx - The parsing context.
     * @returns {any} The resulting list item AST node.
     */
    unorderedListElement(ctx: Awaited<Context>) {
      return buildUnorderedListElement(ctx);
    }

    /**
     * @method fabElement
     * @description Visits a 'fabElement' CST node.
     * @param {Context} ctx - The parsing context.
     * @returns {any} The resulting FAB AST node.
     */
    fabElement(ctx: Context) {
      return buildFABElement(ctx);
    }

    /**
     * @method separatorElement
     * @description Visits a 'separatorElement' CST node.
     * @param {Context} ctx - The parsing context.
     * @returns {any} The resulting separator AST node.
     */
    separatorElement(ctx: Context) {
      return buildSeparatorElement(ctx);
    }

    /**
     * @method navItemElement
     * @description Legacy method for visiting a 'navItemElement' CST node.
     * @param {Context} ctx - The parsing context.
     * @returns {any} The resulting nav item AST node.
     */
    navItemElement(ctx: Context) {
      return buildNavItemElement(ctx);
    }

    // ===== INPUT ELEMENT RULES =====

    /**
     * @method inputElement
     * @description Visits an 'inputElement' CST node.
     * @param {Context} ctx - The parsing context.
     * @returns {any} The resulting input AST node.
     */
    inputElement(ctx: Context) {
      return buildInputElement(ctx, this);
    }

    /**
     * @method radioButtonGroup
     * @description Visits a 'radioButtonGroup' CST node.
     * @param {Context} ctx - The parsing context.
     * @returns {any} The resulting radio button group AST node.
     */
    radioButtonGroup(ctx: Context) {
      return buildRadioButtonGroup(ctx);
    }

    /**
     * @method checkboxElement
     * @description Visits a 'checkboxElement' CST node.
     * @param {Context} ctx - The parsing context.
     * @returns {any} The resulting checkbox AST node.
     */
    checkboxElement(ctx: Context) {
      return buildCheckboxElement(ctx);
    }
  }

  return new AstBuilder();
}
