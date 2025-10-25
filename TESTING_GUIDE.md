# Testing Guide - Greenfield App

## Overview

This guide provides instructions for testing the Greenfield React Native application with the Node.js/Express backend and MySQL database.

## Prerequisites

- Node.js (v14+)
- MySQL (v8.0+)
- Expo CLI
- iOS Simulator or Android Emulator (or physical device)
- Postman (for API testing)

## Backend Setup

### 1. Database Setup

```bash
# Login to MySQL
mysql -u root -p

# Create database
CREATE DATABASE greenfieldsuperm_db_local;

# Import schema
mysql -u root -p greenfieldsuperm_db_local < greenfield-backend/models/local_backup.sql

# Or use the seed script
cd greenfield-backend
node seed.js
```

### 2. Backend Configuration

Create `greenfield-backend/.env`:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=greenfieldsuperm_db_local
DB_USER=root
DB_PASSWORD=

JWT_SECRET=greenfield_secret_key_2025
JWT_EXPIRE=7d

NODE_ENV=development
BASE_URL=http://localhost:5000
```

### 3. Start Backend Server

```bash
cd greenfield-backend
npm install
npm run dev
```

Server runs on http://localhost:5000

## Frontend Setup

### 1. Frontend Configuration

Update `.env` in project root:

```env
PUBLIC_BUILDER_KEY=3566a803d6b74837818bc68a548b28d8
BASE_URL=http://localhost:5000
API_TIMEOUT=10000
```

### 2. Update API Base URL for Device Testing

Edit `api/axiosConfig.js` line 10-31:

- **iOS Simulator**: `http://127.0.0.1:5000/api` (default)
- **Android Emulator**: `http://10.0.2.2:5000/api`
- **Physical Device**: `http://<YOUR_IP>:5000/api` (find your IP with `ipconfig` or `ifconfig`)

### 3. Start Frontend

```bash
npm install
npm start
```

Press `i` for iOS or `a` for Android

## API Testing with Postman

### Authentication Endpoints

**1. Sign Up**
```
POST http://localhost:5000/api/auth/signup
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@test.com",
  "password": "password123",
  "phone": "03001234567"
}
```

**2. Login**
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "test@test.com",
  "password": "password123"
}
```

Response includes JWT token - copy this for protected routes

**3. Forgot Password**
```
POST http://localhost:5000/api/auth/forgot-password
Content-Type: application/json

{
  "email": "test@test.com"
}
```

**4. Reset Password**
```
POST http://localhost:5000/api/auth/reset-password
Content-Type: application/json

{
  "token": "<reset_token_from_email>",
  "newPassword": "newpassword123"
}
```

### Product Endpoints

**1. Get All Products**
```
GET http://localhost:5000/api/products
```

With filters:
```
GET http://localhost:5000/api/products?category_id=1&brand_id=2&min_price=50&max_price=500&limit=20
```

**2. Search Products**
```
GET http://localhost:5000/api/products/search?query=vegetables
```

**3. Get Product by ID**
```
GET http://localhost:5000/api/products/id/1
```

**4. Get Product by Slug**
```
GET http://localhost:5000/api/products/fresh-tomatoes
```

**5. Get Featured Products**
```
GET http://localhost:5000/api/products/featured
```

**6. Get Bundle Products**
```
GET http://localhost:5000/api/products/bundles
```

**7. Get Products by Category**
```
GET http://localhost:5000/api/products/category/1
```

### Category Endpoints

**1. Get All Categories**
```
GET http://localhost:5000/api/categories
```

**2. Get Category by ID**
```
GET http://localhost:5000/api/categories/id/1
```

**3. Get Category by Slug**
```
GET http://localhost:5000/api/categories/vegetables
```

**4. Get Subcategories**
```
GET http://localhost:5000/api/categories/1/subcategories
```

**5. Filter Products**
```
POST http://localhost:5000/api/categories/filter
Content-Type: application/json

{
  "category_id": 1,
  "brand_id": 2,
  "min_price": 100,
  "max_price": 1000,
  "search": "organic"
}
```

### Order Endpoints (Protected - Requires JWT)

Add Authorization header to all order requests:
```
Authorization: Bearer <your_jwt_token>
```

**1. Create Order**
```
POST http://localhost:5000/api/orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "delivery_address": "123 Main St, DHA Phase 5",
  "delivery_charges": 50,
  "discount_amount": 20,
  "payment_method": "cod",
  "items": [
    {
      "product_id": 1,
      "quantity": 2,
      "price": 150
    },
    {
      "product_id": 3,
      "quantity": 1,
      "price": 300
    }
  ]
}
```

**2. Get My Orders**
```
GET http://localhost:5000/api/orders/my-orders
Authorization: Bearer <token>
```

**3. Get Order Details**
```
GET http://localhost:5000/api/orders/1
Authorization: Bearer <token>
```

**4. Track Order**
```
GET http://localhost:5000/api/orders/1/track
Authorization: Bearer <token>
```

**5. Update Order Status**
```
PUT http://localhost:5000/api/orders/1/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "delivered"
}
```

### Location Endpoints (Protected - Requires JWT)

**1. Add Location**
```
POST http://localhost:5000/api/location/add
Authorization: Bearer <token>
Content-Type: application/json

{
  "location_id": 5,
  "address": "House 123, Street 45",
  "is_default": true
}
```

**2. List Locations**
```
GET http://localhost:5000/api/location/list
Authorization: Bearer <token>
```

**3. Get Default Location**
```
GET http://localhost:5000/api/location/default
Authorization: Bearer <token>
```

**4. Set Default Location**
```
PUT http://localhost:5000/api/location/set-default/2
Authorization: Bearer <token>
```

**5. Update Location**
```
PUT http://localhost:5000/api/location/update/2
Authorization: Bearer <token>
Content-Type: application/json

