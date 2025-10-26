# Git Hooks com Husky

Este projeto usa [Husky](https://typicode.github.io/husky/) para automatizar validações em Git hooks.

## Hooks Configurados

### 🔍 Pre-commit

Executado **antes de cada commit**.

**Validações:**

- Lint (ESLint) nos arquivos staged
- Format (Prettier) nos arquivos staged
- Type check (TypeScript)

### 📝 Commit-msg

Executado **ao criar mensagem de commit**.

**Validações:**

- Valida formato de mensagem usando [Conventional Commits](https://www.conventionalcommits.org/)

**Formato aceito:**

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Tipos permitidos:**

- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Documentação
- `style`: Formatação (não afeta código)
- `refactor`: Refatoração
- `perf`: Melhoria de performance
- `test`: Testes
- `build`: Sistema de build
- `ci`: CI/CD
- `chore`: Tarefas gerais
- `revert`: Reverter commit

**Exemplos válidos:**

```bash
git commit -m "feat: add new parser for components"
git commit -m "fix(lexer): resolve token recognition issue"
git commit -m "docs: update README with installation steps"
git commit -m "refactor(core): improve error handling"
```

### 🚀 Pre-push

Executado **antes de fazer push**.

**Validações:**

- Type check em todos os packages
- Testes unitários (Vitest)

## Bypassar Hooks (Não Recomendado)

Em casos excepcionais, você pode bypassar os hooks:

```bash
# Bypassar pre-commit
git commit --no-verify -m "message"

# Bypassar pre-push
git push --no-verify
```

**⚠️ Atenção:** Use apenas em emergências. Os hooks existem para manter a qualidade do código.

## Desabilitar Temporariamente

Para desabilitar todos os hooks temporariamente:

```bash
# Desabilitar
git config core.hooksPath /dev/null

# Reabilitar
git config core.hooksPath .husky
```

## Problemas Comuns

### Hook não executa

```bash
# Reinstalar hooks
pnpm prepare
```

### Permissão negada (Linux/Mac)

```bash
chmod +x .husky/pre-commit
chmod +x .husky/commit-msg
chmod +x .husky/pre-push
```

### CI falhando

O script `prepare` tem `|| true` para não falhar em ambientes sem Git (como alguns CI).
