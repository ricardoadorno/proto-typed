import { createToken } from "chevrotain";

// Component System Tokens - Reusable component definitions and instances
export const Component = createToken({
  name: "Component",
  pattern: /component/,
  label: "component"
});

export const ComponentInstance = createToken({
  name: "ComponentInstance",
  pattern: /\$([^\s\n\r:]+)(?!\s*:)/,
  label: "$ComponentName"
});

export const ComponentInstanceWithProps = createToken({
  name: "ComponentInstanceWithProps",
  // Matches: $Foo: bar | zirt  -> group1 = Foo, group2 = "bar | zirt" (rest of the line)
  pattern: /\$([^\s\n\r:]+)\s*:\s*([^\n\r]+)/,
  label: "$ComponentName:props"
});

export const PropVariable = createToken({
  name: "PropVariable",
  pattern: /%([a-zA-Z_][a-zA-Z0-9_]*)/,
  label: "%propName"
});