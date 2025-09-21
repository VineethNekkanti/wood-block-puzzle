# Android App Setup Guide

This guide will help you convert the Wood Block Puzzle web game into an Android app using Apache Cordova.

## Prerequisites

### 1. Install Node.js
Download and install Node.js from [nodejs.org](https://nodejs.org/)

### 2. Install Cordova
```bash
npm install -g cordova
```

### 3. Install Android Studio
1. Download Android Studio from [developer.android.com](https://developer.android.com/studio)
2. Install Android SDK
3. Set up environment variables:
   - `ANDROID_HOME` = path to your Android SDK
   - Add `%ANDROID_HOME%\tools` and `%ANDROID_HOME%\platform-tools` to your PATH

### 4. Install Java Development Kit (JDK)
Download and install JDK 8 or higher from [oracle.com](https://www.oracle.com/java/technologies/downloads/)

## Setup Steps

### 1. Initialize Cordova Project
```bash
# In your project directory
cordova create . com.woodblockpuzzle.game "Wood Block Puzzle"
```

### 2. Add Android Platform
```bash
cordova platform add android
```

### 3. Install Required Plugins
```bash
cordova plugin add cordova-plugin-whitelist
cordova plugin add cordova-plugin-statusbar
cordova plugin add cordova-plugin-device
cordova plugin add cordova-plugin-splashscreen
```

### 4. Build the App
```bash
cordova build android
```

### 5. Run on Device/Emulator
```bash
# For connected device
cordova run android

# For emulator
cordova emulate android
```

## Quick Setup Script

Run this script to automate the setup:

```bash
# Windows (PowerShell)
.\setup-android.ps1

# Linux/Mac
./setup-android.sh
```

## Troubleshooting

### Common Issues:

1. **"cordova command not found"**
   - Make sure Node.js and Cordova are properly installed
   - Try: `npm install -g cordova`

2. **"Android SDK not found"**
   - Install Android Studio
   - Set ANDROID_HOME environment variable
   - Add SDK tools to PATH

3. **"Java not found"**
   - Install JDK 8 or higher
   - Set JAVA_HOME environment variable

4. **Build fails**
   - Check Android SDK version compatibility
   - Update Cordova: `npm update -g cordova`

### Performance Optimization:

1. **Enable Hardware Acceleration**
   - Add to config.xml: `<preference name="HardwareAccelerated" value="true" />`

2. **Optimize for Mobile**
   - The game already includes touch support
   - Responsive design works on all screen sizes

3. **Audio Issues**
   - Audio will work after user interaction (browser security)
   - Consider using Cordova Media plugin for better audio control

## Testing

### Web Testing
```bash
# Test in browser first
python -m http.server 8000
# Open http://localhost:8000
```

### Android Testing
```bash
# Build and install on device
cordova run android --device

# Build APK for distribution
cordova build android --release
```

## Distribution

### Debug APK
- Location: `platforms/android/app/build/outputs/apk/debug/app-debug.apk`
- For testing only

### Release APK
```bash
cordova build android --release
```
- Location: `platforms/android/app/build/outputs/apk/release/app-release.apk`
- Sign with your keystore for Play Store

## Features Included

✅ **Touch Support** - Full touch and drag functionality
✅ **Responsive Design** - Works on all screen sizes
✅ **Audio System** - Background music and sound effects
✅ **Local Storage** - Leaderboard persistence
✅ **Performance Optimized** - Smooth 60fps gameplay
✅ **Android Ready** - Cordova configuration included

## Next Steps

1. Test the web version first
2. Set up Android development environment
3. Run the Cordova setup commands
4. Build and test on Android device
5. Customize app icon and splash screen
6. Publish to Google Play Store

The game is already optimized for mobile with touch controls and responsive design!
