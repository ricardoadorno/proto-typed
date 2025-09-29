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
  pattern: /\$([^\s\n\r]+)/
});

export const Colon = createToken({ 
  name: "Colon", 
  pattern: /:/ 
});

export const Identifier = createToken({ 
  name: "Identifier", 
  pattern: /[^\s\n\r:{}[\]()]+/ 
});