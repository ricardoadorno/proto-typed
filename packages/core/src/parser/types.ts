/**
 * Parser types for AST building
 * These types help with type safety when working with Chevrotain CST
 */

import type { CstChildrenDictionary, CstNode } from 'chevrotain'
import type { AstNode } from '../types/ast-node'

/**
 * Re-export native Chevrotain type for convenience
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

/**
 * Re-export IToken for convenience
 */
export type { IToken } from 'chevrotain'
