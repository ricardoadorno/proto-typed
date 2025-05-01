import { CstNode } from "chevrotain";
import { tokenize } from "../lexer/lexer";
import { parser } from "./parser";

/**
 * Parse input text into a Concrete Syntax Tree (CST)
 * 
 * @param text The DSL text to parse
 * @returns The Concrete Syntax Tree representing the parsed input
 * @throws Error if parsing fails
 */
export function parseInput(text: string): CstNode {
  // First tokenize the text using the lexer
  const lexResult = tokenize(text);
  
  // Set the tokens as input to the parser
  parser.input = lexResult.tokens;
  
  // Parse the tokens according to the grammar rules
  const cst = parser.screen();

  // If there are parsing errors, throw an error
  if (parser.errors.length > 0) {
    throw new Error("Parsing error: " + parser.errors[0].message);
  }

  return cst;
}

// Export the parser for advanced usage
export { parser } from "./parser";