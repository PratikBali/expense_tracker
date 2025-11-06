# MongoDB Atlas Connection Fix

## Current Issue
Your MongoDB Atlas cluster cannot be reached from your network.

## Solutions (Try in Order)

### Solution 1: Use a Fresh MongoDB Atlas Cluster

1. Go to https://cloud.mongodb.com/
2. **Delete the old cluster** (expensetrackercluster)
3. **Create a NEW cluster**:
   - Choose **M0 FREE** tier
   - Select a region **closest to you** (important!)
   - Name it: `expense-tracker-new`
   - Click **Create**
   - Wait 3-5 minutes for it to provision

4. **Create Database User**:
   - Go to **Database Access** (left menu)
   - Click **Add New Database User**
   - Username: `expenseuser`
   - Password: `Expense123` (or your choice)
   - Role: **Atlas admin** or **Read and write to any database**
   - Click **Add User**

5. **Setup Network Access**:
   - Go to **Network Access** (left menu)
   - Click **Add IP Address**
   - Choose **Allow Access from Anywhere** (0.0.0.0/0)
   - Click **Confirm**

6. **Get Connection String**:
   - Go back to **Database** (left menu)
   - Click **Connect** on your cluster
   - Choose **Drivers**
   - Select **Node.js** version **5.5 or later**
   - Copy the connection string
   - It looks like: `mongodb+srv://expenseuser:<password>@expense-tracker-new.xxxxx.mongodb.net/?retryWrites=true&w=majority`

7. **Update .env file**:
   - Replace `<password>` with `Expense123`
   - Add `/expense-tracker` before the `?`

   Final format:
   ```
   MONGODB_URI=mongodb+srv://expenseuser:Expense123@expense-tracker-new.xxxxx.mongodb.net/expense-tracker?retryWrites=true&w=majority
   ```

8. **Test connection**:
   ```bash
   cd server
   node --env-file=.env -e "import('mongoose').then(m => m.connect(process.env.MONGODB_URI, {serverSelectionTimeoutMS:10000}).then(() => {console.log('✅ Connected!');process.exit(0);}).catch(err => {console.error('❌ Failed:', err.message);process.exit(1);}));"
   ```

9. If successful, restart server: `npm run server`

---

### Solution 2: Use MongoDB Community (Local)

If Atlas keeps failing (firewall/network issue), use local MongoDB:

1. **Download MongoDB Community**:
   - Go to https://www.mongodb.com/try/download/community
   - Download and install

2. **Start MongoDB**:
   ```bash
   # Windows - Run as administrator
   net start MongoDB
   ```

3. **Update .env**:
   ```
   MONGODB_URI=mongodb://localhost:27017/expense-tracker
   ```

4. **Restart server**: `npm run server`

---

### Solution 3: Use Railway (Free Hosted MongoDB)

If both above fail:

1. Go to https://railway.app/
2. Sign in with GitHub
3. Click **New Project** → **Provision MongoDB**
4. Click on MongoDB service → **Variables** tab
5. Copy the `MONGO_URL` value
6. Update `server/.env`:
   ```
   MONGODB_URI=<paste MONGO_URL here>/expense-tracker
   ```
7. Restart server: `npm run server`

---

## How to Know It's Working

When MongoDB connects successfully, you'll see:
```
✅ MongoDB Connected: <hostname>
🚀 Server running on port 5000
```

Then try Google login again - it should work!

