module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  watchman: false,
  roots: ['<rootDir>/test'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  testMatch: ['**/*.spec.ts'],
  moduleNameMapper: {
    '^@ecom/database$': '<rootDir>/../../packages/database/src',
    '^@ecom/nest-auth$': '<rootDir>/../../packages/nest-auth/src',
    '^@ecom/constants$': '<rootDir>/../../packages/constants/src',
    '^@ecom/redis$': '<rootDir>/../../packages/redis/src',
    '^@ecom/shared$': '<rootDir>/../../packages/shared/src',
    '^@ecom/shared/(.*)$': '<rootDir>/../../packages/shared/src/$1',
  },
}
