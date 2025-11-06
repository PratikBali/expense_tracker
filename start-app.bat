@echo off
cls
echo.
echo ========================================
echo   💰 Expense Tracker - Starting...
echo ========================================
echo.

echo 🔥 Testing Firebase connection...
cd server
call npm run test-firebase
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ Firebase connection failed!
    echo Please check your setup.
    echo See ai/FIREBASE_CREDENTIALS_GUIDE.md for help
    pause
    exit /b 1
)
cd ..

echo.
echo ========================================
echo   🚀 Starting Application...
echo ========================================
echo.
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:5000
echo.
echo 👉 Open your browser to: http://localhost:5173
echo Press Ctrl+C to stop the servers
echo.

call npm run dev

