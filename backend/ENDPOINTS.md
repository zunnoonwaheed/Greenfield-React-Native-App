# All API Endpoints - Organized by Category

All endpoints are now in the `/api/` folder for easy management and future additions.

## 📁 Directory Structure

```
backend/api/
├── Authentication (5 files)
├── User & Profile (6 files)
├── Notifications (7 files)
├── Products (3 files)
├── Categories (2 files)
├── Bundles (2 files)
├── Cart (6 files)
└── Locations (3 files)
```

---

## 🔐 Authentication Endpoints

### 1. `/api/login.php`
- **Method:** POST
- **Auth Required:** ❌ No
- **Purpose:** User login with email/password
- **Request:** `email`, `password`
- **Response:** User object + session created

### 2. `/api/register.php`
- **Method:** POST
- **Auth Required:** ❌ No
- **Purpose:** Create new user account
- **Request:** `name`, `email`, `password`, `phone`, `address`
- **Response:** User object

### 3. `/api/logout.php`
- **Method:** GET
- **Auth Required:** ❌ No
- **Purpose:** Destroy session and logout
- **Response:** Success message

### 4. `/api/forgot-password.php`
- **Method:** POST
- **Auth Required:** ❌ No
- **Purpose:** Request password reset token
- **Request:** `email`
- **Response:** Reset token (dev only)

### 5. `/api/reset-password.php`
- **Method:** POST
- **Auth Required:** ❌ No
- **Purpose:** Reset password with token
- **Request:** `token`, `new_password`
- **Response:** Success message

---

## 👤 User & Profile Endpoints

### 6. `/api/profile.php`
- **Method:** GET
- **Auth Required:** ✅ Yes
- **Purpose:** Get current user profile
- **Response:** User object with all details

### 7. `/api/update-profile.php`
- **Method:** POST
- **Auth Required:** ✅ Yes
- **Purpose:** Update user profile
- **Request:** `name`, `phone`, `email`, `address`
- **Response:** Updated user object

### 8. `/api/change-password.php`
- **Method:** POST
- **Auth Required:** ✅ Yes
- **Purpose:** Change password while logged in
- **Request:** `current_password`, `new_password`
- **Response:** Success message

### 9. `/api/delete-account.php`
- **Method:** POST
- **Auth Required:** ✅ Yes
- **Purpose:** Delete user account (soft delete)
- **Request:** `password` (optional)
- **Response:** Success message + session cleared

### 10. `/api/dashboard.php`
- **Method:** GET
- **Auth Required:** ✅ Yes
- **Purpose:** Get user dashboard with orders & stats
- **Response:** User + orders + statistics

### 11. `/api/update-delivery.php`
- **Method:** POST
- **Auth Required:** ✅ Yes
- **Purpose:** Update delivery address
- **Request:** `address`, `phase_id`, `sector_id`, `phone`
- **Response:** Success message

---

## 🔔 Notification Endpoints

### 12. `/api/notifications.php`
- **Method:** GET
- **Auth Required:** ✅ Yes
- **Purpose:** Get user notifications
- **Query Params:** `limit`, `offset`, `unread_only`, `count_only`
- **Response:** List of notifications OR unread count

### 13. `/api/mark-notification-read.php`
- **Method:** POST
- **Auth Required:** ✅ Yes
- **Purpose:** Mark single notification as read
- **Request:** `notification_id`
- **Response:** Success message

### 14. `/api/mark-all-notifications-read.php`
- **Method:** POST
- **Auth Required:** ✅ Yes
- **Purpose:** Mark all user notifications as read
- **Response:** Success + updated count

### 15. `/api/delete-notification.php`
- **Method:** POST
- **Auth Required:** ✅ Yes
- **Purpose:** Delete a notification
- **Request:** `notification_id`
- **Response:** Success message

### 16. `/api/notification-settings.php`
- **Method:** GET
- **Auth Required:** ✅ Yes
- **Purpose:** Get user notification preferences
- **Response:** Settings object

### 17. `/api/update-notification-settings.php`
- **Method:** POST
- **Auth Required:** ✅ Yes
- **Purpose:** Update notification preferences
- **Request:** `email_notifications`, `push_notifications`, etc.
- **Response:** Updated settings

---

## 📦 Product Endpoints

### 18. `/api/products.php`
- **Method:** GET
- **Auth Required:** ❌ No
- **Purpose:** Get all products with filters
- **Query Params:** `category_id`, `brand_id`, `search`, `limit`, `offset`
- **Response:** List of products

### 19. `/api/product.php`
- **Method:** GET
- **Auth Required:** ❌ No
- **Purpose:** Get single product details
- **Query Params:** `id` OR `slug`
- **Response:** Product object + similar products

### 20. `/api/search-products.php`
- **Method:** POST or GET
- **Auth Required:** ❌ No
- **Purpose:** Search products by name
- **Request:** `q` (search query)
- **Response:** Matching products (max 20)

---

## 📂 Category Endpoints

