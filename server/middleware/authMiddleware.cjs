const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET || 'replace-me'

function requireAuth(req, res, next) {
  const auth = req.headers.authorization
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ success: false, message: 'Unauthorized' })
  const token = auth.split(' ')[1]
  try {
    const payload = jwt.verify(token, JWT_SECRET)
    req.user = payload
    next()
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid token' })
  }
}

module.exports = { requireAuth }
