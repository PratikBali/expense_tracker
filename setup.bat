@echo off
REM Expense Tracker Setup Script for Windows
REM This script helps set up the development environment

echo 🚀 Expense Tracker Setup
echo ========================
echo.

REM Check Node.js
echo ✓ Checking Node.js...
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    exit /b 1
)

echo ✅ Node.js found
node -v
echo.

REM Install dependencies
echo 📦 Installing dependencies...
call npm install
echo.

echo 📦 Installing client dependencies...
cd client
call npm install
cd ..
echo.

echo 📦 Installing server dependencies...
cd server
call npm install
cd ..
echo.

REM Create .env files if they don't exist
if not exist "server\.env" (
    echo 📝 Creating server\.env from example...
    copy server\.env.example server\.env
    echo ⚠️  Please edit server\.env with your actual credentials
) else (
    echo ✓ server\.env already exists
)
echo.

if not exist "client\.env" (
    echo 📝 Creating client\.env from example...
    copy client\.env.example client\.env
    echo ⚠️  Please edit client\.env with your actual credentials
) else (
    echo ✓ client\.env already exists
)
echo.

echo ✅ Setup complete!
echo.
echo 📚 Next steps:
echo 1. Edit server\.env with your MongoDB URI and Google OAuth credentials
echo 2. Edit client\.env with your API URL and Google Client ID
echo 3. Run 'npm run dev' to start both frontend and backend
echo.
echo 📖 For detailed instructions, see:
echo    - QUICKSTART.md (5-minute guide)
echo    - SETUP.md (detailed setup)
echo.
echo Happy coding! 🎉
pause

