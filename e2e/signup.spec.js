import { test, expect } from '@playwright/test'

// This e2e test uses a small test-mode hook enabled by visiting /signup?e2e=1
// It verifies the UI flow: send OTP -> verify OTP -> redirect to dashboard.

test('Clerk email OTP sign up flow (send OTP -> verify -> redirect)', async ({ page }) => {
  // Load the page in test-mode which activates a local fake signUp implementation
  // capture client console and errors to help debug flakiness
  page.on('console', (m) => console.log('[PAGE_CONSOLE]', m.type(), m.text()))
  page.on('pageerror', (err) => console.log('[PAGE_ERROR]', err.message, '\n', err.stack))
  page.on('requestfailed', (req) => console.log('[REQUEST_FAILED]', req.url(), req.failure()?.errorText))

  // Use hash-based navigation to avoid static `signup.html` file being served by Vite dev server
  // This loads the SPA index and then navigates to the Signup route with e2e params
  await page.goto('/?e2e=1&autoSend=1&email=test%2Be2e%40example.com#signup', { waitUntil: 'load', timeout: 12000 })

  // Since we used autoSend=1 and prefilled email via the query string,
  // the page should auto-send OTP on mount; wait for OTP verification form.
  const otpForm = page.locator('form[aria-label="OTP verification form"]')
  // allow more time for auto-send to occur in CI or slower environments
  await expect(otpForm).toBeVisible({ timeout: 15000 })

  const message = page.locator('.message-box')
  await expect(message).toBeVisible({ timeout: 5000 })
  const msgText = await message.textContent()
  console.log('signup message:', msgText)

  const otpInput = otpForm.locator('input#otp')
  await otpInput.fill('123456')

  await Promise.all([
    page.waitForURL('**/dashboard', { timeout: 5000 }),
    page.click('button:has-text("Verify & Sign Up")'),
  ])

  // Confirm we're redirected to dashboard
  await expect(page).toHaveURL(/.*\/dashboard$/)
})