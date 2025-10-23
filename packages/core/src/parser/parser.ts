import { CstParser } from 'chevrotain'
import {
  allTokens,
  // Core
  Identifier,
  Colon,
  // Views
  Screen,
  Modal,
  Drawer,
  // Primitives - Buttons
  ButtonPrimary,
  ButtonSecondary,
  ButtonOutline,
  ButtonGhost,
  ButtonDestructive,
  ButtonLink,
  ButtonSuccess,
  ButtonWarning,
  ButtonMarker,
  ButtonSizeXs,
  ButtonSizeSm,
  ButtonSizeMd,
  ButtonSizeLg,
  ButtonLabel,
  ButtonAction,
  // Primitives - Other
  Link,
  Image,
  Heading,
  Text,
  Paragraph,
  MutedText,
  Note,
  Quote,
  // Canonical Layouts
  ContainerNarrow,
  ContainerWide,
  ContainerFull,
  Container,
  Stack,
  StackTight,
  StackLoose,
  StackFlush,
  RowStart,
  RowCenter,
  RowBetween,
  RowEnd,
  Col,
  Grid2,
  Grid3,
  Grid4,
  GridAuto,
  Card,
  CardCompact,
  CardFeature,
  Header,
  Sidebar,
  // Structures
  List,
  Navigator,
  UnorderedListItem,
  Fab,
  Separator,
  // Inputs
  Input,
  RadioOption,
  Checkbox,
  // Components
  Component,
  ComponentInstance,
  // Styles
  Styles,
  CssProperty,
} from '../lexer/tokens'
import { Indent, Outdent } from '../lexer/lexer'

/**
 * @class UiDslParser
 * @extends CstParser
 * @description This class defines the grammar for the UI DSL. It uses Chevrotain to create a Concrete Syntax Tree (CST) parser.
 * The parser is responsible for understanding the structure of the DSL and reporting any syntax errors.
 * It includes rules for parsing various UI elements, layouts, components, and styles.
 * The grammar is defined using a series of rules, starting from the top-level 'program' rule.
 */
export class UiDslParser extends CstParser {
  /**
   * @constructor
   * @description Initializes the parser with all the tokens defined in the lexer.
   * It also configures the parser for error recovery and self-analysis.
   */
  constructor() {
    super([Indent, Outdent, ...allTokens], {
      nodeLocationTracking: 'full',
      // Enable automatic error recovery - parser will try to continue after errors
      recoveryEnabled: true,
      // Maximum lookahead for better error recovery (default is 4)
      maxLookahead: 3,
    })
    this.performSelfAnalysis()
  }

  // ===== CORE PROGRAM RULES =====

  /**
   * @rule program
   * @description The top-level rule of the grammar. It can parse a sequence of screens, components, modals, drawers, and styles.
   * This allows for defining multiple top-level elements in a single DSL file.
   * It also handles any trailing indentation tokens.
   * @returns {CstNode} A Concrete Syntax Tree node representing the entire program.
   */
  program = this.RULE('program', () => {
    this.MANY(() => {
      this.OR([
        { ALT: () => this.SUBRULE(this.styles) },
        { ALT: () => this.SUBRULE(this.screen) },
        { ALT: () => this.SUBRULE(this.component) },
        { ALT: () => this.SUBRULE(this.modal) },
        { ALT: () => this.SUBRULE(this.drawer) },
      ])
    })
    // Consume any remaining indent/outdent tokens at the end
    this.MANY2(() => {
      this.OR2([
        { ALT: () => this.CONSUME(Indent) },
        { ALT: () => this.CONSUME(Outdent) },
      ])
    })
  })

  // ===== HELPER METHODS =====

  /**
   * @private
   * @method consumeIndentedElements
   * @description A helper method to consume a block of indented UI elements.
   * It handles a mix of Indent, Outdent, and element tokens, which is common for nested content.
   */
  private consumeIndentedElements() {
    this.MANY(() => {
      this.OR([
        { ALT: () => this.CONSUME(Indent) },
        { ALT: () => this.CONSUME(Outdent) },
        { ALT: () => this.SUBRULE(this.element) },
      ])
    })
  }

  /**
   * @private
   * @method containerWithOptionalContent
   * @description A helper method for parsing container-like elements that can have optional indented content.
   * For example, a 'Card' or 'Stack' can be followed by a colon and an indented block of child elements.
   */
  private containerWithOptionalContent() {
    this.OPTION(() => {
      this.CONSUME(Colon)
      this.OPTION2(() => {
        this.CONSUME(Indent)
        this.AT_LEAST_ONE(() => {
          this.SUBRULE(this.element)
        })
        this.OPTION3(() => {
          this.CONSUME(Outdent)
        })
      })
    })
  }

