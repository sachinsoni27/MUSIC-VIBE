const express = require('express')
const router = express.Router()
const { register, login, resendOtp, verifyOtp } = require('../controllers/authController.cjs')

router.post('/register', register)
router.post('/login', login)
router.post('/resend-otp', resendOtp)
router.post('/verify-otp', verifyOtp)

module.exports = router
