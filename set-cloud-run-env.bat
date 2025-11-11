@echo off
echo ========================================
echo Set Cloud Run Environment Variables
echo ========================================
echo.
echo This script will help you set environment variables for Cloud Run
echo.
echo REQUIRED ENVIRONMENT VARIABLES:
echo 1. JWT_SECRET (random 32+ character string)
echo 2. GOOGLE_CLIENT_ID (from Google Cloud Console)
echo 3. GOOGLE_CLIENT_SECRET (from Google Cloud Console)
echo 4. FIREBASE_SERVICE_ACCOUNT_BASE64 (base64 encoded service account)
echo.
pause
echo.

REM Set variables
echo Enter your environment variables:
echo.

set /p JWT_SECRET="JWT_SECRET (32+ chars): "
set /p GOOGLE_CLIENT_ID="GOOGLE_CLIENT_ID: "
set /p GOOGLE_CLIENT_SECRET="GOOGLE_CLIENT_SECRET: "
set /p FIREBASE_BASE64="FIREBASE_SERVICE_ACCOUNT_BASE64 (or press Enter to generate): "

REM If Firebase base64 is empty, offer to generate it
if "%FIREBASE_BASE64%"=="" (
    echo.
    echo Generating base64 from firebase-key.json...
    cd server
    for /f "delims=" %%i in ('node get-firebase-base64.js') do set FIREBASE_BASE64=%%i
    cd ..
    if not "%FIREBASE_BASE64%"=="" (
        echo Base64 encoded successfully!
    ) else (
        echo ERROR: Could not encode Firebase credentials
        pause
        exit /b 1
    )
    echo.
)

echo.
echo Updating Cloud Run service with environment variables...
echo.

gcloud run services update expense-tracker-api ^
  --region us-central1 ^
  --update-env-vars "NODE_ENV=production,PORT=8080,FIREBASE_PROJECT_ID=flash-chat-c195c,JWT_SECRET=%JWT_SECRET%,GOOGLE_CLIENT_ID=%GOOGLE_CLIENT_ID%,GOOGLE_CLIENT_SECRET=%GOOGLE_CLIENT_SECRET%,CLIENT_URL=https://flash-chat-c195c.web.app,FIREBASE_SERVICE_ACCOUNT_BASE64=%FIREBASE_BASE64%"

echo.
echo ========================================
echo Environment Variables Set!
echo ========================================
echo.
echo Your backend should now work properly.
echo Test it at: https://expense-tracker-api-[xxx].run.app/api/health
echo.
pause