### 21. `/api/categories.php`
- **Method:** GET
- **Auth Required:** ❌ No
- **Purpose:** Get all categories
- **Response:** List of categories

### 22. `/api/category.php`
- **Method:** GET
- **Auth Required:** ❌ No
- **Purpose:** Get category details with products
- **Query Params:** `id` OR `slug`, `brand_filter`
- **Response:** Category + products + brands

---

## 🎁 Bundle Endpoints

### 23. `/api/bundles.php`
- **Method:** GET
- **Auth Required:** ❌ No
- **Purpose:** Get all bundles
- **Query Params:** `featured`, `active_only`, `limit`, `offset`
- **Response:** List of bundles

### 24. `/api/bundle.php`
- **Method:** GET
- **Auth Required:** ❌ No
- **Purpose:** Get bundle details with products
- **Query Params:** `id`
- **Response:** Bundle object + products

---

## 🛒 Cart Endpoints

### 25. `/api/cart-contents.php`
- **Method:** GET
- **Auth Required:** ❌ No (session-based)
- **Purpose:** Get current cart contents
- **Response:** Cart items + total + count

### 26. `/api/add-to-cart.php`
- **Method:** POST
- **Auth Required:** ❌ No (session-based)
- **Purpose:** Add product to cart
- **Request:** `product_id`, `quantity`
- **Response:** Updated cart

### 27. `/api/update-cart.php`
- **Method:** POST
- **Auth Required:** ❌ No (session-based)
- **Purpose:** Update cart item quantity
- **Request:** `product_id`, `action` (increase/decrease) OR `quantity`
- **Response:** Updated cart

### 28. `/api/remove-from-cart.php`
- **Method:** POST
- **Auth Required:** ❌ No (session-based)
- **Purpose:** Remove item from cart
- **Request:** `product_id`
- **Response:** Updated cart

### 29. `/api/clear-cart.php`
- **Method:** GET or POST
- **Auth Required:** ❌ No (session-based)
- **Purpose:** Clear entire cart
- **Response:** Empty cart confirmation

### 30. `/api/add-bundle-to-cart.php`
- **Method:** POST
- **Auth Required:** ❌ No (session-based)
- **Purpose:** Add bundle to cart
- **Request:** `bundle_id`
- **Response:** Updated cart with bundle

---

## 📍 Location Endpoints

### 31. `/api/locations.php`
- **Method:** GET
- **Auth Required:** ❌ No
- **Purpose:** Get all phases with sectors
- **Response:** Hierarchical location data

### 32. `/api/get-sectors.php`
- **Method:** GET
- **Auth Required:** ❌ No
- **Purpose:** Get sectors for specific phase
- **Query Params:** `phase_id`
- **Response:** List of sectors

### 33. `/api/validate-delivery.php`
- **Method:** POST
- **Auth Required:** ❌ No
- **Purpose:** Check delivery availability
- **Request:** `phase_id`, `sector_id`
- **Response:** Availability + charges + estimated time

---

## 📊 Summary

| Category | Endpoints | Auth Required |
|----------|-----------|---------------|
| Authentication | 5 | ❌ No |
| User & Profile | 6 | ✅ Yes (all) |
| Notifications | 6 | ✅ Yes (all) |
| Products | 3 | ❌ No |
| Categories | 2 | ❌ No |
| Bundles | 2 | ❌ No |
| Cart | 6 | ❌ No (session) |
| Locations | 3 | ❌ No |
| **TOTAL** | **33** | **12 protected** |

---

## 🔧 How to Add New Endpoints

### Step 1: Create File in `/api/` folder

```php
<?php
/**
 * Your Endpoint Name API
 * Method: GET/POST
 * Params: param1, param2
 * Returns: JSON
 * Authentication: Yes/No
 */

session_start();
require_once("../admin/includes/db_settings.php");
require_once("../helpers/response.php");
require_once("../helpers/auth.php");  // If auth required
require_once("../helpers/database.php");

header('Content-Type: application/json');

// If auth required
requireAuth();

// Your logic here

jsonSuccess($data, 'Success message');
?>
```

### Step 2: Add to Frontend API File

```javascript
// frontend/api/yourAPI.js
export const yourFunction = async (params) => {
  try {
    const response = await axiosInstance.post('/api/your-endpoint.php', ...);
    return response;
  } catch (error) {
    throw error;
  }
};
```

### Step 3: Update This Document

Add your endpoint to the appropriate category section above.

---

## ✅ All Endpoints Use:

- ✅ Prepared statements (SQL injection protection)
- ✅ Consistent JSON response format
- ✅ Proper error handling
- ✅ Session-based authentication
- ✅ Input validation & sanitization
- ✅ Helper functions for DRY code

---

## 📝 Response Format

### Success
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  }
}
```

### Error
```json
{
  "success": false,
  "error": "Error message",
  "message": "Detailed description"
}
```

---

**Last Updated:** 2025-01-18
**Total Endpoints:** 33
**All in `/api/` folder:** ✅ Yes
