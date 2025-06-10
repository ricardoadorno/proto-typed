import { CstNode } from "chevrotain";
import { UiDslParser } from './parser';

type Context = {
  [key: string]: any;
};

// Create a parser instance to get the visitor constructor
const parserInstance = new UiDslParser();

export default class AstBuilder extends parserInstance.getBaseCstVisitorConstructorWithDefaults() {
  constructor() {
    super();
    this.validateVisitor();
  }
  program(ctx: Context) {
    // Process multiple screens and components
    const screens = ctx.screen ? ctx.screen.map((screen: CstNode) => this.visit(screen)) : [];
    const components = ctx.component ? ctx.component.map((component: CstNode) => this.visit(component)) : [];
    return [...screens, ...components];
  }
  screen(ctx: Context) {
    const name = ctx.name[0].image;
    const elements = ctx.element ? ctx.element.map((el: CstNode) => this.visit(el)) : [];

    return {
      type: "screen",
      name,
      elements
    };
  }

  component(ctx: Context) {
    const name = ctx.name[0].image;
    const elements = ctx.element ? ctx.element.map((el: CstNode) => this.visit(el)) : [];

    return {
      type: "component",
      name,
      elements
    };
  } 
  
  element(ctx: Context) {
    if (ctx.componentInstanceElement) return this.visit(ctx.componentInstanceElement);
    if (ctx.modalElement) return this.visit(ctx.modalElement);
    if (ctx.inputElement) return this.visit(ctx.inputElement);
    if (ctx.buttonElement) return this.visit(ctx.buttonElement);
    if (ctx.rowElement) return this.visit(ctx.rowElement);
    if (ctx.columnElement) return this.visit(ctx.columnElement);
    if (ctx.listElement) return this.visit(ctx.listElement);
    if (ctx.cardElement) return this.visit(ctx.cardElement);
    if (ctx.headerElement) return this.visit(ctx.headerElement);    if (ctx.bottomNavElement) return this.visit(ctx.bottomNavElement);
    if (ctx.drawerElement) return this.visit(ctx.drawerElement);
    if (ctx.navItemElement) return this.visit(ctx.navItemElement);    if (ctx.drawerItemElement) return this.visit(ctx.drawerItemElement);
    if (ctx.fabItemElement) return this.visit(ctx.fabItemElement);
    if (ctx.fabElement) return this.visit(ctx.fabElement);
    if (ctx.separatorElement) return this.visit(ctx.separatorElement);
    if (ctx.headingElement) return this.visit(ctx.headingElement);
    if (ctx.textElement) return this.visit(ctx.textElement);
    if (ctx.linkElement) return this.visit(ctx.linkElement);
    if (ctx.imageElement) return this.visit(ctx.imageElement);
    if (ctx.orderedListElement) return this.visit(ctx.orderedListElement);
    if (ctx.unorderedListElement) return this.visit(ctx.unorderedListElement);
    if (ctx.radioButtonGroup) return this.visit(ctx.radioButtonGroup);
    if (ctx.checkboxElement) return this.visit(ctx.checkboxElement);
    console.warn('Unknown element type:', ctx);    return null;
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
      props: {
        href: action,
        children: text,
        icon: icon,
        variant: variant
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
      const isPassword = inputText.includes('___*');
      const isDisabled = inputText.includes('___-');
      
      // Extract optional label if present
      const labelMatch = inputText.match(/:([^{(\[]+)(?=\{|\(|\[|$)/);
        // Extract optional placeholder if present
      const placeholderMatch = inputText.match(/\{([^}]+)\}/);
      
      // Extract optional type or options if present
      const contentMatch = inputText.match(/\[([^\]]*)\]/);
      const content = contentMatch ? contentMatch[1].trim() : '';
      
      // Default props that will always be included
      const props: Record<string, any> = {
        type: isPassword ? 'password' : 'text',
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
        // Regular input field - ignore single types like [text], [email], etc.
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

  rowElement(ctx: Context) {
    const elements = [];

    // Get elements directly from element subrules
    if (ctx.element && ctx.element.length > 0) {
      for (const el of ctx.element) {
        const elementAst = this.visit(el);
        
        if (elementAst) {
          elements.push(elementAst);
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

    // Get elements directly from element subrules
    if (ctx.element && ctx.element.length > 0) {
      for (const el of ctx.element) {
        const elementAst = this.visit(el);
        
        if (elementAst) {
          elements.push(elementAst);
        }
      }
    }

    return {
      type: "Col",
      elements
    };
  }  
  
  listElement(ctx: Context) {    
    const items: any[] = [];

    // Handle simple unordered list items using UnorderedListItem
    if (ctx.UnorderedListItem) {
      ctx.UnorderedListItem.forEach((item: any) => {
        const itemText = item.image;
        // Extract text after the dash and space: "- text" -> "text"
        const match = itemText.match(/-\s+(.+)/);
        if (match) {
          const text = match[1].trim();
          items.push({
            type: "ListItem",
            props: {
              text: text
            }
          });
        }
      });
    }

    // Handle complex list items (legacy support)
    if (ctx.ListItem) {
      ctx.ListItem.forEach((item: any) => {
        const itemText = item.image;
        
        // Parse the format: - [image]text{subtext}[image]
        const match = itemText.match(/-\s+\[([^\]]+)\]([^{]+)\{([^}]+)\}\[([^\]]+)\]/);
        
        if (match) {
          const [, leadingImage, mainText, subText, trailingImage] = match;
          
          items.push({
            type: "ComplexListItem",
            props: {
              leadingImage: leadingImage.trim(),
              mainText: mainText.trim(),
              subText: subText.trim(),
              trailingImage: trailingImage.trim()
            }
          });
        }
      });
    }

    return {
      type: "List",
      elements: items
    };
  }

  cardElement(ctx: Context) {
    const elements = [];

    // Get elements directly from element subrules
    if (ctx.element && ctx.element.length > 0) {
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
  
  separatorElement(_ctx: Context) {
    return {
      type: "Separator",
      props: {}
    };
  }
  // Mobile Layout Elements
  headerElement(ctx: Context) {
    const elements = [];

    // Get elements directly from element subrules
    if (ctx.element && ctx.element.length > 0) {
      for (const el of ctx.element) {
        const elementAst = this.visit(el);
        
        if (elementAst) {
          elements.push(elementAst);
        }
      }
    }

    return {
      type: "Header",
      props: {
        className: "header"
      },
      elements
    };
  }

  bottomNavElement(ctx: Context) {
    const items = [];

    if (ctx.NavItem) {
      for (const item of ctx.NavItem) {
        const itemText = item.image;
        // Pattern: nav_item [label]{icon}(action)
        const match = itemText.match(/nav_item\s+\[([^\]]+)\]\{([^}]+)\}(?:\(([^)]+)\))?/);
        
        if (match) {
          const [, label, icon, action] = match;
          items.push({
            type: "NavItem",
            props: {
              label: label.trim(),
              icon: icon.trim(),
              action: action ? action.trim() : ''
            }
          });
        }
      }
    }

    return {
      type: "BottomNav",
      props: {
        className: "bottom-nav"
      },
      elements: items
    };
  }  
  
  drawerElement(ctx: Context) {
    const name = ctx.name[0].image;
    const elements = ctx.element ? ctx.element.map((el: CstNode) => this.visit(el)) : [];

    return {
      type: "drawer",
      name,
      elements
    };
  }

  navItemElement(ctx: Context) {
    const itemText = ctx.NavItem[0].image;
    // Pattern: nav_item [label]{icon}(action)
    const match = itemText.match(/nav_item\s+\[([^\]]+)\]\{([^}]+)\}(?:\(([^)]+)\))?/);
    
    if (match) {
      const [, label, icon, action] = match;
      return {
        type: "NavItem",
        props: {
          label: label.trim(),
          icon: icon.trim(),
          action: action ? action.trim() : ''
        }
      };
    }
    
    return null;
  }

  drawerItemElement(ctx: Context) {
    const itemText = ctx.DrawerItem[0].image;
    // Pattern: drawer_item [label]{icon}(action)
    const match = itemText.match(/drawer_item\s+\[([^\]]+)\]\{([^}]+)\}(?:\(([^)]+)\))?/);
    
    if (match) {
      const [, label, icon, action] = match;
      return {
        type: "DrawerItem",
        props: {
          label: label.trim(),
          icon: icon.trim(),
          action: action ? action.trim() : ''
        }
      };
    }
      return null;
  }
  
  fabElement(ctx: Context) {
    const fabText = ctx.FAB[0].image;
    // Pattern: fab {icon}
    const match = fabText.match(/fab\s+\{([^}]+)\}/);
    
    const elements = [];
    
    // Get fab_items if they exist
    if (ctx.fabItemElement && ctx.fabItemElement.length > 0) {
      for (const item of ctx.fabItemElement) {
        const itemAst = this.visit(item);
        if (itemAst) {
          elements.push(itemAst);
        }
      }
    }
    
    if (match) {
      const [, icon] = match;
      return {
        type: "FAB",
        props: {
          icon: icon.trim()
        },
        elements: elements.length > 0 ? elements : undefined
      };
    }
    
    return null;
  }

  fabItemElement(ctx: Context) {
    const itemText = ctx.FABItem[0].image;
    // Pattern: fab_item [label]{icon}(action)
    const match = itemText.match(/fab_item\s+\[([^\]]+)\]\{([^}]+)\}(?:\(([^)]+)\))?/);
    
    if (match) {
      const [, label, icon, action] = match;
      return {
        type: "FABItem",
        props: {
          label: label.trim(),
          icon: icon.trim(),
          action: action ? action.trim() : ''
        }
      };
    }
    
    return null;
  }

  componentInstanceElement(ctx: Context) {
    const token = ctx.ComponentInstance[0];
    const match = token.image.match(/\$([a-zA-Z_][a-zA-Z0-9_]*)/);
    const componentName = match ? match[1] : '';

    return {
      type: "component_instance",
      name: componentName
    };
  }

  modalElement(ctx: Context) {
    const name = ctx.name[0].image;
    const elements = ctx.element ? ctx.element.map((el: CstNode) => this.visit(el)) : [];

    return {
      type: "modal",
      name,
      elements
    };
  }
}

