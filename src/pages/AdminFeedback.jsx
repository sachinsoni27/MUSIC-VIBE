import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getAllFeedback } from '../services/api'

const AdminFeedback = () => {
  const [feedback, setFeedback] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [stats, setStats] = useState({
    total: 0,
    avgRating: 0,
    today: 0
  })

  useEffect(() => {
    loadFeedback()
  }, [])

  const loadFeedback = async () => {
    try {
      const data = await getAllFeedback()
      
      if (data.success) {
        setFeedback(data.feedback)
        calculateStats(data.feedback)
      } else {
        setError('Failed to load feedback')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (feedbackList) => {
    const total = feedbackList.length
    const ratings = feedbackList.filter(f => f.rating).map(f => f.rating)
    const avgRating = ratings.length > 0 
      ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)
      : '0.0'
    
    const today = new Date().toDateString()
    const todayCount = feedbackList.filter(f => 
      new Date(f.created_at).toDateString() === today
    ).length

    setStats({ total, avgRating, today: todayCount })
  }

  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: 'white', background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)', minHeight: '100vh' }}>
        <i className="fas fa-spinner fa-spin" style={{ fontSize: '2rem', color: 'rgb(13, 118, 199)' }}></i>
        <p style={{ marginTop: '20px' }}>Loading feedback...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: 'white', background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)', minHeight: '100vh' }}>
        <div style={{ background: 'rgba(244, 67, 54, 0.2)', border: '1px solid #f44336', color: '#f44336', padding: '20px', borderRadius: '10px', maxWidth: '600px', margin: '0 auto' }}>
          <i className="fas fa-exclamation-triangle"></i> {error}
        </div>
        <Link to="/" style={{ display: 'inline-block', marginTop: '20px', color: 'rgb(13, 118, 199)' }}>← Back to Home</Link>
      </div>
    )
  }

  return (
    <div style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)', color: 'white', padding: '40px 20px', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <Link to="/" style={{ display: 'inline-block', marginBottom: '20px', color: 'rgb(13, 118, 199)', textDecoration: 'none', fontSize: '1.1rem' }}>
          <i className="fas fa-arrow-left"></i> Back to Home
        </Link>
        
        <h1 style={{ textAlign: 'center', marginBottom: '40px', fontSize: '3rem', background: 'linear-gradient(135deg, rgb(13, 118, 199), rgb(10, 95, 160))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          <i className="fas fa-comments"></i> User Feedback Dashboard
        </h1>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '40px' }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '20px', borderRadius: '15px', textAlign: 'center', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <h3 style={{ color: 'rgb(13, 118, 199)', fontSize: '2.5rem', marginBottom: '10px' }}>{stats.total}</h3>
            <p>Total Feedback</p>
          </div>
          <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '20px', borderRadius: '15px', textAlign: 'center', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <h3 style={{ color: 'rgb(13, 118, 199)', fontSize: '2.5rem', marginBottom: '10px' }}>{stats.avgRating}</h3>
            <p>Average Rating</p>
          </div>
          <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '20px', borderRadius: '15px', textAlign: 'center', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <h3 style={{ color: 'rgb(13, 118, 199)', fontSize: '2.5rem', marginBottom: '10px' }}>{stats.today}</h3>
            <p>Today</p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {feedback.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', fontSize: '1.5rem', color: 'rgb(13, 118, 199)' }}>
              No feedback yet
            </div>
          ) : (
            feedback.map(item => (
              <div key={item.id} style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '25px', borderRadius: '15px', border: '1px solid rgba(255, 255, 255, 0.1)', transition: 'all 0.3s ease' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', flexWrap: 'wrap', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <i className="fas fa-user-circle" style={{ color: 'rgb(13, 118, 199)', fontSize: '1.5rem' }}></i>
                    <div>
                      <strong>{item.name}</strong><br />
                      <small>{item.email}</small>
                    </div>
                  </div>
                  <div style={{ color: '#FFD700' }}>
                    {item.rating ? '★'.repeat(item.rating) + '☆'.repeat(5 - item.rating) : 'No rating'}
                  </div>
                </div>
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'rgb(13, 118, 199)', marginBottom: '10px' }}>
                  {item.subject || 'No subject'}
                </div>
                <div style={{ color: 'rgba(255, 255, 255, 0.8)', lineHeight: '1.6', marginBottom: '15px' }}>
                  {item.message}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.5)', flexWrap: 'wrap', gap: '10px' }}>
                  <span><i className="fas fa-calendar"></i> {new Date(item.created_at).toLocaleString()}</span>
                  <span><i className="fas fa-tag"></i> {item.status}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminFeedback

