# Wood Block Puzzle - Android Setup Script
# This script automates the setup process for converting the web game to Android

Write-Host "🌳 Wood Block Puzzle - Android Setup" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green

# Check if Node.js is installed
Write-Host "`n📦 Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found. Please install Node.js from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Check if npm is available
Write-Host "`n📦 Checking npm..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version
    Write-Host "✅ npm found: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm not found. Please install Node.js with npm." -ForegroundColor Red
    exit 1
}

# Install Cordova globally if not present
Write-Host "`n🔧 Installing Cordova..." -ForegroundColor Yellow
try {
    $cordovaVersion = cordova --version
    Write-Host "✅ Cordova found: $cordovaVersion" -ForegroundColor Green
} catch {
    Write-Host "📥 Installing Cordova globally..." -ForegroundColor Yellow
    npm install -g cordova
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Cordova installed successfully" -ForegroundColor Green
    } else {
        Write-Host "❌ Failed to install Cordova" -ForegroundColor Red
        exit 1
    }
}

# Check if Android SDK is available
Write-Host "`n🤖 Checking Android SDK..." -ForegroundColor Yellow
$androidHome = $env:ANDROID_HOME
if ($androidHome -and (Test-Path $androidHome)) {
    Write-Host "✅ Android SDK found at: $androidHome" -ForegroundColor Green
} else {
    Write-Host "⚠️  Android SDK not found. Please:" -ForegroundColor Yellow
    Write-Host "   1. Install Android Studio from https://developer.android.com/studio" -ForegroundColor White
    Write-Host "   2. Set ANDROID_HOME environment variable" -ForegroundColor White
    Write-Host "   3. Add %ANDROID_HOME%\tools and %ANDROID_HOME%\platform-tools to PATH" -ForegroundColor White
    Write-Host "`n   Continuing with web setup only..." -ForegroundColor Yellow
}

# Initialize Cordova project
Write-Host "`n🏗️  Setting up Cordova project..." -ForegroundColor Yellow
if (-not (Test-Path "platforms")) {
    Write-Host "📥 Initializing Cordova project..." -ForegroundColor Yellow
    cordova create . com.woodblockpuzzle.game "Wood Block Puzzle" --link-to=index.html
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Cordova project initialized" -ForegroundColor Green
    } else {
        Write-Host "❌ Failed to initialize Cordova project" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "✅ Cordova project already exists" -ForegroundColor Green
}

# Add Android platform
Write-Host "`n📱 Adding Android platform..." -ForegroundColor Yellow
try {
    cordova platform add android
    Write-Host "✅ Android platform added" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Could not add Android platform. Make sure Android SDK is installed." -ForegroundColor Yellow
}

# Install required plugins
Write-Host "`n🔌 Installing Cordova plugins..." -ForegroundColor Yellow
$plugins = @(
    "cordova-plugin-whitelist",
    "cordova-plugin-statusbar", 
    "cordova-plugin-device",
    "cordova-plugin-splashscreen"
)

foreach ($plugin in $plugins) {
    Write-Host "📥 Installing $plugin..." -ForegroundColor Yellow
    cordova plugin add $plugin
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ $plugin installed" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Failed to install $plugin" -ForegroundColor Yellow
    }
}

# Test web version
Write-Host "`n🌐 Testing web version..." -ForegroundColor Yellow
Write-Host "Starting local server on http://localhost:8000" -ForegroundColor White
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor White
Write-Host "`n🎮 Open http://localhost:8000 in your browser to test the game!" -ForegroundColor Green

# Start web server
try {
    python -m http.server 8000
} catch {
    Write-Host "⚠️  Python not found. Please install Python or use another web server." -ForegroundColor Yellow
    Write-Host "You can also open index.html directly in your browser." -ForegroundColor White
}

Write-Host "`n🎉 Setup complete!" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "1. Test the web version in your browser" -ForegroundColor White
Write-Host "2. If Android SDK is installed, run: cordova build android" -ForegroundColor White
Write-Host "3. To run on device: cordova run android" -ForegroundColor White
Write-Host "`nFor detailed instructions, see setup-android.md" -ForegroundColor Cyan
