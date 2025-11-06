# 🔥 Firebase Firestore Setup Guide

Your expense tracker now uses **Firebase Firestore** instead of MongoDB! This guide will help you set up Firebase for your project.

## ✨ Why Firebase?

- ✅ No connection issues or IP whitelisting
- ✅ Generous free tier (1GB storage, 50K reads/day)
- ✅ Real-time sync capabilities
- ✅ Easy integration with Google Auth (already using it!)
- ✅ Automatic scaling and reliability

## 🚀 Quick Setup (5 minutes)

### Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**
3. Enter project name: `expense-tracker` (or any name you like)
4. Disable Google Analytics (optional, not needed for this project)
5. Click **"Create project"**

### Step 2: Enable Firestore Database

1. In your Firebase project, click **"Build"** → **"Firestore Database"**
2. Click **"Create database"**
3. Select **"Start in test mode"** (we'll add security rules later)
4. Choose your preferred location (closest to your users)
5. Click **"Enable"**

### Step 3: Get Your Project ID

1. In Firebase Console, click the **gear icon** ⚙️ → **"Project settings"**
2. Copy your **Project ID** (example: `expense-tracker-12345`)

### Step 4: Update Your `.env` File

Open `server/.env` and update:

```env
FIREBASE_PROJECT_ID=your-project-id-here
```

That's it! Your app is now using Firebase Firestore! 🎉

## 🔒 Optional: Add Security Rules (Recommended for Production)

In Firebase Console → Firestore Database → Rules, replace with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection - users can only read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Expenses collection - users can only access their own expenses
    match /expenses/{expenseId} {
      allow read, write: if request.auth != null &&
                           resource.data.user == request.auth.uid;
      allow create: if request.auth != null &&
                      request.resource.data.user == request.auth.uid;
    }
  }
}
```

**Note:** For now, test mode is fine for development. Update rules before deploying to production.

## 🔧 Advanced: Using Service Account (Optional)

For production or if you need more control:

### Step 1: Generate Service Account Key

1. Go to Firebase Console → Project Settings → Service Accounts
2. Click **"Generate new private key"**
3. Save the JSON file securely

### Step 2: Add to Environment

**Option A:** Set as environment variable (one line, escape quotes):

```env
FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"..."}
```

**Option B:** Store file and reference path:

```env
FIREBASE_SERVICE_ACCOUNT_PATH=./firebase-service-account.json
```

**⚠️ Security Warning:** Never commit service account keys to git!

## 🧪 Test Your Setup

### Test 1: Check Firebase Connection

```bash
cd server
npm run test-firebase
```

You should see:
```
✅ Firebase initialized
✅ Write successful
✅ Read successful
✅ Delete successful
✨ All Firebase tests passed!
```

### Test 2: Start the Server

```bash
npm run dev
```

You should see:
```
✅ Firebase initialized successfully
✅ Firebase Firestore connected successfully
🚀 Server running on port 5000
```

### Test 3: Test Authentication

1. Start the frontend: `npm run client` (from root)
2. Click "Sign in with Google"
3. Complete authentication
4. Check server logs - you should see user created in Firestore

## 📊 View Your Data

1. Go to Firebase Console → Firestore Database
2. You'll see collections: `users` and `expenses`
3. Click to view/edit data in real-time

## 🚀 Deployment

Firebase works seamlessly with all deployment platforms:

- **Vercel/Netlify**: Just set `FIREBASE_PROJECT_ID` in environment variables
- **Render/Railway**: Same - add to environment variables
- **Docker**: Include in .env or pass as environment variable

No need for IP whitelisting or connection strings!

## 🆘 Troubleshooting

### Error: "Firebase initialization failed"

**Solution:** Make sure `FIREBASE_PROJECT_ID` is set in `server/.env`

### Error: "Permission denied"

**Solution:**
1. Check Firestore Rules (make sure test mode is enabled for development)
2. Verify user authentication is working

### Error: "Cannot find module 'firebase-admin'"

**Solution:**
```bash
cd server
npm install firebase-admin
```

## 🎯 What Changed?

| Before (MongoDB) | After (Firebase) |
|-----------------|------------------|
| Connection strings | Just project ID |
| IP whitelisting required | Not needed |
| Mongoose models | Firestore services |
| Connection timeouts | Instant connection |
| 512MB free tier | 1GB free tier |

## 📚 Next Steps

1. ✅ Set up Firebase (you're here!)
2. ✅ Test authentication
3. ✅ Create some expenses
4. ✅ View statistics
5. 🚀 Deploy to production

## 💡 Pro Tips

- Firebase Console has a great data viewer - use it to debug
- Firestore is NoSQL like MongoDB, but with better real-time support
- Free tier is generous: 50K reads, 20K writes, 20K deletes per day
- Firestore handles scaling automatically
- No need to worry about server maintenance

## 🎉 You're All Set!

Your expense tracker is now powered by Firebase Firestore. No more connection issues!

Need help? Check the [Firebase Documentation](https://firebase.google.com/docs/firestore) or reach out!

