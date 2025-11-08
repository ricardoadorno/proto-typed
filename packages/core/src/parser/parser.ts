import { CstParser } from 'chevrotain'
import { allTokens } from '../lexer/tokens'
import { Indent, Outdent } from '../lexer/lexer'
import {
  defineViewRules,
  defineComponentRules,
  definePrimitiveRules,
  defineLayoutRules,
  defineInputRules,
  defineHeadRules,
  defineMetaRules,
  defineCoreRules,
  defineHelperMethods,
} from './rules'
import type { ParserRule } from '../types/parser'

/**
 * @class UiDslParser
 * @extends CstParser
 * @description This class defines the grammar for the UI DSL. It uses Chevrotain to create a Concrete Syntax Tree (CST) parser.
 * The parser is responsible for understanding the structure of the DSL and reporting any syntax errors.
 * It includes rules for parsing various UI elements, layouts, components, and styles.
 * The grammar is defined using a series of rules, starting from the top-level 'program' rule.
 *
 * The parsing rules are now modularized into separate files for better organization:
 * - core.rules.ts: Program and element dispatcher rules
 * - views.rules.ts: Screen, Modal, Drawer parsing rules
 * - components.rules.ts: Component and ComponentInstance parsing rules
 * - primitives.rules.ts: Button, Image, Heading, Text parsing rules
 * - layouts.rules.ts: Layout, List, Navigator, FAB parsing rules
 * - inputs.rules.ts: Input, Radio, Checkbox parsing rules
 * - head.rules.ts: Head configuration parsing rules (colors, fonts, templates)
 */
export class UiDslParser extends CstParser {
  // Declare all rules as properties (required for TypeScript)
  program!: ParserRule
  element!: ParserRule
  screen!: ParserRule
  modal!: ParserRule
  drawer!: ParserRule
  component!: ParserRule
  componentInstanceElement!: ParserRule
  buttonElement!: ParserRule
  imageElement!: ParserRule
  headingElement!: ParserRule
  textElement!: ParserRule
  layoutElement!: ParserRule
  listElement!: ParserRule
  navigatorElement!: ParserRule
  fabElement!: ParserRule
  unorderedListElement!: ParserRule
  separatorElement!: ParserRule
  inputElement!: ParserRule
  radioButtonGroup!: ParserRule
  checkboxElement!: ParserRule
  head!: ParserRule
  headColorSection!: ParserRule
  colorProperty!: ParserRule
  headFontSection!: ParserRule
  fontBaseSection!: ParserRule
  fontProperty!: ParserRule
  headTemplateSection!: ParserRule
  templateProperty!: ParserRule
  meta!: ParserRule
  metaProperty!: ParserRule

  // Helper methods
  consumeIndentedElements!: () => void
  containerWithOptionalContent!: () => void
  listWithOptionalContent!: () => void

  /**
   * @constructor
   * @description Initializes the parser with all the tokens defined in the lexer.
   * It also configures the parser for error recovery and self-analysis.
   * The parsing rules are defined by importing and applying modular rule definitions.
   */
  constructor() {
    super([Indent, Outdent, ...allTokens], {
      nodeLocationTracking: 'full',
      // Enable automatic error recovery - parser will try to continue after errors
      recoveryEnabled: true,
      // Maximum lookahead for better error recovery (default is 4)
      maxLookahead: 3,
    })

    // Define helper methods first (needed by other rules)
    // Cast to any temporarily to bypass protected method restrictions
    defineHelperMethods.call(
      this as unknown as import('../types/parser').IParser
    )

    // Define all parsing rules from modular rule files
    // Order matters: head, meta and views must be defined before core.program references them
    defineHeadRules.call(this as unknown as import('../types/parser').IParser)
    defineMetaRules.call(this as unknown as import('../types/parser').IParser)
    defineViewRules.call(this as unknown as import('../types/parser').IParser)
    defineComponentRules.call(
      this as unknown as import('../types/parser').IParser
    )
    definePrimitiveRules.call(
      this as unknown as import('../types/parser').IParser
    )
    defineLayoutRules.call(this as unknown as import('../types/parser').IParser)
    defineInputRules.call(this as unknown as import('../types/parser').IParser)
    defineCoreRules.call(this as unknown as import('../types/parser').IParser)

    // Perform self-analysis to validate the grammar
    this.performSelfAnalysis()
  }
}

/**
 * @const parser
 * @description A singleton instance of the UiDslParser.
 * This instance is used throughout the application to parse DSL code.
 */
let parser: UiDslParser | null = null

export function getParser() {
  if (parser) {
    return parser
  }
  parser = new UiDslParser()
  return parser
}
