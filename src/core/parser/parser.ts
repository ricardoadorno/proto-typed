import { CstParser } from "chevrotain";
import { 
  allTokens,
  // Core
  Identifier, Colon,
  // Views  
  Screen, Modal, Drawer,
  // Primitives
  Button, Link, Image, Heading, Text, Paragraph, MutedText, Note, Quote,
  // Layouts
  Row, Col, Grid, Container,
  // Structures
  List, Card, Header, Navigator, OrderedListItem, UnorderedListItem, FAB, Separator,
  // Inputs
  Input, RadioOption, Checkbox,
  // Components
  Component, ComponentInstance, ComponentInstanceWithProps,
  // Styles
  Styles, CssProperty
} from "../lexer/tokens";
import { Indent, Outdent } from "../lexer/lexer";

// Parser class that defines the grammar rules
export class UiDslParser extends CstParser {
  constructor() {
    super([Indent, Outdent, ...allTokens], {
      nodeLocationTracking: "full",
    });
    this.performSelfAnalysis();
  }

  // ===== CORE PROGRAM RULES =====
  
  // Top-level rule that can parse multiple screens, components, modals, drawers, and styles
  program = this.RULE("program", () => {
    this.MANY(() => {
      this.OR([
        { ALT: () => this.SUBRULE(this.styles) },
        { ALT: () => this.SUBRULE(this.screen) },
        { ALT: () => this.SUBRULE(this.component) },
        { ALT: () => this.SUBRULE(this.modal) },
        { ALT: () => this.SUBRULE(this.drawer) }
      ]);
    });
    // Consume any remaining indent/outdent tokens at the end
    this.MANY2(() => {
      this.OR2([
        { ALT: () => this.CONSUME(Indent) },
        { ALT: () => this.CONSUME(Outdent) }
      ]);
    });
  });

  // ===== HELPER METHODS =====

  // Helper method for consuming indent/outdent and elements
  private consumeIndentedElements() {
    this.MANY(() => {
      this.OR([
        { ALT: () => this.CONSUME(Indent) },
        { ALT: () => this.CONSUME(Outdent) },
        { ALT: () => this.SUBRULE(this.element) }
      ]);
    });
  }

  // Helper method for consuming indent/outdent and list items
  private consumeIndentedListItems() {
    this.MANY(() => {
      this.OR([
        { ALT: () => this.CONSUME(Indent) },
        { ALT: () => this.CONSUME(Outdent) },
        { ALT: () => this.CONSUME(UnorderedListItem) }
      ]);
    });
  }

  // Helper method for container-like elements with optional content
  private containerWithOptionalContent() {
    this.OPTION(() => {
      this.CONSUME(Colon);
      this.OPTION2(() => {
        this.CONSUME(Indent);
        this.AT_LEAST_ONE(() => {
          this.SUBRULE(this.element);
        });
        this.OPTION3(() => {
          this.CONSUME(Outdent);
        });
      });
    });
  }

  // Helper method for list-like elements with optional content
  private listWithOptionalContent() {
    this.OPTION(() => {
      this.CONSUME(Colon);
      this.OPTION2(() => {
        this.CONSUME(Indent);
        this.AT_LEAST_ONE(() => {
          this.CONSUME(UnorderedListItem);
        });
        this.OPTION3(() => {
          this.CONSUME(Outdent);
        });
      });
    });
  }

  // ===== STYLES RULES =====
  
  // Styles configuration rule
  styles = this.RULE("styles", () => {
    this.CONSUME(Styles);
    this.CONSUME(Colon);
    this.MANY(() => {
      this.OR([
        { ALT: () => this.CONSUME(Indent) },
        { ALT: () => this.CONSUME(Outdent) },
        { ALT: () => this.SUBRULE(this.styleDeclaration) }
      ]);
    });
  });

  // Style declaration rule for custom properties only
  styleDeclaration = this.RULE("styleDeclaration", () => {
    this.CONSUME(CssProperty);
  });

  // ===== VIEW CONTAINER RULES =====

  // Root rule for a single screen
  screen = this.RULE("screen", () => {
    this.CONSUME(Screen);
    this.CONSUME(Identifier, { LABEL: "name" });
    this.CONSUME(Colon);
    this.consumeIndentedElements();
  });

  // Global modal declaration rule
  modal = this.RULE("modal", () => {
    this.CONSUME(Modal);
    this.CONSUME(Identifier, { LABEL: "name" });
    this.CONSUME(Colon);
    this.consumeIndentedElements();
  });

  // Global drawer declaration rule
  drawer = this.RULE("drawer", () => {
    this.CONSUME(Drawer);
    this.CONSUME(Identifier, { LABEL: "name" });
    this.CONSUME(Colon);
    this.consumeIndentedListItems();
  });

  // ===== COMPONENT RULES =====

  // Component declaration rule
  component = this.RULE("component", () => {
    this.CONSUME(Component);
    this.CONSUME(Identifier, { LABEL: "name" });
    this.CONSUME(Colon);
    this.consumeIndentedElements();
  });

  // Component instance rule for $ComponentName or $ComponentName: prop1 | prop2
  componentInstanceElement = this.RULE("componentInstanceElement", () => {
    this.OR([
      { ALT: () => this.CONSUME(ComponentInstanceWithProps) },
      { ALT: () => this.CONSUME(ComponentInstance) }
    ]);
  });

  // ===== MAIN ELEMENT DISPATCHER =====

