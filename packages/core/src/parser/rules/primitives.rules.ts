/**
 * Primitive Element Parsing Rules
 * Defines parsing rules for basic UI primitives like Buttons, Links, Images, Headings, and Text
 */

import {
  // Buttons
  ButtonPrimary,
  ButtonSecondary,
  ButtonOutline,
  ButtonGhost,
  ButtonDestructive,
  ButtonLink,
  ButtonSuccess,
  ButtonWarning,
  ButtonMarker,
  ButtonSizeSmall,
  ButtonSizeIcon,
  ButtonSizeLarge,
  ButtonLabel,
  ButtonAction,
  // Other primitives
  Link,
  Image,
  Heading,
  Text,
  Paragraph,
  MutedText,
  Note,
  Quote,
} from '../../lexer/tokens'
import type { IParser, RuleDefinitionFunction } from '../../types/parser'

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
   * @description Parses various types of text elements, such as 'Text', 'Paragraph', 'MutedText', 'Note', and 'Quote'.
   */
  this.RULE('textElement', () => {
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
   */
  this.RULE('buttonElement', () => {
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
   * @rule linkElement
   * @description Parses a link element.
   */
  this.RULE('linkElement', () => {
    this.CONSUME(Link)
  })

  /**
   * @rule imageElement
   * @description Parses an image element.
   */
  this.RULE('imageElement', () => {
    this.CONSUME(Image)
  })
}
