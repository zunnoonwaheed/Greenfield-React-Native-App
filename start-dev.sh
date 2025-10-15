#!/bin/bash

# Greenfield Development Startup Script
# This script starts both backend and frontend servers

echo "🚀 Starting Greenfield Development Environment..."
echo ""

# Check if backend dependencies are installed
if [ ! -d "greenfield-backend/node_modules" ]; then
  echo "📦 Installing backend dependencies..."
  cd greenfield-backend
  npm install
  cd ..
fi

# Check if frontend dependencies are installed
if [ ! -d "node_modules" ]; then
  echo "📦 Installing frontend dependencies..."
  npm install
fi

# Check if MySQL is running
echo "🔍 Checking MySQL connection..."
if ! command -v mysql &> /dev/null; then
  echo "❌ MySQL not found. Please install MySQL first."
  exit 1
fi

# Check if database exists
DB_EXISTS=$(mysql -u root -e "SHOW DATABASES LIKE 'greenfieldsuperm_db_local';" 2>/dev/null | grep greenfieldsuperm_db_local)

if [ -z "$DB_EXISTS" ]; then
  echo "⚠️  Database 'greenfieldsuperm_db_local' not found."
  read -p "Would you like to create and seed it now? (y/n) " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "📊 Creating database..."
    mysql -u root -e "CREATE DATABASE greenfieldsuperm_db_local;"

    echo "📥 Importing schema..."
    mysql -u root greenfieldsuperm_db_local < greenfield-backend/models/local_backup.sql

    echo "🌱 Seeding test data..."
    cd greenfield-backend
    node seed.js
    cd ..

    echo "✅ Database setup complete!"
  else
    echo "❌ Database required to continue. Exiting."
    exit 1
  fi
else
  echo "✅ Database found"
fi

# Check if port 5000 is available
if lsof -Pi :5000 -sTCP:LISTEN -t >/dev/null 2>&1; then
  echo "⚠️  Port 5000 is already in use"
  echo "   Please stop the process or change PORT in .env"
  exit 1
fi

echo ""
echo "✨ Starting servers..."
echo ""
echo "📍 Backend will run on: http://localhost:5000"
echo "📍 Frontend will run on: http://localhost:19006 (Expo DevTools)"
echo ""
echo "Press Ctrl+C to stop all servers"
echo ""
echo "================================"
echo ""

# Function to cleanup on exit
cleanup() {
  echo ""
  echo "🛑 Stopping servers..."
  kill $BACKEND_PID 2>/dev/null
  kill $FRONTEND_PID 2>/dev/null
  echo "✅ Servers stopped"
  exit 0
}

# Trap Ctrl+C
trap cleanup INT TERM

# Start backend in background
echo "🔧 Starting backend server..."
cd greenfield-backend
npm run dev &
BACKEND_PID=$!
cd ..

# Wait a bit for backend to start
sleep 3

# Check if backend started successfully
if ! kill -0 $BACKEND_PID 2>/dev/null; then
  echo "❌ Failed to start backend server"
  exit 1
fi

echo "✅ Backend server running (PID: $BACKEND_PID)"
echo ""

# Start frontend
echo "📱 Starting Expo development server..."
echo ""
npx expo start

# If we reach here, user stopped Expo manually
cleanup
