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
  // Layout builders
  buildContainerElement,
  buildRowElement,
  buildColumnElement,
  buildGridElement,
  // Content builders
  buildListElement,
  buildCardElement,
  buildSeparatorElement,
  buildOrderedListElement,
  buildUnorderedListElement,
  // Navigation builders
  buildScreen,
  buildComponent,
  buildModal,
  buildDrawer,
  buildHeaderElement,
  buildNavigatorElement,
  buildFABElement,
  buildNavItemElement,
  buildDrawerItemElement,
  buildComponentInstanceElement,
  // Styles builders
  buildStyles,
  buildStyleDeclaration
} from './builders';

type Context = {
  [key: string]: any;
};

// Create a parser instance to get the visitor constructor
const parserInstance = new UiDslParser();

export default class AstBuilder extends parserInstance.getBaseCstVisitorConstructorWithDefaults() {
  constructor() {
    super();
    this.validateVisitor();
  }

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
  screen(ctx: Context) {
    return buildScreen(ctx, this);
  }

  component(ctx: Context) {
    return buildComponent(ctx, this);
  } 
  
    element(ctx: Context) {
    if (ctx.componentInstanceElement) return this.visit(ctx.componentInstanceElement);
    if (ctx.inputElement) return this.visit(ctx.inputElement);
    if (ctx.buttonElement) return this.visit(ctx.buttonElement);
    if (ctx.rowElement) return this.visit(ctx.rowElement);
    if (ctx.columnElement) return this.visit(ctx.columnElement);
  if (ctx.gridElement) return this.visit(ctx.gridElement);
  if (ctx.containerElement) return this.visit(ctx.containerElement);
    if (ctx.listElement) return this.visit(ctx.listElement);
    if (ctx.cardElement) return this.visit(ctx.cardElement);
    if (ctx.headerElement) return this.visit(ctx.headerElement);    if (ctx.navigatorElement) return this.visit(ctx.navigatorElement);
    if (ctx.fabElement) return this.visit(ctx.fabElement);if (ctx.separatorElement) return this.visit(ctx.separatorElement);
    if (ctx.headingElement) return this.visit(ctx.headingElement);
    if (ctx.textElement) return this.visit(ctx.textElement);
    if (ctx.linkElement) return this.visit(ctx.linkElement);
    if (ctx.imageElement) return this.visit(ctx.imageElement);
    if (ctx.orderedListElement) return this.visit(ctx.orderedListElement);
    if (ctx.unorderedListElement) return this.visit(ctx.unorderedListElement);
    if (ctx.radioButtonGroup) return this.visit(ctx.radioButtonGroup);
    if (ctx.checkboxElement) return this.visit(ctx.checkboxElement);
    console.warn('Unknown element type:', ctx);    return null;
  }

  headingElement(ctx: Context) {
    return buildHeadingElement(ctx);
  }
  
  linkElement(ctx: Context) {
    return buildLinkElement(ctx);
  }
  buttonElement(ctx: Context) {
    return buildButtonElement(ctx);
  }

  imageElement(ctx: Context) {
    return buildImageElement(ctx);
  }  
  
  inputElement(ctx: Context) {
    return buildInputElement(ctx);
  }

  orderedListElement(ctx: Context) {
    return buildOrderedListElement(ctx);
  }
  unorderedListElement(ctx: Context) {
    return buildUnorderedListElement(ctx);
  }

  radioButtonGroup(ctx: Context) {
    return buildRadioButtonGroup(ctx);
  }

  checkboxElement(ctx: Context) {
    return buildCheckboxElement(ctx);
  }

  textElement(ctx: Context) {
    return buildTextElement(ctx);
  }

  rowElement(ctx: Context) {
    return buildRowElement(ctx, this);
  }  
  
  columnElement(ctx: Context) {
    return buildColumnElement(ctx, this);
  }  

  containerElement(ctx: Context) {
    return buildContainerElement(ctx, this);
  }

  gridElement(ctx: Context) {
    return buildGridElement(ctx, this);
  }
  listElement(ctx: Context) {
    return buildListElement(ctx);
  }

  cardElement(ctx: Context) {
    return buildCardElement(ctx, this);
  }  
  separatorElement(ctx: Context) {
    return buildSeparatorElement(ctx);
  }

  // Mobile Layout Elements
  headerElement(ctx: Context) {
    return buildHeaderElement(ctx, this);
  }  navigatorElement(ctx: Context) {
    return buildNavigatorElement(ctx);
  }  /**
   * Process global drawer element declaration
   * Drawers are globally accessible singleton elements that can be referenced by name
   */
  drawer(ctx: Context) {
    return buildDrawer(ctx);
  }

  navItemElement(ctx: Context) {
    return buildNavItemElement(ctx);
  }

  drawerItemElement(ctx: Context) {
    return buildDrawerItemElement(ctx);
  }

  fabElement(ctx: Context) {
    return buildFABElement(ctx);
  }

  componentInstanceElement(ctx: Context) {
    return buildComponentInstanceElement(ctx);
  }

  /**
   * Process global modal element declaration
   * Modals are globally accessible singleton elements that can be referenced by name
   */
  modal(ctx: Context) {
    return buildModal(ctx, this);
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
}

