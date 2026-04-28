import { test, expect } from '@playwright/test'

// Live signup trial: fills the real signup form (no ?e2e=1) and captures
// console logs, request failures, and message text to help debug OTP delivery.

test('signup live: send OTP and capture network/console', async ({ page }) => {
  page.on('console', (m) => console.log('[PAGE_CONSOLE]', m.type(), m.text()))
  page.on('pageerror', (err) => console.log('[PAGE_ERROR]', err.message, '\n', err.stack))
  page.on('requestfailed', (req) => console.log('[REQUEST_FAILED]', req.method(), req.url(), req.failure()?.errorText))
  page.on('requestfinished', (req) => {
    const url = req.url()
    if (/clerk|clerk.dev|clerkjs|api.clerk/.test(url)) console.log('[CLERK_REQUEST]', req.method(), url)
  })

  await page.goto('/signup', { waitUntil: 'load', timeout: 15000 })

  // Fill fields and accept terms — use an address you can inspect (not real inbox required)
  const testEmail = 'test+live@musicvibe.example'
  await page.fill('input[type="email"]', testEmail)
  await page.check('#agreeTerms')

  // Click sign up and wait for the message box to appear
  await Promise.all([
    page.click('button[type="submit"]'),
  ])

  // Wait up to 12s for a message indicating OTP sent or an error
  const message = page.locator('.message-box')
  await expect(message).toBeVisible({ timeout: 12000 })
  const msgText = await message.textContent()
  console.log('[MESSAGE_TEXT]', msgText)

  // If OTP form appears, log it as success
  const otpForm = page.locator('form[aria-label="OTP verification form"]')
  if (await otpForm.count() > 0) {
    console.log('[OTP_FORM] visible')
  } else {
    console.log('[OTP_FORM] not visible')
  }
})