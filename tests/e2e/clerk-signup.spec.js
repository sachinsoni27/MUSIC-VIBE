const { test, expect } = require('@playwright/test')

// Ensure dev server is running at http://localhost:5187 (Vite may pick a different port)
// We rely on PLAYWRIGHT_TEST_BASE_URL env var if set, otherwise default to http://localhost:5187
const BASE = process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:5187'

test.describe('Clerk Signup page', () => {
  test('renders Clerk signup UI and description', async ({ page }) => {
    await page.goto(`${BASE}/clerk-signup`, { waitUntil: 'domcontentloaded' })
    // Wait for our header text added in ClerkSignup component
    await expect(page.locator('text=Sign up with Clerk')).toBeVisible({ timeout: 5000 })
    await expect(page.locator('text=Create your account')).toBeVisible()
    await expect(page.locator('form').first()).toBeVisible({ timeout: 5000 })
  })
})
