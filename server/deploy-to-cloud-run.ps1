# Google Cloud Run Deployment Script for Expense Tracker Backend
# Run this from PowerShell in the server directory

param(
    [string]$ProjectId = "flash-chat-c195c",
    [string]$ServiceName = "expense-tracker-api",
    [string]$Region = "us-central1",
    [string]$ClientUrl = "https://your-app.web.app"  # UPDATE THIS!
)

Write-Host "🚀 Starting deployment to Google Cloud Run..." -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan

# Check if gcloud is installed
if (-not (Get-Command gcloud -ErrorAction SilentlyContinue)) {
    Write-Host "❌ ERROR: gcloud CLI not found!" -ForegroundColor Red
    Write-Host "Please install: https://cloud.google.com/sdk/docs/install" -ForegroundColor Yellow
    exit 1
}

# Set project
Write-Host "`n📦 Setting project: $ProjectId" -ForegroundColor Yellow
gcloud config set project $ProjectId

# Enable required APIs
Write-Host "`n🔧 Enabling required APIs..." -ForegroundColor Yellow
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com

# Build and deploy
Write-Host "`n🏗️ Building container image..." -ForegroundColor Yellow
gcloud builds submit --config=cloudbuild.yaml

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}

Write-Host "`n✅ Build successful!" -ForegroundColor Green

# Read environment variables from .env file
Write-Host "`n📝 Reading environment variables from .env..." -ForegroundColor Yellow

$envVars = @{}
Get-Content .env | ForEach-Object {
    if ($_ -match '^([^#][^=]+)=(.+)$') {
        $key = $matches[1].Trim()
        $value = $matches[2].Trim()
        $envVars[$key] = $value
    }
}

# Override specific values for production
$envVars["PORT"] = "8080"
$envVars["NODE_ENV"] = "production"
$envVars["CLIENT_URL"] = $ClientUrl

# Build env-vars string
$envVarsString = ($envVars.GetEnumerator() | ForEach-Object {
    "$($_.Key)=$($_.Value)"
}) -join ","

Write-Host "`n🔐 Setting environment variables on Cloud Run service..." -ForegroundColor Yellow
gcloud run services update $ServiceName `
    --region=$Region `
    --set-env-vars="$envVarsString"

if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  Note: Service might not exist yet. Environment variables will be set after first deployment." -ForegroundColor Yellow
}

# Get service URL
Write-Host "`n🌐 Getting service URL..." -ForegroundColor Yellow
$serviceUrl = gcloud run services describe $ServiceName --region=$Region --format="value(status.url)"

Write-Host "`n================================================" -ForegroundColor Cyan
Write-Host "✅ DEPLOYMENT SUCCESSFUL!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "`n📍 Service URL: $serviceUrl" -ForegroundColor Cyan
Write-Host "`n🔍 Test your API:" -ForegroundColor Yellow
Write-Host "   curl $serviceUrl/api/health" -ForegroundColor White
Write-Host "`n📊 View logs:" -ForegroundColor Yellow
Write-Host "   gcloud run services logs read $ServiceName --region=$Region" -ForegroundColor White
Write-Host "`n⚠️  IMPORTANT: Update your frontend .env file with:" -ForegroundColor Yellow
Write-Host "   VITE_API_URL=$serviceUrl" -ForegroundColor White
Write-Host "`n================================================`n" -ForegroundColor Cyan

# Ask if user wants to open Cloud Run console
$response = Read-Host "Would you like to open the Cloud Run console in your browser? (y/n)"
if ($response -eq 'y' -or $response -eq 'Y') {
    Start-Process "https://console.cloud.google.com/run/detail/$Region/$ServiceName/metrics?project=$ProjectId"
}
