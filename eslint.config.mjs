/**
 * Root ESLint config for the CharchaGram monorepo.
 *
 * Each app may extend this with its own overrides (e.g. apps/frontend uses
 * eslint-config-next which adds React / Next.js-specific rules).
 */
import js from '@eslint/js';

export default [
  js.configs.recommended,
  {
    ignores: [
      '**/node_modules/**',
      '**/.next/**',
      '**/dist/**',
      '**/build/**',
      '**/coverage/**',
      'apps/backend/src/migrations/**',
      'apps/backend/src/dataBackup/**',
      'apps/backend/src/databaseRestore/**',
    ],
  },
  {
    files: ['apps/backend/src/**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        process: 'readonly',
        console: 'readonly',
      },
    },
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-console': 'off',
    },
  },
];
