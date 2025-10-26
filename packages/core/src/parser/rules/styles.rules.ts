/**
 * Styles Parsing Rules
 * Defines parsing rules for style declarations and CSS custom properties
 */

import { Styles, CssProperty, Colon } from '../../lexer/tokens'
import { Indent, Outdent } from '../../lexer/lexer'
import type { IParser, RuleDefinitionFunction } from '../../types/parser'

/**
 * Define styles parsing rules
 * This function should be called with the parser instance as `this`
 */
export const defineStyleRules: RuleDefinitionFunction = function (
  this: IParser
): void {
  /**
   * @rule styles
   * @description Parses a 'styles' block which contains a list of CSS custom property declarations.
   * This allows for defining a set of reusable style variables.
   */
  this.RULE('styles', () => {
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
   */
  this.RULE('styleDeclaration', () => {
    this.CONSUME(CssProperty)
  })
}
