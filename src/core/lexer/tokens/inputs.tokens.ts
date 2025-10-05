import { createToken } from "chevrotain";

// Input & Form Tokens - Interactive form elements
export const Input = createToken({ 
  name: "Input", 
  pattern: /___[\*\-]?(?::([^\n\r:{}[\]]+))?(?:\{([^}]+)\})?(?:\[([^\]]*)\])?/
});

export const RadioOption = createToken({
  name: "RadioOption",
  pattern: /\([xX ]?\)\s+([^\n\r]+)/
});

export const Checkbox = createToken({ 
  name: "Checkbox", 
  pattern: /\[([ xX]?)\](?:\s+([^\n\r]+))/ 
});