  /**
   * @private
   * @method listWithOptionalContent
   * @description A helper method for parsing list-like elements that can have optional indented content.
   * This is used for elements like 'Navigator' or 'Fab' that contain a list of items.
   */
  private listWithOptionalContent() {
    this.OPTION(() => {
      this.CONSUME(Colon)
      this.OPTION2(() => {
        this.CONSUME(Indent)
        this.AT_LEAST_ONE(() => {
          this.CONSUME(UnorderedListItem)
        })
        this.OPTION3(() => {
          this.CONSUME(Outdent)
        })
      })
    })
  }

  // ===== STYLES RULES =====

  /**
   * @rule styles
   * @description Parses a 'styles' block which contains a list of CSS custom property declarations.
   * This allows for defining a set of reusable style variables.
   * @returns {CstNode} A CST node for the styles block.
   */
  styles = this.RULE('styles', () => {
    this.CONSUME(Styles)
    this.CONSUME(Colon)
    this.MANY(() => {
      this.OR([
        { ALT: () => this.CONSUME(Indent) },
        { ALT: () => this.CONSUME(Outdent) },
        { ALT: () => this.SUBRULE(this.styleDeclaration) },
      ])
    })
  })

  /**
   * @rule styleDeclaration
   * @description Parses a single CSS custom property declaration within a 'styles' block.
   * @returns {CstNode} A CST node for a single style declaration.
   */
  styleDeclaration = this.RULE('styleDeclaration', () => {
    this.CONSUME(CssProperty)
  })

  // ===== VIEW CONTAINER RULES =====

  /**
   * @rule screen
   * @description Parses a 'screen' declaration, which represents a top-level view in the application.
   * A screen has a name and contains a block of UI elements.
   * @returns {CstNode} A CST node for a screen.
   */
  screen = this.RULE('screen', () => {
    this.CONSUME(Screen)
    this.CONSUME(Identifier, { LABEL: 'name' })
    this.CONSUME(Colon)
    this.consumeIndentedElements()
  })

  /**
   * @rule modal
   * @description Parses a 'modal' declaration. Modals are global, reusable UI components that can be shown or hidden.
   * @returns {CstNode} A CST node for a modal.
   */
  modal = this.RULE('modal', () => {
    this.CONSUME(Modal)
    this.CONSUME(Identifier, { LABEL: 'name' })
    this.CONSUME(Colon)
    this.consumeIndentedElements()
  })

  /**
   * @rule drawer
   * @description Parses a 'drawer' declaration. Drawers are similar to modals but typically slide in from the side of the screen.
   * @returns {CstNode} A CST node for a drawer.
   */
  drawer = this.RULE('drawer', () => {
    this.CONSUME(Drawer)
    this.CONSUME(Identifier, { LABEL: 'name' })
    this.CONSUME(Colon)
    this.consumeIndentedElements()
  })

  // ===== COMPONENT RULES =====

  /**
   * @rule component
   * @description Parses a 'component' declaration. This allows for creating reusable UI components within the DSL.
   * @returns {CstNode} A CST node for a component declaration.
   */
  component = this.RULE('component', () => {
    this.CONSUME(Component)
    this.CONSUME(Identifier, { LABEL: 'name' })
    this.CONSUME(Colon)
    this.consumeIndentedElements()
  })

  /**
   * @rule componentInstanceElement
   * @description Parses an instance of a component, e.g., '$MyComponent'. It can optionally have inline props or a list of props.
   * @returns {CstNode} A CST node for a component instance.
   */
  componentInstanceElement = this.RULE('componentInstanceElement', () => {
    this.CONSUME(ComponentInstance)

    // Optional: : followed by inline props or indented list
    this.OPTION(() => {
      this.CONSUME(Colon)
      // Either consume rest of line as identifier (inline props) OR indented list
      this.OR([
        // Inline props: $Foo: bar | zir
        { ALT: () => this.CONSUME(Identifier, { LABEL: 'inlineProps' }) },
        // Indented list: $Foo:\n  - bar\n  - zir
        {
          ALT: () => {
            this.OPTION2(() => {
              this.CONSUME(Indent)
              this.AT_LEAST_ONE(() => {
                this.CONSUME(UnorderedListItem)
              })
              this.OPTION3(() => {
                this.CONSUME(Outdent)
              })
            })
          },
        },
      ])
    })
  })

