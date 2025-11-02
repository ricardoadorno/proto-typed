import baseConfig from '../../eslint.config.js'

/**
 * ESLint configuration for the extension package
 * Extends the base configuration with VSCode extension-specific rules
 */
export default [
  ...baseConfig,
  {
    ignores: ['packages/core/tests/**'],
  },
  {
    files: ['**/*.ts'],
    languageOptions: {
      globals: {
        acquireVsCodeApi: 'readonly',
      },
    },
    rules: {
      'no-console': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
]
