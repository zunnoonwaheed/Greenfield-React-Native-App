# Complete System Seed Instructions

## Overview
This comprehensive seed file (`complete_system_seed.sql`) contains **COMPLETE** test data for your entire Greenfields Supermarket system. This allows you to test every aspect of your backend properly.

## What's Included - COMPLETE SYSTEM DATA

### 1. Admin Users (3 users)
| ID | Name | Username | Password | Role |
|----|------|----------|----------|------|
| 100 | Test Admin | testadmin | password | admin |
| 101 | Test Manager | testmanager | password | manager |
| 102 | Test Staff | teststaff | password | staff |

### 2. Brands (5 test brands)
- Test Brand - Fresh Market (ID: 1000)
- Test Brand - Organic Valley (ID: 1001)
- Test Brand - Home Essentials (ID: 1002)
- Test Brand - Premium Foods (ID: 1003)
- Test Brand - Dairy Fresh (ID: 1004)

### 3. Products - 29 Complete Products (IDs: 10001-10029)
Organized by category:

**Vegetables & Fruits (7 products)**
- Tomato, Potato, Onion, Apple, Banana, Orange, etc.

**Dairy Products (4 products)**
- Milk, Cheese, Yogurt, Butter

**Bakery (2 products)**
- Whole Wheat Bread, White Bread

**Rice & Grains (2 products)**
- Basmati Rice 5kg, Basmati Rice 10kg

**Cooking Essentials (4 products)**
- Cooking Oil (1L, 5L), Sugar, Salt

**Frozen Foods (3 products)**
- Chicken Nuggets, Chicken Wings, Samosas

**Beverages (4 products)**
- Cola, Lemon Drink, Mango Juice, Orange Juice

**Snacks (2 products)**
- BBQ Chips, Salt Chips

**Eggs (2 products)**
- Farm Eggs Pack of 12, Pack of 30

### 4. Locations (19 test locations)
Complete location hierarchy:
- Test DHA Phase 1 (Sectors A, B, C)
- Test DHA Phase 2 (Sectors D, E)
- Test F-Sector (F-6, F-7, F-8)
- Test G-Sector (G-9, G-10, G-11)
- Test Bahria Town (Phase 1, 2, 3)

### 5. Delivery Charges (6 configurations)
- Test DHA Phase 1: Free delivery
- Test DHA Phase 2: PKR 50
- Test F-Sector: PKR 100
- Test G-Sector: PKR 100
- Test Bahria Town: PKR 150
- Other Areas: PKR 200

### 6. Customer Users (10 users)
**All passwords: `Test@123`**

| ID | Name | Email | Phone |
|----|------|-------|-------|
| 200 | Ali Hassan | ali.hassan@testmail.com | 03001111111 |
| 201 | Ayesha Khan | ayesha.khan@testmail.com | 03002222222 |
| 202 | Muhammad Ahmed | muhammad.ahmed@testmail.com | 03003333333 |
| 203 | Sara Malik | sara.malik@testmail.com | 03004444444 |
| 204 | Usman Ali | usman.ali@testmail.com | 03005555555 |
| 205 | Fatima Noor | fatima.noor@testmail.com | 03006666666 |
| 206 | Hamza Rehman | hamza.rehman@testmail.com | 03007777777 |
| 207 | Zainab Sheikh | zainab.sheikh@testmail.com | 03008888888 |
| 208 | Bilal Tariq | bilal.tariq@testmail.com | 03009999999 |
| 209 | Mariam Siddiqui | mariam.siddiqui@testmail.com | 03001234567 |

### 7. Bundles (5 product bundles)
- Test Weekly Grocery Bundle (PKR 3200)
- Test Fresh Fruits Bundle (PKR 1100)
- Test Breakfast Bundle (PKR 1650)
- Test Dairy Combo (PKR 1300)
- Test Family Meal Bundle (PKR 4000)

