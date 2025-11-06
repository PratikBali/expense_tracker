@echo off
echo Creating .env file with your Google credentials...
echo ========================================
echo.

(
echo PORT=5000
echo MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/expense-tracker?retryWrites=true^&w=majority
echo JWT_SECRET=my_super_secret_jwt_key_that_is_at_least_32_characters_long_for_security
echo GOOGLE_CLIENT_ID=1096292194139-a46jrei30m4cmsopssg1mdfdo14f8h94.apps.googleusercontent.com
echo GOOGLE_CLIENT_SECRET=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
echo CLIENT_URL=http://localhost:5173
echo NODE_ENV=development
) > .env

echo ✅ .env file created successfully!
echo.
echo 📝 Google OAuth credentials added:
echo    Client ID: 1096292194139-a46jrei30m4cmsopssg1mdfdo14f8h94.apps.googleusercontent.com
echo    Client Secret: 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
echo.
echo ⚠️  NOTE: You still need to update MONGODB_URI with your actual MongoDB connection string
echo.
echo 🚀 Next step: Run 'npm run server' to start the backend
echo.
pause

