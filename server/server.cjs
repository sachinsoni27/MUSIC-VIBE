require('dotenv').config();
const { app, startDb } = require('./app.cjs')
const path = require('path')
const fs = require('fs')
const sqlite3 = require('sqlite3').verbose()
const bcrypt = require('bcryptjs')
const crypto = require('crypto')

// Initialize SQLite DB for routes that rely on `db`
const dbPath = path.join(__dirname, '..', 'database', 'jamify.db')
const dbDir = path.dirname(dbPath)
if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true })

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Error opening database:', err.message)
  } else {
    console.log('✅ Connected to SQLite database')
    // Initialize schema if available
    try {
      const schemaPath = path.join(__dirname, '..', 'database', 'schema.sql')
      if (fs.existsSync(schemaPath)) {
        const schema = fs.readFileSync(schemaPath, 'utf8')
        db.exec(schema, (err) => {
          if (err) console.error('❌ Error initializing database schema:', err.message)
          else console.log('✅ Database schema initialized')
        })
      }
    } catch (e) {
      console.error('Error ensuring DB schema', e)
    }
  }
})

const PORT = process.env.PORT || 3000

async function startServer() {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/musicvibe'
  console.log('Connecting to MongoDB at', mongoUri)
  try {
    // Use a short server selection timeout in dev so startup is quick when MongoDB isn't available
    await startDb(mongoUri, { serverSelectionTimeoutMS: 2000 })
  } catch (err) {
    // Don't fail the whole server if MongoDB is not available in local/dev environments
    console.warn('MongoDB connection failed — continuing without MongoDB for dev/test:', err && err.message ? err.message : err)
  }

  const serverInstance = app.listen(PORT, '0.0.0.0', () => console.log(`🎵 Music Vibe server running on http://localhost:${PORT} - ${JSON.stringify(serverInstance.address())}`))
}

startServer()

// ==================== AUTHENTICATION ROUTES ====================

// Register new user
app.post('/api/auth/register', async (req, res) => {
    const { username, email, password, fullName } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    try {
        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // Insert user
        const sql = 'INSERT INTO users (username, email, password_hash, full_name) VALUES (?, ?, ?, ?)';
        db.run(sql, [username, email, passwordHash, fullName || null], function(err) {
            if (err) {
                if (err.message.includes('UNIQUE')) {
                    return res.status(400).json({ success: false, message: 'Username or email already exists' });
                }
                return res.status(500).json({ success: false, message: 'Database error' });
            }

            res.json({ 
                success: true, 
                message: 'Registration successful',
                userId: this.lastID 
            });
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Login user (step 1: verify credentials and send OTP)
app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Username and password required' });
    }

    const sql = 'SELECT * FROM users WHERE username = ? OR email = ?';
    db.get(sql, [username, username], async (err, user) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Database error' });
        }

        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Verify password
        const isValid = await bcrypt.compare(password, user.password_hash);
        if (!isValid) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Update last login timestamp for record
        db.run('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?', [user.id]);

        // Create a session token (used to tie OTP to this login attempt)
        const sessionToken = crypto.randomBytes(32).toString('hex');
        const sessionExpiresAt = new Date(Date.now() + (24 * 60 * 60 * 1000)); // session placeholder 24 hours

        db.run('INSERT INTO sessions (user_id, session_token, expires_at) VALUES (?, ?, ?)',
            [user.id, sessionToken, sessionExpiresAt.toISOString()], async function (err) {
                if (err) {
                    console.error('Insert session error:', err)
                    return res.status(500).json({ success: false, message: 'Database error' })
                }

                // Generate a 6-digit OTP
                const otp = String(Math.floor(100000 + Math.random() * 900000))
                const otpExpiresMinutes = parseInt(process.env.OTP_EXPIRES_MINUTES || '5', 10)
                const otpExpiresAt = new Date(Date.now() + otpExpiresMinutes * 60 * 1000)

                try {
                    const otpHash = await bcrypt.hash(otp, 10)
                    db.run('INSERT INTO otps (session_token, otp_hash, expires_at) VALUES (?, ?, ?)', [sessionToken, otpHash, otpExpiresAt.toISOString()])

                    // Send OTP email (non-blocking for login response)
                    try {
                        const { sendOtpEmail } = require('./utils/sendEmail.cjs')
                        sendOtpEmail(user.email, user.full_name || user.username, otp, otpExpiresMinutes)
                          .catch((err) => console.error('sendOtpEmail failed:', err))
                    } catch (emailErr) {
                        console.error('Email util load/send error:', emailErr)
                    }

                    // For automated tests or local debugging only, include plain OTP in response when NODE_ENV=test or ALLOW_TEST_OTP=1
                    const responseObj = { success: true, message: 'OTP sent to registered email', sessionToken, user: { id: user.id, email: user.email, name: user.full_name || user.username } }
                    if (process.env.NODE_ENV === 'test' || process.env.ALLOW_TEST_OTP === '1') responseObj.otp = otp

                    return res.json(responseObj)
                } catch (hashErr) {
                    console.error('OTP hash error:', hashErr)
                    return res.status(500).json({ success: false, message: 'Server error' })
                }
            })
    });
});