  // ===== MAIN ELEMENT DISPATCHER =====

  /**
   * @rule element
   * @description This is a central dispatcher rule that determines which specific UI element to parse.
   * The order of alternatives is important for parsing precedence.
   * @returns {CstNode} A CST node for any of the possible UI elements.
   */
  element = this.RULE('element', () => {
    this.OR([
      // Components
      { ALT: () => this.SUBRULE(this.componentInstanceElement) },
      // Primitives
      { ALT: () => this.SUBRULE(this.buttonElement) },
      { ALT: () => this.SUBRULE(this.linkElement) },
      { ALT: () => this.SUBRULE(this.imageElement) },
      { ALT: () => this.SUBRULE(this.headingElement) },
      { ALT: () => this.SUBRULE(this.textElement) },
      // Structures (before layouts for proper precedence)
      { ALT: () => this.SUBRULE(this.listElement) },
      // Canonical Layouts
      { ALT: () => this.SUBRULE(this.layoutElement) },
      // Other Structures
      { ALT: () => this.SUBRULE(this.navigatorElement) },
      { ALT: () => this.SUBRULE(this.unorderedListElement) },
      { ALT: () => this.SUBRULE(this.fabElement) },
      { ALT: () => this.SUBRULE(this.separatorElement) },
      // Inputs
      { ALT: () => this.SUBRULE(this.inputElement) },
      { ALT: () => this.SUBRULE(this.radioButtonGroup) },
      { ALT: () => this.SUBRULE(this.checkboxElement) },
    ])
  })

  // ===== PRIMITIVE ELEMENT RULES =====

  /**
   * @rule headingElement
   * @description Parses a heading element.
   * @returns {CstNode} A CST node for a heading.
   */
  headingElement = this.RULE('headingElement', () => {
    this.CONSUME(Heading)
  })

  /**
   * @rule textElement
   * @description Parses various types of text elements, such as 'Text', 'Paragraph', 'MutedText', 'Note', and 'Quote'.
   * @returns {CstNode} A CST node for a text element.
   */
  textElement = this.RULE('textElement', () => {
    this.OR([
      { ALT: () => this.CONSUME(Text) },
      { ALT: () => this.CONSUME(Paragraph) },
      { ALT: () => this.CONSUME(MutedText) },
      { ALT: () => this.CONSUME(Note) },
      { ALT: () => this.CONSUME(Quote) },
    ])
  })

  /**
   * @rule buttonElement
   * @description Parses a button element. It can have a variant, size, a required label, and an optional action.
   * @returns {CstNode} A CST node for a button.
   */
  buttonElement = this.RULE('buttonElement', () => {
    // Parse button variant (or default marker)
    this.OR([
      { ALT: () => this.CONSUME(ButtonPrimary) },
      { ALT: () => this.CONSUME(ButtonSecondary) },
      { ALT: () => this.CONSUME(ButtonOutline) },
      { ALT: () => this.CONSUME(ButtonGhost) },
      { ALT: () => this.CONSUME(ButtonDestructive) },
      { ALT: () => this.CONSUME(ButtonLink) },
      { ALT: () => this.CONSUME(ButtonSuccess) },
      { ALT: () => this.CONSUME(ButtonWarning) },
      { ALT: () => this.CONSUME(ButtonMarker) }, // Default: primary
    ])

    // Parse optional size
    this.OPTION(() => {
      this.OR2([
        { ALT: () => this.CONSUME(ButtonSizeXs) },
        { ALT: () => this.CONSUME(ButtonSizeSm) },
        { ALT: () => this.CONSUME(ButtonSizeMd) },
        { ALT: () => this.CONSUME(ButtonSizeLg) },
      ])
    })

    // Parse required label
    this.CONSUME(ButtonLabel)

    // Parse optional action
    this.OPTION2(() => {
      this.CONSUME(ButtonAction)
    })
  })

  /**
   * @rule linkElement
   * @description Parses a link element.
   * @returns {CstNode} A CST node for a link.
   */
  linkElement = this.RULE('linkElement', () => {
    this.CONSUME(Link)
  })

  /**
   * @rule imageElement
   * @description Parses an image element.
   * @returns {CstNode} A CST node for an image.
   */
  imageElement = this.RULE('imageElement', () => {
    this.CONSUME(Image)
  })

  // ===== LAYOUT ELEMENT RULES =====

