import '../styles/footer.css'
import { useEffect } from 'react'
import { useUser } from '@clerk/clerk-react'

const Footer = () => {
  const { user } = useUser() || {}

  useEffect(() => {
    // Prefill newsletter email if Clerk user is signed in
    const emailInput = document.getElementById('newsletter-email')
    const msg = document.getElementById('newsletter-msg')
    if (emailInput && user && user.primaryEmailAddress) {
      emailInput.value = user.primaryEmailAddress.emailAddress || ''
      emailInput.disabled = !!emailInput.value
    }

    // Attach submit handler
    const form = document.getElementById('newsletter-form')
    const submitBtn = document.getElementById('newsletter-submit')
    const handler = async (e) => {
      e.preventDefault()
      if (!emailInput) return
      const email = emailInput.value && String(emailInput.value).trim()
      if (!email) {
        if (msg) msg.innerText = 'Please enter a valid email.'
        return
      }
      if (submitBtn) submitBtn.disabled = true
      try {
        const res = await fetch('/api/newsletter/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, name: user?.fullName || user?.firstName || null, clerkId: user?.id || null })
        })
        if (!res.ok) {
          const text = await res.text().catch(() => null)
          if (msg) msg.innerText = text || `Subscription failed (status ${res.status})`
        } else {
          const json = await res.json()
          if (msg) msg.innerText = json.message || (json.success ? 'Subscribed!' : 'Failed to subscribe')
        }
      } catch (err) {
        if (msg) msg.innerText = 'Subscription failed. Try again later.'
      } finally {
        if (submitBtn) submitBtn.disabled = false
      }
    }

    form && form.addEventListener('submit', handler)
    return () => form && form.removeEventListener('submit', handler)
  }, [user])

  return (
    <footer className="footer-modern">
      {/* Wave Divider */}
      <div className="footer-wave">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
        </svg>
      </div>

      <div className="footer-content-modern">
        {/* Brand Section */}
        <div className="footer-brand">
          <div className="footer-logo">
            <i className="fas fa-music"></i>
            <h2>Music Vibe</h2>
          </div>
          <p className="footer-tagline">Your Ultimate Music Streaming Experience</p>
          <p className="footer-description">
            Stream millions of songs, discover new artists, and create your perfect playlists.
            Music for every mood, every moment.
          </p>

          {/* Social Media Links */}
          <div className="social-media-section">
            <h4 className="social-heading">
              <i className="fas fa-share-alt"></i> Connect With Us
            </h4>
            <div className="social-links-modern">
              <a href="#" className="social-btn facebook" aria-label="Facebook">
                <i className="fab fa-facebook-f"></i>
                <span>Facebook</span>
              </a>
              <a href="https://x.com/__sachin_soni__" className="social-btn twitter" aria-label="Twitter" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-twitter"></i>
                <span>Twitter</span>
              </a>
              <a href="https://www.instagram.com/__sachin_soni__?igsh=MXZ6aHRxdzhhcHhqMw==" className="social-btn instagram" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-instagram"></i>
                <span>Instagram</span>
              </a>
              <a href="https://www.youtube.com/@Fineartclass12" className="social-btn youtube" aria-label="YouTube" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-youtube"></i>
                <span>YouTube</span>
              </a>
              <a href="https://discord.com/users/859862454192701450" className="social-btn discord" aria-label="Discord" target="_blank" rel="noopener noreferrer">
                <i className="fab fa-discord"></i>
                <span>Discord</span>
              </a>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-links-section">
          <h4 className="footer-heading">
            <i className="fas fa-link"></i> Quick Links
          </h4>
          <ul className="footer-links">
            <li><a href="/"><i className="fas fa-home"></i> Home</a></li>
            <li><a href="/trending"><i className="fas fa-fire"></i> Trending</a></li>
            <li><a href="/contact"><i className="fas fa-envelope"></i> Contact</a></li>
            <li><a href="/feedback"><i className="fas fa-comment"></i> Feedback</a></li>
          </ul>
        </div>

        {/* Explore */}
        <div className="footer-links-section">
          <h4 className="footer-heading">
            <i className="fas fa-compass"></i> Explore
          </h4>
          <ul className="footer-links">
            <li><a href="#"><i className="fas fa-list"></i> Playlists</a></li>
            <li><a href="#"><i className="fas fa-star"></i> Top Artists</a></li>
            <li><a href="#"><i className="fas fa-chart-line"></i> Top Charts</a></li>
            <li><a href="#"><i className="fas fa-podcast"></i> Podcasts</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="footer-contact-section">
          <h4 className="footer-heading">
            <i className="fas fa-phone-alt"></i> Get In Touch
          </h4>
          <ul className="footer-contact">
            <li>
              <i className="fas fa-map-marker-alt"></i>
              <div>
                <strong>Address</strong>
                <p>123 Music Street, Delhi, India</p>
              </div>
            </li>
            <li>
              <i className="fas fa-envelope"></i>
              <div>
                <strong>Email</strong>
                <p>support@musicvibe.com</p>
              </div>
            </li>
            <li>
              <i className="fas fa-phone"></i>
              <div>
                <strong>Phone</strong>
                <p>+91 9936503035</p>
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="footer-newsletter">
        <div className="newsletter-content">
          <div className="newsletter-text">
            <i className="fas fa-bell"></i>
            <div>
              <h4>Stay Updated!</h4>
              <p>Subscribe to get the latest music updates and exclusive content</p>
            </div>
          </div>
          <div className="newsletter-form">
            <form id="newsletter-form" onSubmit={async (e) => { e.preventDefault(); }}>
              <input id="newsletter-email" type="email" placeholder="Enter your email" aria-label="newsletter-email" />
              <button type="submit" id="newsletter-submit">
                <i className="fas fa-paper-plane"></i> Subscribe
              </button>
            </form>
            <div id="newsletter-msg" style={{ marginTop: 8 }}></div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom-modern">
        <div className="footer-bottom-content">
          <p>&copy; 2025 Music Vibe. All rights reserved. Made with <i className="fas fa-heart"></i> by Sachin Soni</p>
          <div className="footer-legal">
            <a href="#">Privacy Policy</a>
            <span>•</span>
            <a href="#">Terms of Service</a>
            <span>•</span>
            <a href="#">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

