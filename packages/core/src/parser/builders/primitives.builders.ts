/**
 * Primitive element builders for AST construction
 * Handles typography, buttons, links, images, and icons
 */

import type { IToken } from 'chevrotain'
import {
  validateButtonVariant,
  validateButtonSize,
  validateRequiredProps,
} from './builder-validation'
import type { CstContext, CstVisitor } from '../../types/parser'
import type { TextKind } from '../../types/ast-node'

/**
 * @function buildHeadingElement
 * @description Builds a typography heading 'Text' AST node from the corresponding CST node.
 * It determines the heading level by counting the '#' characters and extracts the content.
 *
 * @param {Context} ctx - The Chevrotain CST node context for the heading.
 * @returns {object | null} A 'Text' AST node, or null if the token is invalid.
 */
export function buildHeadingElement(ctx: CstContext) {
  if (!ctx.Heading || !ctx.Heading[0]) {
    return null
  }

  const headingToken = ctx.Heading[0] as IToken
  const headingText = headingToken.image

  // Extract the level by counting the # characters
  const hashMatch = headingText.match(/^(?:\r\n|\r|\n|\s)*(#+)(?!#)\s+/)
  const level = hashMatch ? hashMatch[1].length : 1

  // Extract the content by matching everything after the # and whitespace
  const contentMatch = headingText.match(/#+\s+([^\n\r#[\]"=:]+)/)
  const content = contentMatch ? contentMatch[1].trim() : ''

  const kindMap: Record<number, TextKind> = {
    1: 'h1',
    2: 'h2',
    3: 'h3',
    4: 'h4',
  }
  const kind = kindMap[level as keyof typeof kindMap] || 'h4'

  return {
    type: 'Text',
    id: '', // ID will be generated later
    props: {
      kind,
      value: content,
    },
    children: [],
    kind,
    value: content,
  }
}

/**
 * @function buildTextElement
 * @description Builds a typography 'Text' AST node from the corresponding CST node.
 * It determines the semantic kind (paragraph, small, muted, blockquote, note) and extracts the content.
 *
 * @param {Context} ctx - The Chevrotain CST node context for the text element.
 * @returns {object} A 'Text' AST node with semantic typography metadata.
 */
export function buildTextElement(ctx: CstContext) {
  let kind: TextKind = 'p'
  let value = ''

  if (ctx.Paragraph) {
    const match = (ctx.Paragraph[0] as IToken).image.match(/>\s+([^\n\r]+)/)
    value = match ? match[1].trim() : ''
    kind = 'p'
  } else if (ctx.SmallText) {
    const match = (ctx.SmallText[0] as IToken).image.match(/>>\s+([^\n\r]+)/)
    value = match ? match[1].trim() : ''
    kind = 'small'
  } else if (ctx.MutedText) {
    const match = (ctx.MutedText[0] as IToken).image.match(/>>>\s+([^\n\r]+)/)
    value = match ? match[1].trim() : ''
    kind = 'muted'
  } else if (ctx.Blockquote) {
    const match = (ctx.Blockquote[0] as IToken).image.match(
      /\*(?!\*)>\s+([^\n\r]+)/
    )
    value = match ? match[1].trim() : ''
    kind = 'blockquote'
  } else if (ctx.Note) {
    const match = (ctx.Note[0] as IToken).image.match(/\*\*>[ \t]+([^\n\r]+)/)
    value = match ? match[1].trim() : ''
    kind = 'note'
  }

  return {
    type: 'Text',
    id: '', // ID will be generated later
    props: {
      kind,
      value,
    },
    children: [],
    kind,
    value,
  }
}

/**
 * @function buildButtonElement
 * @description Builds a 'Button' AST node from the corresponding CST node.
 * It parses the button's variant, size, text, and action.
 *
 * @param {Context} ctx - The Chevrotain CST node context for the button.
 * @param {any} visitor - The CST visitor instance.
 * @returns {object} A 'Button' AST node.
 */
export function buildButtonElement(ctx: CstContext, visitor: CstVisitor) {
  let variant = 'primary' // Default variant
  let size: string | undefined // Default size determined later
  let text = ''
  let action = ''

  // Get token for line/column info
  const buttonToken = (ctx.ButtonPrimary?.[0] ||
    ctx.ButtonSecondary?.[0] ||
    ctx.ButtonOutline?.[0] ||
    ctx.ButtonGhost?.[0] ||
    ctx.ButtonMarker?.[0]) as IToken | undefined
  const line = buttonToken?.startLine
  const column = buttonToken?.startColumn

  // Determine variant from which token is present
  if (ctx.ButtonPrimary) variant = 'primary'
  else if (ctx.ButtonSecondary) variant = 'secondary'
  else if (ctx.ButtonOutline) variant = 'outline'
  else if (ctx.ButtonGhost) variant = 'ghost'
  else if (ctx.ButtonDestructive) variant = 'destructive'
  else if (ctx.ButtonSuccess) variant = 'success'
  else if (ctx.ButtonWarning) variant = 'warning'
  else if (ctx.ButtonMarker) variant = 'primary' // Default marker maps to primary

  // Validate variant
  variant = validateButtonVariant(visitor, variant, line, column)

  // Determine size from which token is present
  if (ctx.ButtonSizeSmall) size = 'small'
  else if (ctx.ButtonSizeIcon) size = 'icon'
  else if (ctx.ButtonSizeLarge) size = 'large'

  // Validate size and fallback to default when undefined
  const resolvedSize = validateButtonSize(visitor, size, line, column)

  // Extract label text from ButtonLabel token
  if (ctx.ButtonLabel && ctx.ButtonLabel[0]) {
    const labelMatch = (ctx.ButtonLabel[0] as IToken).image.match(
      /\[([^\]]+)\]/
    )
    text = labelMatch ? labelMatch[1] : ''
  }

  // Extract action from ButtonAction token (optional)
  if (ctx.ButtonAction && ctx.ButtonAction[0]) {
    const actionMatch = (ctx.ButtonAction[0] as IToken).image.match(
      /\(([^)]+)\)/
    )
    action = actionMatch ? actionMatch[1] : ''
  }

  // Validate required props
  validateRequiredProps(visitor, { text }, ['text'], 'Button', line, column)

  return {
    type: 'Button',
    id: '', // ID will be generated later
    props: {
      action,
      text,
      variant,
      size: resolvedSize,
    },
    children: [],
  }
}

/**
 * @function buildImageElement
 * @description Builds an 'Image' AST node from the corresponding CST node.
 * It parses the image's alt text and source URL from both Markdown and DSL syntaxes.
 *
 * @param {Context} ctx - The Chevrotain CST node context for the image.
 * @returns {object} An 'Image' AST node.
 */
export function buildImageElement(ctx: CstContext) {
  const imageText = (ctx.Image[0] as IToken).image
  let text = '',
    url = '',
    shape: 'rounded' | 'circle' | undefined,
    widthPx: number | undefined,
    heightPx: number | undefined

  const markdownMatch = imageText.match(
    /^!(?:(rounded|circle)(?:-(\d+)x(\d+))?)?\[([^\]]+)\](?:\(([^)]+)\))?/
  )
  const dslMatch = imageText.match(/image\s+\["([^"]*)"\]\s+([^\n\r]+)/)

  if (markdownMatch) {
    shape = (markdownMatch[1] as 'rounded' | 'circle' | undefined) || undefined
    widthPx = markdownMatch[2] ? Number(markdownMatch[2]) : undefined
    heightPx = markdownMatch[3] ? Number(markdownMatch[3]) : undefined
    text = markdownMatch[4]
    url = markdownMatch[5] || '' // URL is now optional, default to empty string
  } else if (dslMatch) {
    url = dslMatch[1]
    text = dslMatch[2]
  }

  return {
    type: 'Image',
    id: '', // ID will be generated later
    props: {
      src: url,
      alt: text,
      shape,
      widthPx,
      heightPx,
    },
    children: [],
  }
}
