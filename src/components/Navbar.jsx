import { Link, useLocation } from 'react-router-dom'
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react'

const Navbar = () => {
  const { pathname } = useLocation()

  const links = [
    { to: '/',          label: 'Home' },
    { to: '/#playlists', label: 'Playlists', scroll: true },
    { to: '/trending',  label: 'Trending' },
    { to: '/feedback',  label: 'Feedback' },
    { to: '/contact',   label: 'Contact' },
  ]

  const handlePlaylists = (e) => {
    if (pathname === '/') {
      e.preventDefault()
      document.getElementById('playlists')?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <nav>
      <div className="logo">
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div className="logo-icon">
            <i className="fas fa-music" />
          </div>
          <h1 className="brand-title">Music Vibe</h1>
        </Link>
      </div>

      <div className="nav-links">
        <Link
          className={`nav-link${pathname === '/' ? ' active' : ''}`}
          to="/"
        >Home</Link>

        <a
          className="nav-link"
          href="/#playlists"
          onClick={handlePlaylists}
        >Playlists</a>

        <Link
          className={`nav-link${pathname === '/trending' ? ' active' : ''}`}
          to="/trending"
        >Trending</Link>

        <Link
          className={`nav-link${pathname === '/feedback' ? ' active' : ''}`}
          to="/feedback"
        >Feedback</Link>

        <Link
          className={`nav-link${pathname === '/contact' ? ' active' : ''}`}
          to="/contact"
        >Contact</Link>

        <span id="userSection">
          <SignedOut>
            <span className="auth-clerk">
              <span className="clerk-btn"><SignInButton /></span>
              <Link className="signup-link" to="/clerk-signup">Sign Up</Link>
            </span>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </span>
      </div>
    </nav>
  )
}

export default Navbar
