# 🛠️ Local Development Setup

Quick start guide to run the Expense Tracker locally.

## Prerequisites

- **Node.js 18+** ([Download](https://nodejs.org/))
- **MongoDB Atlas Account** (free tier)
- **Google OAuth Credentials**

---

## 📦 Installation

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd expense_tracker
```

### 2. Install dependencies

```bash
npm run install-all
```

This installs dependencies for both frontend and backend.

---

## 🔑 Environment Setup

### Backend Configuration

Create `server/.env`:

```bash
cd server
cp .env.example .env
```

Edit `server/.env`:

```env
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/expense-tracker?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_key_minimum_32_characters_long_random_string
GOOGLE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abcdefghijklmnopqrstuvwxyz
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### Frontend Configuration

Create `client/.env`:

```bash
cd ../client
cp .env.example .env
```

Edit `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com
```

---

## 🗄️ MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster (M0 Free Tier)
4. Create database user:
   - Username: `expenseUser`
   - Password: `<strong-password>`
5. Network Access: Add IP `0.0.0.0/0` (allow from anywhere)
6. Get connection string:
   - Click "Connect" → "Connect your application"
   - Copy connection string
   - Replace `<password>` with your password
   - Add database name: `/expense-tracker`

---

## 🔐 Google OAuth Setup

### 1. Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project: "Expense Tracker Dev"
3. Enable **Google+ API**

### 2. Configure OAuth Consent Screen

1. Go to **APIs & Services** → **OAuth consent screen**
2. Choose **External**
3. Fill required fields:
   - App name: "Expense Tracker"
   - User support email: your email
   - Developer contact: your email
4. Add scopes:
   - `.../auth/userinfo.email`
   - `.../auth/userinfo.profile`
5. Add test users (your Gmail)

### 3. Create OAuth Credentials

1. Go to **Credentials** → **Create Credentials** → **OAuth client ID**
2. Application type: **Web application**
3. Name: "Expense Tracker Local"
4. Add **Authorized JavaScript origins:**
   ```
   http://localhost:5173
   ```
5. Add **Authorized redirect URIs:**
   ```
   http://localhost:5000/api/auth/google/callback
   ```
6. Click **Create**
7. Copy **Client ID** and **Client Secret**
8. Add to `.env` files

---

## 🚀 Running the Application

### Option 1: Run Both (Recommended)

```bash
# From root directory
npm run dev
```

This starts:
- Backend on `http://localhost:5000`
- Frontend on `http://localhost:5173`

### Option 2: Run Separately

**Terminal 1 - Backend:**
```bash
npm run server
```

**Terminal 2 - Frontend:**
```bash
npm run client
```

---

## ✅ Verify Setup

1. Open browser: `http://localhost:5173`
2. Click "Sign in with Google"
3. Authorize the app
4. You should see the dashboard
5. Add a test expense

---

## 🧪 Testing

### Backend API Test

```bash
# Health check
curl http://localhost:5000/api/health

# Should return: {"status":"ok","message":"Server is running"}
```

### Database Connection Test

Check backend terminal for:
```
✅ MongoDB Connected: cluster0-xxxxx.mongodb.net
```

---

## 📁 Project Structure

```
expense_tracker/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Route pages
│   │   ├── store/         # Redux store
│   │   ├── services/      # API services
│   │   ├── i18n/          # Translations
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
│
├── server/                # Node.js backend
│   ├── config/           # Database & passport config
│   ├── models/           # MongoDB schemas
│   ├── routes/           # API routes
│   ├── middleware/       # Auth & error handling
│   ├── package.json
│   └── server.js
│
├── package.json          # Root package (scripts)
└── README.md
```

---

## 🐛 Common Issues

### Port Already in Use

```bash
# Kill process on port 5000 (backend)
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5000 | xargs kill -9

# Kill process on port 5173 (frontend)
# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5173 | xargs kill -9
```

### MongoDB Connection Error

- Verify connection string in `.env`
- Check Network Access whitelist
- Ensure database user has read/write permissions

### Google OAuth Error

- Verify redirect URI exactly matches: `http://localhost:5000/api/auth/google/callback`
- Check Client ID in both backend and frontend `.env`
- Clear browser cookies and try again

### CORS Error

- Ensure `CLIENT_URL` in backend `.env` matches frontend URL
- Restart backend after changing `.env`

---

## 🔄 Development Workflow

1. Make changes to code
2. Frontend auto-reloads (Vite HMR)
3. Backend auto-reloads (nodemon)
4. Test in browser
5. Commit changes

---

## 📦 Building for Production

### Frontend Build

```bash
cd client
npm run build
```

Output: `client/dist/`

### Backend

No build needed - Node.js runs directly

---

## 🎯 Next Steps

- [ ] Read the full [README.md](./README.md)
- [ ] Check [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment
- [ ] Explore the codebase
- [ ] Add custom features
- [ ] Deploy to production!

---

## 💡 Tips

- Use **React DevTools** extension for debugging
- Use **Redux DevTools** extension for state inspection
- Check browser console for errors
- Monitor backend terminal for API logs
- Use MongoDB Compass to view database

---

**Happy coding! 🎉**

