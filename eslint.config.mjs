import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsparser from "@typescript-eslint/parser";
import importPlugin from "eslint-plugin-import";
import reactHooks from "eslint-plugin-react-hooks";
import jsxA11y from "eslint-plugin-jsx-a11y";
import react from "eslint-plugin-react";

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {import("eslint").Linter.FlatConfig[]} */
export default [
  {
    ignores: [
      "**/dist/**",
      "**/node_modules/**",
      "**/.turbo/**",
      "**/storybook-static/**",
      "**/generated/**",
      "**/*.js",
      "**/*.cjs",
      "**/*.mjs",
      "!**/.storybook/**/*.js",
    ],
  },

  // ─── TypeScript: recommended (no type info needed) ──────────────────────────
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.mts", "**/*.cts"],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    plugins: {
      "@typescript-eslint": tseslint,
      import: importPlugin,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
    },
  },

  // ─── TypeScript: type-checked (needs project) ──────────────────────────────
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.mts", "**/*.cts"],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        project: true,
        tsconfigRootDir: process.cwd(),
      },
    },
    plugins: {
      "@typescript-eslint": tseslint,
    },
    rules: {
      ...tseslint.configs["recommended-type-checked"].rules,
      ...tseslint.configs["strict-type-checked"].rules,
    },
  },

  // ─── React / JSX ───────────────────────────────────────────────────────────
  {
    files: ["**/*.tsx"],
    plugins: {
      "react-hooks": reactHooks,
      react,
      "jsx-a11y": jsxA11y,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
    rules: {
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "react/jsx-uses-react": "off",
      "react/react-in-jsx-scope": "off",
      "jsx-a11y/alt-text": "warn",
      "jsx-a11y/anchor-has-content": "warn",
      "jsx-a11y/click-events-have-key-events": "warn",
      "jsx-a11y/no-static-element-interactions": "warn",
    },
  },

  // ─── Import helpers (no type info) ─────────────────────────────────────────
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.mts", "**/*.cts"],
    plugins: { import: importPlugin },
    rules: {
      "import/order": [
        "error",
        {
          groups: [
            ["type"],
            ["external"],
            ["internal"],
            ["parent", "sibling"],
          ],
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true },
          pathGroupsExcludedImportTypes: ["type"],
          pathGroups: [
            { pattern: "@ecom/**", group: "internal", position: "after" },
            { pattern: "@/**", group: "internal", position: "after" },
          ],
        },
      ],
      "import/no-duplicates": "error",
      "import/newline-after-import": "error",
      "import/first": "error",
      "import/no-default-export": "off",
    },
  },

  // ─── NestJS (api, worker) ──────────────────────────────────────────────────
  {
    files: ["apps/api/**/*.ts", "apps/worker/**/*.ts"],
    rules: {
      "no-console": "warn",
      "no-debugger": "error",
    },
  },

  // ─── Next.js (storefront, admin) ───────────────────────────────────────────
  {
    files: ["apps/storefront/**/*", "apps/admin/**/*"],
    rules: {
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
    },
  },
];