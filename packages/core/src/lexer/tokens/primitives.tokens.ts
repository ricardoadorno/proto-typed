import { createToken } from "chevrotain";

// Primitive Element Tokens - Basic UI elements

// Button variant tokens (optional, default is primary)
export const ButtonPrimary = createToken({ name: "ButtonPrimary", pattern: /@primary/, label: "@primary" });
export const ButtonSecondary = createToken({ name: "ButtonSecondary", pattern: /@secondary/, label: "@secondary" });
export const ButtonOutline = createToken({ name: "ButtonOutline", pattern: /@outline/, label: "@outline" });
export const ButtonGhost = createToken({ name: "ButtonGhost", pattern: /@ghost/, label: "@ghost" });
export const ButtonDestructive = createToken({ name: "ButtonDestructive", pattern: /@destructive/, label: "@destructive" });
export const ButtonLink = createToken({ name: "ButtonLink", pattern: /@link/, label: "@link" });
export const ButtonSuccess = createToken({ name: "ButtonSuccess", pattern: /@success/, label: "@success" });
export const ButtonWarning = createToken({ name: "ButtonWarning", pattern: /@warning/, label: "@warning" });

// Default button marker (when no variant specified, defaults to primary)
export const ButtonMarker = createToken({ 
  name: "ButtonMarker", 
  pattern: /@/,
  label: "@",
  longer_alt: [ButtonPrimary, ButtonSecondary, ButtonOutline, ButtonGhost, ButtonDestructive, ButtonLink, ButtonSuccess, ButtonWarning]
});

// Button size tokens (optional, default is md)
export const ButtonSizeXs = createToken({ name: "ButtonSizeXs", pattern: /-xs/, label: "-xs" });
export const ButtonSizeSm = createToken({ name: "ButtonSizeSm", pattern: /-sm/, label: "-sm" });
export const ButtonSizeMd = createToken({ name: "ButtonSizeMd", pattern: /-md/, label: "-md" });
export const ButtonSizeLg = createToken({ name: "ButtonSizeLg", pattern: /-lg/, label: "-lg" });

// Button label and action
export const ButtonLabel = createToken({ name: "ButtonLabel", pattern: /\[([^\]]+)\]/, label: "[text]" });
export const ButtonAction = createToken({ name: "ButtonAction", pattern: /\(([^)]+)\)/, label: "(action)" });

export const Link = createToken({
  name: "Link",
  pattern: /#\[([^\]]+)\](?:\(([^)]+)\))?/,
  label: "#[link text](url)"
});

export const Image = createToken({ 
  name: "Image", 
  pattern: /!\[([^\]]+)\](?:\(([^)]+)\))?/,
  label: "![alt text](url)"
});

export const Heading = createToken({
  name: "Heading",
  pattern: /#{1,6}(?!#)\s+([^\n\r#[\]"=:]+)/,
  label: "# heading"
});

export const Text = createToken({
  name: "Text",
  pattern: />>\s+([^\n\r]+)/,
  label: ">> text"
});

export const Paragraph = createToken({
  name: "Paragraph", 
  pattern: />\s+([^\n\r]+)/,
  label: "> paragraph"
});

export const MutedText = createToken({
  name: "MutedText",
  pattern: />>>\s+([^\n\r]+)/,
  label: ">>> muted text"
});

export const Note = createToken({
  name: "Note",
  pattern: /\*>\s+([^\n\r]+)/,
  label: "*> note"
});

export const Quote = createToken({
  name: "Quote",
  pattern: /">\s+([^\n\r]+)/,
  label: '"> quote'
});