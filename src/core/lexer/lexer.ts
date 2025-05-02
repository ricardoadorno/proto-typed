import { createToken, createTokenInstance, Lexer } from "chevrotain";
import { allTokens } from "./tokens";
import { IToken, CustomPatternMatcherReturn } from 'chevrotain';
import _ from 'lodash';

// State required for matching the indentations
let indentStack = [0];

/**
 * This custom Token matcher uses Lexer context ("matchedTokens" and "groups" arguments)
 * combined with state via closure ("indentStack" and "lastTextMatched") to match indentation.
 *
 * @param {string} text - the full text to lex, sent by the Chevrotain lexer.
 * @param {number} offset - the offset to start matching in the text.
 * @param {IToken[]} matchedTokens - Tokens lexed so far, sent by the Chevrotain Lexer.
 * @param {CustomPatternMatcherFunc} groups - Token groups already lexed, sent by the Chevrotain Lexer.
 * @param {string} type - determines if this function matches Indent or Outdent tokens.
 * @returns {CustomPatternMatcherReturn | RegExpExecArray | null}
 */
function matchIndentBase(text: string, offset: number, matchedTokens: IToken[], groups: { nl?: IToken[] }, type: string): CustomPatternMatcherReturn | RegExpExecArray | null {
    const noTokensMatchedYet = _.isEmpty(matchedTokens);
    const newLines = groups.nl || [];
    const noNewLinesMatchedYet = _.isEmpty(newLines);
    const isFirstLine = noTokensMatchedYet && noNewLinesMatchedYet;
    const isStartOfLine =
      // only newlines matched so far
      (noTokensMatchedYet && !noNewLinesMatchedYet) ||
      // Both newlines and other Tokens have been matched AND the offset is just after the last newline
      (!noTokensMatchedYet &&
        !noNewLinesMatchedYet &&
        newLines.length > 0 &&
        offset === _.last(newLines)!.startOffset + 1);
  
    // indentation can only be matched at the start of a line.
    if (isFirstLine || isStartOfLine) {
      let match;
      let currIndentLevel = 0; // Initialize with default value
  
      const wsRegExp = / +/y;
      wsRegExp.lastIndex = offset;
      match = wsRegExp.exec(text);
      // possible non-empty indentation
      if (match !== null) {
        currIndentLevel = match[0].length;
      }
      // "empty" indentation means indentLevel of 0 (already initialized)
  
      const prevIndentLevel = _.last(indentStack) || 0; // Provide default value if undefined
      // deeper indentation
      if (currIndentLevel > prevIndentLevel && type === "indent") {
        indentStack.push(currIndentLevel);
        return match;
      }
      // shallower indentation
      else if (currIndentLevel < prevIndentLevel && type === "outdent") {
        const matchIndentIndex = _.findLastIndex(
          indentStack,
          (stackIndentDepth) => stackIndentDepth === currIndentLevel,
        );
  
        // any outdent must match some previous indentation level.
        if (matchIndentIndex === -1) {
          throw Error(`invalid outdent at offset: ${offset}`);
        }
  
        const numberOfDedents = indentStack.length - matchIndentIndex - 1;
  
        // This is a little tricky
        // 1. If there is no match (0 level indent) than this custom token
        //    matcher would return "null" and so we need to add all the required outdents ourselves.
        // 2. If there was match (> 0 level indent) than we need to add minus one number of outsents
        //    because the lexer would create one due to returning a none null result.
        let iStart = match !== null ? 1 : 0;
        for (let i = iStart; i < numberOfDedents; i++) {
          indentStack.pop();
          matchedTokens.push(
            createTokenInstance(Outdent, "", NaN, NaN, NaN, NaN, NaN, NaN),
          );
        }
  
        // even though we are adding fewer outdents directly we still need to update the indent stack fully.
        if (iStart === 1) {
          indentStack.pop();
        }
        return match;
      } else {
        // same indent, this should be lexed as simple whitespace and ignored
        return null;
      }
    } else {
      // indentation cannot be matched under other circumstances
      return null;
    }
}

export const matchIndent = _.partialRight(matchIndentBase, "indent");
export const matchOutdent = _.partialRight(matchIndentBase, "outdent");

// define the indentation tokens using custom token patterns
export const Indent = createToken({
  name: "Indent",
  pattern: matchIndent,
  line_breaks: false,
});

export const Outdent = createToken({
  name: "Outdent",
  pattern: matchOutdent,
  line_breaks: false,
});


// Create and export the lexer instance
export const lexer = new Lexer([...allTokens, Indent,Outdent]);

/**
 * Tokenize the input text
 * @param text The input text to tokenize
 * @returns The tokenization result containing tokens and any errors
 */
export function tokenize(text: string) {
    // have to reset the indent stack between processing of different text inputs
    indentStack = [0];

    const lexResult = lexer.tokenize(text);
  
    //add remaining Outdents
    while (indentStack.length > 1) {
      lexResult.tokens.push(
        createTokenInstance(Outdent, "", NaN, NaN, NaN, NaN, NaN, NaN),
      );
      indentStack.pop();
    }
  
    if (lexResult.errors.length > 0) {
      throw new Error("Lexer errors detected: " + lexResult.errors.join(", "));
    }
    return lexResult;
}