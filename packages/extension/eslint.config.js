import baseConfig from '../../eslint.config.js'

/**
 * ESLint configuration for the extension package
 * Extends the base configuration with VSCode extension-specific rules
 */
export default [
  ...baseConfig,
  {
    files: ['**/*.ts'],
    languageOptions: {
      globals: {
        // VSCode extension environment
        acquireVsCodeApi: 'readonly',
      },
    },
    rules: {
      // VSCode extensions often use console for logging
      'no-console': 'off',

      // Extension-specific rules
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
]
