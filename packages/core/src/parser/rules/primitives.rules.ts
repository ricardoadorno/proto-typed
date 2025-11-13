/**
 * Primitive Element Parsing Rules
 * Defines parsing rules for basic UI primitives like Buttons, Images, Headings, and Text
 */

import {
  // Buttons
  ButtonPrimary,
  ButtonSecondary,
  ButtonOutline,
  ButtonGhost,
  ButtonDestructive,
  ButtonSuccess,
  ButtonWarning,
  ButtonMarker,
  ButtonSizeSmall,
  ButtonSizeIcon,
  ButtonSizeLarge,
  ButtonLabel,
  ButtonAction,
  // Other primitives
  Image,
  Heading,
  Paragraph,
  SmallText,
  MutedText,
  Blockquote,
  Note,
} from '../../lexer/tokens/index'
import type { IParser, RuleDefinitionFunction } from '../../types/parser.js'

/**
 * Define primitive element parsing rules
 * This function should be called with the parser instance as `this`
 */
export const definePrimitiveRules: RuleDefinitionFunction = function (
  this: IParser
): void {
  /**
   * @rule headingElement
   * @description Parses a heading element.
   */
  this.RULE('headingElement', () => {
    this.CONSUME(Heading)
  })

  /**
   * @rule textElement
   * @description Parses various types of text elements, covering paragraph, small, muted, blockquote, and note styles.
   */
  this.RULE('textElement', () => {
    this.OR([
      { ALT: () => this.CONSUME(Paragraph) },
      { ALT: () => this.CONSUME(SmallText) },
      { ALT: () => this.CONSUME(MutedText) },
      { ALT: () => this.CONSUME(Blockquote) },
      { ALT: () => this.CONSUME(Note) },
    ])
  })

  /**
   * @rule buttonElement
   * @description Parses a button element. It can have a variant, size, a required label, and an optional action.
   */
  this.RULE('buttonElement', () => {
    // Parse button variant (or default marker)
    this.OR([
      { ALT: () => this.CONSUME(ButtonPrimary) },
      { ALT: () => this.CONSUME(ButtonSecondary) },
      { ALT: () => this.CONSUME(ButtonOutline) },
      { ALT: () => this.CONSUME(ButtonGhost) },
      { ALT: () => this.CONSUME(ButtonDestructive) },
      { ALT: () => this.CONSUME(ButtonSuccess) },
      { ALT: () => this.CONSUME(ButtonWarning) },
      { ALT: () => this.CONSUME(ButtonMarker) }, // Default: primary
    ])

    // Parse optional size
    this.OPTION(() => {
      this.OR2([
        { ALT: () => this.CONSUME(ButtonSizeSmall) },
        { ALT: () => this.CONSUME(ButtonSizeIcon) },
        { ALT: () => this.CONSUME(ButtonSizeLarge) },
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
   * @rule imageElement
   * @description Parses an image element.
   */
  this.RULE('imageElement', () => {
    this.CONSUME(Image)
  })
}