  /**
   * @rule layoutElement
   * @description Parses various layout elements, such as containers, stacks, rows, grids, and cards.
   * These elements can contain other elements.
   * @returns {CstNode} A CST node for a layout element.
   */
  layoutElement = this.RULE('layoutElement', () => {
    this.OR([
      // Containers
      { ALT: () => this.CONSUME(ContainerNarrow) },
      { ALT: () => this.CONSUME(ContainerWide) },
      { ALT: () => this.CONSUME(ContainerFull) },
      { ALT: () => this.CONSUME(Container) },
      // Stacks
      { ALT: () => this.CONSUME(StackTight) },
      { ALT: () => this.CONSUME(StackLoose) },
      { ALT: () => this.CONSUME(Stack) },
      { ALT: () => this.CONSUME(StackFlush) },
      // Rows
      { ALT: () => this.CONSUME(RowStart) },
      { ALT: () => this.CONSUME(RowCenter) },
      { ALT: () => this.CONSUME(RowBetween) },
      { ALT: () => this.CONSUME(RowEnd) },
      { ALT: () => this.CONSUME(Col) },
      // Grids
      { ALT: () => this.CONSUME(Grid2) },
      { ALT: () => this.CONSUME(Grid3) },
      { ALT: () => this.CONSUME(Grid4) },
      { ALT: () => this.CONSUME(GridAuto) },
      // Cards
      { ALT: () => this.CONSUME(CardCompact) },
      { ALT: () => this.CONSUME(CardFeature) },
      { ALT: () => this.CONSUME(Card) },
      // Special
      { ALT: () => this.CONSUME(Header) },
      { ALT: () => this.CONSUME(Sidebar) },
    ])
    this.containerWithOptionalContent()
  })

  // ===== STRUCTURE ELEMENT RULES =====

  /**
   * @rule listElement
   * @description Parses a list that is templated with a component, e.g., 'list $MyComponent:'.
   * This is used for rendering a list of items using a reusable component.
   * @returns {CstNode} A CST node for a templated list.
   */
  listElement = this.RULE('listElement', () => {
    this.CONSUME(List)
    this.CONSUME(ComponentInstance)
    this.OPTION(() => {
      this.CONSUME(Colon)
      this.OPTION2(() => {
        this.CONSUME(Indent)
        this.AT_LEAST_ONE(() => {
          this.CONSUME(UnorderedListItem)
        })
        this.OPTION3(() => {
          this.CONSUME(Outdent)
        })
      })
    })
  })

  /**
   * @rule navigatorElement
   * @description Parses a navigator element, which is a list-like structure for navigation.
   * @returns {CstNode} A CST node for a navigator.
   */
  navigatorElement = this.RULE('navigatorElement', () => {
    this.CONSUME(Navigator)
    this.listWithOptionalContent()
  })

  /**
   * @rule fabElement
   * @description Parses a Floating Action Button (FAB) element, which can contain a list of actions.
   * @returns {CstNode} A CST node for a FAB.
   */
  fabElement = this.RULE('fabElement', () => {
    this.CONSUME(Fab)
    this.listWithOptionalContent()
  })

  /**
   * @rule unorderedListElement
   * @description Parses a standalone unordered list item.
   * @returns {CstNode} A CST node for a list item.
   */
  unorderedListElement = this.RULE('unorderedListElement', () => {
    this.CONSUME(UnorderedListItem)
  })

  /**
   * @rule separatorElement
   * @description Parses a separator element, used for visually separating content.
   * @returns {CstNode} A CST node for a separator.
   */
  separatorElement = this.RULE('separatorElement', () => {
    this.CONSUME(Separator)
  })

  // ===== INPUT ELEMENT RULES =====

  /**
   * @rule inputElement
   * @description Parses a generic input element.
   * @returns {CstNode} A CST node for an input.
   */
  inputElement = this.RULE('inputElement', () => {
    this.CONSUME(Input)
  })

  /**
   * @rule radioButtonGroup
   * @description Parses a group of radio button options.
   * @returns {CstNode} A CST node for a radio button group.
   */
  radioButtonGroup = this.RULE('radioButtonGroup', () => {
    this.AT_LEAST_ONE(() => {
      this.CONSUME(RadioOption)
    })
  })

  /**
   * @rule checkboxElement
   * @description Parses a checkbox element.
   * @returns {CstNode} A CST node for a checkbox.
   */
  checkboxElement = this.RULE('checkboxElement', () => {
    this.CONSUME(Checkbox)
  })
}

/**
 * @const parser
 * @description A singleton instance of the UiDslParser.
 * This instance is used throughout the application to parse DSL code.
 */
export const parser = new UiDslParser()
