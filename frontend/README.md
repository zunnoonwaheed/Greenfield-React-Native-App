# 🌿 Greenfield - Expo + Express on Vercel

A full-stack TypeScript project with:
- **React Native mobile/web app** (Expo) in `/app`
- **Express REST API** (deployed on Vercel) in `/api`
- **PostgreSQL database** connection example

## 📁 Project Structure

```
greenfield/
├── app/                    # Expo React Native application
│   ├── App.tsx            # Main app component
│   ├── package.json       # App dependencies
│   ├── tsconfig.json      # TypeScript config
│   └── app.json           # Expo configuration
├── api/                    # Express API backend
│   ├── index.ts           # Express server entry point
│   ├── hello.ts           # Example API endpoints
│   ├── db.ts              # PostgreSQL connection
│   ├── package.json       # API dependencies
│   └── tsconfig.json      # TypeScript config
├── package.json            # Root workspace scripts
├── vercel.json            # Vercel deployment config
└── README.md              # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js 20+ and npm
- PostgreSQL database (local or hosted)
- Expo CLI (optional, installed automatically)
- Vercel CLI (for deployment): `npm i -g vercel`

### Installation

1. **Clone and install dependencies:**
   ```bash
   npm run install:all
   ```

   Or manually:
   ```bash
   npm install
   cd app && npm install
   cd ../api && npm install
   ```

2. **Configure environment variables:**

   **API** (`/api/.env`):
   ```bash
   cd api
   cp .env.example .env
   # Edit .env with your database credentials
   ```

   **App** (`/app/.env`):
   ```bash
   cd app
   cp .env.example .env
   # Update API_URL if needed
   ```

3. **Start development servers:**

   **Option 1 - Both servers together:**
   ```bash
   npm run dev
   ```

   **Option 2 - Separate terminals:**
   ```bash
   # Terminal 1 - API Server
   npm run dev:api

   # Terminal 2 - Expo App
   npm run dev:app
   ```

4. **Open the app:**
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Press `w` for web browser
   - Scan QR code with Expo Go app on physical device

## 🔌 API Endpoints

Base URL: `http://localhost:5000/api` (development)

| Method | Endpoint              | Description                |
|--------|----------------------|----------------------------|
| GET    | `/api`               | Health check               |
| GET    | `/api/hello`         | Simple hello world         |
| GET    | `/api/hello/:name`   | Personalized greeting      |
| POST   | `/api/hello`         | Echo posted message        |
| GET    | `/api/hello/db/test` | Test database connection   |

### Example API Requests

```bash
# Health check
curl http://localhost:5000/api

# Hello endpoint
curl http://localhost:5000/api/hello

# Personalized greeting
curl http://localhost:5000/api/hello/John

# POST request
curl -X POST http://localhost:5000/api/hello \
  -H "Content-Type: application/json" \
  -d '{"message":"Hello from curl"}'

# Database test
curl http://localhost:5000/api/hello/db/test
```

## 🗄️ Database Setup

### Local PostgreSQL

1. **Install PostgreSQL** (if not installed):
   ```bash
   # macOS
   brew install postgresql
   brew services start postgresql

   # Ubuntu/Debian
   sudo apt-get install postgresql
   sudo service postgresql start
   ```

2. **Create database:**
   ```bash
   createdb greenfield
   ```

3. **Update `/api/.env`:**
   ```env
   POSTGRES_USER=postgres
   POSTGRES_PASSWORD=your_password
   POSTGRES_HOST=localhost
   POSTGRES_PORT=5432
   POSTGRES_DATABASE=greenfield
   ```

### Hosted PostgreSQL (Vercel/Neon/Supabase)

For production, use a hosted PostgreSQL service:

- **Vercel Postgres**: https://vercel.com/docs/storage/vercel-postgres
- **Neon**: https://neon.tech
- **Supabase**: https://supabase.com

Add connection string to Vercel environment variables:
```env
DATABASE_URL=postgresql://user:password@host:5432/database
```

## 🚢 Deployment

### Deploy API to Vercel

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   npm run deploy
   ```

4. **Set environment variables in Vercel:**
   - Go to your project settings on Vercel
   - Add environment variables (POSTGRES_USER, POSTGRES_PASSWORD, etc.)
   - Or use `vercel env add`

5. **Update app API URL:**
   Update `/app/App.tsx` line 16-24 to use your Vercel URL:
   ```typescript
   const API_URL = 'https://your-project.vercel.app/api';
   ```

### Deploy App

**Web**: Vercel will automatically build and deploy the web version if configured.

**Mobile**: Use EAS (Expo Application Services):
```bash
cd app
npx eas build --platform ios
npx eas build --platform android
```

## 📱 Platform-Specific API URLs

Update in `/app/App.tsx`:

```typescript
// iOS Simulator
http://localhost:5000/api

// Android Emulator
http://10.0.2.2:5000/api

// Physical Device (use your computer's IP)
http://192.168.1.100:5000/api

// Production
https://your-project.vercel.app/api
```

## 🛠️ Development

### Available Scripts

**Root:**
- `npm run dev` - Start both API and app
- `npm run dev:api` - Start API only
- `npm run dev:app` - Start Expo app only
- `npm run install:all` - Install all dependencies
- `npm run deploy` - Deploy to Vercel

**API (`/api`):**
- `npm run dev` - Development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Run production build
- `npm run type-check` - Check TypeScript types

**App (`/app`):**
- `npm start` - Start Expo development server
- `npm run android` - Open on Android
- `npm run ios` - Open on iOS
- `npm run web` - Open in web browser
- `npm run type-check` - Check TypeScript types

## 📝 Adding New API Endpoints

1. **Create route file** in `/api`:
   ```typescript
   // api/users.ts
   import { Router } from 'express';

   const router = Router();

   router.get('/', (req, res) => {
     res.json({ users: [] });
   });

   export default router;
   ```

2. **Register in** `/api/index.ts`:
   ```typescript
   import usersRouter from './users';
   app.use('/api/users', usersRouter);
   ```

## 🧪 Testing API Locally

Use the built-in test buttons in the Expo app or use curl/Postman:

```bash
# Test API health
curl http://localhost:5000/api

# Test hello endpoint
curl http://localhost:5000/api/hello

# Test database
curl http://localhost:5000/api/hello/db/test
```

## 🐛 Troubleshooting

### API not connecting from app

1. Make sure API server is running on port 5000
2. Check firewall settings
3. Verify API_URL in App.tsx matches your platform:
   - iOS: `http://localhost:5000/api`
   - Android: `http://10.0.2.2:5000/api`
   - Physical device: Use computer's local IP

### Database connection fails

1. Verify PostgreSQL is running: `pg_isready`
2. Check credentials in `/api/.env`
3. Test connection: `psql -U postgres -d greenfield`

### Vercel deployment fails

1. Check build logs in Vercel dashboard
2. Verify all environment variables are set
3. Make sure `vercel.json` is properly configured
4. Check Node.js version matches (20+)

## 📚 Tech Stack

- **Frontend**: React Native 0.76, Expo SDK 52, TypeScript 5.7
- **Backend**: Express 4.21, Node.js 20+, TypeScript 5.7
- **Database**: PostgreSQL 14+
- **Deployment**: Vercel (API), Expo (Mobile)
- **Tools**: Axios, pg (node-postgres), tsx/ts-node

## 📄 License

MIT

## 🤝 Contributing

Feel free to submit issues and pull requests!

---

Built with ❤️ using Expo and Express
