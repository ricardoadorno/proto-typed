# Proto-Typed Playground - E2E Test Suite

## 📋 Overview

This is a comprehensive end-to-end test suite for the Proto-Typed web playground. The tests validate the complete user workflow from typing DSL code in the Monaco editor to seeing the rendered preview in real-time.

## 🎯 Test Coverage

### 1. **Basic Functionality** (`playground-basic.spec.ts`)
- ✅ Playground page loads successfully
- ✅ Monaco editor initializes without errors
- ✅ Default example code is displayed
- ✅ Preview updates when typing in editor
- ✅ Screen count detection works
- ✅ Empty editor state is handled gracefully
- ✅ Layout elements render correctly
- ✅ Example switching works
- ✅ Responsive layout on different viewport sizes

### 2. **Autocompletion** (`playground-completion.spec.ts`)
- ✅ Completion suggestions appear on Ctrl+Space
- ✅ Context-aware completions (screen, modal, drawer)
- ✅ Layout completions (container, row, col, grid, etc.)
- ✅ Button variant completions
- ✅ Heading and text element completions
- ✅ Component and prop completions
- ✅ Form input completions
- ✅ Image and link completions
- ✅ Snippet insertion with placeholders
- ✅ Completion filtering based on typed text
- ✅ Documentation in completion items

### 3. **Preview Rendering** (`playground-preview.spec.ts`)
- ✅ Headings (h1-h4) render correctly
- ✅ Paragraphs and text variants
- ✅ Button variants (default, ghost, outline, destructive, etc.)
- ✅ Layout elements (row, card, list, grid)
- ✅ Form inputs (text, password, select, checkbox, radio)
- ✅ Components with prop interpolation
- ✅ Nested structures
- ✅ Images and links
- ✅ Incremental preview updates
- ✅ Separators, blockquotes, notes
- ✅ Navigator and FAB
- ✅ Styling consistency
- ✅ No JavaScript errors during rendering

### 4. **Navigation** (`playground-navigation.spec.ts`)
- ✅ Multiple screen detection
- ✅ Screen navigation buttons display
- ✅ Navigation via metadata buttons
- ✅ Navigation via preview buttons
- ✅ Default screen on first render
- ✅ Modal and drawer toggling
- ✅ Screen count updates dynamically
- ✅ Current screen persistence during edits
- ✅ Reset to default when current screen deleted
- ✅ Bottom navigator functionality
- ✅ Back navigation (-1)
- ✅ External link handling
- ✅ Navigation state preservation

### 5. **Error Handling** (`playground-errors.spec.ts`)
- ✅ Syntax error detection
- ✅ Error recovery when fixed
- ✅ Missing screen name handling
- ✅ Invalid indentation handling
- ✅ Incomplete button/image syntax
- ✅ Undefined component references
- ✅ Invalid navigator syntax
- ✅ Mixed valid/invalid content
- ✅ Extremely long lines
- ✅ Deeply nested structures
- ✅ Rapid invalid input changes
- ✅ Special characters and XSS prevention
- ✅ Emoji and unicode support
- ✅ Multiple simultaneous errors
- ✅ No uncaught JavaScript errors

### 6. **Export & Features** (`playground-export.spec.ts`)
- ✅ Export button visibility and state
- ✅ Theme selector presence
- ✅ Example button functionality
- ✅ Example loading and switching
- ✅ Documentation link
- ✅ Custom theme rendering
- ✅ Proper page layout structure
- ✅ Screen count labels
- ✅ Browser navigation handling
- ✅ Multi-language support
- ✅ Window resize handling
- ✅ No layout shift issues
- ✅ Keyboard accessibility
- ✅ Focus management
- ✅ Network interruption handling
- ✅ Performance with large content

## 🏗️ Architecture

### Test Structure

```
packages/web/tests/e2e/
├── fixtures/
│   └── dsl-samples.ts          # Reusable DSL code samples
├── helpers/
│   └── playground-helpers.ts   # Page object model & utilities
├── playground-basic.spec.ts    # Basic functionality tests
├── playground-completion.spec.ts # Autocompletion tests
├── playground-preview.spec.ts   # Preview rendering tests
├── playground-navigation.spec.ts # Navigation tests
├── playground-errors.spec.ts    # Error handling tests
├── playground-export.spec.ts    # Export & features tests
└── README.md                    # This file
```

### Data Flow Tested

```
┌─────────────┐
│   User      │
│   Types     │
└──────┬──────┘
       │
       ▼
┌─────────────────┐
│  Monaco Editor  │ ◄─── Autocompletion Provider
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Language Host   │ ◄─── parseAndBuildAst()
│   (in-process)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    use-parse    │ ◄─── RouteManager
│      Hook       │      ErrorBus
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   AST → HTML    │ ◄─── astToHtmlStringPreview()
│   Renderer      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Live Preview   │ ◄─── User Interaction
│  (dangerously   │      (Navigation)
│   SetInnerHTML) │
└─────────────────┘
```

