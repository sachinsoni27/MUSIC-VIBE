import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const TestDatabase = () => {
  const [serverStatus, setServerStatus] = useState('offline')
  const [results, setResults] = useState({
    server: '',
    register: '',
    login: '',
    feedback: ''
  })

  const API_URL = 'http://localhost:3000'

  useEffect(() => {
    checkServer()
  }, [])

  const checkServer = async () => {
    try {
      const response = await fetch(`${API_URL}/api/feedback`)
      if (response.ok) {
        setServerStatus('online')
        setResults(prev => ({ ...prev, server: '✅ Server is running!' }))
      } else {
        throw new Error('Server error')
      }
    } catch (error) {
      setServerStatus('offline')
      setResults(prev => ({ ...prev, server: '❌ Server is not running. Please run: npm run server' }))
    }
  }

  const testRegister = async () => {
    setResults(prev => ({ ...prev, register: 'Creating test user...' }))
    
    const testUser = {
      username: 'testuser_' + Date.now(),
      email: `test${Date.now()}@musicvibe.com`,
      password: 'test123456',
      fullName: 'Test User'
    }

    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testUser)
      })

      const data = await response.json()
      
      if (data.success) {
        setResults(prev => ({ ...prev, register: `✅ Registration successful!\nUsername: ${testUser.username}\nEmail: ${testUser.email}\nPassword: ${testUser.password}\nUser ID: ${data.userId}` }))
      } else {
        setResults(prev => ({ ...prev, register: `❌ ${data.message}` }))
      }
    } catch (error) {
      setResults(prev => ({ ...prev, register: `❌ Error: ${error.message}` }))
    }
  }

  const testLogin = async () => {
    setResults(prev => ({ ...prev, login: 'Testing login...' }))

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'testuser', password: 'test123' })
      })

      const data = await response.json()
      
      if (data.success) {
        setResults(prev => ({ ...prev, login: `✅ Login successful!\nUser: ${data.user.username}\nEmail: ${data.user.email}\nSession Token: ${data.sessionToken.substring(0, 20)}...` }))
      } else {
        setResults(prev => ({ ...prev, login: `❌ ${data.message}\nTry creating a test user first` }))
      }
    } catch (error) {
      setResults(prev => ({ ...prev, login: `❌ Error: ${error.message}` }))
    }
  }

  const testFeedback = async () => {
    setResults(prev => ({ ...prev, feedback: 'Submitting test feedback...' }))

    const testFeedbackData = {
      name: 'Test User',
      email: 'test@musicvibe.com',
      subject: 'Test Feedback',
      message: 'This is a test feedback message from the React test suite.',
      rating: 5
    }

    try {
      const response = await fetch(`${API_URL}/api/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testFeedbackData)
      })

      const data = await response.json()
      
      if (data.success) {
        setResults(prev => ({ ...prev, feedback: `✅ Feedback submitted!\nFeedback ID: ${data.feedbackId}` }))
      } else {
        setResults(prev => ({ ...prev, feedback: `❌ ${data.message}` }))
      }
    } catch (error) {
      setResults(prev => ({ ...prev, feedback: `❌ Error: ${error.message}` }))
    }
  }

  return (
    <div style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)', color: 'white', padding: '40px 20px', minHeight: '100vh' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '40px', color: 'rgb(13, 118, 199)' }}>
          <i className="fas fa-database"></i> Music Vibe Database Test Suite
        </h1>

        <TestSection 
          title="Server Status"
          status={serverStatus}
          onTest={checkServer}
          result={results.server}
        />

        <TestSection 
          title="Test Registration"
          onTest={testRegister}
          result={results.register}
        />

        <TestSection 
          title="Test Login"
          onTest={testLogin}
          result={results.login}
        />

        <TestSection 
          title="Test Feedback"
          onTest={testFeedback}
          result={results.feedback}
        />

        <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '30px', borderRadius: '15px', marginBottom: '20px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <h2 style={{ color: 'rgb(13, 118, 199)', marginBottom: '20px' }}>
            <i className="fas fa-info-circle"></i> Quick Links
          </h2>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <Link to="/signup" style={{ padding: '12px 30px', background: 'linear-gradient(135deg, rgb(13, 118, 199), rgb(10, 95, 160))', color: 'white', border: 'none', borderRadius: '25px', textDecoration: 'none' }}>
              Go to Signup
            </Link>
            <Link to="/login" style={{ padding: '12px 30px', background: 'linear-gradient(135deg, rgb(13, 118, 199), rgb(10, 95, 160))', color: 'white', border: 'none', borderRadius: '25px', textDecoration: 'none' }}>
              Go to Login
            </Link>
            <Link to="/feedback" style={{ padding: '12px 30px', background: 'linear-gradient(135deg, rgb(13, 118, 199), rgb(10, 95, 160))', color: 'white', border: 'none', borderRadius: '25px', textDecoration: 'none' }}>
              Go to Feedback
            </Link>
            <Link to="/admin-feedback" style={{ padding: '12px 30px', background: 'linear-gradient(135deg, rgb(13, 118, 199), rgb(10, 95, 160))', color: 'white', border: 'none', borderRadius: '25px', textDecoration: 'none' }}>
              Admin Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

const TestSection = ({ title, status, onTest, result }) => (
  <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '30px', borderRadius: '15px', marginBottom: '20px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
    <h2 style={{ color: 'rgb(13, 118, 199)', marginBottom: '20px' }}>
      {title}
      {status && (
        <span style={{ 
          display: 'inline-block', 
          padding: '5px 15px', 
          borderRadius: '20px', 
          fontSize: '0.9rem', 
          marginLeft: '10px',
          background: status === 'online' ? 'rgba(76, 175, 80, 0.2)' : 'rgba(244, 67, 54, 0.2)',
          color: status === 'online' ? '#4CAF50' : '#f44336'
        }}>
          {status === 'online' ? 'Online' : 'Offline'}
        </span>
      )}
    </h2>
    <button 
      onClick={onTest}
      style={{ 
        padding: '12px 30px', 
        background: 'linear-gradient(135deg, rgb(13, 118, 199), rgb(10, 95, 160))', 
        color: 'white', 
        border: 'none', 
        borderRadius: '25px', 
        fontSize: '1rem', 
        cursor: 'pointer', 
        margin: '10px 10px 10px 0' 
      }}
    >
      {title.includes('Server') ? 'Check Server' : title}
    </button>
    {result && (
      <div style={{ 
        background: 'rgba(0, 0, 0, 0.3)', 
        padding: '15px', 
        borderRadius: '10px', 
        marginTop: '15px', 
        fontFamily: "'Courier New', monospace", 
        fontSize: '0.9rem', 
        whiteSpace: 'pre-wrap' 
      }}>
        {result}
      </div>
    )}
  </div>
)

export default TestDatabase

