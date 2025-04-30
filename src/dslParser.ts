import {
  createToken,
  Lexer,
  CstParser,
  CstNode,
} from "chevrotain";

// Whitespace & Formatting Tokens
const WhiteSpace = createToken({
  name: "WhiteSpace",
  pattern: /[ \t]+/,
  group: Lexer.SKIPPED,
});
const NewLine = createToken({
  name: "NewLine",
  pattern: /\r\n|\r|\n/,
  group: Lexer.SKIPPED
});
const BlankLine = createToken({ name: "BlankLine", pattern: /\r?\n\s*\r?\n/ });

// Configuration & Structural Tokens
const Screen = createToken({ name: "Screen", pattern: /@?screen/ });
const Equals = createToken({ name: "Equals", pattern: /=/ });
const Colon = createToken({ name: "Colon", pattern: /:/ });
const Identifier = createToken({ name: "Identifier", pattern: /[a-zA-Z_][a-zA-Z0-9_]*/ });
const StringLiteral = createToken({ name: "StringLiteral", pattern: /"[^"]*"/ });

// Layout Family Tokens
const Grid = createToken({ name: "Grid", pattern: /grid/ });
const Row = createToken({ name: "Row", pattern: /row/ });
const Column = createToken({ name: "Column", pattern: /col/ });
const Card = createToken({ name: "Card", pattern: /card/ });
const Separator = createToken({ name: "Separator", pattern: /---/ });

// Input Family Tokens
const Input = createToken({ name: "Input", pattern: /__/ });
const RadioOption = createToken({
  name: "RadioOption",
  pattern: /(?:\r\n|\r|\n|\s)*\([xX ]?\)\s+([^\n\r]+)/
});
const CheckboxOption = createToken({
  name: "CheckboxOption",
  pattern: /(?:\r\n|\r|\n|\s)*\[([xX ])?]\s+([^\n\r]+)/
});
const SelectField = createToken({
  name: "SelectField",
  pattern: /(?:\r\n|\r|\n|\s)*<\[([^\]]+)\]>(?:\r\n|\r|\n|\s)*/
});

// Interactive Element Tokens
const Button = createToken({ name: "Button", pattern: /@\[([^\]]+)\]\(([^)]+)\)/ });
const Link = createToken({
  name: "Link",
  pattern: /\[([^\]]+)\]\(([^)]+)\)/
});
const Image = createToken({ name: "Image", pattern: /!\[([^\]]+)\]\(([^)]+)\)/ });

// Content Element Tokens
const Heading = createToken({
  name: "Heading",
  pattern: /(?:\r\n|\r|\n|\s)*#{1,6}(?!#)\s+([^\n\r#[\]"=:]+)/
});
const Text = createToken({
  name: "Text",
  pattern: /(?:\r\n|\r|\n|\s)*>\s+([^\n\r]+)/
});
const Note = createToken({
  name: "Note",
  pattern: /\*>\s+([^\n\r]+)/
});
const Quote = createToken({
  name: "Quote",
  pattern: /">\s+([^\n\r]+)/
});
const OrderedListItem = createToken({
  name: "OrderedListItem",
  pattern: /(?:\r\n|\r|\n|\s)*\d+\.\s+([^\n\r]+)/
});
const UnorderedListItem = createToken({
  name: "UnorderedListItem",
  pattern: /(?:\r\n|\r|\n|\s)*-\s+([^\n\r]+)/
});

const allTokens = [
  NewLine,
  WhiteSpace,
  Screen,
  Input,
  Button,
  Grid,
  Row,
  Column,
  Card,
  Separator,
  BlankLine,
  SelectField,
  Text,
  Note,
  Quote,
  Heading,
  Link,
  Image,
  Equals,
  Colon,
  StringLiteral,
  Identifier,
  OrderedListItem,
  UnorderedListItem,
  RadioOption,
  CheckboxOption,
];

const lexer = new Lexer(allTokens);

// Parser
class UiDslParser extends CstParser {
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
  }); element = this.RULE("element", () => {
    this.OR([
      { ALT: () => this.SUBRULE(this.inputElement) },
      { ALT: () => this.SUBRULE(this.buttonElement) },
      { ALT: () => this.SUBRULE(this.gridElement) },
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
  textElement = this.RULE("textElement", () => {
    this.OR([
      { ALT: () => this.CONSUME(Text) },
      { ALT: () => this.CONSUME(Note) },
      { ALT: () => this.CONSUME(Quote) }
    ]);
  });

  gridElement = this.RULE("gridElement", () => {
    this.CONSUME(Grid);
    this.MANY(() => {
      this.SUBRULE(this.element);
    });
    this.OPTION(() => {
      this.CONSUME(BlankLine);
    });
  });

  rowElement = this.RULE("rowElement", () => {
    this.CONSUME(Row);
    this.OPTION(() => {
      this.CONSUME(StringLiteral, { LABEL: "attributes" });
    });
    this.MANY(() => {
      this.SUBRULE(this.element);
    });
    this.OPTION2(() => {
      this.CONSUME2(BlankLine);
    });
  });

  columnElement = this.RULE("columnElement", () => {
    this.CONSUME(Column);
    this.OPTION(() => {
      this.CONSUME(StringLiteral, { LABEL: "attributes" });
    });
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

  separatorElement = this.RULE("separatorElement", () => {
    this.CONSUME(Separator);
  });
}

const parser = new UiDslParser();

export function parseInput(text: string): CstNode {
  const lexResult = lexer.tokenize(text);
  parser.input = lexResult.tokens;
  const cst = parser.screen();

  if (parser.errors.length > 0) {
    throw new Error("Parsing error: " + parser.errors[0].message);
  }

  return cst;
}

export { parser };
