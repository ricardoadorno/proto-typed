# Proto-Typed Extension Tests# Proto-Typed Extension Testing Suite

## OverviewComprehensive testing infrastructure for the Proto-Typed VSCode extension, covering Language Server Protocol (LSP) features, webview functionality, and syntax highlighting.

Comprehensive E2E test suite for the Proto-Typed VSCode extension using `@vscode/test-electron` and Mocha.## � IMPORTANT: Current Status

**Status**: ✅ **12/12 tests passing** (100%)**⚠️ Tests are currently BLOCKED by ES Module resolution issues.**

**📊 Current Score: 66% compliance with VSCode best practices**

## Quick Start**✅ 7 of 12 tests passing**

```bash**👉 See [`EXECUTIVE_SUMMARY.md`](./EXECUTIVE_SUMMARY.md) for immediate action plan.\*\*

# Run all tests

pnpm test:extension:e2e---

# Run with headed browser (for debugging)## 📚 Documentation Index

pnpm test:extension:e2e:headed

````| Document                                                                   | Purpose                                             | Audience                    |

| -------------------------------------------------------------------------- | --------------------------------------------------- | --------------------------- |

## Test Coverage| **[EXECUTIVE_SUMMARY.md](./EXECUTIVE_SUMMARY.md)**                         | Quick overview, status, action plan                 | 👔 Managers, 👨‍💻 Developers  |

| **[VSCODE_TESTING_BEST_PRACTICES.md](./VSCODE_TESTING_BEST_PRACTICES.md)** | Official Microsoft patterns & examples (500+ lines) | 👨‍💻 Developers, 📖 Reference |

### ✅ Extension Core (Tests 1-2)| **[IMPLEMENTATION_ANALYSIS.md](./IMPLEMENTATION_ANALYSIS.md)**             | Detailed comparison: current vs. best practices     | 👨‍💻 Developers, 🔍 Reviewers |

- Extension activation| **[SETUP_STATUS.md](./SETUP_STATUS.md)**                                   | Technical setup issues & solutions                  | 🔧 DevOps, 👨‍💻 Developers    |

- Command registration (`proto-typed.showPreview`, `proto-typed.getLastRender`)| **[TEST_ANALYSIS.md](./TEST_ANALYSIS.md)**                                 | Original test analysis (pre-research)               | 📜 Historical reference     |

| **This README**                                                            | Usage guide & test catalog                          | 👨‍💻 Developers               |

### ✅ Language Support (Test 3)

- `.pty` file association---

- Language ID registration

## �📋 Table of Contents

### ✅ LSP Features (Tests 4-7)

- **Completions**: Keyword and layout completions- [Overview](#overview)

- **Diagnostics**: Error detection and clearing- [Architecture](#architecture)

- **Hover**: Documentation on hover- [Test Categories](#test-categories)

- [Running Tests](#running-tests)

### ✅ Syntax Highlighting (Test 8)- [Writing Tests](#writing-tests)

- TextMate grammar loaded- [Snapshot Testing](#snapshot-testing)

- [CI/CD Integration](#cicd-integration)

### ✅ Webview (Tests 9-10)- [Troubleshooting](#troubleshooting)

- Preview panel creation

- HTML rendering## 🎯 Overview



### ✅ Multi-file Support (Tests 11-12)This testing suite ensures the quality and reliability of the Proto-Typed extension by validating:

- Multiple file handling

- Live diagnostics updates- **Language Server Features**: Completions, diagnostics, hover, code actions

- **Syntax Highlighting**: TextMate grammar tokenization

## Architecture- **Webview Preview**: Real-time rendering and preview functionality

- **Extension Activation**: Commands, language registration, and API

### Build System

### Testing Tools

Uses **esbuild** for bundling:

- Bundles extension + `@proto-typed/core` into single file- **@vscode/test-electron**: Official VSCode extension testing framework

- Resolves ES Module issues automatically- **Mocha**: Test runner with TDD interface

- Generates source maps for debugging- **Chai**: Assertion library

- Output: `dist/extension.js` (~1.4MB)- **Snapshot Testing**: Custom snapshot utilities for render validation



**Build script**: `scripts/build.mjs`## 🏗️ Architecture



```javascript```

{tests/

  bundle: true,├── fixtures/              # Test files (.pty samples)

  external: ['vscode'], // Only VSCode API is external│   ├── sample.pty         # Valid DSL sample

  format: 'cjs',│   ├── invalid.pty        # Invalid syntax for error testing

  platform: 'node'│   └── completions.pty    # Completion trigger testing

}│

```├── snapshots/             # Render output snapshots

