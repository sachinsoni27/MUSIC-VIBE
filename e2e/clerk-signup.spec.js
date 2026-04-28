import { test, expect } from '@playwright/test'

const BASE = process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:5187'

test('Clerk signup page renders header and description', async ({ page }) => {
  await page.goto(`${BASE}/clerk-signup`)
  await expect(page.locator('text=Sign up with Clerk')).toBeVisible({ timeout: 8000 })
  await expect(page.locator('text=Create your account')).toBeVisible()
  // Ensure the Clerk SignUp has mounted a form (may be rendered by Clerk)
  await expect(page.locator('form').first()).toBeVisible({ timeout: 8000 })
})
