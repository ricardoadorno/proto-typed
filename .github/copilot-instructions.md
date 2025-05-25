# GitHub Copilot Instructions for Proto-type

## Project Overview
This is a React-based UI prototyping tool that allows users to create interactive prototypes using a simple, descriptive syntax. The application features a custom Domain Specific Language (DSL) with a complete lexer, parser, and renderer pipeline.

## Core Architecture

### Technology Stack
- **Frontend**: React 19 + TypeScript + Vite
- **Testing**: Vitest + React Testing Library
- **Parsing**: Chevrotain (lexer & parser)
- **Styling**: Pico.css for minimal CSS framework
- **Code Editor**: Monaco Editor for syntax highlighting

### Project Structure
- `src/core/lexer/` - Tokenization and lexical analysis
- `src/core/parser/` - Grammar rules and AST building
- `src/core/renderer/` - HTML generation from AST
- `src/components/` - React UI components
- `src/examples/` - Sample DSL code examples
- `src/types/` - TypeScript type definitions
- `src/test/` - Comprehensive test suites

## DSL Syntax Reference

### Screen Declaration
```
@screen ScreenName:
  # Content goes here
```

### Typography Elements
- `# Heading 1` to `###### Heading 6`
- `> Regular text`
- `*> Note text`
- `"> Quote text`

### Interactive Elements
- `@[Button Text](optional-action)` - Buttons
- `#[Link Text](destination)` - Links (internal screen navigation or external URLs)
- `![Alt Text](image-url)` - Images

### Form Elements
- `___:Label(Placeholder)` - Input fields (default type: text)
- `___*:Label(Placeholder)` - Password input fields  
- `___-:Label(Placeholder)` - Disabled input fields
- `___:Label(Placeholder)[Option1 | Option2 | Option3]` - Select fields with options
- `[X]` / `[ ]` - Checkboxes (checked/unchecked)
- `(X)` / `( )` - Radio buttons (selected/unselected)

### Layout Components
- `card:` - Card containers
- `row:` - Horizontal layout
- `col:` - Column layout (inside rows)
- `---` - Horizontal separator

### Lists
- `1. Item` - Ordered lists
- `- Item` - Unordered lists

## Coding Guidelines

### When working with the lexer (`src/core/lexer/`):
- All tokens are defined in `tokens.ts` with Chevrotain's `createToken`
- Use regex patterns that match the DSL syntax precisely
- Handle indentation with custom matchers in `lexer.ts`
- Always include proper token precedence in the `allTokens` array

### When working with the parser (`src/core/parser/`):
- Grammar rules are defined in `parser.ts` using Chevrotain's CstParser
- Each UI element should have its own parsing rule
- Use proper CST (Concrete Syntax Tree) structure
- Handle indentation with `Indent`/`Outdent` tokens

### When working with the AST builder (`src/core/parser/astBuilder.ts`):
- Convert CST nodes to clean AST nodes with type and props
- Extract data from token patterns using regex matching
- Always return consistent AST node structure: `{ type, props, elements? }`
- Handle edge cases and provide fallback values

### When working with renderers (`src/core/renderer/`):
- `nodeRenderer.ts` - Convert individual AST nodes to HTML
- `screenRenderer.ts` - Render complete screens
- `documentRenderer.ts` - Generate full HTML documents
- `astToHtml.ts` - Main rendering function with screen management
- Use proper HTML attributes and semantic elements
- Implement internal navigation for screen links

### When writing tests:
- Use descriptive test names that explain the behavior
- Test both positive and negative cases
- Include edge cases like empty inputs, malformed syntax
- Use the established pattern: parse → build AST → render → assert

### Component Development:
- Use React functional components with TypeScript
- Implement proper error boundaries for parsing errors
- Use Monaco Editor for syntax highlighting and code editing
- Keep components focused and reusable

## Code Style Preferences

### TypeScript:
- Use explicit interface definitions for complex types
- Prefer `interface` over `type` for object shapes
- Use proper generic constraints where applicable
- Always handle null/undefined cases

### React:
- Use functional components with hooks
- Implement proper error handling for user inputs
- Use semantic HTML elements
- Keep state management simple and local

### Testing:
- Write tests for all core functionality
- Use `describe` blocks to group related tests
- Mock external dependencies appropriately
- Test error conditions and edge cases

## Common Patterns

### Adding a new DSL element:
1. Define the token pattern in `tokens.ts`
2. Add parsing rule in `parser.ts`
3. Implement AST building in `astBuilder.ts`
4. Add HTML rendering in `nodeRenderer.ts`
5. Write comprehensive tests
6. Update examples if relevant

### Token Pattern Guidelines:
- Use capturing groups for extracting content
- Handle optional whitespace and newlines
- Consider token precedence in matching order
- Test patterns with various input combinations

### AST Node Structure:
- Always include `type` field
- Use `props` for attributes and configuration
- Use `elements` array for nested content
- Keep structure flat and consistent

## Performance Considerations
- Parser state should be reset between inputs
- Avoid deep nesting in AST structures
- Use efficient regex patterns in tokens
- Implement proper error recovery in parsing

## Error Handling
- Provide meaningful error messages for parsing failures
- Handle malformed input gracefully
- Show clear feedback to users about syntax errors
- Include line/column information when possible

When generating code for this project, always consider the DSL syntax, maintain consistency with existing patterns, and ensure proper integration with the lexer-parser-renderer pipeline.
