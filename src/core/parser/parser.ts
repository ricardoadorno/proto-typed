import { CstParser } from "chevrotain";
import { 
  allTokens, Screen, Component, Modal, ComponentInstance, 
  Identifier, Colon, Button, 
  Row, Card, Separator, EmptyDiv, Heading, Link, 
  Image, Input, OrderedListItem, UnorderedListItem, AdvancedListItem, RadioOption, 
  Checkbox, Text, Note, Quote, Col, List,
  Header, Navigator, Drawer, FAB
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
  
  // Top-level rule that can parse multiple screens and components
  program = this.RULE("program", () => {
    this.MANY(() => {
      this.OR([
        { ALT: () => this.SUBRULE(this.screen) },
        { ALT: () => this.SUBRULE(this.component) }
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
  
  // Root rule for a single screen
  screen = this.RULE("screen", () => {
    this.CONSUME(Screen);
    this.CONSUME(Identifier, { LABEL: "name" });
    this.CONSUME(Colon);
    this.MANY(() => {
      this.OR([
        { ALT: () => this.CONSUME(Indent) },
        { ALT: () => this.CONSUME(Outdent) },
        { ALT: () => this.SUBRULE(this.element) }
      ]);
    });
  });

  // Component declaration rule
  component = this.RULE("component", () => {
    this.CONSUME(Component);
    this.CONSUME(Identifier, { LABEL: "name" });
    this.CONSUME(Colon);
    this.MANY(() => {
      this.OR([
        { ALT: () => this.CONSUME(Indent) },
        { ALT: () => this.CONSUME(Outdent) },
        { ALT: () => this.SUBRULE(this.element) }
      ]);
    });
  
  });    element = this.RULE("element", () => {
    this.OR([
      { ALT: () => this.SUBRULE(this.componentInstanceElement) },
      { ALT: () => this.SUBRULE(this.inputElement) },
      { ALT: () => this.SUBRULE(this.buttonElement) },
      { ALT: () => this.SUBRULE(this.rowElement) },
      { ALT: () => this.SUBRULE(this.columnElement) },
      { ALT: () => this.SUBRULE(this.listElement) },
      { ALT: () => this.SUBRULE(this.orderedListElement) },
      { ALT: () => this.SUBRULE(this.unorderedListElement) },
      { ALT: () => this.SUBRULE(this.cardElement) },
      { ALT: () => this.SUBRULE(this.modalElement) },
      { ALT: () => this.SUBRULE(this.headerElement) },
      { ALT: () => this.SUBRULE(this.navigatorElement) },
      { ALT: () => this.SUBRULE(this.drawerElement) },
      { ALT: () => this.SUBRULE(this.fabElement) },
      { ALT: () => this.SUBRULE(this.separatorElement) },
      { ALT: () => this.SUBRULE(this.emptyDivElement) },
      { ALT: () => this.SUBRULE(this.headingElement) },
      { ALT: () => this.SUBRULE(this.textElement) },
      { ALT: () => this.SUBRULE(this.linkElement) },
      { ALT: () => this.SUBRULE(this.imageElement) },
      { ALT: () => this.SUBRULE(this.radioButtonGroup) },
      { ALT: () => this.SUBRULE(this.checkboxElement) },
    ]);
  });
  
  // Element rules for different UI components
  headingElement = this.RULE("headingElement", () => {
    this.CONSUME(Heading);
  });

  linkElement = this.RULE("linkElement", () => {
    this.CONSUME(Link);
  });

  buttonElement = this.RULE("buttonElement", () => {
    this.CONSUME(Button);
  });

  imageElement = this.RULE("imageElement", () => {
    this.CONSUME(Image);
  });
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
  separatorElement = this.RULE("separatorElement", () => {
    this.CONSUME(Separator);
  });

  emptyDivElement = this.RULE("emptyDivElement", () => {
    this.CONSUME(EmptyDiv);
  });
  
  textElement = this.RULE("textElement", () => {
    this.OR([
      { ALT: () => this.CONSUME(Text) },
      { ALT: () => this.CONSUME(Note) },
      { ALT: () => this.CONSUME(Quote) }
    ]);
  });

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
  
  rowElement = this.RULE("rowElement", () => {
    this.CONSUME(Row);
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

  columnElement = this.RULE("columnElement", () => {
    this.CONSUME(Col);
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
  });    listElement = this.RULE("listElement", () => {
    this.CONSUME(List);
    this.CONSUME(Colon);
    this.OPTION(() => {
      this.CONSUME(Indent);
      this.AT_LEAST_ONE(() => {        this.OR([
          { ALT: () => this.CONSUME(AdvancedListItem) },
          { ALT: () => this.CONSUME(UnorderedListItem) }
        ]);
      });
      this.OPTION2(() => {
        this.CONSUME(Outdent);
      });
    });
  });

  // Standalone list element rules for individual list items
  orderedListElement = this.RULE("orderedListElement", () => {
    this.CONSUME(OrderedListItem);
  });

  unorderedListElement = this.RULE("unorderedListElement", () => {
    this.OR([
      { ALT: () => this.CONSUME(AdvancedListItem) },
      { ALT: () => this.CONSUME(UnorderedListItem) }
    ]);
  });

  // Mobile Layout Elements
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
  });  navigatorElement = this.RULE("navigatorElement", () => {
    this.CONSUME(Navigator);
    this.CONSUME(Colon);
    this.OPTION(() => {
      this.CONSUME(Indent);
      this.AT_LEAST_ONE(() => {
        this.OR([
          { ALT: () => this.CONSUME(AdvancedListItem) },
          { ALT: () => this.CONSUME(UnorderedListItem) }
        ]);
      });
      this.OPTION2(() => {
        this.CONSUME(Outdent);
      });
    });
  });
  drawerElement = this.RULE("drawerElement", () => {
    this.CONSUME(Drawer);
    this.CONSUME(Identifier, { LABEL: "name" });
    this.CONSUME(Colon);
    this.OPTION(() => {
      this.CONSUME(Indent);
      this.AT_LEAST_ONE(() => {
        this.OR([
          { ALT: () => this.CONSUME(AdvancedListItem) },
          { ALT: () => this.CONSUME(UnorderedListItem) }
        ]);
      });
      this.OPTION2(() => {
        this.CONSUME(Outdent);
      });
    });
  });
  fabElement = this.RULE("fabElement", () => {
    this.CONSUME(FAB);
  });
  // Component instance rule for $ComponentName
  componentInstanceElement = this.RULE("componentInstanceElement", () => {
    this.CONSUME(ComponentInstance);
  });

  // Modal element rule - container with identifier
  modalElement = this.RULE("modalElement", () => {
    this.CONSUME(Modal);
    this.CONSUME(Identifier, { LABEL: "name" });
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
}

// Create a singleton instance of the parser
export const parser = new UiDslParser();
