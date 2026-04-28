module.exports = {
  testEnvironment: 'node',
  // Only run integration tests under tests/integration to avoid picking up Playwright tests
  testMatch: ['**/tests/integration/**/*.test.js', '**/tests/integration/**/*.spec.js'],
  verbose: true,
}
