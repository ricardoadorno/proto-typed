import { createToken } from "chevrotain";

// Input & Form Tokens - Interactive form elements

// Main input token: ___<type>: Label{placeholder}[options] | attributes
// Captures the entire input declaration in one token
export const Input = createToken({ 
  name: "Input", 
  pattern: /___(?:(email|password|date|number|textarea))?:\s*([^{\[\|\n\r]+)(?:\{([^}]+)\})?(?:\[([^\]]+)\])?(?:\s*\|\s*([^\n\r]+))?/,
  label: "___: Label{placeholder}"
});

// Radio and checkbox tokens (unchanged)
export const RadioOption = createToken({
  name: "RadioOption",
  pattern: /\([xX ]?\)\s*([^\n\r]+)/,
  label: "(X) radio option"
});

export const Checkbox = createToken({ 
  name: "Checkbox", 
  pattern: /\[([ xX]?)\](?:\s*([^\n\r]+))?/,
  label: "[X] checkbox"
});