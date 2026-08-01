import swc from 'unplugin-swc'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  oxc: false,
  resolve: { tsconfigPaths: true },
  test: {
    globals: true,
    root: './',
    include: ['src/**/*.spec.ts'],
    clearMocks: true,
    coverage: {
      provider: 'v8',
      reportsDirectory: 'coverage',
      include: ['src/**/*.ts'],
      exclude: [
        'src/**/*.spec.ts',
        'src/**/module.ts',
        'src/main.ts',
        'src/config/**',
        'src/database/**',
        'src/env/**',
        'src/generated/**',
        'src/modules/**/infra/**',
        'src/modules/**/presentation/**',
      ],
    },
  },
  plugins: [
    swc.vite({
      module: { type: 'es6' },
      jsc: {
        parser: { syntax: 'typescript', decorators: true },
        target: 'es2024',
        transform: { legacyDecorator: true, decoratorMetadata: true },
      },
      sourceMaps: true,
    }),
  ],
})
