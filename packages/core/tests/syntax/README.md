# Proto-Typed Syntax Tests

## Overview

This directory contains comprehensive syntax tests for the Proto-Typed DSL using a **snapshot-based testing approach** with expected HTML outputs.

## Test Structure

### Test Organization

Tests are organized by DSL domain:

- **`primitives.test.ts`**: Button, Image, Text, Heading elements
- **`layouts.test.ts`**: Container, Stack, Row, Grid, Card layouts
- **`components.test.ts`**: Component definitions and instances
- **`inputs.test.ts`**: Input fields and form elements
- **`views.test.ts`**: Screen, Modal, Drawer views

### Fixture Files

Each test file has a corresponding fixture file in `fixtures/`:

- `primitives.fixtures.ts`
- `layouts.fixtures.ts`
- `components.fixtures.ts`
- `inputs.fixtures.ts`
- `views.fixtures.ts`

## Fixture Format

Fixtures use a structured format with **three validation modes**:

```typescript
export interface Fixture {
  dsl: string // Input DSL string
  expected: {
    htmlOutput?: string // Complete expected HTML (optional, strict validation)
    htmlContains: string[] // Patterns that must be present (flexible validation)
    htmlNotContains?: string[] // Patterns that must NOT be present
  }
}
```

### Validation Modes

1. **Strict Validation** (htmlOutput): Validates exact HTML match
2. **Flexible Validation** (htmlContains): Validates patterns present
3. **Combined**: Use both for comprehensive validation

### Example Fixture

```typescript
{
  dsl: `screen Test:
  @[Click Me](action)`,
  expected: {
    // Strict: exact HTML output
    htmlOutput: `<div class="screen container Test" data-screen="Test"><button class="inline-flex items-center..." data-nav="action">Click Me</button></div>`,

    // Flexible: key patterns to validate
    htmlContains: [
      '<button',
      'Click Me',
      'data-nav="action"',
      'var(--primary)'
    ],

    // Negative validation
    htmlNotContains: ['<svg']
  }
}
```

## How Tests Work

### Test Execution Flow

1. **Parse DSL** → Generate AST
2. **Validate** → Check for parsing errors
3. **Snapshot AST** → Capture structure (types & props)
4. **Render HTML** → Convert AST to HTML
5. **Validate Output**:
   - If `htmlOutput` provided: exact match validation
   - Always: pattern matching with `htmlContains`
   - If specified: negative validation with `htmlNotContains`
6. **Snapshot HTML** → Capture rendered output

### testSnapshot Helper

```typescript
function testSnapshot(name: string, fixture: Fixture) {
  it(name, () => {
    const { dsl, expected } = fixture
    const ast = parseAndBuildAst(dsl)
    expect(ast.__errors).toHaveLength(0)

    // Snapshot AST structure
    expect(astSnapshot).toMatchSnapshot('AST')

    // Render HTML
    const html = renderNode(screenNode)

    // Validate exact output (if provided)
    if (expected.htmlOutput) {
      expect(html).toBe(expected.htmlOutput)
    }

    // Validate patterns
    expected.htmlContains.forEach((pattern) => {
      expect(html).toContain(pattern)
    })

    // Snapshot HTML
    expect(html).toMatchSnapshot('HTML')
  })
}
```

## Generating HTML Outputs

### Using the Helper Script

Use the `generate-html-output.ts` helper to generate expected HTML:

```typescript
import {
  generateHtmlOutput,
  printGenerationResult,
} from './helpers/generate-html-output'

const dsl = `screen Test:
  @[Click Me](action)`

const result = generateHtmlOutput(dsl)
printGenerationResult(result)
```

### Output Format

The helper provides:

- **dsl**: Original input
- **html**: Generated HTML
- **errors**: Any parsing errors
- **Formatted output**: Ready to paste into fixture

### Example Usage

```bash
# Run generator for specific tests
pnpm test packages/core/tests/syntax/helpers/generate-fixtures-html.test.ts

# Output will show:
# ================================================================================
# DSL Input:
# --------------------------------------------------------------------------------
# screen Test:
#   @[Click Me](action)
# --------------------------------------------------------------------------------
# Generated HTML:
# --------------------------------------------------------------------------------
# <div class="screen container Test"...>
# --------------------------------------------------------------------------------
# For fixture file:
# --------------------------------------------------------------------------------
# htmlOutput: `<div class="screen container Test"...>`,
# ================================================================================
```

## Best Practices

### Writing Fixtures

