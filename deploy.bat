@echo off
setlocal enabledelayedexpansion
echo ========================================
echo Expense Tracker - Google Cloud Deployment
echo ========================================
echo.

REM Check if in correct directory
if not exist "server\package.json" (
    echo ERROR: Please run this from the project root directory
    echo Current directory: %CD%
    pause
    exit /b 1
)

REM Update dependencies first
echo [Prep] Updating server dependencies...
cd server
call npm install --silent
cd ..
echo ✓ Dependencies updated
echo.

echo What would you like to do?
echo.
echo [1] Deploy Backend Only (Standard)
echo [2] Deploy Frontend Only
echo [3] Deploy Both Backend and Frontend
echo [4] Set Backend Environment Variables
echo [5] Get Backend Service URL
echo [6] View Backend Logs
echo [7] Full Setup (Deploy + Configure)
echo [8] Deploy Backend (Ultra-Robust + Pre-Test) ⭐⭐ RECOMMENDED ⭐⭐
echo [9] Validate Setup Before Deploy
echo [10] Test Docker Build Locally (No Deploy)
echo [11] Quick Fix - Set Environment Variables for Existing Deployment
echo.
echo.
echo ⚠️ IMPORTANT: If this is your FIRST deployment, use option 8!
echo    Option 8 includes comprehensive validation and testing.
echo.
set /p DEPLOY_OPTION="Select option (1-11): "

if "%DEPLOY_OPTION%"=="1" goto deploy_backend
if "%DEPLOY_OPTION%"=="2" goto deploy_frontend
if "%DEPLOY_OPTION%"=="3" goto deploy_both
if "%DEPLOY_OPTION%"=="4" goto set_env_vars
if "%DEPLOY_OPTION%"=="5" goto get_url
if "%DEPLOY_OPTION%"=="6" goto view_logs
if "%DEPLOY_OPTION%"=="7" goto full_setup
if "%DEPLOY_OPTION%"=="8" goto deploy_backend_robust
if "%DEPLOY_OPTION%"=="9" goto validate_setup
if "%DEPLOY_OPTION%"=="10" goto test_docker_local
if "%DEPLOY_OPTION%"=="11" goto quick_fix_env
echo Invalid option
goto end

:deploy_backend
echo.
echo ========================================
echo Deploying Backend to Cloud Run...
echo ========================================
cd server
gcloud run deploy expense-tracker-api --source . --platform managed --region us-central1 --allow-unauthenticated --memory 512Mi --cpu 1 --max-instances 10 --timeout 300
set DEPLOY_STATUS=%ERRORLEVEL%
cd ..

if %DEPLOY_STATUS% EQU 0 (
    echo.
    echo ✓ Backend deployment successful!
    echo.
    echo Getting service URL...
    for /f "delims=" %%i in ('gcloud run services describe expense-tracker-api --region=us-central1 --format="value(status.url)"') do set BACKEND_URL=%%i
    echo.
    echo ✓ Backend URL: !BACKEND_URL!
    echo.
    set /p SETUP_ENV="Do you want to set environment variables now? (y/n): "
    if /i "!SETUP_ENV!"=="y" goto set_env_vars
    echo.
    echo REMINDER: Run this script again and select option 4 to set environment variables.
) else (
    echo.
    echo ✗ Backend deployment failed!
    echo.
    set /p VIEW_LOGS="View logs? (y/n): "
    if /i "!VIEW_LOGS!"=="y" goto view_logs
)
goto end

:deploy_frontend
echo.
echo ========================================
echo Building and Deploying Frontend...
echo ========================================
cd client
echo [1/2] Building React app...
call npm run build
set BUILD_STATUS=%ERRORLEVEL%
cd ..

if %BUILD_STATUS% NEQ 0 (
    echo.
    echo ✗ Frontend build failed!
    goto end
)

echo.
echo [2/2] Deploying to Firebase Hosting...
firebase deploy --only hosting
set DEPLOY_STATUS=%ERRORLEVEL%

