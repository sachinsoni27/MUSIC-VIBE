const { test, expect } = require('@playwright/test')

// Note: ensure frontend dev server is running at http://localhost:5173

test('user can log in and be redirected to dashboard', async ({ page }) => {
  await page.goto('/login')

  await page.fill('input[type="email"]', 'test@musicvibe.com')
  await page.fill('input[type="password"]', 'TestPass123')

  await Promise.all([
    page.waitForResponse((r) => r.url().includes('/api/auth/login') && r.status() === 200),
    page.click('button[type="submit"]'),
  ])

  // Message box with success
  const message = page.locator('.message-box.success')
  await expect(message).toBeVisible()
  await expect(message).toHaveText(/Login successful/i)

  // Redirect expectation
  await page.waitForURL('**/dashboard', { timeout: 5000 })
})
