import { parser } from "./dslParser";
import { CstNode } from "chevrotain";

type Context = {
  [key: string]: any;
};

class AstBuilder extends parser.getBaseCstVisitorConstructorWithDefaults() {
  constructor() {
    super();
    this.validateVisitor();
  }

  screen(ctx: Context) {
    const name = ctx.name[0].image;
    const elements = ctx.element ? ctx.element.map((el: CstNode) => this.visit(el)) : [];

    return {
      type: "Screen",
      name,
      elements
    };
  }
  element(ctx: Context) {
    if (ctx.inputElement) return this.visit(ctx.inputElement);
    if (ctx.buttonElement) return this.visit(ctx.buttonElement);
    if (ctx.gridElement) return this.visit(ctx.gridElement);
    if (ctx.rowElement) return this.visit(ctx.rowElement);
    if (ctx.columnElement) return this.visit(ctx.columnElement);
    if (ctx.cardElement) return this.visit(ctx.cardElement);
    if (ctx.separatorElement) return this.visit(ctx.separatorElement);
    if (ctx.headingElement) return this.visit(ctx.headingElement);
    if (ctx.textElement) return this.visit(ctx.textElement);
    if (ctx.linkElement) return this.visit(ctx.linkElement);
    if (ctx.imageElement) return this.visit(ctx.imageElement);
    if (ctx.orderedListElement) return this.visit(ctx.orderedListElement);
    if (ctx.unorderedListElement) return this.visit(ctx.unorderedListElement);
    if (ctx.radioButtonGroup) return this.visit(ctx.radioButtonGroup);
    if (ctx.checkboxGroup) return this.visit(ctx.checkboxGroup);
    if (ctx.selectField) return this.visit(ctx.selectField);
    console.warn('Unknown element type:', ctx);
    return null;
  }

