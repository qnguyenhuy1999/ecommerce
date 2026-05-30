import { resolve } from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
  resolve: {
    alias: [
      {
        find: /^@ecom\/shared\/pagination\/prisma\/(.+)$/,
        replacement: resolve(__dirname, '../../packages/shared/src/pagination/prisma/$1.ts'),
      },
      {
        find: '@ecom/shared/pagination/prisma',
        replacement: resolve(__dirname, '../../packages/shared/src/pagination/prisma/index.ts'),
      },
      {
        find: /^@ecom\/contracts\/enums\/(.+)$/,
        replacement: resolve(__dirname, '../../packages/contracts/src/enums/$1.ts'),
      },
      {
        find: '@ecom/contracts/enums',
        replacement: resolve(__dirname, '../../packages/contracts/src/enums/index.ts'),
      },
    ],
  },
})
