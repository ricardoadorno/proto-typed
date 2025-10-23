/**
 * Input element builders for AST construction
 * Handles inputs, selects, radio buttons, and checkboxes
 */

import { validateInputType, validateRequiredProps } from './builder-validation'
import type { IToken } from 'chevrotain'
import type { CstContext, CstVisitor } from '../types'

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

  // Pattern: ___<type>: Label{placeholder}[options] | attributes
  const match = inputText.match(
    /___(?:(email|password|date|number|textarea))?:\s*([^{[|\n\r]+)(?:\{([^}]+)\})?(?:\[([^\]]+)\])?(?:\s*\|\s*(.+))?/
  )

  if (!match) {
    return null
  }

  const [
    ,
    typeMatch,
    labelMatch,
    placeholderMatch,
    optionsMatch,
    attributesMatch,
  ] = match

  let kind = typeMatch || 'text' // Default to text if no type specified
  const label = labelMatch ? labelMatch.trim() : ''
  const attributes: Record<string, string | string[]> = {}
  const flags: Record<string, boolean> = {}

  // Validate input type
  kind = validateInputType(visitor, kind, line, column)

  // Add placeholder if present
  if (placeholderMatch) {
    attributes.placeholder = placeholderMatch.trim()
  }

  // Check if it's a select (has options)
  let isSelect = false
  if (optionsMatch) {
    isSelect = true
    attributes.options = optionsMatch
      .split('|')
      .map((opt: string) => opt.trim())
  }

  // Parse pipe-separated attributes
  if (attributesMatch) {
    const attrParts = attributesMatch.split('|').map((s: string) => s.trim())

    attrParts.forEach((part: string) => {
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
  validateRequiredProps(visitor, { label }, ['label'], 'Input', line, column)

  return {
    type: isSelect ? 'Select' : 'Input',
    id: '', // ID will be generated later
    props: {
      kind: isSelect ? 'select' : kind,
      label,
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
