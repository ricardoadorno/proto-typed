import { createToken, createTokenInstance, Lexer } from 'chevrotain'
import { allTokens } from './tokens/index'
import { IToken, CustomPatternMatcherReturn } from 'chevrotain'

// State required for matching the indentations
let indentStack = [0]

/**
 * @function matchIndentBase
 * @description This custom token matcher is the core logic for handling indentation in the DSL.
 * It uses the lexer's context (matchedTokens and groups) and a closure-managed state (indentStack)
 * to recognize 'Indent' and 'Outdent' tokens based on changes in whitespace at the beginning of a line.
 * This is crucial for parsing the indentation-sensitive syntax of the DSL.
 *
 * @param {string} text - The full text to be lexed, provided by the Chevrotain lexer.
 * @param {number} offset - The current offset in the text where matching should start.
 * @param {IToken[]} matchedTokens - An array of tokens that have been lexed so far.
 * @param {object} groups - An object containing token groups that have already been lexed.
 * @param {string} type - A string that specifies whether this function should match 'indent' or 'outdent' tokens.
 * @returns {CustomPatternMatcherReturn | RegExpExecArray | null} A match object if an indent or outdent is found, otherwise null.
 */
function matchIndentBase(
  text: string,
  offset: number,
  matchedTokens: IToken[],
  groups: { nl?: IToken[] },
  type: string
): CustomPatternMatcherReturn | RegExpExecArray | null {
  const noTokensMatchedYet = matchedTokens.length === 0
  const newLines = groups.nl || []
  const noNewLinesMatchedYet = newLines.length === 0
  const isFirstLine = noTokensMatchedYet && noNewLinesMatchedYet
  const isStartOfLine =
    (noTokensMatchedYet && !noNewLinesMatchedYet) ||
    (!noTokensMatchedYet &&
      !noNewLinesMatchedYet &&
      newLines.length > 0 &&
      offset === newLines[newLines.length - 1]!.startOffset + 1)

  if (isFirstLine || isStartOfLine) {
    let currIndentLevel = 0
    const wsRegExp = / +/y
    wsRegExp.lastIndex = offset
    const match = wsRegExp.exec(text)

    if (match !== null) {
      currIndentLevel = match[0].length
    }

    const prevIndentLevel = indentStack[indentStack.length - 1] || 0
    const nextChar = text[currIndentLevel + offset]
    if (!nextChar || nextChar === '\n' || nextChar === '\r') {
      // linha vazia ou só com espaços, ignore
      return null
    }
    if (currIndentLevel > prevIndentLevel && type === 'indent') {
      indentStack.push(currIndentLevel)
      return match
    } else if (currIndentLevel < prevIndentLevel && type === 'outdent') {
      const matchIndentIndex = [...indentStack]
        .reverse()
        .findIndex((stackIndentDepth) => stackIndentDepth === currIndentLevel)
      const finalMatchIndex =
        matchIndentIndex === -1 ? -1 : indentStack.length - 1 - matchIndentIndex

      if (finalMatchIndex === -1) {
        throw Error(`invalid outdent at offset: ${offset}`)
      }

      const numberOfDedents = indentStack.length - finalMatchIndex - 1
      const iStart = match !== null ? 1 : 0
      for (let i = iStart; i < numberOfDedents; i++) {
        indentStack.pop()
        matchedTokens.push(
          createTokenInstance(Outdent, '', NaN, NaN, NaN, NaN, NaN, NaN)
        )
      }

      if (iStart === 1) {
        indentStack.pop()
      }
      return match
    } else {
      return null
    }
  } else {
    return null
  }
}

/**
 * @function matchIndent
 * @description A wrapper for `matchIndentBase` specifically for matching 'Indent' tokens.
 * @param {string} text - The full text to be lexed.
 * @param {number} offset - The current offset in the text.
 * @param {IToken[]} matchedTokens - An array of tokens that have been lexed so far.
 * @param {object} groups - An object containing token groups that have already been lexed.
 * @returns {CustomPatternMatcherReturn | RegExpExecArray | null} A match object if an indent is found, otherwise null.
 */
export const matchIndent = (
  text: string,
  offset: number,
  matchedTokens: IToken[],
  groups: { nl?: IToken[] }
) => matchIndentBase(text, offset, matchedTokens, groups, 'indent')

/**
 * @function matchOutdent
 * @description A wrapper for `matchIndentBase` specifically for matching 'Outdent' tokens.
 * @param {string} text - The full text to be lexed.
 * @param {number} offset - The current offset in the text.
 * @param {IToken[]} matchedTokens - An array of tokens that have been lexed so far.
 * @param {object} groups - An object containing token groups that have already been lexed.
 * @returns {CustomPatternMatcherReturn | RegExpExecArray | null} A match object if an outdent is found, otherwise null.
 */
export const matchOutdent = (
  text: string,
  offset: number,
  matchedTokens: IToken[],
  groups: { nl?: IToken[] }
) => matchIndentBase(text, offset, matchedTokens, groups, 'outdent')

/**
 * @const Indent
 * @description A Chevrotain token created for representing an increase in indentation level.
 * It uses the custom `matchIndent` pattern to be recognized.
 */
export const Indent = createToken({
  name: 'Indent',
  line_breaks: false,
  pattern: matchIndent,
  label: 'indentation (spaces)',
})

/**
 * @const Outdent
 * @description A Chevrotain token created for representing a decrease in indentation level.
 * It uses the custom `matchOutdent` pattern to be recognized.
 */
export const Outdent = createToken({
  name: 'Outdent',
  line_breaks: false,
  pattern: matchOutdent,
  label: 'outdentation (dedent)',
})

/**
 * @const lexer
 * @description The main lexer instance for the UI DSL. It is configured with all the defined tokens,
 * including the custom 'Indent' and 'Outdent' tokens.
 */
export const lexer = new Lexer([Indent, Outdent, ...allTokens])

/**
 * @function tokenize
 * @description This function takes the input DSL text and uses the lexer to break it down into a sequence of tokens.
 * It also handles the state of the indentation stack, resetting it for each new input and ensuring any
 * remaining 'Outdent' tokens are added at the end of the file.
 *
 * @param {string} text - The input DSL text to be tokenized.
 * @returns {object} The result of the tokenization process, which includes the array of tokens and any errors that occurred.
 */
export function tokenize(text: string) {
  // have to reset the indent stack between processing of different text inputs
  indentStack = [0]

  const lexResult = lexer.tokenize(text)

  //add remaining Outdents
  while (indentStack.length > 1) {
    lexResult.tokens.push(
      createTokenInstance(Outdent, '', NaN, NaN, NaN, NaN, NaN, NaN)
    )
    indentStack.pop()
  }

  // Don't throw - return errors for graceful handling by parser
  // This allows error recovery and prevents crashes
  // if (lexResult.errors.length > 0) {
  //   throw new Error("Lexer errors detected: " +
  //     JSON.stringify(lexResult.errors, null, 2));
  // }

  return lexResult
}
