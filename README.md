# 💰 Expense Tracker

A modern, full-stack expense tracking application with React, Redux Toolkit, Firebase Firestore, and Google authentication. Track your expenses in Indian Rupees (₹).

> **🎯 New to this project?** Start with [ai/QUICK_START_FIREBASE.md](./ai/QUICK_START_FIREBASE.md) for a 5-minute setup guide!

## 📚 Documentation

- **[ai/QUICK_START_FIREBASE.md](./ai/QUICK_START_FIREBASE.md)** - Get running in 5 minutes! ⚡🔥
- **[ai/DEPLOYMENT_QUICK_START.md](./ai/DEPLOYMENT_QUICK_START.md)** - 5-minute Google Cloud deployment! 🚀⚡
- **[ai/GOOGLE_CLOUD_DEPLOYMENT.md](./ai/GOOGLE_CLOUD_DEPLOYMENT.md)** - Complete Google Cloud + Firebase deployment guide 🌐
- **[ai/FIREBASE_MIGRATION_COMPLETE.md](./ai/FIREBASE_MIGRATION_COMPLETE.md)** - Migration summary 📋
- **[ai/FIREBASE_SETUP.md](./ai/FIREBASE_SETUP.md)** - Firebase Firestore setup guide 🔥
- **[ai/TESTING_GUIDE.md](./ai/TESTING_GUIDE.md)** - Complete testing checklist ✅
- **[ai/SETUP.md](./ai/SETUP.md)** - Detailed local development setup 🛠️
- **[ai/DEPLOYMENT.md](./ai/DEPLOYMENT.md)** - Alternative deployment options 🚀
- **[ai/FEATURES.md](./ai/FEATURES.md)** - Complete feature list ✨
- **[ai/PROJECT_SUMMARY.md](./ai/PROJECT_SUMMARY.md)** - Technical overview 📊

---

## 🚀 Features

- ✅ Google OAuth Authentication
- ✅ Create, Read, Update, Delete Expenses
- ✅ Expense Categories & Filters
- ✅ Monthly Statistics & Analytics
- ✅ Multi-language Support (i18n)
- ✅ **Indian Rupee (₹) Currency Support**
- ✅ Responsive Design with Tailwind CSS
- ✅ State Management with Redux Toolkit
- ✅ Lazy Loading for Optimal Performance

## 🛠️ Tech Stack

**Frontend:**
- React 18
- Vite
- Redux Toolkit
- React Router v6
- Tailwind CSS
- React i18next
- Axios

**Backend:**
- Node.js
- Express
- Firebase Firestore (NoSQL Database)
- Passport.js (Google OAuth)
- JWT Authentication

## ⚡ Quick Start

### 🔥 NEW: Firebase Firestore Integration!

**No more MongoDB connection issues!** This project now uses Firebase Firestore for reliable, scalable data storage.

### 🎉 Automatic Setup (5 minutes)

**Windows:**
```bash
start-app.bat
```

This will:
1. ✅ Check Firebase configuration
2. ✅ Start both frontend and backend
3. ✅ Open your app at http://localhost:5173

### Option 1: Manual Start
```bash
npm run dev
```

### Option 2: Express Setup Guide
Follow [QUICKSTART.md](./QUICKSTART.md) for the fastest way to get started!

### Option 3: Detailed Setup
Follow [SETUP.md](./SETUP.md) for step-by-step instructions with explanations.

### Prerequisites
- Node.js 18+
- Firebase account (free tier)
- Google OAuth credentials

### Basic Installation

```bash
# Clone and install
git clone <your-repo>
cd expense_tracker
npm run install-all
```

### 2. Firebase Setup

**See [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) for detailed Firebase setup instructions!**

Quick steps:
1. Create Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Firestore Database (start in test mode)
3. Copy your Project ID

### 3. Environment Setup

#### Backend (.env in /server)
```env
PORT=5000
FIREBASE_PROJECT_ID=your_firebase_project_id
JWT_SECRET=your_jwt_secret_key_min_32_characters
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

#### Frontend (.env in /client)
```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=your_google_client_id
```

### 4. Get Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:5000/api/auth/google/callback` (development)
   - `https://your-backend-url.com/api/auth/google/callback` (production)
6. Add authorized JavaScript origins:
   - `http://localhost:5173` (development)
   - `https://your-frontend-url.com` (production)


## 🏃 Running Locally

### **Quick Start (Windows)**

```bash
start-app.bat
```

This will test Firebase connection and start both servers.

### **Manual Start**

```bash
# Test Firebase connection first
npm run test-firebase

# Run both frontend and backend
npm run dev

# Run only frontend (http://localhost:5173)
npm run client

# Run only backend (http://localhost:5000)
npm run server
```

## 🌐 Deployment

### 🚀 Recommended: Google Cloud + Firebase (100% Free!)

Deploy everything to Google's infrastructure:

**🔥 Quick Deploy (5 minutes):**

```bash
# 1. Deploy Backend to Cloud Run
cd server
gcloud run deploy expense-tracker-api --source . --region us-central1

# 2. Deploy Frontend to Firebase Hosting
cd ../client && npm run build && cd ..
firebase deploy --only hosting
```

**Or use the automated script:**
```bash
deploy.bat  # Windows
```

**📚 Full Guide:** See [ai/DEPLOYMENT_QUICK_START.md](./ai/DEPLOYMENT_QUICK_START.md) or [ai/GOOGLE_CLOUD_DEPLOYMENT.md](./ai/GOOGLE_CLOUD_DEPLOYMENT.md)

**Why Google Cloud?**
- ✅ Backend & Database in same ecosystem
- ✅ No cold starts (Cloud Run is fast!)
- ✅ Generous free tier (2M requests/month)
- ✅ Global CDN included
- ✅ Automatic SSL certificates
- ✅ Easy CI/CD with Cloud Build

---

### Alternative: Deploy to Render + Vercel

#### Deploy Backend to Render

1. Push code to GitHub
2. Go to [Render](https://render.com)
3. Create new Web Service
4. Connect your repository
5. Configure:
   - Build Command: `cd server && npm install`
   - Start Command: `cd server && npm start`
6. Add environment variables (see [ai/DEPLOYMENT.md](./ai/DEPLOYMENT.md))
7. Deploy!

#### Deploy Frontend to Vercel

1. Go to [Vercel](https://vercel.com)
2. Import your GitHub repository
3. Configure:
   - Framework Preset: Vite
   - Root Directory: `client`
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Add environment variables from client/.env
5. Deploy!

### Other Free Platforms

**Backend:**
- Google Cloud Run (Recommended!)
- Railway.app
- Fly.io
- Render

**Frontend:**
- Firebase Hosting (Recommended!)
- Vercel
- Netlify
- Cloudflare Pages

## 📱 Usage

1. Click "Sign in with Google"
2. Add expenses with amount, category, description, and date
3. View all expenses in the dashboard
4. Filter by category or date range
5. View monthly statistics
6. Edit or delete expenses
7. Change language (English/Spanish)

## 🌍 Supported Languages

- English (en)
- Spanish (es)

Add more languages in `/client/src/i18n/locales/`

## 🔒 Security Features

- JWT token authentication
- HTTP-only cookies
- CORS configuration
- Input validation
- Firestore security rules
- Helmet.js security headers
- Rate limiting

## 📄 License

MIT

## 🤝 Contributing

Contributions welcome! Please open an issue or submit a PR.

---

**Made with ❤️ for efficient expense tracking**

