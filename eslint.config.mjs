import nx from '@nx/eslint-plugin';
import parser from '@typescript-eslint/parser';
import { flatConfigs as eslintPluginImport } from 'eslint-plugin-import';
import eslintPluginPrettier from 'eslint-plugin-prettier/recommended';
import { configs as ts } from 'typescript-eslint';

export default [
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],

  {
    ignores: [
      '**/dist',
      '**/eslint.config.mjs',
      '**/jest.config.ts',
      '**/postcss.config.js',
      '**/tailwind.config.js',
      '**/webpack.config.ts',
      '**/.next',
    ],
  },

  eslintPluginImport.recommended,
  eslintPluginImport.typescript,
  ...ts.strictTypeChecked,
  {
    languageOptions: {
      parser,
      parserOptions: {
        projectService: {},
        tsconfigRootDir: import.meta.dirname,
      },
    },
    settings: {
      'import/resolver': {
        typescript: {
          project: [
            'apps/api/tsconfig.json',
            'apps/api-e2e/tsconfig.json',
            'apps/web/tsconfig.json',
            'apps/web-e2e/tsconfig.json',
            'tsconfig.base.json',
          ],
        },
      },
    },
  },

  {
    files: ['**/generated.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-redundant-type-constituents': 'off',
    },
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      '@typescript-eslint/no-extraneous-class': 'off',
      '@typescript-eslint/no-unnecessary-type-parameters': 'off',
      '@typescript-eslint/no-unnecessary-type-conversion': 'off',
      '@typescript-eslint/parameter-properties': [
        2,
        {
          allow: ['public readonly', 'protected readonly', 'private readonly'],
        },
      ],
      '@typescript-eslint/no-unnecessary-condition': 'off',
      '@typescript-eslint/restrict-template-expressions': [
        'error',
        {
          allowNumber: true,
        },
      ],
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '(^_|^[a-z]$)',
          varsIgnorePattern: '(^_|^[a-z]$)',
          caughtErrorsIgnorePattern: '(^_|^[a-z]$)',
        },
      ],
      '@typescript-eslint/no-misused-promises': 'off',
      '@nx/enforce-module-boundaries': 'off',
    },
  },
  {
    files: ['**/generated.ts'],
    rules: { '@typescript-eslint/no-explicit-any': 'off' },
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
  },
  eslintPluginPrettier,
];
