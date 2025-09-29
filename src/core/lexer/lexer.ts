import { createToken, createTokenInstance, Lexer } from "chevrotain";
import { allTokens } from "./tokens/index";
import { IToken, CustomPatternMatcherReturn } from 'chevrotain';

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
  const noTokensMatchedYet = matchedTokens.length === 0;
  const newLines = groups.nl || [];
  const noNewLinesMatchedYet = newLines.length === 0;
  const isFirstLine = noTokensMatchedYet && noNewLinesMatchedYet;
  const isStartOfLine =
    (noTokensMatchedYet && !noNewLinesMatchedYet) ||
    (!noTokensMatchedYet && !noNewLinesMatchedYet && newLines.length > 0 && offset === newLines[newLines.length - 1]!.startOffset + 1);

  if (isFirstLine || isStartOfLine) {
      let match;
      let currIndentLevel = 0;
      const wsRegExp = / +/y;
      wsRegExp.lastIndex = offset;
      match = wsRegExp.exec(text);

      if (match !== null) {
          currIndentLevel = match[0].length;
      }

      const prevIndentLevel = indentStack[indentStack.length - 1] || 0;
      if (currIndentLevel > prevIndentLevel && type === "indent") {
          indentStack.push(currIndentLevel);
          return match;
      } else if (currIndentLevel < prevIndentLevel && type === "outdent") {          const matchIndentIndex = [...indentStack].reverse().findIndex(
              (stackIndentDepth) => stackIndentDepth === currIndentLevel,
          );
          const finalMatchIndex = matchIndentIndex === -1 ? -1 : indentStack.length - 1 - matchIndentIndex;

          if (finalMatchIndex === -1) {
              throw Error(`invalid outdent at offset: ${offset}`);
          }

          const numberOfDedents = indentStack.length - finalMatchIndex - 1;
          let iStart = match !== null ? 1 : 0;
          for (let i = iStart; i < numberOfDedents; i++) {
              indentStack.pop();
              matchedTokens.push(createTokenInstance(Outdent, "", NaN, NaN, NaN, NaN, NaN, NaN));
          }

          if (iStart === 1) {
              indentStack.pop();
          }
          return match;
      } else {
          return null;
      }
  } else {
      return null;
  }
}


export const matchIndent = (text: string, offset: number, matchedTokens: IToken[], groups: { nl?: IToken[] }) => 
  matchIndentBase(text, offset, matchedTokens, groups, "indent");
export const matchOutdent = (text: string, offset: number, matchedTokens: IToken[], groups: { nl?: IToken[] }) => 
  matchIndentBase(text, offset, matchedTokens, groups, "outdent");

// define the indentation tokens using custom token patterns
export const Indent = createToken({
  name: "Indent",
  line_breaks: false,
  pattern: matchIndent,
});

export const Outdent = createToken({
  name: "Outdent",
  line_breaks: false,
  pattern: matchOutdent,
});


// Create and export the lexer instance
export const lexer = new Lexer([Indent,Outdent,...allTokens]);

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
      throw new Error("Lexer errors detected: " + 
        JSON.stringify(lexResult.errors, null, 2));
    }

    return lexResult;
}