### 8. Bundle Items (26 items)
Each bundle has multiple products configured

### 9. Orders (11 complete orders)
**Mixed order types:**
- 8 Registered user orders
- 3 Guest orders

**Order Statuses:**
- 2 Delivered
- 1 On The Way (otw)
- 1 Processed
- 7 Current Orders

**Payment Types:**
- 5 Online Payment
- 5 Cash on Delivery (COD)
- 1 Pending Payment

### 10. Order Items (28 items)
Complete order items for all orders including:
- Individual products
- Bundle orders
- Mixed orders (bundles + individual items)

### 11. Content Pages (5 pages)
- Test About Us
- Test Contact Us
- Test Privacy Policy
- Test Terms & Conditions
- Test FAQ

### 12. Homepage Settings
Configured with test sections

### 13. Stores/Banners (3 entries)
Test banners and logos

### 14. Password Reset Tokens (2 entries)
For testing password reset functionality

### 15. Invoices (3 entries)
Test invoice generation

## How to Run the Complete Seed File

### Method 1: Command Line (Recommended)

```bash
cd "/Users/mac/Downloads/public_html 2"
mysql -u root -p greenfieldsuperm_db_local < complete_system_seed.sql
```

Enter your MySQL password when prompted.

### Method 2: MySQL Monitor

```bash
mysql -u root -p
```

Then:

```sql
USE greenfieldsuperm_db_local;
SOURCE /Users/mac/Downloads/public_html\ 2/complete_system_seed.sql;
```

### Method 3: One Command

```bash
mysql -u root -p greenfieldsuperm_db_local < "/Users/mac/Downloads/public_html 2/complete_system_seed.sql"
```

## Verification

After running the seed file, verify the data:

```sql
USE greenfieldsuperm_db_local;

-- Check all test data counts
SELECT 'Test Admin Users' as Type, COUNT(*) as Count FROM members WHERE id >= 100
UNION ALL
SELECT 'Test Brands', COUNT(*) FROM brands WHERE id >= 1000
UNION ALL
SELECT 'Test Products', COUNT(*) FROM dow WHERE id >= 10000
UNION ALL
SELECT 'Test Locations', COUNT(*) FROM locations WHERE id >= 200
UNION ALL
SELECT 'Test Users', COUNT(*) FROM users WHERE id >= 200
UNION ALL
SELECT 'Test Bundles', COUNT(*) FROM bundles WHERE id >= 200
UNION ALL
SELECT 'Test Orders', COUNT(*) FROM orders WHERE id >= 200;

-- Check order distribution
SELECT
    statuss as Status,
    payment_status as Payment,
    COUNT(*) as Total
FROM orders
WHERE id >= 200
GROUP BY statuss, payment_status;

-- Check products by price range
SELECT
    CASE
        WHEN dprice < 200 THEN 'Under PKR 200'
        WHEN dprice < 500 THEN 'PKR 200-500'
        WHEN dprice < 1000 THEN 'PKR 500-1000'
        ELSE 'Over PKR 1000'
    END as Price_Range,
    COUNT(*) as Products
FROM dow
WHERE id >= 10000
GROUP BY Price_Range;
```

## Testing Scenarios

### 1. User Authentication
**Admin Login:**
```
URL: /admin/
Username: testadmin
Password: password
```

**Customer Login:**
```
Email: ali.hassan@testmail.com
Password: Test@123
```

### 2. Product Management
- Test product listing (29 products available)
- Test product search
- Test product filtering by category
- Test product filtering by brand
- Test price range filters

### 3. Order Management

**Test Order Statuses:**
```sql
-- Delivered Orders
SELECT * FROM orders WHERE id IN (200, 201) AND statuss = 'Delivered';

-- Current Orders
SELECT * FROM orders WHERE id BETWEEN 204 AND 210 AND statuss = 'Current';

-- On The Way
SELECT * FROM orders WHERE id = 202 AND statuss = 'otw';

-- Processed
SELECT * FROM orders WHERE id = 203 AND statuss = 'Processed';
```

