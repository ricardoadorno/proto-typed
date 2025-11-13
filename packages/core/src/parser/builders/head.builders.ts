/**
 * Head configuration builders for AST construction
 * Handles head configurations (colors, fonts, templates)
 */

import { type CstNode, type IToken } from 'chevrotain'
import { AstNode } from '../../types/ast-node.js'
import type { CstContext } from '../../types/parser.js'

/**
 * @function buildHead
 * @description Builds a 'Head' AST node from the corresponding CST node.
 * This function processes head configuration sections (color, font, template).
 *
 * @param {Context} ctx - The Chevrotain CST node context for the head block.
 * @returns {AstNode} A 'Head' AST node.
 */
export function buildHead(ctx: CstContext): AstNode {
  const headSections: AstNode[] = []

  // Process color section
  if (ctx.headColorSection) {
    for (const section of ctx.headColorSection) {
      const colorNode = buildHeadColorSection(section as CstNode)
      if (colorNode) {
        headSections.push(colorNode)
      }
    }
  }

  // Process font section
  if (ctx.headFontSection) {
    for (const section of ctx.headFontSection) {
      const fontNode = buildHeadFontSection(section as CstNode)
      if (fontNode) {
        headSections.push(fontNode)
      }
    }
  }

  // Process template section
  if (ctx.headTemplateSection) {
    for (const section of ctx.headTemplateSection) {
      const templateNode = buildHeadTemplateSection(section as CstNode)
      if (templateNode) {
        headSections.push(templateNode)
      }
    }
  }

  return {
    type: 'Head',
    id: '',
    props: {},
    children: headSections,
  }
}

/**
 * @function buildHeadColorSection
 * @description Builds a 'HeadColor' AST node from CST
 */
function buildHeadColorSection(cstNode: CstNode): AstNode | null {
  if (!cstNode || !cstNode.children) {
    return null
  }

  const colorProperties: AstNode[] = []

  if (cstNode.children.colorProperty) {
    for (const prop of cstNode.children.colorProperty) {
      const colorProp = buildColorProperty(prop as CstNode)
      if (colorProp) {
        colorProperties.push(colorProp)
      }
    }
  }

  return {
    type: 'HeadColor',
    id: '',
    props: {},
    children: colorProperties,
  }
}

/**
 * @function buildColorProperty
 * @description Builds a color property AST node (primary, secondary, neutral, accent)
 */
function buildColorProperty(cstNode: CstNode): AstNode | null {
  if (!cstNode || !cstNode.children) {
    return null
  }

  const children = cstNode.children
  let propertyName = ''
  let propertyValue = ''

  // Determine which color property it is
  if (children.ColorPrimary) {
    propertyName = 'primary'
  } else if (children.ColorSecondary) {
    propertyName = 'secondary'
  } else if (children.ColorNeutral) {
    propertyName = 'neutral'
  } else if (children.ColorAccent) {
    propertyName = 'accent'
  }

  // Get the value - check both Identifier (for hex like #0047AB) and PropertyValue
  if (children.Identifier) {
    const valueToken = children.Identifier[0] as IToken
    propertyValue = valueToken.image
  } else if (children.PropertyValue) {
    const valueToken = children.PropertyValue[0] as IToken
    propertyValue = valueToken.image
  }

  return {
    type: 'ColorProperty',
    id: '',
    props: {
      name: propertyName,
      value: propertyValue,
    },
    children: [],
  }
}

/**
 * @function buildHeadFontSection
 * @description Builds a 'HeadFont' AST node from CST
 */
function buildHeadFontSection(cstNode: CstNode): AstNode | null {
  if (!cstNode || !cstNode.children) {
    return null
  }

  const fontSections: AstNode[] = []

  if (cstNode.children.fontBaseSection) {
    for (const section of cstNode.children.fontBaseSection) {
      const baseNode = buildFontBaseSection(section as CstNode)
      if (baseNode) {
        fontSections.push(baseNode)
      }
    }
  }

  return {
    type: 'HeadFont',
    id: '',
    props: {},
    children: fontSections,
  }
}

/**
 * @function buildFontBaseSection
 * @description Builds a 'FontBase' AST node from CST
 */
function buildFontBaseSection(cstNode: CstNode): AstNode | null {
  if (!cstNode || !cstNode.children) {
    return null
  }

  const fontProperties: AstNode[] = []

  if (cstNode.children.fontProperty) {
    for (const prop of cstNode.children.fontProperty) {
      const fontProp = buildFontProperty(prop as CstNode)
      if (fontProp) {
        fontProperties.push(fontProp)
      }
    }
  }

  return {
    type: 'FontBase',
    id: '',
    props: {},
    children: fontProperties,
  }
}

/**
 * @function buildFontProperty
 * @description Builds a font property AST node (family)
 */
function buildFontProperty(cstNode: CstNode): AstNode | null {
  if (!cstNode || !cstNode.children) {
    return null
  }

  const children = cstNode.children
  let propertyName = ''
  let propertyValue = ''

  // Determine which font property it is
  if (children.FontFamily) {
    propertyName = 'family'
  }

  // Get the value - check both Identifier and PropertyValue
  if (children.Identifier) {
    const valueToken = children.Identifier[0] as IToken
    propertyValue = valueToken.image
  } else if (children.PropertyValue) {
    const valueToken = children.PropertyValue[0] as IToken
    propertyValue = valueToken.image // No need to remove quotes
  }

  return {
    type: 'FontProperty',
    id: '',
    props: {
      name: propertyName,
      value: propertyValue,
    },
    children: [],
  }
}

/**
 * @function buildHeadTemplateSection
 * @description Builds a 'HeadTemplate' AST node from CST
 */
function buildHeadTemplateSection(cstNode: CstNode): AstNode | null {
  if (!cstNode || !cstNode.children) {
    return null
  }

  const templateProperties: AstNode[] = []

  if (cstNode.children.templateProperty) {
    for (const prop of cstNode.children.templateProperty) {
      const templateProp = buildTemplateProperty(prop as CstNode)
      if (templateProp) {
        templateProperties.push(templateProp)
      }
    }
  }

  return {
    type: 'HeadTemplate',
    id: '',
    props: {},
    children: templateProperties,
  }
}

/**
 * @function buildTemplateProperty
 * @description Builds a template property AST node (default)
 */
function buildTemplateProperty(cstNode: CstNode): AstNode | null {
  if (!cstNode || !cstNode.children) {
    return null
  }

  const children = cstNode.children
  let propertyName = ''
  let propertyValue = ''

  // Determine which template property it is
  if (children.TemplateDefault) {
    propertyName = 'default'
  }

  // Get the value (component reference like $GlobalDeck or PropertyValue)
  if (children.ComponentInstance) {
    const valueToken = children.ComponentInstance[0] as IToken
    propertyValue = valueToken.image
  } else if (children.PropertyValue) {
    const valueToken = children.PropertyValue[0] as IToken
    propertyValue = valueToken.image
  }

  return {
    type: 'TemplateProperty',
    id: '',
    props: {
      name: propertyName,
      value: propertyValue,
    },
    children: [],
  }
}
