import tseslint from '@typescript-eslint/eslint-plugin';
import tseslintParser from '@typescript-eslint/parser';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';
import tailwindcss from 'eslint-plugin-tailwindcss';

export default [
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      '@typescript-eslint': tseslint,
      prettier: prettierPlugin,
      tailwindcss: tailwindcss,
    },
    languageOptions: {
      parser: tseslintParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    rules: {
      ...tseslint.configs['recommended'].rules,
      ...tailwindcss.configs['recommended'].rules,
      'prettier/prettier': 'error',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
  {
    ignores: ['**/dist/**', '**/node_modules/**', '**/.next/**', '**/out/**'],
  },
  prettierConfig,
];
