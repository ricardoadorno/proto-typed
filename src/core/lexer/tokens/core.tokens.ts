import { createToken, Lexer } from "chevrotain";

// Core Language Tokens - Essential tokens for parsing structure
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

export const Colon = createToken({ 
  name: "Colon", 
  pattern: /:/ 
});

export const Identifier = createToken({ 
  name: "Identifier", 
  pattern: /[^\s\n\r:{}[\](\)]+/ 
});
