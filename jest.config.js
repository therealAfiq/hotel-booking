module.exports = {
  testEnvironment: 'node',
  // load .env.test before tests
  setupFiles: ['<rootDir>/tests/env.setup.js'],
  // start / stop in-memory mongo + per-suite helpers
  setupFilesAfterEnv: ['<rootDir>/tests/jest.setup.js', '<rootDir>/tests/setupAfterEnv.js'],
  moduleFileExtensions: ['js', 'json'],
  testMatch: ['**/tests/**/*.test.js'],
  clearMocks: true,
  restoreMocks: true,
  testTimeout: 30000,
  globalSetup: './tests/globalSetup.js',
  globalTeardown: './tests/globalTeardown.js'
};
