/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+\.tsx?$': ['ts-jest', {}]
  },
  setupFiles: ['./jest.setup.js'],
  testMatch: ['<rootDir>/src/**/*.test.ts'],
  moduleNameMapper: {
    '^@dbsder-api-types$': '<rootDir>/src/dbsder-api-types/index'
  }
}
