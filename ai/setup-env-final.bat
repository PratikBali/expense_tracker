@echo off
echo Creating complete .env file with all credentials...
echo ========================================
echo.

(
echo PORT=5000
echo MONGODB_URI=mongodb+srv://expenseUser:qigHwfWxoaOEsvPx@expensetracker01.3vhosdw.mongodb.net/expense-tracker?retryWrites=true^&w=majority
echo JWT_SECRET=my_super_secret_jwt_key_that_is_at_least_32_characters_long_for_security
echo GOOGLE_CLIENT_ID=1096292194139-a46jrei30m4cmsopssg1mdfdo14f8h94.apps.googleusercontent.com
echo GOOGLE_CLIENT_SECRET=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
echo CLIENT_URL=http://localhost:5173
echo NODE_ENV=development
) > .env

echo ✅ .env file created successfully with ALL credentials!
echo.
echo 📝 Configuration:
echo    ✅ Google OAuth Client ID: configured
echo    ✅ Google OAuth Client Secret: configured
echo    ✅ MongoDB Connection: configured
echo    ✅ JWT Secret: configured
echo.
echo 🚀 Your backend is ready to run!
echo.
echo Next step: npm run server
echo.
pause

