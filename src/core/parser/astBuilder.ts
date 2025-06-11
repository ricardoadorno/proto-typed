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
    if (ctx.headerElement) return this.visit(ctx.headerElement);    if (ctx.navigatorElement) return this.visit(ctx.navigatorElement);    if (ctx.drawerElement) return this.visit(ctx.drawerElement);
    if (ctx.fabElement) return this.visit(ctx.fabElement);if (ctx.separatorElement) return this.visit(ctx.separatorElement);
    if (ctx.emptyDivElement) return this.visit(ctx.emptyDivElement);
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
    let items: any[] = [];
    
    // Handle AdvancedListItem tokens
    if (ctx.AdvancedListItem) {
      items = items.concat(ctx.AdvancedListItem.map((item: any) => {
        return this.parseAdvancedListItem(item.image);
      }));
    }
    
    // Handle UnorderedListItem tokens  
    if (ctx.UnorderedListItem) {
      items = items.concat(ctx.UnorderedListItem.map((item: any) => {
        const match = item.image.match(/-\s+([^\n\r]+)/);
        return {
          type: "simple",
          text: match ? match[1].trim() : ''
        };
      }));
    }

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

    // Handle advanced list items (new flexible syntax)
    if (ctx.AdvancedListItem) {
      ctx.AdvancedListItem.forEach((item: any) => {
        const itemText = item.image;
        const advancedItem = this.parseAdvancedListItem(itemText);
        if (advancedItem) {
          items.push(advancedItem);
        }
      });
    }

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
          });        }
      });
    }

    return {
      type: "List",
      elements: items
    };
  }  // Helper method to parse advanced list item syntax
  private parseAdvancedListItem(itemText: string) {
    // Remove initial "- " and trim
    const content = itemText.replace(/^(?:\r\n|\r|\n|\s)*-\s+/, '').trim();
    
    // Extract initial link if present: [text](link)
    const linkMatch = content.match(/^\[([^\]]*)\]\(([^)]*)\)/);
    const initialLink = linkMatch ? linkMatch[2] : '';
    const linkText = linkMatch ? linkMatch[1] : '';
    
    // Remove the initial link from content for further parsing
    let remainingContent = content;
    if (linkMatch) {
      remainingContent = content.substring(linkMatch[0].length).trim();
    }
    
    // Extract subtitle from {subtitle} - this is optional
    const subtitleMatch = remainingContent.match(/\{([^}]*)\}/);
    const subtitle = subtitleMatch ? subtitleMatch[1].trim() : '';
    
    // Extract content before the subtitle section (free text)
    let beforeSubtitle = '';
    let afterSubtitle = '';
    
    if (subtitleMatch) {
      beforeSubtitle = remainingContent.substring(0, remainingContent.indexOf('{')).trim();
      afterSubtitle = remainingContent.substring(remainingContent.indexOf('}') + 1).trim();
    } else {
      // If no subtitle, all remaining content is "before subtitle" for text and button parsing
      beforeSubtitle = remainingContent;
    }
    
    return this.buildAdvancedListItemNode(initialLink, linkText, beforeSubtitle, subtitle, afterSubtitle);
  }
  // Helper method to build the advanced list item node
  private buildAdvancedListItemNode(initialLink: string, linkText: string, beforeSubtitle: string, subtitle: string, afterSubtitle: string) {
    const buttons: any[] = [];
    const textSegments: string[] = [];
    
    // Parse before subtitle content for buttons and text
    this.parseButtonsAndText(beforeSubtitle, buttons, textSegments);
    
    // Parse after subtitle content for buttons
    this.parseButtonsAndText(afterSubtitle, buttons, []);
    
    return {
      type: "AdvancedListItem",
      props: {
        initialLink: initialLink || '',
        linkText: linkText || '',
        title: '', // No longer used in simplified syntax
        subtitle: subtitle || '',
        buttons: buttons,
        textSegments: textSegments.filter(t => t.trim())
      }
    };
  }
    // Helper method to parse buttons and text from content
  private parseButtonsAndText(content: string, buttons: any[], textSegments: string[]) {
    if (!content) return;
    
    // Find all button patterns: [text](action) and @[variant][text](action)
    const buttonRegex = /(@([_+\-=!]?))?\[([^\]]*)\]\(([^)]*)\)/g;
    let lastIndex = 0;
    let match;
    
    while ((match = buttonRegex.exec(content)) !== null) {
      // Add text before this button
      const textBefore = content.substring(lastIndex, match.index).trim();
      if (textBefore) {
        textSegments.push(textBefore);
      }
      
      const hasVariantPrefix = !!match[1]; // Check if @ prefix exists
      const variantSymbol = match[2] || ''; // Get variant symbol
      const text = match[3];
      const action = match[4];
      
      // Map variant symbols to variant names (same as button element)
      let variant = 'default';
      if (hasVariantPrefix) {
        switch (variantSymbol) {
          case '_': variant = 'ghost'; break;
          case '+': variant = 'outline'; break;
          case '-': variant = 'secondary'; break;
          case '=': variant = 'destructive'; break;
          case '!': variant = 'warning'; break;
          default: variant = 'default'; break;
        }
      }
      
      // Add the button with variant support
      buttons.push({
        text: text,
        action: action,
        variant: variant
      });
      
      lastIndex = buttonRegex.lastIndex;
    }
    
    // Add any remaining text after the last button
    const remainingText = content.substring(lastIndex).trim();
    if (remainingText) {
      textSegments.push(remainingText);
    }
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

  emptyDivElement(_ctx: Context) {
    return {
      type: "EmptyDiv",
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
  }  navigatorElement(ctx: Context) {
    const items: any[] = [];

    // Handle advanced list items (with brackets and braces)
    if (ctx.AdvancedListItem) {
      ctx.AdvancedListItem.forEach((item: any) => {
        const itemText = item.image;
        const navItem = this.parseNavigatorItem(itemText);
        if (navItem) {
          items.push(navItem);
        }
      });
    }

    // Handle simple unordered list items
    if (ctx.UnorderedListItem) {
      ctx.UnorderedListItem.forEach((item: any) => {
        const itemText = item.image;
        const navItem = this.parseNavigatorItem(itemText);
        if (navItem) {
          items.push(navItem);
        }
      });
    }

    return {
      type: "Navigator",
      props: {
        className: "navigator"
      },
      elements: items
    };
  }  drawerElement(ctx: Context) {
    const name = ctx.name[0].image;
    const items: any[] = [];

    // Handle advanced list items (with brackets and braces)
    if (ctx.AdvancedListItem) {
      ctx.AdvancedListItem.forEach((item: any) => {
        const itemText = item.image;
        const drawerItem = this.parseDrawerItem(itemText);
        if (drawerItem) {
          items.push(drawerItem);
        }
      });
    }

    // Handle simple unordered list items
    if (ctx.UnorderedListItem) {
      ctx.UnorderedListItem.forEach((item: any) => {
        const itemText = item.image;
        const drawerItem = this.parseDrawerItem(itemText);
        if (drawerItem) {
          items.push(drawerItem);
        }
      });
    }

    return {
      type: "drawer",
      name,
      elements: items
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
    // Pattern: fab {icon} text
    const match = fabText.match(/fab\s+\{([^}]+)\}\s+([^\n\r]+)/);
    
    if (match) {
      const [, icon, text] = match;
      return {
        type: "FAB",
        props: {
          icon: icon.trim(),
          text: text.trim(),
          href: text.trim() // Text acts as the link action
        }
      };
    }
    
    return null;
  }  // Helper method to parse navigator items from dash syntax
  private parseNavigatorItem(itemText: string): any {
    // Remove initial "- " and trim
    const content = itemText.replace(/^(?:\r\n|\r|\n|\s)*-\s+/, '').trim();
    
    // Pattern: [label]{icon}(action) - all optional
    const match = content.match(/^\[([^\]]+)\]\{([^}]+)\}(?:\(([^)]+)\))?/);
    
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
    
    // Fallback for simple text items
    return {
      type: "NavItem",
      props: {
        label: content,
        icon: '',
        action: ''
      }
    };
  }

  // Helper method to parse drawer items from dash syntax
  private parseDrawerItem(itemText: string): any {
    // Remove initial "- " and trim
    const content = itemText.replace(/^(?:\r\n|\r|\n|\s)*-\s+/, '').trim();
    
    // Pattern: [label]{icon}(action) - all optional
    const match = content.match(/^\[([^\]]+)\]\{([^}]+)\}(?:\(([^)]+)\))?/);
    
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
    
    // Fallback for simple text items
    return {
      type: "DrawerItem",
      props: {
        label: content,
        icon: '',
        action: ''
      }
    };
  }  componentInstanceElement(ctx: Context) {
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

