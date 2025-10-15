# Greenfield App - Complete Setup & Testing Guide

## 🎯 Overview

This is a complete React Native (Expo) app with TypeScript connected to a Node.js/Express backend on **port 5000**. The app includes full authentication flow, location permissions, and user management.

---

## 📱 Complete Flow (Screen Navigation)

```
1. Privacy Screen (LocationPermissionScreen)
   ↓ (Allow location or skip)
2. Login Screen
   ↓ (Sign up link)
3. Sign Up Screen (Step 1)
   ↓ (Next)
4. Add Location Screen (Step 2)
   ↓ (Done)
5. Welcome Screen
   → Start Exploring (Future: Home screen)

Alt flows:
- Login → Forgot Password → Reset Password → Back to Login
- Login → Success → Welcome Screen
```

---

## 🚀 Quick Start

### 1. Backend Setup

```bash
# Navigate to backend
cd greenfield-backend

# Install dependencies (if not already done)
npm install

# Ensure MySQL is running and database exists
mysql -u root -p
> CREATE DATABASE IF NOT EXISTS greenfieldsuperm_db_local;
> exit

# Import database schema
mysql -u root -p greenfieldsuperm_db_local < models/local_backup.sql

# OR seed with test data
node seed.js

# Start backend server (port 5000)
npm run dev
```

**Expected output:**
```
✅ Database connected successfully
🚀 Server running on port 5000
🚀 API URL: http://localhost:5000/api
```

### 2. Frontend Setup

```bash
# From project root
npm install

# Start Expo development server
npx expo start
```

### 3. Run on Device/Simulator

**iOS Simulator:**
```bash
# Press 'i' in Expo terminal
# OR
npx expo start --ios
```

**Android Emulator:**
```bash
# Press 'a' in Expo terminal
# OR
npx expo start --android
```

**Physical Device:**
1. Install Expo Go app
2. Scan QR code from terminal
3. **IMPORTANT**: Update API URL in `api/axiosConfig.js`:
   ```javascript
   // Uncomment and use your computer's local IP
   const API_BASE_URL = 'http://192.168.1.100:5000/api';
   ```
4. Find your IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)

---

## 🔧 API Configuration

### Current Setup (Auto-detected):

- **iOS Simulator**: `http://127.0.0.1:5000/api` ✅
- **Android Emulator**: `http://10.0.2.2:5000/api` ✅
- **Physical Device**: Requires manual IP configuration

### File: `api/axiosConfig.js`

The app automatically selects the correct URL based on platform:

```javascript
const getBaseURL = () => {
  if (__DEV__) {
    if (Platform.OS === 'ios') {
      return 'http://127.0.0.1:5000/api';
    } else if (Platform.OS === 'android') {
      return 'http://10.0.2.2:5000/api';
    }
  }
  return 'http://localhost:5000/api';
};
```

For **physical devices**, uncomment line 31:
```javascript
const API_BASE_URL = 'http://YOUR_LOCAL_IP:5000/api';
```

---

## ✅ Testing Checklist

### Backend Tests

```bash
# Test server is running
curl http://localhost:5000/health

# Expected response:
{
  "success": true,
  "message": "Server is running",
  "timestamp": "2025-10-13T..."
}

# Test API endpoint
curl http://localhost:5000/api/auth/login -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

### Frontend Flow Tests

#### 1. Location Permission Screen
- [ ] Screen loads correctly
- [ ] "Yes, Allow" button requests location permission
- [ ] Location coordinates saved to AsyncStorage
- [ ] Navigation to Login works
- [ ] "Only Allow Essential Access" skips and navigates to Login

#### 2. Login Screen
- [ ] Email and password inputs work
- [ ] Password visibility toggle works
- [ ] "Forgot Password" link navigates correctly
- [ ] "Sign up" link navigates to SignUp
- [ ] Invalid credentials show error alert
- [ ] Valid login saves token and navigates to Welcome
- [ ] Loading spinner shows during API call

#### 3. Sign Up Flow (2 Steps)
- [ ] Step 1: Name, email, password validation works
- [ ] Terms checkbox required
- [ ] "Next" navigates to AddLocation
- [ ] Step 2: All location fields validate
- [ ] "Done" creates account and navigates to Welcome
- [ ] Duplicate email shows error

#### 4. Password Reset Flow
- [ ] Forgot Password accepts email
- [ ] Success message shows
- [ ] Reset Password accepts token and new password
- [ ] Passwords must match
- [ ] Success navigates to Login

#### 5. Welcome Screen
- [ ] Displays user's name from token
- [ ] "Start Exploring" button works
- [ ] Confetti animation plays

---

## 🐛 Troubleshooting

### "Network Error" or "Cannot connect"

**Solutions:**

1. **Backend not running**
   ```bash
   cd greenfield-backend
   npm run dev
   # Ensure you see: Server running on port 5000
   ```

2. **Wrong API URL**
   - iOS Simulator: Must use `http://127.0.0.1:5000/api`
   - Android Emulator: Must use `http://10.0.2.2:5000/api`
   - Physical Device: Must use `http://YOUR_IP:5000/api`
   - Check console: `console.log('API Base URL:', API_BASE_URL);`

