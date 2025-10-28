# Contribution Guide

Thank you for contributing to Proto-Typed! This document provides guidelines for contributing to the project.

## 📋 Table of Contents

- [Environment Setup](#environment-setup)
- [Project Structure](#project-structure)
- [Commit Standards](#commit-standards)
- [Development Process](#development-process)
- [Testing](#testing)
- [Pull Requests](#pull-requests)

## 🛠️ Environment Setup

### Prerequisites

- Node.js 18+
- pnpm 9+
- Git

### Installation

```bash
# Clone repository
git clone https://github.com/your-user/proto-typed.git
cd proto-typed

# Install dependencies
pnpm install

# Compile core package
pnpm compile:core

# Start web development
pnpm dev
```

## 📁 Project Structure

```
proto-typed/
├── packages/
│   ├── core/         # Parser, Lexer, Renderer
│   ├── extension/    # VSCode Extension
│   └── web/          # Next.js Documentation Site
└── tests/            # Global tests
```

## 📝 Commit Standards

This project follows the [Conventional Commits](https://www.conventionalcommits.org/) standard.

### Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Allowed Types

| Type       | Description                 |
| ---------- | --------------------------- |
| `feat`     | New feature                 |
| `fix`      | Bug fix                     |
| `docs`     | Documentation changes       |
| `style`    | Formatting, semicolons, etc |
| `refactor` | Code refactoring            |
| `perf`     | Performance improvement     |
| `test`     | Adding or modifying tests   |
| `build`    | Changes to the build system |
| `ci`       | Changes to CI/CD            |
| `chore`    | Maintenance tasks           |
| `revert`   | Revert a previous commit    |

### Examples

#### Feature

```bash
feat(parser): add support for custom components

Implements custom component parsing with props validation.
Includes support for nested components and type checking.

Closes #123
```

#### Bug Fix

```bash
fix(lexer): resolve token recognition in nested layouts

Fixed an issue where tokens were not correctly identified
inside nested layout structures.

Fixes #456
```

#### Documentation

```bash
docs: update installation guide with pnpm instructions
```

#### Refactor

```bash
refactor(core): improve error handling in renderer

- Centralize error messages
- Add better type safety
- Improve error recovery
```

#### Performance

```bash
perf(parser): optimize AST building for large files

Reduced parsing time by 40% for files > 1000 lines.
```

### Suggested Scopes

- `core` - Core package (parser, lexer, renderer)
- `extension` - VSCode extension
- `web` - Web documentation
- `parser` - Specific parser
- `lexer` - Specific lexer
- `renderer` - Specific renderer
- `ci` - Continuous Integration
- `deps` - Dependencies

## 🔄 Development Process

### 1. Create Branch

```bash
# Feature
git checkout -b feat/new-feature

# Bug fix
git checkout -b fix/fix-bug

# Docs
git checkout -b docs/update-readme
```

### 2. Develop

```bash
# Watch mode for core
pnpm -F @proto-typed/core watch

# Dev mode for web
pnpm dev
```

### 3. Test

```bash
# Type checking
pnpm typecheck

# Unit tests
pnpm test:run

# E2E tests
pnpm test:e2e

# Lint
pnpm lint

# Format
pnpm format
```

### 4. Commit

The Git hooks will:

- ✅ **Pre-commit**: Lint and format staged files
- ✅ **Commit-msg**: Validate message format
- ✅ **Pre-push**: Run typecheck and tests

```bash
# Add files
git add .

# Commit (will be validated automatically)
git commit -m "feat(parser): add new feature"
```

### 5. Push

```bash
# Push (tests will run automatically)
git push origin feat/new-feature
```

## 🧪 Testing

### Unit Tests (Vitest)

```bash
# Watch mode
pnpm test

# Run once
pnpm test:run

# Coverage
pnpm test:coverage

# UI
pnpm test:ui
```

### E2E Tests (Playwright)

```bash
# Run tests
pnpm test:e2e

# Debug mode
pnpm test:e2e:debug

# UI mode
pnpm test:e2e:ui
```

### Writing Tests

#### Unit Tests

```typescript
// packages/core/src/parser/__tests__/parser.test.ts
import { describe, it, expect } from 'vitest'
import { Parser } from '../parser'

describe('Parser', () => {
  it('should parse simple screen', () => {
    const result = Parser.parse('screen Home {}')
    expect(result.errors).toHaveLength(0)
  })
})
```

#### E2E Tests

```typescript
// tests/e2e/docs.spec.ts
import { test, expect } from '@playwright/test'

test('should navigate to docs', async ({ page }) => {
  await page.goto('/')
  await page.click('text=Documentation')
  await expect(page).toHaveURL(/\/docs/)
})
```

## 🔀 Pull Requests

### Checklist

Before opening a PR, make sure that:

- [ ] Code follows project standards
- [ ] Tests have been added/updated
- [ ] Documentation has been updated
- [ ] Commits follow Conventional Commits
- [ ] All tests pass
- [ ] Typecheck passes
- [ ] Lint passes
- [ ] There are no conflicts with the main branch

### PR Template

```markdown
## Description

Brief description of the changes.

## Type of Change

- [ ] Bug fix (non-breaking change)
- [ ] New feature (non-breaking change)
- [ ] Breaking change
- [ ] Documentation update

## How to Test

1. Step 1
2. Step 2
3. Step 3

## Checklist

- [ ] Code reviewed
- [ ] Tests added
- [ ] Documentation updated
- [ ] CI/CD passes

## Screenshots (if applicable)
```

## 💡 Tips

### Bypass Hooks (Not Recommended)

```bash
# Only in emergencies
git commit --no-verify
git push --no-verify
```

### Debugging Tests

```bash
# Vitest debug
pnpm test:ui

# Playwright debug
pnpm test:e2e:debug
```

### Clear Cache

```bash
# Clear node_modules
pnpm clean
node -e "require('fs').rmSync('node_modules', { recursive: true, force: true })"
pnpm install

# Clear build
node -e "const fs=require('fs');const path=require('path');for (const dir of fs.readdirSync('packages')){const dist=path.join('packages',dir,'dist');if(fs.existsSync(dist)) fs.rmSync(dist,{recursive:true,force:true});}"
pnpm compile:core
```

## 🐛 Reporting Bugs

When reporting bugs, include:

1. Node.js version
2. pnpm version
3. Operating system
4. Steps to reproduce
5. Expected vs. actual behavior
6. Screenshots (if applicable)

## ❓ Questions

If you have questions:

1. Check the [documentation](./README.md)
2. Search in [existing issues](https://github.com/your-user/proto-typed/issues)
3. Open a new issue with the `question` tag

---

Thank you for contributing! 🎉
