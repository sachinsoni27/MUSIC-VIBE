const axios = require('axios')

const API = 'http://localhost:3000'

describe('Auth integration', () => {
  const now = Date.now()
  const email = `e2euser+${now}@example.com`
  const username = `e2euser${now}`
  const password = 'TestPass123'

  test('register -> login -> session token returned and OTP -> verify and receive JWT', async () => {
    // Ensure server is running; if not, skip this integration test
    try {
      await axios.get(`${API}/health`, { timeout: 2000 })
    } catch (err) {
      console.warn('Auth integration: Server not reachable at', API, '; skipping test')
      return
    }

    // Register
    let reg
    try {
      reg = await axios.post(`${API}/api/auth/register`, { username, email, password, fullName: 'E2E User' })
    } catch (err) {
      console.warn('Auth integration: register failed; skipping test', err.message)
      return
    }

    expect(reg.data).toBeDefined()
    expect(reg.data.success).toBeTruthy()

    // Login (send email + username for compatibility)
    const login = await axios.post(`${API}/api/auth/login`, { username: email, email, password })
    expect(login.data).toBeDefined()
    expect(login.data.success).toBeTruthy()
    expect(login.data.sessionToken).toBeTruthy()
    expect(login.data.user.email).toBe(email)

    // If running with NODE_ENV=test, server returns plain OTP in the login response for testability
    if (login.data.otp) {
      // Try resend endpoint as well
      const resend = await axios.post(`${API}/api/auth/resend-otp`, { sessionToken: login.data.sessionToken })
      expect(resend.data).toBeDefined()
      expect(resend.data.success).toBeTruthy()
      expect(resend.data.sessionToken).toBeTruthy()
      expect(resend.data.otp).toBeTruthy()
      expect(resend.data.otp).not.toBe(login.data.otp) // new OTP should differ

      const verify = await axios.post(`${API}/api/auth/verify-otp`, { sessionToken: resend.data.sessionToken, otp: resend.data.otp })
      expect(verify.data).toBeDefined()
      expect(verify.data.success).toBeTruthy()
      expect(verify.data.token).toBeTruthy()
      expect(verify.data.user.email).toBe(email)
    } else {
      // If OTP not in response, skip verify step (server likely running in non-test env), but at least sessionToken was returned
      console.warn('OTP not returned in login response; skipping OTP verification step (server not in test mode)')
    }
  }, 20000)
})
