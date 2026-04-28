// Playwright config for Music Vibe E2E tests (ES Module)
/** @type {import('@playwright/test').PlaywrightTestConfig} */
export default {
  timeout: 30 * 1000,
  use: {
    baseURL: 'http://localhost:5173',
    headless: true,
    viewport: { width: 1280, height: 800 },
    ignoreHTTPSErrors: true,
  },
  // Prefer local Chrome when available
  projects: [
    { name: 'chromium', use: { channel: 'chrome' } },
  ],
  testDir: 'e2e',
}
