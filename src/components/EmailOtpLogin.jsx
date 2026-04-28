import React, { useState, useEffect } from 'react'
import { useSignIn } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom'
import '../styles/auth.css'

export default function EmailOtpLogin() {
  const navigate = useNavigate()
  const { isLoaded, signIn, setActive } = useSignIn()
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState('enter') // enter | verify
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [resendCooldown, setResendCooldown] = useState(0)

  useEffect(() => {
    let t
    if (resendCooldown > 0) {
      t = setTimeout(() => setResendCooldown((c) => c - 1), 1000)
    }
    return () => clearTimeout(t)
  }, [resendCooldown])

  // Support deterministic e2e by installing a fake signIn client
  const isE2E = typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('e2e') === '1'
  const _E2E_FAKE_OTP = '123456'
  const fakeSignIn = {
    create: async ({ emailAddress } = {}) => {
      try { window.__E2E_SIGNIN_OTP = _E2E_FAKE_OTP } catch (e) {}
      console.log('[E2E] fakeSignIn.create called for', emailAddress)
      await new Promise((r) => setTimeout(r, 80))
      return { status: 'needs_verification' }
    },
    attemptEmailAddressVerification: async ({ code } = {}) => {
      await new Promise((r) => setTimeout(r, 80))
      if (String(code) === _E2E_FAKE_OTP) return { status: 'complete', createdSessionId: 'e2e-session' }
      const err = new Error('Invalid OTP')
      err.errors = [{ long_message: 'Invalid OTP' }]
      throw err
    }
  }
  const signInClient = isE2E ? fakeSignIn : signIn

  // Guard until Clerk sign-in is ready
  if (!isLoaded) {
    return (
      <div className="auth-container">
        <div className="auth-box">
          <p>Loading authentication…</p>
        </div>
      </div>
    )
  }

  const parseError = (err) => {
    return err?.errors?.[0]?.long_message || err?.message || JSON.stringify(err) || 'An error occurred'
  }

  const sendOtp = async () => {
    setError('')
    setInfo('')
    if (!email) return setError('Please enter a valid email address')

    setLoading(true)
    try {
      // Create a sign-in attempt using Clerk's email_code strategy
      const res = await signInClient.create({ emailAddress: email, strategy: 'email_code' })
      // If Clerk accepted the attempt, go to verify step
      if (res?.status === 'needs_first_factor' || res?.status === 'needs_second_factor' || res?.status === 'needs_verification') {
        setStep('verify')
        setInfo('OTP sent to your email. Please enter it below.')
        setResendCooldown(30) // short cooldown to prevent immediate resends
      } else if (res?.status === 'complete') {
        // Unusual: completed immediately — activate session
        await setActive({ session: res.createdSessionId })
        navigate('/dashboard')
      } else {
        setStep('verify')
        setInfo('OTP sent (status: ' + res?.status + '). Please check your email.')
      }
    } catch (err) {
      setError(parseError(err))
    } finally {
      setLoading(false)
    }
  }

  const verifyOtp = async () => {
    setError('')
    setInfo('')

    if (!otp) return setError('Please enter the OTP you received')

    setLoading(true)
    try {
      // Attempt verification with the code
      const attempt = await signInClient.attemptEmailAddressVerification({ code: String(otp || '').trim() })

      // On success, Clerk reports status === 'complete' and a session id
      if (attempt?.status === 'complete') {
        // setActive will make the session active in the client
        if (attempt.createdSessionId) {
          await setActive({ session: attempt.createdSessionId })
        }
        navigate('/dashboard')
      } else {
        console.warn('[EmailOtpLogin] verification attempt not complete:', attempt)
        setError('Authentication not completed. Please try again or request a new OTP.')
      }
    } catch (err) {
      setError(parseError(err))
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    if (resendCooldown > 0) return
    setOtp('')
    await sendOtp()
  }

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="logo-section">
          <div className="auth-logo" aria-hidden="true"></div>
          <h1>Login with Email OTP</h1>
          <p>Enter your email and we'll send a one-time code to sign you in.</p>
        </div>

        {step === 'enter' && (
          <form
            className="auth-form"
            onSubmit={(e) => {
              e.preventDefault()
              sendOtp()
            }}
            aria-label="Email OTP form"
          >
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoComplete="email"
              />
            </div>

            <button type="submit" className="auth-btn" disabled={loading} aria-busy={loading}>
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </form>
        )}

        {step === 'verify' && (
          <form
            className="auth-form"
            onSubmit={(e) => {
              e.preventDefault()
              verifyOtp()
            }}
            aria-label="OTP verification form"
          >
            <div className="form-group">
              <label htmlFor="otp">One-time code</label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter the 6-digit code"
                required
                inputMode="numeric"
                maxLength={10}
                autoFocus
              />
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <button type="submit" className="auth-btn" disabled={loading} aria-busy={loading}>
                {loading ? 'Verifying...' : 'Verify & Sign In'}
              </button>

              <button type="button" className="auth-btn muted" onClick={handleResend} disabled={resendCooldown > 0}>
                {resendCooldown > 0 ? `Resend (${resendCooldown}s)` : 'Resend OTP'}
              </button>
            </div>

            <p style={{ marginTop: 10 }}>
              <button
                type="button"
                className="auth-link"
                onClick={() => {
                  setStep('enter')
                  setOtp('')
                }}
              >
                Change email
              </button>
            </p>
          </form>
        )}

        {error && (
          <div className="message-box error" role="alert" aria-live="assertive">
            {error}
          </div>
        )}

        {info && (
          <div className="message-box info" role="status" aria-live="polite">
            {info}
          </div>
        )}

        <div className="switch-auth">
          <p>
            <a href="/">← Back to Home</a>
          </p>
        </div>
      </div>
    </div>
  )
}