**Test Payment Methods:**
```sql
-- COD Orders
SELECT * FROM orders WHERE id >= 200 AND payment_status = 'COD';

-- Online Payment Orders
SELECT * FROM orders WHERE id >= 200 AND payment_status = 'Online';

-- Pending Payment
SELECT * FROM orders WHERE id >= 200 AND payment_status = 'Pending';
```

### 4. Bundle Testing
```sql
-- Get bundle with items
SELECT
    b.id,
    b.name,
    b.final_price,
    COUNT(bi.id) as item_count
FROM bundles b
LEFT JOIN bundle_items bi ON b.id = bi.bundle_id
WHERE b.id >= 200
GROUP BY b.id;

-- Get all products in a bundle
SELECT
    b.name as bundle_name,
    d.namee as product_name,
    bi.quantity,
    d.dprice as unit_price
FROM bundles b
JOIN bundle_items bi ON b.id = bi.bundle_id
JOIN dow d ON bi.product_id = d.id
WHERE b.id = 200;
```

### 5. Delivery Charge Calculation
```sql
-- Check delivery charges by area
SELECT * FROM delivery_charges WHERE id >= 200;

-- Test orders with different delivery charges
SELECT
    id,
    guest_name,
    subtotal,
    delivery_charge,
    total,
    guest_address
FROM orders
WHERE id >= 200
ORDER BY delivery_charge;
```

### 6. Location Management
```sql
-- Get location hierarchy
SELECT
    l1.name as Phase,
    l2.name as Sector
FROM locations l1
LEFT JOIN locations l2 ON l2.parent_id = l1.id
WHERE l1.parent_id IS NULL AND l1.id >= 200
ORDER BY l1.id, l2.id;
```

### 7. User Order History
```sql
-- Get user's order history
SELECT
    u.name,
    u.email,
    o.id as order_id,
    o.total,
    o.statuss,
    o.created_at
FROM users u
JOIN orders o ON u.id = o.user_id
WHERE u.id >= 200
ORDER BY u.id, o.created_at DESC;
```

### 8. Guest Orders
```sql
-- All guest orders (user_id is NULL)
SELECT
    id,
    guest_name,
    guest_email,
    total,
    statuss,
    payment_status
FROM orders
WHERE id >= 200 AND user_id IS NULL;
```

### 9. Revenue Reports
```sql
-- Total revenue by status
SELECT
    statuss,
    COUNT(*) as order_count,
    SUM(total) as total_revenue
FROM orders
WHERE id >= 200
GROUP BY statuss;

-- Daily revenue
SELECT
    DATE(created_at) as date,
    COUNT(*) as orders,
    SUM(total) as revenue
FROM orders
WHERE id >= 200
GROUP BY DATE(created_at);
```

### 10. Product Performance
```sql
-- Best selling products
SELECT
    oi.product_id,
    d.namee,
    SUM(oi.qty) as total_quantity,
    SUM(oi.total) as total_revenue
FROM order_items oi
JOIN dow d ON oi.product_id = d.id
WHERE oi.id >= 200 AND oi.product_id IS NOT NULL
GROUP BY oi.product_id, d.namee
ORDER BY total_quantity DESC
LIMIT 10;

-- Bundle performance
SELECT
    oi.bundle_id,
    b.name,
    COUNT(*) as times_ordered,
    SUM(oi.total) as total_revenue
FROM order_items oi
JOIN bundles b ON oi.bundle_id = b.id
WHERE oi.id >= 200 AND oi.bundle_id IS NOT NULL
GROUP BY oi.bundle_id, b.name
ORDER BY times_ordered DESC;
```

## API Testing Endpoints

Test these common API endpoints with the seeded data:

