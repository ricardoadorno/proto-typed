import { createToken } from "chevrotain";

// Screen & Overlay Tokens
export const Screen = createToken({ 
  name: "Screen", 
  pattern: /screen/ 
});

export const Component = createToken({
  name: "Component",
  pattern: /component/
});

export const Modal = createToken({
  name: "Modal", 
  pattern: /modal/
});

export const Drawer = createToken({
  name: "Drawer",
  pattern: /drawer/
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

export const Colon = createToken({ 
  name: "Colon", 
  pattern: /:/ 
});

export const Identifier = createToken({ 
  name: "Identifier", 
  pattern: /[^\s\n\r:{}[\]()]+/ 
});