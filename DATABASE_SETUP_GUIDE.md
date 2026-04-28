# 🎵 Jamify Database & Authentication Setup Guide

## 📋 Overview

I've successfully created a complete database and authentication system for your Jamify music website with the following features:

### ✅ Features Implemented:

1. **User Authentication System**
   - User registration (signup)
   - User login with session management
   - Password hashing with bcrypt
   - Remember me functionality
   - Logout functionality

2. **Database Structure**
   - SQLite database (no installation needed!)
   - Users table
   - Feedback table
   - Sessions table
   - User playlists table (for future sync)
   - Playlist songs table

3. **Feedback System**
   - User feedback submission
   - Star rating (1-5 stars)
   - Subject and message fields
   - Auto-fill for logged-in users

4. **Backend Server**
   - Node.js + Express server
   - RESTful API endpoints
   - CORS enabled
   - Secure password handling

---

## 🚀 Quick Start

### Step 1: Install Node.js Dependencies

Open your terminal in the jamify folder and run:

```bash
npm install
```

This will install:
- express (web server)
- sqlite3 (database)
- bcryptjs (password encryption)
- cors (cross-origin requests)

### Step 2: Start the Server

```bash
npm start
```

You should see:
```
✅ Connected to SQLite database
✅ Database schema initialized
🎵 Jamify server running on http://localhost:3000
```

### Step 3: Test the System

1. **Open** `index.html` in your browser
2. **Click** "Sign Up" in the navigation
3. **Create** a new account
4. **Login** with your credentials
5. **Submit** feedback using the Feedback page

---

## 📁 Files Created/Modified

### New Files:
- `database/schema.sql` - Database structure
- `server/server.js` - Backend server
- `package.json` - Node.js dependencies
- `feedback.html` - Feedback form page
- `DATABASE_SETUP_GUIDE.md` - This guide

### Modified Files:
- `login.html` - Connected to database backend
- `signup.html` - Connected to database backend
- `auth.css` - Added password toggle and message box styles
- `index.html` - Added login/signup/feedback links and user session display

---

## 🗄️ Database Schema

### Users Table
```sql
- id (Primary Key)
- username (Unique)
- email (Unique)
- password_hash
- full_name
- created_at
- last_login
- is_active
```

### Feedback Table
```sql
- id (Primary Key)
- user_id (Foreign Key)
- name
- email
- subject
- message
- rating (1-5)
- status
- created_at
```

### Sessions Table
```sql
- id (Primary Key)
- user_id (Foreign Key)
- session_token (Unique)
- expires_at
- created_at
```

---

## 🔌 API Endpoints

### Authentication

**POST** `/api/auth/register`
- Register a new user
- Body: `{ username, email, password, fullName }`

**POST** `/api/auth/login`
- Login user
- Body: `{ username, password }`
- Returns: `{ success, user, sessionToken }`

**POST** `/api/auth/logout`
- Logout user
- Body: `{ sessionToken }`

### Feedback

**POST** `/api/feedback`
- Submit feedback
- Body: `{ name, email, subject, message, rating, userId }`

**GET** `/api/feedback`
- Get all feedback (admin)
- Returns: Array of feedback entries

---

## 🎯 How to Use

### For Users:

1. **Sign Up**: Click "Sign Up" → Fill form → Create account
2. **Login**: Click "Login" → Enter credentials → Access features
3. **Feedback**: Click "Feedback" → Rate & submit feedback
4. **Logout**: Click your username → Click "Logout"

### For Developers:

**View Database:**
```bash
# Install SQLite browser or use command line
sqlite3 database/jamify.db
.tables
SELECT * FROM users;
SELECT * FROM feedback;
```

**Clear Database:**
```bash
# Delete the database file
rm database/jamify.db
# Restart server to recreate
npm start
```

---

## 🔒 Security Features

- ✅ Password hashing with bcrypt (10 rounds)
- ✅ Session token generation
- ✅ SQL injection prevention (parameterized queries)
- ✅ Input validation
- ✅ CORS protection
- ✅ Secure session management

---

## 🐛 Troubleshooting

### Server won't start?
```bash
# Make sure Node.js is installed
node --version

# Reinstall dependencies
rm -rf node_modules
npm install
```

### Can't connect to server?
- Make sure server is running (`npm start`)
- Check console for errors
- Verify port 3000 is not in use

### Database errors?
- Delete `database/jamify.db` and restart server
- Check file permissions
- Verify schema.sql exists

### Login not working?
- Open browser console (F12)
- Check for error messages
- Verify server is running
- Clear browser cache

---

## 📊 Database Location

The SQLite database is stored at:
```
jamify/database/jamify.db
```

This is a file-based database - no separate database server needed!

---

## 🎨 Features to Add (Future)

- [ ] Password reset functionality
- [ ] Email verification
- [ ] User profile page
- [ ] Admin dashboard for feedback
- [ ] Sync playlists to database
- [ ] Social login (Google, Facebook)
- [ ] Two-factor authentication

---

## 💡 Tips

1. **Keep server running** while testing the website
2. **Check browser console** for error messages
3. **Use different browsers** to test multiple users
4. **Backup database** before making changes
5. **Read server logs** for debugging

---

## 🎉 Success!

Your Jamify website now has:
- ✅ Complete user authentication
- ✅ Database storage
- ✅ Feedback system
- ✅ Session management
- ✅ Secure password handling

Enjoy your enhanced music platform! 🎵

