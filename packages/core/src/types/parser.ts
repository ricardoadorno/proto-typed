/**
 * Parser type definitions
 * Type-safe interfaces for parser rules and methods
 */

import type {
  CstChildrenDictionary,
  CstNode,
  IToken,
  TokenType,
} from 'chevrotain'
import type { AstNode } from './ast-node'

// Re-export commonly used Chevrotain types
export type { CstNode, IToken, TokenType, CstChildrenDictionary }

/**
 * Parser rule function signature
 */
export type ParserRule = (idxInCallingRule?: number, ...args: unknown[]) => void

/**
 * Parser interface with all grammar rules
 * This interface defines the contract for our parser without extending CstParser
 * to avoid issues with protected methods
 */
export interface IParser {
  // Core rules
  program: ParserRule
  element: ParserRule

  // View container rules
  screen: ParserRule
  modal: ParserRule
  drawer: ParserRule

  // Component rules
  component: ParserRule
  componentInstanceElement: ParserRule

  // Primitive rules
  buttonElement: ParserRule
  linkElement: ParserRule
  imageElement: ParserRule
  headingElement: ParserRule
  textElement: ParserRule

  // Layout rules
  layoutElement: ParserRule
  listElement: ParserRule
  navigatorElement: ParserRule
  fabElement: ParserRule
  unorderedListElement: ParserRule
  separatorElement: ParserRule

  // Input rules
  inputElement: ParserRule
  radioButtonGroup: ParserRule
  checkboxElement: ParserRule

  // Head rules (formerly Style rules)
  head: ParserRule
  headColorSection: ParserRule
  colorProperty: ParserRule
  headFontSection: ParserRule
  fontBaseSection: ParserRule
  fontProperty: ParserRule
  headTemplateSection: ParserRule
  templateProperty: ParserRule

  // Helper methods
  consumeIndentedElements: () => void
  containerWithOptionalContent: () => void
  listWithOptionalContent: () => void

  // Chevrotain methods (typed) - these mirror the protected methods
  RULE: <T>(
    name: string,
    implementation: () => T,
    config?: { resyncEnabled?: boolean }
  ) => (idxInCallingRule?: number, ...args: unknown[]) => T

  CONSUME: (tokType: TokenType, options?: { LABEL?: string }) => IToken

  SUBRULE: <T>(
    ruleToCall: (idx?: number) => T,
    options?: { LABEL?: string; ARGS?: unknown[] }
  ) => T

  OPTION: <T>(actionORMethodDef: () => T) => T | undefined

  OPTION2: <T>(actionORMethodDef: () => T) => T | undefined

  OPTION3: <T>(actionORMethodDef: () => T) => T | undefined

  OR: <T>(altsOrOpts: Array<{ ALT: () => T }>) => T

  OR2: <T>(altsOrOpts: Array<{ ALT: () => T }>) => T

  MANY: (actionORMethodDef: () => void) => void

  MANY2: (actionORMethodDef: () => void) => void

  AT_LEAST_ONE: (actionORMethodDef: () => void) => void
}

/**
 * Rule definition function type
 * All rule definition functions follow this signature
 */
export type RuleDefinitionFunction = (this: IParser) => void

/**
 * CST Context - Re-export native Chevrotain type for convenience
 */
export type CstContext = CstChildrenDictionary

/**
 * Visitor interface for traversing CST
 */
export interface CstVisitor {
  visit(cstNode: CstNode | CstNode[]): AstNode | AstNode[]
  validateVisitor(): void
}

/**
 * Builder function type
 */
export type BuilderFunction = (
  ctx: CstContext,
  visitor: CstVisitor
) => AstNode | null
