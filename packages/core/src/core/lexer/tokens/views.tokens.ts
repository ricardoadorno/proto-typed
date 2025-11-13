import { createToken } from "chevrotain";

// View Container Tokens - Screen-level containers and overlays
export const Screen = createToken({ 
  name: "Screen", 
  pattern: /screen/,
  label: "screen"
});

export const Modal = createToken({
  name: "Modal", 
  pattern: /modal/,
  label: "modal"
});

export const Drawer = createToken({
  name: "Drawer",
  pattern: /drawer/,
  label: "drawer"
});