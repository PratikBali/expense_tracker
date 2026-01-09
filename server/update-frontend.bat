@echo off
REM Update Frontend Configuration and Redeploy
REM Run this AFTER backend is deployed to Cloud Run

echo ================================================
echo   Update Frontend for Production Deployment
echo ================================================
echo.

if "%1"=="" (
    echo ERROR: Please provide your Cloud Run backend URL
    echo.
    echo Usage: update-frontend.bat CLOUD_RUN_URL
    echo Example: update-frontend.bat https://expense-tracker-api-abc123.run.app
    echo.
    echo To get your Cloud Run URL, run:
    echo   gcloud run services describe expense-tracker-api --region=us-central1 --format="value(status.url)"
    exit /b 1
)

set BACKEND_URL=%1

echo Step 1: Backing up current .env file...
cd ..\client
if exist .env copy .env .env.backup
echo   Backup created: .env.backup

echo.
echo Step 2: Creating production .env file...
(
echo VITE_API_URL=%BACKEND_URL%/api
echo VITE_GOOGLE_CLIENT_ID=1096292194139-hsi0jhmv9s1e99h5op7kkq85gnih7176.apps.googleusercontent.com
) > .env

echo   Created new .env with production settings

echo.
echo Step 3: Building frontend...
call npm run build

if errorlevel 1 (
    echo.
    echo ================================================
    echo ERROR: Build failed!
    echo ================================================
    echo Restoring backup...
    copy .env.backup .env
    exit /b 1
)

echo.
echo Step 4: Deploying to Firebase Hosting...
cd ..
call firebase deploy --only hosting

if errorlevel 1 (
    echo.
    echo ================================================
    echo ERROR: Firebase deployment failed!
    echo ================================================
    exit /b 1
)

echo.
echo ================================================
echo   SUCCESS! Your app is now live!
echo ================================================
echo.
echo Frontend: https://flash-chat-c195c.web.app
echo Backend: %BACKEND_URL%
echo.
echo Test your app by opening: https://flash-chat-c195c.web.app
echo.
echo To restore local development settings, run:
echo   cd client
echo   copy .env.backup .env
echo.
echo ================================================

pause
