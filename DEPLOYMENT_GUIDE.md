# 🚀 Complete Deployment Guide

## 📁 Project Structure Overview

```
greenfield/
├── api/                          # Express Backend (Vercel Serverless)
│   ├── index.ts                 # Main API entry point
│   ├── hello.ts                 # Example routes
│   ├── db.ts                    # PostgreSQL connection
│   ├── package.json             # API dependencies
│   ├── tsconfig.json            # TypeScript config
│   └── .env.example             # Environment template
│
├── app/                          # Expo React Native (Local)
│   ├── App.tsx                  # Main app component
│   ├── api-client/              # Frontend API client files
│   ├── package.json             # App dependencies
│   ├── app.json                 # Expo configuration
│   ├── tsconfig.json            # TypeScript config
│   └── .env.example             # API URL config
│
├── package.json                  # Root workspace coordinator
├── vercel.json                   # Vercel deployment config
├── .vercelignore                 # Files to exclude from deployment
└── .gitignore                    # Git ignore rules
```

---

## 🎯 Part 1: Running Expo App Locally

### Step 1: Install Dependencies

```bash
# Install root dependencies
npm install

# Install API dependencies
cd api
npm install

# Install app dependencies
cd ../app
npm install
```

Or use the helper script:

```bash
npm run install:all
```

### Step 2: Start Expo Development Server

**Option A - Run from root:**
```bash
npm run dev:app
```

**Option B - Run from app folder:**
```bash
cd app
npm start
```

### Step 3: Open on Device

The Expo CLI will show a QR code. You can:

- **iOS Simulator**: Press `i`
- **Android Emulator**: Press `a`
- **Physical Device**: Scan QR code with Expo Go app
- **Web Browser**: Press `w`

### Step 4: Configure API URL (if needed)

Update `/app/App.tsx` lines 16-26:

```typescript
const getApiUrl = () => {
  if (Platform.OS === 'ios') {
    return 'http://localhost:5000/api'; // iOS Simulator
  } else if (Platform.OS === 'android') {
    return 'http://10.0.2.2:5000/api'; // Android Emulator
  } else {
    return 'http://localhost:5000/api'; // Web
  }
};
```

**For physical device**, use your computer's local IP:

```typescript
return 'http://192.168.1.100:5000/api'; // Replace with your IP
```

---

## 🌐 Part 2: Deploying API to Vercel

### Prerequisites

- Vercel account (free): https://vercel.com
- GitHub repository with your code
- PostgreSQL database (local or hosted)

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

### Step 3: Configure Environment Variables

Before deploying, set up your environment variables in Vercel:

**Option A - Via Vercel Dashboard:**

1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add the following:

```
POSTGRES_USER=your_user
POSTGRES_PASSWORD=your_password
POSTGRES_HOST=your_host
POSTGRES_PORT=5432
POSTGRES_DATABASE=greenfield
NODE_ENV=production
```

**Option B - Via CLI:**

```bash
vercel env add POSTGRES_USER
vercel env add POSTGRES_PASSWORD
vercel env add POSTGRES_HOST
vercel env add POSTGRES_PORT
vercel env add POSTGRES_DATABASE
```

### Step 4: Deploy to Vercel

**From root directory:**

```bash
vercel --prod
```

Or use the npm script:

```bash
npm run deploy
```

### Step 5: Verify Deployment

After deployment, Vercel will give you a URL like:

```
https://your-project-name.vercel.app
```

Test your endpoints:

```bash
# Health check
curl https://your-project-name.vercel.app/api

# Hello endpoint
curl https://your-project-name.vercel.app/api/hello

# Personalized greeting
curl https://your-project-name.vercel.app/api/hello/World
```

### Step 6: Update Expo App with Production URL

Edit `/app/App.tsx` line 16-26:

```typescript
const getApiUrl = () => {
  // Use production URL when not in development
  if (__DEV__) {
    if (Platform.OS === 'ios') {
      return 'http://localhost:5000/api';
    } else if (Platform.OS === 'android') {
      return 'http://10.0.2.2:5000/api';
    }
  }

  // Production Vercel URL
  return 'https://your-project-name.vercel.app/api';
};
```

---

## 🗄️ Part 3: Database Setup

### Local PostgreSQL

1. **Install PostgreSQL:**
   ```bash
   # macOS
   brew install postgresql
   brew services start postgresql

   # Ubuntu/Debian
   sudo apt-get install postgresql
   ```

2. **Create database:**
   ```bash
   createdb greenfield
   ```

3. **Create `.env` file in `/api`:**
   ```bash
   cd api
   cp .env.example .env
   ```

4. **Edit `.env` with your credentials:**
   ```env
   POSTGRES_USER=postgres
   POSTGRES_PASSWORD=your_password
   POSTGRES_HOST=localhost
   POSTGRES_PORT=5432
   POSTGRES_DATABASE=greenfield
   ```

### Production Database (Vercel)

For production, use a hosted PostgreSQL service:

- **Vercel Postgres**: https://vercel.com/docs/storage/vercel-postgres
- **Neon**: https://neon.tech (recommended - generous free tier)
- **Supabase**: https://supabase.com
- **Railway**: https://railway.app