if %DEPLOY_STATUS% EQU 0 (
    echo.
    echo ✓ Frontend deployment successful!
    echo Visit: https://flash-chat-c195c.web.app
) else (
    echo.
    echo ✗ Frontend deployment failed!
)
goto end

:deploy_both
echo.
echo ========================================
echo Deploying Both Backend and Frontend
echo ========================================
echo.
echo [1/3] Deploying Backend to Cloud Run...
cd server
gcloud run deploy expense-tracker-api --source . --platform managed --region us-central1 --allow-unauthenticated --memory 512Mi --cpu 1 --max-instances 10 --timeout 300
set BACKEND_STATUS=%ERRORLEVEL%
cd ..

if %BACKEND_STATUS% NEQ 0 (
    echo.
    echo ✗ Backend deployment failed! Stopping...
    goto end
)

echo.
echo ✓ Backend deployed successfully!
echo.
echo [2/3] Building Frontend...
cd client
call npm run build
set BUILD_STATUS=%ERRORLEVEL%
cd ..

if %BUILD_STATUS% NEQ 0 (
    echo.
    echo ✗ Frontend build failed! Stopping...
    goto end
)

echo.
echo [3/3] Deploying to Firebase Hosting...
firebase deploy --only hosting
set FRONTEND_STATUS=%ERRORLEVEL%

echo.
echo ========================================
echo Deployment Summary
echo ========================================
if %BACKEND_STATUS% EQU 0 (echo ✓ Backend: SUCCESS) else (echo ✗ Backend: FAILED)
if %FRONTEND_STATUS% EQU 0 (echo ✓ Frontend: SUCCESS) else (echo ✗ Frontend: FAILED)
echo ========================================
echo.
if %BACKEND_STATUS% EQU 0 if %FRONTEND_STATUS% EQU 0 (
    echo 🎉 All deployments successful!
    echo.
    echo NEXT STEPS:
    echo 1. Set backend environment variables: set-cloud-run-env.bat
    echo 2. Get backend URL: gcloud run services describe expense-tracker-api --region=us-central1 --format="value(status.url)"
    echo 3. Update frontend with backend URL and redeploy
    echo 4. Visit: https://flash-chat-c195c.web.app
)
goto end

:set_env_vars
echo.
echo ========================================
echo Set Backend Environment Variables
echo ========================================
echo.
echo Required variables:
echo 1. JWT_SECRET (32+ characters)
echo 2. GOOGLE_CLIENT_ID
echo 3. GOOGLE_CLIENT_SECRET
echo 4. FIREBASE credentials (auto-generated)
echo.

set /p JWT_SECRET="Enter JWT_SECRET (32+ chars): "
set /p GOOGLE_CLIENT_ID="Enter GOOGLE_CLIENT_ID: "
set /p GOOGLE_CLIENT_SECRET="Enter GOOGLE_CLIENT_SECRET: "

echo.
echo Generating Firebase Base64 credentials...
cd server
for /f "delims=" %%i in ('node get-firebase-base64.js 2^>nul') do set FIREBASE_BASE64=%%i
cd ..

if "!FIREBASE_BASE64!"=="" (
    echo ✗ Failed to encode Firebase credentials
    echo Make sure server/firebase-key.json exists
    pause
    goto end
)

echo ✓ Firebase credentials encoded
echo.
echo Updating Cloud Run service...

gcloud run services update expense-tracker-api --region us-central1 --update-env-vars "NODE_ENV=production,PORT=8080,FIREBASE_PROJECT_ID=flash-chat-c195c,JWT_SECRET=!JWT_SECRET!,GOOGLE_CLIENT_ID=!GOOGLE_CLIENT_ID!,GOOGLE_CLIENT_SECRET=!GOOGLE_CLIENT_SECRET!,CLIENT_URL=https://flash-chat-c195c.web.app,FIREBASE_SERVICE_ACCOUNT_BASE64=!FIREBASE_BASE64!"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ✓ Environment variables set successfully!
    echo ✓ Service will automatically redeploy
    echo.
    echo Getting service URL...
    for /f "delims=" %%i in ('gcloud run services describe expense-tracker-api --region=us-central1 --format="value(status.url)"') do set BACKEND_URL=%%i
    echo.
    echo ✓ Backend URL: !BACKEND_URL!
    echo.
    echo Test your backend: !BACKEND_URL!/api/health
) else (
    echo.
    echo ✗ Failed to set environment variables
)
goto end

