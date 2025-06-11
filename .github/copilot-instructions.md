# GitHub Copilot Instructions for Proto-type

## Project Overview
This is a React-based UI prototyping tool that allows users to create interactive prototypes using a comprehensive, descriptive syntax. The application features a robust Domain Specific Language (DSL) with a complete lexer, parser, and renderer pipeline that supports optional elements, styling attributes, conditional rendering, and advanced layout management.

## Core Architecture

### Technology Stack
- **Frontend**: React 19 + TypeScript + Vite
- **Testing**: Currently no test suite implemented (Vitest + React Testing Library configured but no tests written)
- **Parsing**: Chevrotain (lexer & parser)
- **Code Editor**: Monaco Editor with custom syntax highlighting
- **State Management**: React Context for prototype state

### Project Structure
- `src/core/lexer/` - Tokenization and lexical analysis
- `src/core/parser/` - Grammar rules and AST building
- `src/core/renderer/` - HTML generation from AST
- `src/core/validator/` - DSL validation and type checking
- `src/core/themes/` - Theme system and CSS variable management
- `src/components/` - React UI components
- `src/examples/` - Sample DSL code examples
- `src/types/` - TypeScript type definitions
- `src/test/` - Comprehensive test suites
- `src/utils/` - Utility functions and helpers

## DSL Syntax Reference

### General Syntax Rules
- **Optional Elements**: Use `?` suffix for optional components: `@[Button]?(action)`
- **Container Elements**: Use `:` followed by indented children for nested content
- **Text Content**: Use specific prefixes like `>` for text, `#` for headings
- **Interactive Elements**: Use `@[text]` for buttons, `#[text]` for links, `![alt]` for images

### Screen Declaration
```
screen ScreenName:
  // Screen content
```

### Component Declaration
Components allow you to create reusable UI blocks that can be instantiated throughout your prototype:
```
component ComponentName:
  // Component content
  > This is reusable content
  @[Button]()
```

To use a declared component, reference it with the `$` prefix:
```
$ComponentName
```

### Modal and Drawer Elements
Named elements that can be toggled active/inactive through navigation:
```
modal ModalName:
  // Modal content
  > This is a modal dialog

drawer DrawerName:
  // Drawer content
  > This is a drawer panel
```

These elements can be activated by calling their names in navigation actions.

### Typography Elements
- `# Heading 1` to `###### Heading 6`
- `> Regular text`
- `*> Note text`
- `"> Quote text`

### Interactive Elements
- `@[Button Text]()`
- `#[Link Text]()`
- `![Alt Text](image-url)`
- `$ComponentName` - Component instantiation

### Component System
- `component ComponentName:` - Component declaration
- `$ComponentName` - Component instantiation/usage

### Named UI Elements  
- `modal ModalName:` - Modal declaration
- `drawer DrawerName:` - Drawer declaration

These named elements have special behavior - they are shown or hidden based on navigation. When a button references their name in its action parameter (e.g., `@[Open Modal]()`), they will be activated. Otherwise, they remain hidden/inactive by default.

### Advanced Form Elements
- `___:Label{Placeholder}`
- `___*:Label{Placeholder}` - Password fields
- `___-:Label{Placeholder}` - Disabled fields
- `___:Label{Placeholder}[Option1 | Option2]` - Select fields

### Checkbox and Radio Groups
- `[X] Label` - Checked checkboxes
- `[ ] Label` - Unchecked checkboxes
- `(X) Label` - Selected radio buttons
- `( ) Label` - Unselected radio buttons

### Layout Components
- `container:`
- `grid:`
- `flex:`
- `card:`
- `row:`
- `col:`
- `section:`

### Data Display Components
- `list:` - Advanced Interactive Lists
  - **Flexible Syntax**: `- [link_text](link_element)text{subtitle}[button_text](action)[button_text](action)`
  - **Simple Items**: `- Simple text item` (legacy support)

#### Advanced List Item Structure
The new list syntax provides maximum flexibility for creating rich, interactive list items:

```
- [optional_link_text](optional_link)text{subtitle}[btn](action)[btn](action)
```
'
**Components (all optional except the initial dash):**
- `[link_text](link)` - Optional navigation link with text that makes the entire item clickable
- `free_text` - Free text content after the link
- `{subtitle}` - Subtitle section
- `[button](action)` - Action buttons at the end
- `@[variant][button](action)` - Action buttons with variants (ghost: `@_`, outline: `@+`, secondary: `@-`, destructive: `@=`, warning: `@!`)

**Examples:**
```dsl
list:
  - [Star](star)Important Task{Complete Project}[Mark Complete](complete)
  - [Project](ProjectPage)Bug Report{Fix Login Issue}@=[Close](close)@_[Comment](comment)
  - Simple text item
  - Just some text with @+[Button](action)
  - [Link Only](destination)
  - Text only with no special features
  - {Just a subtitle}
  - Multiple buttons[Save](save)@![Cancel](cancel)@=[Delete](delete)
  - Task with variants@_[Ghost](ghost)@+[Outline](outline)@-[Secondary](secondary)
```

