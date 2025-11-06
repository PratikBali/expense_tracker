# 🧪 Testing Guide - Firebase Migration

This guide will help you test that the Firebase Firestore migration was successful.

## ✅ Pre-Flight Checklist

Before testing, ensure:

1. ✅ Firebase project created ([FIREBASE_SETUP.md](./FIREBASE_SETUP.md))
2. ✅ `FIREBASE_PROJECT_ID` set in `server/.env`
3. ✅ Server running (`npm run server` or `npm run dev`)
4. ✅ Client running (`npm run client`)

## 🚀 Test Sequence

### Test 1: Firebase Connection ✅

**Command:**
```bash
cd server
npm run test-firebase
```

**Expected Output:**
```
🔥 Testing Firebase Firestore Connection...
✅ Firebase initialized
📝 Testing write operation...
✅ Write successful
📖 Testing read operation...
✅ Read successful
📄 Data: { message: 'Firebase connection test', ... }
🗑️  Testing delete operation...
✅ Delete successful
✅ Verification successful - document deleted
✨ All Firebase tests passed!
🎉 Firestore is ready to use!
```

**Status:** ⬜ Not Started | ✅ Passed | ❌ Failed

---

### Test 2: Server Health Check ✅

**Access:** Open browser to `http://localhost:5000/api/health`

**Expected Response:**
```json
{
  "status": "ok",
  "message": "Server is running"
}
```

**Status:** ⬜ Not Started | ✅ Passed | ❌ Failed

---

### Test 3: Google Authentication 🔐

**Steps:**
1. Open `http://localhost:5173` in browser
2. Click **"Sign in with Google"**
3. Select your Google account
4. Grant permissions

**Expected Result:**
- ✅ Redirected to `/dashboard?auth=success`
- ✅ See welcome message with your name
- ✅ See dashboard with ₹0.00 total

**Check Firestore:**
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Navigate to Firestore Database
3. You should see a `users` collection
4. Inside, one document with your Google account info

**Status:** ⬜ Not Started | ✅ Passed | ❌ Failed

---

### Test 4: Create Expense 💰

**Steps:**
1. Click **"Add Expense"** button
2. Fill in the form:
   - Amount: `500`
   - Category: `Food`
   - Description: `Lunch at restaurant`
   - Date: (today)
3. Click **"Save"**

**Expected Result:**
- ✅ Success toast notification
- ✅ Expense appears in the list
- ✅ Shows ₹500.00
- ✅ Dashboard total updated to ₹500.00

**Check Firestore:**
1. Go to Firebase Console → Firestore Database
2. You should see an `expenses` collection
3. Inside, one document with your expense data

**Status:** ⬜ Not Started | ✅ Passed | ❌ Failed

---

### Test 5: View All Expenses 📋

**Steps:**
1. Click **"Expenses"** in navigation
2. You should see your expense listed

**Expected Result:**
- ✅ Expense card with all details
- ✅ Category icon displayed
- ✅ Amount in ₹ (Indian Rupees)
- ✅ Edit and Delete buttons visible

**Status:** ⬜ Not Started | ✅ Passed | ❌ Failed

---

### Test 6: Edit Expense ✏️

**Steps:**
1. Click **Edit** button on the expense
2. Change amount to `750`
3. Change description to `Dinner at restaurant`
4. Click **"Save"**

**Expected Result:**
- ✅ Success toast notification
- ✅ Expense updated in the list
- ✅ Shows ₹750.00
- ✅ Dashboard total updated to ₹750.00

**Check Firestore:**
1. Refresh Firebase Console
2. The expense document should show updated values
3. `updatedAt` timestamp should be recent

**Status:** ⬜ Not Started | ✅ Passed | ❌ Failed

---

### Test 7: Statistics Page 📊

**Steps:**
1. Click **"Statistics"** in navigation
2. View the statistics page

**Expected Result:**
- ✅ Total expenses: ₹750.00
- ✅ Average expense calculated
- ✅ Pie chart showing category breakdown
- ✅ Bar chart showing expenses by category
- ✅ Monthly trend chart (may be empty if first use)
- ✅ All amounts in ₹ (Rupees)

**Status:** ⬜ Not Started | ✅ Passed | ❌ Failed

---

### Test 8: Category Filter 🔍

**Steps:**
1. Go to **Expenses** page
2. Create expenses in different categories:
   - ₹200 - Transportation - Uber ride
   - ₹150 - Entertainment - Movie tickets
   - ₹300 - Shopping - Clothes
3. Click category filter dropdown
4. Select **"Food"**

**Expected Result:**
- ✅ Only food expenses shown (₹750.00)
- ✅ Other expenses hidden
- ✅ Select **"All Categories"** shows all expenses

**Status:** ⬜ Not Started | ✅ Passed | ❌ Failed

---

