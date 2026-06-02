// ESLint flat config
import js from '@eslint/js'
import globals from 'globals'

export default [
  { ignores: ['archive/', '.local/', 'docs/.vitepress/', 'dist/', 'node_modules/'] },
  {
    ...js.configs.recommended,
    files: ['**/*.js'],
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      ecmaVersion: 2022,
      sourceType: 'module',
    },
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-console': 'off',
      'prefer-const': 'warn',
    },
  },
]
