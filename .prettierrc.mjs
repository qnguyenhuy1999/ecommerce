/**
 * @type {import("prettier").Config}
 */
export default {
  semi: false,
  singleQuote: true,
  trailingComma: "all",
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  bracketSameLine: false,
  bracketSpacing: true,
  arrowParens: "always",
  endOfLine: "lf",
  plugins: [
    "@trivago/prettier-plugin-sort-imports",
  ],
  importOrderSeparation: true,
  importOrder: [
    "^react$",
    "^reflect-metadata$",
    "^lucide-react$",
    "^(@ecom/.*)$",
    "^(@/.*)$",
    "^[./]",
  ],
  overrides: [
    {
      files: "*.{json,yaml,yml,md,mdx}",
      options: {
        tabWidth: 2,
        printWidth: 120,
        proseWrap: "preserve",
      },
    },
    {
      files: "*.stories.tsx",
      options: {
        printWidth: 120,
        bracketSameLine: true,
      },
    },
  ],
}
