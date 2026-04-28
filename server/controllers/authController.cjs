const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const User = require('../models/User.cjs')
const { sendOtpEmail } = require('../utils/sendOtpEmail.cjs')

const OTP_EXPIRES_MINUTES = parseInt(process.env.OTP_EXPIRES_MINUTES || '5', 10)
const OTP_RESEND_COOLDOWN = parseInt(process.env.OTP_RESEND_COOLDOWN || '60', 10) // seconds
const OTP_MAX_RESEND = parseInt(process.env.OTP_MAX_RESEND || '5', 10)
const OTP_MAX_ATTEMPTS = parseInt(process.env.OTP_MAX_ATTEMPTS || '5', 10)
const JWT_SECRET = process.env.JWT_SECRET || 'replace-me'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'

function genOtp() {
  return String(Math.floor(100000 + Math.random() * 900000))
}

async function register(req, res) {
  try {
    const { email, password, username, fullName } = req.body
    if (!email || !password) return res.status(400).json({ success: false, message: 'Email & password required' })

    const existing = await User.findOne({ email })
    if (existing) return res.status(400).json({ success: false, message: 'Email already registered' })

    const passwordHash = await bcrypt.hash(password, 10)
    const user = new User({ email, username: username || email, fullName, passwordHash })
    await user.save()

    res.json({ success: true, message: 'Registration successful' })
  } catch (err) {
    console.error('register error:', err)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ success: false, message: 'Email & password required' })

    const user = await User.findOne({ email })
    if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' })

    const valid = await bcrypt.compare(password, user.passwordHash)
    if (!valid) return res.status(401).json({ success: false, message: 'Invalid credentials' })

    // generate OTP
    const otp = genOtp()
    const otpHash = await bcrypt.hash(otp, 10)
    const expiresAt = new Date(Date.now() + OTP_EXPIRES_MINUTES * 60 * 1000)
    const sessionToken = crypto.randomBytes(32).toString('hex')

    user.otpHash = otpHash
    user.otpExpiresAt = expiresAt
    user.otpAttempts = 0
    user.otpResendCount = 0
    user.otpLastSentAt = new Date()
    user.otpSessionToken = sessionToken
    await user.save()

    if (process.env.NODE_ENV !== 'production') console.info(`Generated OTP for ${user.email}: ${otp}`)

    // send email (non-blocking)
    ;(async () => {
      try {
        await sendOtpEmail(user.email, user.fullName || user.username, otp, OTP_EXPIRES_MINUTES)
        console.info('OTP email send success', user.email)
      } catch (err) {
        console.error('OTP email send failed (non-blocking):', err && err.message ? err.message : err)
      }
    })()

    const resp = { success: true, message: 'OTP sent', sessionToken }
    if (process.env.NODE_ENV === 'test') resp.otp = otp
    res.json(resp)
  } catch (err) {
    console.error('login error:', err)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

async function resendOtp(req, res) {
  try {
    const { sessionToken } = req.body
    if (!sessionToken) return res.status(400).json({ success: false, message: 'sessionToken required' })

    const user = await User.findOne({ otpSessionToken: sessionToken })
    if (!user) return res.status(404).json({ success: false, message: 'Session not found' })
    if (!user.otpHash) return res.status(400).json({ success: false, message: 'No OTP pending' })

    const now = new Date()
    if (user.otpLastSentAt && (now - new Date(user.otpLastSentAt)) < OTP_RESEND_COOLDOWN * 1000) {
      const wait = Math.ceil((OTP_RESEND_COOLDOWN * 1000 - (now - new Date(user.otpLastSentAt))) / 1000)
      return res.status(429).json({ success: false, message: `Please wait ${wait} seconds before resending` })
    }

    if ((user.otpResendCount || 0) >= OTP_MAX_RESEND) return res.status(429).json({ success: false, message: 'Maximum OTP resends exceeded' })

    const otp = genOtp()
    user.otpHash = await bcrypt.hash(otp, 10)
    user.otpExpiresAt = new Date(Date.now() + OTP_EXPIRES_MINUTES * 60 * 1000)
    user.otpAttempts = 0
    user.otpResendCount = (user.otpResendCount || 0) + 1
    user.otpLastSentAt = new Date()
    await user.save()

    if (process.env.NODE_ENV !== 'production') console.info(`Resent OTP for ${user.email}: ${otp}`)

    ;(async () => {
      try {
        await sendOtpEmail(user.email, user.fullName || user.username, otp, OTP_EXPIRES_MINUTES)
        console.info('OTP resend email success', user.email)
      } catch (err) {
        console.error('OTP resend email failed:', err && err.message ? err.message : err)
      }
    })()

    const resp = { success: true, message: 'OTP resent', sessionToken: user.otpSessionToken }
    if (process.env.NODE_ENV === 'test') resp.otp = otp
    res.json(resp)
  } catch (err) {
    console.error('resendOtp error:', err)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

async function verifyOtp(req, res) {
  try {
    const { sessionToken, otp } = req.body
    if (!sessionToken || !otp) return res.status(400).json({ success: false, message: 'sessionToken and otp required' })

    const user = await User.findOne({ otpSessionToken: sessionToken })
    if (!user || !user.otpHash) return res.status(401).json({ success: false, message: 'OTP not found or session invalid' })

    if (user.otpExpiresAt && new Date(user.otpExpiresAt) < new Date()) return res.status(401).json({ success: false, message: 'OTP expired' })

    if ((user.otpAttempts || 0) >= OTP_MAX_ATTEMPTS) return res.status(429).json({ success: false, message: 'Maximum OTP attempts exceeded' })

    const match = await bcrypt.compare(String(otp), user.otpHash)
    if (!match) {
      user.otpAttempts = (user.otpAttempts || 0) + 1
      await user.save()
      return res.status(401).json({ success: false, message: 'Invalid OTP' })
    }

    // success
    user.otpHash = null
    user.otpExpiresAt = null
    user.otpAttempts = 0
    user.otpResendCount = 0
    user.otpLastSentAt = null
    user.otpSessionToken = null
    user.isVerified = true
    await user.save()

    const payload = { id: user._id, email: user.email }
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })

    console.info(`OTP verified for ${user.email}`)
    res.json({ success: true, message: 'OTP verified', token, user: { id: user._id, email: user.email, name: user.fullName || user.username } })
  } catch (err) {
    console.error('verifyOtp error:', err)
    res.status(500).json({ success: false, message: 'Server error' })
  }
}

module.exports = { register, login, resendOtp, verifyOtp }
