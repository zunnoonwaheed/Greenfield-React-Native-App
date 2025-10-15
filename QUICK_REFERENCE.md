# Quick Reference Card

## 🎯 Current Configuration

```
Mac IP:        192.168.100.216
Backend Port:  3001
API Base URL:  http://192.168.100.216:3001/api
Device:        Physical (same Wi-Fi)
```

---

## 🚀 Start Development

### 1-Line Command (Both Servers):
```bash
./start-dev.sh  # Mac/Linux
start-dev.bat   # Windows
```

### Manual (2 Terminals):

**Terminal 1 - Backend:**
```bash
cd greenfield-backend && npm run dev
```

**Terminal 2 - Frontend:**
```bash
npx expo start -c
```

---

## ✅ Quick Tests

### Test Backend:
```bash
./test-connection.sh
```

### Test from Phone Browser:
```
http://192.168.100.216:3001/health
```

Should show:
```json
{"success": true, "message": "Server is running"}
```

---

## 📱 Expo on Physical Device

1. Install **Expo Go** app
2. Ensure phone on same Wi-Fi as Mac
3. Run: `npx expo start -c`
4. Scan QR code

---

## 🔧 Common Commands

```bash
# Start backend (dev mode)
cd greenfield-backend && npm run dev

# Start frontend (clear cache)
npx expo start -c

# Test backend health
curl http://localhost:3001/health

# Check backend logs
cd greenfield-backend && npm run dev

# Seed database
cd greenfield-backend && node seed.js

# Check MySQL connection
mysql -u root -p greenfieldsuperm_db_local
```

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Network Error | 1. Check phone browser: `http://192.168.100.216:3001/health`<br>2. Run `./test-connection.sh`<br>3. Check both on same Wi-Fi |
| Backend won't start | 1. Check port: `lsof -i :3001`<br>2. Kill process: `kill -9 PID`<br>3. Restart: `npm run dev` |
| Database error | 1. Check MySQL running<br>2. Re-import: `mysql -u root -p greenfieldsuperm_db_local < models/local_backup.sql` |
| Expo cache issues | Run: `npx expo start -c` |
| Can't scan QR | Use tunnel mode: `npx expo start --tunnel` |

---

## 📂 Key Files

| File | Purpose |
|------|---------|
| `api/axiosConfig.js` | API base URL (line 29) |
| `greenfield-backend/.env` | Backend config (port, CORS) |
| `greenfield-backend/server.js` | Express server |
| `App.tsx` | Navigation setup |

---

## 🔐 Test Accounts

After running `node seed.js`:

```
Admin:
  Email: admin@greenfield.com
  Pass:  admin123

Customer:
  Email: customer@test.com
  Pass:  test123
```

---

## 📍 API Endpoints

Base: `http://192.168.100.216:3001/api`

### Auth:
- `POST /auth/signup` - Register
- `POST /auth/login` - Login
- `POST /auth/forgot-password` - Reset request
- `POST /auth/reset-password` - Reset with token

### User (Protected):
- `GET /user/profile` - Get profile
- `PUT /user/profile` - Update profile
- `POST /user/change-password` - Change password

### Location (Protected):
- `POST /location/add` - Add address
- `GET /location/list` - List all
- `GET /location/default` - Get default

---

## 🎨 Screen Flow

```
LocationPermission
    ↓
  Login ←→ SignUp
    ↓        ↓
Welcome  AddLocation
           ↓
       Welcome

Alt:
Login → ForgotPassword → ResetPassword → Login
```

---

## 🔄 When IP Changes

1. Find new IP: `ifconfig | grep "inet " | grep -v 127.0.0.1`
2. Update `api/axiosConfig.js` line 29
3. Update `greenfield-backend/.env` CORS_ORIGIN
4. Restart backend: `cd greenfield-backend && npm run dev`
5. Clear Expo cache: `npx expo start -c`

---

## 📊 Status Checks

### Backend is working:
- ✅ Console shows: `Server running on port 3001`
- ✅ `curl http://localhost:3001/health` returns success
- ✅ Phone browser can access `http://192.168.100.216:3001/health`

### Frontend is working:
- ✅ Expo starts without errors
- ✅ App loads on phone
- ✅ Console shows: `API Base URL: http://192.168.100.216:3001/api`

### Integration is working:
- ✅ Signup creates account
- ✅ Login returns token
- ✅ No "Network Error"
- ✅ Navigation works
- ✅ Data saves to database

---

## 💡 Pro Tips

- Keep backend logs visible while testing
- Use Expo's "Debug Remote JS" for better errors
- Test endpoints with Postman/curl first
- Check firewall allows port 3001
- Disable VPN on both devices
- Use `npx expo start -c` after config changes

---

## 🆘 Help

- **Setup Guide**: `PHYSICAL_DEVICE_SETUP.md`
- **Full Docs**: `SETUP_AND_TESTING.md`
- **API Tests**: `API_TESTS.http`
- **Implementation**: `IMPLEMENTATION_SUMMARY.md`

---

**Keep this file handy for quick reference! 🚀**
