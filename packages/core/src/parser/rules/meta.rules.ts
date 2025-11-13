/**
 * Meta Parsing Rules
 * Defines parsing rules for meta configuration (version, title)
 */

import {
  Meta,
  MetaVersion,
  MetaTitle,
  MetaValue,
  Identifier,
  Colon,
} from '../../lexer/tokens/index'
import { Indent, Outdent } from '../../lexer/lexer.js'
import type { IParser, RuleDefinitionFunction } from '../../types/parser.js'

/**
 * Define meta parsing rules
 * This function should be called with the parser instance as `this`
 */
export const defineMetaRules: RuleDefinitionFunction = function (
  this: IParser
): void {
  /**
   * @rule meta
   * @description Parses a 'meta' block which contains version and title configurations.
   */
  this.RULE('meta', () => {
    this.CONSUME(Meta)
    this.CONSUME(Colon)
    this.MANY(() => {
      this.OR([
        { ALT: () => this.CONSUME(Indent) },
        { ALT: () => this.CONSUME(Outdent) },
        { ALT: () => this.SUBRULE(this.metaProperty) },
      ])
    })
  })

  /**
   * @rule metaProperty
   * @description Parses meta properties (version, title)
   */
  this.RULE('metaProperty', () => {
    this.OR([
      { ALT: () => this.CONSUME(MetaVersion) },
      { ALT: () => this.CONSUME(MetaTitle) },
    ])
    this.CONSUME(Colon)
    // Accept both Identifier and MetaValue
    this.OR2([
      { ALT: () => this.CONSUME(Identifier) },
      { ALT: () => this.CONSUME(MetaValue) },
    ])
  })
}