  element = this.RULE("element", () => {
    this.OR([
      // Components
      { ALT: () => this.SUBRULE(this.componentInstanceElement) },
      // Primitives
      { ALT: () => this.SUBRULE(this.buttonElement) },
      { ALT: () => this.SUBRULE(this.linkElement) },
      { ALT: () => this.SUBRULE(this.imageElement) },
      { ALT: () => this.SUBRULE(this.headingElement) },
      { ALT: () => this.SUBRULE(this.textElement) },
      // Layouts
      { ALT: () => this.SUBRULE(this.rowElement) },
      { ALT: () => this.SUBRULE(this.columnElement) },
      { ALT: () => this.SUBRULE(this.gridElement) },
      { ALT: () => this.SUBRULE(this.containerElement) },
      // Structures
      { ALT: () => this.SUBRULE(this.listElement) },
      { ALT: () => this.SUBRULE(this.cardElement) },
      { ALT: () => this.SUBRULE(this.headerElement) },
      { ALT: () => this.SUBRULE(this.navigatorElement) },
      { ALT: () => this.SUBRULE(this.orderedListElement) },
      { ALT: () => this.SUBRULE(this.unorderedListElement) },
      { ALT: () => this.SUBRULE(this.fabElement) },
      { ALT: () => this.SUBRULE(this.separatorElement) },
      // Inputs
      { ALT: () => this.SUBRULE(this.inputElement) },
      { ALT: () => this.SUBRULE(this.radioButtonGroup) },
      { ALT: () => this.SUBRULE(this.checkboxElement) },
    ]);
  });

  // ===== PRIMITIVE ELEMENT RULES =====
  
  headingElement = this.RULE("headingElement", () => {
    this.CONSUME(Heading);
  });

  textElement = this.RULE("textElement", () => {
    this.OR([
      { ALT: () => this.CONSUME(Text) },
      { ALT: () => this.CONSUME(Paragraph) },
      { ALT: () => this.CONSUME(MutedText) },
      { ALT: () => this.CONSUME(Note) },
      { ALT: () => this.CONSUME(Quote) }
    ]);
  });

  buttonElement = this.RULE("buttonElement", () => {
    this.CONSUME(Button);
  });

  linkElement = this.RULE("linkElement", () => {
    this.CONSUME(Link);
  });

  imageElement = this.RULE("imageElement", () => {
    this.CONSUME(Image);
  });

  // ===== LAYOUT ELEMENT RULES =====

  rowElement = this.RULE("rowElement", () => {
    this.CONSUME(Row);
    this.containerWithOptionalContent();
  });

  columnElement = this.RULE("columnElement", () => {
    this.CONSUME(Col);
    this.containerWithOptionalContent();
  });

  gridElement = this.RULE("gridElement", () => {
    this.CONSUME(Grid);
    this.containerWithOptionalContent();
  });

  containerElement = this.RULE("containerElement", () => {
    this.CONSUME(Container);
    this.containerWithOptionalContent();
  });

  // ===== STRUCTURE ELEMENT RULES =====

  cardElement = this.RULE("cardElement", () => {
    this.CONSUME(Card);
    this.CONSUME(Colon);
    this.OPTION(() => {
      this.CONSUME(Indent);
      this.AT_LEAST_ONE(() => {
        this.SUBRULE(this.element);
      });
      this.OPTION2(() => {
        this.CONSUME(Outdent);
      });
    });
  });

  headerElement = this.RULE("headerElement", () => {
    this.CONSUME(Header);
    this.CONSUME(Colon);
    this.OPTION(() => {
      this.CONSUME(Indent);
      this.AT_LEAST_ONE(() => {
        this.SUBRULE(this.element);
      });
      this.OPTION2(() => {
        this.CONSUME(Outdent);
      });
    });
  });

  navigatorElement = this.RULE("navigatorElement", () => {
    this.CONSUME(Navigator);
    this.listWithOptionalContent();
  });

  listElement = this.RULE("listElement", () => {
    this.CONSUME(List);
    // Check if there's a component name after 'list'
    this.OPTION(() => {
      this.CONSUME(ComponentInstanceWithProps, { LABEL: "componentName" });
    });
    this.OPTION2(() => {
      this.CONSUME(Colon);
    });
    this.OPTION3(() => {
      this.CONSUME(Indent);
      this.AT_LEAST_ONE(() => {
        this.CONSUME(UnorderedListItem);
      });
      this.OPTION4(() => {
        this.CONSUME(Outdent);
      });
    });
  });

  // Standalone list element rules for individual list items
  orderedListElement = this.RULE("orderedListElement", () => {
    this.CONSUME(OrderedListItem);
  });

  unorderedListElement = this.RULE("unorderedListElement", () => {
    this.CONSUME(UnorderedListItem);
  });

  fabElement = this.RULE("fabElement", () => {
    this.CONSUME(FAB);
  });

  separatorElement = this.RULE("separatorElement", () => {
    this.CONSUME(Separator);
  });

  // ===== INPUT ELEMENT RULES =====

  inputElement = this.RULE("inputElement", () => {
    this.CONSUME(Input);
  });

  radioButtonGroup = this.RULE("radioButtonGroup", () => {
    this.AT_LEAST_ONE(() => {
      this.CONSUME(RadioOption);
    });
  });

  checkboxElement = this.RULE("checkboxElement", () => {
    this.CONSUME(Checkbox);
  });
}

// Create a singleton instance of the parser
export const parser = new UiDslParser();