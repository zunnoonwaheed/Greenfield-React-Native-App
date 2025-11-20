-- ============================================
-- WORKING SEED FILE FOR GREENFIELD SUPERMARKET
-- Simple, tested data that ACTUALLY WORKS
-- ============================================

USE greenfieldsuperm_db_local;

-- Disable checks
SET FOREIGN_KEY_CHECKS = 0;
SET AUTOCOMMIT = 0;
START TRANSACTION;

-- ============================================
-- 1. CLEAN UP (Remove test data only)
-- ============================================
DELETE FROM order_items WHERE order_id >= 1000;
DELETE FROM orders WHERE id >= 1000;
DELETE FROM users WHERE id >= 1000;
DELETE FROM dow WHERE id >= 10000;
DELETE FROM brands WHERE id >= 1000;
DELETE FROM locations WHERE id >= 1000;
DELETE FROM delivery_charges WHERE id >= 1000;
DELETE FROM bundles WHERE id >= 1000;
DELETE FROM bundle_items WHERE id >= 1000;

-- ============================================
-- 2. EXCHANGE RATES (Important!)
-- ============================================
DELETE FROM exchange WHERE id >= 100;
INSERT INTO exchange (id, name, currency, exchange_rate, default_currency) VALUES
(100, 'Pakistani Rupee', 'PKR', 1.00, 1);

-- ============================================
-- 3. BRANDS
-- ============================================
INSERT INTO brands (id, name, slug, image, brID, title, descr, addhead, websiteID, mainID) VALUES
(1000, 'Test Fresh Market', 'test-fresh-market', NULL, 2, 'Test Fresh Market', 'Fresh products', '', 1, 2),
(1001, 'Test Organic', 'test-organic', NULL, 2, 'Test Organic', 'Organic products', '', 1, 2);

-- ============================================
-- 4. PRODUCTS (dow table)
-- ============================================
INSERT INTO dow (id, brID, catID, mainID, statuss, namee, slug, code, desc1, imagee, datee, title, keyword, descr, addhead, tags, imagee3, price, dprice, sku, websiteID, imagee2) VALUES
-- Vegetables
(10001, 1000, 53, 2, 1, 'Tomato Fresh 1kg', 'tomato-fresh-1kg', 'TOM001', 'Fresh red tomatoes', '', '2025-01-01', 'Tomato Fresh 1kg', 'tomato', 'Fresh red tomatoes', '', 'vegetables', '', 150.00, 140.00, 'TOM001', 1, ''),
(10002, 1000, 53, 2, 1, 'Potato 1kg', 'potato-1kg', 'POT001', 'Fresh potatoes', '', '2025-01-01', 'Potato 1kg', 'potato', 'Fresh potatoes', '', 'vegetables', '', 120.00, 110.00, 'POT001', 1, ''),
(10003, 1000, 53, 2, 1, 'Onion 1kg', 'onion-1kg', 'ONI001', 'Fresh onions', '', '2025-01-01', 'Onion 1kg', 'onion', 'Fresh onions', '', 'vegetables', '', 180.00, 170.00, 'ONI001', 1, ''),

-- Fruits
(10004, 1001, 54, 2, 1, 'Apple Red 1kg', 'apple-red-1kg', 'APP001', 'Fresh apples', '', '2025-01-01', 'Apple Red 1kg', 'apple', 'Fresh apples', '', 'fruits', '', 350.00, 330.00, 'APP001', 1, ''),
(10005, 1001, 54, 2, 1, 'Banana 12pcs', 'banana-12pcs', 'BAN001', 'Fresh bananas', '', '2025-01-01', 'Banana 12pcs', 'banana', 'Fresh bananas', '', 'fruits', '', 200.00, 190.00, 'BAN001', 1, ''),

-- Dairy
(10006, 1000, 55, 2, 1, 'Milk 1L', 'milk-1l', 'MLK001', 'Fresh milk', '', '2025-01-01', 'Milk 1L', 'milk', 'Fresh milk', '', 'dairy', '', 250.00, 240.00, 'MLK001', 1, ''),
(10007, 1000, 55, 2, 1, 'Cheese 200g', 'cheese-200g', 'CHE001', 'Cheddar cheese', '', '2025-01-01', 'Cheese 200g', 'cheese', 'Cheddar cheese', '', 'dairy', '', 480.00, 460.00, 'CHE001', 1, ''),

-- Rice
(10008, 1000, 65, 2, 1, 'Rice 5kg', 'rice-5kg', 'RIC001', 'Basmati rice', '', '2025-01-01', 'Rice 5kg', 'rice', 'Basmati rice', '', 'rice', '', 2600.00, 2500.00, 'RIC001', 1, ''),

-- Oil
(10009, 1000, 52, 2, 1, 'Cooking Oil 1L', 'cooking-oil-1l', 'OIL001', 'Cooking oil', '', '2025-01-01', 'Cooking Oil 1L', 'oil', 'Cooking oil', '', 'oil', '', 580.00, 560.00, 'OIL001', 1, ''),

