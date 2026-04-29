import { test, expect } from '@playwright/test'

test('Clerk signup page renders header and description', async ({ page }) => {
  await page.goto(`/clerk-signup`)
  await expect(page.locator('text=Join Music Vibe')).toBeVisible({ timeout: 8000 })
  await expect(page.locator('text=Create your account')).toBeVisible()
  // Ensure the Clerk SignUp has mounted a form (may be rendered by Clerk)
  await expect(page.locator('form').first()).toBeVisible({ timeout: 8000 })
})