## 🚀 Running the Tests

### Prerequisites

- Node.js 18+ and pnpm installed
- Dependencies installed: `pnpm install`
- Playwright browsers installed: `pnpm exec playwright install`

### Commands

```bash
# Run all E2E tests
pnpm test:e2e

# Run tests in UI mode (interactive)
pnpm test:e2e:ui

# Run tests in debug mode
pnpm test:e2e:debug

# Run specific test file
pnpm exec playwright test packages/web/tests/e2e/playground-basic.spec.ts

# Run tests in headed mode (see browser)
pnpm exec playwright test --headed

# Run tests with specific browser
pnpm exec playwright test --project=chromium
pnpm exec playwright test --project=firefox
pnpm exec playwright test --project=webkit
```

### Continuous Integration

Tests are configured to run in CI with:
- Retries: 2 (on CI)
- Workers: 1 (on CI) / unlimited (local)
- Screenshot on failure
- Trace on first retry

## 🧪 Writing New Tests

### Using the Page Object Model

```typescript
import { PlaygroundPage } from './helpers/playground-helpers'

test('my new test', async ({ page }) => {
  const playground = new PlaygroundPage(page)
  await playground.goto()

  // Use helper methods
  await playground.setEditorContent('screen Test:\n  container:\n    # Test')
  await playground.waitForPreviewUpdate()

  // Make assertions
  await playground.expectPreviewHeading(1, 'Test')
})
```

### Using DSL Fixtures

```typescript
import { SIMPLE_SCREEN, COMPONENT_EXAMPLE } from './fixtures/dsl-samples'

test('test with fixture', async () => {
  await playground.setEditorContent(SIMPLE_SCREEN)
  // ... assertions
})
```

### Common Patterns

**Editor Interaction:**
```typescript
// Set content
await playground.setEditorContent(code)

// Type at cursor
await playground.typeInEditor('screen Test:')

// Get content
const content = await playground.getEditorContent()
```

**Preview Assertions:**
```typescript
// Check for elements
await playground.expectPreviewHeading(1, 'Title')
await playground.expectPreviewButton('Click Me')

// Get preview HTML
const html = await playground.getPreviewHTML()
```

**Navigation Testing:**
```typescript
// Navigate via metadata buttons
await playground.navigateToScreen('Settings')

// Click button in preview
await playground.clickPreviewButton('Go to Settings')
```

**Completion Testing:**
```typescript
// Trigger completion
await playground.triggerCompletion()

// Check for suggestions
const hasCompletions = await playground.hasCompletionSuggestions()

// Select completion
await playground.selectCompletion('screen')
```

## 📊 Test Metrics

- **Total Test Files**: 6
- **Total Test Cases**: ~150+
- **Coverage Areas**: Editor, Parser, Renderer, Navigation, Errors
- **Average Test Duration**: ~2-3 minutes (all tests)
- **Browsers Tested**: Chromium, Firefox, WebKit

## 🐛 Debugging Tests

### View Test Report
```bash
pnpm exec playwright show-report
```

### Debug Specific Test
```bash
pnpm exec playwright test --debug playground-basic.spec.ts
```

### Screenshots and Traces
- Screenshots are captured on failure
- Traces are captured on first retry
- Located in `test-results/` directory

### Common Issues

**Monaco Editor Not Loading:**
- Ensure `waitForEditorReady()` is called
- Check for JavaScript errors in console
- Verify Monaco scripts are loaded

**Preview Not Updating:**
- Increase `waitForPreviewUpdate()` timeout
- Check ErrorBus for parsing errors
- Verify AST is being generated

**Flaky Tests:**
- Add appropriate waits (`waitForTimeout`)
- Use `waitForSelector` instead of fixed timeouts
- Check for race conditions in async operations

## 🎨 Test Philosophy

These tests follow the **E2E-first approach**:

1. **User-Centric**: Tests simulate real user behavior
2. **Integration Focus**: Tests validate full data flow
3. **No Mocking**: Uses real parser, renderer, and Monaco
4. **Deterministic**: Tests are repeatable and reliable
5. **Comprehensive**: Covers happy paths and edge cases

## 📚 References

- [Playwright Documentation](https://playwright.dev)
- [Proto-Typed DSL Syntax](../../CLAUDE.md)
- [Monaco Editor API](https://microsoft.github.io/monaco-editor/api/index.html)

## ✅ Test Completion Criteria

A test suite is considered complete and successful when:

1. ✅ All tests pass consistently (no flaky tests)
2. ✅ Code coverage meets requirements
3. ✅ Tests run in reasonable time (< 5 minutes)
4. ✅ Tests are maintainable and well-documented
5. ✅ Tests catch real regressions
6. ✅ Tests work across all browsers

---

**Last Updated**: 2025-11-13
**Maintainer**: Development Team
