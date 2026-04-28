const nodemailer = require('nodemailer')

let transporter = null
let usingEthereal = false
let etherealInfo = null

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

async function initTransporter() {
  // Prefer real SMTP credentials when available
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })
    usingEthereal = false
    return
  }

  // Fallback to Ethereal for development/testing so emails can be previewed
  try {
    const testAccount = await nodemailer.createTestAccount()
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    })
    usingEthereal = true
    etherealInfo = testAccount
    console.warn('⚠️ EMAIL_USER/PASS not set — using Ethereal test account for email previews. Set EMAIL_USER and EMAIL_PASS in .env to send real emails.')
  } catch (err) {
    console.error('Could not create Ethereal test account:', err)
    throw err
  }
}

async function sendOtpEmail(to, name, otp, expiresMinutes = 5) {
  if (!transporter) {
    await initTransporter()
  }

  const subject = 'Your Music Vibe OTP'
  const html = `
    <div style="font-family: Arial, sans-serif; color: #111; line-height: 1.4;">
      <h2>Hi ${escapeHtml(name || 'there')},</h2>
      <p>Your one-time password (OTP) for <strong>Music Vibe</strong> is:</p>
      <p style="font-size: 1.6rem; font-weight: 700;">${escapeHtml(otp)}</p>
      <p>This OTP will expire in ${escapeHtml(String(expiresMinutes))} minutes. If you did not request this, please secure your account.</p>
      <p>Thanks,<br/><strong>Team Music Vibe</strong></p>
    </div>
  `

  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER || 'no-reply@musicvibe.local',
    to,
    subject,
    html,
  }

  try {
    const info = await transporter.sendMail(mailOptions)

    if (usingEthereal) {
      const preview = nodemailer.getTestMessageUrl(info)
      console.info('Ethereal preview URL:', preview)
      // Return preview URL for convenience in tests/logging
      return { info, preview }
    }

    return { info }
  } catch (err) {
    console.error('sendOtpEmail failed:', err && err.message ? err.message : err)
    throw err
  }
}

module.exports = {
  sendOtpEmail,
}