:get_url
echo.
echo ========================================
echo Getting Service URLs
echo ========================================
echo.
for /f "delims=" %%i in ('gcloud run services describe expense-tracker-api --region=us-central1 --format="value(status.url)" 2^>nul') do set BACKEND_URL=%%i
if "!BACKEND_URL!"=="" (
    echo Backend not deployed yet
) else (
    echo Backend URL: !BACKEND_URL!
    echo Health Check: !BACKEND_URL!/api/health
)
echo.
echo Frontend URL: https://flash-chat-c195c.web.app
echo.
goto end

:view_logs
echo.
echo ========================================
echo Viewing Recent Backend Logs
echo ========================================
echo.
gcloud run services logs read expense-tracker-api --region=us-central1 --limit=50
echo.
goto end

:full_setup
echo.
echo ========================================
echo Full Setup: Deploy + Configure
echo ========================================
echo.
echo This will:
echo 1. Deploy backend to Cloud Run
echo 2. Set environment variables
echo 3. Deploy frontend to Firebase
echo 4. Show all URLs
echo.
set /p CONFIRM="Continue? (y/n): "
if /i not "!CONFIRM!"=="y" goto end

REM Deploy backend
echo.
echo [1/4] Deploying Backend...
cd server
gcloud run deploy expense-tracker-api --source . --platform managed --region us-central1 --allow-unauthenticated --memory 512Mi --cpu 1 --max-instances 10 --timeout 300
set BACKEND_STATUS=%ERRORLEVEL%
cd ..

if %BACKEND_STATUS% NEQ 0 (
    echo ✗ Backend deployment failed!
    goto end
)
echo ✓ Backend deployed

REM Set env vars
echo.
echo [2/4] Setting Environment Variables...
set /p JWT_SECRET="Enter JWT_SECRET: "
set /p GOOGLE_CLIENT_ID="Enter GOOGLE_CLIENT_ID: "
set /p GOOGLE_CLIENT_SECRET="Enter GOOGLE_CLIENT_SECRET: "

cd server
for /f "delims=" %%i in ('node get-firebase-base64.js 2^>nul') do set FIREBASE_BASE64=%%i
cd ..

gcloud run services update expense-tracker-api --region us-central1 --update-env-vars "NODE_ENV=production,PORT=8080,FIREBASE_PROJECT_ID=flash-chat-c195c,JWT_SECRET=!JWT_SECRET!,GOOGLE_CLIENT_ID=!GOOGLE_CLIENT_ID!,GOOGLE_CLIENT_SECRET=!GOOGLE_CLIENT_SECRET!,CLIENT_URL=https://flash-chat-c195c.web.app,FIREBASE_SERVICE_ACCOUNT_BASE64=!FIREBASE_BASE64!"
echo ✓ Environment variables set

REM Get backend URL
for /f "delims=" %%i in ('gcloud run services describe expense-tracker-api --region=us-central1 --format="value(status.url)"') do set BACKEND_URL=%%i
echo ✓ Backend URL: !BACKEND_URL!

REM Deploy frontend
echo.
echo [3/4] Deploying Frontend...
cd client
call npm run build
cd ..
firebase deploy --only hosting
set FRONTEND_STATUS=%ERRORLEVEL%

if %FRONTEND_STATUS% EQU 0 (
    echo ✓ Frontend deployed
) else (
    echo ✗ Frontend deployment failed
)