// Verify OTP and issue JWT (step 2)
app.post('/api/auth/verify-otp', async (req, res) => {
    const { sessionToken, otp } = req.body
    if (!sessionToken || !otp) return res.status(400).json({ success: false, message: 'sessionToken and otp are required' })

    // Find OTP entry
    const sql = 'SELECT otps.*, sessions.user_id AS user_id FROM otps JOIN sessions ON otps.session_token = sessions.session_token WHERE otps.session_token = ? ORDER BY otps.created_at DESC LIMIT 1'
    db.get(sql, [sessionToken], async (err, row) => {
        if (err) return res.status(500).json({ success: false, message: 'Database error' })
        if (!row) return res.status(401).json({ success: false, message: 'OTP not found or session invalid' })

        const now = new Date()
        const expiresAt = new Date(row.expires_at)
        if (expiresAt < now) return res.status(401).json({ success: false, message: 'OTP expired' })

        const isMatch = await bcrypt.compare(String(otp), row.otp_hash)
        if (!isMatch) {
            // increment attempts
            db.run('UPDATE otps SET attempts = attempts + 1 WHERE id = ?', [row.id])
            return res.status(401).json({ success: false, message: 'Invalid OTP' })
        }

        // OTP valid: mark session as authenticated
        db.run('UPDATE sessions SET is_authenticated = 1 WHERE session_token = ?', [sessionToken])

        // Clean up OTP entry
        db.run('DELETE FROM otps WHERE id = ?', [row.id])

        // Issue JWT now
        try {
            const jwt = require('jsonwebtoken')
            const jwtSecret = process.env.JWT_SECRET || 'default_jwt_secret_change_me'
            const jwtExpires = process.env.JWT_EXPIRES_IN || '7d'

            // Fetch user details
            db.get('SELECT id, username, email, full_name FROM users WHERE id = ?', [row.user_id], (err2, user) => {
                if (err2 || !user) return res.status(500).json({ success: false, message: 'User not found after OTP' })

                const payload = { id: user.id, email: user.email }
                const token = jwt.sign(payload, jwtSecret, { expiresIn: jwtExpires })

                // Optionally store JWT with session (not required) - we won't store JWT but could

                res.json({ success: true, message: 'OTP verified', token, user: { id: user.id, name: user.full_name || user.username, email: user.email } })
            })
        } catch (tokenErr) {
            console.error('JWT generation error:', tokenErr)
            return res.status(500).json({ success: false, message: 'Server error' })
        }
    })
})

