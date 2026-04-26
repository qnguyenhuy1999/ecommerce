module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  watchman: false,
  roots: ['<rootDir>/test'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  testMatch: ['**/*.spec.ts'],
  moduleNameMapper: {
    '^@ecom/database$': '<rootDir>/../../packages/database/src',
    '^@ecom/email$': '<rootDir>/../../packages/email/src',
    '^@ecom/constants$': '<rootDir>/../../packages/constants/src',
    '^@ecom/redis$': '<rootDir>/../../packages/redis/src',
    '^@ecom/shared$': '<rootDir>/../../packages/shared/src',
    '^@ecom/shared/(.*)$': '<rootDir>/../../packages/shared/src/$1',
  },
}
