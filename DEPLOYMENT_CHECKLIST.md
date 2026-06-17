# Deployment Readiness Checklist

## ✅ FRONTEND - READY FOR DEPLOYMENT

### Configuration Status:

| File | Setting | Status | Notes |
|------|---------|--------|-------|
| **app.config.js** | Production URL | ✅ READY | `https://greenfieldsupermarket.com/mobile-api/backend` |
| **app.config.js** | Google Web Client ID | ✅ READY | `969529169540-vkaojfsqj9n4167e0a2cbahlh5ogkn8v.apps.googleusercontent.com` |
| **axiosConfig.js** | Production URL Fallback | ✅ FIXED | Now uses correct production path |
| **axiosConfig.js** | FORCE_PRODUCTION | ✅ SET TO FALSE | For local development |
| **eas.json** | Build profiles | ✅ READY | Preview & Production configured |

### ✅ Your Frontend is 100% Ready!

When you build the APK, it will **automatically** use:
- Production URL: `https://greenfieldsupermarket.com/mobile-api/backend`
- Google Sign-In: Web Client ID from .env

**No changes needed to frontend code before building APK!**

---

## ⚠️ BACKEND - NEEDS DEPLOYMENT

### What Needs to Be Done:

#### 1. Upload Backend to Production Server

Upload these folders to: `greenfieldsupermarket.com/public_html/mobile-api/`

```
backend/
├── admin/
│   ├── includes/db_settings.php  (⚠️ Update DB credentials)
│   └── upload/
│       ├── dow/         (✅ All product images - 1,918 active)
│       └── stores/      (✅ All category images)
├── api/
│   ├── login.php
│   ├── register.php
│   ├── google-login.php
│   ├── verify-email.php
│   ├── forgot-password.php
│   ├── products.php
│   └── (all other API files)
└── helpers/
    ├── email.php
    └── logger.php
```

#### 2. Update Production Database Config

**File:** `/public_html/mobile-api/backend/admin/includes/db_settings.php`

```php
<?php
$db_host = "localhost";
$db_user = "greenfieldsuperm_user";
$db_pass = "Samikhan123###";
$db_name = "greenfieldsuperm_db";

$con = mysqli_connect($db_host, $db_user, $db_pass, $db_name);
if ($con->connect_error) {
    die('Connect Error: '. mysqli_connect_error());
}
mysqli_set_charset($con, 'utf8mb4');
?>
```

#### 3. Verify Database Tables

Make sure production database has:
- [x] `users` table
- [x] `dow` table (products)
- [x] `brands` table
- [x] `categories` table
- [x] `password_resets` table

#### 4. Test Production APIs

```bash
# Test products API
curl https://greenfieldsupermarket.com/mobile-api/backend/api/products.php?limit=5

# Test image accessibility
curl -I https://greenfieldsupermarket.com/mobile-api/backend/admin/upload/dow/green-chilies.webp
```

**Expected:** All return HTTP 200 OK

---

## ⚠️ GOOGLE SIGN-IN - NEEDS CONFIGURATION

### Update Google Cloud Console

Visit: https://console.cloud.google.com/apis/credentials

**Add to Authorized Redirect URIs:**
```
https://greenfieldsupermarket.com
https://greenfieldsupermarket.com/mobile-api/backend/api/google-login.php
```

**Add to Authorized JavaScript Origins:**
```
https://greenfieldsupermarket.com
```

---

## 📱 BUILD APK - READY TO GO

### Your Current Build Configuration:

**EAS Build Profiles (eas.json):**

```json
{
  "build": {
    "preview": {
      "android": { "buildType": "apk" }  // For testing
    },
    "production": {
      "android": { "buildType": "app-bundle" }  // For Play Store
    }
  }
}
```

### Build Commands:

**For Testing (APK):**
```bash
cd frontend
npx eas build --platform android --profile preview
```

**For Play Store (AAB):**
```bash
cd frontend
npx eas build --platform android --profile production
```

---

## 🔄 DEPLOYMENT WORKFLOW

### RECOMMENDED: Deploy Backend First

```
1. Upload backend to production server
   ↓
2. Test production APIs
   ↓
3. Update Google Cloud Console
   ↓
4. Build APK with: npx eas build --platform android --profile preview
   ↓
5. Download & test APK on device
```

### WHY Deploy Backend First?

- ✅ APK will connect to production (not local server)
- ✅ Google Sign-In will work (requires public URL)
- ✅ Test with real production environment
- ✅ Share APK with testers anywhere

---

## 📝 CURRENT STATUS SUMMARY

### ✅ READY:
- [x] Frontend code is production-ready
- [x] Production URL configured in app.config.js
- [x] Google Web Client ID configured
- [x] Build profiles configured in eas.json
- [x] All product images exist and verified
- [x] Test products hidden from database
- [x] Image mismatches fixed

### ⚠️ TODO BEFORE APK BUILD:
- [ ] Upload backend to production server
- [ ] Update db_settings.php with production credentials
- [ ] Test all production API endpoints
- [ ] Add production URLs to Google Cloud Console
- [ ] Verify SSL certificate is active (HTTPS)

---

## 🚀 QUICK START - BUILD APK NOW

If you want to **skip deployment** and test locally first:

1. **Keep backend running locally** (http://192.168.100.176:8000)
2. **Build APK** but it will only work on your WiFi network
3. **Google Sign-In won't work** (requires public URL)

**Command:**
```bash
cd frontend
npx eas build --platform android --profile preview
```

**But this is NOT recommended** because:
- Testers need to be on your WiFi
- Google Sign-In will fail
- Not a real-world test

---

## 📊 CONFIGURATION COMPARISON

| Mode | URL | Used By | Google Sign-In |
|------|-----|---------|----------------|
| **Local Dev** | `http://192.168.100.176:8000` | Expo Dev Client | ❌ Won't work |
| **Production APK** | `https://greenfieldsupermarket.com/mobile-api/backend` | Built APK | ✅ Will work |

---

## ✅ FINAL ANSWER TO YOUR QUESTION:

### "Is everything ready for deployment?"

**Frontend:** ✅ YES - 100% Ready
- All URLs configured correctly
- Will automatically use production when building APK

**Backend:** ⚠️ NO - Needs Deployment
- Must upload to production server first
- Must update database credentials

**Google Sign-In:** ⚠️ NO - Needs Setup
- Must add production URLs to Google Cloud Console

### What to do NOW:

**Option 1: Full Production Deployment (RECOMMENDED)**
1. Deploy backend → Update Google Console → Build APK → Test everything

**Option 2: Quick Test (Limited)**
1. Build APK now → Only works on your WiFi → Google Sign-In fails

---

## 💡 RECOMMENDATION

**Deploy backend first, then build APK.**

This ensures:
- ✅ APK works anywhere (not just your WiFi)
- ✅ Google Sign-In works
- ✅ Real production testing
- ✅ Can share with testers

**Total time:** ~30 minutes to deploy + ~20 minutes for EAS build = 50 minutes

---

## 📞 NEED HELP?

See `DEPLOYMENT_GUIDE.md` for detailed step-by-step instructions.

Ready to deploy? 🚀
