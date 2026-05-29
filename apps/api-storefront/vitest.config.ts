import { resolve } from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
  resolve: {
    alias: {
      '@ecom/shared/pagination/prisma': resolve(
        __dirname,
        '../../packages/shared/src/pagination/prisma/index.ts',
      ),
      '@ecom/contracts/enums': resolve(__dirname, '../../packages/contracts/src/enums/index.ts'),
    },
  },
})
