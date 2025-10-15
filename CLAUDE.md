# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Greenfield is a React Native mobile application built with Expo, featuring location-based functionality and user authentication. The project consists of:

- **Frontend**: React Native app (Expo) with TypeScript
- **Backend**: Node.js/Express REST API with MySQL database

## Development Commands

### Frontend (React Native/Expo)

```bash
# Start Expo development server
npm start

# Run on specific platform
npm run android
npm run ios
npm run web
```

### Backend (Node.js/Express)

```bash
cd greenfield-backend

# Start production server
npm start

# Start development server with auto-reload
npm run dev
```

## Architecture

### Project Structure

```
/
├── App.tsx                    # Root navigation setup
├── screens/                   # React Native screen components
│   ├── LocationPermissionScreen.tsx
│   ├── LoginScreen.tsx
│   ├── ForgotPasswordScreen.tsx
│   ├── ResetPasswordScreen.tsx
│   ├── SignUpScreen.tsx
│   ├── WelcomeScreen.tsx
│   └── AddLocationScreen.tsx
├── api/                       # Frontend API client modules
│   ├── axiosConfig.js         # Axios instance with interceptors
│   ├── authAPI.js
│   ├── locationAPI.js
│   └── userAPI.js
└── greenfield-backend/        # Backend server
    ├── server.js              # Express server entry point
    ├── config/
    │   └── database.js        # MySQL connection pool
    ├── routes/                # Express route definitions
    │   ├── authRoutes.js
    │   ├── userRoutes.js
    │   └── locationRoutes.js
    ├── controllers/           # Route handler logic
    │   ├── authController.js
    │   ├── userController.js
    │   └── locationController.js
    ├── middleware/
    │   └── authMiddleware.js  # JWT authentication
    ├── models/
    │   ├── local_backup.sql   # Core database schema (use this)
    │   └── queries.sql        # Legacy production dump (ignore)
    └── seed.js                # Database seeding script

```

### Frontend Architecture

**Navigation**: React Navigation v7 with Stack Navigator
- Type-safe navigation using `RootStackParamList`
- Navigation is configured in `App.tsx`
- Initial route: `LocationPermissionScreen`

**API Communication**:
- Centralized Axios configuration in `api/axiosConfig.js`
- Request interceptor auto-adds JWT token from AsyncStorage to Authorization header
- Response interceptor:
  - Handles common errors (401, 403, 404, 500)
  - On 401 responses, automatically clears auth token and user data
  - Returns `response.data` directly (not full response object)
- API modules in `api/`:
  - `authAPI.js` - Login, signup, password reset (auto-stores tokens)
  - `userAPI.js` - User profile and account management
  - `locationAPI.js` - User delivery addresses
- API base URL (auto-detected by platform):
  - iOS Simulator: `http://127.0.0.1:5000/api`
  - Android Emulator: `http://10.0.2.2:5000/api`
  - Physical device: Uncomment and set your IP in `api/axiosConfig.js:31` (e.g., `http://192.168.1.100:5000/api`)

**State Management**:
- AsyncStorage for persistent auth token and user data
- Helper functions in `axiosConfig.js`: `setAuthToken()`, `getAuthToken()`, `removeAuthToken()`, `setUserData()`, `getUserData()`

### Backend Architecture

**Server Setup**:
- Express 5.x server on port 5000 (configurable via `PORT` env var)
- MySQL 2 database connection pool
- CORS enabled for all origins (configure for production)
- Request logging middleware logs all requests with timestamp

**Database Connection**:
- Connection pool configured in `config/database.js`
- Helper function `query()` for executing SQL with automatic error logging
- Supports transactions via `getConnection()`
- Graceful shutdown handling on SIGTERM/SIGINT
- Connection test on startup

**Authentication Flow**:
1. User signup/login returns JWT token (default 7d expiry)
2. Token stored in AsyncStorage on mobile app
3. Protected routes use `authenticateToken` middleware
4. Middleware verifies JWT and attaches user info to `req.user`
5. Password reset flow uses temporary tokens in `password_resets` table

**API Structure**:
- All routes follow REST conventions
- Controllers handle business logic and database queries
- Routes in `routes/` define endpoints and validation
- express-validator used for input validation

### API Endpoints

**Authentication** (`/api/auth/*`):
- `POST /signup` - Register new user
- `POST /login` - Authenticate user
- `POST /forgot-password` - Request password reset token
- `POST /reset-password` - Reset password with token
- `POST /logout` - Client-side logout

**User** (`/api/user/*`) - All protected routes:
- `GET /profile` - Get user profile
- `PUT /profile` - Update user profile
- `POST /change-password` - Change password
- `DELETE /account` - Delete account