// Resend OTP for a pending session
app.post('/api/auth/resend-otp', async (req, res) => {
    const { sessionToken } = req.body
    if (!sessionToken) return res.status(400).json({ success: false, message: 'sessionToken is required' })

    db.get('SELECT * FROM sessions WHERE session_token = ?', [sessionToken], async (err, session) => {
        if (err) return res.status(500).json({ success: false, message: 'Database error' })
        if (!session) return res.status(404).json({ success: false, message: 'Session not found' })
        if (session.is_authenticated) return res.status(400).json({ success: false, message: 'Session already authenticated' })

        // Rate limiting / resend policy
        const otpExpiresMinutes = parseInt(process.env.OTP_EXPIRES_MINUTES || '5', 10)
        const resendCooldown = parseInt(process.env.OTP_RESEND_COOLDOWN || '60', 10) // seconds
        const maxResend = parseInt(process.env.OTP_MAX_RESEND || '5', 10)

        db.get('SELECT * FROM otps WHERE session_token = ? ORDER BY created_at DESC LIMIT 1', [sessionToken], async (err2, row) => {
            if (err2) return res.status(500).json({ success: false, message: 'Database error' })

            const now = new Date()
            let resendCount = 0
            let lastResentAt = null
            if (row) {
                resendCount = row.resend_count || 0
                lastResentAt = row.last_resent_at ? new Date(row.last_resent_at) : null
            }

            if (lastResentAt && (now - lastResentAt) < resendCooldown * 1000) {
                const wait = Math.ceil((resendCooldown * 1000 - (now - lastResentAt)) / 1000)
                return res.status(429).json({ success: false, message: `Please wait ${wait} seconds before resending` })
            }

            if (resendCount >= maxResend) return res.status(429).json({ success: false, message: 'Maximum OTP resends exceeded' })

            // Generate new OTP
            const otp = String(Math.floor(100000 + Math.random() * 900000))
            try {
                const otpHash = await bcrypt.hash(otp, 10)
                const otpExpiresAt = new Date(Date.now() + otpExpiresMinutes * 60 * 1000)

                if (row) {
                    db.run('UPDATE otps SET otp_hash = ?, expires_at = ?, attempts = 0, resend_count = ?, last_resent_at = ? WHERE id = ?', [otpHash, otpExpiresAt.toISOString(), resendCount + 1, now.toISOString(), row.id], (uErr) => {
                        if (uErr) return res.status(500).json({ success: false, message: 'Database error' })

                        // Send email (non-blocking) - look up user email and name
                        db.get('SELECT email, full_name, username FROM users WHERE id = ?', [session.user_id], (uErr, userRow) => {
                            if (uErr) return console.error('Error fetching user for resend email:', uErr)
                            const to = userRow ? userRow.email : null
                            const name = userRow ? (userRow.full_name || userRow.username) : ''
                            if (!to) return console.warn('No user email found for session.user_id', session.user_id)

                            try {
                                const { sendOtpEmail } = require('./utils/sendEmail.cjs')
                                sendOtpEmail(to, name, otp, otpExpiresMinutes)
                                  .catch((err) => console.error('sendOtpEmail failed:', err))
                            } catch (e) {
                                console.error('Email util load/send error:', e)
                            }
                        })

                        const responseObj = { success: true, message: 'OTP resent', sessionToken }
                        if (process.env.NODE_ENV === 'test' || process.env.ALLOW_TEST_OTP === '1') responseObj.otp = otp
                        return res.json(responseObj)
                    })
                } else {
                    db.run('INSERT INTO otps (session_token, otp_hash, expires_at, attempts, resend_count, last_resent_at) VALUES (?, ?, ?, 0, 1, ?)', [sessionToken, otpHash, otpExpiresAt.toISOString(), now.toISOString()], (iErr) => {
                        if (iErr) return res.status(500).json({ success: false, message: 'Database error' })

                        // Send email
                        db.get('SELECT email, full_name, username FROM users WHERE id = ?', [session.user_id], (uErr, userRow) => {
                            if (uErr) return console.error('Error fetching user for resend email:', uErr)
                            const to = userRow ? userRow.email : null
                            const name = userRow ? (userRow.full_name || userRow.username) : ''
                            if (!to) return console.warn('No user email found for session.user_id', session.user_id)

                            try {
                                const { sendOtpEmail } = require('./utils/sendEmail.cjs')
                                sendOtpEmail(to, name, otp, otpExpiresMinutes)
                                  .catch((err) => console.error('sendOtpEmail failed:', err))
                            } catch (e) {
                                console.error('Email util load/send error:', e)
                            }
                        })

                        const responseObj = { success: true, message: 'OTP resent', sessionToken }
                        if (process.env.NODE_ENV === 'test' || process.env.ALLOW_TEST_OTP === '1') responseObj.otp = otp
                        return res.json(responseObj)
                    })
                }
            } catch (hashErr) {
                console.error('OTP hash error:', hashErr)
                return res.status(500).json({ success: false, message: 'Server error' })
            }
        })
    })
})

