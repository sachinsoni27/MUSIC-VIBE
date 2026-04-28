import axios from 'axios'

// Allow overriding the API base URL via Vite env variable for dev/prod flexibility
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'
const client = axios.create({ baseURL: API_URL, headers: { 'Content-Type': 'application/json' } })

// Health check utility
export const healthCheck = async () => {
  try {
    const res = await client.get('/health')
    return { ok: true, data: res.data }
  } catch (err) {
    console.error('Health check failed:', err)
    return { ok: false, message: `Cannot reach backend at ${API_URL}` }
  }
}

// Helper function for API calls (axios)
const apiCall = async (endpoint, { method = 'GET', body = null, headers = {} } = {}) => {
  try {
    const response = await client.request({ url: endpoint, method, data: body, headers })
    return response.data
  } catch (error) {
    console.error('API Error:', error)

    // If server responded with an error payload, return it (consistent shape)
    if (error.response && error.response.data) return error.response.data

    // If request was made but no response received -> server not reachable / CORS / network issues
    if (error.request) {
      return { success: false, serverDown: true, message: `Cannot reach backend at ${API_URL}. Start it with 'npm run server' or set VITE_API_URL.` }
    }

    // Fallback
    return { success: false, message: error.message || 'Unknown API error' }
  }
}

// Authentication APIs
export const registerUser = async (userData) => {
  return apiCall('/api/auth/register', { method: 'POST', body: userData })
}

// Login accepts email and password and returns { sessionToken } (OTP flow) or { token, user }
// Send both `email` and `username` fields for backwards compatibility with the server
export const loginUser = async (email, password) => {
  return apiCall('/api/auth/login', { method: 'POST', body: { username: email, email, password } })
}

export const verifyOtp = async (sessionToken, otp) => {
  return apiCall('/api/auth/verify-otp', { method: 'POST', body: { sessionToken, otp } })
}

export const resendOtp = async (sessionToken) => {
  return apiCall('/api/auth/resend-otp', { method: 'POST', body: { sessionToken } })
}

export const logoutUser = async (sessionToken) => {
  return apiCall('/api/auth/logout', { method: 'POST', body: { sessionToken } })
}

// Feedback APIs
export const submitFeedback = async (feedbackData) => {
  return apiCall('/api/feedback', { method: 'POST', body: feedbackData })
}

export const getAllFeedback = async () => {
  return apiCall('/api/feedback', { method: 'GET' })
}

// Contact API (if you want to add it to backend)
export const submitContact = async (contactData) => {
  return apiCall('/api/contact', { method: 'POST', body: contactData })
}

