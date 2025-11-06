# 🔧 Troubleshooting Guide

Common issues and their solutions.

---

## ❌ "OAuth2Strategy requires a clientID option"

**Error:**
```
TypeError: OAuth2Strategy requires a clientID option
```

**Cause:** The `server/.env` file is missing or doesn't have Google OAuth credentials.

**Solution:**

1. **Check if `server/.env` exists:**
   ```bash
   # Windows
   dir server\.env

   # Mac/Linux
   ls server/.env
   ```

2. **If it doesn't exist, create it:**
   ```bash
   # Windows
   copy server\.env.example server\.env

   # Mac/Linux
   cp server/.env.example server/.env
   ```

3. **Add your credentials to `server/.env`:**
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=any_random_string_minimum_32_characters_long
   GOOGLE_CLIENT_ID=your_google_client_id_here
   GOOGLE_CLIENT_SECRET=your_google_client_secret_here
   CLIENT_URL=http://localhost:5173
   NODE_ENV=development
   ```

4. **Get Google OAuth credentials:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a project
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add redirect URI: `http://localhost:5000/api/auth/google/callback`
   - Add authorized origin: `http://localhost:5173`
   - Copy Client ID and Client Secret

5. **Restart the server:**
   ```bash
   npm run server
   ```

---

## ❌ MongoDB Connection Error

**Error:**
```
MongoServerError: Authentication failed
```

**Solutions:**

1. **Check connection string format:**
   ```
   mongodb+srv://username:password@cluster.mongodb.net/expense-tracker?retryWrites=true&w=majority
   ```

2. **Verify:**
   - Username is correct
   - Password is correct (no special characters that need encoding)
   - Database name is included (`/expense-tracker`)
   - Network Access allows `0.0.0.0/0`

3. **Test connection:**
   - Go to MongoDB Atlas dashboard
   - Click "Connect" → "Connect your application"
   - Copy the exact connection string
   - Replace `<password>` with your actual password

---

## ❌ Port Already in Use

**Error:**
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solution:**

**Windows:**
```bash
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

**Mac/Linux:**
```bash
lsof -ti:5000 | xargs kill -9
```

Or change the port in `server/.env`:
```env
PORT=5001
```

---

## ❌ Cannot Find Module

**Error:**
```
Error: Cannot find module 'express'
```

**Solution:**
```bash
# Reinstall dependencies
cd server
npm install

