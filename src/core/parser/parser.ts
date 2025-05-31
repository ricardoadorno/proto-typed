import { CstParser } from "chevrotain";
import { 
  allTokens, Screen, Identifier, Colon, Button, 
  Row, Card, Separator, Heading, Link, 
  Image, Input, OrderedListItem, UnorderedListItem, ListItem, RadioOption, 
  Checkbox, Text, Note, Quote, SelectField, Col, List,
  Header, BottomNav, Drawer, NavItem, DrawerItem
} from "../lexer/tokens";
import { Indent, Outdent } from "../lexer/lexer";
import { CstNode } from "chevrotain";
import { tokenize } from "../lexer/lexer";

// Parser class that defines the grammar rules
export class UiDslParser extends CstParser {
  constructor() {
    super([Indent, Outdent, ...allTokens], {
      nodeLocationTracking: "full",
    });
    this.performSelfAnalysis();
  }  // Top-level rule that can parse multiple screens
  program = this.RULE("program", () => {
    this.MANY(() => {
      this.SUBRULE(this.screen);
    });
    // Consume any remaining indent/outdent tokens at the end
    this.MANY2(() => {
      this.OR([
        { ALT: () => this.CONSUME(Indent) },
        { ALT: () => this.CONSUME(Outdent) }
      ]);
    });
  });  // Root rule for a single screen
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
  });    element = this.RULE("element", () => {
    this.OR([
      { ALT: () => this.SUBRULE(this.inputElement) },
      { ALT: () => this.SUBRULE(this.buttonElement) },
      { ALT: () => this.SUBRULE(this.rowElement) },
      { ALT: () => this.SUBRULE(this.columnElement) },
      { ALT: () => this.SUBRULE(this.listElement) },
      { ALT: () => this.SUBRULE(this.cardElement) },
      { ALT: () => this.SUBRULE(this.headerElement) },
      { ALT: () => this.SUBRULE(this.bottomNavElement) },
      { ALT: () => this.SUBRULE(this.drawerElement) },
      { ALT: () => this.SUBRULE(this.navItemElement) },
      { ALT: () => this.SUBRULE(this.drawerItemElement) },
      { ALT: () => this.SUBRULE(this.separatorElement) },
      { ALT: () => this.SUBRULE(this.headingElement) },
      { ALT: () => this.SUBRULE(this.textElement) },
      { ALT: () => this.SUBRULE(this.linkElement) },
      { ALT: () => this.SUBRULE(this.imageElement) },
      { ALT: () => this.SUBRULE(this.orderedListElement) },
      { ALT: () => this.SUBRULE(this.unorderedListElement) },
      { ALT: () => this.SUBRULE(this.radioButtonGroup) },
      { ALT: () => this.SUBRULE(this.checkboxElement) },
      { ALT: () => this.SUBRULE(this.selectField) },
    ]);
  });
  
  selectField = this.RULE("selectField", () => {
    const options: { image: string; tokenType: { name: string } }[] = [];
    this.AT_LEAST_ONE(() => {
      const option = this.CONSUME(SelectField);
      options.push(option);
    });
    return options;
  });

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

  orderedListElement = this.RULE("orderedListElement", () => {
    this.AT_LEAST_ONE(() => {
      this.CONSUME(OrderedListItem);
    });
  });

  unorderedListElement = this.RULE("unorderedListElement", () => {
    this.AT_LEAST_ONE(() => {
      this.CONSUME(UnorderedListItem);
    });
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
  });  listElement = this.RULE("listElement", () => {
    this.CONSUME(List);
    this.CONSUME(Colon);
    this.OPTION(() => {
      this.CONSUME(Indent);
      this.AT_LEAST_ONE(() => {
        this.OR([
          { ALT: () => this.CONSUME(UnorderedListItem) },
          { ALT: () => this.CONSUME(ListItem) }
        ]);
      });
      this.OPTION2(() => {
        this.CONSUME(Outdent);
      });
    });
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
  });

  bottomNavElement = this.RULE("bottomNavElement", () => {
    this.CONSUME(BottomNav);
    this.CONSUME(Colon);
    this.OPTION(() => {
      this.CONSUME(Indent);
      this.AT_LEAST_ONE(() => {
        this.CONSUME(NavItem);
      });
      this.OPTION2(() => {
        this.CONSUME(Outdent);
      });
    });
  });
  drawerElement = this.RULE("drawerElement", () => {
    this.CONSUME(Drawer);
    this.CONSUME(Colon);
    this.OPTION(() => {
      this.CONSUME(Indent);
      this.AT_LEAST_ONE(() => {
        this.CONSUME(DrawerItem);
      });
      this.OPTION2(() => {
        this.CONSUME(Outdent);
      });
    });
  });

  navItemElement = this.RULE("navItemElement", () => {
    this.CONSUME(NavItem);
  });

  drawerItemElement = this.RULE("drawerItemElement", () => {
    this.CONSUME(DrawerItem);
  });

}

// Create a singleton instance of the parser
export const parser = new UiDslParser();

/**
 * Parse input text into a Concrete Syntax Tree (CST)
 * 
 * @param text The DSL text to parse
 * @returns The Concrete Syntax Tree representing the parsed input
 * @throws Error if parsing fails
 */
export function parseInput(text: string): CstNode {
  // First tokenize the text using the lexer
  const lexResult = tokenize(text);
  
  // Set the tokens as input to the parser
  parser.input = lexResult.tokens;
  
  // Parse the tokens according to the grammar rules
  const cst = parser.program();
  
  // If there are parsing errors, throw an error
  if (parser.errors.length > 0) {
    console.error('parser.errors', parser.errors); 
    throw new Error("Parsing error: " + parser.errors[0].message);
  }

  return cst;
}