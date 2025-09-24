# proto-typed

A React-based UI prototyping tool that allows you to create interactive prototypes using a comprehensive, descriptive Domain Specific Language (DSL). proto-typed features a robust lexer-parser-renderer pipeline that supports optional elements, styling attributes, conditional rendering, and advanced layout management.

## Features

- **Comprehensive DSL**: Intuitive syntax for defining UI components, layouts, and interactions
- **Real-time Preview**: Live rendering of prototypes as you type with split-pane interface
- **Interactive Elements**: Buttons, forms, navigation, modals, drawers, and mobile components
- **Component System**: Reusable components and advanced layout containers
- **Monaco Editor**: Syntax highlighting, IntelliSense, and intelligent code editing
- **Mobile-First**: Support for mobile UI patterns and responsive design
- **Theme Support**: Built-in dark mode theming system with CSS variables
- **Navigation System**: Internal screen links with modal and drawer activation
- **Export Functionality**: Export rendered output for sharing and embedding

## Technology Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Parsing**: Chevrotain (lexer & parser)
- **Code Editor**: Monaco Editor with custom DSL language support
- **State Management**: React Context
- **Styling**: Tailwind CSS with dark mode optimizations
- **Testing**: Vitest + React Testing Library (configured)

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd proto-typed
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Usage

The application opens with a split-pane interface:
- **Left pane**: Monaco editor with DSL syntax highlighting and IntelliSense
- **Right pane**: Live preview of your prototype with device selection

Start by creating a simple screen:

```dsl
screen HomePage:
  # Welcome to proto-typed
  > Create amazing prototypes with simple syntax
  @[Get Started](GettingStarted)
```

## DSL Syntax Reference

### Basic Structure

#### Screens and Components
Define screens as top-level containers and create reusable components:

```dsl
component Header:
  # My App
  @[Menu](menu)

screen Dashboard:
  $Header
  > Dashboard content here
```

#### Navigation
Navigate between screens and activate modals/drawers:

```dsl
screen Home:
  @[Go to About](About)
  @[Open Modal](UserModal)

modal UserModal:
  # User Information
  @[Close](close)
```

### Typography

```dsl
# Heading 1
## Heading 2
### Heading 3

> Regular text
*> Note text
"> Quote text
```

### Interactive Elements

```dsl
@[Button Text](action)
@[Optional Button]?(action)
#[Link Text](destination)
![Alt Text](image-url)
```

### Form Elements

```dsl
___:Email{Enter your email}
___*:Password{Enter password}
___-:Disabled{Cannot edit}
___:Country{Select country}[USA | Canada | Mexico]

[X] Checked checkbox
[ ] Unchecked checkbox
(X) Selected radio
( ) Unselected radio
```

### Layout Components

```dsl
container:
  # Container Content
  > Organized layout

grid:
  @[Item 1](action1)
  @[Item 2](action2)
  @[Item 3](action3)

card:
  # Card Title
  > Card content with automatic styling
  @[Action](action)
```

### Advanced Lists

Create rich, interactive lists with flexible syntax:

```dsl
list:
  - [Star](star)Important Task{Complete by Friday}[Complete](done)
  - [Project](view)Bug Report{Fix login issue}@=[Close](close)@_[Comment](comment)
  - Multiple actions[Save](save)@![Delete](delete)@+[Edit](edit)
```

**List Item Components:**
- `[link_text](destination)` - Makes item clickable
- `free_text` - Regular text content
- `{subtitle}` - Subtitle section
- `[button](action)` - Action buttons
- `@[variant][button](action)` - Styled button variants:
  - `@_` Ghost style
  - `@+` Outline style
  - `@-` Secondary style
  - `@=` Destructive style
  - `@!` Warning style

### Mobile Components

```dsl
header:
  # App Header
  @[Menu](menu)

navigator:
  - [Home]{home}(HomePage)
  - [Profile]{user}(ProfilePage)
  - [Settings]{settings}(SettingsPage)

fab {plus}
```

### Named UI Elements

Modals and drawers with special behavior:

```dsl
modal ConfirmDialog:
  # Confirm Action
  > Are you sure you want to proceed?
  @[Yes](confirm)
  @[Cancel](close)

drawer MenuDrawer:
  # Menu
  - [Home](HomePage)
  - [About](AboutPage)
  - [Contact](ContactPage)
```
## Complete Example

```dsl
component AppHeader:
  header:
    # MyApp
    @[Menu](MainMenu)

modal ConfirmDelete:
  # Confirm Delete
  > Are you sure you want to delete this item?
  @[Delete](@=delete)
  @[Cancel](close)

drawer MainMenu:
  # Navigation
  - [Dashboard](Dashboard)
  - [Users](Users)
  - [Settings](Settings)

screen Dashboard:
  $AppHeader
  
  card:
    ## Welcome Back!
    > Here's your dashboard overview
  
  grid:
    card:
      ### Active Users
      > 1,247
    
    card:
      ### Revenue
      > $12,450

screen Users:
  $AppHeader
  
  @[Add User](AddUser)
  
  list:
    - [John Doe](UserDetail)Admin User{john@example.com}@+[Edit](edit)@=[Delete](ConfirmDelete)
    - [Jane Smith](UserDetail)Regular User{jane@example.com}@+[Edit](edit)@=[Delete](ConfirmDelete)
```

## Architecture

```
src/
├── core/
│   ├── lexer/          # Tokenization and lexical analysis
│   ├── parser/         # Grammar rules and AST building
│   ├── renderer/       # HTML generation from AST
│   ├── editor/         # Monaco editor configuration and DSL language support
│   │   ├── components/ # DSL editor React component
│   │   ├── completion/ # IntelliSense and auto-completion
│   │   ├── language/   # Monaco language registration and tokenization
│   │   ├── theme/      # Custom dark theme for DSL syntax highlighting
│   │   └── hooks/      # React hooks for editor state management
│   └── themes/         # Theme system and CSS variables
├── components/         # React UI components
├── examples/          # Sample DSL code examples
├── types/             # TypeScript type definitions
└── utils/             # Utility functions
```

### Core Pipeline

The application uses a sophisticated parsing pipeline:

1. **Lexer** (`src/core/lexer/`) - Tokenizes the DSL input
2. **Parser** (`src/core/parser/`) - Builds Abstract Syntax Tree (AST)
3. **Renderer** (`src/core/renderer/`) - Converts AST to HTML

### DSL Architecture

- **DSL**: Descriptive syntax to declare screens, components, layouts, and interactions
- **AST**: Clean, typed nodes built from the parser's CST with optional elements support
- **Renderer**: Deterministic AST-to-HTML with semantic elements and built-in navigation

## Development

### Adding New DSL Elements

1. Define the token pattern in `src/core/lexer/tokens.ts`
2. Add parsing rule in `src/core/parser/parser.ts`
3. Implement AST building in `src/core/parser/astBuilder.ts`
4. Add HTML rendering in `src/core/renderer/nodeRenderer.ts`
5. Update examples and documentation

### Token Pattern Guidelines
- Use capturing groups for extracting content and optional elements
- Handle optional whitespace and newlines consistently
- Support attribute parsing with proper nesting
- Consider token precedence in matching order

## Contributing

When contributing to proto-typed:

1. Follow the established DSL syntax patterns
2. Maintain consistency with the lexer-parser-renderer pipeline
3. Test features using the live application (no automated tests required)
4. Ensure proper TypeScript typing
5. Update documentation for new syntax elements
6. Use dark mode styling with Tailwind CSS

## License

This project is licensed under the MIT License.