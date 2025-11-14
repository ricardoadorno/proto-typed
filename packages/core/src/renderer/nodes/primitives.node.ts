import {
  elementStyles,
  getButtonClasses,
  getButtonInlineStyles,
} from './styles/styles.js'
import { NavigationMediator } from '../infrastructure/navigation-mediator.js'
import {
  getLucideSvg,
  isLucideIcon,
  renderInlineContent,
} from '../../utils/icon-utils.js'
import type {
  AstNode,
  ButtonProps,
  ImageProps,
  TextProps,
  TextKind,
} from '../../types/ast-node.js'

/**
 * @function renderButton
 * @description Renders a 'Button' AST node to its HTML representation.
 *
 * @param {AstNode} node - The 'Button' AST node.
 * @returns {string} The HTML string for the button.
 */
export function renderButton(node: AstNode): string {
  const buttonProps = node.props as ButtonProps
  const { text, action, variant, icon, size } = buttonProps
  const buttonText = text || ''

  const buttonNavAttrs = NavigationMediator.generateNavigationAttributes(action)
  const buttonClasses = `${getButtonClasses(variant, size)}`
  const buttonVariant = (variant || 'primary') as
    | 'primary'
    | 'ghost'
    | 'outline'
    | 'secondary'
    | 'destructive'
    | 'warning'
  const buttonInlineStyles = getButtonInlineStyles(buttonVariant)

  // Strategy 1: Explicit icon prop (legacy support)
  if (icon) {
    if (isLucideIcon(icon)) {
      const iconSvg = getLucideSvg(icon)
      return `<button class="${buttonClasses}" style="${buttonInlineStyles}" ${buttonNavAttrs}>${iconSvg}${buttonText ? ' ' + buttonText : ''}</button>`
    }
  }

  // Strategy 2: Use the global renderInlineContent utility
  // This handles any combination:
  // - "i-home" -> icon only
  // - "i-home Dashboard" -> icon + text
  // - "Click i-plus here" -> text + icon + text
  const renderedContent = renderInlineContent(buttonText)

  return `<button class="${buttonClasses}" style="${buttonInlineStyles}" ${buttonNavAttrs}>${renderedContent}</button>`
}

/**
 * @function renderImage
 * @description Renders an 'Image' AST node to its HTML representation.
 *
 * @param {AstNode} node - The 'Image' AST node.
 * @returns {string} The HTML string for the image.
 */
export function renderImage(node: AstNode): string {
  const props = node.props as ImageProps
  const src = props.src || ''
  const alt = props.alt || ''
  const classNames: string[] = [elementStyles.image]

  if (props.shape === 'circle') {
    classNames.push(elementStyles.imageCircle)
  } else if (props.shape === 'rounded') {
    classNames.push(elementStyles.imageRounded)
  }

  const styleSegments: string[] = []
  if (typeof props.widthPx === 'number') {
    styleSegments.push(`width: ${props.widthPx}px`)
  }
  if (typeof props.heightPx === 'number') {
    styleSegments.push(`height: ${props.heightPx}px`)
  }
  if (props.shape === 'circle' && !props.widthPx && !props.heightPx) {
    styleSegments.push('aspect-ratio: 1 / 1')
  }

  const styleAttribute = styleSegments.length
    ? ` style="${styleSegments.join('; ')}"`
    : ''

  return `<img src="${src}" alt="${alt}" class="${classNames.join(' ')}"${styleAttribute} />`
}

export const TYPO_CLASSES: Record<TextKind, string> = {
  h1: 'scroll-m-20 text-4xl font-extrabold tracking-tight text-[var(--fg-primary)]',
  h2: 'scroll-m-20 text-3xl font-semibold tracking-tight text-[var(--fg-primary)]',
  h3: 'scroll-m-20 text-2xl font-semibold tracking-tight text-[var(--fg-primary)]',
  h4: 'scroll-m-20 text-xl font-semibold tracking-tight text-[var(--fg-primary)]',
  p: 'text-base leading-7 text-[var(--fg-secondary)]',
  small: 'text-sm leading-6 text-[var(--fg-secondary)]',
  muted: 'text-sm leading-6 text-muted-foreground',
  blockquote: 'mt-6 border-l-2 pl-6 italic text-muted-foreground',
  note: 'text-sm text-[var(--fg-secondary)] rounded-lg border border-[var(--border-muted)] bg-[var(--bg-raised)] px-3 py-2',
}

const TYPO_TAG: Record<TextKind, string> = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  p: 'p',
  small: 'p',
  muted: 'p',
  blockquote: 'blockquote',
  note: 'div',
}

