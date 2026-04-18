import tseslint from '@typescript-eslint/eslint-plugin'
import tsparser from '@typescript-eslint/parser'
import importPlugin from 'eslint-plugin-import'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import unusedImports from 'eslint-plugin-unused-imports'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import tokensPlugin from './packages/design-tokens/eslint-plugin-tokens.js'

const __dirname = dirname(fileURLToPath(import.meta.url))

/** @type {import("eslint").Linter.FlatConfig[]} */
export default [
  // ─── Global ignores ────────────────────────────────────────────────────────
  {
    ignores: [
      '**/dist/**',
      '**/node_modules/**',
      '**/.turbo/**',
      '**/storybook-static/**',
      '**/generated/**',
      '**/*.js',
      '**/*.cjs',
      '**/*.mjs',
      '**/*.d.ts',
      '**/next-env.d.ts',
      '**/types/**',
      '!.storybook/**/*.js',
    ],
  },

  // ─── TypeScript (base) ─────────────────────────────────────────────────────
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.mts', '**/*.cts', '**/*.stories.tsx'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      import: importPlugin,
      'unused-imports': unusedImports,
    },
    rules: {
      ...tseslint.configs.recommended.rules,

      'unused-imports/no-unused-imports': 'error',

      'unused-imports/no-unused-vars': [
        'error',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
    },
  },

  // ─── TypeScript (type-aware) ───────────────────────────────────────────────
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.mts', '**/*.cts'],
    ignores: [
      'apps/storefront/**',
      'apps/admin/**',
      'packages/ui-admin/**',
      'packages/ui-storefront/**',
      '.storybook/**',
    ],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: true,
        tsconfigRootDir: process.cwd(),
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      ...tseslint.configs['recommended-type-checked'].rules,
      ...tseslint.configs['strict-type-checked'].rules,
    },
  },

  // ─── React / JSX ───────────────────────────────────────────────────────────
  {
    files: ['**/*.tsx', '**/*.stories.tsx'],
    plugins: {
      react,
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',

      'react/jsx-uses-react': 'off',
      'react/react-in-jsx-scope': 'off',

      'jsx-a11y/alt-text': 'warn',
      'jsx-a11y/anchor-has-content': 'warn',
      'jsx-a11y/click-events-have-key-events': 'warn',
      'jsx-a11y/no-static-element-interactions': 'warn',
    },
  },

  // ─── Import sorting & structure (MAIN LOGIC) ───────────────────────────────
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.mts', '**/*.cts'],
    plugins: {
      import: importPlugin,
    },
    rules: {
      'import/order': [
        'error',
        {
          groups: [['builtin', 'external'], ['internal'], ['parent', 'sibling', 'index']],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
          pathGroupsExcludedImportTypes: [],
          pathGroups: [
            { pattern: 'react', group: 'builtin', position: 'before' },
            { pattern: 'reflect-metadata', group: 'builtin', position: 'before' },
            { pattern: 'lucide-react', group: 'external', position: 'after' },
            { pattern: '@ecom/**', group: 'internal', position: 'after' },
            { pattern: '@/**', group: 'internal', position: 'after' },
          ],
        },
      ],

      'import/no-duplicates': 'error',
      'import/newline-after-import': 'error',
      'import/first': 'error',

      'import/no-default-export': 'off',
    },
  },

  // ─── Stories import order (Prettier handles it) ────────────────────────────
  {
    files: ['**/*.stories.tsx'],
    plugins: {
      import: importPlugin,
    },
    rules: {
      'import/order': 'off',
      'import/no-duplicates': 'error',
      'import/newline-after-import': 'error',
      'import/first': 'error',
      'import/no-default-export': 'off',
    },
  },

  // ─── NestJS specific ──────────────────────────────────────────────────────
  {
    files: ['apps/api/**/*.ts', 'apps/worker/**/*.ts'],
    rules: {
      'no-console': 'warn',
      'no-debugger': 'error',
    },
  },

  // ─── Design token enforcement ──────────────────────────────────────────────
  // Blocks raw hex colors, bare px values, and raw Tailwind palette utilities
  // in all component files across ui, ui-admin, and ui-storefront.
  // Does NOT apply to packages/design-tokens/ (the token source itself).
  {
    files: [
      'packages/ui/src/**/*.ts',
      'packages/ui/src/**/*.tsx',
      'packages/ui-admin/src/**/*.ts',
      'packages/ui-admin/src/**/*.tsx',
      'packages/ui-storefront/src/**/*.ts',
      'packages/ui-storefront/src/**/*.tsx',
    ],
    plugins: {
      '@ecom/tokens': tokensPlugin,
    },
    rules: {
      '@ecom/tokens/no-raw-design-values': 'error',
    },
  },

  // ─── Tier-boundary enforcement ──────────────────────────────────────────────
  // Catches raw Tailwind palette utilities in JSX className attributes
  // within UI component files — atoms, molecules, and organisms.
  {
    files: [
      'packages/ui/src/**/*.tsx',
      'packages/ui/src/components/ui/**/*.tsx',
      'packages/ui-admin/src/**/*.tsx',
      'packages/ui-storefront/src/**/*.tsx',
    ],
    plugins: {
      '@ecom/tokens': tokensPlugin,
    },
    rules: {
      '@ecom/tokens/tier-boundary': 'error',
    },
  },

  // ─── ui-storefront: import boundary enforcement ────────────────────────────
  {
    files: ['packages/ui-storefront/src/**/*'],
    plugins: {
      import: importPlugin,
    },
    rules: {
      'import/no-restricted-paths': ['error', {
        zones: [
          {
            target: ['packages/ui-storefront/src/**/*'],
            from: '@ecom/ui/components/ui',
            message: 'components/ui is internal. Import from @ecom/ui or @ecom/ui/atoms/X instead.',
          },
          {
            target: ['packages/ui-storefront/src/**/*'],
            from: '@ecom/ui/src/',
            message: 'Do not import from internal src/ paths. Use the package root @ecom/ui or @ecom/ui/atoms/X instead.',
          },
          {
            target: ['packages/ui-storefront/src/**/*'],
            from: '@ecom/ui-storefront/src/',
            message: 'Do not import from internal src/ paths. Use the package root @ecom/ui-storefront or relative paths.',
          },
        ],
      }],
    },
  },

  // ─── ui-admin: import boundary enforcement ──────────────────────────────
  {
    files: ['packages/ui-admin/src/**/*'],
    plugins: {
      import: importPlugin,
    },
    rules: {
      'import/no-restricted-paths': ['error', {
        zones: [
          {
            target: ['packages/ui-admin/src/**/*'],
            from: '@ecom/ui/components/ui',
            message: 'components/ui is internal. Import from @ecom/ui or @ecom/ui/atoms/X instead.',
          },
          {
            target: ['packages/ui-admin/src/**/*'],
            from: '@ecom/ui/src/',
            message: 'Do not import from internal src/ paths. Use the package root @ecom/ui or @ecom/ui/atoms/X instead.',
          },
          {
            target: ['packages/ui-admin/src/**/*'],
            from: '@ecom/ui-admin/src/',
            message: 'Do not import from internal src/ paths. Use the package root @ecom/ui-admin or relative paths.',
          },
        ],
      }],
    },
  },

  // ─── @ecom/ui: atomic-layer enforcement ────────────────────────────────────
  // Atoms cannot import molecules or organisms
  {
    files: ['packages/ui/src/atoms/**/*'],
    plugins: {
      import: importPlugin,
    },
    rules: {
      'import/no-restricted-paths': ['error', {
        zones: [
          {
            target: ['packages/ui/src/atoms/**/*'],
            from: 'packages/ui/src/molecules/',
            message: 'Atoms cannot import molecules.',
          },
          {
            target: ['packages/ui/src/atoms/**/*'],
            from: 'packages/ui/src/organisms/',
            message: 'Atoms cannot import organisms.',
          },
        ],
      }],
    },
  },

  // Molecules cannot import organisms
  {
    files: ['packages/ui/src/molecules/**/*'],
    plugins: {
      import: importPlugin,
    },
    rules: {
      'import/no-restricted-paths': ['error', {
        zones: [
          {
            target: ['packages/ui/src/molecules/**/*'],
            from: 'packages/ui/src/organisms/',
            message: 'Molecules cannot import organisms.',
          },
        ],
      }],
    },
  },

  // No direct access to shadcn primitives (components/ui is internal)
  {
    files: ['packages/ui/src/**/*'],
    plugins: {
      import: importPlugin,
    },
    rules: {
      'import/no-restricted-paths': ['error', {
        zones: [
          {
            target: ['packages/ui/src/**/*'],
            from: 'packages/ui/src/components/ui/',
            message: 'components/ui is internal. Use atoms or molecules instead.',
          },
        ],
      }],
    },
  },
]
