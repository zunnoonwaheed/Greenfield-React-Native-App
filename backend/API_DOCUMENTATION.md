# Greenfield Supermarket API Documentation

All API endpoints now return JSON responses with `Content-Type: application/json` header.

## Base URL
```
http://localhost:3000
```

## Response Format
All endpoints return responses in this format:
```json
{
  "success": true/false,
  "message": "Response message",
  "data": {...}
}
```

---

## Authentication Endpoints

### 1. User Login (API)
**Endpoint:** `/api/login.php`
**Method:** `POST`
**Headers:** `Content-Type: application/json` or `Accept: application/json`
**Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```
**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "user@example.com",
    "phone": "03001234567",
    "address": "Islamabad, DHA Phase 2, Sector A, Street: 1"
  }
}
```

### 2. User Login (Legacy - supports both HTML and JSON)
**Endpoint:** `/login.php`
**Method:** `POST`
**Headers:** `Accept: application/json` (for JSON response)
**Body (form-data):**
```
login_email: user@example.com
login_password: password123
```

### 3. User Registration (API)
**Endpoint:** `/api/register.php`
**Method:** `POST`
**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "03001234567",
  "city": "Islamabad",
  "phase": "DHA Phase 2",
  "sector": "Sector A",
  "street": "Street 1",
  "type": "House",
  "house_number": "123"
}
```

### 4. Logout (API)
**Endpoint:** `/api/logout.php`
**Method:** `GET` or `POST`
**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### 5. Logout (Legacy)
**Endpoint:** `/logout.php`
**Method:** `GET`
**Headers:** `Accept: application/json` (for JSON response)

---

## Category Endpoints

### 6. Get All Categories
**Endpoint:** `/api/categories.php`
**Method:** `GET`
**Response:**
```json
{
  "success": true,
  "categories": [
    {
      "id": 1,
      "name": "Vegetables",
      "slug": "vegetables",
      "image": "vegetables.jpg"
    }
  ],
  "count": 10
}
```

### 7. Get Category by Slug
**Endpoint:** `/api/category.php?slug=vegetables`
**Method:** `GET`
**Query Parameters:**
- `slug` (required): Category slug
- `brand_filter` (optional): Brand ID to filter products

**Response:**
```json
{
  "success": true,
  "category": {
    "id": 1,
    "name": "Vegetables",
    "slug": "vegetables",
    "image": "vegetables.jpg"
  },
  "products": [...],
  "brands": [...],
  "product_count": 15
}
```

---

## Product Endpoints

### 8. Get Product by Slug
**Endpoint:** `/api/product.php?slug=tomato-fresh-1kg`
**Method:** `GET`
**Response:**
```json
{
  "success": true,
  "product": {
    "id": 10001,
    "name": "Tomato Fresh 1kg",
    "slug": "tomato-fresh-1kg",
    "image": "tomato.jpg",
    "price": 150,
    "dprice": 120,
    "description": "Fresh tomatoes",
    "category_id": 1,
    "brand_id": 5
  },
  "similar_products": [...]
}
```

### 9. Search/List Products
**Endpoint:** `/api/products.php`
**Method:** `GET`
**Query Parameters:**
- `q` (optional): Search query
- `category_id` (optional): Filter by category
- `limit` (optional): Results per page (default: 20)
- `offset` (optional): Pagination offset (default: 0)

**Response:**
```json
{
  "success": true,
  "products": [...],
  "count": 10,
  "limit": 20,
  "offset": 0
}
```

### 10. Search Products (Quick)
**Endpoint:** `/search-product.php`
**Method:** `POST`
**Body (form-data):**
```
q: tomato
```
**Response:**
```json
{
  "success": true,
  "products": [
    {
      "id": 10001,
      "name": "Tomato Fresh 1kg",
      "slug": "tomato-fresh-1kg",
      "price": 150,
      "image": "/admin/upload/dow/tomato.jpg"
    }
  ],
  "count": 10
}
```

---

## Cart Endpoints

### 11. Add to Cart
**Endpoint:** `/add-to-cart.php`
**Method:** `POST`
**Body (form-data):**
```
product_id: 10001
qty: 2
```
**Response:**
```json
{
  "success": true,
  "message": "Product added to cart",
  "cart_count": 5,
  "cart_html": "..."
}
```

### 12. Update Cart
**Endpoint:** `/update-cart.php`
**Method:** `POST`
**Body (form-data):**
```
id: 10001
action: increase (or decrease, remove)
```

### 13. Remove from Cart
**Endpoint:** `/remove-from-cart.php`
**Method:** `POST`
**Body (form-data):**
```
id: 10001
```

### 14. Clear Cart
**Endpoint:** `/clear-cart.php`
**Method:** `GET`
**Response:**
```json
{
  "success": true,
  "message": "Cart cleared"
}
```

### 15. Get Cart Contents
**Endpoint:** `/cart-contents.php`
**Method:** `GET`
**Response:**
```json
{
  "success": true,
  "cart_html": "...",
  "cart_count": 3,
  "total": "450.00 PKR"
}
```

### 16. Add Bundle to Cart
**Endpoint:** `/add-bundle-to-cart.php`
**Method:** `POST`
**Body (form-data):**
```
bundle_id: 1
qty: 1
```

---

## Order Endpoints

### 17. Submit Order
**Endpoint:** `/submit-order.php`
**Method:** `POST`
**Body (form-data):**
```
name: John Doe
email: john@example.com
phone: 03001234567
guest_address: Full address
payment_method: cod
delivery_charge: 100
final_total: 550
```
**Response:**
```json
{
  "success": true,
  "message": "Order placed successfully",
  "order_id": 123,
  "payment_method": "cod"
}
```

### 18. Checkout Process (Legacy)
**Endpoint:** `/checkout-process.php`
**Method:** `POST`
**Body (form-data):**
```
name: John Doe
email: john@example.com
address: Full address
payment: cod
```

---

## Profile Endpoints

### 19. Update Profile
**Endpoint:** `/update-profile.php`
**Method:** `POST`
**Headers:** `Accept: application/json`
**Body (form-data):**
```
name: John Updated
phone: 03009876543
address_edited: 1
city: Islamabad
phase: DHA Phase 2
sector: Sector B
street: Street 5
type: House
house_number: 456
update_profile: 1
```
**Response:**
```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": {...}
}
```

---

## Utility Endpoints

### 20. Get Sectors by Phase
**Endpoint:** `/get_sectors.php?phase_id=1`
**Method:** `GET`
**Response:**
```json
[
  {
    "id": 10,
    "name": "Sector A"
  },
  {
    "id": 11,
    "name": "Sector B"
  }
]
```

### 21. Get Products by Category & Brand (AJAX)
**Endpoint:** `/ajax/get-products.php`
**Method:** `POST`
**Body (form-data):**
```
catId: 53
brandId: 1000
```
**Response:**
```json
{
  "success": true,
  "products": [...],
  "count": 15
}
```

---

## Important Notes

### Testing in Postman

1. **For API endpoints** (in `/api/` directory):
   - These ALWAYS return JSON
   - No special headers needed

2. **For legacy endpoints**:
   - Add header: `Accept: application/json`
   - This tells the endpoint to return JSON instead of HTML

3. **Example Postman Request**:
   ```
   POST http://localhost:8000/add-to-cart.php
   Headers:
     Accept: application/json
   Body (form-data):
     product_id: 10001
     qty: 2
   ```

### Session Management
- Login creates a session
- Session is maintained across requests using cookies
- Use Postman's cookie management to maintain sessions

### Error Responses
All errors return:
```json
{
  "success": false,
  "message": "Error description"
}
```

---

## Migration Guide

### Old Endpoints → New API Endpoints

| Old Endpoint | New API Endpoint | Notes |
|-------------|------------------|-------|
| `/user-login.php` (POST) | `/api/login.php` | Pure JSON API |
| `/logout.php` | `/api/logout.php` | Pure JSON API |
| `/category/` | `/api/categories.php` | Pure JSON API |
| `/{slug}/` | `/api/product.php?slug={slug}` | Pure JSON API |

### Backward Compatibility
All old endpoints still work but now support JSON responses when you add the `Accept: application/json` header.
