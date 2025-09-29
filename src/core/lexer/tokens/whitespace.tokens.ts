import { createToken, Lexer } from "chevrotain";

// Whitespace & Formatting Tokens
export const WhiteSpace = createToken({
  name: "Spaces",
  pattern: / +/,
  group: Lexer.SKIPPED,
});

export const NewLine = createToken({
  name: "Newline",
  pattern: /\n|\r\n?/,
  group: "nl",
});

export const BlankLine = createToken({ 
  name: "BlankLine", 
  pattern: /\r?\n\s*\r?\n/ 
});