-- Eggs
(10010, 1000, 89, 2, 1, 'Eggs 12pcs', 'eggs-12pcs', 'EGG001', 'Farm eggs', '', '2025-01-01', 'Eggs 12pcs', 'eggs', 'Farm eggs', '', 'eggs', '', 520.00, 500.00, 'EGG001', 1, '');

-- ============================================
-- 5. LOCATIONS
-- ============================================
INSERT INTO locations (id, parent_id, name, type) VALUES
(1000, NULL, 'DHA Phase 1', 'phase'),
(1001, 1000, 'Sector A', 'sector'),
(1002, 1000, 'Sector B', 'sector'),
(1003, 1000, 'Sector C', 'sector'),
(1004, NULL, 'DHA Phase 2', 'phase'),
(1005, 1004, 'Sector D', 'sector'),
(1006, 1004, 'Sector E', 'sector');

-- ============================================
-- 6. DELIVERY CHARGES
-- ============================================
INSERT INTO delivery_charges (id, area, sector, charge) VALUES
(1000, 'DHA Phase 1', 'All Sectors', 0.00),
(1001, 'DHA Phase 2', 'All Sectors', 50.00);

-- ============================================
-- 7. USERS
-- Password for all: Test@123 (bcrypt hashed)
-- ============================================
INSERT INTO users (id, name, email, password, phone, address, created_at) VALUES
(1000, 'Ali Hassan', 'ali.hassan@test.com', '$2y$12$8l9cR24CZPsU6eL.EuPHpugaFUwOz8Mv1JRovR.jfxDZyzmqsVkae', '03001111111', 'House 10, Street 5, DHA Phase 1, Sector A, Islamabad', '2025-01-01 10:00:00'),
(1001, 'Ayesha Khan', 'ayesha.khan@test.com', '$2y$12$8l9cR24CZPsU6eL.EuPHpugaFUwOz8Mv1JRovR.jfxDZyzmqsVkae', '03002222222', 'House 20, Street 10, DHA Phase 2, Sector D, Islamabad', '2025-01-01 11:00:00');

-- ============================================
-- 8. BUNDLES
-- ============================================
INSERT INTO bundles (id, name, description, base_price, discount, final_price, image, status, created_at) VALUES
(1000, 'Weekly Grocery Bundle', 'Essential groceries', 3500.00, 300.00, 3200.00, '', 1, '2025-01-01 10:00:00'),
(1001, 'Fresh Fruits Bundle', 'Fresh fruits pack', 1200.00, 100.00, 1100.00, '', 1, '2025-01-01 10:00:00');

-- ============================================
-- 9. BUNDLE ITEMS
-- ============================================
INSERT INTO bundle_items (id, bundle_id, product_id, quantity) VALUES
-- Weekly Grocery Bundle
(1000, 1000, 10008, 1), -- Rice
(1001, 1000, 10009, 1), -- Oil
(1002, 1000, 10001, 2), -- Tomato
(1003, 1000, 10002, 2), -- Potato
-- Fresh Fruits Bundle
(1004, 1001, 10004, 1), -- Apple
(1005, 1001, 10005, 1); -- Banana

-- ============================================
-- 10. SAMPLE ORDERS
-- ============================================
INSERT INTO orders (id, user_id, guest_name, guest_email, guest_phone, guest_address, subtotal, delivery_charge, total, currency, created_at, statuss, payment_status) VALUES
(1000, 1000, 'Ali Hassan', 'ali.hassan@test.com', '03001111111', 'House 10, Street 5, DHA Phase 1, Sector A', 1200.00, 0.00, 1200.00, 'PKR', '2025-01-01 12:00:00', 'Delivered', 'Received');

-- ============================================
-- 11. ORDER ITEMS
-- ============================================
INSERT INTO order_items (id, order_id, product_id, name, price, qty, total) VALUES
(1000, 1000, 10004, 'Apple Red 1kg', 330.00, 2, 660.00),
(1001, 1000, 10005, 'Banana 12pcs', 190.00, 1, 190.00),
(1002, 1000, 10006, 'Milk 1L', 240.00, 1, 240.00);

-- ============================================
-- COMMIT
-- ============================================
COMMIT;
SET FOREIGN_KEY_CHECKS = 1;
SET AUTOCOMMIT = 1;

-- Show what was inserted
SELECT 'Users inserted:' as Info, COUNT(*) as Count FROM users WHERE id >= 1000
UNION ALL
SELECT 'Products inserted:', COUNT(*) FROM dow WHERE id >= 10000
UNION ALL
SELECT 'Brands inserted:', COUNT(*) FROM brands WHERE id >= 1000
UNION ALL
SELECT 'Locations inserted:', COUNT(*) FROM locations WHERE id >= 1000
UNION ALL
SELECT 'Orders inserted:', COUNT(*) FROM orders WHERE id >= 1000;
