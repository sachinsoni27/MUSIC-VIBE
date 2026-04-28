r
# 🎵 Jamify - Quick Start Guide

## 🚀 Get Started in 3 Steps

### Step 1: Start the Backend Server

Open a terminal and run:

```bash
npm run server
```

Expected output:
```
✅ Connected to SQLite database
✅ Database schema initialized
🎵 Jamify server running on http://localhost:3000
```

### Step 2: Start the React App

Open a **NEW terminal** (keep the backend running) and run:

```bash
npm run dev
```

Expected output:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

---

## ⚙️ Environment variables

Create a `.env` file at the project root (or set env vars in your hosting provider) and add your Clerk publishable key as follows:

```
VITE_CLERK_PUBLISHABLE_KEY=pk_test_YWNjdXJhdGUtYmVlLTQzLmNsZXJrLmFjY291bnRzLmRldiQ
```

Replace the value above with your own Clerk publishable key for production.

---

### Step 3: Open in Browser

Go to: **http://localhost:5173**

---

## 🎯 What You Can Do

### 🏠 **Home Page** (`/`)
- Browse playlists
- View trending artists
- Play songs
- Add songs to playlists

### 🔐 **Authentication**
- **Sign Up** (`/signup`) - Create a new account
- **Login** (`/login`) - Login to your account
- **Logout** - Click logout in navbar

### 💬 **Feedback** (`/feedback`)
- Submit feedback
- Rate your experience
- Contact the team

### 👨‍💼 **Admin** (`/admin-feedback`)
- View all feedback
- See statistics
- Monitor user feedback

### 🧪 **Test Database** (`/test-database`)
- Test backend connection
- Test registration
- Test login
- Test feedback submission

---

## 📱 Navigation

Use the navbar to navigate:
- **Home** - Main page
- **Trending** - Trending songs
- **Contact** - Contact page
- **Feedback** - Submit feedback
- **Login/Signup** - Authentication

---

## 🎵 Music Player

The music player at the bottom allows you to:
- ▶️ Play/Pause
- ⏭️ Next/Previous track
- 🔊 Volume control
- 🔀 Shuffle
- 🔁 Repeat
- ❤️ Like songs

---

## 🔧 Troubleshooting

### Backend not starting?
```bash
# Make sure port 3000 is free
npx kill-port 3000
npm run server
```

### React app not starting?
```bash
# Make sure port 5173 is free
npx kill-port 5173
npm run dev
```

### Need to reinstall?
```bash
rm -rf node_modules
npm install
```

---

## 📚 More Information

See `REACT_MIGRATION_GUIDE.md` for:
- Detailed architecture
- Component structure
- API documentation
- Advanced features

---

## 🎉 Enjoy Jamify!

Your modern React music streaming app is ready! 🎵

