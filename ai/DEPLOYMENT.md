# 🚀 Deployment Guide

This guide will help you deploy your Expense Tracker app to free platforms.

## 📋 Prerequisites

1. **GitHub Account** - Push your code to GitHub
2. **MongoDB Atlas Account** - Free tier database
3. **Google OAuth Credentials** - For authentication
4. **Vercel/Netlify Account** - For frontend
5. **Render/Railway Account** - For backend

---

## 1️⃣ Setup MongoDB Atlas (Free)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account and cluster
3. Click **"Connect"** → **"Connect your application"**
4. Copy your connection string
5. Replace `<password>` with your database user password
6. Add `/expense-tracker` before the `?` in the connection string

Example: `mongodb+srv://user:password@cluster.mongodb.net/expense-tracker?retryWrites=true&w=majority`

**Network Access:**
- Go to Network Access → Add IP Address → Allow Access from Anywhere (0.0.0.0/0)

---

## 2️⃣ Setup Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project: **"Expense Tracker"**
3. Enable **Google+ API**
4. Go to **Credentials** → Create OAuth 2.0 Client ID
5. Configure OAuth consent screen (External type)
6. Add authorized redirect URIs:
   ```
   https://your-backend-url.com/api/auth/google/callback
   http://localhost:5000/api/auth/google/callback
   ```
7. Add authorized JavaScript origins:
   ```
   https://your-frontend-url.com
   http://localhost:5173
   ```
8. Copy **Client ID** and **Client Secret**

---

## 3️⃣ Deploy Backend to Render

### Option A: Using Dashboard

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure:
   - **Name:** expense-tracker-api
   - **Root Directory:** `server`
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free

5. Add Environment Variables:
   ```
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_random_secret_min_32_chars
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   CLIENT_URL=https://your-frontend-url.vercel.app
   ```

6. Click **"Create Web Service"**
7. Wait for deployment (first deploy takes 5-10 minutes)
8. Copy your backend URL: `https://expense-tracker-api-xxxx.onrender.com`

### Option B: Using render.yaml

1. Push `server/render.yaml` to your repository
2. Go to Render Dashboard → **"New"** → **"Blueprint"**
3. Connect repository and select `server/render.yaml`
4. Add environment variables as above

**Note:** Free tier sleeps after 15 minutes of inactivity. First request after sleep takes 30-60 seconds.

---

## 4️⃣ Deploy Backend to Railway (Alternative)

1. Go to [Railway](https://railway.app/)
2. Sign in with GitHub
3. Click **"New Project"** → **"Deploy from GitHub repo"**
4. Select your repository
5. Configure:
   - **Root Directory:** `server`
   - Add environment variables (same as above)
6. Railway will auto-deploy
7. Go to Settings → Generate Domain
8. Copy your Railway URL

---

## 5️⃣ Deploy Frontend to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** `client`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

5. Add Environment Variables:
   ```
   VITE_API_URL=https://your-backend-url.onrender.com/api
   VITE_GOOGLE_CLIENT_ID=your_google_client_id
   ```

6. Click **"Deploy"**
7. Wait for deployment (2-3 minutes)
8. Copy your Vercel URL: `https://expense-tracker-xxxx.vercel.app`

---

## 6️⃣ Deploy Frontend to Netlify (Alternative)

1. Go to [Netlify](https://app.netlify.com/)
2. Click **"Add new site"** → **"Import an existing project"**
3. Connect to GitHub and select repository
4. Configure:
   - **Base directory:** `client`
   - **Build command:** `npm run build`
   - **Publish directory:** `client/dist`

5. Add Environment Variables:
   ```
   VITE_API_URL=https://your-backend-url.onrender.com/api
   VITE_GOOGLE_CLIENT_ID=your_google_client_id
   ```

6. Click **"Deploy"**
7. Copy your Netlify URL

---

## 7️⃣ Update Google OAuth with Production URLs

1. Go back to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to your OAuth 2.0 Client
3. Add your production URLs:

   **Authorized JavaScript origins:**
   ```
   https://your-app.vercel.app
   ```

   **Authorized redirect URIs:**
   ```
   https://your-backend.onrender.com/api/auth/google/callback
   ```

4. Save changes

---

## 8️⃣ Update Backend Environment Variable

Go back to your backend deployment (Render/Railway) and update:

```
CLIENT_URL=https://your-app.vercel.app
```

This ensures OAuth redirects work correctly.

---

## 9️⃣ Test Your Deployment

1. Visit your frontend URL: `https://your-app.vercel.app`
2. Click **"Sign in with Google"**
3. Authorize the app
4. You should be redirected to the dashboard
5. Add an expense to test full functionality

---

## 🔧 Troubleshooting

### Backend Issues

**"Application Error"**
- Check Render/Railway logs
- Verify all environment variables are set
- Ensure MongoDB connection string is correct

**"502 Bad Gateway"**
- Backend is starting up (wait 30-60s on free tier)
- Check if MongoDB Atlas allows connections from anywhere

### Frontend Issues

**"Network Error"**
- Verify `VITE_API_URL` points to correct backend URL
- Check backend is running and accessible
- Ensure CORS is configured correctly

**Google OAuth Not Working**
- Verify redirect URIs match exactly in Google Console
- Check `CLIENT_URL` in backend matches frontend URL
- Clear browser cookies and try again

### Database Issues

**"MongoServerError: Authentication failed"**
- Verify database user credentials in connection string
- Check Network Access whitelist in MongoDB Atlas

---

## 💰 Cost Breakdown (All FREE!)

| Service | Free Tier |
|---------|-----------|
| **Frontend (Vercel)** | Unlimited hobby projects |
| **Frontend (Netlify)** | 100GB bandwidth/month |
| **Backend (Render)** | 750 hours/month (sleeps after 15min) |
| **Backend (Railway)** | $5 credit/month (enough for small apps) |
| **Database (MongoDB Atlas)** | 512MB storage, shared cluster |
| **Google OAuth** | Free |

**Total: $0/month** ✅

---

## 🔄 Continuous Deployment

Both Vercel/Netlify and Render/Railway support automatic deployments:

1. Push to your `main` branch
2. Platforms automatically detect changes
3. Rebuild and redeploy (2-5 minutes)
4. Your app is updated!

---

## 🎯 Next Steps

1. ✅ Add custom domain (Vercel/Netlify provide free subdomains)
2. ✅ Enable analytics (Vercel Analytics is free)
3. ✅ Add more OAuth providers (GitHub, Facebook)
4. ✅ Implement email notifications
5. ✅ Add budget tracking features

---

## 📞 Support

If you encounter issues:

1. Check platform status pages
2. Review deployment logs
3. Test locally first with production environment variables
4. Check MongoDB Atlas metrics
5. Verify Google OAuth configuration

---

**Congratulations! Your Expense Tracker is now live! 🎉**

Share your deployment URL and start tracking expenses!

