# ✅ Deployment Checklist

Use this checklist to ensure everything is set up correctly before deploying.

---

## 📋 Pre-Deployment Checklist

### 🗄️ Database Setup
- [ ] Created MongoDB Atlas account
- [ ] Created free M0 cluster
- [ ] Created database user with password
- [ ] Added Network Access IP: `0.0.0.0/0`
- [ ] Copied connection string
- [ ] Replaced `<password>` in connection string
- [ ] Added `/expense-tracker` to connection string
- [ ] Tested connection locally

### 🔐 Google OAuth Setup
- [ ] Created Google Cloud project
- [ ] Enabled Google+ API
- [ ] Configured OAuth consent screen
- [ ] Created OAuth 2.0 credentials
- [ ] Added development redirect URI: `http://localhost:5000/api/auth/google/callback`
- [ ] Added development origin: `http://localhost:5173`
- [ ] Copied Client ID
- [ ] Copied Client Secret
- [ ] Tested Google login locally

### 💻 Local Development
- [ ] Created `server/.env` with all variables
- [ ] Created `client/.env` with all variables
- [ ] Ran `npm run install-all` successfully
- [ ] Backend starts without errors
- [ ] Frontend starts without errors
- [ ] Can sign in with Google
- [ ] Can create expense
- [ ] Can view expenses
- [ ] Can edit expense
- [ ] Can delete expense
- [ ] Statistics page works
- [ ] Language toggle works

### 📝 Code & Repository
- [ ] Committed all code to Git
- [ ] Pushed to GitHub
- [ ] `.env` files are NOT in repository (check `.gitignore`)
- [ ] README is updated with project info
- [ ] Documentation is complete

---

## 🚀 Backend Deployment (Render)

### Setup
- [ ] Created Render account
- [ ] Connected GitHub repository
- [ ] Created new Web Service
- [ ] Set root directory to `server`
- [ ] Set build command: `npm install`
- [ ] Set start command: `npm start`
- [ ] Selected Free plan

### Environment Variables
- [ ] Added `NODE_ENV=production`
- [ ] Added `PORT=5000`
- [ ] Added `MONGODB_URI` (from MongoDB Atlas)
- [ ] Added `JWT_SECRET` (32+ random characters)
- [ ] Added `GOOGLE_CLIENT_ID`
- [ ] Added `GOOGLE_CLIENT_SECRET`
- [ ] Added `CLIENT_URL` (temporary, update after frontend deploy)

### Verification
- [ ] Deployment succeeded
- [ ] Service is running
- [ ] Health check passes: `https://your-backend.onrender.com/api/health`
- [ ] Copied backend URL

---

## 🌐 Frontend Deployment (Vercel)

### Setup
- [ ] Created Vercel account
- [ ] Connected GitHub repository
- [ ] Imported project
- [ ] Set framework preset: Vite
- [ ] Set root directory: `client`
- [ ] Set build command: `npm run build`
- [ ] Set output directory: `dist`

### Environment Variables
- [ ] Added `VITE_API_URL` (your Render backend URL + `/api`)
- [ ] Added `VITE_GOOGLE_CLIENT_ID` (same as backend)

### Verification
- [ ] Deployment succeeded
- [ ] Site is live
- [ ] Can access homepage
- [ ] Copied frontend URL

---

## 🔗 Final Configuration

### Update Backend with Frontend URL
- [ ] Went back to Render dashboard
- [ ] Updated `CLIENT_URL` environment variable to Vercel URL
- [ ] Redeployed backend service

### Update Google OAuth with Production URLs
- [ ] Went to Google Cloud Console
- [ ] Added production frontend URL to authorized origins
- [ ] Added production backend callback to redirect URIs:
  ```
  https://your-backend.onrender.com/api/auth/google/callback
  ```
- [ ] Saved changes

### Final Testing
- [ ] Visited production frontend URL
- [ ] Clicked "Sign in with Google"
- [ ] Successfully logged in
- [ ] Dashboard loads correctly
- [ ] Can create expense
- [ ] Can view expenses list
- [ ] Can edit expense
- [ ] Can delete expense
- [ ] Statistics page shows charts
- [ ] Can switch language
- [ ] Can logout
- [ ] Can login again

---

## 🎉 Post-Deployment

### Performance
- [ ] Page loads in < 3 seconds
- [ ] Images load properly
- [ ] No console errors
- [ ] Mobile responsive works
- [ ] Charts render correctly

### Documentation
- [ ] Updated README with live URL
- [ ] Shared deployment URL with team/friends
- [ ] Created backup of environment variables

### Monitoring
- [ ] Checked Render logs for errors
- [ ] Verified MongoDB Atlas shows connections
- [ ] Tested API endpoints manually if needed

---

## 🔧 Troubleshooting

If something doesn't work, check:

### Backend Issues
- [ ] Render logs show no errors
- [ ] MongoDB Atlas allows connections
- [ ] All environment variables are set correctly
- [ ] Health endpoint returns 200 OK

### Frontend Issues
- [ ] Vercel deployment logs show success
- [ ] Environment variables are set
- [ ] API URL includes `/api` at the end
- [ ] No browser console errors

### OAuth Issues
- [ ] Redirect URIs match exactly (no trailing slashes)
- [ ] Client IDs match in backend and frontend
- [ ] Origins include protocol (https://)
- [ ] Waited 5 minutes after updating Google Console

### Database Issues
- [ ] Connection string includes database name
- [ ] Password doesn't have special characters that need encoding
- [ ] Network Access allows all IPs
- [ ] Database user has read/write permissions

---

## 📊 Success Criteria

Your deployment is successful if:

✅ Users can access the frontend URL
✅ Users can sign in with Google
✅ Users can create/view/edit/delete expenses
✅ Statistics page shows charts
✅ Language switching works
✅ Mobile responsive layout works
✅ No errors in browser console
✅ Backend health check returns success

---

## 🎯 Optional Enhancements

After successful deployment, consider:

- [ ] Add custom domain
- [ ] Enable Vercel Analytics
- [ ] Set up monitoring alerts
- [ ] Add more OAuth providers
- [ ] Implement budget tracking
- [ ] Add export functionality
- [ ] Enable PWA features
- [ ] Add dark mode

---

## 📞 Need Help?

If you're stuck:

1. Check the [DEPLOYMENT.md](./DEPLOYMENT.md) troubleshooting section
2. Review platform status pages (Render, Vercel, MongoDB Atlas)
3. Check deployment logs on each platform
4. Verify all environment variables
5. Test locally with production environment variables

---

**Congratulations on deploying your Expense Tracker! 🎊**

Share your URL and start tracking expenses!

