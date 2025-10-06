import { createToken } from "chevrotain";

// Primitive Element Tokens - Basic UI elements
export const Button = createToken({ 
  name: "Button", 
  pattern: /(@{1,3})([_+\-=!]?)\[([^\]]+)\](?:\{([^}]+)\})?(?:\(([^)]+)\))?/ 
});

export const Link = createToken({
  name: "Link",
  pattern: /#\[([^\]]+)\](?:\(([^)]+)\))?/
});

export const Image = createToken({ 
  name: "Image", 
  pattern: /!\[([^\]]+)\](?:\(([^)]+)\))?/ 
});

export const Heading = createToken({
  name: "Heading",
  pattern: /#{1,6}(?!#)\s+([^\n\r#[\]"=:]+)/
});

export const Text = createToken({
  name: "Text",
  pattern: />>\s+([^\n\r]+)/
});

export const Paragraph = createToken({
  name: "Paragraph", 
  pattern: />\s+([^\n\r]+)/
});

export const MutedText = createToken({
  name: "MutedText",
  pattern: />>>\s+([^\n\r]+)/
});

export const Note = createToken({
  name: "Note",
  pattern: /\*>\s+([^\n\r]+)/
});

export const Quote = createToken({
  name: "Quote",
  pattern: /">\s+([^\n\r]+)/
});