# Google Sign-In Setup Guide

This guide will help you set up Google Sign-In for the Greenfield mobile app, both for local development and production deployment.

## Prerequisites

- Google Cloud Console account
- Firebase project (recommended for easier setup)
- Access to both iOS and Android development environments

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Note your Project ID

## Step 2: Set up OAuth 2.0 Credentials

### For Android

1. In Google Cloud Console, go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth client ID**
3. Select **Android** as application type
4. Enter your package name: `com.greenfieldsupermarket.app`
5. Get your SHA-1 certificate fingerprint:

   **For Development (Debug):**
   ```bash
   cd frontend/android
   ./gradlew signingReport
   ```

   Or using keytool:
   ```bash
   keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android
   ```

   **For Production (Release):**
   ```bash
   keytool -list -v -keystore /path/to/your/release-keystore.jks
   ```

6. Copy the SHA-1 fingerprint and paste it in the Google Cloud Console
7. Click **Create**
8. Note the Client ID (you won't need it in code, but keep it for reference)

### For iOS

1. In Google Cloud Console, go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth client ID**
3. Select **iOS** as application type
4. Enter your Bundle ID: `com.greenfieldsupermarket.app`
5. Click **Create**
6. Download the `GoogleService-Info.plist` file
7. Place it in `frontend/GoogleService-Info.plist`

### For Web (Required - This is the most important one!)

1. In Google Cloud Console, go to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth client ID**
3. Select **Web application** as application type
4. Name it "Greenfield Web Client"
5. Add authorized JavaScript origins (optional for mobile):
   - `http://localhost`
   - `https://greenfieldsupermarket.com`
6. Click **Create**
7. **IMPORTANT:** Copy the **Client ID** - this is your `GOOGLE_WEB_CLIENT_ID`

## Step 3: Download Configuration Files

### Android - google-services.json

**Option A: Using Firebase (Recommended)**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing
3. Add an Android app:
   - Package name: `com.zunnoon.greenfield`
   - App nickname: Greenfield Android
4. Download `google-services.json`
5. Place it in `frontend/google-services.json`

**Option B: Manual Setup**

If not using Firebase, create `frontend/google-services.json` manually:
```json
{
  "project_info": {
    "project_number": "YOUR_PROJECT_NUMBER",
    "project_id": "your-project-id"
  },
  "client": [
    {
      "client_info": {
        "mobilesdk_app_id": "1:YOUR_PROJECT_NUMBER:android:YOUR_APP_ID",
        "android_client_info": {
          "package_name": "com.zunnoon.greenfield"
        }
      },
      "oauth_client": [
        {
          "client_id": "YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com",
          "client_type": 1,
          "android_info": {
            "package_name": "com.zunnoon.greenfield",
            "certificate_hash": "YOUR_SHA1_HASH"
          }
        },
        {
          "client_id": "YOUR_WEB_CLIENT_ID.apps.googleusercontent.com",
          "client_type": 3
        }
      ]
    }
  ]
}
```

### iOS - GoogleService-Info.plist

If using Firebase:
1. In Firebase Console, add an iOS app
2. Bundle ID: `com.zunnoon.greenfield`
3. Download `GoogleService-Info.plist`
4. Place it in `frontend/GoogleService-Info.plist`

## Step 4: Configure Environment Variables

### Local Development

1. Create/update `frontend/.env`:
   ```env
   GOOGLE_WEB_CLIENT_ID=YOUR_WEB_CLIENT_ID.apps.googleusercontent.com
   API_BASE_URL=http://localhost:8000/backend
   ```

2. Replace `YOUR_WEB_CLIENT_ID` with the Web Client ID from Step 2

### Production Deployment

For EAS Build:

1. Add secret to Expo:
   ```bash
   cd frontend
   eas secret:create --scope project --name GOOGLE_WEB_CLIENT_ID --value YOUR_WEB_CLIENT_ID.apps.googleusercontent.com
   ```

2. Update `frontend/.env.production`:
   ```env
   GOOGLE_WEB_CLIENT_ID=YOUR_WEB_CLIENT_ID.apps.googleusercontent.com
   API_BASE_URL=https://greenfieldsupermarket.com/mobile-api/backend
   ```

## Step 5: Enable Google Sign-In API

1. In Google Cloud Console, go to **APIs & Services** > **Library**
2. Search for "Google Sign-In API" or "Google+ API"
3. Click **Enable**

## Step 6: Test the Implementation

### Local Testing

1. Start the backend server:
   ```bash
   cd backend
   php -S localhost:8000
   ```

2. Start the Expo development server:
   ```bash
   cd frontend
   npm start
   ```

3. Run on Android emulator or device:
   ```bash
   npm run android
   ```

4. Run on iOS simulator or device:
   ```bash
   npm run ios
   ```

5. On the Login screen, tap "Sign in with Google"
6. Select your Google account
7. Grant permissions
8. You should be logged in!

### Production Testing

1. Build the app with EAS:
   ```bash
   cd frontend
   eas build --platform android
   eas build --platform ios
   ```

2. Install the build on your device
3. Test Google Sign-In

## Troubleshooting

### Android Issues

**Error: "DEVELOPER_ERROR" or "API_NOT_CONNECTED"**
- Verify SHA-1 fingerprint is correct and added to Google Cloud Console
- Ensure `google-services.json` is in the correct location
- Make sure package name matches exactly: `com.zunnoon.greenfield`
- Try rebuilding the app: `cd android && ./gradlew clean && cd .. && npm run android`

**Error: "SIGN_IN_FAILED"**
- Check that Google Sign-In API is enabled in Google Cloud Console
- Verify Web Client ID is correct in `.env` file
- Check internet connection

### iOS Issues

**Error: "The operation couldn't be completed"**
- Verify Bundle ID matches: `com.zunnoon.greenfield`
- Ensure `GoogleService-Info.plist` is properly placed
- Check that iOS Client ID is created in Google Cloud Console

**Error: "No valid client ID found"**
- Verify GOOGLE_WEB_CLIENT_ID is set correctly
- Make sure you're using the Web Client ID, not iOS Client ID

### General Issues

**Backend returns error**
- Check that backend API endpoint exists: `backend/api/google-login.php`
- Verify database has `google_id` and `email_verified` columns
- Check backend logs for detailed error messages

**Token expired or invalid**
- Google tokens expire after a while
- Try signing out and signing in again
- Clear app data and try fresh login

## Security Best Practices

1. **Never commit credentials:**
   - Add `.env` to `.gitignore`
   - Add `google-services.json` to `.gitignore`
   - Add `GoogleService-Info.plist` to `.gitignore`

2. **Restrict API Keys:**
   - In Google Cloud Console, restrict each API key to specific apps
   - Add package name restrictions for Android
   - Add bundle ID restrictions for iOS

3. **Use environment-specific credentials:**
   - Use different OAuth clients for development and production
   - Never use production credentials in development

## Database Schema

The following columns are required in the `users` table:

```sql
google_id VARCHAR(255) NULL UNIQUE
email_verified TINYINT(1) DEFAULT 0
```

Migration has been created at: `backend/migrations/add_google_auth.sql`

## Files Modified/Created

### Frontend
- `frontend/api/authAPI.js` - Added `googleSignIn()` function
- `frontend/screens/LoginScreen.tsx` - Added Google Sign-In button functionality
- `frontend/app.config.js` - Added Google configuration
- `frontend/.env` - Added `GOOGLE_WEB_CLIENT_ID`
- `frontend/google-services.json` - Android Google Services configuration (you need to create this)
- `frontend/GoogleService-Info.plist` - iOS Google Services configuration (you need to create this)

### Backend
- `backend/api/google-login.php` - Google authentication endpoint
- `backend/migrations/add_google_auth.sql` - Database migration

### Documentation
- `GOOGLE_SIGNIN_SETUP.md` - This file

## Quick Setup Checklist

- [ ] Create Google Cloud project
- [ ] Create OAuth 2.0 credentials (Android, iOS, Web)
- [ ] Download and place `google-services.json` for Android
- [ ] Download and place `GoogleService-Info.plist` for iOS
- [ ] Copy Web Client ID to `.env` file
- [ ] Enable Google Sign-In API
- [ ] Run database migration
- [ ] Test on Android device/emulator
- [ ] Test on iOS device/simulator
- [ ] Configure production credentials for deployment

## Support

For more information:
- [Google Sign-In for Android](https://developers.google.com/identity/sign-in/android)
- [Google Sign-In for iOS](https://developers.google.com/identity/sign-in/ios)
- [React Native Google Sign-In](https://github.com/react-native-google-signin/google-signin)
- [Expo Google Authentication](https://docs.expo.dev/guides/google-authentication/)
