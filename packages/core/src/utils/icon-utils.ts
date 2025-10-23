/**
 * Utility functions for handling Lucide icons
 */
import { icons } from 'lucide'

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

  // Lucide icons are arrays of path/element data
  // Each element has a tag name and attributes
  try {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.setAttribute('width', '16')
    svg.setAttribute('height', '16')
    svg.setAttribute('viewBox', '0 0 24 24')
    svg.setAttribute('fill', 'none')
    svg.setAttribute('stroke', 'currentColor')
    svg.setAttribute('stroke-width', '2')
    svg.setAttribute('stroke-linecap', 'round')
    svg.setAttribute('stroke-linejoin', 'round')
    svg.setAttribute('style', 'margin-left: 0.5rem; margin-right: 0.5rem;')
    svg.classList.add('inline-block')

    // Add the icon paths - Lucide icons are arrays of [tagName, attributes]
    icon.forEach((element: unknown) => {
      if (Array.isArray(element) && element.length >= 2) {
        const [tagName, attributes] = element
        if (tagName && typeof tagName === 'string') {
          const svgElement = document.createElementNS(
            'http://www.w3.org/2000/svg',
            tagName
          )
          if (attributes && typeof attributes === 'object') {
            Object.entries(attributes).forEach(([key, value]) => {
              svgElement.setAttribute(key, String(value))
            })
          }
          svg.appendChild(svgElement)
        }
      }
    })

    return svg.outerHTML
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
export function renderTextWithIcons(
  text: string,
  options: {
    /** Wrap the output in a span element (default: false) */
    wrapInSpan?: boolean
    /** Additional CSS classes for the wrapper span */
    wrapperClass?: string
    /** Additional inline styles for the wrapper span */
    wrapperStyle?: string
  } = {}
): string {
  const parsed = parseTextWithIcons(text)

  // If no icons, return the original text
  if (!parsed.hasIcons) {
    if (options.wrapInSpan) {
      const classAttr = options.wrapperClass
        ? ` class="${options.wrapperClass}"`
        : ''
      const styleAttr = options.wrapperStyle
        ? ` style="${options.wrapperStyle}"`
        : ''
      return `<span${classAttr}${styleAttr}>${text}</span>`
    }
    return text
  }

  // Build HTML from parts
  const html = parsed.parts
    .map((part) => {
      if (part.type === 'icon') {
        return getLucideSvg(part.content)
      }
      return part.content
    })
    .join('')

  // Wrap in span if requested
  if (options.wrapInSpan) {
    const classAttr = options.wrapperClass
      ? ` class="${options.wrapperClass}"`
      : ''
    const styleAttr = options.wrapperStyle
      ? ` style="${options.wrapperStyle}"`
      : ''
    return `<span${classAttr}${styleAttr}>${html}</span>`
  }

  return html
}
