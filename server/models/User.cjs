const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: { type: String, unique: false },
  email: { type: String, unique: true, required: true },
  passwordHash: { type: String, required: true },
  fullName: { type: String },

  // OTP fields
  otpHash: { type: String, default: null },
  otpExpiresAt: { type: Date, default: null },
  otpAttempts: { type: Number, default: 0 },
  otpResendCount: { type: Number, default: 0 },
  otpLastSentAt: { type: Date, default: null },
  otpSessionToken: { type: String, default: null },

  isVerified: { type: Boolean, default: false },

  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model('User', userSchema)
