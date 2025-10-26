/**
 * Core Parsing Rules
 * Defines the main program rule and element dispatcher
 */

import { Colon, UnorderedListItem } from '../../lexer/tokens'
import { Indent, Outdent } from '../../lexer/lexer'
import type { IParser, RuleDefinitionFunction } from '../../types/parser'

/**
 * Define core parsing rules
 * This function should be called with the parser instance as `this`
 */
export const defineCoreRules: RuleDefinitionFunction = function (
  this: IParser
): void {
  /**
   * @rule program
   * @description The top-level rule of the grammar. It can parse a sequence of screens, components, modals, drawers, and styles.
   * This allows for defining multiple top-level elements in a single DSL file.
   */
  this.RULE('program', () => {
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

  /**
   * @rule element
   * @description This is a central dispatcher rule that determines which specific UI element to parse.
   * The order of alternatives is important for parsing precedence.
   */
  this.RULE('element', () => {
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
}

/**
 * Define helper methods for the parser
 * This function should be called with the parser instance as `this`
 */
export const defineHelperMethods: RuleDefinitionFunction = function (
  this: IParser
): void {
  /**
   * @private
   * @method consumeIndentedElements
   * @description A helper method to consume a block of indented UI elements.
   * It handles a mix of Indent, Outdent, and element tokens, which is common for nested content.
   */
  this.consumeIndentedElements = (): void => {
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
  this.containerWithOptionalContent = (): void => {
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
  this.listWithOptionalContent = (): void => {
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
}