│   └── *.snapshot.json    # Saved test snapshots

### Test Structure│

├── helpers/               # Testing utilities

```│   └── snapshot.ts        # Snapshot management utilities

tests/│

├── e2e-simple/├── integration/           # LSP integration tests

│   └── all-features.test.ts    # Main E2E suite (12 tests)│   ├── completion.test.ts     # Autocomplete testing

├── fixtures/│   ├── diagnostics.test.ts    # Error detection testing

│   ├── sample.pty              # Valid syntax│   ├── hover.test.ts          # Hover documentation testing

│   ├── invalid.pty             # Error cases│   └── code-actions.test.ts   # Quick fix testing

│   └── completions.pty         # Completion scenarios│

├── helpers/├── e2e/                   # End-to-end tests

│   ├── test-utils.ts           # Shared utilities│   ├── extension.test.ts           # Extension activation

│   └── snapshot.ts             # Snapshot testing│   ├── webview.test.ts             # Preview functionality

└── suite-simple/│   └── syntax-highlighting.test.ts # Grammar testing

    └── index.ts                # Test runner config│

```├── suite/                 # Test runners

│   ├── index.ts          # Main test suite entry

## Key Solutions Implemented│   ├── headless.ts       # Headless runner (CI)

│   └── headed.ts         # Headed runner (debugging)

### 1. ES Module Resolution (CRITICAL FIX)│

├── run-tests.ts          # Primary test runner

**Problem**: Core modules failed to load with `Cannot find module` error├── tsconfig.json         # TypeScript config for tests

└── README.md             # This file

**Solution**: Bundle `@proto-typed/core` with esbuild```

- Removed from `external` array

- All imports resolved at build time## 🧪 Test Categories

- No runtime ES Module resolution issues

### 1. Integration Tests (`integration/`)

### 2. Fixture Management

Tests for Language Server Protocol features that require VSCode API integration.

**Problem**: Tests couldn't find `.pty` files

#### Completion Tests (`completion.test.ts`)

**Solution**: Copy fixtures to `dist/tests/fixtures/` during pretest

- View keyword completions (`screen`, `modal`, `drawer`, `component`)

### 3. Test Reliability- Trigger character completions (`@`, `#`, `_`, `$`, `%`)

- Layout completions (`container`, `card`, `stack`, `row`, `grid`)

**Pattern**: Use `waitFor` helper instead of `setTimeout`- Snippet support validation

- Documentation presence

```typescript

// ❌ Bad: Fixed delays#### Diagnostics Tests (`diagnostics.test.ts`)

await new Promise(resolve => setTimeout(resolve, 2500))

- Error detection for invalid syntax

// ✅ Good: Conditional waiting- No errors for valid syntax

await waitFor(async () => {- Proper range information

  const diagnostics = vscode.languages.getDiagnostics(uri)- Source and code attribution

  return diagnostics.length > 0- Real-time update on document changes

}, 5000)- Diagnostic clearing on file close

````

#### Hover Tests (`hover.test.ts`)

## Configuration

- Keyword hover documentation (`screen`, `modal`, `component`, `container`)

### VSCode Test Setup- Markdown formatting

- Contextual help for DSL elements

````typescript

// run-simple.ts#### Code Actions Tests (`code-actions.test.ts`)

await runTests({

  extensionDevelopmentPath,- QuickFix code actions

  extensionTestsPath,- Proper code action structure

  launchArgs: [- Association with diagnostics

    workspacePath,

    '--disable-extensions',      // Isolate tests### 2. E2E Tests (`e2e/`)

    '--disable-workspace-trust', // No trust prompts

  ]End-to-end tests that validate complete user workflows.

})

```#### Extension Tests (`extension.test.ts`)



### Mocha Configuration- Extension presence and activation

