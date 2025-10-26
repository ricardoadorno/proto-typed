/**
 * View Container Parsing Rules
 * Defines parsing rules for Screen, Modal, and Drawer elements
 */

import { Screen, Modal, Drawer, Identifier, Colon } from '../../lexer/tokens'
import type { IParser, RuleDefinitionFunction } from '../../types/parser'

/**
 * Define view container parsing rules for Screen, Modal, and Drawer
 * This function should be called with the parser instance as `this`
 */
export const defineViewRules: RuleDefinitionFunction = function (
  this: IParser
): void {
  /**
   * @rule screen
   * @description Parses a 'screen' declaration, which represents a top-level view in the application.
   * A screen has a name and contains a block of UI elements.
   */
  this.RULE('screen', () => {
    this.CONSUME(Screen)
    this.CONSUME(Identifier, { LABEL: 'name' })
    this.CONSUME(Colon)
    this.consumeIndentedElements()
  })

  /**
   * @rule modal
   * @description Parses a 'modal' declaration. Modals are global, reusable UI components that can be shown or hidden.
   */
  this.RULE('modal', () => {
    this.CONSUME(Modal)
    this.CONSUME(Identifier, { LABEL: 'name' })
    this.CONSUME(Colon)
    this.consumeIndentedElements()
  })

  /**
   * @rule drawer
   * @description Parses a 'drawer' declaration. Drawers are similar to modals but typically slide in from the side of the screen.
   */
  this.RULE('drawer', () => {
    this.CONSUME(Drawer)
    this.CONSUME(Identifier, { LABEL: 'name' })
    this.CONSUME(Colon)
    this.consumeIndentedElements()
  })
}
