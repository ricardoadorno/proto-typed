/**
 * Head Parsing Rules
 * Defines parsing rules for head configuration (colors, fonts, templates)
 */

import {
  Head,
  HeadColor,
  HeadFont,
  HeadTemplate,
  ColorPrimary,
  ColorSecondary,
  ColorNeutral,
  ColorAccent,
  FontBase,
  FontFamily,
  TemplateDefault,
  PropertyValue,
  ComponentInstance,
  Identifier,
  Colon,
} from '../../lexer/tokens/index'
import { Indent, Outdent } from '../../lexer/lexer.js'
import type { IParser, RuleDefinitionFunction } from '../../types/parser.js'

/**
 * Define head parsing rules
 * This function should be called with the parser instance as `this`
 */
export const defineHeadRules: RuleDefinitionFunction = function (
  this: IParser
): void {
  /**
   * @rule head
   * @description Parses a 'head' block which contains color, font, and template configurations.
   */
  this.RULE('head', () => {
    this.CONSUME(Head)
    this.CONSUME(Colon)
    this.MANY(() => {
      this.OR([
        { ALT: () => this.CONSUME(Indent) },
        { ALT: () => this.CONSUME(Outdent) },
        { ALT: () => this.SUBRULE(this.headColorSection) },
        { ALT: () => this.SUBRULE(this.headFontSection) },
        { ALT: () => this.SUBRULE(this.headTemplateSection) },
      ])
    })
  })

  /**
   * @rule headColorSection
   * @description Parses the 'color' section within head block
   */
  this.RULE('headColorSection', () => {
    this.CONSUME(HeadColor)
    this.CONSUME(Colon)
    this.MANY(() => {
      this.OR([
        { ALT: () => this.CONSUME(Indent) },
        { ALT: () => this.CONSUME(Outdent) },
        { ALT: () => this.SUBRULE(this.colorProperty) },
      ])
    })
  })

  /**
   * @rule colorProperty
   * @description Parses color properties (primary, secondary, neutral, accent)
   */
  this.RULE('colorProperty', () => {
    this.OR([
      { ALT: () => this.CONSUME(ColorPrimary) },
      { ALT: () => this.CONSUME(ColorSecondary) },
      { ALT: () => this.CONSUME(ColorNeutral) },
      { ALT: () => this.CONSUME(ColorAccent) },
    ])
    this.CONSUME(Colon)
    // Accept both Identifier (for hex like #0047AB) and PropertyValue
    this.OR2([
      { ALT: () => this.CONSUME(Identifier) },
      { ALT: () => this.CONSUME(PropertyValue) },
    ])
  })

  /**
   * @rule headFontSection
   * @description Parses the 'font' section within head block
   */
  this.RULE('headFontSection', () => {
    this.CONSUME(HeadFont)
    this.CONSUME(Colon)
    this.MANY(() => {
      this.OR([
        { ALT: () => this.CONSUME(Indent) },
        { ALT: () => this.CONSUME(Outdent) },
        { ALT: () => this.SUBRULE(this.fontBaseSection) },
      ])
    })
  })

  /**
   * @rule fontBaseSection
   * @description Parses the 'base' subsection within font
   */
  this.RULE('fontBaseSection', () => {
    this.CONSUME(FontBase)
    this.CONSUME(Colon)
    this.MANY(() => {
      this.OR([
        { ALT: () => this.CONSUME(Indent) },
        { ALT: () => this.CONSUME(Outdent) },
        { ALT: () => this.SUBRULE(this.fontProperty) },
      ])
    })
  })

  /**
   * @rule fontProperty
   * @description Parses font properties (family)
   */
  this.RULE('fontProperty', () => {
    this.CONSUME(FontFamily)
    this.CONSUME(Colon)
    this.OR([
      { ALT: () => this.CONSUME(Identifier) },
      { ALT: () => this.CONSUME(PropertyValue) },
    ])
  })

  /**
   * @rule headTemplateSection
   * @description Parses the 'template' section within head block
   */
  this.RULE('headTemplateSection', () => {
    this.CONSUME(HeadTemplate)
    this.CONSUME(Colon)
    this.MANY(() => {
      this.OR([
        { ALT: () => this.CONSUME(Indent) },
        { ALT: () => this.CONSUME(Outdent) },
        { ALT: () => this.SUBRULE(this.templateProperty) },
      ])
    })
  })

  /**
   * @rule templateProperty
   * @description Parses template properties (default)
   */
  this.RULE('templateProperty', () => {
    this.CONSUME(TemplateDefault)
    this.CONSUME(Colon)
    this.OR([
      { ALT: () => this.CONSUME(ComponentInstance) },
      { ALT: () => this.CONSUME(PropertyValue) },
    ])
  })
}
