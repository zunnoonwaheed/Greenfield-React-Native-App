# Greenfield Dynamic Database Setup Guide

This guide will help you set up the complete dynamic database for Greenfield Integration.

## Prerequisites

- MySQL 5.7+ or MySQL 8.0+
- PHP 7.4+ or PHP 8.0+
- Database: `greenfieldsuperm_db_local`
- Database user with full privileges

## Step 1: Import Schema Files

Run these SQL files in order:

```bash
# 1. Import main schema (if not already done)
mysql -u root -p greenfieldsuperm_db_local < backend/schema.sql

# 2. Import marketplace/ads schema
mysql -u root -p greenfieldsuperm_db_local < backend/schema_ads_marketplace.sql

# 3. Import main seed data (categories, products, bundles, users, locations)
mysql -u root -p greenfieldsuperm_db_local < backend/COMPREHENSIVE_SEED.sql

# 4. Import marketplace/ads seed data
mysql -u root -p greenfieldsuperm_db_local < backend/seed_ads_marketplace.sql
```

## Step 2: Verify Tables

After importing, verify these tables exist:

### Core E-commerce Tables
- `users` - User accounts
- `dow` - Products
- `categories` - Product categories
- `brands` - Product brands
- `bundles` - Product bundles
- `bundle_items` - Bundle composition
- `orders` - Customer orders
- `order_items` - Order line items
- `locations` - Delivery locations (phases/sectors)
- `delivery_charges` - Delivery pricing

### Cart Tables
- `cart` or `user_cart` - Shopping cart items

### Marketplace Tables (NEW)
- `marketplace_ads` - User marketplace listings
- `marketplace_ad_images` - Ad images
- `marketplace_categories` - Ad categories

### Payment & Notifications Tables (NEW)
- `payment_methods` - User payment methods
- `notifications` - User notifications
- `notification_settings` - Notification preferences

## Step 3: Verify Sample Data

Run these queries to confirm data was imported:

```sql
-- Check categories
SELECT COUNT(*) FROM categories;
-- Should return: 10+ categories

-- Check products
SELECT COUNT(*) FROM dow WHERE id >= 10001;
-- Should return: 70+ products

-- Check bundles
SELECT COUNT(*) FROM bundles;
-- Should return: 5-10 bundles

-- Check marketplace ads
SELECT COUNT(*) FROM marketplace_ads;
-- Should return: 10 ads

-- Check payment methods
SELECT COUNT(*) FROM payment_methods;
-- Should return: 5 payment methods

-- Check locations
SELECT COUNT(*) FROM locations;
-- Should return: 15+ locations
```

## Step 4: Test API Endpoints

### Test Ads API
```bash
# List all ads
curl http://localhost/backend/api/ads.php

# Get ad detail
curl http://localhost/backend/api/ad-detail.php?id=1

# Search ads
curl "http://localhost/backend/api/ads.php?search=tomato"

# Filter by category
curl "http://localhost/backend/api/ads.php?category=Groceries"
```

### Test Payment Methods API
```bash
# Get payment methods (requires auth)
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost/backend/api/payment-methods.php
```

### Test Order History API
```bash
# Get order history (requires auth)
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost/backend/api/order-history.php
```

## Step 5: Frontend Integration

### Update axiosConfig.js

Ensure your API base URL is correct in `frontend/api/axiosConfig.js`:

```javascript
// For iOS Simulator
const API_BASE_URL = 'http://127.0.0.1/backend';

// For Android Emulator
const API_BASE_URL = 'http://10.0.2.2/backend';

// For Physical Device (replace with your IP)
const API_BASE_URL = 'http://192.168.1.XXX/backend';
```

### Test Frontend Imports

```javascript
// In any React Native screen
import { getAds, createAd } from '../api';
import { getPaymentMethods, addPaymentMethod } from '../api';
import { getOrderHistory } from '../api';
```

## Database Schema Overview

### Marketplace Ads Structure
```
marketplace_ads
├── id (PK)
├── user_id (FK -> users.id)
├── title
├── description
├── price
├── category
├── subcategory
├── condition (New/Used/Like New)
├── location
├── address
├── specifications (JSON)
├── status (active/pending/sold/deleted)
├── views
├── featured
└── timestamps

marketplace_ad_images
├── id (PK)
├── ad_id (FK -> marketplace_ads.id)
├── image_url
├── is_primary
└── sort_order
```

### Payment Methods Structure
```
payment_methods
├── id (PK)
├── user_id (FK -> users.id)
├── method_type (card/bank/jazzcash/easypaisa/wallet)
├── card_number_last4
├── card_holder_name
├── card_brand
├── account_number
├── bank_name
├── phone_number
├── is_default
└── status
```

## Troubleshooting

### Issue: Foreign key constraints fail
**Solution**: Ensure you imported schema files before seed files

### Issue: API returns empty data
**Solution**:
1. Check database connection in PHP files
2. Verify seed data was imported
3. Check PHP error logs

### Issue: Authentication fails
**Solution**:
1. Ensure you have a valid user in `users` table
2. Test login endpoint first to get JWT token
3. Pass token in Authorization header

## Next Steps

After database setup:

1. **Update CategoriesScreen** - Fetch categories dynamically
2. **Update CartScreen** - Use cart API endpoints
3. **Update SellAdsScreen** - Fetch ads from backend
4. **Update Create Ad Flow** - Submit to backend API
5. **Update PaymentMethodsScreen** - Use payment methods API
6. **Update OrderHistoryScreen** - Use order history API
7. **Fix Homepage Address** - Use user's selected address

## Support

For issues, check:
- PHP error logs: `/var/log/php/error.log`
- MySQL error logs: `/var/log/mysql/error.log`
- React Native console for frontend errors
