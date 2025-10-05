import { createToken } from "chevrotain";

// Component System Tokens - Reusable component definitions and instances
export const Component = createToken({
  name: "Component",
  pattern: /component/
});

export const ComponentInstance = createToken({
  name: "ComponentInstance",
  pattern: /\$([^\s\n\r:]+)(?!\s*:)/
});

export const ComponentInstanceWithProps = createToken({
  name: "ComponentInstanceWithProps",
  pattern: /\$([^\s\n\r:]+):\s*(.+)/
});

export const PropVariable = createToken({
  name: "PropVariable",
  pattern: /%([a-zA-Z_][a-zA-Z0-9_]*)/
});