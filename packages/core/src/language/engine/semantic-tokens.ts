import type {
  SemanticTokens,
  SemanticTokensLegend,
  SemanticTokensParams,
} from 'vscode-languageserver-protocol'
import { TextDocument } from 'vscode-languageserver-textdocument'

// Define semantic token types following LSP specification
export const SEMANTIC_TOKENS_LEGEND: SemanticTokensLegend = {
  tokenTypes: [
    'keyword', // 0: screen, modal, drawer, component, meta, head
    'class', // 1: layout types (container, stack, row, grid, card)
    'function', // 2: buttons (@primary, @ghost, etc)
    'variable', // 3: component instances ($Component)
    'property', // 4: component props (%prop)
    'string', // 5: text content, values
    'number', // 6: numeric values
    'operator', // 7: special operators (-, ---, :)
    'type', // 8: meta/head property names (version, title, color, font)
    'namespace', // 9: head sections (color:, font:, template:)
    'modifier', // 10: button/layout modifiers (primary, secondary, etc)
    'comment', // 11: future use
    'decorator', // 12: images (!rounded, !circle)
  ],
  tokenModifiers: [
    'declaration', // 0
    'definition', // 1
    'readonly', // 2
  ],
}

export function getSemanticTokens(
  params: SemanticTokensParams,
  document: TextDocument
): SemanticTokens | null {
  const text = document.getText()
  const lines = text.split(/\r?\n/)
  const data: number[] = []

  let prevLine = 0
  let prevChar = 0

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
    const line = lines[lineIndex]
    const tokens = tokenizeLine(line, lineIndex)

    for (const token of tokens) {
      // LSP semantic tokens format: [deltaLine, deltaStartChar, length, tokenType, tokenModifiers]
      const deltaLine = token.line - prevLine
      const deltaChar = deltaLine === 0 ? token.start - prevChar : token.start

      data.push(deltaLine, deltaChar, token.length, token.type, token.modifiers)

      prevLine = token.line
      prevChar = token.start
    }
  }

  return { data }
}

interface Token {
  line: number
  start: number
  length: number
  type: number
  modifiers: number
}