Add connection details to Vercel environment variables as shown in Step 3 above.

---

## 🔧 Part 4: Development Workflow

### Run Both API and App Locally

**Terminal 1 - API Server:**
```bash
npm run dev:api
```

**Terminal 2 - Expo App:**
```bash
npm run dev:app
```

**Or run both concurrently:**
```bash
npm run dev
```

### Test API Endpoints Locally

```bash
# Health check
curl http://localhost:5000/api

# Hello endpoint
curl http://localhost:5000/api/hello

# Personalized greeting
curl http://localhost:5000/api/hello/Developer

# POST request
curl -X POST http://localhost:5000/api/hello \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello from curl"}'

# Database test
curl http://localhost:5000/api/hello/db/test
```

---

## 🐛 Troubleshooting

### Issue: `expo-export: command not found`

**Cause**: Vercel is trying to build Expo app
**Solution**: Ensure `vercel-build` script in root `package.json` is:

```json
"vercel-build": "echo 'Skipping root build - API builds separately'"
```

### Issue: `404: NOT_FOUND` on Vercel endpoints

**Cause**: Routes not configured properly
**Solution**: Verify `vercel.json`:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/index.ts",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/index.ts"
    }
  ]
}
```

### Issue: TypeScript errors about unused parameters

**Cause**: Strict TypeScript settings
**Solution**: Use `_req`, `_res`, `_next` prefixes for unused parameters:

```typescript
app.get('/api', (_req: Request, res: Response) => {
  res.json({ message: 'Hello' });
});
```

### Issue: Cannot connect to API from Expo app

**Cause**: Wrong API URL
**Solutions**:

- **iOS Simulator**: Use `http://localhost:5000/api`
- **Android Emulator**: Use `http://10.0.2.2:5000/api`
- **Physical Device**: Use your computer's IP `http://192.168.1.XXX:5000/api`
- **Production**: Use `https://your-project.vercel.app/api`

### Issue: Database connection fails on Vercel

**Cause**: Missing environment variables or SSL configuration
**Solutions**:

1. Verify all `POSTGRES_*` variables are set in Vercel
2. For hosted databases, ensure SSL is enabled in `/api/db.ts`:

```typescript
ssl: process.env.NODE_ENV === 'production' ? {
  rejectUnauthorized: false
} : false
```

---

## ✅ Deployment Checklist

### Before Deploying:

- [ ] All dependencies installed: `npm run install:all`
- [ ] API runs locally: `npm run dev:api`
- [ ] App runs locally: `npm run dev:app`
- [ ] Environment variables ready
- [ ] Code committed to Git
- [ ] Code pushed to GitHub

### During Deployment:

- [ ] Vercel CLI installed: `npm i -g vercel`
- [ ] Logged into Vercel: `vercel login`
- [ ] Environment variables added to Vercel
- [ ] Deploy command run: `npm run deploy`
- [ ] Deployment successful

### After Deployment:

- [ ] Test all API endpoints on Vercel URL
- [ ] Update Expo app with production URL
- [ ] Test Expo app with production API
- [ ] Database connection working
- [ ] Monitor Vercel logs for errors

---

## 📚 Quick Reference

### NPM Scripts

| Command | Description |
|---------|-------------|
| `npm run dev:app` | Start Expo development server |
| `npm run dev:api` | Start Express API locally |
| `npm run dev` | Run both app and API concurrently |
| `npm run install:all` | Install all dependencies |
| `npm run deploy` | Deploy to Vercel |

### API Endpoints (Production)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api` | GET | Health check |
| `/api/hello` | GET | Simple greeting |
| `/api/hello/:name` | GET | Personalized greeting |
| `/api/hello` | POST | Echo message |
| `/api/hello/db/test` | GET | Test database connection |

### File Locations

| What | Where |
|------|-------|
| API code | `/api/*.ts` |
| Expo app | `/app/App.tsx` |
| API dependencies | `/api/package.json` |
| App dependencies | `/app/package.json` |
| Vercel config | `/vercel.json` |
| API env vars | `/api/.env` |
| Frontend API client | `/app/api-client/` |

---

## 🎉 Success Criteria

Your setup is working correctly when:

✅ **Local Development:**
- API server starts without errors: `npm run dev:api`
- Expo app opens in Expo Go successfully
- App can make requests to local API
- Database queries work locally

✅ **Production Deployment:**
- Vercel deployment succeeds without build errors
- All `/api/*` endpoints return expected JSON responses
- No 404 errors on any routes
- Database connection works on Vercel
- Expo app can communicate with production API

---

## 📖 Additional Resources

- **Vercel Docs**: https://vercel.com/docs
- **Expo Docs**: https://docs.expo.dev
- **Express Docs**: https://expressjs.com
- **TypeScript Docs**: https://www.typescriptlang.org/docs
- **PostgreSQL Docs**: https://www.postgresql.org/docs

---

**Need help?** Check the troubleshooting section or review the example files in `/api` and `/app` folders.