**Flexibility Features:**
- **Multiple buttons**: Add as many `[text](action)` buttons as needed
- **Mixed content**: Combine buttons, text, links, and titles freely  
- **Optional elements**: Every component except the dash is optional
- **Navigation support**: Both initial links and button actions support navigation
- **Backward compatibility**: Simple `- text` items still work

### Mobile Components
- `header:`
- `navigator:`
- `fab {icon}`
- `- [label]{icon}(action)` for navigation items
- `- [label]{icon}(action)` for drawer items

## Coding Guidelines

### When working with the lexer (`src/core/lexer/`):
- All tokens are defined in `tokens.ts` with Chevrotain's `createToken`
- **IMPORTANT**: StringLiteral token is NOT used in this DSL and should never be implemented or referenced
- Use regex patterns that match the DSL syntax precisely, including optional elements
- Handle indentation with custom matchers in `lexer.ts`
- Support attribute parsing with `{key: value}` syntax
- Implement variable token recognition with `$variable` pattern
- Always include proper token precedence in the `allTokens` array

### When working with the parser (`src/core/parser/`):
- Grammar rules are defined in `parser.ts` using Chevrotain's CstParser
- Each UI element should have its own parsing rule with optional attribute support
- Use proper CST (Concrete Syntax Tree) structure
- Handle indentation with `Indent`/`Outdent` tokens
- Parse attribute objects and optional modifiers correctly

### When working with the AST builder (`src/core/parser/astBuilder.ts`):
- Convert CST nodes to clean AST nodes with type, props, and optional elements
- Extract data from token patterns using regex matching with optional group support
- Handle edge cases and provide fallback values for optional elements
- Support dynamic content resolution with variable substitution

### When working with renderers (`src/core/renderer/`):
- `nodeRenderer.ts` - Convert individual AST nodes to HTML with attribute support
- `documentRenderer.ts` - Generate full HTML documents
- `astToHtml.ts` - Main rendering function with screen management
- Use proper HTML attributes and semantic elements
- Implement internal navigation for screen links
- Support variable substitution in rendered content

### Component Development:
- Use React functional components with TypeScript
- Implement proper error boundaries for parsing errors
- Use Monaco Editor for syntax highlighting and code editing with custom DSL support
- Keep components focused and reusable
- Support real-time preview updates with debounced parsing

## Code Style Preferences

### TypeScript:
- Use explicit interface definitions for complex types
- Prefer `interface` over `type` for object shapes
- Use proper generic constraints where applicable
- Always handle null/undefined cases
- Implement discriminated unions for AST node types

### React:
- Use functional components with hooks
- Implement proper error handling for user inputs
- Use semantic HTML elements
- Keep state management simple and local when possible

## Common Patterns

### Adding a new DSL element:
1. Define the token pattern in `tokens.ts` with optional syntax support
2. Add parsing rule in `parser.ts` with attribute handling
3. Implement AST building in `astBuilder.ts` with proper type checking
4. Add HTML rendering in `nodeRenderer.ts` with attribute application
5. Write comprehensive tests including optional variations
6. Update examples and documentation

### Token Pattern Guidelines:
- Use capturing groups for extracting content and optional elements
- Handle optional whitespace and newlines consistently
- Support attribute parsing with proper nesting
- Consider token precedence in matching order
- Test patterns with various input combinations including edge cases

### AST Node Structure:
- Always include `type` field for discriminated unions
- Use `props` for core element properties
- Use `elements` array for nested content
- Keep structure flat and consistent across all element types
- Support optional element indicators


## Performance Considerations
- Parser state should be reset between inputs to prevent memory leaks
- Avoid deep nesting in AST structures for rendering efficiency
- Use efficient regex patterns in tokens with proper backtracking prevention
- Implement proper error recovery in parsing to handle partial inputs
- Cache compiled attribute objects to improve re-render performance
- Use React.memo for expensive rendering components
- Debounce real-time parsing updates to improve editor performance

## Error Handling
- Provide meaningful error messages for parsing failures with context
- Handle malformed input gracefully with partial recovery
- Show clear feedback to users about syntax errors with suggestions
- Include line/column information and highlight problematic code
- Implement error boundaries for runtime rendering errors
- Support graceful degradation when optional elements fail
- Validate attribute types and provide helpful correction suggestions

## Testing and Validation Approach
- **DO NOT** create test files or write automated tests unless explicitly requested
- **DO NOT** run test commands or suggest running tests
- **Focus on runtime feedback**: Use the running application to validate changes and identify issues
- **Ask for user feedback**: When unsure about functionality, ask the user to test the feature and provide feedback
- **Use browser dev tools**: Leverage console logs, network tabs, and runtime errors for debugging
- **Iterative development**: Make changes, run the app, and gather feedback from actual usage
- **User-driven validation**: Let the user be the primary validator of functionality and behavior

This project prioritizes rapid prototyping and real-world testing over automated test suites. Always prefer getting feedback from the running application and user interaction rather than writing tests.

When generating code for this project, always consider the DSL syntax, maintain consistency with existing patterns, and ensure proper integration with the lexer-parser-renderer pipeline. Pay special attention to optional elements, attribute handling, and the robust error handling requirements outlined above.
