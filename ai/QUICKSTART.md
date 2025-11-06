# ⚡ Quick Start Guide

Get your Expense Tracker running in 5 minutes!

## 🎯 What You'll Need

1. **Node.js 18+** - [Download here](https://nodejs.org/)
2. **MongoDB Atlas account** - [Sign up free](https://www.mongodb.com/cloud/atlas)
3. **Google OAuth credentials** - [Get them here](https://console.cloud.google.com/)

---

## 🚀 Step 1: Install (2 minutes)

```bash
# Clone the repo
git clone <your-repo-url>
cd expense_tracker

# Install all dependencies
npm run install-all
```

---

## 🔑 Step 2: MongoDB Setup (1 minute)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create free cluster (M0)
3. Create database user
4. Network Access → Allow `0.0.0.0/0`
5. Get connection string (looks like this):
   ```
   mongodb+srv://user:password@cluster.mongodb.net/expense-tracker?retryWrites=true&w=majority
   ```

---

## 🔐 Step 3: Google OAuth (2 minutes)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add redirect URI: `http://localhost:5000/api/auth/google/callback`
6. Add authorized origin: `http://localhost:5173`
7. Copy **Client ID** and **Client Secret**

---

## ⚙️ Step 4: Environment Variables (1 minute)

### Backend: Create `server/.env`

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string_from_step_2
JWT_SECRET=any_random_string_minimum_32_characters_long
GOOGLE_CLIENT_ID=your_client_id_from_step_3
GOOGLE_CLIENT_SECRET=your_client_secret_from_step_3
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### Frontend: Create `client/.env`

```env
VITE_API_URL=http://localhost:5000/api
VITE_GOOGLE_CLIENT_ID=same_client_id_from_step_3
```

---

## ▶️ Step 5: Run the App!

```bash
# From the root directory
npm run dev
```

This starts:
- ✅ Backend on http://localhost:5000
- ✅ Frontend on http://localhost:5173

---

## 🎉 Step 6: Test It!

1. Open browser: http://localhost:5173
2. Click **"Sign in with Google"**
3. Authorize the app
4. You should see the dashboard!
5. Click **"Add Expense"** to create your first expense

---

## 📱 What You Can Do

- ✅ Add expenses with categories
- ✅ View all expenses in beautiful cards
- ✅ Filter by category
- ✅ See statistics and charts
- ✅ Switch language (English/Spanish)
- ✅ Edit and delete expenses

---

## 🐛 Troubleshooting

### "MongoDB connection error"
- Double-check your connection string
- Ensure Network Access allows `0.0.0.0/0`

### "Google OAuth redirect error"
- Verify redirect URI exactly matches: `http://localhost:5000/api/auth/google/callback`
- Make sure both Client IDs match in backend and frontend

### "Port already in use"
```bash
# Kill the process and restart
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5000 | xargs kill -9
```

---

## 🚀 Deploy to Production

Ready to deploy? Follow [DEPLOYMENT.md](./DEPLOYMENT.md) for step-by-step instructions to deploy to:
- **Frontend**: Vercel or Netlify (free)
- **Backend**: Render or Railway (free)
- **Database**: MongoDB Atlas (free)

**Total cost: $0/month!**

---

## 📚 Learn More

- [README.md](./README.md) - Full documentation
- [SETUP.md](./SETUP.md) - Detailed setup guide
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Production deployment
- [FEATURES.md](./FEATURES.md) - Complete feature list

---

## 💡 Tips

- Use Chrome DevTools to debug
- Install Redux DevTools extension
- Check the terminal for logs
- MongoDB Compass is great for viewing data

---

## 🎯 Next Steps

1. ✅ Customize the categories
2. ✅ Add your own features
3. ✅ Deploy to production
4. ✅ Share with friends!

---

**Need help?** Check the troubleshooting sections in [SETUP.md](./SETUP.md)

**Happy tracking! 💰**