- Command registration (`showPreview`, `getLastRender`)

```typescript- Language registration (`proto-typed`)

// suite-simple/index.ts- File type recognition (`.pty`)

return new Mocha({- Provider registration (completion, hover, diagnostics)

  ui: 'tdd',- Multiple file handling

  color: true,

  timeout: 20000 // Generous timeout for CI#### Webview Tests (`webview.test.ts`)

})

```- Preview command execution

- API exposure and functionality

## Troubleshooting- HTML rendering validation

- Real-time preview updates

### Tests Failing?- Panel reuse behavior

- Panel disposal

1. **Check build**: `pnpm compile` should succeed

2. **Check fixtures**: `dist/tests/fixtures/*.pty` should exist#### Syntax Highlighting Tests (`syntax-highlighting.test.ts`)

3. **Check bundle**: `dist/extension.js` should be ~1.4MB

4. **Check logs**: Look for `❌ [Proto-Typed] Failed to load core modules`- TextMate grammar loading

- File extension recognition

### Debugging Tests- Language configuration

- Bracket matching

```bash- Comment support

# Run with headed browser- Indentation handling

pnpm test:extension:e2e:headed- Element type differentiation



# Run specific test## 🚀 Running Tests

# Edit suite-simple/index.ts to filter tests

```### Quick Start



### Common Issues```bash

# Run all tests (integration + e2e)

| Issue | Solution |pnpm test

|-------|----------|

| `Cannot find module` | Rebuild with `pnpm compile` |# Compile tests only

| Fixtures not found | Check `dist/tests/fixtures/` exists |pnpm test:compile

| Commands not registered | Core modules failed to load - check bundle |

| Timeout errors | Increase timeout in test |# Run integration tests

pnpm test:integration

## Performance

# Run e2e tests

- **Test Duration**: ~20-25 secondspnpm test:e2e

- **Bundle Size**: 1.4MB (optimized for correctness, not size)```

- **Memory Usage**: ~200MB (VSCode test instance)

### Headless vs Headed Mode

## Future Improvements

```bash

### Low Priority (Current Tests Cover All Features)# Headless mode (no UI, for CI/CD)

pnpm test:headless

1. **Reduce setTimeout usage**: Migrate remaining fixed delays to `waitFor`

2. **Add snapshot tests**: For HTML output validation# Headed mode (UI visible, for debugging)

3. **Add webview lifecycle tests**: Panel creation/disposal/revealpnpm test:headed

4. **Optimize bundle**: Tree-shaking, code splitting (if size becomes issue)```



---### Watch Mode



**Last Updated**: November 13, 2025  ```bash

**Test Status**: ✅ All tests passing# Automatically recompile tests on changes

pnpm test:watch
````

### Snapshot Testing

```bash
# Update all snapshots
pnpm test:snapshots

# Clear all snapshots
pnpm test:snapshots:clear
```

## ✍️ Writing Tests

### Basic Test Structure

```typescript
import * as assert from 'assert'
import * as vscode from 'vscode'
import * as path from 'path'

suite('My Test Suite', () => {
  const fixturesPath = path.join(__dirname, '..', 'fixtures')

  suiteSetup(async () => {
    // Activate extension before all tests
    const ext = vscode.extensions.getExtension(
      'proto-typed.proto-typed-vscode-extension'
    )
    if (ext && !ext.isActive) {
      await ext.activate()
    }
  })

  setup(async () => {
    // Setup before each test
  })

  teardown(async () => {
    // Cleanup after each test
    await vscode.commands.executeCommand('workbench.action.closeActiveEditor')
  })

  test('My test case', async () => {
    // Test implementation
    assert.ok(true, 'Test passed')
  })
})
```

### Testing Completions

```typescript
test('Should provide completions', async () => {
  const uri = vscode.Uri.file(path.join(fixturesPath, 'sample.pty'))
  const document = await vscode.workspace.openTextDocument(uri)
  await vscode.window.showTextDocument(document)

  await new Promise((resolve) => setTimeout(resolve, 1000))

  const position = new vscode.Position(0, 0)
  const completions =
    await vscode.commands.executeCommand<vscode.CompletionList>(
      'vscode.executeCompletionItemProvider',
      document.uri,
      position
    )

  assert.ok(completions, 'Completions should be provided')
  assert.ok(completions.items.length > 0, 'Should have completion items')
})
```

