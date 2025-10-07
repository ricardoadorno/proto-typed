import { createToken } from "chevrotain";

// Primitive Element Tokens - Basic UI elements

// Button variant tokens (optional, default is primary)
export const ButtonPrimary = createToken({ name: "ButtonPrimary", pattern: /@primary/ });
export const ButtonSecondary = createToken({ name: "ButtonSecondary", pattern: /@secondary/ });
export const ButtonOutline = createToken({ name: "ButtonOutline", pattern: /@outline/ });
export const ButtonGhost = createToken({ name: "ButtonGhost", pattern: /@ghost/ });
export const ButtonDestructive = createToken({ name: "ButtonDestructive", pattern: /@destructive/ });
export const ButtonLink = createToken({ name: "ButtonLink", pattern: /@link/ });
export const ButtonSuccess = createToken({ name: "ButtonSuccess", pattern: /@success/ });
export const ButtonWarning = createToken({ name: "ButtonWarning", pattern: /@warning/ });

// Default button marker (when no variant specified, defaults to primary)
export const ButtonMarker = createToken({ 
  name: "ButtonMarker", 
  pattern: /@/,
  longer_alt: [ButtonPrimary, ButtonSecondary, ButtonOutline, ButtonGhost, ButtonDestructive, ButtonLink, ButtonSuccess, ButtonWarning]
});

// Button size tokens (optional, default is md)
export const ButtonSizeXs = createToken({ name: "ButtonSizeXs", pattern: /-xs/ });
export const ButtonSizeSm = createToken({ name: "ButtonSizeSm", pattern: /-sm/ });
export const ButtonSizeMd = createToken({ name: "ButtonSizeMd", pattern: /-md/ });
export const ButtonSizeLg = createToken({ name: "ButtonSizeLg", pattern: /-lg/ });

// Button label and action
export const ButtonLabel = createToken({ name: "ButtonLabel", pattern: /\[([^\]]+)\]/ });
export const ButtonAction = createToken({ name: "ButtonAction", pattern: /\(([^)]+)\)/ });

export const Link = createToken({
  name: "Link",
  pattern: /#\[([^\]]+)\](?:\(([^)]+)\))?/
});

export const Image = createToken({ 
  name: "Image", 
  pattern: /!\[([^\]]+)\](?:\(([^)]+)\))?/ 
});

export const Heading = createToken({
  name: "Heading",
  pattern: /#{1,6}(?!#)\s+([^\n\r#[\]"=:]+)/
});

export const Text = createToken({
  name: "Text",
  pattern: />>\s+([^\n\r]+)/
});

export const Paragraph = createToken({
  name: "Paragraph", 
  pattern: />\s+([^\n\r]+)/
});

export const MutedText = createToken({
  name: "MutedText",
  pattern: />>>\s+([^\n\r]+)/
});

export const Note = createToken({
  name: "Note",
  pattern: /\*>\s+([^\n\r]+)/
});

export const Quote = createToken({
  name: "Quote",
  pattern: /">\s+([^\n\r]+)/
});