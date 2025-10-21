import { createToken } from "chevrotain";

// Component System Tokens - Reusable component definitions and instances
export const Component = createToken({
  name: "Component",
  pattern: /component/,
  label: "component"
});

export const ComponentInstance = createToken({
  name: "ComponentInstance",
  pattern: /\$([^\s\n\r:]+)/,
  label: "$ComponentName"
});

export const PropVariable = createToken({
  name: "PropVariable",
  pattern: /%([a-zA-Z_][a-zA-Z0-9_]*)/,
  label: "%propName"
});
