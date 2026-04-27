import { defineConfig } from 'tsup'

export default defineConfig({
  entry: [
    'src/index.ts',
    'src/providers/ThemeProvider.tsx',
    'src/utils/index.ts',
    'src/react/index.ts',
    'src/variants/index.ts',
    'src/pagination/index.ts',
  ],
  format: ['esm', 'cjs'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom'],
  esbuildOptions(options) {
    options.jsx = 'automatic'
  },
})
