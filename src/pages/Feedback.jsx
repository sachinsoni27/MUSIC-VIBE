import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useUser } from '@clerk/clerk-react'
import { submitFeedback } from '../services/api'
import Navbar from '../components/Navbar'
import '../styles/index.css'

const Feedback = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    rating: 0
  })
  const [message, setMessage] = useState({ text: '', type: '' })
  const [loading, setLoading] = useState(false)
  const { user } = useUser()

  useEffect(() => {
    // Auto-fill if Clerk user is available
    if (user) {
      const name = user.fullName || user.firstName || ''
      const email = user.primaryEmailAddress?.emailAddress || (user.emailAddresses && user.emailAddresses[0]?.emailAddress) || ''
      setFormData(prev => ({
        ...prev,
        name,
        email
      }))
    }
  }, [user])

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

  const handleRating = (rating) => {
    setFormData({ ...formData, rating })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    if (formData.rating === 0) {
      showMessage('❌ Please select a rating', 'error')
      setLoading(false)
      return
    }

    try {
      const feedbackData = {
        ...formData,
        userId: user?.id || null
      }

      const data = await submitFeedback(feedbackData)

      if (data.success) {
        showMessage('✅ Thank you for your feedback!', 'success')
        setFormData({
          name: user?.fullName || user?.username || '',
          email: user?.email || '',
          subject: '',
          message: '',
          rating: 0
        })
      } else {
        showMessage('❌ ' + (data.message || 'Failed to submit feedback'), 'error')
      }
    } catch (error) {
      showMessage('❌ ' + error.message, 'error')
    }

    setLoading(false)
  }

  return (
    <div className="home-page" style={{ paddingBottom: '0' }}>
      <Navbar />
      
      <div className="section-container" style={{ 
        minHeight: 'calc(100vh - var(--nav-h))', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        paddingTop: 'calc(var(--nav-h) + 40px)',
        paddingBottom: 'calc(var(--player-h) + 40px)'
      }}>
        <div className="glass" style={{ 
          maxWidth: '600px', 
          width: '100%', 
          padding: 'clamp(20px, 5vw, 40px)', 
          position: 'relative', 
          zIndex: 2 
        }}>
          <div className="section-header" style={{ marginBottom: '32px' }}>
            <h1 className="section-title" style={{ fontSize: '2rem' }}>We Value Your Feedback</h1>
            <p className="section-subtitle">Help us improve your music experience</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label htmlFor="name" style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                <i className="fas fa-user" style={{ marginRight: '8px' }}></i>
                Your Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                required
                style={{
                  width: '100%', padding: '12px 16px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', 
                  borderRadius: 'var(--r-md)', color: 'var(--text)', fontSize: '0.95rem', outline: 'none'
                }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label htmlFor="email" style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                <i className="fas fa-envelope" style={{ marginRight: '8px' }}></i>
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
                style={{
                  width: '100%', padding: '12px 16px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', 
                  borderRadius: 'var(--r-md)', color: 'var(--text)', fontSize: '0.95rem', outline: 'none'
                }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label htmlFor="subject" style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                <i className="fas fa-tag" style={{ marginRight: '8px' }}></i>
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="What is this about?"
                required
                style={{
                  width: '100%', padding: '12px 16px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', 
                  borderRadius: 'var(--r-md)', color: 'var(--text)', fontSize: '0.95rem', outline: 'none'
                }}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                <i className="fas fa-star" style={{ marginRight: '8px' }}></i>
                Rate Your Experience
              </label>
              <div style={{ display: 'flex', gap: '10px', fontSize: '1.5rem' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <i
                    key={star}
                    className={`fas fa-star`}
                    onClick={() => handleRating(star)}
                    onMouseEnter={() => handleRating(star)}
                    style={{ 
                      cursor: 'pointer', 
                      color: formData.rating >= star ? '#fcd34d' : 'var(--text-dim)',
                      transition: 'color var(--t)'
                    }}
                  ></i>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label htmlFor="message" style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                <i className="fas fa-comment" style={{ marginRight: '8px' }}></i>
                Your Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us what you think..."
                required
                style={{
                  width: '100%', padding: '12px 16px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', 
                  borderRadius: 'var(--r-md)', color: 'var(--text)', fontSize: '0.95rem', outline: 'none',
                  minHeight: '120px', resize: 'vertical'
                }}
              ></textarea>
            </div>

            <button type="submit" className="btn-primary" disabled={loading} style={{ justifyContent: 'center', marginTop: '10px' }}>
              <i className="fas fa-paper-plane"></i> 
              {loading ? 'Submitting...' : 'Submit Feedback'}
            </button>
          </form>

          {message.text && (
            <div style={{
              marginTop: '20px', padding: '12px 16px', borderRadius: 'var(--r-sm)', fontSize: '0.9rem',
              background: message.type === 'error' ? 'rgba(244,63,94,0.1)' : 'rgba(74,222,128,0.1)',
              color: message.type === 'error' ? '#f43f5e' : '#4ade80',
              border: `1px solid ${message.type === 'error' ? 'rgba(244,63,94,0.3)' : 'rgba(74,222,128,0.3)'}`
            }}>
              {message.text}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Feedback
