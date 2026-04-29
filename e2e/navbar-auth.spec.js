import { test, expect } from '@playwright/test'

const BASE = process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:5173'

test('Navbar shows Clerk sign-in when signed out', async ({ page }) => {
  await page.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' })
  // SignInButton renders a 'Sign in' button (case-insensitive text search)
  await expect(page.locator('text=Sign in').first()).toBeVisible({ timeout: 8000 })

  // Sign Up link should exist and navigate to Clerk signup
  await expect(page.locator('text=Sign Up')).toBeVisible()
  await page.click('text=Sign Up')
  await expect(page).toHaveURL(new RegExp('/clerk-signup'))
  await expect(page.locator('text=Join Music Vibe')).toBeVisible()
})