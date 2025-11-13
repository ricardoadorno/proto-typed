/**
 * Component Parsing Rules
 * Defines parsing rules for Component definitions and Component instances
 */

import {
  Component,
  ComponentInstance,
  Identifier,
  Colon,
  UnorderedListItem,
} from '../../lexer/tokens/index'
import { Indent, Outdent } from '../../lexer/lexer.js'
import type { IParser, RuleDefinitionFunction } from '../../types/parser.js'

/**
 * Define component parsing rules
 * This function should be called with the parser instance as `this`
 */
export const defineComponentRules: RuleDefinitionFunction = function (
  this: IParser
): void {
  /**
   * @rule component
   * @description Parses a 'component' declaration. This allows for creating reusable UI components within the DSL.
   */
  this.RULE('component', () => {
    this.CONSUME(Component)
    this.CONSUME(Identifier, { LABEL: 'name' })
    this.CONSUME(Colon)
    this.consumeIndentedElements()
  })

  /**
   * @rule componentInstanceElement
   * @description Parses an instance of a component, e.g., '$MyComponent'. It can optionally have inline props or a list of props.
   */
  this.RULE('componentInstanceElement', () => {
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
}
