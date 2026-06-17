# Greenfield App - Deployment & APK Build Guide

## Overview

This guide walks you through:
1. Deploying your PHP backend to production server
2. Configuring production database
3. Setting up Google Sign-In for production
4. Building APK for testing
5. Building production release

---

## PHASE 1: Deploy Backend to Production

### 1.1 Upload Backend Files

Upload these folders to your production server at `greenfieldsupermarket.com`:

```
📁 /public_html/mobile-api/
├── 📁 backend/
│   ├── 📁 admin/
│   │   ├── 📁 includes/
│   │   │   └── db_settings.php
│   │   └── 📁 upload/
│   │       ├── 📁 dow/          (all product images)
│   │       └── 📁 stores/       (all category images)
│   ├── 📁 api/
│   │   ├── login.php
│   │   ├── register.php
│   │   ├── google-login.php
│   │   ├── verify-email.php
│   │   ├── forgot-password.php
│   │   ├── products.php
│   │   └── ... (all other API files)
│   └── 📁 helpers/
│       ├── email.php
│       └── logger.php
```

**Upload Method:**
- Use cPanel File Manager, OR
- Use FTP client (FileZilla), OR
- Use SSH/terminal: `scp -r backend/ user@greenfieldsupermarket.com:/public_html/mobile-api/`

### 1.2 Configure Production Database

**File:** `/public_html/mobile-api/backend/admin/includes/db_settings.php`

```php
<?php
// Production Database Configuration
$db_host = "localhost";  // or your cPanel MySQL hostname
$db_user = "greenfieldsuperm_user";
$db_pass = "Samikhan123###";  // Use strong password
$db_name = "greenfieldsuperm_db";

$con = mysqli_connect($db_host, $db_user, $db_pass, $db_name);

if ($con->connect_error) {
    die('Connect Error: '. mysqli_connect_error());
}

mysqli_set_charset($con, 'utf8mb4');
?>
```

### 1.3 Verify Production Database Tables

Make sure your production database has all required tables:
- `users` - User accounts
- `dow` - Products
- `brands` - Product brands
- `categories` - Product categories
- `password_resets` - Password reset tokens

### 1.4 Test Production Backend

Test each endpoint:

```bash
# Test products API
curl https://greenfieldsupermarket.com/mobile-api/backend/api/products.php?limit=5

# Test login API
curl -X POST https://greenfieldsupermarket.com/mobile-api/backend/api/login.php \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

**Expected:** All endpoints return JSON responses (not 404 or 500 errors)

---

## PHASE 2: Configure Google Sign-In for Production

### 2.1 Update Google Cloud Console

Go to: https://console.cloud.google.com/apis/credentials

**Add Authorized Redirect URIs:**
```
https://greenfieldsupermarket.com
https://greenfieldsupermarket.com/mobile-api/backend/api/google-login.php
```

**Add Authorized JavaScript Origins:**
```
https://greenfieldsupermarket.com
```

### 2.2 Verify Google Web Client ID

Your current Web Client ID in `.env`:
```
GOOGLE_WEB_CLIENT_ID=969529169540-vkaojfsqj9n4167e0a2cbahlh5ogkn8v.apps.googleusercontent.com
```

This will be used in the APK build.

---

## PHASE 3: Build APK for Testing

### 3.1 Environment Configuration

**Your `app.config.js` is already configured correctly!**

It uses:
- **Development mode** (local testing): `API_BASE_URL=http://192.168.100.176:8000`
- **Production builds**: Falls back to `https://greenfieldsupermarket.com/mobile-api/backend`

**No changes needed!** The production URL is already set in `app.config.js:54-55`.

### 3.2 Build Preview APK (For Testing)

**Option A: Build with EAS (Recommended)**

```bash
cd frontend

# Login to Expo
npx eas login

# Build preview APK
npx eas build --platform android --profile preview
```

**What happens:**
1. EAS uploads your code to their servers
2. Builds APK in the cloud (takes 10-20 minutes)
3. Provides download link when done
4. APK automatically uses production API URL from `app.config.js`

**Download APK:**
- Check your email for build completion
- Or visit: https://expo.dev/accounts/zunnoonwaheed/projects/greenfield/builds
- Download APK and share with testers

**Option B: Build Locally (Faster, More Control)**

```bash
cd frontend

# Generate native Android project
npx expo prebuild --clean

# Build APK locally
cd android
./gradlew assembleRelease

# APK location:
# android/app/build/outputs/apk/release/app-release.apk
```

### 3.3 Install APK on Test Device

**Transfer APK to phone:**
```bash
# Via USB
adb install android/app/build/outputs/apk/release/app-release.apk

# Or email APK file to testers
# Or upload to Google Drive and share link
```

**On Android device:**
1. Enable "Install from Unknown Sources" in Settings
2. Download APK
3. Tap to install
4. Test all features including Google Sign-In

