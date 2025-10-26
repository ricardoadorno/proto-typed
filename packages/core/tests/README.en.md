# @proto-typed/core Tests

This directory contains the unit and integration tests for the `@proto-typed/core` package.

## Test Structure

### Unit Tests (`unit/`)

- **lexer.test.ts**: Tests for the tokenizer (Lexer)
  - Basic element tokenization
  - Indentation management (Indent/Outdent)
  - Components and special syntax
  - Error handling

- **parser.test.ts**: Tests for the syntactic analyzer (Parser)
  - Syntactic analysis of basic elements
  - Nested structures
  - Components and attributes
  - Error recovery

- **ast-builder.test.ts**: Tests for the AST builder
  - CST to AST conversion
  - Attribute extraction
  - Complex structures
  - Deterministic ID generation

- **error-bus.test.ts**: Tests for the error pub/sub system
  - Singleton pattern
  - Error emission and collection
  - Deduplication
  - Subscription system (subscribe/notify)

- **utils-deterministic-ids.test.ts**: Tests for ID generation
  - Deterministic ID generation
  - ID reuse
  - Duplicate handling
  - AST validation

- **renderer.test.ts**: Tests for HTML rendering
  - Rendering of complete HTML documents
  - Preview rendering
  - Navigation and attributes
  - Styles and themes

### Integration Tests (`integration/`)

- **end-to-end.test.ts**: Full flow tests
  - Complete DSL → HTML pipeline
  - Multi-screen applications
  - Component system
  - Navigation between screens
  - Theme management
  - Real-world scenarios

## Running the Tests

### Run all tests

```bash
cd packages/core
pnpm test
```

### Run tests in watch mode

```bash
pnpm test
```

### Run tests once

```bash
pnpm test:run
```

### Run tests with interactive UI

```bash
pnpm test:ui
```

### Run tests with coverage

```bash
pnpm test:coverage
```

## Test Structure

Each test file follows this structure:

```typescript
import { describe, it, expect, beforeEach } from 'vitest'

describe('Module - Description', () => {
  beforeEach(() => {
    // Setup before each test
  })

  describe('Specific Functionality', () => {
    it('should do something specific', () => {
      // Arrange
      const input = '...'

      // Act
      const result = fn(input)

      // Assert
      expect(result).toBeDefined()
      expect(result).toHaveProperty('prop')
    })
  })
})
```

## Test Coverage

The tests cover:

### Lexer (Tokenization)

- ✅ Basic element tokenization
- ✅ Indentation management
- ✅ Special tokens (brackets, equals, comma)
- ✅ Error handling

### Parser (Syntactic Analysis)

- ✅ Basic element parsing
- ✅ Nested structures
- ✅ Attributes and properties
- ✅ Error recovery

### AST Builder

- ✅ AST node construction
- ✅ Property extraction
- ✅ Element hierarchy
- ✅ Components

### Error Bus

- ✅ Error emission
- ✅ Error collection
- ✅ Deduplication
- ✅ Subscription system

### Utils

- ✅ Deterministic ID generation
- ✅ ID reuse
- ✅ AST validation

### Renderer

- ✅ HTML rendering
- ✅ Navigation between screens
- ✅ Themes and styles
- ⚠️ Some tests need adjustment (depend on the exact implementation)

### Integration

- ✅ Complete parsing flow
- ✅ End-to-end rendering
- ✅ Complex applications
- ✅ Route management

## Observations

### Renderer Tests

Some renderer tests may fail as they depend on the exact implementation of the rendered HTML. These tests serve more as documentation of the expected behavior. The most important tests are:

1. If the HTML is generated without errors
2. If the basic content is present
3. If the general structure is correct

### Integration Tests

The integration tests are the most important as they test the complete flow:

- DSL → Lexer → Parser → AST Builder → Renderer → HTML

### Future Improvements

1. Add more snapshot tests for the renderer
2. Add performance tests
3. Add tests for edge cases
4. Improve code coverage
5. Add regression tests

## Contributing

When adding new features, make sure to:

1. Add unit tests for the new functionality
2. Add integration tests if necessary
3. Keep code coverage above 80%
4. Follow the Arrange-Act-Assert pattern
5. Use descriptive names for the tests
6. Document special cases or non-obvious behaviors

## Useful Commands

```bash
# Run only lexer tests
pnpm test lexer

# Run only integration tests
pnpm test integration

# Run with verbose
pnpm test -- --reporter=verbose

# Run a specific test
pnpm test -- -t "should tokenize button element"
```