{
  "address": "Updated House 456, Street 78"
}
```

**6. Delete Location**
```
DELETE http://localhost:5000/api/location/delete/2
Authorization: Bearer <token>
```

### User Endpoints (Protected - Requires JWT)

**1. Get Profile**
```
GET http://localhost:5000/api/user/profile
Authorization: Bearer <token>
```

**2. Update Profile**
```
PUT http://localhost:5000/api/user/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Updated Name",
  "phone": "03009999999"
}
```

**3. Change Password**
```
POST http://localhost:5000/api/user/change-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "password123",
  "newPassword": "newpassword456"
}
```

**4. Delete Account**
```
DELETE http://localhost:5000/api/user/account
Authorization: Bearer <token>
```

## Mobile App Testing

### Screens with API Integration

**1. ProductListingScreen**
- Test: Open the screen and verify products load from API
- Check: Loading spinner appears during fetch
- Check: Products display in grid with images, names, prices
- Check: Error state shows if API fails
- Check: Retry button works
- Test: Click product card to navigate to ProductDetail

**2. CategoriesScreen**
- Test: Navigate to Categories screen
- Check: Loading spinner appears
- Check: Categories load from API (with fallback to local data)
- Check: Category images and names display in grid
- Check: Error state shows if API fails
- Check: Retry button works
- Test: Click category to navigate to GroceryList

**3. GroceryScreen / GroceryListScreen**
- Test: Filter chips open FilterModalScreen
- Test: Product cards are clickable
- Test: Add to Cart button works (stops propagation)

**4. FilterModalScreen**
- Test: Modal slides from bottom with smooth animation
- Test: All filter sections are visible and scrollable
- Check: Price Range slider
- Check: Sort By options
- Check: Discount/Offers toggle
- Check: Ratings selector
- Check: Delivery/Pickup options
- Check: Brand/Seller dropdown
- Check: Packaging/Quantity options
- Test: Apply Filters closes modal
- Test: Clear All resets filters

### Common Issues and Solutions

**Issue: "Network Error" on mobile app**
- Solution: Update API base URL in `api/axiosConfig.js`:
  - iOS Simulator: `http://127.0.0.1:5000/api`
  - Android Emulator: `http://10.0.2.2:5000/api`
  - Physical Device: `http://<YOUR_IP>:5000/api`

**Issue: "Connection refused" error**
- Solution: Ensure backend server is running on port 5000
- Check: Run `lsof -i :5000` to verify

**Issue: JWT token not working**
- Solution: Check token is being stored in AsyncStorage
- Check: Token is included in Authorization header
- Verify: Token hasn't expired (default 7 days)

**Issue: Database connection errors**
- Solution: Verify MySQL is running
- Check: Database credentials in `.env`
- Test: Run `mysql -u root -p` to confirm access

**Issue: Images not loading**
- Solution: Ensure images exist in `images/` folders
- Check: Image paths match require() statements
- Fallback: API returns placeholder if image missing

## Testing Checklist

### Backend API Tests
- [ ] All authentication endpoints work
- [ ] JWT tokens are generated correctly
- [ ] Protected routes require valid tokens
- [ ] Product endpoints return correct data
- [ ] Category endpoints return correct data
- [ ] Order creation works with transactions
- [ ] Location CRUD operations work
- [ ] User profile operations work
- [ ] Error responses are consistent
- [ ] Database queries use parameterized statements

### Frontend Integration Tests
- [ ] ProductListingScreen loads products from API
- [ ] CategoriesScreen loads categories from API
- [ ] Loading states display correctly
- [ ] Error states show retry buttons
- [ ] Product cards navigate to detail screen
- [ ] Filter modal opens and closes smoothly
- [ ] All filter options are visible
- [ ] AsyncStorage stores auth tokens
- [ ] Axios interceptor adds tokens to requests
- [ ] 401 errors clear auth data

### End-to-End Tests
- [ ] User can sign up and login
- [ ] User can browse categories
- [ ] User can view products
- [ ] User can filter products
- [ ] User can add items to cart
- [ ] User can place orders
- [ ] User can manage delivery addresses
- [ ] User can view order history
- [ ] User can update profile
- [ ] User can change password

## Database Test Data

After running `seed.js`, test database contains:

**Users:**
- admin@greenfield.com / admin123 (Admin)
- customer@test.com / test123 (Customer)

**Locations:**
- DHA Phase 2, Phase 5, Canyon Views with sectors

**Brands:**
- Sample brands for product catalog

Add test products and orders as needed for testing.

## Debugging Tips

**Backend Logs:**
```bash
# View server logs in terminal where npm run dev is running
# All requests are logged with timestamps
# Database queries are logged when LOG_LEVEL=debug
```

**Frontend Logs:**
```bash
# View console in Expo terminal
# Check Chrome DevTools for network requests
# Use React Native Debugger for state inspection
```

**Database Queries:**
```bash
# Monitor MySQL queries
mysql> SHOW PROCESSLIST;

# Check recent queries
mysql> SELECT * FROM mysql.general_log;
```

## Next Steps

1. Populate database with real product data
2. Test all screens with API integration
3. Implement cart functionality
4. Add payment gateway integration
5. Setup push notifications
6. Configure production environment
7. Deploy backend to cloud server
8. Build and publish mobile app
