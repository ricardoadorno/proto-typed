/**
 * Utility functions for handling Lucide icons
 */
import { icons } from 'lucide'
import { NavigationMediator } from '../renderer/infrastructure/navigation-mediator'
import {
  elementStyles,
  getLinkInlineStyles,
} from '../renderer/nodes/styles/styles'

// Cache para melhorar performance
let lucideIconsCache: Set<string> | null = null

/**
 * Get all available Lucide icons synchronously
 */
function getLucideIcons(): Set<string> {
  if (lucideIconsCache) {
    return lucideIconsCache
  }

  const iconNames = Object.keys(icons)
  lucideIconsCache = new Set(iconNames)
  return lucideIconsCache
}

/**
 * Check if a string is a valid Lucide icon name with 'i-' prefix
 * Now accepts patterns like 'i-home', 'i-trash', etc.
 */
export function isLucideIcon(text: string): boolean {
  // Check if text starts with 'i-' and has at least one more character
  if (!text.startsWith('i-') || text.length < 3) {
    return false
  }

  // Extract the icon name without the 'i-' prefix
  const iconName = text.substring(2)

  // Check if the icon name (without 'i-') exists in Lucide icons
  const iconSet = getLucideIcons()
  return iconSet.has(iconName)
}

/**
 * Get the SVG content for a Lucide icon with 'i-' prefix
 * Accepts patterns like 'i-home', 'i-trash', etc.
 */
export function getLucideSvg(iconName: string): string {
  // Remove the 'i-' prefix if present
  const actualIconName = iconName.startsWith('i-')
    ? iconName.substring(2)
    : iconName

  const icon = icons[actualIconName as keyof typeof icons]
  if (!icon) {
    return ''
  }

  // Lucide icon structure: [tag, attrs, children[]]
  // type IconNode = readonly [tag: string, attrs: SVGProps, children?: IconNodeChild[]];
  // type IconNodeChild = readonly [tag: string, attrs: SVGProps];
  try {
    // Build SVG as string instead of using DOM methods
    // This works both on server and client side
    let svgContent = ''

    // Icon is a tuple: [tag, attrs, children]
    if (Array.isArray(icon) && icon.length >= 2) {
      // The icon root element (index 0, 1) represents the <svg> tag itself
      // The children (index 2) contains the actual SVG path/element content
      const children = icon[2] as
        | Array<readonly [string, Record<string, string | number>]>
        | undefined

      if (children && Array.isArray(children)) {
        children.forEach((child) => {
          if (Array.isArray(child) && child.length >= 2) {
            const [tagName, attributes] = child
            if (tagName && typeof tagName === 'string') {
              const attrs =
                attributes && typeof attributes === 'object'
                  ? Object.entries(attributes)
                      .map(([key, value]) => `${key}="${String(value)}"`)
                      .join(' ')
                  : ''
              svgContent += `<${tagName}${attrs ? ' ' + attrs : ''} />`
            }
          }
        })
      }
    }

    return `<svg class="inline-block" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-left: 0.5rem; margin-right: 0.5rem;">${svgContent}</svg>`
  } catch (error) {
    console.warn(
      `Error rendering Lucide icon ${actualIconName} (from ${iconName}):`,
      error
    )
    return ''
  }
}

/**
 * Interface for parsed text with icons
 */
export interface TextWithIconParts {
  /** Whether the text contains any icons */
  hasIcons: boolean
  /** The original text */
  originalText: string
  /** Parts of the text: either plain text or icon references */
  parts: Array<{ type: 'text' | 'icon'; content: string }>
}

/**
 * Parse text to detect icons in the format 'i-iconname'
 * This can detect icons anywhere in the text:
 * - "i-home" -> icon only
 * - "i-home Dashboard" -> icon + text
 * - "Click i-plus to add" -> text + icon + text
 *
 * @param text - The text to parse
 * @returns Parsed structure with icon and text parts
 */
