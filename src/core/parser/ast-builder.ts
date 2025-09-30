import { type CstNode } from "chevrotain";
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

  /**
   * Parse layout modifiers from token image like "col-w50-center-stretch-p4"
   * Returns structured modifiers object for CSS generation
   */
  private parseLayoutModifiers(tokenImage: string) {
    const modifiers: any = {};
    
    // Extract modifiers from token image (e.g., "col-w50-center-stretch-p4")
    const parts = tokenImage.split('-');
    const modifierParts = parts.slice(1); // ['w50', 'center', 'stretch', 'p4']
    
    let justifyIndex = 0;
    let alignIndex = 0;
    
    for (const modifier of modifierParts) {
      // Sizing modifiers
      if (modifier.match(/^w(\d+|full|auto)$/)) {
        modifiers.width = modifier.substring(1);
      } else if (modifier.match(/^h(\d+|full|auto)$/)) {
        modifiers.height = modifier.substring(1);
      }
      // Justify content (flex main axis)
      else if (['start', 'end', 'center', 'between', 'around', 'evenly'].includes(modifier)) {
        if (justifyIndex === 0) {
          modifiers.justify = modifier;
          justifyIndex++;
        } else if (alignIndex === 0) {
          modifiers.align = modifier;
          alignIndex++;
        }
      }
      // Align items (flex cross axis) - specific to align
      else if (['stretch', 'baseline'].includes(modifier)) {
        modifiers.align = modifier;
        alignIndex++;
      }
      // Spacing modifiers
      else if (modifier.match(/^p(\d+)$/)) {
        modifiers.padding = modifier.substring(1);
      } else if (modifier.match(/^m(\d+)$/)) {
        modifiers.margin = modifier.substring(1);
      } else if (modifier.match(/^px(\d+)$/)) {
        modifiers.paddingX = modifier.substring(2);
      } else if (modifier.match(/^py(\d+)$/)) {
        modifiers.paddingY = modifier.substring(2);
      } else if (modifier.match(/^pl(\d+)$/)) {
        modifiers.paddingLeft = modifier.substring(2);
      } else if (modifier.match(/^pr(\d+)$/)) {
        modifiers.paddingRight = modifier.substring(2);
      } else if (modifier.match(/^pt(\d+)$/)) {
        modifiers.paddingTop = modifier.substring(2);
      } else if (modifier.match(/^pb(\d+)$/)) {
        modifiers.paddingBottom = modifier.substring(2);
      } else if (modifier.match(/^mx(\d+)$/)) {
        modifiers.marginX = modifier.substring(2);
      } else if (modifier.match(/^my(\d+)$/)) {
        modifiers.marginY = modifier.substring(2);
      } else if (modifier.match(/^ml(\d+)$/)) {
        modifiers.marginLeft = modifier.substring(2);
      } else if (modifier.match(/^mr(\d+)$/)) {
        modifiers.marginRight = modifier.substring(2);
      } else if (modifier.match(/^mt(\d+)$/)) {
        modifiers.marginTop = modifier.substring(2);
      } else if (modifier.match(/^mb(\d+)$/)) {
        modifiers.marginBottom = modifier.substring(2);
      }
      // Gap modifier
      else if (modifier.match(/^gap(\d+)$/)) {
        modifiers.gap = modifier.substring(3);
      }
      // Grid columns modifier
      else if (modifier.match(/^cols(\d+)$/)) {
        modifiers.gridCols = modifier.substring(4);
      }
    }
    
    return modifiers;
  }  /**
   * Parse and process the entire program, including global elements (screens, components, modals, drawers)
   * @param ctx - The parsing context containing all top-level elements
   * @returns Array of all processed global elements
   */
  program(ctx: Context) {
    // Process multiple screens, components, modals, and drawers as global elements
    const screens = ctx.screen ? ctx.screen.map((screen: CstNode) => this.visit(screen)) : [];
    const components = ctx.component ? ctx.component.map((component: CstNode) => this.visit(component)) : [];
    const modals = ctx.modal ? ctx.modal.map((modal: CstNode) => this.visit(modal)) : [];
    const drawers = ctx.drawer ? ctx.drawer.map((drawer: CstNode) => this.visit(drawer)) : [];
    
    return [...screens, ...components, ...modals, ...drawers];
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
    if (ctx.inputElement) return this.visit(ctx.inputElement);
    if (ctx.buttonElement) return this.visit(ctx.buttonElement);
    if (ctx.rowElement) return this.visit(ctx.rowElement);
    if (ctx.columnElement) return this.visit(ctx.columnElement);
  if (ctx.gridElement) return this.visit(ctx.gridElement);
  if (ctx.containerElement) return this.visit(ctx.containerElement);
    if (ctx.listElement) return this.visit(ctx.listElement);
    if (ctx.cardElement) return this.visit(ctx.cardElement);
    if (ctx.headerElement) return this.visit(ctx.headerElement);    if (ctx.navigatorElement) return this.visit(ctx.navigatorElement);
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
    
    // Extract modifiers from the Row token
    const rowToken = ctx.Row[0];
    const modifiers = this.parseLayoutModifiers(rowToken.image);

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
      modifiers,
      elements
    };
  }  
  
  columnElement(ctx: Context) {
    const elements = [];
    
    // Extract modifiers from the Col token
    const colToken = ctx.Col[0];
    const modifiers = this.parseLayoutModifiers(colToken.image);

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
      modifiers,
      elements
    };
  }  

  containerElement(ctx: Context) {
    const elements = [];
    
    // Extract modifiers from the Container token
    const containerToken = ctx.Container[0];
    const modifiers = this.parseLayoutModifiers(containerToken.image);

    if (ctx.element && ctx.element.length > 0) {
      for (const el of ctx.element) {
        const elementAst = this.visit(el);
        if (elementAst) {
          elements.push(elementAst);
        }
      }
    }

    return {
      type: "Container",
      modifiers,
      elements
    };
  }

  gridElement(ctx: Context) {
    const elements = [];
    
    // Extract modifiers from the Grid token
    const gridToken = ctx.Grid[0];
    const modifiers = this.parseLayoutModifiers(gridToken.image);

    if (ctx.element && ctx.element.length > 0) {
      for (const el of ctx.element) {
        const elementAst = this.visit(el);
        if (elementAst) {
          elements.push(elementAst);
        }
      }
    }

    return {
      type: "Grid",
      modifiers,
      elements
    };
  }
  listElement(ctx: Context) {
    // Check if there's a component name (list $ComponentName:)
    const hasComponent = ctx.componentName && ctx.componentName.length > 0;
    
    if (hasComponent) {
      // List with component template
      const token = ctx.componentName[0];
      // Match ComponentInstanceWithProps pattern: $ComponentName: (ignore props part)
      const match = token.image.match(/\$([a-zA-Z_][a-zA-Z0-9_]*)/);
      const componentName = match ? match[1] : '';

      const dataItems: string[][] = [];

      // Handle data items (simple unordered list items with pipe-separated values)
      if (ctx.UnorderedListItem) {
        ctx.UnorderedListItem.forEach((item: any) => {
          const itemText = item.image;
          // Extract text after the dash and space: "- text" -> "text"
          const match = itemText.match(/-\s+(.+)/);
          if (match) {
            const text = match[1].trim();
            // Split by | and clean up props
            const props = text.split('|').map((prop: string) => prop.trim()).filter((prop: string) => prop.length > 0);
            dataItems.push(props);
          }
        });
      }

      return {
        type: "List",
        props: {
          componentName: componentName,
          dataItems: dataItems
        }
      };
    } else {
      // Regular list
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

      return {
        type: "List",
        elements: items
      };
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
  }  /**
   * Process global drawer element declaration
   * Drawers are globally accessible singleton elements that can be referenced by name
   * @param ctx - The parsing context containing drawer name and navigation items
   * @returns Drawer AST node with global accessibility
   */
  drawer(ctx: Context) {
    const name = ctx.name[0].image;
    const items: any[] = [];

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
    // Handle component instance with props: $ComponentName: prop1 | prop2 | prop3
    if (ctx.ComponentInstanceWithProps && ctx.ComponentInstanceWithProps.length > 0) {
      const token = ctx.ComponentInstanceWithProps[0];
      const match = token.image.match(/\$([a-zA-Z_][a-zA-Z0-9_]*)\s*:\s*(.+)/);
      if (match) {
        const componentName = match[1];
        const propsString = match[2].trim();
        
        // Split props by | and clean them up
        const props = propsString.split('|').map((prop: string) => prop.trim()).filter((prop: string) => prop.length > 0);
        
        return {
          type: "component_instance",
          name: componentName,
          props: props
        };
      }
    }
    
    // Handle simple component instance: $ComponentName
    if (ctx.ComponentInstance && ctx.ComponentInstance.length > 0) {
      const token = ctx.ComponentInstance[0];
      const match = token.image.match(/\$([a-zA-Z_][a-zA-Z0-9_]*)/);
      const componentName = match ? match[1] : '';

      return {
        type: "component_instance",
        name: componentName,
        props: []
      };
    }

    return null;
  }
  /**
   * Process global modal element declaration
   * Modals are globally accessible singleton elements that can be referenced by name
   * @param ctx - The parsing context containing modal name and elements
   * @returns Modal AST node with global accessibility
   */
  modal(ctx: Context) {
    const name = ctx.name[0].image;
    const elements = ctx.element ? ctx.element.map((el: CstNode) => this.visit(el)) : [];

    return {
      type: "modal",
      name,
      elements
    };
  }
}

