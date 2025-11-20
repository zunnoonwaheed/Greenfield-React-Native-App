@echo off
REM Greenfield Development Startup Script for Windows
REM This script starts both backend and frontend servers

echo.
echo 🚀 Starting Greenfield Development Environment...
echo.

REM Check if backend dependencies are installed
if not exist "greenfield-backend\node_modules\" (
  echo 📦 Installing backend dependencies...
  cd greenfield-backend
  call npm install
  cd ..
)

REM Check if frontend dependencies are installed
if not exist "node_modules\" (
  echo 📦 Installing frontend dependencies...
  call npm install
)

REM Check if MySQL is accessible
echo 🔍 Checking MySQL connection...
mysql --version >nul 2>&1
if errorlevel 1 (
  echo ❌ MySQL not found. Please install MySQL first.
  pause
  exit /b 1
)

echo.
echo ✨ Starting servers...
echo.
echo 📍 Backend will run on: http://localhost:5000
echo 📍 Frontend will run on: http://localhost:19006 (Expo DevTools)
echo.
echo Press Ctrl+C to stop all servers
echo.
echo ================================
echo.

REM Start backend in new window
echo 🔧 Starting backend server...
start "Greenfield Backend" cmd /k "cd greenfield-backend && npm run dev"

REM Wait for backend to start
timeout /t 3 /nobreak >nul

echo ✅ Backend server starting...
echo.

REM Start frontend
echo 📱 Starting Expo development server...
echo.
call npx expo start

REM If we reach here, user stopped Expo
echo.
echo 🛑 Frontend stopped
echo 💡 Close the backend window to stop the backend server
echo.
pause