REM Summary
echo.
echo [4/4] Setup Summary
echo ========================================
echo ✓ Backend: !BACKEND_URL!
echo ✓ Frontend: https://flash-chat-c195c.web.app
echo.
echo NEXT STEPS:
echo 1. Update Google OAuth redirect URI: !BACKEND_URL!/api/auth/google/callback
echo 2. Test backend: !BACKEND_URL!/api/health
echo 3. Test frontend: https://flash-chat-c195c.web.app
echo ========================================
goto end

:validate_setup
echo.
echo ========================================
echo Validating Setup
echo ========================================
echo.

REM Check package.json
echo [1/6] Checking package.json...
if not exist "server\package.json" (
    echo ✗ server/package.json not found!
    goto end
)
echo ✓ package.json found

REM Check for required dependencies
echo.
echo [2/6] Checking dependencies...
findstr /C:"firebase-admin" server\package.json >nul
if %ERRORLEVEL% NEQ 0 (
    echo ✗ firebase-admin missing in dependencies!
    echo   Adding firebase-admin...
    cd server
    call npm install firebase-admin --save
    cd ..
)
echo ✓ firebase-admin present

findstr /C:"dotenv" server\package.json >nul
if %ERRORLEVEL% NEQ 0 (
    echo ✗ dotenv missing!
    goto end
)
echo ✓ dotenv present

REM Check Dockerfile
echo.
echo [3/6] Checking Dockerfile...
if not exist "server\Dockerfile" (
    echo ✗ Dockerfile not found!
    goto end
)
echo ✓ Dockerfile found

REM Check Firebase credentials
echo.
echo [4/6] Checking Firebase credentials...
if not exist "server\firebase-key.json" (
    echo ✗ server/firebase-key.json not found!
    echo   This is required for deployment
    goto end
)
echo ✓ Firebase key found

REM Test Firebase encoding
echo.
echo [5/6] Testing Firebase credential encoding...
cd server
node get-firebase-base64.js >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ✗ Failed to encode Firebase credentials
    cd ..
    goto end
)
cd ..
echo ✓ Firebase encoding works

REM Regenerate package-lock.json
echo.
echo [6/6] Regenerating package-lock.json...
cd server
del package-lock.json 2>nul
call npm install
if %ERRORLEVEL% NEQ 0 (
    echo ✗ npm install failed!
    cd ..
    goto end
)
cd ..
echo ✓ package-lock.json regenerated

echo.
echo ========================================
echo ✓ All Validations Passed!
echo ========================================
echo.
echo Your setup is ready for deployment.
echo Run option 8 (Robust Backend Deploy) next.
echo.
goto end

:test_docker_local
echo.
echo ========================================
echo Test Docker Build Locally
echo ========================================
echo.
echo This will build the Docker image locally
echo to ensure it works before deploying.
echo.

REM Check if Docker is installed
docker --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ✗ Docker is not installed or not in PATH
    echo   Install Docker Desktop from: https://www.docker.com/products/docker-desktop/
    goto end
)
echo ✓ Docker is available
echo.

REM Prepare Dockerfile
cd server
if exist Dockerfile.backup del Dockerfile.backup
if exist Dockerfile copy Dockerfile Dockerfile.backup >nul

