/**
 * Input element builders for AST construction
 * Handles inputs, selects, radio buttons, and checkboxes
 */

import { validateInputType, validateRequiredProps } from './builder-validation'
import type { IToken } from 'chevrotain'
import type { CstContext, CstVisitor } from '../../types/parser'

interface DeclarationSplit {
  declaration: string
  attributes?: string
}

interface BracketBlockResult {
  content: string
  rest: string
}

function splitDeclarationAndAttributes(input: string): DeclarationSplit {
  let depth = 0
  for (let i = 0; i < input.length; i += 1) {
    const char = input[i]

    if (char === '[') {
      depth += 1
    } else if (char === ']') {
      depth = Math.max(0, depth - 1)
    } else if (char === '|' && depth === 0) {
      return {
        declaration: input.slice(0, i).trimEnd(),
        attributes: input.slice(i + 1).trim(),
      }
    }
  }

  return { declaration: input.trim(), attributes: undefined }
}

function consumeBracketBlock(source: string): BracketBlockResult | null {
  let index = 0
  while (index < source.length && /\s/.test(source[index])) {
    index += 1
  }

  if (source[index] !== '[') {
    return null
  }

  let depth = 0
  let startContent = -1

  for (let i = index; i < source.length; i += 1) {
    const char = source[i]

    if (char === '[') {
      depth += 1
      if (depth === 1) {
        startContent = i + 1
      }
    } else if (char === ']') {
      depth -= 1
      if (depth < 0) {
        return null
      }

      if (depth === 0 && startContent !== -1) {
        return {
          content: source.slice(startContent, i),
          rest: source.slice(i + 1),
        }
      }
    }
  }

  return null
}

