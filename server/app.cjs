const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const path = require('path')

const authRoutes = require('./routes/auth.cjs')

const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/api/auth', authRoutes)

// health
app.get('/health', (req, res) => res.json({ ok: true }))

// Export function to connect DB for tests/runner
async function startDb(uri, opts = {}) {
  if (!uri) throw new Error('MongoDB uri required')
  // Modern mongoose no longer needs or supports useNewUrlParser/useUnifiedTopology options.
  const connectOpts = Object.assign({}, opts || {})
  await mongoose.connect(uri, connectOpts)
}

module.exports = { app, startDb }
