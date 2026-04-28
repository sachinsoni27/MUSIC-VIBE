const nodemailer = require('nodemailer')

let transporter = null

async function initTransporter() {
  if (transporter) return transporter

  const user = process.env.EMAIL_USER
  const pass = process.env.EMAIL_PASS

  if (user && pass) {
    transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: { user, pass }
    })

    try {
      await transporter.verify()
      console.info('✅ Email transporter verified')
    } catch (err) {
      console.warn('⚠️ Email transporter verification failed:', err && err.message ? err.message : err)
      // keep transporter — sendMail will surface actual errors
    }

    return transporter
  }

  // Fallback to Ethereal test account for dev/test
  try {
    const testAccount = await nodemailer.createTestAccount()
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: { user: testAccount.user, pass: testAccount.pass }
    })
    console.warn('Using Ethereal test account for emails (EMAIL_USER not set)')
    return transporter
  } catch (err) {
    console.error('Could not create ethereal account:', err)
    throw err
  }
}

function buildHtml(name, otp, expiresMinutes) {
  return `
    <div style="font-family: Arial, sans-serif; color: #111; line-height:1.4;">
      <h2>Hi ${name || 'there'},</h2>
      <p>Your one-time password (OTP) for <strong>Music Vibe</strong> is:</p>
      <p style="font-size:1.6rem; font-weight:700;"><strong>${otp}</strong></p>
      <p>This OTP will expire in ${expiresMinutes} minutes.</p>
      <p><em>Do not share this OTP with anyone.</em></p>
      <p>Thanks,<br/><strong>Team Music Vibe</strong></p>
    </div>
  `
}

async function sendOtpEmail(to, name, otp, expiresMinutes = 5) {
  // In test mode, mock sending to avoid network calls and simplify tests
  if (process.env.NODE_ENV === 'test') {
    console.info(`[test-mode] Mock send OTP to ${to} (otp=${otp})`)
    return { mock: true, otp }
  }

  try {
    const t = await initTransporter()
    const mailOptions = {
      from: process.env.EMAIL_FROM || `"Team Music Vibe" <no-reply@musicvibe.com>`,
      to,
      subject: 'Your OTP Code – Music Vibe 🎶',
      html: buildHtml(name, otp, expiresMinutes)
    }

    const info = await t.sendMail(mailOptions)

    // If ethereal preview URL available, log it for dev convenience
    try {
      const preview = nodemailer.getTestMessageUrl(info)
      if (preview) console.info('Ethereal preview URL:', preview)
    } catch (e) {}

    console.info(`📧 OTP email send attempted to ${to} (messageId=${info.messageId})`)
    return info
  } catch (err) {
    console.error('sendOtpEmail failed:', err && err.message ? err.message : err)
    // bubble up error so caller may log but caller SHOULD not block login on this
    throw err
  }
}

module.exports = { sendOtpEmail }
