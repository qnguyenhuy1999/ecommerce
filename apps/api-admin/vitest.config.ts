import { resolve } from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
  resolve: {
    alias: {
      '@ecom/contracts': resolve(__dirname, '../../packages/contracts/src/index.ts'),
      '@ecom/contracts/generated': resolve(
        __dirname,
        '../../packages/contracts/src/generated/index.ts',
      ),
    },
  },
})
