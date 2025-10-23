import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import prettierConfig from 'eslint-config-prettier'
import prettierPlugin from 'eslint-plugin-prettier'

/**
 * Base ESLint configuration for the monorepo
 * This configuration is shared across all packages
 */
export default [
  // Global ignores
  {
    ignores: [
      '**/dist/**',
      '**/out/**',
      '**/build/**',
      '**/node_modules/**',
      '**/.next/**',
      '**/coverage/**',
      '**/*.config.js',
      '**/*.config.mjs',
      '**/next-env.d.ts',
      '**/*.tsbuildinfo',
    ],
  },
  // Base configs
  js.configs.recommended,
  ...tseslint.configs.recommended,
  // Base configuration for all TypeScript files
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.node,
        ...globals.browser,
      },
    },
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      // Prettier integration
      'prettier/prettier': 'warn',

      // TypeScript specific rules
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true,
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',

      // General rules
      'no-console': 'off', // Permitir console em desenvolvimento
      'prefer-const': 'warn',
      'no-useless-escape': 'warn', // Warning ao invés de error
    },
  },
  // Prettier config must be last to override other formatting rules
  prettierConfig,
]
