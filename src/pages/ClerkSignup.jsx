import React from 'react'
import { SignUp } from '@clerk/clerk-react'
import Navbar from '../components/Navbar'
import '../styles/index.css'

class ClerkErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error("Clerk Error:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', color: '#f87171', background: 'rgba(248,113,113,0.1)', borderRadius: '8px', border: '1px solid rgba(248,113,113,0.3)' }}>
          <h3>Authentication Error</h3>
          <p>{this.state.error?.message || "Failed to load Clerk authentication."}</p>
        </div>
      )
    }
    return this.props.children
  }
}

const ClerkSignup = () => {
  return (
    <div className="home-page" style={{ paddingBottom: '0' }}>
      <Navbar />

      <div className="section-container" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', paddingTop: 'calc(var(--nav-h) + 40px)' }}>
        <div className="glass" style={{ maxWidth: '480px', width: '100%', padding: '40px', position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          
          <div className="section-header" style={{ marginBottom: '32px', textAlign: 'center' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'var(--gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', color: '#fff', margin: '0 auto 20px', boxShadow: 'var(--shadow-accent)' }}>
              <i className="fas fa-music"></i>
            </div>
            <h1 className="section-title" style={{ fontSize: '1.8rem', justifyContent: 'center' }}>Join Music Vibe</h1>
            <p className="section-subtitle">Create your account to start streaming</p>
          </div>

          <div style={{ width: '100%', display: 'flex', justifyContent: 'center', minHeight: '400px' }}>
            <ClerkErrorBoundary>
              {/* Force Clerk to match the dark theme and fit the container */}
              <SignUp 
                path="/clerk-signup" 
                routing="path" 
                fallbackRedirectUrl="/"
                forceRedirectUrl="/"
                appearance={{
                  variables: {
                    colorPrimary: '#7c3aed',
                    colorBackground: 'transparent',
                    colorText: '#f1f5f9',
                    colorInputBackground: 'rgba(255,255,255,0.05)',
                    colorInputText: '#f1f5f9',
                    colorTextSecondary: '#94a3b8'
                  },
                  elements: {
                    card: { boxShadow: 'none', background: 'transparent' },
                    headerTitle: { display: 'none' },
                    headerSubtitle: { display: 'none' },
                    socialButtonsBlockButton: { border: '1px solid var(--border)', background: 'var(--card)' },
                    socialButtonsBlockButtonText: { color: '#f1f5f9' },
                    dividerLine: { background: 'var(--border)' },
                    dividerText: { color: '#94a3b8' },
                    formFieldInput: { border: '1px solid var(--border)' },
                    footerActionText: { color: '#94a3b8' },
                    footerActionLink: { color: '#7c3aed' }
                  }
                }}
              />
            </ClerkErrorBoundary>
          </div>

        </div>
      </div>
    </div>
  )
}

export default ClerkSignup