1. **Always include `htmlContains`**: Core patterns for flexible validation
2. **Add `htmlOutput` for critical cases**: Ensures exact output for important elements
3. **Use `htmlNotContains` sparingly**: Only for important negative validations
4. **Test key CSS classes**: Tailwind utilities, custom classes
5. **Test data attributes**: Navigation, types, custom data attributes
6. **Test CSS variables**: Shadcn theme variables like `var(--primary)`

### Fixture Examples

#### Basic Example (Pattern Validation)

```typescript
basic: {
  dsl: `screen Test:
  ![Logo](logo.png)`,
  expected: {
    htmlContains: ['<img', 'src="logo.png"', 'alt="Logo"']
  }
}
```

#### Complete Example (Exact + Pattern)

```typescript
basicButton: {
  dsl: `screen Test:
  @[Click Me](action)`,
  expected: {
    htmlOutput: `<div class="screen container Test" data-screen="Test"><button class="inline-flex items-center justify-center focus:outline-none focus:ring-2 transition-colors duration-200 h-10 px-5 text-sm" style="border-radius: var(--radius); focus-ring-color: var(--ring); background-color: var(--primary); color: var(--primary-foreground);" data-nav="action" data-nav-type="internal">Click Me</button></div>`,
    htmlContains: [
      '<button',
      'Click Me',
      'data-nav="action"',
      'var(--primary)'
    ]
  }
}
```

#### Negative Validation

```typescript
linkWithIcon: {
  dsl: `screen Test:
  > Mixed [i-zap Help](Support) example`,
  expected: {
    htmlContains: ['<a', 'href="#Support"', 'i-zap Help'],
    htmlNotContains: ['<svg'] // Icons should NOT render inside links
  }
}
```

### Maintaining Tests

1. **Update snapshots**: Run `pnpm test:run -u` after intentional changes
2. **Generate new outputs**: Use helper script for new fixtures
3. **Keep fixtures focused**: One feature/variant per fixture
4. **Group related tests**: Use describe blocks for organization

## Snapshot Files

Snapshots are stored in `__snapshots__/` directory:

- `primitives.test.ts.snap`
- `layouts.test.ts.snap`
- `components.test.ts.snap`
- etc.

### Snapshot Format

```typescript
exports[`Primitives > Buttons > basic button > AST 1`] = `
{
  "type": "Program",
  "children": [...]
}
`

exports[`Primitives > Buttons > basic button > HTML 1`] =
  `"<div class="screen container Test"...>"`
```

## Running Tests

```bash
# Run all syntax tests
pnpm test packages/core/tests/syntax

# Run specific domain
pnpm test packages/core/tests/syntax/primitives.test.ts

# Run with watch mode
pnpm test packages/core/tests/syntax --watch

# Update snapshots
pnpm test packages/core/tests/syntax -u

# Run with UI
pnpm test:ui packages/core/tests/syntax
```

## Troubleshooting

### Common Issues

1. **Snapshot mismatch**: Review changes, update if intentional with `-u`
2. **Pattern not found**: Check if HTML structure changed
3. **Exact output mismatch**: Regenerate expected output with helper
4. **Parse errors**: Check DSL syntax, review error messages

### Debugging

```typescript
// Add console.log in test to see actual HTML
const html = renderNode(screenNode)
console.log('Generated HTML:', html)
```

Or use the debug helper:

```typescript
import {
  generateHtmlOutput,
  printGenerationResult,
} from './helpers/generate-html-output'

const result = generateHtmlOutput(yourDSL)
printGenerationResult(result) // Pretty prints all details
```

## Migration Guide

### Converting Old Tests to New Format

**Before:**

```typescript
it('should render button', () => {
  const dsl = `screen Test:
  @[Click](action)`
  const ast = parseAndBuildAst(dsl)
  const html = renderNode(ast.children![0])
  expect(html).toContain('<button')
})
```

**After:**

```typescript
// 1. Create fixture
const fixtures = {
  basic: {
    dsl: `screen Test:
  @[Click](action)`,
    expected: {
      htmlContains: ['<button', 'Click', 'data-nav="action"'],
    },
  },
}

// 2. Use testSnapshot helper
describe('Buttons', () => {
  testSnapshot('basic button', fixtures.basic)
})
```

## Contributing

When adding new DSL features:

1. Create fixture with DSL example
2. Run test to generate snapshot
3. Add expected HTML patterns
4. Optionally: Add exact htmlOutput for critical cases
5. Verify tests pass
6. Update this README if needed

## Summary

This testing approach provides:

✅ **Confidence**: Exact HTML validation + pattern matching
✅ **Maintainability**: Clear fixtures, reusable helpers
✅ **Documentation**: Fixtures serve as usage examples
✅ **Flexibility**: Choose validation strictness per case
✅ **Speed**: Fast snapshot comparisons
✅ **Reliability**: Catch regressions automatically
