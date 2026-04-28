// Playwright config (CommonJS) for Music Vibe E2E tests
/** @type {import('@playwright/test').PlaywrightTestConfig} */
module.exports = {
  timeout: 30 * 1000,
  use: {
    baseURL: 'http://localhost:5173',
    headless: true,
    viewport: { width: 1280, height: 800 },
    ignoreHTTPSErrors: true,
  },
  // Run on local Chrome if available (falls back to Playwright browsers)
  projects: [
    { name: 'chromium', use: { channel: 'chrome' } },
  ],
  testDir: 'e2e',
}
