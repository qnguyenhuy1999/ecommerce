/** @type {import('stylelint').Config} */
export default {
  rules: {},
  overrides: [
    {
      files: ['packages/ui*/src/**/*.css'],
      rules: {
        // Disallow raw rgba() with numeric literal channels.
        // Use rgb(var(--token-rgb) / alpha) or rgb(0 0 0 / alpha) instead.
        'function-disallowed-list': ['/^rgba$/'],
      },
    },
  ],
}
