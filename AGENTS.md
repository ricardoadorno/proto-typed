# Repository Guidelines

## Project Structure & Module Organization
This monorepo is managed with PNPM workspaces and is split into three primary packages. `packages/core` contains the parser, renderer, and shared types (source in `src`, specs in `tests`). `packages/extension` holds the VS Code extension (`src`), published assets under `icons/`, `snippets/`, `syntaxes/`, and scenario fixtures in `test-workspace/`. `packages/web` is the Next.js documentation site and playground (`src/app` with static assets in `public/`, and stories under `src/docs`). Shared configuration sits at the root (`eslint.config.js`, `tsconfig.json`, `vitest.config.ts`); build artifacts are emitted to `dist/` or `out/` and should not be edited manually.

## Build, Test, and Development Commands
Use PNPM from the repository root. `pnpm install` restores workspace dependencies. `pnpm dev` runs the docs/playground at `localhost:3000`; use `pnpm -F @proto-typed/extension compile` to rebuild the VS Code bundle. `pnpm build` creates a production Next.js build, while `pnpm compile:core` runs `tsc` on the core library. Quality gates: `pnpm lint` (ESLint), `pnpm format:check`, and `pnpm typecheck` (project references).

## Coding Style & Naming Conventions
Follow the shared ESLint + Prettier profile (2-space indentation, single quotes where practical). Keep TypeScript strictness: prefer explicit interfaces and avoid `any` unless the warning is justified. Use `camelCase` for helpers, `PascalCase` for React components and exported types, and `SCREAMING_SNAKE_CASE` only for constants that are shared across modules. Run `pnpm lint:fix` or `pnpm format` before committing to resolve stylistic issues automatically.

## Testing Guidelines
Vitest is used for unit coverage (`packages/*/tests/**/*.test.ts`). Local runs: `pnpm test` for watch mode, `pnpm test:run` for CI-equivalent, and `pnpm test:coverage` when updating core logic. The web package owns end-to-end Playwright suites under `packages/web/tests/e2e`; execute `pnpm test:e2e` (headless) or `pnpm test:e2e:ui` for debugging. Extension smoke scenarios rely on the sample projects in `packages/extension/test-workspace`; keep fixtures minimal and document new ones in the PR.

## Commit & Pull Request Guidelines
Recent history mixes bare `chore` messages with Conventional Commit prefixes (`feat:`, `fix:`, `chore:`). Prefer the conventional format so release notes stay coherent (`<type>[optional scope]: <imperative summary>`). Keep commits scoped to a single concern and include tests when behaviour changes. Pull requests should describe motivation, note impacted packages, link tracking issues, and add screenshots or terminal output for UI or tooling changes. Ensure CI passes (`pnpm lint`, `pnpm test:run`, optional `pnpm test:e2e`) before requesting review.
