# Using Environment Variables for Firebase (Windows Compatible)

## The Problem
The Firebase service account JSON with private keys is difficult to properly escape in Windows `.env` files.

## Recommended Solution: Base64 Encoding

Instead of trying to escape the JSON, we'll **encode it in Base64** which is much more reliable.

### Step 1: Encode Your Credentials

Run this command in PowerShell from the `server` directory:

```powershell
[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((Get-Content firebase-key.json -Raw)))
```

This will output a long Base64 string. Copy it.

### Step 2: Update Your .env File

Open `server/.env` and add/update these lines:

```env
# Comment out file-based auth
# GOOGLE_APPLICATION_CREDENTIALS=./firebase-key.json

# Add Base64 encoded credentials
FIREBASE_SERVICE_ACCOUNT_BASE64=<paste-your-base64-string-here>
FIREBASE_PROJECT_ID=flash-chat-c195c
```

### Step 3: Update Firebase Config

The `server/config/firebase.js` file needs to decode the Base64.

I'll update this file for you automatically.

### Step 4: Test

```bash
npm run test-firebase
```

---

## Alternative: Keep Using File-Based Auth

If Base64 is too complex, just use the file-based method (which works perfectly):

```env
GOOGLE_APPLICATION_CREDENTIALS=./firebase-key.json
FIREBASE_PROJECT_ID=flash-chat-c195c
# FIREBASE_SERVICE_ACCOUNT=... (comment this out)
```

This is **equally secure** for local development and works reliably on all platforms.

For deployment to Render/Railway/Vercel, you can:
1. Upload the `firebase-key.json` file to your server
2. Or use Base64 encoding for the environment variable

---

**Recommendation**: For Windows development, use file-based auth. For deployment, use Base64 encoding.