export function parseTextWithIcons(text: string): TextWithIconParts {
  if (!text || typeof text !== 'string') {
    return {
      hasIcons: false,
      originalText: text || '',
      parts: text ? [{ type: 'text', content: text }] : [],
    }
  }

  // Regex to match icon pattern: i-<iconname>
  // Word boundary ensures we match complete icon names
  const iconPattern = /\b(i-[a-zA-Z][a-zA-Z0-9-]*)\b/g

  const parts: Array<{ type: 'text' | 'icon'; content: string }> = []
  let lastIndex = 0
  let hasIcons = false
  let match: RegExpExecArray | null

  while ((match = iconPattern.exec(text)) !== null) {
    const iconName = match[1]

    // Validate that this is actually a Lucide icon
    if (isLucideIcon(iconName)) {
      hasIcons = true

      // Add text before the icon (if any)
      if (match.index > lastIndex) {
        const textBefore = text.substring(lastIndex, match.index)
        if (textBefore) {
          parts.push({ type: 'text', content: textBefore })
        }
      }

      // Add the icon
      parts.push({ type: 'icon', content: iconName })

      lastIndex = match.index + match[0].length
    }
  }

  // Add remaining text after the last icon (if any)
  if (lastIndex < text.length) {
    const remainingText = text.substring(lastIndex)
    if (remainingText) {
      parts.push({ type: 'text', content: remainingText })
    }
  }

  // If no icons found, return the whole text as a single text part
  if (!hasIcons) {
    return {
      hasIcons: false,
      originalText: text,
      parts: [{ type: 'text', content: text }],
    }
  }

  return {
    hasIcons: true,
    originalText: text,
    parts,
  }
}

/**
 * Convert text with embedded icon references (i-iconname) to HTML with SVG icons
 * This handles any combination of text and icons:
 * - "i-home" -> <svg>...</svg>
 * - "i-home Dashboard" -> <svg>...</svg> Dashboard
 * - "Click i-plus to add" -> Click <svg>...</svg> to add
 *
 * @param text - The text to process
 * @param options - Rendering options
 * @returns HTML string with icons replaced by SVG elements
 */
interface InlineRenderOptions {
  wrapInSpan?: boolean
  wrapperClass?: string
  wrapperStyle?: string
}

function renderIcons(text: string): string {
  const parsed = parseTextWithIcons(text)

  if (!parsed.hasIcons) {
    return text
  }

  return parsed.parts
    .map((part) => {
      if (part.type === 'icon') {
        return getLucideSvg(part.content)
      }
      return part.content
    })
    .join('')
}

function wrapInlineContent(html: string, options: InlineRenderOptions): string {
  if (!options.wrapInSpan) {
    return html
  }

  const classAttr = options.wrapperClass
    ? ` class="${options.wrapperClass}"`
    : ''
  const styleAttr = options.wrapperStyle
    ? ` style="${options.wrapperStyle}"`
    : ''

  return `<span${classAttr}${styleAttr}>${html}</span>`
}

function renderLinkAnchor(label: string, destination: string): string {
  const trimmedDestination = destination.trim()
  const linkClass = elementStyles.link
  const linkStyle = getLinkInlineStyles()
  const attributes = [
    linkClass ? `class="${linkClass}"` : '',
    linkStyle ? `style="${linkStyle}"` : '',
    NavigationMediator.generateHrefAttribute(trimmedDestination),
    NavigationMediator.generateNavigationAttributes(trimmedDestination),
  ]
    .filter(Boolean)
    .join(' ')

  return `<a ${attributes}>${label}</a>`
}

export function renderInlineContent(
  text: string,
  options: InlineRenderOptions = {}
): string {
  if (!text || typeof text !== 'string') {
    return text || ''
  }

  const linkPattern = /\[([^\]]+)\]\(([^)]+)\)/g
  let match: RegExpExecArray | null
  let lastIndex = 0
  let hasLinks = false
  const output: string[] = []

  while ((match = linkPattern.exec(text)) !== null) {
    hasLinks = true

    if (match.index > lastIndex) {
      const before = text.slice(lastIndex, match.index)
      if (before) {
        output.push(renderIcons(before))
      }
    }

    const label = match[1]
    const destination = match[2]
    output.push(renderLinkAnchor(label, destination))

    lastIndex = linkPattern.lastIndex
  }

  if (!hasLinks) {
    return wrapInlineContent(renderIcons(text), options)
  }

  if (lastIndex < text.length) {
    const trailing = text.slice(lastIndex)
    if (trailing) {
      output.push(renderIcons(trailing))
    }
  }

  const html = output.join('')
  return wrapInlineContent(html, options)
}