function parsePlaceholderContent(content: string): {
  placeholder: string
  options?: string
} {
  const match = content.match(/^([^\[]*)(?:\[(.*)\])?$/)

  if (!match) {
    return { placeholder: content.trim() }
  }

  const [, placeholderRaw, optionsRaw] = match

  return {
    placeholder: (placeholderRaw || '').trim(),
    options: optionsRaw ? optionsRaw.trim() : undefined,
  }
}

/**
 * @function buildInputElement
 * @description Builds an 'Input' or 'Select' AST node from the corresponding CST node.
 * It parses the input token to extract the type, label, placeholder, options, and other attributes.
 *
 * @param {CstContext} ctx - The Chevrotain CST node CstContext for the input element.
 * @param {any} visitor - The CST visitor instance.
 * @returns {object | null} An 'Input' or 'Select' AST node, or null if the token is invalid.
 */
export function buildInputElement(ctx: CstContext, visitor: CstVisitor) {
  if (!ctx.Input || !ctx.Input[0]) {
    return null
  }

  const inputToken = ctx.Input[0]
  const inputText = (inputToken as IToken).image
  const line = (inputToken as IToken).startLine
  const column = (inputToken as IToken).startColumn

  const { declaration, attributes: attributesPart } =
    splitDeclarationAndAttributes(inputText)

  if (!declaration.startsWith('___')) {
    return null
  }

  let remaining = declaration.slice(3).trimStart()

  const typeCandidateMatch = remaining.match(/^[a-zA-Z-]+/)
  const typeCandidate = typeCandidateMatch ? typeCandidateMatch[0] : undefined

  if (typeCandidate) {
    remaining = remaining.slice(typeCandidate.length).trimStart()
  }

  const labelBlock = consumeBracketBlock(remaining)
  if (!labelBlock) {
    return null
  }

  const labelValue = labelBlock.content.trim()
  remaining = labelBlock.rest

  let placeholderMatch: string | undefined
  let optionsMatch: string | undefined

  const placeholderBlock = consumeBracketBlock(remaining)
  if (placeholderBlock) {
    const placeholderParsed = parsePlaceholderContent(placeholderBlock.content)
    placeholderMatch = placeholderParsed.placeholder
    optionsMatch = placeholderParsed.options
    remaining = placeholderBlock.rest
  }

  if (!optionsMatch) {
    const optionsBlock = consumeBracketBlock(remaining)
    if (optionsBlock) {
      optionsMatch = optionsBlock.content.trim()
      remaining = optionsBlock.rest
    }
  }

  if (remaining.trim().length > 0) {
    // Unrecognized trailing content - treat as invalid
    return null
  }

  let kind = typeCandidate || 'text'

  // Validate input type
  kind = validateInputType(visitor, kind, line, column)

  const attributes: Record<string, string | string[]> = {}
  const flags: Record<string, boolean> = {}

  if (placeholderMatch && placeholderMatch.trim() !== '') {
    attributes.placeholder = placeholderMatch.trim()
  }

  // Check if it's a select (has options)
  let isSelect = false
  if (optionsMatch) {
    const optionValues = optionsMatch
      .split('|')
      .map((opt: string) => opt.trim())
      .filter((opt: string) => opt.length > 0)

    if (optionValues.length > 0) {
      isSelect = true
      attributes.options = optionValues
    }
  }

  // Parse pipe-separated attributes
  if (attributesPart) {
    const attrParts = attributesPart.split('|').map((s: string) => s.trim())

    attrParts.forEach((part: string) => {
      if (!part) {
        return
      }
      // Check if it's a flag (no colon)
      if (
        /^(required|disabled|readonly|clearable|multiple|reveal-toggle)$/.test(
          part
        )
      ) {
        if (part === 'required') flags.required = true
        else if (part === 'disabled') flags.disabled = true
        else if (part === 'readonly') flags.readonly = true
        else if (part === 'clearable') flags.clearable = true
        else if (part === 'multiple') flags.multiple = true
        else if (part === 'reveal-toggle') flags.revealToggle = true
      } else {
        // It's a key: value attribute
        const attrMatch = part.match(/([a-z]+):\s*(.+)/)
        if (attrMatch) {
          const [, key, value] = attrMatch
          attributes[key.trim()] = value.trim()
        }
      }
    })
  }

  // Validate required props
  validateRequiredProps(
    visitor,
    { label: labelValue },
    ['label'],
    'Input',
    line,
    column
  )

  return {
    type: isSelect ? 'Select' : 'Input',
    id: '', // ID will be generated later
    props: {
      kind: isSelect ? 'select' : kind,
      label: labelValue,
      attributes,
      flags,
    },
    children: [],
  }
}

/**
 * @function buildRadioButtonGroup
 * @description Builds a 'RadioOption' AST node from the corresponding CST node.
 * It parses a group of radio button options and their selected states.
 *
 * @param {CstContext} ctx - The Chevrotain CST node CstContext for the radio button group.
 * @returns {object} A 'RadioOption' AST node.
 */
export interface RadioOption {
  label: string
  selected: boolean
  value: string
}

export function buildRadioButtonGroup(ctx: CstContext) {
  const options: RadioOption[] = []

  if (ctx.RadioOption) {
    ctx.RadioOption.forEach((option) => {
      const optionText = (option as IToken).image
      // Match pattern: (x) Label or ( ) Label
      const match = optionText.match(/\(([xX ]?)\)\s+([^\n\r]+)/)

      if (match) {
        const isSelected = match[1].toLowerCase() === 'x'
        const label = match[2]

        options.push({
          label,
          selected: isSelected,
          value: label.toLowerCase().replace(/\s+/g, '_'),
        })
      }
    })
  }

  return {
    type: 'RadioOption',
    id: '', // ID will be generated later
    props: {
      options,
    },
    children: [],
  }
}

/**
 * @function buildCheckboxElement
 * @description Builds a 'Checkbox' AST node from the corresponding CST node.
 * It parses the checkbox token to determine its checked state and label.
 *
 * @param {CstContext} ctx - The Chevrotain CST node CstContext for the checkbox element.
 * @returns {object} A 'Checkbox' AST node.
 */
export function buildCheckboxElement(ctx: CstContext) {
  const checkboxToken = ctx.Checkbox[0]
  const checkboxText = (checkboxToken as IToken).image

  // Match pattern: [x] Label or [ ] Label
  const match = checkboxText.match(/\[([ xX]?)\](?:\s+([^\n\r]+))?/)

  if (match) {
    const isChecked = match[1] && match[1].toLowerCase() === 'x'
    const label = match[2] || ''

    return {
      type: 'Checkbox',
      id: '', // ID will be generated later
      props: {
        checked: isChecked,
        label: label.trim(),
        value: label.toLowerCase().replace(/\s+/g, '_'),
      },
      children: [],
    }
  }

  return {
    type: 'Checkbox',
    id: '', // ID will be generated later
    props: {
      checked: false,
      label: '',
      value: '',
    },
    children: [],
  }
}
