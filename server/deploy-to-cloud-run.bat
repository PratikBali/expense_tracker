@echo off
REM Google Cloud Run Deployment Script for Expense Tracker Backend

echo ================================================
echo   Google Cloud Run Deployment
echo ================================================
echo.

REM Configuration
set PROJECT_ID=flash-chat-c195c
set SERVICE_NAME=expense-tracker-api
set REGION=us-central1

REM Check if CLIENT_URL is provided
if "%1"=="" (
    echo ERROR: Please provide your Firebase hosting URL
    echo Usage: deploy-to-cloud-run.bat YOUR_FIREBASE_URL
    echo Example: deploy-to-cloud-run.bat https://my-app.web.app
    exit /b 1
)

set CLIENT_URL=%1

echo Setting project: %PROJECT_ID%
gcloud config set project %PROJECT_ID%

echo.
echo Enabling required APIs...
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com

echo.
echo Building container image...
gcloud builds submit --config=cloudbuild.yaml

if errorlevel 1 (
    echo.
    echo ================================================
    echo ERROR: Build failed!
    echo ================================================
    exit /b 1
)

echo.
echo ================================================
echo Build successful!
echo ================================================
echo.

echo Setting environment variables...
gcloud run services update %SERVICE_NAME% ^
    --region=%REGION% ^
    --update-env-vars=PORT=8080,NODE_ENV=production,CLIENT_URL=%CLIENT_URL%,FIREBASE_PROJECT_ID=%PROJECT_ID%

echo.
echo Getting service URL...
for /f "delims=" %%i in ('gcloud run services describe %SERVICE_NAME% --region=%REGION% --format="value(status.url)"') do set SERVICE_URL=%%i

echo.
echo ================================================
echo   DEPLOYMENT SUCCESSFUL!
echo ================================================
echo.
echo Service URL: %SERVICE_URL%
echo.
echo Test your API:
echo   curl %SERVICE_URL%/api/health
echo.
echo View logs:
echo   gcloud run services logs read %SERVICE_NAME% --region=%REGION%
echo.
echo IMPORTANT: Update your frontend .env file with:
echo   VITE_API_URL=%SERVICE_URL%
echo.
echo ================================================

pause
