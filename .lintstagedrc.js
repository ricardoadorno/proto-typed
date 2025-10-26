export default {
  // TypeScript/JavaScript files
  '*.{js,jsx,ts,tsx,mjs,cjs}': [
    'eslint --fix',
    'prettier --write',
    () => 'tsc --noEmit', // Type check all files
  ],

  // JSON, YAML, Markdown files
  '*.{json,yaml,yml,md,mdx}': ['prettier --write'],

  // CSS files
  '*.{css,scss,sass,less}': ['prettier --write'],

  // Package files - reinstall dependencies if changed
  'package.json': ['prettier --write'],
  'pnpm-lock.yaml': () => 'pnpm install --frozen-lockfile',
}
