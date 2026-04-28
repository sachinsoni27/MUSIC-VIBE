import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { healthCheck } from '../services/api'
import '../styles/index.css'

export default function ServerBanner() {
  const location = useLocation()
  const [serverAvailable, setServerAvailable] = useState(true)
  const [checking, setChecking]               = useState(false)
  const [message, setMessage]                 = useState('')
  const [dismissed, setDismissed]             = useState(false)

  // Hide on clerk-signup page
  if (location?.pathname?.startsWith('/clerk-signup')) return null

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const res = await healthCheck()
        if (mounted) setServerAvailable(!!res.ok)
      } catch {
        if (mounted) setServerAvailable(false)
      }
    })()
    return () => { mounted = false }
  }, [])

  useEffect(() => {
    if (!serverAvailable) document.body.classList.add('server-down')
    else document.body.classList.remove('server-down')
    return () => document.body.classList.remove('server-down')
  }, [serverAvailable])

  if (serverAvailable || dismissed) return null

  const handleRefresh = async () => {
    setChecking(true)
    setMessage('Checking…')
    const res = await healthCheck()
    if (res?.ok) {
      setMessage('Connected — reloading…')
      setTimeout(() => window.location.reload(), 800)
    } else {
      setMessage('Still unreachable. Run `npm run server` or set VITE_API_URL.')
    }
    setChecking(false)
  }

  return (
    <div className="server-banner" role="status" aria-live="polite">
      <div className="server-banner-inner">
        <span style={{ fontSize: '1rem' }}>⚡</span>
        <span className="server-banner-text" style={{ flex: 1, lineHeight: 1.4 }}>
          Backend offline. Start: <code style={{ whiteSpace: 'nowrap' }}>npm run server</code>
        </span>
        <div className="server-banner-actions" style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          <button className="auth-btn small" onClick={handleRefresh} disabled={checking}>
            {checking ? '…' : 'Retry'}
          </button>
          <button
            className="auth-btn small"
            onClick={() => setDismissed(true)}
            title="Dismiss"
            style={{ padding: '5px 10px' }}
          >
            ✕
          </button>
        </div>
      </div>
      {message && (
        <div className="server-banner-message">{message}</div>
      )}
    </div>
  )
}