### Test 9: Delete Expense 🗑️

**Steps:**
1. Go to **Expenses** page
2. Click **Delete** button on any expense
3. Confirm deletion (if confirmation dialog appears)

**Expected Result:**
- ✅ Success toast notification
- ✅ Expense removed from list
- ✅ Dashboard total updated
- ✅ Statistics updated

**Check Firestore:**
1. Refresh Firebase Console
2. The expense document should be deleted

**Status:** ⬜ Not Started | ✅ Passed | ❌ Failed

---

### Test 10: Multi-Language Support 🌍

**Steps:**
1. Click the language button (shows **"EN"** or **"ES"**)
2. Switch language

**Expected Result:**
- ✅ All UI text translates
- ✅ Toast notification in new language
- ✅ Category names translated
- ✅ Currency symbol remains ₹

**Status:** ⬜ Not Started | ✅ Passed | ❌ Failed

---

### Test 11: Logout 🚪

**Steps:**
1. Click **"Logout"** button
2. Confirm logout

**Expected Result:**
- ✅ Redirected to login page
- ✅ Success toast notification
- ✅ Cannot access dashboard without logging in

**Status:** ⬜ Not Started | ✅ Passed | ❌ Failed

---

### Test 12: Re-login Persistence 🔄

**Steps:**
1. Sign in again with Google
2. Go to dashboard

**Expected Result:**
- ✅ All previous expenses still there
- ✅ Statistics reflect all data
- ✅ User profile shows correct info

**Check:** This tests that Firestore is persisting data correctly!

**Status:** ⬜ Not Started | ✅ Passed | ❌ Failed

---

## 🎯 Success Criteria

For the migration to be considered successful, you should have:

- ✅ All 12 tests passing
- ✅ No MongoDB connection errors in server logs
- ✅ Firebase Console showing `users` and `expenses` collections
- ✅ All CRUD operations working (Create, Read, Update, Delete)
- ✅ Authentication working smoothly
- ✅ Statistics calculating correctly
- ✅ No errors in browser console
- ✅ No errors in server terminal

## 📊 Firestore Data Verification

After testing, your Firestore should have:

### `users` Collection
```
users/
  └── {userId}/
      ├── googleId: "..."
      ├── email: "your@email.com"
      ├── name: "Your Name"
      ├── avatar: "https://..."
      ├── currency: "INR"
      ├── language: "en"
      ├── createdAt: Timestamp
      └── updatedAt: Timestamp
```

### `expenses` Collection
```
expenses/
  └── {expenseId}/
      ├── amount: 750
      ├── category: "food"
      ├── description: "Dinner at restaurant"
      ├── date: "2024-01-15T..."
      ├── user: "{userId}"
      ├── tags: []
      ├── createdAt: Timestamp
      └── updatedAt: Timestamp
```

## 🐛 Common Issues & Solutions

### Issue: "Firebase initialization failed"
**Solution:** Check that `FIREBASE_PROJECT_ID` is set correctly in `server/.env`

### Issue: "Permission denied" errors
**Solution:**
1. Ensure Firestore is in **test mode**
2. Or add proper security rules (see [FIREBASE_SETUP.md](./FIREBASE_SETUP.md))

### Issue: Expenses not appearing
**Solution:**
1. Check browser console for errors
2. Verify server is running (check `http://localhost:5000/api/health`)
3. Check Network tab for failed API calls

### Issue: User not created after Google login
**Solution:**
1. Check server logs for errors
2. Verify Firebase project ID is correct
3. Ensure Firestore is enabled in Firebase Console

## 📝 Test Results Summary

| Test | Status | Notes |
|------|--------|-------|
| 1. Firebase Connection | ⬜ | |
| 2. Server Health | ⬜ | |
| 3. Google Auth | ⬜ | |
| 4. Create Expense | ⬜ | |
| 5. View Expenses | ⬜ | |
| 6. Edit Expense | ⬜ | |
| 7. Statistics | ⬜ | |
| 8. Category Filter | ⬜ | |
| 9. Delete Expense | ⬜ | |
| 10. Multi-Language | ⬜ | |
| 11. Logout | ⬜ | |
| 12. Re-login | ⬜ | |

## 🎉 Congratulations!

If all tests pass, your Firebase migration is complete! You now have:

- ✅ A reliable, scalable database (Firebase Firestore)
- ✅ No more connection issues
- ✅ Real-time capabilities (ready for future features)
- ✅ Generous free tier
- ✅ Easy deployment
- ✅ Indian Rupee (₹) support

## 📚 Next Steps

1. ✅ Run all tests
2. ✅ Verify data in Firebase Console
3. 🚀 Deploy to production (see deployment guide)
4. 🎨 Add more features
5. 📱 Consider adding real-time sync

---

**Need Help?** Check [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) or [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

