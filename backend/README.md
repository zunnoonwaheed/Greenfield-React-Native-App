# Greenfield Supermarket - Backend API

Complete PHP REST API for the Greenfield mobile application.

## 🚀 Quick Start

### 1. Setup Database

```bash
# Create database
mysql -u root -p -e "CREATE DATABASE greenfield_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Import schema (creates all tables)
mysql -u root -p greenfield_db < schema.sql

# Import seed data (sample data for testing)
mysql -u root -p greenfield_db < seed.sql
```

### 2. Configure Database Connection

Edit `admin/includes/db_settings.php` with your credentials:
```php
$host = 'localhost';
$db = 'greenfield_db';
$user = 'root';
$pass = 'your_password';
```

### 3. Start Server

```bash
cd backend
php -S localhost:8000
```

### 4. Test API

```bash
# Test login
curl -X POST http://localhost:8000/login.php \
  -d "email=test@gmail.com&password=test123"

# Test products
curl http://localhost:8000/api/products.php
```

---

## 📋 What's New

### ✅ NEW Endpoints Created

All these endpoints are now fully functional:

**Account Management:**
- ✅ `POST /api/change-password.php` - Change password while logged in
- ✅ `POST /api/delete-account.php` - Delete user account

**Notifications (Complete System):**
- ✅ `GET /api/notifications.php` - Get notifications with pagination
- ✅ `POST /api/mark-notification-read.php` - Mark single as read
- ✅ `POST /api/mark-all-notifications-read.php` - Mark all as read
- ✅ `POST /api/delete-notification.php` - Delete notification
- ✅ `GET /api/notification-settings.php` - Get preferences
- ✅ `POST /api/update-notification-settings.php` - Update preferences

**Locations:**
- ✅ `GET /api/locations.php` - Get all phases with sectors
- ✅ `POST /api/validate-delivery.php` - Check delivery availability

### ✅ UPDATED Endpoints

**Enhanced existing endpoints:**
- ✅ `GET /api/notifications.php` - Now fully functional (was stub)
- ✅ `GET /api/bundles.php` - Added `?featured=true` support
- ✅ All endpoints use prepared statements (SQL injection fixed)

---

## 📁 Project Structure

```
backend/
├── api/                        # Main API endpoints
│   ├── login.php              # ✅ Auth
│   ├── register.php           # ✅ Auth
│   ├── logout.php             # ✅ Auth
│   ├── forgot-password.php    # ✅ Auth
│   ├── reset-password.php     # ✅ Auth
│   ├── profile.php            # ✅ User profile
│   ├── update-profile.php     # ✅ Update profile
│   ├── change-password.php    # ✅ NEW - Change password
│   ├── delete-account.php     # ✅ NEW - Delete account
│   ├── dashboard.php          # ✅ User dashboard
│   ├── notifications.php      # ✅ UPDATED - Full implementation
│   ├── mark-notification-read.php           # ✅ NEW
│   ├── mark-all-notifications-read.php      # ✅ NEW
│   ├── delete-notification.php              # ✅ NEW
│   ├── notification-settings.php            # ✅ NEW
│   ├── update-notification-settings.php     # ✅ NEW
│   ├── products.php           # ✅ Product listing
│   ├── product.php            # ✅ Product details
│   ├── categories.php         # ✅ Category listing
│   ├── category.php           # ✅ Category details
│   ├── bundles.php            # ✅ UPDATED - Featured support
│   ├── bundle.php             # ✅ Bundle details
│   ├── locations.php          # ✅ NEW - Phases & sectors
│   ├── update-delivery.php    # ✅ Update address
│   └── validate-delivery.php  # ✅ NEW - Validate location
│
├── cart-contents.php          # ✅ Cart
├── add-to-cart.php           # ✅ Cart
├── update-cart.php           # ✅ Cart
├── remove-from-cart.php      # ✅ Cart
├── clear-cart.php            # ✅ Cart
├── add-bundle-to-cart.php    # ✅ Cart
├── search-product.php        # ✅ Search
├── get_sectors.php           # ✅ Locations
│
├── helpers/                   # Helper functions
│   ├── auth.php              # Authentication helpers
│   ├── response.php          # JSON response helpers
│   └── database.php          # Database helpers (prepared statements)
│
├── schema.sql                # ✅ Database schema
├── seed.sql                  # ✅ Sample data
├── API_DOCUMENTATION.md      # ✅ Detailed API docs
└── README.md                 # This file
```

---

## 🗄️ Database Schema

### Main Tables

**Users & Auth:**
- `users` - User accounts
- `password_resets` - Password reset tokens

