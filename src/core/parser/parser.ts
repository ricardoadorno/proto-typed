import { CstParser } from "chevrotain";
import { 
  allTokens, Screen, Identifier, Colon, Button, BlankLine, 
  Row, StringLiteral, Column, Card, Separator, Heading, Link, 
  Image, Input, OrderedListItem, UnorderedListItem, RadioOption, 
  CheckboxOption, Checkbox, Text, Note, Quote, SelectField, Equals
} from "../lexer/tokens";

// Parser class that defines the grammar rules
export class UiDslParser extends CstParser {
  constructor() {
    super(allTokens, {
      nodeLocationTracking: "full",
    });
    this.performSelfAnalysis();
  }

  // Root rule
  screen = this.RULE("screen", () => {
    this.CONSUME(Screen);
    this.CONSUME(Identifier, { LABEL: "name" });
    this.CONSUME(Colon);
    this.MANY(() => {
      this.SUBRULE(this.element);
    });
  }); 
  
  element = this.RULE("element", () => {
    this.OR([
      { ALT: () => this.SUBRULE(this.inputElement) },
      { ALT: () => this.SUBRULE(this.buttonElement) },
      { ALT: () => this.SUBRULE(this.rowElement) },
      { ALT: () => this.SUBRULE(this.columnElement) },
      { ALT: () => this.SUBRULE(this.cardElement) },
      { ALT: () => this.SUBRULE(this.separatorElement) },
      { ALT: () => this.SUBRULE(this.headingElement) },
      { ALT: () => this.SUBRULE(this.textElement) },
      { ALT: () => this.SUBRULE(this.linkElement) },
      { ALT: () => this.SUBRULE(this.imageElement) },
      { ALT: () => this.SUBRULE(this.orderedListElement) },
      { ALT: () => this.SUBRULE(this.unorderedListElement) },
      { ALT: () => this.SUBRULE(this.radioButtonGroup) },
      { ALT: () => this.SUBRULE(this.checkboxGroup) },
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
    this.MANY(() => {
      this.SUBRULE(this.attribute);
    });
  });

  attribute = this.RULE("attribute", () => {
    this.CONSUME(Identifier, { LABEL: "name" });
    this.CONSUME(Equals);
    this.OR([
      { ALT: () => this.CONSUME(StringLiteral, { LABEL: "value" }) },
      { ALT: () => this.CONSUME2(Identifier, { LABEL: "value" }) },
    ]);
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

  checkboxGroup = this.RULE("checkboxGroup", () => {
    this.AT_LEAST_ONE(() => {
      this.CONSUME(CheckboxOption);
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

  rowElement = this.RULE("rowElement", () => {
    this.CONSUME(Row);
    this.MANY(() => {
      this.SUBRULE(this.element);
    });
    this.OPTION2(() => {
      this.CONSUME2(BlankLine);
    });
  });

  columnElement = this.RULE("columnElement", () => {
    this.CONSUME(Column);
    this.MANY(() => {
      this.SUBRULE(this.element);
    });
    this.OPTION2(() => {
      this.CONSUME2(BlankLine);
    });
  });

  cardElement = this.RULE("cardElement", () => {
    this.CONSUME(Card);
    this.MANY(() => {
      this.SUBRULE(this.element);
    });
    this.OPTION(() => {
      this.CONSUME(BlankLine);
    });
  });

}

// Create a singleton instance of the parser
export const parser = new UiDslParser();