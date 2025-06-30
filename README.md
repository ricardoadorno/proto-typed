*# proto-typed

A React-based UI prototyping tool that allows you to create interactive prototypes using a comprehensive, descriptive Domain Specific Language (DSL). proto-typed features a robust lexer-parser-renderer pipeline that supports optional elements, styling attributes, conditional rendering, and advanced layout management.

## Features

- **Comprehensive DSL**: Intuitive syntax for defining UI components, layouts, and interactions
- **Real-time Preview**: Live rendering of prototypes as you type
- **Interactive Elements**: Buttons, forms, navigation, modals, and drawers
- **Component System**: Reusable components and advanced layout containers
- **Theme Support**: Built-in theming system with CSS variables
- **Monaco Editor**: Syntax highlighting and intelligent code editing
- **Mobile-First**: Support for mobile UI patterns and responsive design
- **Tailwind CSS**: Utility-first CSS framework for styling with dark mode optimizations

## Technology Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Parsing**: Chevrotain (lexer & parser)
- **Code Editor**: Monaco Editor with custom syntax highlighting
- **State Management**: React Context
- **Styling**: Tailwind CSS with custom utility classes and dark mode
- **Testing**: Vitest + React Testing Library (configured)

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

## Styling with Tailwind CSS

proto-typed uses Tailwind CSS as its styling foundation with extensive customizations for the dark theme and component system:

### Dark Mode Optimization
The application is optimized for dark mode with a carefully crafted color palette:

- **Background Gradients**: `bg-gradient-to-br from-slate-900 to-slate-800`
- **Card Containers**: `bg-gray-800 border-gray-700`
- **Text Colors**: Primary text in `text-white`, secondary in `text-gray-300`
- **Interactive Elements**: Blue accent colors with `bg-blue-600 hover:bg-blue-700`

### Component-Specific Styling
Each DSL element maps to specific Tailwind classes:

```typescript
// Button variants with consistent theming
button: 'inline-flex items-center justify-center px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200'

// Form elements with dark mode styling
input: 'w-full px-3 py-2 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-500 bg-gray-700 text-white'

// Mobile-first header with backdrop blur
header: 'sticky top-0 left-0 right-0 z-50 bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 backdrop-blur-md bg-opacity-95 shadow-xl border-b border-gray-700/50'
```

### Responsive Design
Tailwind's responsive prefixes are used throughout:
- Mobile-first approach with `@md:` and `@lg:` breakpoints
- Container queries for adaptive layouts
- Flexible grid systems: `grid grid-cols-1 @md:grid-cols-2 @lg:grid-cols-3`

### Custom Utility Extensions
proto-typed extends Tailwind with custom utilities for:
- Screen layout classes (`has-header`, `has-navigator`, `has-fab`)
- Component-specific spacing and positioning
- Advanced shadow and backdrop effects for mobile UI elements

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```bash
   cd proto-typed
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

## Usage

Start the development server:
```bash
npm run dev
```

The application will open in your browser with a split-pane interface:
- **Left pane**: Monaco editor with DSL syntax highlighting
- **Right pane**: Live preview of your prototype

## DSL Syntax Reference

### Basic Structure

#### Screen Declaration
Define screens as top-level containers for your prototype:
```dsl
screen HomePage:
  # Welcome to proto-typed
  > Create amazing prototypes with simple syntax
  @[Get Started](GettingStarted)
```

#### Component System
Create reusable components:
```dsl
component Header:
  # My App
  @[Menu](menu)

screen Dashboard:
  $Header
  > Dashboard content here
```

### Typography

```dsl
# Heading 1
## Heading 2
### Heading 3
#### Heading 4
##### Heading 5
###### Heading 6

> Regular text
*> Note text
"> Quote text
```

### Interactive Elements

#### Buttons and Links
```dsl
@[Button Text](action)
@[Optional Button]?(action)
#[Link Text](destination)
```

#### Images
```dsl
![Alt Text](image-url)
![Optional Image]?(image-url)
```

### Form Elements

#### Text Inputs
```dsl
___:Email{Enter your email}
___*:Password{Enter password}
___-:Disabled{Cannot edit}
```

#### Select Fields
```dsl
___:Country{Select country}[USA | Canada | Mexico]
```

#### Checkboxes and Radio Buttons
```dsl
[X] Checked checkbox
[ ] Unchecked checkbox

(X) Selected radio
( ) Unselected radio
```

### Layout Components

#### Containers
```dsl
container:
  # Container Content
  > Organized layout

grid:
  @[Item 1](action1)
  @[Item 2](action2)
  @[Item 3](action3)

flex:
  @[Left](left)
  @[Right](right)
```

#### Cards and Sections
```dsl
card:
  # Card Title
  > Card content with automatic styling
  @[Action](action)

section:
  ## Section Header
  > Section content
```

### Advanced Lists

Create rich, interactive lists with flexible syntax:
```dsl
list:
  - [Star](star)Important Task{Complete by Friday}[Complete](done)
  - [Project](view)Bug Report{Fix login issue}@=[Close](close)@_[Comment](comment)
  - Simple text item
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

### Modals and Drawers

Named UI elements with special behavior:
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

screen MainScreen:
  @[Open Dialog](ConfirmDialog)
  @[Open Menu](MenuDrawer)
```

### Optional Elements

Use `?` suffix to make any element optional:
```dsl
@[Optional Button]?(action)
![Optional Image]?(url)
$OptionalComponent?
```

## Navigation System

proto-typed supports internal navigation between screens and activation of modals/drawers:

```dsl
screen Home:
  @[Go to About](About)
  @[Open Modal](UserModal)

screen About:
  # About Page
  @[Back Home](Home)

modal UserModal:
  # User Information
  @[Close](close)
```

## Example Prototype

Here's a complete example demonstrating various features:

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
    
    card:
      ### Growth
      > +15.3%

screen Users:
  $AppHeader
  
  @[Add User](AddUser)
  
  list:
    - [John Doe](UserDetail)Admin User{john@example.com}@+[Edit](edit)@=[Delete](ConfirmDelete)
    - [Jane Smith](UserDetail)Regular User{jane@example.com}@+[Edit](edit)@=[Delete](ConfirmDelete)
    - [Bob Johnson](UserDetail)Guest User{bob@example.com}@+[Edit](edit)@=[Delete](ConfirmDelete)
```

## Development

The application uses a sophisticated parsing pipeline:

1. **Lexer** (`src/core/lexer/`) - Tokenizes the DSL input
2. **Parser** (`src/core/parser/`) - Builds Abstract Syntax Tree (AST)
3. **Renderer** (`src/core/renderer/`) - Converts AST to HTML

## Contributing

When contributing to proto-typed:

1. Follow the established DSL syntax patterns
2. Maintain consistency with the lexer-parser-renderer pipeline
3. Test features using the live application
4. Ensure proper TypeScript typing
5. Update documentation for new syntax elements

## License

This project is licensed under the MIT License. See the LICENSE file for details.

*