### Products
- `GET /api/products` - List all products
- `GET /api/products/10001` - Get specific product
- `GET /api/products?category=53` - Filter by category
- `GET /api/products?brand=1000` - Filter by brand
- `GET /api/products/search?q=test` - Search products

### Orders
- `GET /api/orders` - List all orders
- `GET /api/orders/200` - Get specific order
- `GET /api/orders?user_id=200` - Get user orders
- `GET /api/orders?status=Current` - Filter by status
- `POST /api/orders` - Create new order

### Users
- `POST /api/auth/login` - Login (use test credentials)
- `GET /api/users/200` - Get user profile
- `GET /api/users/200/orders` - Get user orders
- `PUT /api/users/200` - Update user profile

### Bundles
- `GET /api/bundles` - List all bundles
- `GET /api/bundles/200` - Get bundle details with items
- `GET /api/bundles/200/products` - Get products in bundle

### Locations
- `GET /api/locations` - List all locations
- `GET /api/locations?type=phase` - Get phases only
- `GET /api/delivery-charges` - Get delivery charges

## Clean Up Test Data

When you're done testing, remove all test data:

```sql
USE greenfieldsuperm_db_local;

START TRANSACTION;

-- Remove test data (in correct order due to foreign keys)
DELETE FROM order_items WHERE id >= 200;
DELETE FROM orders WHERE id >= 200;
DELETE FROM bundle_items WHERE id >= 200;
DELETE FROM bundles WHERE id >= 200;
DELETE FROM users WHERE id >= 200;
DELETE FROM password_resets WHERE email LIKE '%@testmail.com';
DELETE FROM invoice WHERE id >= 200;
DELETE FROM dow WHERE id >= 10000;
DELETE FROM brands WHERE id >= 1000;
DELETE FROM delivery_charges WHERE id >= 200;
DELETE FROM locations WHERE id >= 200;
DELETE FROM textpage WHERE id >= 200;
DELETE FROM homep WHERE id >= 200;
DELETE FROM stores WHERE id >= 200;
DELETE FROM members WHERE id >= 100;

COMMIT;

SELECT 'All test data removed successfully!' AS Status;
```

## Test Data ID Ranges

All test data uses specific ID ranges to avoid conflicts:

| Table | ID Range | Count |
|-------|----------|-------|
| members | 100-102 | 3 |
| brands | 1000-1004 | 5 |
| dow (products) | 10001-10029 | 29 |
| locations | 200-218 | 19 |
| delivery_charges | 200-205 | 6 |
| users | 200-209 | 10 |
| bundles | 200-204 | 5 |
| bundle_items | 200-225 | 26 |
| orders | 200-210 | 11 |
| order_items | 200-227 | 28 |
| textpage | 200-204 | 5 |
| homep | 200 | 1 |
| stores | 200-202 | 3 |

## Troubleshooting

### Foreign Key Errors
The seed file automatically handles foreign keys. If you get errors:
```sql
SET FOREIGN_KEY_CHECKS = 0;
-- Run your query
SET FOREIGN_KEY_CHECKS = 1;
```

### Duplicate Entry Errors
Clean up existing test data first:
```sql
-- Run the cleanup script above
```

### Permission Denied
Make sure you have proper permissions:
```bash
mysql -u root -p  # Use root user
```

## Notes

- **Safe for Production**: All test IDs are in separate ranges (100+, 200+, 1000+, 10000+)
- **Complete System**: Every major table is populated with realistic test data
- **Realistic Data**: Uses Pakistani locations, names, phone formats, and currency
- **Ready to Test**: Immediately start testing all backend features
- **Easy Cleanup**: Single script removes all test data

## Support

If you encounter issues:
1. Check MySQL error logs
2. Verify database exists: `SHOW DATABASES;`
3. Check permissions: `SHOW GRANTS;`
4. Ensure MySQL version compatibility (tested on 8.0+)

Happy Testing! Now you can properly test your entire backend system.