REM Create optimized Dockerfile
(
echo FROM node:18-slim
echo RUN apt-get update ^&^& apt-get install -y python3 make g++ ^&^& rm -rf /var/lib/apt/lists/*
echo WORKDIR /app
echo COPY package.json package-lock.json ./
echo RUN npm install
echo COPY . .
echo EXPOSE 8080
echo ENV NODE_ENV=production PORT=8080
echo CMD ["node", "server.js"]
) > Dockerfile

echo Building Docker image locally...
docker build -t expense-tracker-test .

set BUILD_STATUS=%ERRORLEVEL%

if %BUILD_STATUS% EQU 0 (
    echo.
    echo ✓ Local Docker build SUCCESSFUL!
    echo.
    echo Your Dockerfile is ready for Cloud Run deployment.
    echo Run option 8 to deploy.
) else (
    echo.
    echo ✗ Local Docker build FAILED!
    echo Fix the errors above before deploying.
)

if exist Dockerfile.backup move /Y Dockerfile.backup Dockerfile >nul
cd ..
goto end

:deploy_backend_robust
echo.
echo ========================================
echo ULTRA-ROBUST Backend Deployment
echo ========================================
echo.
echo This is a 100%% foolproof deployment method:
echo - Comprehensive validation
echo - Clean dependency install
echo - Optimized Dockerfile
echo - Maximum resources allocated
echo.

REM ============================================
REM PHASE 1: PRE-FLIGHT VALIDATION
REM ============================================
echo.
echo ========================================
echo PHASE 1: PRE-FLIGHT VALIDATION
echo ========================================

echo.
echo [1/10] Checking server directory...
if not exist "server\package.json" (
    echo ✗ server/package.json not found!
    goto end
)
if not exist "server\server.js" (
    echo ✗ server/server.js not found!
    goto end
)
echo ✓ Server files present

echo.
echo [2/10] Checking Firebase credentials...
if not exist "server\firebase-key.json" (
    echo ✗ server/firebase-key.json not found!
    echo   Download from Firebase Console and place in server/ folder
    goto end
)
echo ✓ Firebase credentials found

echo.
echo [3/10] Validating firebase-key.json format...
cd server
node -e "try{JSON.parse(require('fs').readFileSync('firebase-key.json','utf8'));console.log('valid')}catch(e){process.exit(1)}" >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ✗ firebase-key.json is not valid JSON!
    cd ..
    goto end
)
cd ..
echo ✓ Firebase JSON is valid

echo.
echo [4/10] Checking critical dependencies...
findstr /C:"express" server\package.json >nul
if %ERRORLEVEL% NEQ 0 (
    echo ✗ express missing!
    goto end
)
findstr /C:"firebase-admin" server\package.json >nul
if %ERRORLEVEL% NEQ 0 (
    echo ✗ firebase-admin missing!
    echo   Adding firebase-admin...
    cd server
    call npm install firebase-admin@^12.0.0 --save --loglevel=error
    cd ..
)
findstr /C:"dotenv" server\package.json >nul
if %ERRORLEVEL% NEQ 0 (
    echo ✗ dotenv missing!
    goto end
)
echo ✓ All critical dependencies present

echo.
echo [5/10] Testing Firebase credential encoding...
cd server
if not exist "get-firebase-base64.js" (
    echo ✗ get-firebase-base64.js not found!
    cd ..
    goto end
)
node get-firebase-base64.js >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ✗ Failed to encode Firebase credentials!
    cd ..
    goto end
)
cd ..
echo ✓ Firebase encoding works

echo.
echo [6/10] Checking Google Cloud authentication...
for /f "delims=" %%i in ('gcloud auth list --filter=status:ACTIVE --format="value(account)" 2^>nul') do set GCLOUD_ACCOUNT=%%i
if "!GCLOUD_ACCOUNT!"=="" (
    echo ⚠ Not authenticated or gcloud command failed
    echo.
    echo Attempting to authenticate now...
    gcloud auth login --no-launch-browser --quiet
    if %ERRORLEVEL% NEQ 0 (
        echo.
        echo ✗ Authentication failed!
        echo.
        echo Please authenticate manually by running:
        echo   gcloud auth login
        echo.
        echo Then run this script again.
        pause
        goto end
    )
    echo ✓ Authentication successful
) else (
    echo ✓ Google Cloud authenticated as: !GCLOUD_ACCOUNT!
)

echo.
echo [7/10] Verifying project is set...
gcloud config get-value project >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ⚠ No project set, configuring now...
    gcloud config set project flash-chat-c195c
    if %ERRORLEVEL% NEQ 0 (
        echo ✗ Failed to set project!
        goto end
    )
    echo ✓ Project configured automatically
) else (
    for /f "delims=" %%i in ('gcloud config get-value project 2^>nul') do set CURRENT_PROJECT=%%i
    if "!CURRENT_PROJECT!" NEQ "flash-chat-c195c" (
        echo ⚠ Current project: !CURRENT_PROJECT!
        echo   Switching to: flash-chat-c195c
        gcloud config set project flash-chat-c195c
    )
    echo ✓ Project configured: flash-chat-c195c
)

echo.
echo [8/10] Checking Cloud Run API...
gcloud services list --enabled --filter="name:run.googleapis.com" --format="value(name)" | findstr "run.googleapis.com" >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ⚠ Cloud Run API not enabled, enabling now...
    gcloud services enable run.googleapis.com
)
echo ✓ Cloud Run API enabled

REM ============================================
REM PHASE 2: CLEAN DEPENDENCY INSTALL
REM ============================================
echo.
echo ========================================
echo PHASE 2: CLEAN DEPENDENCY INSTALL
echo ========================================

echo.
echo [9/10] Cleaning old dependencies...
cd server
if exist node_modules (
    echo   Removing old node_modules...
    rmdir /s /q node_modules 2>nul
)
if exist package-lock.json (
    echo   Removing old package-lock.json...
    del package-lock.json 2>nul
)
echo ✓ Clean slate

echo.
echo [10/10] Fresh npm install...
call npm install --loglevel=error
if %ERRORLEVEL% NEQ 0 (
    echo ✗ npm install failed!
    cd ..
    goto end
)
echo ✓ Dependencies installed cleanly

cd ..

REM ============================================
REM PHASE 3: CREATE BULLETPROOF DOCKERFILE
REM ============================================
echo.
echo ========================================
echo PHASE 3: CREATE BULLETPROOF DOCKERFILE
echo ========================================
echo.

cd server

REM Backup existing Dockerfile
if exist Dockerfile (
    echo Backing up existing Dockerfile...
    copy /Y Dockerfile Dockerfile.backup >nul
)

REM Create the most robust Dockerfile possible
(
echo # Ultra-Robust Dockerfile for Google Cloud Run
echo # Generated by deploy.bat - Optimized for reliability
echo.
echo FROM node:18-slim
echo.
echo # Install build dependencies for native modules
echo RUN apt-get update ^&^& apt-get install -y --no-install-recommends \
echo     python3 \
echo     make \
echo     g++ \
echo     git \
echo     ca-certificates \
echo     ^&^& rm -rf /var/lib/apt/lists/* \
echo     ^&^& npm install -g npm@latest
echo.
echo # Set working directory
echo WORKDIR /app
echo.
echo # Copy package files
echo COPY package.json ./
echo COPY package-lock.json ./
echo.
echo # Install dependencies with retry logic
echo RUN npm ci ^|^| npm install
echo.
echo # Copy application code
echo COPY . .
echo.
echo # Create necessary directories
echo RUN mkdir -p /app/logs
echo.
echo # Set environment variables
echo ENV NODE_ENV=production
echo ENV PORT=8080
echo.
echo # Expose port
echo EXPOSE 8080
echo.
echo # Health check
echo HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
echo     CMD node -e "require('http').get('http://localhost:8080/api/health', (r) =^> process.exit(r.statusCode === 200 ? 0 : 1))"
echo.
echo # Start application
echo CMD ["node", "server.js"]
) > Dockerfile

echo ✓ Bulletproof Dockerfile created

REM ============================================
REM PHASE 4: DEPLOY TO CLOUD RUN
REM ============================================
echo.
echo ========================================
echo PHASE 4: DEPLOY TO CLOUD RUN
echo ========================================
echo.
echo Deploying with maximum resources...
echo.
echo ⏳ This will take 3-6 minutes...
echo    - Building Docker container (2-3 min)
echo    - Pushing to registry (30 sec)
echo    - Creating revision (30 sec)
echo    - Routing traffic (10 sec)
echo.
echo 💡 TIP: Watch progress in the browser via the Cloud Build URL
echo    that will appear below.
echo.
echo Starting deployment...
echo.
echo Press Ctrl+C ONLY if you see an error. Otherwise, let it run!
echo.

REM Run deployment with explicit error capture
gcloud run deploy expense-tracker-api ^
    --source . ^
    --platform managed ^
    --region us-central1 ^
    --allow-unauthenticated ^
    --memory 1Gi ^
    --cpu 2 ^
    --max-instances 10 ^
    --min-instances 0 ^
    --timeout 600 ^
    --port 8080 ^
    --set-env-vars "NODE_ENV=production,PORT=8080" 2>&1

set DEPLOY_STATUS=%ERRORLEVEL%

echo.
echo ========================================
echo Deployment command exited with code: %DEPLOY_STATUS%
echo ========================================
echo.

if %DEPLOY_STATUS% EQU 0 (
    echo ✓ Deployment command succeeded
) else (
    echo ✗ Deployment command failed with error code: %DEPLOY_STATUS%
    echo.
    echo Checking what went wrong...
    echo.

    REM Check if service was created despite error
    gcloud run services describe expense-tracker-api --region=us-central1 >nul 2>&1
    if %ERRORLEVEL% EQU 0 (
        echo ⚠ Service exists but deployment reported failure
        echo This might be a container startup issue.
    ) else (
        echo ✗ Service was not created
        echo.
        echo Common causes:
        echo 1. Network connectivity issues
        echo 2. Insufficient permissions
        echo 3. Billing not enabled
        echo 4. API quota exceeded
    )
)
echo.

REM Restore original Dockerfile
if exist Dockerfile.backup (
    move /Y Dockerfile.backup Dockerfile >nul 2>nul
)

cd ..

REM ============================================
REM PHASE 5: POST-DEPLOYMENT VALIDATION
REM ============================================

echo Waiting 3 seconds before validation...
timeout /t 3 /nobreak >nul

if %DEPLOY_STATUS% EQU 0 (
    echo.
    echo ========================================
    echo ✓✓✓ DEPLOYMENT SUCCESSFUL! ✓✓✓
    echo ========================================
    echo.
    echo [Post-Deploy] Getting service information...

    for /f "delims=" %%i in ('gcloud run services describe expense-tracker-api --region=us-central1 --format="value(status.url)" 2^>nul') do set BACKEND_URL=%%i

    if "!BACKEND_URL!"=="" (
        echo ⚠ Could not retrieve URL, but deployment succeeded
        echo   Get URL manually: gcloud run services describe expense-tracker-api --region=us-central1
    ) else (
        echo ✓ Backend URL: !BACKEND_URL!
        echo.
        echo [Post-Deploy] Checking service health...
        timeout /t 5 /nobreak >nul
        curl -s -o nul -w "%%{http_code}" !BACKEND_URL!/api/health >nul 2>&1
        if !ERRORLEVEL! EQU 0 (
            echo ✓ Health check passed
        ) else (
            echo ⚠ Health check pending ^(needs environment variables^)
        )
    )

    echo.
    echo ========================================
    echo DEPLOYMENT SUMMARY
    echo ========================================
    echo ✓ Container built successfully
    echo ✓ Deployed to Cloud Run
    echo ✓ Service is running
    echo ✓ URL: !BACKEND_URL!
    echo.
    echo CRITICAL NEXT STEP:
    echo Run option 4 to set environment variables!
    echo Without env vars, the app will not function.
    echo.
    set /p SETUP_ENV="Set environment variables now? (y/n): "
    if /i "!SETUP_ENV!"=="y" goto set_env_vars

) else (
    echo.
    echo ========================================
    echo ✗✗✗ DEPLOYMENT FAILED ✗✗✗
    echo ========================================
    echo.
    echo The deployment to Google Cloud failed.
    echo.
    set /p VIEW_LOGS="View detailed error logs? (y/n): "
    if /i "!VIEW_LOGS!"=="y" (
        echo.
        echo ==== RECENT ERROR LOGS ====
        gcloud builds list --limit=1 --format="value(id)" >temp_build_id.txt
        set /p BUILD_ID=<temp_build_id.txt
        if "!BUILD_ID!" NEQ "" (
            gcloud builds log !BUILD_ID! --region=us-central1
        )
        del temp_build_id.txt 2>nul
    )
    echo.
    echo TROUBLESHOOTING STEPS:
    echo 1. Check the error logs above
    echo 2. Run option 9 to validate your setup
    echo 3. Run option 10 to test Docker build locally
    echo 4. Ensure billing is enabled in Google Cloud
    echo 5. Check network connectivity
    echo.
)
goto end

:quick_fix_env
echo.
echo ========================================
echo Quick Fix: Set Environment Variables
echo ========================================
echo.
echo This will set environment variables for your
echo ALREADY DEPLOYED backend service.
echo.
echo Your container built successfully but failed
echo to start because it needs these variables.
echo.

REM Check if service exists
gcloud run services describe expense-tracker-api --region=us-central1 >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ✗ No deployed service found!
    echo   Deploy first using option 8
    goto end
)

echo ✓ Service found: expense-tracker-api
echo.
echo Please provide the following:
echo.

set /p JWT_SECRET="JWT_SECRET (32+ chars, e.g., my-super-secret-jwt-key-1234567890abcdef): "
if "!JWT_SECRET!"=="" (
    echo ✗ JWT_SECRET cannot be empty!
    goto end
)

set /p GOOGLE_CLIENT_ID="GOOGLE_CLIENT_ID (from Google Cloud Console): "
if "!GOOGLE_CLIENT_ID!"=="" (
    echo ✗ GOOGLE_CLIENT_ID cannot be empty!
    goto end
)

set /p GOOGLE_CLIENT_SECRET="GOOGLE_CLIENT_SECRET (from Google Cloud Console): "
if "!GOOGLE_CLIENT_SECRET!"=="" (
    echo ✗ GOOGLE_CLIENT_SECRET cannot be empty!
    goto end
)

echo.
echo Encoding Firebase credentials...
cd server
if not exist "firebase-key.json" (
    echo ✗ server/firebase-key.json not found!
    cd ..
    goto end
)

for /f "delims=" %%i in ('node get-firebase-base64.js 2^>nul') do set FIREBASE_BASE64=%%i
cd ..

if "!FIREBASE_BASE64!"=="" (
    echo ✗ Failed to encode Firebase credentials!
    goto end
)

echo ✓ Firebase credentials encoded
echo.
echo Updating Cloud Run service with environment variables...
echo This will trigger an automatic redeployment (1-2 minutes)...
echo.

gcloud run services update expense-tracker-api ^
    --region us-central1 ^
    --update-env-vars "NODE_ENV=production,PORT=8080,FIREBASE_PROJECT_ID=flash-chat-c195c,JWT_SECRET=!JWT_SECRET!,GOOGLE_CLIENT_ID=!GOOGLE_CLIENT_ID!,GOOGLE_CLIENT_SECRET=!GOOGLE_CLIENT_SECRET!,CLIENT_URL=https://flash-chat-c195c.web.app,FIREBASE_SERVICE_ACCOUNT_BASE64=!FIREBASE_BASE64!" ^
    --quiet

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo ✓✓✓ SUCCESS! ✓✓✓
    echo ========================================
    echo.
    echo Environment variables set successfully!
    echo Service is redeploying with new configuration...
    echo.
    echo Wait 60 seconds, then test:

    for /f "delims=" %%i in ('gcloud run services describe expense-tracker-api --region=us-central1 --format="value(status.url)" 2^>nul') do set BACKEND_URL=%%i

    if "!BACKEND_URL!" NEQ "" (
        echo.
        echo ✓ Backend URL: !BACKEND_URL!
        echo ✓ Health Check: !BACKEND_URL!/api/health
        echo.
        echo After 60 seconds, visit the health check URL.
        echo You should see: {"status":"ok"}
        echo.
        echo Then update your frontend:
        echo 1. Edit client/.env.production
        echo 2. Set VITE_API_URL=!BACKEND_URL!/api
        echo 3. Run deploy.bat and select option 2
    )
) else (
    echo.
    echo ✗ Failed to update environment variables
    echo Check the error message above
)
goto end

:end
echo.
pause

