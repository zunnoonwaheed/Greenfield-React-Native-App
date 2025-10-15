#!/bin/bash

# Test Backend Connection Script
# This script verifies your backend is accessible from the network

echo "🔍 Greenfield Backend Connection Test"
echo "======================================"
echo ""

# Configuration
MAC_IP="192.168.100.216"
PORT="3001"
BASE_URL="http://${MAC_IP}:${PORT}"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "Configuration:"
echo "  Mac IP: ${MAC_IP}"
echo "  Port: ${PORT}"
echo "  Base URL: ${BASE_URL}"
echo ""

# Test 1: Check if backend is running locally
echo "Test 1: Checking if backend is running on localhost..."
if curl -s http://localhost:${PORT}/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Backend is running on localhost${NC}"
else
    echo -e "${RED}❌ Backend is NOT running on localhost${NC}"
    echo "   Start backend with: cd greenfield-backend && npm run dev"
    exit 1
fi
echo ""

# Test 2: Check if backend responds to health check
echo "Test 2: Testing health endpoint..."
HEALTH_RESPONSE=$(curl -s http://localhost:${PORT}/health)
if echo "$HEALTH_RESPONSE" | grep -q "success"; then
    echo -e "${GREEN}✅ Health endpoint working${NC}"
    echo "   Response: $HEALTH_RESPONSE"
else
    echo -e "${RED}❌ Health endpoint not responding correctly${NC}"
    exit 1
fi
echo ""

# Test 3: Check if backend is accessible via network IP
echo "Test 3: Testing network accessibility..."
if curl -s ${BASE_URL}/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Backend is accessible via network IP${NC}"
    echo "   Your phone should be able to connect"
else
    echo -e "${RED}❌ Backend is NOT accessible via network IP${NC}"
    echo "   Check firewall settings"
fi
echo ""

# Test 4: Verify current Mac IP
echo "Test 4: Verifying Mac IP address..."
CURRENT_IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -1)
if [ "$CURRENT_IP" == "$MAC_IP" ]; then
    echo -e "${GREEN}✅ IP address matches: ${CURRENT_IP}${NC}"
else
    echo -e "${YELLOW}⚠️  WARNING: IP address mismatch!${NC}"
    echo "   Expected: ${MAC_IP}"
    echo "   Actual:   ${CURRENT_IP}"
    echo ""
    echo "   Update api/axiosConfig.js with the correct IP:"
    echo "   const API_BASE_URL = 'http://${CURRENT_IP}:${PORT}/api';"
fi
echo ""

# Test 5: Check if port is in use
echo "Test 5: Checking if port ${PORT} is in use..."
if lsof -Pi :${PORT} -sTCP:LISTEN -t >/dev/null; then
    PROCESS=$(lsof -Pi :${PORT} -sTCP:LISTEN | grep LISTEN | awk '{print $1}')
    echo -e "${GREEN}✅ Port ${PORT} is in use by: ${PROCESS}${NC}"
else
    echo -e "${RED}❌ Port ${PORT} is NOT in use${NC}"
    echo "   Backend may not be running"
fi
echo ""

# Test 6: Test API endpoint
echo "Test 6: Testing API root endpoint..."
API_RESPONSE=$(curl -s ${BASE_URL}/api)
if echo "$API_RESPONSE" | grep -q "Greenfield"; then
    echo -e "${GREEN}✅ API root endpoint working${NC}"
    echo "   Response: $API_RESPONSE"
else
    echo -e "${YELLOW}⚠️  API root endpoint not responding as expected${NC}"
fi
echo ""

# Test 7: Check CORS configuration
echo "Test 7: Checking CORS configuration..."
if grep -q "192.168.100.216" greenfield-backend/.env; then
    echo -e "${GREEN}✅ CORS configured with your IP${NC}"
else
    echo -e "${YELLOW}⚠️  CORS may not include your IP${NC}"
    echo "   Check greenfield-backend/.env CORS_ORIGIN setting"
fi
echo ""

# Summary
echo "======================================"
echo "Summary"
echo "======================================"
echo ""
echo "To test from your phone's browser, open:"
echo -e "${YELLOW}${BASE_URL}/health${NC}"
echo ""
echo "Expected response:"
echo '{"success":true,"message":"Server is running","timestamp":"..."}'
echo ""
echo "If you can see this in your phone's browser, the API integration should work!"
echo ""
echo "Next steps:"
echo "1. Ensure phone is on same Wi-Fi as Mac"
echo "2. Clear Expo cache: npx expo start -c"
echo "3. Open app on phone via Expo Go"
echo "4. Test signup/login functionality"
echo ""