**Location** (`/api/location/*`) - All protected routes:
- `POST /add` - Add new delivery address for user
- `GET /list` - List all user's delivery addresses
- `GET /default` - Get user's default delivery address
- `PUT /set-default/:id` - Set a delivery address as default
- `PUT /update/:id` - Update a delivery address
- `DELETE /delete/:id` - Delete a delivery address

Note: "Locations" here refer to user delivery addresses stored in `user_locations` table, not the DHA phases/sectors in the `locations` table.

## Environment Configuration

### Backend `.env` (greenfield-backend/)

Required environment variables:
```
DB_HOST=localhost
DB_PORT=3306
DB_NAME=greenfieldsuperm_db_local
DB_USER=root
DB_PASSWORD=

JWT_SECRET=your-secret-key
JWT_EXPIRE=7d

NODE_ENV=development
PORT=3000
```

### Frontend `.env`

```
PUBLIC_BUILDER_KEY=<key>
```

## Database

### Database Setup

- Database engine: MySQL (compatible with MySQL 8.0+)
- Core schema: `greenfield-backend/models/local_backup.sql` (actual schema for the app)
- Main tables used by the app:
  - `users` - User accounts with authentication
  - `user_locations` - User delivery addresses (multiple per user, has `is_default` flag)
  - `locations` - DHA phases and sectors (hierarchical with `parent_id`, used for address selection)
  - `password_resets` - Temporary password reset tokens (24h expiry)
  - `brands` - Product brands (for future product catalog)

**Note**: `queries.sql` is a large database dump from production and is not used by the app.

### Seeding Data

Run the seed script to populate initial data:
```bash
cd greenfield-backend
node seed.js
```

This creates:
- DHA Phase 2, 5, and Canyon Views locations with sectors
- Test users: `admin@greenfield.com` / `admin123` and `customer@test.com` / `test123`
- Sample brands

The seed script automatically creates tables if they don't exist and clears existing data.

## Key Implementation Details

**JWT Token Structure**:
```javascript
{
  id: userId,
  email: user.email,
  name: user.name
}
```

**Protected Route Pattern**:
```javascript
router.get('/profile', authenticateToken, controller.getProfile);
```
The `authenticateToken` middleware populates `req.user` with decoded JWT data.

**Password Reset Flow**:
1. User requests reset via email
2. Server generates crypto token, stores in `password_resets` table with 24h expiry
3. Token sent to user (in development, returned in response)
4. User submits token + new password
5. Server validates token, updates password, deletes token

**Mobile API Base URL**:
- Development (emulator): `http://localhost:3000/api`
- Development (physical device): `http://<YOUR_IP>:3000/api`
- Configure in `api/axiosConfig.js` line 10

## Common Modifications

**Adding a new protected route**:
1. Define route in `routes/` file with `authenticateToken` middleware
2. Create controller function in `controllers/`
3. Access authenticated user via `req.user.id`, `req.user.email`, `req.user.name`

**Adding a new screen**:
1. Create screen component in `screens/`
2. Add route type to `RootStackParamList` in `App.tsx`
3. Add `Stack.Screen` to navigator in `App.tsx`

**Adding a new API endpoint to frontend**:
1. Create/update API module in `api/` (e.g., `userAPI.js`)
2. Import and use `axiosInstance` from `api/axiosConfig.js`
3. Token is automatically added by request interceptor
4. Response interceptor returns `response.data` directly

**Database queries**:
- Use parameterized queries via `query(sql, params)` helper
- Never concatenate user input into SQL strings
- For transactions, use `getConnection()` and manually manage connection

## Development Workflow

### Initial Setup

1. **Install dependencies**:
   ```bash
   # Frontend
   npm install

   # Backend
   cd greenfield-backend
   npm install
   ```

2. **Configure environment**:
   - Create `greenfield-backend/.env` with database credentials and JWT secret
   - Ensure MySQL is running and database exists

3. **Setup database**:
   ```bash
   # Import schema
   mysql -u root -p greenfieldsuperm_db_local < greenfield-backend/models/local_backup.sql

   # Or seed with test data
   cd greenfield-backend
   node seed.js
   ```

4. **Start servers**:
   ```bash
   # Terminal 1 - Backend
   cd greenfield-backend
   npm run dev

   # Terminal 2 - Frontend
   npm start
   ```

### Development Notes

- Frontend uses Expo new architecture (`newArchEnabled: true`)
- Backend logs all queries in debug mode (`LOG_LEVEL=debug`)
- Password reset tokens shown in dev response for testing
- CORS currently allows all origins - restrict in production
- For physical device testing, update API base URL in `api/axiosConfig.js:10` to your computer's IP
