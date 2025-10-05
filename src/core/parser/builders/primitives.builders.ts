/**
 * Primitive element builders for AST construction
 * Handles typography, buttons, links, images, and icons
 */

type Context = {
  [key: string]: any;
};

/**
 * Build heading element from context
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
 * Build text element from context
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
 * Build button element from context
 */
export function buildButtonElement(ctx: Context) {
  const buttonText = ctx.Button[0].image;
  let text = '', icon = '', action = '', variant = 'default';

  // Updated pattern to match @[variant][text]{icon}(action) - captures variant symbol
  const markdownMatch = buttonText.match(/@([_+\-=!]?)\[([^\]]+)\](?:\{([^}]+)\})?(?:\(([^)]+)\))?/);
  const dslMatch = buttonText.match(/button\s+\["([^"]*)"\]\s+([^\n\r]+)/);

  if (markdownMatch) {
    const variantSymbol = markdownMatch[1];
    text = markdownMatch[2];
    icon = markdownMatch[3] || ''; // Icon is optional
    action = markdownMatch[4] || ''; // Action is optional
    
    // Map variant symbols to variant names
    switch (variantSymbol) {
      case '_': variant = 'ghost'; break;
      case '+': variant = 'outline'; break;
      case '-': variant = 'secondary'; break;
      case '=': variant = 'destructive'; break;
      case '!': variant = 'warning'; break;
      default: variant = 'default'; break;
    }
  } else if (dslMatch) {
    action = dslMatch[1];
    text = dslMatch[2];
  }

  return {
    type: "Button",
    id: "", // ID will be generated later
    props: {
      action,
      text,
      icon,
      variant
    },
    children: []
  };
}

/**
 * Build link element from context
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
 * Build image element from context
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