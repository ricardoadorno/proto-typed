/**
 * Primitive element builders for AST construction
 * Handles typography, buttons, links, images, and icons
 */

import { validateButtonVariant, validateButtonSize, validateRequiredProps } from './builder-validation';

type Context = {
  [key: string]: any;
};

/**
 * @function buildHeadingElement
 * @description Builds a 'Heading' AST node from the corresponding CST node.
 * It determines the heading level by counting the '#' characters and extracts the content.
 *
 * @param {Context} ctx - The Chevrotain CST node context for the heading.
 * @returns {object | null} A 'Heading' AST node, or null if the token is invalid.
 */
export function buildHeadingElement(ctx: Context) {
  if (!ctx.Heading || !ctx.Heading[0]) {
    return null;
  }

  const headingToken = ctx.Heading[0];
  const headingText = headingToken.image;
  
  // Extract the level by counting the # characters
  const hashMatch = headingText.match(/^(?:\r\n|\r|\n|\s)*(#+)(?!#)\s+/);
  const level = hashMatch ? hashMatch[1].length : 1;
  
  // Extract the content by matching everything after the # and whitespace
  const contentMatch = headingText.match(/#+\s+([^\n\r#[\]"=:]+)/);
  const content = contentMatch ? contentMatch[1].trim() : '';

  return {
    type: "Heading",
    id: "", // ID will be generated later
    props: {
      level,
      content
    },
    children: []
  };
}

/**
 * @function buildTextElement
 * @description Builds a 'Text' or 'Paragraph' AST node from the corresponding CST node.
 * It determines the text variant (text, paragraph, muted, note, quote) and extracts the content.
 *
 * @param {Context} ctx - The Chevrotain CST node context for the text element.
 * @returns {object} A 'Text' or 'Paragraph' AST node.
 */
export function buildTextElement(ctx: Context) {
  let variant = "text";
  let content = "";
  let type = "Text";

  if (ctx.Text) {
    const match = ctx.Text[0].image.match(/>\s+([^\n\r]+)/);
    content = match ? match[1].trim() : '';
    variant = "text";
    type = "Text";
  } else if (ctx.Paragraph) {
    const match = ctx.Paragraph[0].image.match(/>\s+([^\n\r]+)/);
    content = match ? match[1].trim() : '';
    variant = "paragraph";
    type = "Paragraph";
  } else if (ctx.MutedText) {
    const match = ctx.MutedText[0].image.match(/>>>\s+([^\n\r]+)/);
    content = match ? match[1].trim() : '';
    variant = "muted";
    type = "MutedText";
  } else if (ctx.Note) {
    const match = ctx.Note[0].image.match(/\*>\s+([^\n\r]+)/);
    content = match ? match[1].trim() : '';
    variant = "note";
    type = "Text";
  } else if (ctx.Quote) {
    const match = ctx.Quote[0].image.match(/">\s+([^\n\r]+)/);
    content = match ? match[1].trim() : '';
    variant = "quote";
    type = "Text";
  }

  return {
    type,
    id: "", // ID will be generated later
    props: {
      variant,
      content
    },
    children: []
  };
}

/**
 * @function buildButtonElement
 * @description Builds a 'Button' AST node from the corresponding CST node.
 * It parses the button's variant, size, text, and action.
 *
 * @param {Context} ctx - The Chevrotain CST node context for the button.
 * @param {any} visitor - The CST visitor instance.
 * @returns {object} A 'Button' AST node.
 */
export function buildButtonElement(ctx: Context, visitor: any) {
  let variant = 'primary'; // Default variant
  let size = 'md'; // Default size
  let text = '';
  let action = '';

  // Get token for line/column info
  const buttonToken = ctx.ButtonPrimary?.[0] || ctx.ButtonSecondary?.[0] || 
                      ctx.ButtonOutline?.[0] || ctx.ButtonGhost?.[0] ||
                      ctx.ButtonMarker?.[0];
  const line = buttonToken?.startLine;
  const column = buttonToken?.startColumn;

  // Determine variant from which token is present
  if (ctx.ButtonPrimary) variant = 'primary';
  else if (ctx.ButtonSecondary) variant = 'secondary';
  else if (ctx.ButtonOutline) variant = 'outline';
  else if (ctx.ButtonGhost) variant = 'ghost';
  else if (ctx.ButtonDestructive) variant = 'destructive';
  else if (ctx.ButtonLink) variant = 'link';
  else if (ctx.ButtonSuccess) variant = 'success';
  else if (ctx.ButtonWarning) variant = 'warning';
  else if (ctx.ButtonMarker) variant = 'primary'; // Default marker maps to primary

  // Validate variant
  variant = validateButtonVariant(visitor, variant, line, column);
  
  size = validateButtonSize(visitor, size, line, column);

  // Determine size from which token is present
  if (ctx.ButtonSizeXs) size = 'extra-small';
  else if (ctx.ButtonSizeSm) size = 'small';
  else if (ctx.ButtonSizeMd) size = 'medium'
  else if (ctx.ButtonSizeLg) size = 'large';
  // Otherwise keep default 'md'

  // Validate size

  // Extract label text from ButtonLabel token
  if (ctx.ButtonLabel && ctx.ButtonLabel[0]) {
    const labelMatch = ctx.ButtonLabel[0].image.match(/\[([^\]]+)\]/);
    text = labelMatch ? labelMatch[1] : '';
  }

  // Extract action from ButtonAction token (optional)
  if (ctx.ButtonAction && ctx.ButtonAction[0]) {
    const actionMatch = ctx.ButtonAction[0].image.match(/\(([^)]+)\)/);
    action = actionMatch ? actionMatch[1] : '';
  }

  // Validate required props
  validateRequiredProps(visitor, { text }, ['text'], 'Button', line, column);

  return {
    type: "Button",
    id: "", // ID will be generated later
    props: {
      action,
      text,
      variant,
      size
    },
    children: []
  };
}

/**
 * @function buildLinkElement
 * @description Builds a 'Link' AST node from the corresponding CST node.
 * It parses the link's text and URL from both Markdown and DSL syntaxes.
 *
 * @param {Context} ctx - The Chevrotain CST node context for the link.
 * @returns {object} A 'Link' AST node.
 */
export function buildLinkElement(ctx: Context) {
  const linkText = ctx.Link[0].image;
  let text = '', url = '';

  // Updated regex to match the new #[text](url) syntax
  const markdownMatch = linkText.match(/#\[([^\]]+)\](?:\(([^)]+)\))?/);
  const dslMatch = linkText.match(/link\s+\["([^"]*)"\]\s+([^\n\r]+)/);

  if (markdownMatch) {
    text = markdownMatch[1];
    url = markdownMatch[2] || ''; // URL is now optional, default to empty string
  } else if (dslMatch) {
    url = dslMatch[1];
    text = dslMatch[2];
  }

  return {
    type: "Link",
    id: "", // ID will be generated later
    props: {
      destination: url,
      text
    },
    children: []
  };
}

/**
 * @function buildImageElement
 * @description Builds an 'Image' AST node from the corresponding CST node.
 * It parses the image's alt text and source URL from both Markdown and DSL syntaxes.
 *
 * @param {Context} ctx - The Chevrotain CST node context for the image.
 * @returns {object} An 'Image' AST node.
 */
export function buildImageElement(ctx: Context) {
  const imageText = ctx.Image[0].image;
  let text = '', url = '';

  const markdownMatch = imageText.match(/!\[([^\]]+)\](?:\(([^)]+)\))?/);
  const dslMatch = imageText.match(/image\s+\["([^"]*)"\]\s+([^\n\r]+)/);

  if (markdownMatch) {
    text = markdownMatch[1];
    url = markdownMatch[2] || ''; // URL is now optional, default to empty string
  } else if (dslMatch) {
    url = dslMatch[1];
    text = dslMatch[2];
  }

  return {
    type: "Image",
    id: "", // ID will be generated later
    props: {
      src: url,
      alt: text
    },
    children: []
  };
}