**Notifications:**
- `notifications` - User notifications
- `notification_settings` - Notification preferences

**Products:**
- `dow` - Products (main table)
- `categories` - Product categories
- `brands` - Product brands
- `bundles` - Product bundles
- `bundle_items` - Bundle composition

**Orders:**
- `orders` - Customer orders
- `order_items` - Order line items

**Locations:**
- `locations` - Delivery phases and sectors

---

## 🔐 Authentication

Session-based authentication:
1. User logs in → Session created with `user_id`
2. Protected endpoints check `$_SESSION['user_id']`
3. Logout → Session destroyed

### Protected Endpoints

Endpoints marked 🔒 require authentication:
- All `/api/profile*` endpoints
- All `/api/notification*` endpoints
- `/api/update-delivery.php`
- `/api/dashboard.php`
- `/api/change-password.php`
- `/api/delete-account.php`

---

## 📡 API Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message",
  "message": "Detailed description"
}
```

---

## 🧪 Testing

### Test User
After running `seed.sql`, you can log in with:
```
Email: test@gmail.com
Password: test123
```

### cURL Examples

**Login:**
```bash
curl -X POST http://localhost:8000/login.php \
  -d "email=test@gmail.com&password=test123" \
  -c cookies.txt
```

**Get Notifications:**
```bash
curl http://localhost:8000/api/notifications.php?count_only=true \
  -b cookies.txt
```

**Add to Cart:**
```bash
curl -X POST http://localhost:8000/add-to-cart.php \
  -d "product_id=1&quantity=2" \
  -b cookies.txt
```

---

## 🛠️ Frontend Integration

### Base URL Configuration

In your frontend `api/axiosConfig.js`:

```javascript
const API_BASE_URL = Platform.select({
  ios: 'http://127.0.0.1:8000',
  android: 'http://10.0.2.2:8000',
  default: 'http://192.168.1.100:8000', // Your computer's IP for physical devices
});
```

### Request Format

All POST requests use `application/x-www-form-urlencoded`:

```javascript
const formData = new URLSearchParams();
formData.append('email', 'user@example.com');
formData.append('password', 'password');

await axios.post('/login.php', formData.toString(), {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
});
```

---

## 🔧 Troubleshooting

### Database Connection Issues
```bash
# Check if MySQL is running
mysql -u root -p -e "SELECT 1;"

# Verify database exists
mysql -u root -p -e "SHOW DATABASES LIKE 'greenfield_db';"

# Check tables
mysql -u root -p greenfield_db -e "SHOW TABLES;"
```

### API Not Working
```bash
# Check PHP errors
tail -f /var/log/php_errors.log

# Test database connection
php -r "require 'admin/includes/db_settings.php'; echo \$con ? 'Connected' : 'Failed';"
```

### Session Issues
- Ensure `session_start()` is called at the top of protected endpoints
- Check PHP session configuration: `php -i | grep session`
- Clear browser cookies and try again

---

## 📖 Documentation

- **API_DOCUMENTATION.md** - Complete API reference with all endpoints
- **schema.sql** - Database structure and table definitions
- **seed.sql** - Sample data for development

---

## ✅ Checklist - What's Working

- ✅ User registration and login
- ✅ Session-based authentication
- ✅ Password reset flow
- ✅ User profile management
- ✅ Product listing and search
- ✅ Category browsing
- ✅ Bundle management with featured support
- ✅ Shopping cart (session-based)
- ✅ Complete notification system
- ✅ Notification preferences
- ✅ Location/address management
- ✅ Delivery validation
- ✅ Account deletion
- ✅ Password change
- ✅ SQL injection protection (prepared statements)

---

## 🚧 Recommended Improvements

### Security
- [ ] Add CSRF token validation
- [ ] Implement rate limiting
- [ ] Add API request logging
- [ ] Enable HTTPS in production

### Features
- [ ] Email sending for password reset
- [ ] Push notification service
- [ ] Order tracking system
- [ ] Payment gateway integration

### Performance
- [ ] Add database indexes
- [ ] Implement caching (Redis/Memcached)
- [ ] Optimize product queries
- [ ] Add pagination to all list endpoints

---

## 📞 Support

For issues or questions:
1. Check `API_DOCUMENTATION.md` for endpoint details
2. Review error logs: `tail -f /var/log/apache2/error.log`
3. Verify database schema matches `schema.sql`
4. Test with cURL before testing with app

---

## 📄 License

Internal use only - Greenfield Supermarket

---

**Last Updated:** 2025-01-18
**Version:** 2.0 - Complete API Implementation