  headingElement(ctx: Context) {
    let level = 1;
    let content = '';

    const heading = ctx.Heading1?.[0] || ctx.Heading2?.[0] || ctx.Heading3?.[0] ||
      ctx.Heading4?.[0] || ctx.Heading5?.[0] || ctx.Heading6?.[0];

    if (ctx.Heading1) level = 1;
    else if (ctx.Heading2) level = 2;
    else if (ctx.Heading3) level = 3;
    else if (ctx.Heading4) level = 4;
    else if (ctx.ading5) level = 5;
    else if (ctx.Heading6) level = 6;

    const match = heading.image.match(/#+\s+([^\n\r]+)/);
    content = match ? match[1].trim() : '';

    return {
      type: "Heading",
      props: {
        level,
        children: content
      }
    };
  }
  linkElement(ctx: Context) {
    const linkText = ctx.Link[0].image;
    let text = '', url = '';

    // Check if it's the markdown-style link [text](url) or the DSL style link ["url"] text
    const markdownMatch = linkText.match(/\[([^\]]+)\]\(([^)]+)\)/);
    const dslMatch = linkText.match(/link\s+\[\"([^\"]*)\"\]\s+([^\n\r]+)/);

    if (markdownMatch) {
      text = markdownMatch[1];
      url = markdownMatch[2];
    } else if (dslMatch) {
      url = dslMatch[1];
      text = dslMatch[2];
    }

    return {
      type: "Link",
      props: {
        href: url,
        children: text
      }
    };
  }
  imageElement(ctx: Context) {
    const imageMatch = ctx.Image[0].image.match(/image\s+\[\"([^\"]*)\"\]\s+([^\n\r]+)/);
    const [_, src, alt] = imageMatch || ['', '', ''];

    return {
      type: "Image",
      props: {
        src,
        alt
      }
    };
  }

  inputElement(ctx: Context) {
    const attributes = ctx.attribute ? ctx.attribute.map((attr: CstNode) => this.visit(attr)) : [];
    const props = Object.fromEntries(attributes.map((attr: any) => [attr.name, attr.value]));

    return {
      type: "Input",
      props
    };
  }

  buttonElement(ctx: Context) {
    const text = ctx.text[0].image.slice(1, -1);

    return {
      type: "Button",
      props: {
        children: text
      }
    };
  }

  attribute(ctx: Context) {
    const name = ctx.name[0].image;
    let value;

    if (ctx.value[0].tokenType.name === "StringLiteral") {
      value = ctx.value[0].image.slice(1, -1);
    } else {
      value = ctx.value[0].image;
    }

    return {
      name,
      value
    };
  }

  orderedListElement(ctx: Context) {
    const items = ctx.OrderedListItem.map((item: any) => {
      const match = item.image.match(/\d+\.\s+([^\n\r]+)/);
      return match ? match[1].trim() : '';
    });

    return {
      type: "OrderedList",
      props: {
        items
      }
    };
  }

  unorderedListElement(ctx: Context) {
    const items = ctx.UnorderedListItem.map((item: any) => {
      const match = item.image.match(/-\s+([^\n\r]+)/);
      return match ? match[1].trim() : '';
    });

    return {
      type: "UnorderedList",
      props: {
        items
      }
    };
  }

  radioButtonGroup(ctx: Context) {
    const options = ctx.RadioOption.map((option: any) => {
      const match = option.image.match(/\(([xX ]?)\)\s+([^\n\r]+)/);
      return {
        selected: match ? match[1].toLowerCase() === 'x' : false,
        label: match ? match[2].trim() : ''
      };
    });

    return {
      type: "RadioGroup",
      props: {
        options
      }
    };
  }

  checkboxGroup(ctx: Context) {
    if (!ctx.CheckboxOption) {
      console.warn('No checkbox options found in context');
      return null;
    }

    const options = ctx.CheckboxOption.map((option: any) => {
      const match = option.image.match(/\[([xX ])?\]\s*([^\n\r]+)/);
      if (!match) {
        console.warn('Failed to parse checkbox option:', option.image);
        return null;
      }
      return {
        checked: match[1]?.toLowerCase() === 'x',
        label: match[2].trim()
      };
    }).filter(Boolean);

    return {
      type: "CheckboxGroup",
      props: {
        options
      }
    };
  }

  textElement(ctx: Context) {
    let type = "Paragraph";
    let variant = "text";
    let content = "";

    if (ctx.Text) {
      const match = ctx.Text[0].image.match(/text\s+([^\n\r]+)/);
      content = match ? match[1].trim() : '';
      variant = "text";
    } else if (ctx.Note) {
      const match = ctx.Note[0].image.match(/note\s+([^\n\r]+)/);
      content = match ? match[1].trim() : '';
      variant = "note";
    } else if (ctx.Quote) {
      const match = ctx.Quote[0].image.match(/quote\s+([^\n\r]+)/);
      content = match ? match[1].trim() : '';
      variant = "quote";
    }

    return {
      type,
      props: {
        variant,
        children: content
      }
    };
  }

  selectField(ctx: Context) {
    if (!ctx.SelectField) {
      return null;
    }

    const options = ctx.SelectField.map((option: any) => {
      const match = option.image.match(/<\[([^\]]+)\]>/);
      return match ? match[1].trim() : '';
    }).filter(Boolean);

    return {
      type: "Select",
      props: {
        options
      }
    };
  }

  gridElement(ctx: Context) {
    // Extract all child elements from context
    const elements = [];

    // Get all child elements that were parsed between the "grid" keyword and blank line
    if (ctx.element) {
      for (const el of ctx.element) {
        const elementAst = this.visit(el);
        if (elementAst) {
          elements.push(elementAst);
        }
      }
    }

    return {
      type: "Grid",
      props: {
        className: "grid"
      },
      elements
    };
  }

  rowElement(ctx: Context) {
    const elements = [];

    if (ctx.element) {
      for (const el of ctx.element) {
        const elementAst = this.visit(el);
        if (elementAst) {
          elements.push(elementAst);
        }
      }
    }

    // Extract attributes if present
    const attributesToken = ctx.attributes?.[0];
    const attributes = attributesToken ? attributesToken.image.slice(1, -1) : '';

    return {
      type: "Row",
      props: {
        className: "row" + (attributes ? ` ${attributes}` : '')
      },
      elements
    };
  }

  columnElement(ctx: Context) {
    const elements = [];

    if (ctx.element) {
      for (const el of ctx.element) {
        const elementAst = this.visit(el);
        if (elementAst) {
          elements.push(elementAst);
        }
      }
    }

    // Extract attributes if present
    const attributesToken = ctx.attributes?.[0];
    const attributes = attributesToken ? attributesToken.image.slice(1, -1) : '';

    return {
      type: "Column",
      props: {
        className: "column" + (attributes ? ` ${attributes}` : '')
      },
      elements
    };
  }

  cardElement(ctx: Context) {
    const elements = [];

    if (ctx.element) {
      for (const el of ctx.element) {
        const elementAst = this.visit(el);
        if (elementAst) {
          elements.push(elementAst);
        }
      }
    }

    return {
      type: "Card",
      props: {
        className: "card"
      },
      elements
    };
  }

  separatorElement(ctx: Context) {
    return {
      type: "Separator",
      props: {}
    };
  }
}

export const astBuilder = new AstBuilder();
