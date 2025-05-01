import { Lexer } from "chevrotain";
import { allTokens } from "./tokens";

// Create and export the lexer instance
export const lexer = new Lexer(allTokens);

/**
 * Tokenize the input text
 * @param text The input text to tokenize
 * @returns The tokenization result containing tokens and any errors
 */
export function tokenize(text: string) {
  return lexer.tokenize(text);
}