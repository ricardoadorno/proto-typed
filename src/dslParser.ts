import {
  createToken,
  Lexer,
  CstParser,
  CstNode,
} from "chevrotain";

// Tokens
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
const Screen = createToken({ name: "Screen", pattern: /@?screen/ });
const Input = createToken({ name: "Input", pattern: /___/ });
const Button = createToken({ name: "Button", pattern: /button/ });
const Grid = createToken({ name: "Grid", pattern: /grid/ });
const Row = createToken({ name: "Row", pattern: /row/ });
const Column = createToken({ name: "Column", pattern: /col/ });
const Card = createToken({ name: "Card", pattern: /card/ });
const Separator = createToken({ name: "Separator", pattern: /---/ });
const BlankLine = createToken({ name: "BlankLine", pattern: /\r?\n\s*\r?\n/ });
const Equals = createToken({ name: "Equals", pattern: /=/ });
const Colon = createToken({ name: "Colon", pattern: /:/ });
const Link = createToken({
  name: "Link",
  pattern: /(?:\r\n|\r|\n|\s)*(?:\[([^\]]+)\]\(([^)]+)\)|link\s+\[\"([^\"]*)\"\]\s+([^\n\r]+))/
});
const Image = createToken({ name: "Image", pattern: /image\s+\[\"([^\"]*)\"\]\s+([^\n\r]+)/ });
const Identifier = createToken({ name: "Identifier", pattern: /[a-zA-Z_][a-zA-Z0-9_]*/ });
const StringLiteral = createToken({ name: "StringLiteral", pattern: /"[^"]*"/ });

// List tokens
const OrderedListItem = createToken({
  name: "OrderedListItem",
  pattern: /(?:\r\n|\r|\n|\s)*\d+\.\s+([^\n\r]+)/
});
const UnorderedListItem = createToken({
  name: "UnorderedListItem",
  pattern: /(?:\r\n|\r|\n|\s)*-\s+([^\n\r]+)/
});

const RadioOption = createToken({
  name: "RadioOption",
  pattern: /(?:\r\n|\r|\n|\s)*\([xX ]?\)\s+([^\n\r]+)/
});

const CheckboxOption = createToken({
  name: "CheckboxOption",
  pattern: /(?:\r\n|\r|\n|\s)*\[([xX ])?]\s+([^\n\r]+)/
});

// Define heading patterns that include the content
const Heading1 = createToken({
  name: "Heading1",
  pattern: /(?:\r\n|\r|\n|\s)*#(?!#)\s+([^\n\r#\[\]"=:]+)/
});
const Heading2 = createToken({
  name: "Heading2",
  pattern: /(?:\r\n|\r|\n|\s)*##(?!#)\s+([^\n\r#\[\]"=:]+)/
});
const Heading3 = createToken({
  name: "Heading3",
  pattern: /(?:\r\n|\r|\n|\s)*###(?!#)\s+([^\n\r#\[\]"=:]+)/
});
const Heading4 = createToken({
  name: "Heading4",
  pattern: /(?:\r\n|\r|\n|\s)*####(?!#)\s+([^\n\r#\[\]"=:]+)/
});
const Heading5 = createToken({
  name: "Heading5",
  pattern: /(?:\r\n|\r|\n|\s)*#####(?!#)\s+([^\n\r#\[\]"=:]+)/
});
const Heading6 = createToken({
  name: "Heading6",
  pattern: /(?:\r\n|\r|\n|\s)*######\s+([^\n\r#\[\]"=:]+)/
});

const SelectField = createToken({
  name: "SelectField",
  pattern: /(?:\r\n|\r|\n|\s)*<\[([^\]]+)\]>(?:\r\n|\r|\n|\s)*/
});

const Text = createToken({
  name: "Text",
  pattern: /(?:\r\n|\r|\n|\s)*text\s+([^\n\r]+)/
});
const Note = createToken({
  name: "Note",
  pattern: /(?:\r\n|\r|\n|\s)*note\s+([^\n\r]+)/
});
const Quote = createToken({
  name: "Quote",
  pattern: /(?:\r\n|\r|\n|\s)*quote\s+([^\n\r]+)/
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
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
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
    this.OR([
      { ALT: () => this.CONSUME(Heading1) },
      { ALT: () => this.CONSUME(Heading2) },
      { ALT: () => this.CONSUME(Heading3) },
      { ALT: () => this.CONSUME(Heading4) },
      { ALT: () => this.CONSUME(Heading5) },
      { ALT: () => this.CONSUME(Heading6) },
    ]);
  });

  linkElement = this.RULE("linkElement", () => {
    this.CONSUME(Link);
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

  buttonElement = this.RULE("buttonElement", () => {
    this.CONSUME(Button);
    this.CONSUME(StringLiteral, { LABEL: "text" });
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
