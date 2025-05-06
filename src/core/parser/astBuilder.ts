import { CstNode } from "chevrotain";
import { parser } from './parser';

type Context = {
  [key: string]: any;
};

class AstBuilder extends parser.getBaseCstVisitorConstructorWithDefaults() {
  constructor() {
    super();
    this.validateVisitor();
  }

  program(ctx: Context) {
    // Process multiple screens
    const screens = ctx.screen ? ctx.screen.map((screen: CstNode) => this.visit(screen)) : [];
    return screens;
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
    if (ctx.selectField) return this.visit(ctx.selectField);
    if (ctx.checkboxElement) return this.visit(ctx.checkboxElement);
    console.warn('Unknown element type:', ctx);
    return null;
  }

  blockElement(ctx: Context) {
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
      type: "Block",
      props: {},
      elements
    };
  }

  headingElement(ctx: Context) {
    
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
      props: {
        level,
        children: content
      }
    };
  }
  
  linkElement(ctx: Context) {
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
      props: {
        href: url,
        children: text
      }
    };
  }

  buttonElement(ctx: Context) {
    const buttonText = ctx.Button[0].image;
    let text = '', url = '';

    const markdownMatch = buttonText.match(/@\[([^\]]+)\](?:\(([^)]+)\))?/);
    const dslMatch = buttonText.match(/button\s+\["([^"]*)"\]\s+([^\n\r]+)/);

    if (markdownMatch) {
      text = markdownMatch[1];
      url = markdownMatch[2] || ''; // URL is now optional, default to empty string
    } else if (dslMatch) {
      url = dslMatch[1];
      text = dslMatch[2];
    }

    return {
      type: "Button",
      props: {
        href: url,
        children: text
      }
    };
  }

  imageElement(ctx: Context) {
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
      props: {
        src: url,
        alt: text
      }
    };
  }

  inputElement(ctx: Context) {
    // Handle new input format
    if (ctx.Input) {
      const inputText = ctx.Input[0].image;
      
      // Parse out the components
      const isRequired = inputText.includes('___*');
      const isDisabled = inputText.includes('___-');
      
      // Extract optional label if present
      const labelMatch = inputText.match(/:([^(]+)(?:\(|\[|$)/);
      
      // Extract optional placeholder if present
      const placeholderMatch = inputText.match(/\(([^)]+)\)/);
      
      // Extract optional type or options if present
      const contentMatch = inputText.match(/\[([^\]]*)\]/);
      const content = contentMatch ? contentMatch[1].trim() : '';
      
      // Default props that will always be included
      const props: Record<string, any> = {
        type: content || 'text',
        required: isRequired,
        disabled: isDisabled
      };
      
      // Only add label if it exists
      if (labelMatch && labelMatch[1].trim()) {
        props.label = labelMatch[1].trim();
      }
      
      // Only add placeholder if it exists
      if (placeholderMatch && placeholderMatch[1].trim()) {
        props.placeholder = placeholderMatch[1].trim();
      }
      
      // Check if this is a select field (has pipe-separated options)
      if (content.includes('|')) {
        const options = content.split('|').map((opt: string) => opt.trim());
        return {
          type: "Select",
          props: {
            ...props,
            options,
            type: undefined // Remove type for select fields
          }
        };
      } else {
        // Regular input field
        return {
          type: "Input",
          props
        };
      }
    }
    
    return null;
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

  checkboxElement(ctx: Context) {
    if (!ctx.Checkbox || !ctx.Checkbox[0]) {
      return null;
    }

    const checkboxText = ctx.Checkbox[0].image;
    const match = checkboxText.match(/\[([ xX]?)\](?:\s+([^\n\r]+))/);
    
    if (!match) {
      console.warn('Failed to parse checkbox:', checkboxText);
      return null;
    }

    const isChecked = match[1]?.toLowerCase() === 'x';
    const label = match[2] ? match[2].trim() : '';

    return {
      type: "Checkbox",
      props: {
        checked: isChecked,
        label: label
      }
    };
  }

  textElement(ctx: Context) {
    let variant = "text";
    let content = "";

    if (ctx.Text) {
      const match = ctx.Text[0].image.match(/>\s+([^\n\r]+)/);
      content = match ? match[1].trim() : '';
      variant = "text";
    } else if (ctx.Note) {
      const match = ctx.Note[0].image.match(/\*>\s+([^\n\r]+)/);
      content = match ? match[1].trim() : '';
      variant = "note";
    } else if (ctx.Quote) {
      const match = ctx.Quote[0].image.match(/">\s+([^\n\r]+)/);
      content = match ? match[1].trim() : '';
      variant = "quote";
    }

    return {
      type: "Paragraph",
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

  rowElement(ctx: Context) {
    const elements = [];

    // Get elements from blockElement which is returned by the parser
    if (ctx.blockElement.length > 0) {
      for (const el of ctx.blockElement) {
        const elementAst = this.visit(el);
        
        if (elementAst) {
          elements.push(elementAst.elements); // Push the elements from the blockElement
        }
      }
    }

    return {
      type: "Row",
      elements
    };
  }

  columnElement(ctx: Context) {
    const elements = [];

    // Get elements from blockElement which is returned by the parser
    if (ctx.blockElement.length > 0) {
      for (const el of ctx.blockElement) {
        const elementAst = this.visit(el);
        
        if (elementAst) {
          elements.push(elementAst.elements); // Push the elements from the blockElement
        }
      }
    }

    return {
      type: "Col",
      elements
    };
  }

  cardElement(ctx: Context) {
    const elements = [];

    // Get elements from blockElement which is returned by the parser
    if (ctx.blockElement.length > 0) {
      for (const el of ctx.blockElement) {
        const elementAst = this.visit(el);
        
        if (elementAst) {
          elements.push(elementAst.elements); // Push the elements from the blockElement
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