---

## PHASE 4: Build Production Release (App Store/Play Store)

### 4.1 Update Version Number

**File:** `frontend/app.config.js`

```javascript
version: "1.0.2",  // Increment version
android: {
  versionCode: 3,  // Auto-incremented by EAS
  // ...
}
```

### 4.2 Generate Signing Key (First Time Only)

```bash
cd frontend

# Generate keystore
keytool -genkeypair -v -storetype PKCS12 \
  -keystore greenfield-release.keystore \
  -alias greenfield-key \
  -keyalg RSA -keysize 2048 -validity 10000

# Upload keystore to EAS
npx eas credentials
```

**Save keystore password securely!**

### 4.3 Build Production AAB (Android App Bundle)

```bash
npx eas build --platform android --profile production
```

**What you get:**
- `.aab` file (Android App Bundle)
- Ready for Google Play Store upload
- Smaller download size than APK
- Google Play optimizes for each device

### 4.4 Submit to Google Play Store

1. Go to: https://play.google.com/console
2. Create app listing
3. Upload AAB file
4. Add screenshots, description, privacy policy
5. Submit for review (takes 1-7 days)

---

## TESTING CHECKLIST

### Before Building APK:

- [ ] Backend deployed to production server
- [ ] Production database configured and populated
- [ ] All API endpoints tested and working
- [ ] Google Sign-In redirect URIs added to Google Cloud Console
- [ ] SSL certificate active on greenfieldsupermarket.com (HTTPS)
- [ ] Product images accessible at production URLs

### After Building APK:

- [ ] APK installs successfully on test device
- [ ] App opens without crashes
- [ ] API calls connect to production server (not local)
- [ ] Login/Register works
- [ ] Google Sign-In works
- [ ] Email verification works
- [ ] Products load with images
- [ ] All screens navigate correctly
- [ ] Location permissions work
- [ ] Push notifications work (if implemented)

---

## CURRENT CONFIGURATION SUMMARY

### Frontend (.env - Development)
```
API_BASE_URL=http://192.168.100.176:8000
GOOGLE_WEB_CLIENT_ID=969529169540-vkaojfsqj9n4167e0a2cbahlh5ogkn8v.apps.googleusercontent.com
```

### Frontend (app.config.js - Production)
```javascript
API_BASE_URL: "https://greenfieldsupermarket.com/mobile-api/backend"
NODE_ENV: "production"
```

### Backend (Production)
```
URL: https://greenfieldsupermarket.com/mobile-api/backend
Database: greenfieldsuperm_db
User: greenfieldsuperm_user
```

---

## QUICK COMMANDS REFERENCE

```bash
# Build preview APK (testing)
npx eas build --platform android --profile preview

# Build production AAB (Play Store)
npx eas build --platform android --profile production

# Build locally
npx expo prebuild --clean
cd android && ./gradlew assembleRelease

# Install on device via USB
adb install app-release.apk

# Check build status
npx eas build:list

# View build logs
npx eas build:view [BUILD_ID]
```

---

## TROUBLESHOOTING

### Issue: "API_BASE_URL is undefined"
**Solution:** Make sure `app.config.js` has fallback URL at line 54-55

### Issue: "Google Sign-In failed"
**Solution:**
1. Check Google Cloud Console has production redirect URIs
2. Verify Web Client ID is correct in app.config.js
3. Ensure HTTPS is working on production server

### Issue: "Images not loading"
**Solution:**
1. Check images uploaded to `/admin/upload/dow/` on production
2. Verify image URLs in database match uploaded files
3. Test image URL directly: `https://greenfieldsupermarket.com/mobile-api/backend/admin/upload/dow/test-image.webp`

### Issue: "Build failed on EAS"
**Solution:**
1. Check build logs: `npx eas build:view [BUILD_ID]`
2. Verify all dependencies in package.json are compatible
3. Ensure app.config.js is valid JavaScript

---

## RECOMMENDED DEPLOYMENT WORKFLOW

**For Development/Testing:**
```
1. Deploy backend → 2. Test APIs → 3. Build preview APK → 4. Test on device
```

**For Production Release:**
```
1. Final backend deploy → 2. Increment version → 3. Build production AAB → 4. Submit to Play Store
```

---

## COST ESTIMATES

- **EAS Build**: Free tier (limited builds per month)
- **Google Play Developer**: $25 one-time fee
- **Production Hosting**: Your current hosting plan
- **SSL Certificate**: Usually free with hosting (Let's Encrypt)

---

## NEXT STEPS

1. ✅ Deploy backend to production server
2. ✅ Test all API endpoints on production
3. ✅ Update Google Cloud Console with production URLs
4. ✅ Build preview APK with: `npx eas build --platform android --profile preview`
5. ✅ Download and test APK on physical device
6. ✅ If all works, build production AAB for Play Store

Good luck with your deployment! 🚀
