import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import '../styles/index.css'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })

  const [notification, setNotification] = useState(null)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const showNotification = (message, type = 'info') => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Validate form
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      showNotification('Please fill in all required fields', 'error')
      return
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      showNotification('Please enter a valid email address', 'error')
      return
    }

    // Create contact object
    const contactData = {
      ...formData,
      timestamp: new Date().toISOString()
    }

    // Save to localStorage
    const contacts = JSON.parse(localStorage.getItem('jamifyContacts') || '[]')
    contacts.push(contactData)
    localStorage.setItem('jamifyContacts', JSON.stringify(contacts))

    // Show success message
    showNotification('Thank you for contacting us! We will get back to you soon.', 'success')

    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    })
  }

  return (
    <div className="home-page" style={{ paddingBottom: '0' }}>
      <Navbar />

      {/* Notification */}
      {notification && (
        <div style={{
          position: 'fixed', top: '90px', right: '20px', zIndex: 9999,
          padding: '12px 20px', borderRadius: 'var(--r-md)', fontSize: '0.9rem',
          background: notification.type === 'error' ? 'rgba(244,63,94,0.95)' : 'rgba(74,222,128,0.95)',
          color: notification.type === 'error' ? '#fff' : '#000',
          backdropFilter: 'blur(8px)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
          animation: 'fadeInDown 0.3s ease'
        }}>
          {notification.message}
        </div>
      )}

      <div className="section-container" style={{ paddingTop: 'calc(var(--nav-h) + 60px)', maxWidth: '1100px' }}>
        <div className="section-header">
          <h1 className="section-title"><i className="fas fa-envelope"></i> Get In Touch</h1>
          <p className="section-subtitle">We'd love to hear from you! Send us a message and we'll respond as soon as possible.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px' }}>
          
          {/* Contact Form */}
          <div className="glass" style={{ padding: '32px' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '24px' }}>Send Us a Message</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label htmlFor="name" style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  <i className="fas fa-user" style={{ marginRight: '8px' }}></i> Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                  style={{ width: '100%', padding: '12px 16px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', color: 'var(--text)', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label htmlFor="email" style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  <i className="fas fa-envelope" style={{ marginRight: '8px' }}></i> Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                  style={{ width: '100%', padding: '12px 16px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', color: 'var(--text)', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                  <label htmlFor="phone" style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    <i className="fas fa-phone" style={{ marginRight: '8px' }}></i> Phone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Optional"
                    maxLength="10"
                    style={{ width: '100%', padding: '12px 16px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', color: 'var(--text)', outline: 'none' }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                  <label htmlFor="subject" style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    <i className="fas fa-tag" style={{ marginRight: '8px' }}></i> Subject
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    style={{ width: '100%', padding: '12px 16px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', color: 'var(--text-muted)', outline: 'none', appearance: 'none' }}
                  >
                    <option value="" style={{ color: '#000' }}>Select subject</option>
                    <option value="general" style={{ color: '#000' }}>General Inquiry</option>
                    <option value="support" style={{ color: '#000' }}>Technical Support</option>
                    <option value="feedback" style={{ color: '#000' }}>Feedback</option>
                    <option value="partnership" style={{ color: '#000' }}>Partnership</option>
                    <option value="other" style={{ color: '#000' }}>Other</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <label htmlFor="message" style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    <i className="fas fa-comment" style={{ marginRight: '8px' }}></i> Message
                  </label>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{formData.message.length} / 500</span>
                </div>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Write your message here..."
                  maxLength="500"
                  required
                  style={{ width: '100%', padding: '12px 16px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: 'var(--r-md)', color: 'var(--text)', outline: 'none', minHeight: '120px', resize: 'vertical' }}
                ></textarea>
              </div>

              <button type="submit" className="btn-primary" style={{ justifyContent: 'center', marginTop: '10px' }}>
                <i className="fas fa-paper-plane"></i> Send Message
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="glass" style={{ padding: '32px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '24px' }}>Contact Information</h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '30px', fontSize: '0.9rem' }}>Feel free to reach out to us through any of these channels.</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(124,58,237,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-light)', flexShrink: 0 }}>
                    <i className="fas fa-map-marker-alt"></i>
                  </div>
                  <div>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '4px' }}>Address</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>123 Music Street, Delhi<br />India - 110001</p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(124,58,237,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-light)', flexShrink: 0 }}>
                    <i className="fas fa-phone"></i>
                  </div>
                  <div>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '4px' }}>Phone</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>+91 9936503035</p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(124,58,237,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-light)', flexShrink: 0 }}>
                    <i className="fas fa-envelope"></i>
                  </div>
                  <div>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '4px' }}>Email</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>support@musicvibe.com</p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(124,58,237,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-light)', flexShrink: 0 }}>
                    <i className="fas fa-clock"></i>
                  </div>
                  <div>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '4px' }}>Working Hours</h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>Mon - Fri: 9:00 AM - 6:00 PM<br />Sat: 10:00 AM - 4:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass" style={{ padding: '32px' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '20px' }}>Follow Us</h2>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                {['facebook-f', 'twitter', 'instagram', 'youtube', 'spotify'].map((icon) => (
                  <a key={icon} href="#" onClick={e => e.preventDefault()} style={{
                    width: '44px', height: '44px', borderRadius: '50%', background: 'var(--card)', border: '1px solid var(--border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text)', transition: 'all var(--t)'
                  }} onMouseOver={e => { e.currentTarget.style.background = 'var(--gradient)'; e.currentTarget.style.borderColor = 'transparent' }} onMouseOut={e => { e.currentTarget.style.background = 'var(--card)'; e.currentTarget.style.borderColor = 'var(--border)' }}>
                    <i className={`fab fa-${icon}`}></i>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}

export default Contact