### Testing Diagnostics

```typescript
test('Should provide diagnostics for errors', async () => {
  const uri = vscode.Uri.file(path.join(fixturesPath, 'invalid.pty'))
  const document = await vscode.workspace.openTextDocument(uri)
  await vscode.window.showTextDocument(document)

  await new Promise((resolve) => setTimeout(resolve, 2000))

  const diagnostics = vscode.languages.getDiagnostics(uri)

  assert.ok(diagnostics.length > 0, 'Should have diagnostics')
  assert.strictEqual(
    diagnostics.some((d) => d.severity === vscode.DiagnosticSeverity.Error),
    true,
    'Should have error diagnostics'
  )
})
```

### Testing Webview

```typescript
test('Should render HTML content', async () => {
  await vscode.commands.executeCommand('proto-typed.showPreview')
  await new Promise((resolve) => setTimeout(resolve, 2000))

  const lastRender = await vscode.commands.executeCommand(
    'proto-typed.getLastRender'
  )

  if (lastRender && typeof lastRender === 'object' && 'html' in lastRender) {
    const html = (lastRender as { html: string }).html
    assert.ok(html.length > 0, 'Should have rendered HTML')
    assert.ok(
      html.includes('expected-content'),
      'HTML should contain expected content'
    )
  }
})
```

## 📸 Snapshot Testing

### Using Snapshots

```typescript
import { SnapshotManager } from '../helpers/snapshot'

suite('Snapshot Tests', () => {
  const snapshots = new SnapshotManager(__filename)

  test('Should match snapshot', async () => {
    const lastRender = await vscode.commands.executeCommand(
      'proto-typed.getLastRender'
    )

    if (lastRender && typeof lastRender === 'object') {
      snapshots.assertMatchesSnapshot(
        'test-render-output',
        lastRender as RenderSnapshot
      )
    }
  })
})
```

### Snapshot Utilities

```typescript
import {
  normalizeHtml,
  extractTextContent,
  assertHtmlContains,
  assertHtmlNotContains,
} from '../helpers/snapshot'

// Normalize HTML for comparison
const normalized = normalizeHtml(html)

// Extract text content only
const text = extractTextContent(html)

// Assert HTML contains elements
assertHtmlContains(html, ['<div>', 'Welcome'])

// Assert HTML doesn't contain elements
assertHtmlNotContains(html, ['error', 'undefined'])
```

### Environment Variables

```bash
# Update snapshots instead of comparing
UPDATE_SNAPSHOTS=1 pnpm test:integration
```

## 🔄 CI/CD Integration

### GitHub Actions Example

```yaml
name: Extension Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - uses: pnpm/action-setup@v2
        with:
          version: 8

      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install

      - name: Compile extension
        run: pnpm compile

      - name: Run tests (headless)
        run: pnpm test:headless
        env:
          DISPLAY: ':99.0'

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: test-results
          path: test-results/
```

### Running in Docker

```dockerfile
FROM node:18

# Install X virtual framebuffer for headless testing
RUN apt-get update && apt-get install -y \
    xvfb \
    libgtk-3-0 \
    libgbm1 \
    libasound2

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

COPY . .

RUN pnpm install
RUN pnpm compile

# Run tests with virtual display
CMD xvfb-run -a pnpm test:headless
```

## 🔧 Troubleshooting

### Common Issues

#### Extension not activating

```typescript
// Add explicit activation in suiteSetup
suiteSetup(async () => {
  const ext = vscode.extensions.getExtension(
    'proto-typed.proto-typed-vscode-extension'
  )
  if (ext && !ext.isActive) {
    await ext.activate()
    // Wait for activation to complete
    await new Promise((resolve) => setTimeout(resolve, 2000))
  }
})
```

#### Diagnostics not appearing

```typescript
// Increase wait time for language server to process
await new Promise((resolve) => setTimeout(resolve, 3000))

// Check if document is actually open
assert.ok(document.isClosed === false, 'Document should be open')
```

#### Completions not triggering

