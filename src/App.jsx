import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { MusicProvider } from './context/MusicContext'
import Home from './pages/Home'
import ClerkSignup from './pages/ClerkSignup'
import Feedback from './pages/Feedback'
import Trending from './pages/Trending'
import Contact from './pages/Contact'
import AdminFeedback from './pages/AdminFeedback'
import TestDatabase from './pages/TestDatabase'
import Dashboard from './pages/Dashboard'
import { SignedIn, SignedOut } from '@clerk/clerk-react'

function App() {
  return (
    <MusicProvider>
      <Router basename={import.meta.env.BASE_URL || '/'}>

        <Routes>
          <Route path="/" element={<Home />} />

          {/* Redirect legacy auth routes to Clerk signup */}
          <Route path="/login" element={<Navigate to="/clerk-signup" replace />} />
          <Route path="/signup" element={<Navigate to="/clerk-signup" replace />} />
          <Route path="/verify-otp" element={<Navigate to="/clerk-signup" replace />} />

          <Route path="/clerk-signup" element={<ClerkSignup />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/trending" element={<Trending />} />
          <Route path="/contact" element={<Contact />} />

          {/* Redirect dashboard to Home page so the premium UI is the universal main page */}
          <Route path="/dashboard" element={<Navigate to="/" replace />} />

          <Route path="/admin-feedback" element={<AdminFeedback />} />
          <Route path="/test-database" element={<TestDatabase />} />

          {/* Catch-all route to handle unmatched URLs like /index.html */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </MusicProvider>
  )
}

export default App