// Logout user
app.post('/api/auth/logout', (req, res) => {
    const { sessionToken } = req.body;
    
    if (sessionToken) {
        db.run('DELETE FROM sessions WHERE session_token = ?', [sessionToken]);
    }
    
    res.json({ success: true, message: 'Logged out successfully' });
});

// ==================== FEEDBACK ROUTES ====================

// Submit feedback
app.post('/api/feedback', (req, res) => {
    const { name, email, subject, message, rating, userId } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ success: false, message: 'Name, email, and message are required' });
    }

    const sql = 'INSERT INTO feedback (user_id, name, email, subject, message, rating) VALUES (?, ?, ?, ?, ?, ?)';
    db.run(sql, [userId || null, name, email, subject || null, message, rating || null], function(err) {
        if (err) {
            return res.status(500).json({ success: false, message: 'Database error' });
        }

        res.json({ success: true, message: 'Feedback submitted' });
    });
});

// ==================== NEWSLETTER SUBSCRIPTION ROUTES ====================

// Subscribe to newsletter (stores email and optional Clerk user id)
app.post('/api/newsletter/subscribe', (req, res) => {
  console.log('[newsletter] subscribe called with body:', req.body)
  const { email, name, clerkId } = req.body
  if (!email) {
    console.warn('[newsletter] missing email in request body')
    return res.status(400).json({ success: false, message: 'Email is required' })
  }

  // Ensure table exists
  const createSql = `CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email VARCHAR(200) UNIQUE NOT NULL,
    name VARCHAR(200),
    clerk_id VARCHAR(200),
    ip VARCHAR(100),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`

  db.run(createSql, (err) => {
    if (err) {
      console.error('Failed to ensure newsletter_subscribers table:', err)
      return res.status(500).json({ success: false, message: 'Server error' })
    }

    // Insert subscriber (ignore if already exists)
    const insertSql = 'INSERT OR IGNORE INTO newsletter_subscribers (email, name, clerk_id, ip) VALUES (?, ?, ?, ?)'
    const ip = req.ip || req.headers['x-forwarded-for'] || null
    db.run(insertSql, [email, name || null, clerkId || null, ip], function (iErr) {
      if (iErr) {
        console.error('Insert newsletter subscriber error:', iErr)
        return res.status(500).json({ success: false, message: 'Database error' })
      }

      if (this.changes === 0) {
        // Already existed
        console.log('[newsletter] already subscribed:', email)
        return res.json({ success: true, message: 'Already subscribed' })
      }

      console.log('[newsletter] new subscription:', email)
      return res.json({ success: true, message: 'Subscribed' })
    })
  })
})

// Get all feedback (admin)

// Get all feedback (admin)
app.get('/api/feedback', (req, res) => {
    const sql = 'SELECT * FROM feedback ORDER BY created_at DESC';
    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ success: false, message: 'Database error' });
        }
        res.json({ success: true, feedback: rows });
    });
});

// Note: server is started in startServer() to ensure DB connection succeeds.
