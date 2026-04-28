import { Navigate } from 'react-router-dom'

// Legacy login page replaced by Clerk sign-in. Redirecting to Clerk signup/sign-in.
export default function Login() {
  return <Navigate to="/clerk-signup" replace />
}

  const showMessage = (text, type = 'info') => {
    setMessage({ text, type })
    setTimeout(() => setMessage({ text: '', type: '' }), 6000)
  }

  useEffect(() => {
    let t
    if (resendCooldown > 0) {
      t = setTimeout(() => setResendCooldown((c) => Math.max(0, c - 1)), 1000)
    }
    return () => clearTimeout(t)
  }, [resendCooldown])

  const sendOtp = async (e) => {
    if (e) e.preventDefault()
    setLoading(true)
    setMessage({ text: '', type: '' })

    if (!email) {
      showMessage('Please enter your email', 'error')
      setLoading(false)
      return
    }

    try {
      await signInClient.create({ emailAddress: email, strategy: 'email_code' })
      setStep('verify')
      setResendCooldown(30)
      showMessage('OTP sent to your email. Please enter it below.', 'info')
    } catch (err) {
      showMessage(err?.errors?.[0]?.long_message || err?.message || 'Failed to send OTP', 'error')
    } finally {
      setLoading(false)
    }
  }

  const verifyOtp = async (e) => {
    if (e) e.preventDefault()
    setLoading(true)
    setMessage({ text: '', type: '' })

    if (!otp) {
      showMessage('Please enter the OTP', 'error')
      setLoading(false)
      return
    }

    try {
      const attempt = await signInClient.attemptEmailAddressVerification({ code: String(otp || '').trim() })
      if (attempt?.status === 'complete') {
        if (attempt.createdSessionId) await setActive({ session: attempt.createdSessionId })
        showMessage('Login successful — redirecting...', 'success')
        setTimeout(() => navigate('/dashboard'), 800)
      } else {
        console.warn('[Login] verification attempt not complete:', attempt)
        showMessage('Authentication not completed. Please try again or request a new OTP.', 'error')
      }
    } catch (err) {
      showMessage(err?.errors?.[0]?.long_message || err?.message || 'OTP verification failed', 'error')
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
          <h1>Welcome Back</h1>
          <p>Login to continue your music journey</p>
        </div>

        {step === 'enter' && (
          <form className="auth-form" onSubmit={sendOtp} aria-label="Login form">
            <div className="form-group">
              <label htmlFor="email">
                <i className="fas fa-envelope"></i>
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@musicvibe.com"
                required
                autoComplete="email"
              />
            </div>

            <div className="form-options">
              <a href="#" className="forgot-password">Forgot Password?</a>
            </div>

            <button type="submit" className="auth-btn" disabled={loading} aria-busy={loading}>
              {loading ? ' Sending OTP...' : ' Send OTP'}
            </button>

            <div className="switch-auth">
              <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
              <p><Link to="/">← Back to Home</Link></p>
            </div>
          </form>
        )}

        {step === 'verify' && (
          <form className="auth-form" onSubmit={verifyOtp} aria-label="OTP verification form">
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

        {message.text && (
          <div className={`message-box ${message.type}`} role={message.type === 'error' ? 'alert' : 'status'} aria-live="polite" style={{ display: 'block' }}>
            {message.text}
          </div>
        )}
      </div>
    </div>
  )
}

export default Login

