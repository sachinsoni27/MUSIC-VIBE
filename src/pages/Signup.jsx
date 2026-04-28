import { Navigate } from 'react-router-dom'

// Legacy signup page replaced by Clerk's built-in SignUp component at /clerk-signup
export default function Signup() {
  return <Navigate to="/clerk-signup" replace />
}

  const showMessage = (text, type) => {
    setMessage({ text, type })
    setTimeout(() => setMessage({ text: '', type: '' }), 5000)
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  useEffect(() => {
    let t
    if (resendCooldown > 0) {
      t = setTimeout(() => setResendCooldown((c) => Math.max(0, c - 1)), 1000)
    }
    return () => clearTimeout(t)
  }, [resendCooldown])

  // Auto-send OTP when running in E2E mode with ?autoSend=1
  useEffect(() => {
    try {
      const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null
      const autoSend = params ? params.get('autoSend') === '1' : false
      if (isE2E && autoSend) {
        ;(async () => {
          setLoading(true)
          try {
            const emailToUse = formData.email || 'test+e2e@example.com'
            console.log('[E2E] autoSend signup for', emailToUse)
            await signUpClient.create({ emailAddress: emailToUse, strategy: 'email_code' })
            setStep('verify')
            setResendCooldown(30)
            showMessage('OTP sent to your email. Please enter it below.', 'info')
          } catch (e) {
            console.error('[E2E] autoSend error', e)
          } finally {
            setLoading(false)
          }
        })()
      }
    } catch (e) {
      // harmless
    }
  }, [])

  if (!isLoaded) {
    return (
      <div className="auth-container">
        <div className="auth-box">
          <p>Loading authentication…</p>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    // Basic validation (keep existing checks)
    if (!agreeTerms) {
      showMessage('❌ Please agree to the terms and conditions', 'error')
      setLoading(false)
      return
    }

    if (!formData.email) {
      showMessage('❌ Please enter a valid email address', 'error')
      setLoading(false)
      return
    }

    try {
      // Create a clerk sign-up using email_code strategy (send OTP)
      const res = await signUpClient.create({ emailAddress: formData.email, strategy: 'email_code' })
      console.log('[SignUp] create result:', res)

      setStep('verify')
      setResendCooldown(30)
      showMessage('OTP sent to your email. Please enter it below.', 'info')
    } catch (err) {
      console.error('[SignUp] send error', err)
      showMessage(err?.errors?.[0]?.long_message || err?.message || 'Failed to send OTP', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="logo-section">
          <div className="auth-logo"></div>
          <h1>Create Account</h1>
          <p>Join Music Vibe and start your music journey</p>
        </div>

        {step === 'enter' && (
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="fullName">
                <i className="fas fa-user"></i>
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="username">
                <i className="fas fa-user-circle"></i>
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Choose a username"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">
                <i className="fas fa-envelope"></i>
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">
                <i className="fas fa-lock"></i>
                Password (optional for email OTP)
              </label>
              <div className="password-input">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password (optional)"
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <i className={`fas fa-eye${showPassword ? '-slash' : ''}`}></i>
                </button>
              </div>
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  id="agreeTerms"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                />
                <span>I agree to the Terms and Conditions</span>
              </label>
            </div>

            <button type="submit" className="auth-btn" disabled={loading} aria-busy={loading}>
              <i className="fas fa-user-plus"></i>
              {loading ? ' Sending OTP...' : ' Sign Up'}
            </button>



            <div className="switch-auth">
              <p>Already have an account? <Link to="/login">Login</Link></p>
              <p><Link to="/">← Back to Home</Link></p>
            </div>
          </form>
        )}

        {step === 'verify' && (
          <form className="auth-form" onSubmit={async (e) => {
            e.preventDefault()
            try {
              setLoading(true)
              // Use Clerk's recommended verify method for email address OTP
              const attempt = await signUpClient.attemptEmailAddressVerification({ code: String(otp || '').trim() })

              if (attempt?.status === 'complete') {
                if (attempt.createdSessionId) await setActive({ session: attempt.createdSessionId })
                showMessage('✅ Signup completed — redirecting...', 'success')
                setTimeout(() => navigate('/dashboard'), 800)
              } else {
                console.warn('[Signup] verification attempt not complete:', attempt)
                showMessage('Authentication not completed. Please try again or request a new OTP.', 'error')
              }
            } catch (err) {
              showMessage(err?.errors?.[0]?.long_message || err?.message || 'OTP verification failed', 'error')
            } finally {
              setLoading(false)
            }
          }} aria-label="OTP verification form">
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
                {loading ? 'Verifying...' : 'Verify & Sign Up'}
              </button>

              <button type="button" className="auth-btn muted" onClick={async () => { if (resendCooldown > 0) return; setOtp(''); setLoading(true); try { await signUpClient.create({ emailAddress: formData.email }); setResendCooldown(30); showMessage('OTP resent to your email.', 'info'); } catch (err) { showMessage(err?.errors?.[0]?.long_message || err?.message || 'Failed to resend OTP', 'error'); } finally { setLoading(false); } }} disabled={resendCooldown > 0}>
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
          <div className={`message-box ${message.type}`} style={{ display: 'block' }}>
            {message.text}
          </div>
        )}
      </div>
    </div>
  )
}

export default Signup