3. **Firewall blocking**
   - Allow port 5000 in firewall
   - Disable VPN if testing on physical device

4. **CORS issues**
   - Backend `.env` has: `CORS_ORIGIN=*` (set in server.js)
   - Check browser/console for CORS errors

### "Database connection failed"

```bash
# Check MySQL is running
mysql -u root -p

# Verify database exists
SHOW DATABASES;

# Re-import schema
mysql -u root -p greenfieldsuperm_db_local < greenfield-backend/models/local_backup.sql
```

### "Token expired" or "Unauthorized"

```bash
# Clear AsyncStorage in app
# Add this to any screen temporarily:
import AsyncStorage from '@react-native-async-storage/async-storage';
await AsyncStorage.clear();

# Or clear via React Native Debugger
```

### Build errors

```bash
# Clear caches
npx expo start -c

# Reinstall dependencies
rm -rf node_modules
npm install
```

---

## 📊 Testing with Postman/Curl

### 1. Test Backend Directly

**Signup:**
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "test123",
    "phone": "+1234567890"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123"
  }'
```

**Add Location (with token):**
```bash
curl -X POST http://localhost:5000/api/location/add \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "city": "Islamabad",
    "area": "DHA",
    "sector": "Phase 2",
    "streetNumber": "5",
    "propertyType": "house",
    "houseNumber": "123"
  }'
```

---

## 📝 Environment Files

### Backend `.env` (greenfield-backend/)

```env
PORT=5000
NODE_ENV=development
API_URL=http://localhost:5000/api

DB_HOST=localhost
DB_PORT=3306
DB_NAME=greenfieldsuperm_db_local
DB_USER=root
DB_PASSWORD=

JWT_SECRET=local_dev_secret_key_change_in_production
JWT_EXPIRE=7d

CORS_ORIGIN=http://localhost:19006,http://127.0.0.1:19006,exp://localhost:19000
CORS_CREDENTIALS=true
```

### Frontend `.env` (root directory)

```env
PUBLIC_BUILDER_KEY=3566a803d6b74837818bc68a548b28d8
```

---

## 🔐 Test Accounts

After running `node seed.js`:

**Admin:**
- Email: `admin@greenfield.com`
- Password: `admin123`

**Customer:**
- Email: `customer@test.com`
- Password: `test123`

---

## 📦 Key Dependencies

### Frontend
- `expo` ~54.0.12
- `react-native` 0.81.4
- `@react-navigation/native` ^7.1.18
- `@react-navigation/stack` ^7.4.9
- `axios` ^1.12.2
- `@react-native-async-storage/async-storage` ^2.2.0
- `expo-location` ^19.0.7

### Backend
- `express` ^5.1.0
- `mysql2` ^3.15.2
- `bcrypt` ^6.0.0
- `jsonwebtoken` ^9.0.2
- `cors` ^2.8.5
- `dotenv` ^17.2.3
- `express-validator` ^7.2.1

---

## 🎨 Features Implemented

✅ Location permission with GPS coordinates
✅ User authentication (signup, login, password reset)
✅ JWT token-based authorization
✅ AsyncStorage for token persistence
✅ Auto-login on app restart
✅ Form validation with error messages
✅ Loading states on all API calls
✅ Platform-specific API URLs
✅ Proper navigation flow
✅ User profile management
✅ Location address management
✅ Error handling with user-friendly alerts
✅ TypeScript type safety

---

## 🚧 Next Steps (Optional Enhancements)

1. **Add Home Screen** - Main app interface after Welcome
2. **Profile Screen** - Edit user info and view saved locations
3. **Location List Screen** - View and manage all saved addresses
4. **Push Notifications** - For order updates
5. **Image Upload** - Profile pictures
6. **Social Login** - Google/Facebook OAuth
7. **App Icon & Splash Screen** - Branding
8. **Production Build** - Create APK/IPA

---

## 📞 Support

If you encounter issues:

1. Check console logs in both frontend and backend
2. Verify database connection
3. Ensure port 5000 is not in use: `lsof -i :5000` (Mac/Linux) or `netstat -ano | findstr :5000` (Windows)
4. Test backend endpoints with Postman/curl first
5. Clear app data and AsyncStorage

---

## 🎉 Success Indicators

**Backend is working when:**
- Console shows: `Server running on port 5000`
- `curl http://localhost:5000/health` returns success
- Database queries work

**Frontend is working when:**
- Expo Metro bundler starts
- Console shows: `API Base URL: http://127.0.0.1:5000/api`
- Location permission prompt appears
- Navigation works between screens

**Integration is working when:**
- Signup creates account (check database)
- Login returns token (check AsyncStorage)
- Location submission saves (check database)
- Welcome screen shows user name

---

**🎊 You're all set! Happy coding!**
