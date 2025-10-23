import baseConfig from '../../eslint.config.js'

/**
 * ESLint configuration for the core package
 * Extends the base configuration with core-specific rules
 */
export default [
  ...baseConfig,
  {
    files: ['**/*.ts'],
    rules: {
      // Core package - regras mais flexíveis durante desenvolvimento
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
    },
  },
]