function normalizeKind(kind?: string | null): TextKind {
  if (!kind) return 'p'
  if (Object.hasOwn(TYPO_CLASSES, kind as TextKind)) {
    return kind as TextKind
  }
  return 'p'
}

/**
 * @function renderText
 * @description Renders a typography 'Text' AST node using shadcn/ui classes.
 *
 * @param {AstNode} node - The 'Text' AST node.
 * @returns {string} The HTML string for the typography element.
 */
export function renderText(node: AstNode): string {
  const props = node.props as TextProps
  const resolvedKind = normalizeKind(props.kind ?? node.kind)
  const value = props.value ?? node.value ?? ''
  const classes = TYPO_CLASSES[resolvedKind]
  const tag = TYPO_TAG[resolvedKind] || 'p'

  // Support inline icons and markdown links in text content
  const renderedContent = renderInlineContent(value)

  if (resolvedKind === 'note') {
    return `<${tag} class="${classes}" role="note">${renderedContent}</${tag}>`
  }

  return `<${tag} class="${classes}">${renderedContent}</${tag}>`
}

/**
 * @function renderLink
 * @description Renders a 'Link' AST node to its HTML representation.
 *
 * @param {AstNode} node - The 'Link' AST node.
 * @returns {string} The HTML string for the link.
 */
export function renderLink(node: AstNode): string {
  const linkProps = node.props as any
  const text = linkProps?.text || node.value || 'Link'
  const destination = linkProps?.destination || '#'
  const external = linkProps?.external || destination.startsWith('http') || destination.startsWith('mailto:')

  if (external) {
    return `<a href="${destination}" target="_blank" rel="noopener noreferrer" class="text-primary underline-offset-4 hover:underline">${text}</a>`
  } else {
    return `<a href="${destination}" class="text-primary underline-offset-4 hover:underline">${text}</a>`
  }
}

/**
 * @function renderHeading
 * @description Renders a 'Heading' AST node to its HTML representation.
 *
 * @param {AstNode} node - The 'Heading' AST node.
 * @returns {string} The HTML string for the heading.
 */
export function renderHeading(node: AstNode): string {
  const textProps = node.props as TextProps
  const kind = (node.kind || textProps?.kind || 'h2') as TextKind
  const value = textProps?.value || node.value || ''
  const classes = TYPO_CLASSES[kind] || TYPO_CLASSES.h2
  const level = kind === 'h1' ? '1' : kind === 'h2' ? '2' : kind === 'h3' ? '3' : kind === 'h4' ? '4' : '2'

  const renderedContent = renderInlineContent(value)
  return `<h${level} class="${classes}">${renderedContent}</h${level}>`
}

/**
 * @function renderParagraph
 * @description Renders a 'Paragraph' AST node to its HTML representation.
 *
 * @param {AstNode} node - The 'Paragraph' AST node.
 * @returns {string} The HTML string for the paragraph.
 */
export function renderParagraph(node: AstNode): string {
  const textProps = node.props as TextProps
  const value = textProps?.value || node.value || ''
  const classes = TYPO_CLASSES.p
  const renderedContent = renderInlineContent(value)
  return `<p class="${classes}">${renderedContent}</p>`
}

/**
 * @function renderMutedText
 * @description Renders a 'MutedText' AST node to its HTML representation.
 *
 * @param {AstNode} node - The 'MutedText' AST node.
 * @returns {string} The HTML string for the muted text.
 */
export function renderMutedText(node: AstNode): string {
  const textProps = node.props as TextProps
  const value = textProps?.value || node.value || ''
  const classes = TYPO_CLASSES.muted
  const renderedContent = renderInlineContent(value)
  return `<p class="${classes}">${renderedContent}</p>`
}

/**
 * @function renderNote
 * @description Renders a 'Note' AST node to its HTML representation.
 *
 * @param {AstNode} node - The 'Note' AST node.
 * @returns {string} The HTML string for the note.
 */
export function renderNote(node: AstNode): string {
  const textProps = node.props as TextProps
  const value = textProps?.value || node.value || ''
  const classes = TYPO_CLASSES.note
  const renderedContent = renderInlineContent(value)
  return `<div class="${classes}" role="note">${renderedContent}</div>`
}

/**
 * @function renderQuote
 * @description Renders a 'Quote' AST node to its HTML representation.
 *
 * @param {AstNode} node - The 'Quote' AST node.
 * @returns {string} The HTML string for the quote.
 */
export function renderQuote(node: AstNode): string {
  const textProps = node.props as TextProps
  const value = textProps?.value || node.value || ''
  const classes = TYPO_CLASSES.blockquote
  const renderedContent = renderInlineContent(value)
  return `<blockquote class="${classes}">${renderedContent}</blockquote>`
}
