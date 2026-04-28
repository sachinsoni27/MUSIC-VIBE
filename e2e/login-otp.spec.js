import { test, expect } from '@playwright/test'

// Deterministic email OTP login test using the e2e fake signIn implementation
// Visit the SPA root with query params to enable e2e fake and autoSend

test('Clerk email OTP login flow (send OTP -> verify -> redirect)', async ({ page }) => {
  page.on('console', (m) => console.log('[PAGE_CONSOLE]', m.type(), m.text()))
  page.on('pageerror', (err) => console.log('[PAGE_ERROR]', err.message, '\n', err.stack))
  page.on('requestfailed', (req) => console.log('[REQUEST_FAILED]', req.url(), req.failure()?.errorText))

  await page.goto('/?e2e=1&autoSend=1&email=test%2Be2e%40example.com#login', { waitUntil: 'load', timeout: 12000 })

  const otpForm = page.locator('form[aria-label="OTP verification form"]')
  await expect(otpForm).toBeVisible({ timeout: 15000 })

  const otpInput = otpForm.locator('input#otp')
  await otpInput.fill('123456')

  await Promise.all([
    page.waitForURL('**/dashboard', { timeout: 5000 }),
    page.click('button:has-text("Verify & Sign In")'),
  ])

  await expect(page).toHaveURL(/.*\/dashboard$/)
})
