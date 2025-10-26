/**
 * Input Element Parsing Rules
 * Defines parsing rules for form input elements (Input, Radio, Checkbox)
 */

import { Input, RadioOption, Checkbox } from '../../lexer/tokens'
import type { IParser, RuleDefinitionFunction } from '../../types/parser'

/**
 * Define input element parsing rules
 * This function should be called with the parser instance as `this`
 */
export const defineInputRules: RuleDefinitionFunction = function (
  this: IParser
): void {
  /**
   * @rule inputElement
   * @description Parses a generic input element.
   */
  this.RULE('inputElement', () => {
    this.CONSUME(Input)
  })

  /**
   * @rule radioButtonGroup
   * @description Parses a group of radio button options.
   */
  this.RULE('radioButtonGroup', () => {
    this.AT_LEAST_ONE(() => {
      this.CONSUME(RadioOption)
    })
  })

  /**
   * @rule checkboxElement
   * @description Parses a checkbox element.
   */
  this.RULE('checkboxElement', () => {
    this.CONSUME(Checkbox)
  })
}
