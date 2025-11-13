import { CstParser } from "chevrotain";
import { 
  allTokens,
  // Core
  Identifier, Colon,
  // Views  
  Screen, Modal, Drawer,
  // Primitives - Buttons
  ButtonPrimary, ButtonSecondary, ButtonOutline, ButtonGhost, ButtonDestructive,
  ButtonLink, ButtonSuccess, ButtonWarning, ButtonMarker,
  ButtonSizeXs, ButtonSizeSm, ButtonSizeMd, ButtonSizeLg,
  ButtonLabel, ButtonAction,
  // Primitives - Other
  Link, Image, Heading, Text, Paragraph, MutedText, Note, Quote,
  // Canonical Layouts
  ContainerNarrow, ContainerWide, ContainerFull, Container,
  Stack, StackTight, StackLoose, StackFlush,
  RowStart, RowCenter, RowBetween, RowEnd,
  Col,
  Grid2, Grid3, Grid4, GridAuto,
  Card, CardCompact, CardFeature,
  Header, Sidebar,
  // Structures
  List, Navigator, UnorderedListItem, Fab, Separator,
  // Inputs
  Input,
  RadioOption, Checkbox,
  // Components
  Component, ComponentInstance,
  // Styles
  Styles, CssProperty
} from "../lexer/tokens";
import { Indent, Outdent } from "../lexer/lexer";

// Parser class that defines the grammar rules
export class UiDslParser extends CstParser {
  constructor() {
    super([Indent, Outdent, ...allTokens], {
      nodeLocationTracking: "full",
      // Enable automatic error recovery - parser will try to continue after errors
      recoveryEnabled: true,
      // Maximum lookahead for better error recovery (default is 4)
      maxLookahead: 3,
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
    this.consumeIndentedElements();
  });

  // ===== COMPONENT RULES =====

  // Component declaration rule
  component = this.RULE("component", () => {
    this.CONSUME(Component);
    this.CONSUME(Identifier, { LABEL: "name" });
    this.CONSUME(Colon);
    this.consumeIndentedElements();
  });

  // Component instance rule for $ComponentName with optional props
  componentInstanceElement = this.RULE("componentInstanceElement", () => {
    this.CONSUME(ComponentInstance);
    
    // Optional: : followed by inline props or indented list
    this.OPTION(() => {
      this.CONSUME(Colon);
      // Either consume rest of line as identifier (inline props) OR indented list
      this.OR([
        // Inline props: $Foo: bar | zir
        { ALT: () => this.CONSUME(Identifier, { LABEL: "inlineProps" }) },
        // Indented list: $Foo:\n  - bar\n  - zir
        { ALT: () => {
          this.OPTION2(() => {
            this.CONSUME(Indent);
            this.AT_LEAST_ONE(() => {
              this.CONSUME(UnorderedListItem);
            });
            this.OPTION3(() => {
              this.CONSUME(Outdent);
            });
          });
        }}
      ]);
    });
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
      // Structures (before layouts for proper precedence)
      { ALT: () => this.SUBRULE(this.listElement) },
      // Canonical Layouts
      { ALT: () => this.SUBRULE(this.layoutElement) },
      // Other Structures
      { ALT: () => this.SUBRULE(this.navigatorElement) },
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
    // Parse button variant (or default marker)
    this.OR([
      { ALT: () => this.CONSUME(ButtonPrimary) },
      { ALT: () => this.CONSUME(ButtonSecondary) },
      { ALT: () => this.CONSUME(ButtonOutline) },
      { ALT: () => this.CONSUME(ButtonGhost) },
      { ALT: () => this.CONSUME(ButtonDestructive) },
      { ALT: () => this.CONSUME(ButtonLink) },
      { ALT: () => this.CONSUME(ButtonSuccess) },
      { ALT: () => this.CONSUME(ButtonWarning) },
      { ALT: () => this.CONSUME(ButtonMarker) } // Default: primary
    ]);
    
    // Parse optional size
    this.OPTION(() => {
      this.OR2([
        { ALT: () => this.CONSUME(ButtonSizeXs) },
        { ALT: () => this.CONSUME(ButtonSizeSm) },
        { ALT: () => this.CONSUME(ButtonSizeMd) },
        { ALT: () => this.CONSUME(ButtonSizeLg) }
      ]);
    });
    
    // Parse required label
    this.CONSUME(ButtonLabel);
    
    // Parse optional action
    this.OPTION2(() => {
      this.CONSUME(ButtonAction);
    });
  });

  linkElement = this.RULE("linkElement", () => {
    this.CONSUME(Link);
  });

  imageElement = this.RULE("imageElement", () => {
    this.CONSUME(Image);
  });

  // ===== LAYOUT ELEMENT RULES =====

  layoutElement = this.RULE("layoutElement", () => {
    this.OR([
      // Containers
      { ALT: () => this.CONSUME(ContainerNarrow) },
      { ALT: () => this.CONSUME(ContainerWide) },
      { ALT: () => this.CONSUME(ContainerFull) },
      { ALT: () => this.CONSUME(Container) },
      // Stacks
      { ALT: () => this.CONSUME(StackTight) },
      { ALT: () => this.CONSUME(StackLoose) },
      { ALT: () => this.CONSUME(Stack) },
      { ALT: () => this.CONSUME(StackFlush) },
      // Rows
      { ALT: () => this.CONSUME(RowStart) },
      { ALT: () => this.CONSUME(RowCenter) },
      { ALT: () => this.CONSUME(RowBetween) },
      { ALT: () => this.CONSUME(RowEnd) },
      { ALT: () => this.CONSUME(Col) },
      // Grids
      { ALT: () => this.CONSUME(Grid2) },
      { ALT: () => this.CONSUME(Grid3) },
      { ALT: () => this.CONSUME(Grid4) },
      { ALT: () => this.CONSUME(GridAuto) },
      // Cards
      { ALT: () => this.CONSUME(CardCompact) },
      { ALT: () => this.CONSUME(CardFeature) },
      { ALT: () => this.CONSUME(Card) },
      // Special
      { ALT: () => this.CONSUME(Header) },
      { ALT: () => this.CONSUME(Sidebar) },
    ]);
    this.containerWithOptionalContent();
  });

  // ===== STRUCTURE ELEMENT RULES =====

  // List with component template: list $ComponentName:
  listElement = this.RULE("listElement", () => {
    this.CONSUME(List);
    this.CONSUME(ComponentInstance);
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
  });

  navigatorElement = this.RULE("navigatorElement", () => {
    this.CONSUME(Navigator);
    this.listWithOptionalContent();
  });

  fabElement = this.RULE("fabElement", () => {
    this.CONSUME(Fab);
    this.listWithOptionalContent();
  });

  // Standalone list element rules for individual list items
  unorderedListElement = this.RULE("unorderedListElement", () => {
    this.CONSUME(UnorderedListItem);
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