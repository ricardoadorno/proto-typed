# Git Hooks with Husky

This project uses [Husky](https://typicode.github.io/husky/) to automate validations in Git hooks.

## Configured Hooks

### 🔍 Pre-commit

Executed **before each commit**.

**Validations:**

- Lint (ESLint) on staged files
- Format (Prettier) on staged files
- Type check (TypeScript)

### 📝 Commit-msg

Executed **when creating a commit message**.

**Validations:**

- Validates message format using [Conventional Commits](https://www.conventionalcommits.org/)

**Accepted format:**

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Allowed types:**

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting (does not affect code)
- `refactor`: Refactoring
- `perf`: Performance improvement
- `test`: Tests
- `build`: Build system
- `ci`: CI/CD
- `chore`: General tasks
- `revert`: Revert commit

**Valid examples:**

```bash
git commit -m "feat: add new parser for components"
git commit -m "fix(lexer): resolve token recognition issue"
git commit -m "docs: update README with installation steps"
git commit -m "refactor(core): improve error handling"
```

### 🚀 Pre-push

Executed **before pushing**.

**Validations:**

- Type check in all packages
- Unit tests (Vitest)

## Bypassing Hooks (Not Recommended)

In exceptional cases, you can bypass the hooks:

```bash
# Bypass pre-commit
git commit --no-verify -m "message"

# Bypass pre-push
git push --no-verify
```

**⚠️ Attention:** Use only in emergencies. The hooks exist to maintain code quality.

## Disable Temporarily

To temporarily disable all hooks:

```bash
# Disable
git config core.hooksPath /dev/null

# Re-enable
git config core.hooksPath .husky
```

## Common Issues

### Hook does not run

```bash
# Reinstall hooks
pnpm prepare
```

### Permission denied (Linux/Mac)

```bash
chmod +x .husky/pre-commit
chmod +x .husky/commit-msg
chmod +x .husky/pre-push
```

### CI failing

The `prepare` script has `|| true` to avoid failing in environments without Git (like some CIs).
