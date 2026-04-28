const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..')));

// Database setup
const dbPath = path.join(__dirname, '..', 'database', 'jamify.db');
const schemaPath = path.join(__dirname, '..', 'database', 'schema.sql');

// Ensure database directory exists
const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

// Initialize database
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('❌ Error opening database:', err.message);
    } else {
        console.log('✅ Connected to SQLite database');
        initializeDatabase();
    }
});

// Initialize database with schema
function initializeDatabase() {
    const schema = fs.readFileSync(schemaPath, 'utf8');
    db.exec(schema, (err) => {
        if (err) {
            console.error('❌ Error initializing database:', err.message);
        } else {
            console.log('✅ Database schema initialized');
        }
    });
}

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

// Login user
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

        // Update last login
        db.run('UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?', [user.id]);

        // Create session token
        const sessionToken = require('crypto').randomBytes(32).toString('hex');
        const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        db.run('INSERT INTO sessions (user_id, session_token, expires_at) VALUES (?, ?, ?)',
            [user.id, sessionToken, expiresAt.toISOString()]);

        res.json({
            success: true,
            message: 'Login successful',
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                fullName: user.full_name
            },
            sessionToken
        });
    });
});

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

        res.json({ 
            success: true, 
            message: 'Feedback submitted successfully',
            feedbackId: this.lastID 
        });
    });
});

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

// ==================== NEWSLETTER SUBSCRIPTION ROUTES ====================

// Subscribe to newsletter (stores email and optional Clerk user id)
app.post('/api/newsletter/subscribe', (req, res) => {
  const { email, name, clerkId } = req.body
  if (!email) return res.status(400).json({ success: false, message: 'Email is required' })

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
        return res.json({ success: true, message: 'Already subscribed' })
      }

      return res.json({ success: true, message: 'Subscribed' })
    })
  })
})

// Start server
app.listen(PORT, () => {
    console.log(`🎵 Jamify server running on http://localhost:${PORT}`);
});

