import swc from 'unplugin-swc'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  oxc: false,
  resolve: { tsconfigPaths: true },
  test: {
    globals: true,
    root: './',
    include: ['**/*.e2e-spec.ts'],
    setupFiles: ['./test/setup-e2e.ts'],
    clearMocks: true,
    hookTimeout: 30_000,
  },
  plugins: [
    swc.vite({
      module: { type: 'es6' },
      jsc: {
        parser: { syntax: 'typescript', decorators: true },
        target: 'es2024',
        keepClassNames: true,
        transform: { legacyDecorator: true, decoratorMetadata: true },
      },
      sourceMaps: true,
    }),
  ],
})
