# 🚀 Quick Start - Firebase Edition

## Get Your App Running in 5 Minutes!

### Step 1: Firebase Project (2 minutes)

1. Open [Firebase Console](https://console.firebase.google.com/)
2. Click **"Create a project"** or **"Add project"**
3. Name: `expense-tracker` (or anything you like)
4. Disable Google Analytics (optional)
5. Click **"Create project"**
6. Once created, click **"Continue"**

### Step 2: Enable Firestore (1 minute)

1. In your project, click **"Build"** menu → **"Firestore Database"**
2. Click **"Create database"** button
3. Select **"Start in test mode"** radio button
4. Choose your location (closest to you)
5. Click **"Enable"**

### Step 3: Get Project ID (30 seconds)

1. Click the **gear icon** ⚙️ → **"Project settings"**
2. Copy your **Project ID** (example: `expense-tracker-a1b2c`)

### Step 4: Configure Your App (1 minute)

Edit `server/.env`:

```env
FIREBASE_PROJECT_ID=expense-tracker-a1b2c
```

Replace with your actual Project ID from Step 3.

### Step 5: Test & Run (30 seconds)

```bash
# Test Firebase connection
npm run test-firebase

# Start your app
npm run dev
```

### Step 6: Use Your App!

1. Open browser: `http://localhost:5173`
2. Click **"Sign in with Google"**
3. Start tracking expenses! 💰

## ✅ You're Done!

That's it! Your expense tracker is now running on Firebase Firestore.

### Verify It Works

Go to Firebase Console → Firestore Database. After logging in and creating an expense, you'll see:

- `users` collection (your account)
- `expenses` collection (your expenses)

## 📚 Next Steps

- **[TESTING_GUIDE.md](./TESTING_GUIDE.md)** - Test all features
- **[FIREBASE_SETUP.md](./FIREBASE_SETUP.md)** - Detailed setup & security
- **[README.md](./README.md)** - Full documentation

## 🐛 Issues?

### Server won't start?

```bash
cd server
npm install firebase-admin
npm run dev
```

### Test fails?

Check that `FIREBASE_PROJECT_ID` in `server/.env` matches your Firebase project.

### Login doesn't work?

Your Google OAuth credentials are still needed in `server/.env`:
```env
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
```

## 🎉 That's It!

You're now running on Firebase - reliable, fast, and no more connection issues!

---

**Need more help?** See [FIREBASE_MIGRATION_COMPLETE.md](./FIREBASE_MIGRATION_COMPLETE.md) for complete details.