```typescript
// Ensure proper trigger character
const completions = await vscode.commands.executeCommand<vscode.CompletionList>(
  'vscode.executeCompletionItemProvider',
  document.uri,
  position,
  '@' // Trigger character
)
```

#### Webview not rendering

```typescript
// Check if panel was created
const ext = vscode.extensions.getExtension(
  'proto-typed.proto-typed-vscode-extension'
)
const api = ext!.exports
const panel = api.getCurrentPanel()
assert.ok(panel, 'Panel should exist')

// Increase wait time for rendering
await new Promise((resolve) => setTimeout(resolve, 3000))
```

### Debug Mode

Run tests with VSCode debugging:

1. Open `packages/extension` in VSCode
2. Set breakpoints in test files
3. Press `F5` or use "Run > Start Debugging"
4. Select "Extension Tests" launch configuration
5. Tests will run with debugger attached

### Verbose Logging

```typescript
// Enable console logging in tests
suite('Debug Tests', () => {
  test('With logging', async () => {
    console.log('Starting test...')
    const result = await someOperation()
    console.log('Result:', result)
    assert.ok(result)
  })
})
```

## � Known Issues & Solutions

### 1. ES Module Resolution Error (CRITICAL)

**Error**:

```
Cannot find module 'C:\...\packages\core\dist\lexer\tokens\index'
```

**Status**: 🔴 Blocking 5 of 12 tests

**Solution**: See [IMPLEMENTATION_ANALYSIS.md](./IMPLEMENTATION_ANALYSIS.md) - Sprint 1  
**TL;DR**: Implement esbuild bundler (2-3 hours)

---

### 2. Flaky Tests Due to setTimeout

**Issue**: Tests use fixed timeouts instead of conditional polling

**Impact**:

- ⚠️ Intermittent failures
- ⏱️ Unnecessarily slow tests

**Solution**: See [VSCODE_TESTING_BEST_PRACTICES.md](./VSCODE_TESTING_BEST_PRACTICES.md#6-espera-assíncrona-adequada)  
**TL;DR**: Replace all `setTimeout` with `waitFor` helper (1-2 hours)

---

### 3. Code Duplication

**Files**:

- `run-simple.ts` vs `run-tests.ts`
- `suite-simple/` vs `suite/`
- `e2e-simple/` vs `e2e/`

**Impact**: 30% duplicated code, double maintenance

**Solution**: See [IMPLEMENTATION_ANALYSIS.md](./IMPLEMENTATION_ANALYSIS.md#3-eliminar-duplicação)  
**TL;DR**: Remove duplicate runners and suites (1 hour)

---

### 4. Missing Code Coverage

**Status**: ❌ Not configured

**Solution**: See [EXECUTIVE_SUMMARY.md](./EXECUTIVE_SUMMARY.md#-fase-3-excelência-1-2-dias---recomendado)  
**TL;DR**: Add c8 or nyc integration (1 hour)

---

## 📊 Test Coverage

⚠️ **Code coverage is not currently configured.**

To add coverage support:

```bash
# Install coverage tool
pnpm add -D c8

# Update package.json
"test:coverage": "c8 pnpm test:extension:e2e"

# Run with coverage
pnpm test:coverage

# View report
open coverage/index.html
```

See [IMPLEMENTATION_ANALYSIS.md](./IMPLEMENTATION_ANALYSIS.md) for detailed implementation guide.

---

## 🤝 Contributing

When adding new features to the extension:

1. **Add fixtures**: Create test `.pty` files in `fixtures/`
2. **Write tests**: Add corresponding test files in `integration/` or `e2e/`
3. **Update snapshots**: Run `pnpm test:snapshots` if render output changes
4. **Verify CI**: Ensure tests pass in headless mode
5. **Document**: Update this README with new test scenarios

## 📚 References

- [VSCode Extension Testing Guide](https://code.visualstudio.com/api/working-with-extensions/testing-extension)
- [@vscode/test-electron Documentation](https://github.com/microsoft/vscode-test)
- [Mocha Documentation](https://mochajs.org/)
- [LSP Specification](https://microsoft.github.io/language-server-protocol/)

## 📝 License

Apache License 2.0 - See LICENSE file for details
