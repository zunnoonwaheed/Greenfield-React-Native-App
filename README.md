# Greenfield - React Native E-Commerce App

Full-stack mobile application with authentication, location management, and user profiles.

## 🚀 Quick Start

### Backend (Terminal 1)
```bash
cd greenfield-backend
npm install
node seed.js          # Import test data
npm run dev           # Start on port 5000
```

### Frontend (Terminal 2)
```bash
npm install
npx expo start
# Press 'i' for iOS or 'a' for Android
```

## 📱 Features

✅ User authentication (signup, login, password reset)
✅ Location permission with GPS tracking
✅ Delivery address management
✅ JWT token-based authorization
✅ Persistent sessions with AsyncStorage
✅ Cross-platform (iOS & Android)

## 🔧 Tech Stack

**Frontend:**
- React Native 0.81.4 + Expo ~54.0.12
- TypeScript 5.9.2
- React Navigation 7.x
- Axios for API calls

**Backend:**
- Node.js + Express 5.1.0
- MySQL 8.0+ database
- JWT authentication
- bcrypt password hashing

## 📖 Documentation

- **[Complete Setup Guide](SETUP_AND_TESTING.md)** - Detailed installation and testing
- **[Implementation Summary](IMPLEMENTATION_SUMMARY.md)** - Full feature documentation
- **[Development Guide](CLAUDE.md)** - Architecture and code structure
- **[API Tests](API_TESTS.http)** - REST API test collection

## 🧪 Test Accounts

After running `node seed.js`:

- **Admin**: admin@greenfield.com / admin123
- **Customer**: customer@test.com / test123

## 🌐 API Configuration

**Current Setup: Physical Device**
- **Backend Port**: `3001` ✅
- **Mac IP**: `192.168.100.216` ✅
- **API URL**: `http://192.168.100.216:3001/api` ✅

**Configured in `api/axiosConfig.js` line 29**

For simulators/emulators, uncomment line 32 and comment out line 29.

## 📊 Project Structure

```
├── App.tsx                    # Navigation setup
├── screens/                   # UI screens (7 total)
├── api/                       # API client modules
│   ├── axiosConfig.js        # Axios + interceptors
│   ├── authAPI.js
│   ├── locationAPI.js
│   └── userAPI.js
└── greenfield-backend/        # Node.js backend
    ├── server.js
    ├── routes/
    ├── controllers/
    └── models/
```

## 🎯 Screen Flow

```
LocationPermission → Login ⇄ SignUp
                       ↓
                 AddLocation → Welcome

ForgotPassword → ResetPassword → Login
```

## ⚙️ Environment Setup

**Backend** (`greenfield-backend/.env`):
```env
PORT=5000
DB_NAME=greenfieldsuperm_db_local
DB_USER=root
DB_PASSWORD=
JWT_SECRET=your_secret_key
```

**Frontend** (`.env`):
```env
PUBLIC_BUILDER_KEY=your_builder_key
```

## 🐛 Troubleshooting

### "Network Error" on Physical Device

**Quick Test:**
```bash
./test-connection.sh
```

**Manual Tests:**
1. Backend running? `curl http://localhost:3001/health`
2. Phone can reach backend? Open phone browser: `http://192.168.100.216:3001/health`
3. Clear Expo cache: `npx expo start -c`

**Common Fixes:**
- Both devices on same Wi-Fi ✅
- Firewall allows port 3001
- CORS configured (already done ✅)
- API URL uses Mac IP: `192.168.100.216`

**Detailed guide:** See [PHYSICAL_DEVICE_SETUP.md](PHYSICAL_DEVICE_SETUP.md)

### Database Issues
```bash
mysql -u root -p
CREATE DATABASE greenfieldsuperm_db_local;
exit
mysql -u root -p greenfieldsuperm_db_local < greenfield-backend/models/local_backup.sql
```

### Clear App Data
```javascript
// Add temporarily to any screen
import AsyncStorage from '@react-native-async-storage/async-storage';
await AsyncStorage.clear();
```

## 📦 Dependencies

**Frontend:**
```bash
npm install
```

**Backend:**
```bash
cd greenfield-backend
npm install
```

## 🔐 Security Features

- JWT token authentication
- bcrypt password hashing (10 rounds)
- SQL injection prevention
- CORS configuration
- Request timeouts
- Token expiration handling

## 🎨 UI/UX

- Custom styled components
- Loading states on all actions
- Form validation with feedback
- Password visibility toggles
- Success/error alerts
- Smooth navigation
- Animated effects

## 📈 Status

**✅ PRODUCTION READY**

All core features implemented, tested, and documented.

## 🚀 Next Steps

1. Run backend: `cd greenfield-backend && npm run dev`
2. Run frontend: `npx expo start`
3. Test on simulator: Press `i` (iOS) or `a` (Android)
4. Test full flow: Signup → AddLocation → Welcome
5. Verify token persistence (close/reopen app)

## 📞 Support

For detailed setup instructions, see [SETUP_AND_TESTING.md](SETUP_AND_TESTING.md)

---

**Built with React Native + Node.js + MySQL**
