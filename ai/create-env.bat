@echo off
echo Creating .env file for Expense Tracker
echo ========================================
echo.
echo Please edit this file after creation with your actual values!
echo.

(
echo PORT=5000
echo MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/expense-tracker?retryWrites=true^&w=majority
echo JWT_SECRET=change_this_to_random_string_minimum_32_characters_long
echo GOOGLE_CLIENT_ID=your_google_client_id_here.apps.googleusercontent.com
echo GOOGLE_CLIENT_SECRET=GOCSPX-your_google_client_secret_here
echo CLIENT_URL=http://localhost:5173
echo NODE_ENV=development
) > .env

echo ✅ .env file created successfully!
echo.
echo 📝 Next steps:
echo 1. Open server\.env in your text editor
echo 2. Replace the placeholder values with your actual credentials
echo 3. Save the file
echo 4. Restart the server: npm run server
echo.
pause

