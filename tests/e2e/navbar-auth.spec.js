const { test, expect } = require('@playwright/test')

const BASE = process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:5173'

test('Navbar shows Clerk sign-in when signed out', async ({ page }) => {
  await page.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' })
  await expect(page.locator('text=Sign in').first()).toBeVisible({ timeout: 8000 })
  await expect(page.locator('text=Sign Up')).toBeVisible()
  await page.click('text=Sign Up')
  await expect(page).toHaveURL(/\/clerk-signup/)
  await expect(page.locator('text=Sign up with Clerk')).toBeVisible()
})