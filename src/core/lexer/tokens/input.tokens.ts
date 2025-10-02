import { createToken } from "chevrotain";

// Input Family Tokens
export const Input = createToken({ 
  name: "Input", 
  pattern: /___[\*\-]?(?::([^\n\r:{}[\]()]+))?(?:\{([^}]+)\})?(?:\[([^\]]*)\])?(?:\((%[a-zA-Z_][a-zA-Z0-9_]*)\))?/
});

export const RadioOption = createToken({
  name: "RadioOption",
  pattern: /\([xX ]?\)\s+([^\n\r]+)/
});

export const Checkbox = createToken({ 
  name: "Checkbox", 
  pattern: /\[([ xX]?)\](?:\s+([^\n\r]+))/ 
});