# Or from root
npm run install-all
```

---

## ❌ CORS Error

**Error:**
```
Access to XMLHttpRequest blocked by CORS policy
```

**Solution:**

1. **Check `CLIENT_URL` in `server/.env`:**
   ```env
   CLIENT_URL=http://localhost:5173
   ```

2. **Restart backend after changing .env:**
   ```bash
   npm run server
   ```

3. **Verify frontend is running on correct port:**
   ```
   http://localhost:5173
   ```

---

## ❌ Google OAuth Redirect Error

**Error:**
```
redirect_uri_mismatch
```

**Solution:**

1. **Verify redirect URI in Google Console matches EXACTLY:**
   ```
   http://localhost:5000/api/auth/google/callback
   ```

   ⚠️ No trailing slash!
   ⚠️ Must include `/api/auth/google/callback`

2. **Check authorized JavaScript origins:**
   ```
   http://localhost:5173
   ```

3. **Wait 5 minutes** after updating Google Console (changes take time)

4. **Clear browser cookies and try again**

---

## ❌ Frontend Build Errors

**Error:**
```
Could not resolve dependencies
```

**Solution:**
```bash
cd client
rm -rf node_modules package-lock.json
npm install
npm run dev
```

---

## ❌ Environment Variables Not Loading

**Symptoms:**
- Server starts but crashes immediately
- undefined values in logs
- OAuth errors

**Solution:**

1. **Check .env file location:**
   - Should be: `server/.env` (inside server folder)
   - NOT: `.env` (in root)

2. **Check .env file format:**
   - No spaces around `=`
   - No quotes around values
   - One variable per line

   ✅ Correct:
   ```env
   PORT=5000
   GOOGLE_CLIENT_ID=abc123
   ```

   ❌ Wrong:
   ```env
   PORT = 5000
   GOOGLE_CLIENT_ID = "abc123"
   ```

3. **Restart server after changes:**
   ```bash
   # Stop server (Ctrl+C)
   # Start again
   npm run server
   ```

---

## ❌ "Cannot GET /api/..."

**Error:**
```
Cannot GET /api/expenses
```

**Solution:**

1. **Verify backend is running:**
   ```bash
   # Should show: Server running on port 5000
   npm run server
   ```

2. **Check API URL in `client/.env`:**
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

   ⚠️ Must end with `/api`

3. **Test backend directly:**
   ```bash
   curl http://localhost:5000/api/health
   # Should return: {"status":"ok","message":"Server is running"}
   ```

---

## ❌ React App Shows Blank Page

**Solutions:**

1. **Check browser console for errors**

2. **Verify client is running:**
   ```bash
   npm run client
   ```

3. **Clear browser cache:**
   - Chrome: Ctrl+Shift+Delete
   - Or use Incognito mode

4. **Check for build errors in terminal**

---

## ❌ "Invalid token" or 401 Errors

**Solutions:**

1. **Clear cookies:**
   - Open DevTools → Application → Cookies
   - Delete all cookies for localhost

2. **Sign out and sign in again**

3. **Check JWT_SECRET is same in .env:**
   - Must be at least 32 characters
   - Must be consistent between restarts

---

## ❌ Slow Initial Load on Render/Railway

**This is normal!**

Free tier backends sleep after 15 minutes of inactivity.

**First request after sleep:**
- Takes 30-60 seconds to wake up
- Subsequent requests are fast

**Solution:**
- Upgrade to paid tier for always-on
- Or implement keep-alive pings

---

## ❌ Vercel Build Fails

**Common causes:**

1. **Check build command:**
   ```
   npm run build
   ```

2. **Check root directory:**
   ```
   client
   ```

3. **Check output directory:**
   ```
   dist
   ```

4. **Check environment variables are set in Vercel dashboard**

---

## 🔍 Debugging Tips

### Backend Debugging

1. **Add console logs:**
   ```javascript
   console.log('Environment:', process.env.NODE_ENV)
   console.log('MongoDB URI exists?', !!process.env.MONGODB_URI)
   console.log('Google Client ID exists?', !!process.env.GOOGLE_CLIENT_ID)
   ```

2. **Check server logs:**
   - Look for startup messages
   - Check for error stack traces

3. **Test endpoints manually:**
   ```bash
   curl http://localhost:5000/api/health
   curl http://localhost:5000/api/auth/me
   ```

### Frontend Debugging

1. **Check Redux DevTools:**
   - Install extension
   - View state changes
   - Check API calls

2. **Check Network tab:**
   - Look for failed requests
   - Check request/response

3. **Check Console for errors**

---

## 🆘 Still Stuck?

### Checklist

- [ ] Node.js 18+ installed: `node -v`
- [ ] Dependencies installed: `npm run install-all`
- [ ] `server/.env` exists and is filled out
- [ ] `client/.env` exists and is filled out
- [ ] MongoDB Atlas cluster is running
- [ ] Google OAuth credentials are correct
- [ ] Backend running: `npm run server`
- [ ] Frontend running: `npm run client`
- [ ] Browser at: `http://localhost:5173`

### Reset Everything

If all else fails:

```bash
# Stop all servers (Ctrl+C)

# Clean install
rm -rf node_modules client/node_modules server/node_modules
rm -rf client/dist

# Reinstall
npm run install-all

# Start fresh
npm run dev
```

---

## 📚 Additional Resources

- [Node.js Docs](https://nodejs.org/docs/)
- [MongoDB Atlas Docs](https://docs.mongodb.com/atlas/)
- [Google OAuth Setup](https://developers.google.com/identity/protocols/oauth2)
- [Vite Troubleshooting](https://vitejs.dev/guide/troubleshooting.html)
- [Express.js Guide](https://expressjs.com/en/guide/error-handling.html)

---

**Found a solution not listed here?** Consider adding it to help others!

