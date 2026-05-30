import { resolve } from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    passWithNoTests: true,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@ecom/contracts': resolve(__dirname, '../../packages/contracts/src/index.ts'),
      '@ecom/contracts/generated': resolve(
        __dirname,
        '../../packages/contracts/src/generated/index.ts',
      ),
    },
  },
})
