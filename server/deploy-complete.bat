@echo off
REM Complete Deployment - All-in-One Script
REM This script will deploy your entire expense tracker app

echo ================================================
echo   EXPENSE TRACKER - COMPLETE DEPLOYMENT
echo ================================================
echo.
echo This script will:
echo   1. Deploy backend to Google Cloud Run
echo   2. Update frontend configuration
echo   3. Deploy frontend to Firebase Hosting
echo.
echo PREREQUISITES:
echo   - Google Cloud SDK installed
echo   - Logged in (gcloud auth login)
echo   - Firebase CLI installed
echo.
set /p continue="Ready to proceed? (y/n): "
if /i not "%continue%"=="y" (
    echo Deployment cancelled.
    exit /b 0
)

echo.
echo ================================================
echo   STEP 1: Deploy Backend to Cloud Run
echo ================================================
echo.

set PROJECT_ID=flash-chat-c195c
set SERVICE_NAME=expense-tracker-api
set REGION=us-central1
set FIREBASE_URL=https://flash-chat-c195c.web.app

echo Setting project...
gcloud config set project %PROJECT_ID%

echo.
echo Enabling required APIs...
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com

echo.
echo Building and deploying backend...
echo This will take 3-5 minutes...
gcloud builds submit --config=cloudbuild.yaml

if errorlevel 1 (
    echo.
    echo ================================================
    echo ERROR: Backend deployment failed!
    echo ================================================
    echo.
    echo Please check:
    echo   1. You are in the server directory
    echo   2. Docker and cloudbuild.yaml are configured correctly
    echo   3. You have necessary permissions
    echo.
    echo View logs: gcloud builds log --limit=1
    pause
    exit /b 1
)

echo.
echo Setting environment variables...
gcloud run services update %SERVICE_NAME% ^
    --region=%REGION% ^
    --update-env-vars=PORT=8080,NODE_ENV=production,CLIENT_URL=%FIREBASE_URL%,FIREBASE_PROJECT_ID=%PROJECT_ID%

echo.
echo Getting backend URL...
for /f "delims=" %%i in ('gcloud run services describe %SERVICE_NAME% --region=%REGION% --format="value(status.url)"') do set BACKEND_URL=%%i

if "%BACKEND_URL%"=="" (
    echo ERROR: Could not get backend URL
    echo Please check Cloud Run deployment manually
    pause
    exit /b 1
)

echo.
echo ✅ Backend deployed successfully!
echo Backend URL: %BACKEND_URL%

echo.
echo ================================================
echo   STEP 2: Update Frontend Configuration
echo ================================================
echo.

echo Backing up current .env...
cd ..\client
if exist .env copy /y .env .env.backup >nul

echo Creating production .env...
(
echo VITE_API_URL=%BACKEND_URL%/api
echo VITE_GOOGLE_CLIENT_ID=1096292194139-hsi0jhmv9s1e99h5op7kkq85gnih7176.apps.googleusercontent.com
) > .env

echo Building frontend...
call npm run build

if errorlevel 1 (
    echo.
    echo ERROR: Frontend build failed!
    echo Restoring backup...
    copy /y .env.backup .env >nul
    pause
    exit /b 1
)

echo.
echo ================================================
echo   STEP 3: Deploy Frontend to Firebase
echo ================================================
echo.

cd ..
echo Deploying to Firebase Hosting...
call firebase deploy --only hosting

if errorlevel 1 (
    echo.
    echo ERROR: Firebase deployment failed!
    pause
    exit /b 1
)

echo.
echo ================================================
echo   🎉 DEPLOYMENT COMPLETE! 🎉
echo ================================================
echo.
echo Your app is now live at:
echo   Frontend: %FIREBASE_URL%
echo   Backend:  %BACKEND_URL%
echo.
echo ================================================
echo   VERIFICATION STEPS
echo ================================================
echo.
echo 1. Test backend health:
echo    curl %BACKEND_URL%/api/health
echo.
echo 2. Open your app:
echo    start %FIREBASE_URL%
echo.
echo 3. Try to log in and add an expense
echo.
echo 4. View backend logs:
echo    gcloud run services logs read %SERVICE_NAME% --region=%REGION%
echo.
echo ================================================
echo   IMPORTANT
echo ================================================
echo.
echo To restore local development settings:
echo    cd client
echo    copy .env.backup .env
echo.
echo ================================================
echo.

set /p open="Would you like to open your app in the browser? (y/n): "
if /i "%open%"=="y" (
    start %FIREBASE_URL%
)

set /p test="Would you like to test the backend health endpoint? (y/n): "
if /i "%test%"=="y" (
    echo.
    echo Testing backend health...
    curl %BACKEND_URL%/api/health
    echo.
)

echo.
echo Deployment script completed!
echo For troubleshooting, see: DEPLOYMENT_CHECKLIST.md
echo.
pause
