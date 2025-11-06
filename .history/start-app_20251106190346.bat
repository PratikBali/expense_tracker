@echo off
cls
echo.
echo ========================================
echo   💰 Expense Tracker - Starting...
echo ========================================
echo.

echo Checking MongoDB connection...
cd server
node ultimate-fix.js
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ❌ MongoDB setup failed!
    echo Please check the error messages above.
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
echo Press Ctrl+C to stop the servers
echo.

npm run dev