function tokenizeLine(line: string, lineIndex: number): Token[] {
  const tokens: Token[] = []

  // Meta/Head keywords
  const metaHeadMatch = line.match(/^(meta|head)(?=:)/)
  if (metaHeadMatch) {
    tokens.push({
      line: lineIndex,
      start: metaHeadMatch.index!,
      length: metaHeadMatch[0].length,
      type: 0, // keyword
      modifiers: 1, // definition
    })
  }

  // Meta/Head properties (version, title, color, font, template)
  const propertyMatch = line.match(/^\s+(version|title|color|font|template)(?=:)/)
  if (propertyMatch) {
    tokens.push({
      line: lineIndex,
      start: propertyMatch.index! + propertyMatch[0].indexOf(propertyMatch[1]),
      length: propertyMatch[1].length,
      type: 8, // type
      modifiers: 0,
    })
  }

  // Head color/font sub-properties (primary, secondary, neutral, accent, base, family)
  const subPropertyMatch = line.match(
    /^\s+(primary|secondary|neutral|accent|base|family|default)(?=:)/
  )
  if (subPropertyMatch) {
    tokens.push({
      line: lineIndex,
      start:
        subPropertyMatch.index! +
        subPropertyMatch[0].indexOf(subPropertyMatch[1]),
      length: subPropertyMatch[1].length,
      type: 9, // namespace
      modifiers: 0,
    })
  }

  // View keywords (screen, modal, drawer)
  const viewMatch = line.match(/^(screen|modal|drawer)\s+/)
  if (viewMatch) {
    tokens.push({
      line: lineIndex,
      start: viewMatch.index!,
      length: viewMatch[1].length,
      type: 0, // keyword
      modifiers: 1, // definition
    })
  }

  // Component keyword
  const componentMatch = line.match(/^(component)\s+/)
  if (componentMatch) {
    tokens.push({
      line: lineIndex,
      start: componentMatch.index!,
      length: componentMatch[1].length,
      type: 0, // keyword
      modifiers: 1, // definition
    })
  }

  // Layout keywords (container, stack, row, grid, card, header, sidebar, list, navigator, fab)
  const layoutMatch = line.match(
    /^(container(?:-narrow|-wide|-full)?|stack(?:-tight|-loose|-none)?|row(?:-start|-center|-between|-end)?|grid(?:-2|-3|-4|-responsive)?|layer(?:-static|-relative|-absolute|-fixed|-sticky|-overlay)?|scroll(?:-auto|-x|-y|-hidden)?|card(?:-compact|-feature)?|header|sidebar|list|navigator|fab)(?=:)/
  )
  if (layoutMatch) {
    tokens.push({
      line: lineIndex,
      start: layoutMatch.index!,
      length: layoutMatch[1].length,
      type: 1, // class
      modifiers: 0,
    })
  }

  // Button variants (@primary, @ghost, etc.)
  const buttonRegex =
    /@(primary|secondary|ghost|outline|destructive|success|warning)?/g
  let buttonMatch
  while ((buttonMatch = buttonRegex.exec(line)) !== null) {
    if (buttonMatch[0].length > 1) {
      // Has variant
      tokens.push({
        line: lineIndex,
        start: buttonMatch.index,
        length: buttonMatch[0].length,
        type: 2, // function
        modifiers: 0,
      })
    } else {
      // Just @
      tokens.push({
        line: lineIndex,
        start: buttonMatch.index,
        length: 1,
        type: 2, // function
        modifiers: 0,
      })
    }
  }

  // Component instances ($ComponentName)
  const instanceRegex = /\$[A-Z][A-Za-z0-9]*/g
  let instanceMatch
  while ((instanceMatch = instanceRegex.exec(line)) !== null) {
    tokens.push({
      line: lineIndex,
      start: instanceMatch.index,
      length: instanceMatch[0].length,
      type: 3, // variable
      modifiers: 0,
    })
  }

  // Component props (%propName)
  const propRegex = /%[a-z][a-zA-Z0-9-]*/g
  let propMatch
  while ((propMatch = propRegex.exec(line)) !== null) {
    tokens.push({
      line: lineIndex,
      start: propMatch.index,
      length: propMatch[0].length,
      type: 4, // property
      modifiers: 2, // readonly
    })
  }

  // Images (!rounded, !circle)
  const imageRegex = /!(rounded|circle(?:-\d+x\d+)?)?/g
  let imageMatch
  while ((imageMatch = imageRegex.exec(line)) !== null) {
    if (imageMatch[0].length > 1) {
      tokens.push({
        line: lineIndex,
        start: imageMatch.index,
        length: imageMatch[0].length,
        type: 12, // decorator
        modifiers: 0,
      })
    }
  }

  // Headings (# ## ### ####)
  const headingMatch = line.match(/^(#{1,4})\s/)
  if (headingMatch) {
    tokens.push({
      line: lineIndex,
      start: headingMatch.index!,
      length: headingMatch[1].length,
      type: 7, // operator
      modifiers: 0,
    })
  }

  // Paragraph/Small/Muted (>, >>, >>>)
  const paragraphMatch = line.match(/^(>{1,3})\s/)
  if (paragraphMatch) {
    tokens.push({
      line: lineIndex,
      start: paragraphMatch.index!,
      length: paragraphMatch[1].length,
      type: 7, // operator
      modifiers: 0,
    })
  }

  // Blockquote/Note (*>, **>)
  const quoteMatch = line.match(/^(\*{1,2}>)\s/)
  if (quoteMatch) {
    tokens.push({
      line: lineIndex,
      start: quoteMatch.index!,
      length: quoteMatch[1].length,
      type: 7, // operator
      modifiers: 0,
    })
  }

  // Input markers (___)
  const inputMatch = line.match(/___/)
  if (inputMatch) {
    tokens.push({
      line: lineIndex,
      start: inputMatch.index!,
      length: 3,
      type: 7, // operator
      modifiers: 0,
    })
  }

  // Separator (---)
  const separatorMatch = line.match(/^---$/)
  if (separatorMatch) {
    tokens.push({
      line: lineIndex,
      start: separatorMatch.index!,
      length: 3,
      type: 7, // operator
      modifiers: 0,
    })
  }

  // List items (-)
  const listMatch = line.match(/^\s*-\s/)
  if (listMatch) {
    const dashIndex = listMatch[0].indexOf('-')
    tokens.push({
      line: lineIndex,
      start: listMatch.index! + dashIndex,
      length: 1,
      type: 7, // operator
      modifiers: 0,
    })
  }

  // Hex colors (#ffffff)
  const colorRegex = /#[0-9A-Fa-f]{3,8}\b/g
  let colorMatch
  while ((colorMatch = colorRegex.exec(line)) !== null) {
    tokens.push({
      line: lineIndex,
      start: colorMatch.index,
      length: colorMatch[0].length,
      type: 6, // number
      modifiers: 0,
    })
  }

  // Numbers
  const numberRegex = /\b\d+\b/g
  let numberMatch
  while ((numberMatch = numberRegex.exec(line)) !== null) {
    tokens.push({
      line: lineIndex,
      start: numberMatch.index,
      length: numberMatch[0].length,
      type: 6, // number
      modifiers: 0,
    })
  }

  return tokens
}
