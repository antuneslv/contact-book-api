import type { Config } from 'jest'

const config: Config = {
  testEnvironment: 'node',
  rootDir: '.',
  testMatch: ['<rootDir>/src/**/*.spec.ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  transform: { '^.+\\.(t|j)s$': '@swc/jest' },
  moduleNameMapper: { '^@/(.*)$': '<rootDir>/src/$1' },
  clearMocks: true,
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.spec.ts',
    '!src/**/*.module.ts',
    '!src/main.ts',
    '!src/config/**',
    '!src/database/**',
    '!src/env/**',
    '!src/generated/**',
    '!src/modules/**/infra/**',
    '!src/modules/**/presentation/**',
  ],
  coverageDirectory: 'coverage',
}

export default config
