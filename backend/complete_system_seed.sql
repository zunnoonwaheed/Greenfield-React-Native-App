-- ============================================
-- COMPLETE SYSTEM SEED FILE FOR GREENFIELDS SUPERMARKET
-- Comprehensive Test Data for Full System Testing
-- ============================================
-- This file populates ALL tables with realistic test data
-- including: Users, Products, Orders, Bundles, Admin, Pages, etc.
-- ============================================

USE greenfieldsuperm_db_local;

-- Disable foreign key checks and autocommit
SET FOREIGN_KEY_CHECKS = 0;
SET AUTOCOMMIT = 0;
START TRANSACTION;

-- ============================================
-- 1. ADMIN USERS (members table)
-- ============================================
DELETE FROM `members` WHERE id >= 100;
INSERT INTO `members` (`id`, `namee`, `username`, `password`, `role`) VALUES
(100, 'Test Admin', 'testadmin', '1d30e0066dec80e9cf575f0517a95ed0', 'admin'),
(101, 'Test Manager', 'testmanager', '1d30e0066dec80e9cf575f0517a95ed0', 'manager'),
(102, 'Test Staff', 'teststaff', '1d30e0066dec80e9cf575f0517a95ed0', 'staff');
-- Password for all: "password" (MD5 hashed)

-- ============================================
-- 2. BRANDS
-- ============================================
DELETE FROM `brands` WHERE id >= 1000;
INSERT INTO `brands` (`id`, `name`, `slug`, `image`, `brID`, `title`, `descr`, `addhead`, `websiteID`, `mainID`) VALUES
(1000, 'Test Brand - Fresh Market', 'test-brand-fresh-market', NULL, 2, 'Test Brand - Fresh Market', 'Premium fresh products', '', 1, 2),
(1001, 'Test Brand - Organic Valley', 'test-brand-organic-valley', NULL, 2, 'Test Brand - Organic Valley', 'Certified organic products', '', 1, 2),
(1002, 'Test Brand - Home Essentials', 'test-brand-home-essentials', NULL, 2, 'Test Brand - Home Essentials', 'Daily home needs', '', 1, 2),
(1003, 'Test Brand - Premium Foods', 'test-brand-premium-foods', NULL, 2, 'Test Brand - Premium Foods', 'High quality food items', '', 1, 2),
(1004, 'Test Brand - Dairy Fresh', 'test-brand-dairy-fresh', NULL, 2, 'Test Brand - Dairy Fresh', 'Fresh dairy products', '', 1, 2);

-- ============================================
-- 3. PRODUCTS (dow table)
-- ============================================
DELETE FROM `dow` WHERE id >= 10000;
INSERT INTO `dow` (`id`, `brID`, `catID`, `mainID`, `statuss`, `namee`, `slug`, `code`, `desc1`, `imagee`, `datee`, `title`, `keyword`, `descr`, `addhead`, `tags`, `imagee3`, `price`, `dprice`, `sku`, `websiteID`, `imagee2`) VALUES
-- Vegetables & Fruits (mainID 2 = General Category)
(10001, 1000, 53, 2, 1, 'Test Tomato Fresh 1kg', 'test-tomato-fresh-1kg', '', 'Fresh red tomatoes', '', '2025-11-12', 'Test Tomato Fresh 1kg', 'tomato, fresh vegetables', 'Fresh red tomatoes', '', 'vegetables, fresh', '', 150, 140, 'TEST-TOM-001', 1, ''),
(10002, 1000, 53, 2, 1, 'Test Potato Premium 1kg', 'test-potato-premium-1kg', '', 'Premium quality potatoes', '', '2025-11-12', 'Test Potato Premium 1kg', 'potato, vegetables', 'Premium quality potatoes', '', 'vegetables', '', 120, 110, 'TEST-POT-001', 1, ''),
(10003, 1000, 53, 2, 1, 'Test Onion Red 1kg', 'test-onion-red-1kg', '', 'Fresh red onions', '', '2025-11-12', 'Test Onion Red 1kg', 'onion, vegetables', 'Fresh red onions', '', 'vegetables', '', 180, 170, 'TEST-ONI-001', 1, ''),
(10004, 1001, 54, 2, 1, 'Test Apple Red 1kg', 'test-apple-red-1kg', '', 'Fresh red apples', '', '2025-11-12', 'Test Apple Red 1kg', 'apple, fruits', 'Fresh red apples', '', 'fruits, fresh', '', 350, 330, 'TEST-APP-001', 1, ''),
(10005, 1001, 54, 2, 1, 'Test Banana Fresh (12 pcs)', 'test-banana-fresh', '', 'Fresh bananas', '', '2025-11-12', 'Test Banana Fresh (12 pcs)', 'banana, fruits', 'Fresh bananas', '', 'fruits', '', 200, 190, 'TEST-BAN-001', 1, ''),
(10006, 1001, 54, 2, 1, 'Test Orange Valencia 1kg', 'test-orange-valencia-1kg', '', 'Fresh oranges', '', '2025-11-12', 'Test Orange Valencia 1kg', 'orange, fruits, citrus', 'Fresh oranges', '', 'fruits', '', 300, 280, 'TEST-ORA-001', 1, ''),

-- Dairy Products
(10007, 1004, 55, 2, 1, 'Test Milk Full Cream 1L', 'test-milk-full-cream-1l', '', 'Full cream milk', '', '2025-11-12', 'Test Milk Full Cream 1L', 'milk, dairy', 'Full cream milk', '', 'dairy', '', 250, 240, 'TEST-MLK-001', 1, ''),
(10008, 1004, 55, 2, 1, 'Test Cheese Cheddar 200g', 'test-cheese-cheddar-200g', '', 'Premium cheddar cheese', '', '2025-11-12', 'Test Cheese Cheddar 200g', 'cheese, dairy', 'Premium cheddar cheese', '', 'dairy', '', 480, 460, 'TEST-CHE-001', 1, ''),
(10009, 1004, 55, 2, 1, 'Test Yogurt Natural 500g', 'test-yogurt-natural-500g', '', 'Natural yogurt', '', '2025-11-12', 'Test Yogurt Natural 500g', 'yogurt, dairy, dahi', 'Natural yogurt', '', 'dairy', '', 180, 170, 'TEST-YOG-001', 1, ''),
(10010, 1004, 55, 2, 1, 'Test Butter Salted 200g', 'test-butter-salted-200g', '', 'Salted butter', '', '2025-11-12', 'Test Butter Salted 200g', 'butter, dairy, makhan', 'Salted butter', '', 'dairy', '', 350, 340, 'TEST-BUT-001', 1, ''),

-- Bakery
(10011, 1002, 63, 2, 1, 'Test Bread Whole Wheat Large', 'test-bread-whole-wheat', '', 'Whole wheat bread', '', '2025-11-12', 'Test Bread Whole Wheat Large', 'bread, bakery, roti', 'Whole wheat bread', '', 'bakery', '', 130, 120, 'TEST-BRD-001', 1, ''),
(10012, 1002, 63, 2, 1, 'Test Bread White Large', 'test-bread-white', '', 'White bread', '', '2025-11-12', 'Test Bread White Large', 'bread, bakery', 'White bread', '', 'bakery', '', 110, 100, 'TEST-BRD-002', 1, ''),

-- Rice & Grains
(10013, 1003, 65, 2, 1, 'Test Basmati Rice Premium 5kg', 'test-basmati-rice-premium-5kg', '', 'Premium basmati rice', '', '2025-11-12', 'Test Basmati Rice Premium 5kg', 'rice, basmati, chawal', 'Premium basmati rice', '', 'rice, grains', '', 2600, 2500, 'TEST-RIC-001', 1, ''),
(10014, 1003, 65, 2, 1, 'Test Basmati Rice Super 10kg', 'test-basmati-rice-super-10kg', '', 'Super basmati rice 10kg pack', '', '2025-11-12', 'Test Basmati Rice Super 10kg', 'rice, basmati, chawal', 'Super basmati rice 10kg pack', '', 'rice, grains', '', 5200, 5000, 'TEST-RIC-002', 1, ''),

-- Cooking Essentials
(10015, 1003, 52, 2, 1, 'Test Cooking Oil 1L', 'test-cooking-oil-1l', '', 'Pure cooking oil', '', '2025-11-12', 'Test Cooking Oil 1L', 'oil, cooking, tel', 'Pure cooking oil', '', 'cooking', '', 580, 560, 'TEST-OIL-001', 1, ''),
(10016, 1003, 52, 2, 1, 'Test Cooking Oil 5L Pack', 'test-cooking-oil-5l-pack', '', 'Cooking oil economy pack', '', '2025-11-12', 'Test Cooking Oil 5L Pack', 'oil, cooking', 'Cooking oil economy pack', '', 'cooking', '', 2900, 2800, 'TEST-OIL-002', 1, ''),
(10017, 1003, 56, 2, 1, 'Test Sugar White 1kg', 'test-sugar-white-1kg', '', 'Pure white sugar', '', '2025-11-12', 'Test Sugar White 1kg', 'sugar, cheeni, chini', 'Pure white sugar', '', 'cooking', '', 220, 210, 'TEST-SUG-001', 1, ''),
(10018, 1003, 57, 2, 1, 'Test Salt Iodized 800g', 'test-salt-iodized-800g', '', 'Iodized salt', '', '2025-11-12', 'Test Salt Iodized 800g', 'salt, namak', 'Iodized salt', '', 'cooking', '', 85, 80, 'TEST-SAL-001', 1, ''),

-- Frozen Foods
(10019, 1003, 67, 2, 1, 'Test Chicken Nuggets 500g', 'test-chicken-nuggets-500g', '', 'Crispy chicken nuggets', '', '2025-11-12', 'Test Chicken Nuggets 500g', 'chicken, nuggets, frozen', 'Crispy chicken nuggets', '', 'frozen, chicken', '', 580, 560, 'TEST-CHK-001', 1, ''),
(10020, 1003, 67, 2, 1, 'Test Chicken Wings 1kg', 'test-chicken-wings-1kg', '', 'Fresh chicken wings', '', '2025-11-12', 'Test Chicken Wings 1kg', 'chicken, wings, frozen', 'Fresh chicken wings', '', 'frozen, chicken', '', 980, 960, 'TEST-CHK-002', 1, ''),
(10021, 1003, 67, 2, 1, 'Test Samosas Mix 12pcs', 'test-samosas-mix-12pcs', '', 'Assorted samosas', '', '2025-11-12', 'Test Samosas Mix 12pcs', 'samosa, frozen', 'Assorted samosas', '', 'frozen', '', 420, 400, 'TEST-SAM-001', 1, ''),

-- Beverages
(10022, 1002, 60, 2, 1, 'Test Soft Drink Cola 1.5L', 'test-soft-drink-cola-15l', '', 'Cola soft drink', '', '2025-11-12', 'Test Soft Drink Cola 1.5L', 'cola, drink, cold drink', 'Cola soft drink', '', 'beverages', '', 180, 170, 'TEST-COL-001', 1, ''),
(10023, 1002, 60, 2, 1, 'Test Soft Drink Lemon 1.5L', 'test-soft-drink-lemon-15l', '', 'Lemon soft drink', '', '2025-11-12', 'Test Soft Drink Lemon 1.5L', 'lemon, drink, cold drink', 'Lemon soft drink', '', 'beverages', '', 180, 170, 'TEST-LEM-001', 1, ''),
(10024, 1002, 120, 2, 1, 'Test Fruit Juice Mango 1L', 'test-fruit-juice-mango-1l', '', 'Pure mango juice', '', '2025-11-12', 'Test Fruit Juice Mango 1L', 'mango, juice, aam', 'Pure mango juice', '', 'beverages', '', 380, 360, 'TEST-JUI-001', 1, ''),
(10025, 1002, 120, 2, 1, 'Test Fruit Juice Orange 1L', 'test-fruit-juice-orange-1l', '', 'Fresh orange juice', '', '2025-11-12', 'Test Fruit Juice Orange 1L', 'orange, juice', 'Fresh orange juice', '', 'beverages', '', 380, 360, 'TEST-JUI-002', 1, ''),

-- Snacks
(10026, 1002, 76, 2, 1, 'Test Chips BBQ 100g', 'test-chips-bbq-100g', '', 'BBQ flavored chips', '', '2025-11-12', 'Test Chips BBQ 100g', 'chips, snacks', 'BBQ flavored chips', '', 'snacks', '', 120, 110, 'TEST-CHP-001', 1, ''),
(10027, 1002, 76, 2, 1, 'Test Chips Salt 100g', 'test-chips-salt-100g', '', 'Salted chips', '', '2025-11-12', 'Test Chips Salt 100g', 'chips, snacks', 'Salted chips', '', 'snacks', '', 120, 110, 'TEST-CHP-002', 1, ''),

-- Eggs
(10028, 1000, 89, 2, 1, 'Test Farm Eggs Pack of 12', 'test-farm-eggs-12', '', 'Fresh farm eggs', '', '2025-11-12', 'Test Farm Eggs Pack of 12', 'eggs, anday', 'Fresh farm eggs', '', 'eggs', '', 520, 500, 'TEST-EGG-001', 1, ''),
(10029, 1000, 89, 2, 1, 'Test Farm Eggs Pack of 30', 'test-farm-eggs-30', '', 'Fresh farm eggs tray', '', '2025-11-12', 'Test Farm Eggs Pack of 30', 'eggs, anday, tray', 'Fresh farm eggs tray', '', 'eggs', '', 1300, 1250, 'TEST-EGG-002', 1, '');

-- ============================================
-- 4. LOCATIONS
-- ============================================
DELETE FROM `locations` WHERE id >= 200;
INSERT INTO `locations` (`id`, `parent_id`, `name`, `type`) VALUES
(200, NULL, 'Test DHA Phase 1', 'phase'),
(201, 200, 'Test Sector A', 'sector'),
(202, 200, 'Test Sector B', 'sector'),
(203, 200, 'Test Sector C', 'sector'),
(204, NULL, 'Test DHA Phase 2', 'phase'),
(205, 204, 'Test Sector D', 'sector'),
(206, 204, 'Test Sector E', 'sector'),
(207, NULL, 'Test F-Sector', 'phase'),
(208, 207, 'Test F-6', 'sector'),
(209, 207, 'Test F-7', 'sector'),
(210, 207, 'Test F-8', 'sector'),
(211, NULL, 'Test G-Sector', 'phase'),
(212, 211, 'Test G-9', 'sector'),
(213, 211, 'Test G-10', 'sector'),
(214, 211, 'Test G-11', 'sector'),
(215, NULL, 'Test Bahria Town', 'phase'),
(216, 215, 'Test Phase 1', 'sector'),
(217, 215, 'Test Phase 2', 'sector'),
(218, 215, 'Test Phase 3', 'sector');

-- ============================================
-- 5. DELIVERY CHARGES
-- ============================================
DELETE FROM `delivery_charges` WHERE id >= 200;
INSERT INTO `delivery_charges` (`id`, `area`, `sector`, `charge`) VALUES
(200, 'Test DHA Phase 1', 'All Sectors', 0.00),
(201, 'Test DHA Phase 2', 'All Sectors', 50.00),
(202, 'Test F-Sector', 'All Sectors', 100.00),
(203, 'Test G-Sector', 'All Sectors', 100.00),
(204, 'Test Bahria Town', 'All Sectors', 150.00),
(205, 'Test Other Areas', NULL, 200.00);

-- ============================================
-- 6. USERS (customers)
-- ============================================
DELETE FROM `users` WHERE id >= 200;
-- Password for all test users: "password" (bcrypt hashed)
INSERT INTO `users` (`id`, `name`, `email`, `password`, `phone`, `address`, `created_at`) VALUES
(200, 'Ali Hassan', 'ali.hassan@testmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '03001111111', 'House 10, Street 5, Test DHA Phase 1, Sector A, Islamabad', '2025-11-01 08:00:00'),
(201, 'Ayesha Khan', 'ayesha.khan@testmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '03002222222', 'Apartment 5B, Test DHA Phase 2, Sector D, Islamabad', '2025-11-02 09:30:00'),
(202, 'Muhammad Ahmed', 'muhammad.ahmed@testmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '03003333333', 'House 25, Street 3, Test F-6, Islamabad', '2025-11-03 10:15:00'),
(203, 'Sara Malik', 'sara.malik@testmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '03004444444', 'Villa 15, Test Bahria Town, Phase 1, Rawalpindi', '2025-11-04 11:00:00'),
(204, 'Usman Ali', 'usman.ali@testmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '03005555555', 'House 45, Street 7, Test G-10, Islamabad', '2025-11-05 12:30:00'),
(205, 'Fatima Noor', 'fatima.noor@testmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '03006666666', 'Apartment 12A, Test DHA Phase 1, Sector B, Islamabad', '2025-11-06 14:00:00'),
(206, 'Hamza Rehman', 'hamza.rehman@testmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '03007777777', 'House 88, Street 12, Test Bahria Town, Phase 2, Rawalpindi', '2025-11-07 15:30:00'),
(207, 'Zainab Sheikh', 'zainab.sheikh@testmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '03008888888', 'House 32, Street 9, Test F-7, Islamabad', '2025-11-08 16:45:00'),
(208, 'Bilal Tariq', 'bilal.tariq@testmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '03009999999', 'Villa 101, Test Bahria Town, Phase 3, Rawalpindi', '2025-11-09 17:00:00'),
(209, 'Mariam Siddiqui', 'mariam.siddiqui@testmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '03001234567', 'House 55, Street 4, Test G-11, Islamabad', '2025-11-10 18:15:00');

-- ============================================
-- 7. BUNDLES
-- ============================================
DELETE FROM `bundles` WHERE id >= 200;
INSERT INTO `bundles` (`id`, `name`, `description`, `base_price`, `discount`, `final_price`, `image`, `status`, `created_at`) VALUES
(200, 'Test Weekly Grocery Bundle', 'Essential groceries for a week', 3500.00, 300.00, 3200.00, '', 'active', '2025-11-01 10:00:00'),
(201, 'Test Fresh Fruits Bundle', 'Assorted fresh fruits package', 1200.00, 100.00, 1100.00, '', 'active', '2025-11-02 11:00:00'),
(202, 'Test Breakfast Bundle', 'Complete breakfast essentials', 1800.00, 150.00, 1650.00, '', 'active', '2025-11-03 12:00:00'),
(203, 'Test Dairy Combo', 'All dairy products in one', 1400.00, 100.00, 1300.00, '', 'active', '2025-11-04 13:00:00'),
(204, 'Test Family Meal Bundle', 'Complete family meal package', 4500.00, 500.00, 4000.00, '', 'active', '2025-11-05 14:00:00');

-- ============================================
-- 8. BUNDLE ITEMS
-- ============================================
DELETE FROM `bundle_items` WHERE id >= 200;
INSERT INTO `bundle_items` (`id`, `bundle_id`, `product_id`, `quantity`) VALUES
-- Weekly Grocery Bundle (200)
(200, 200, 10013, 1), -- Rice 5kg
(201, 200, 10017, 2), -- Sugar 1kg x2
(202, 200, 10018, 1), -- Salt
(203, 200, 10015, 1), -- Oil 1L
(204, 200, 10001, 2), -- Tomato x2
(205, 200, 10002, 2), -- Potato x2
(206, 200, 10003, 1), -- Onion

-- Fresh Fruits Bundle (201)
(207, 201, 10004, 1), -- Apples
(208, 201, 10005, 1), -- Bananas
(209, 201, 10006, 1), -- Oranges

-- Breakfast Bundle (202)
(210, 202, 10011, 2), -- Bread x2
(211, 202, 10028, 1), -- Eggs 12
(212, 202, 10008, 1), -- Cheese
(213, 202, 10010, 1), -- Butter
(214, 202, 10007, 1), -- Milk

-- Dairy Combo (203)
(215, 203, 10007, 2), -- Milk x2
(216, 203, 10008, 1), -- Cheese
(217, 203, 10009, 2), -- Yogurt x2
(218, 203, 10010, 1), -- Butter

-- Family Meal Bundle (204)
(219, 204, 10013, 1), -- Rice 5kg
(220, 204, 10019, 2), -- Chicken Nuggets x2
(221, 204, 10020, 1), -- Chicken Wings
(222, 204, 10001, 2), -- Tomato x2
(223, 204, 10002, 2), -- Potato x2
(224, 204, 10003, 1), -- Onion
(225, 204, 10015, 1); -- Oil

-- ============================================
-- 9. ORDERS
-- ============================================
DELETE FROM `orders` WHERE id >= 200;
INSERT INTO `orders` (`id`, `user_id`, `guest_name`, `guest_email`, `guest_phone`, `guest_address`, `subtotal`, `delivery_charge`, `total`, `currency`, `created_at`, `statuss`, `payment_status`, `delivery_time`, `is_seen`) VALUES
-- Orders from registered users
(200, 200, 'Ali Hassan', 'ali.hassan@testmail.com', '03001111111', 'House 10, Street 5, Test DHA Phase 1, Sector A, Islamabad', 1200.00, 0.00, 1200.00, 'PKR', '2025-11-08 09:00:00', 'Delivered', 'Online', '2025-11-08 14:00:00', 1),
(201, 201, 'Ayesha Khan', 'ayesha.khan@testmail.com', '03002222222', 'Apartment 5B, Test DHA Phase 2, Sector D, Islamabad', 2500.00, 50.00, 2550.00, 'PKR', '2025-11-09 10:00:00', 'Delivered', 'COD', '2025-11-09 15:00:00', 1),
(202, 202, 'Muhammad Ahmed', 'muhammad.ahmed@testmail.com', '03003333333', 'House 25, Street 3, Test F-6, Islamabad', 3800.00, 100.00, 3900.00, 'PKR', '2025-11-10 11:00:00', 'otw', 'Online', '2025-11-10 16:00:00', 1),
(203, 203, 'Sara Malik', 'sara.malik@testmail.com', '03004444444', 'Villa 15, Test Bahria Town, Phase 1, Rawalpindi', 1850.00, 150.00, 2000.00, 'PKR', '2025-11-10 12:00:00', 'Processed', 'COD', '2025-11-10 17:00:00', 1),
(204, 204, 'Usman Ali', 'usman.ali@testmail.com', '03005555555', 'House 45, Street 7, Test G-10, Islamabad', 3200.00, 100.00, 3300.00, 'PKR', '2025-11-11 09:30:00', 'Current', 'Online', '2025-11-11 14:30:00', 1),
(205, 205, 'Fatima Noor', 'fatima.noor@testmail.com', '03006666666', 'Apartment 12A, Test DHA Phase 1, Sector B, Islamabad', 1100.00, 0.00, 1100.00, 'PKR', '2025-11-11 10:30:00', 'Current', 'COD', '2025-11-11 15:30:00', 0),
(206, 206, 'Hamza Rehman', 'hamza.rehman@testmail.com', '03007777777', 'House 88, Street 12, Test Bahria Town, Phase 2, Rawalpindi', 4000.00, 150.00, 4150.00, 'PKR', '2025-11-11 11:30:00', 'Current', 'Online', '2025-11-11 16:30:00', 0),
(207, 207, 'Zainab Sheikh', 'zainab.sheikh@testmail.com', '03008888888', 'House 32, Street 9, Test F-7, Islamabad', 2300.00, 100.00, 2400.00, 'PKR', '2025-11-12 08:00:00', 'Current', 'Pending', '2025-11-12 13:00:00', 0),

-- Guest orders (no user_id)
(208, NULL, 'Imran Guest', 'imran.guest@testmail.com', '03101234567', 'House 99, Street 15, Test DHA Phase 1, Sector C, Islamabad', 1680.00, 0.00, 1680.00, 'PKR', '2025-11-12 09:00:00', 'Current', 'COD', '2025-11-12 14:00:00', 0),
(209, NULL, 'Sana Guest', 'sana.guest@testmail.com', '03201234567', 'Apartment 22, Test G-9, Islamabad', 890.00, 100.00, 990.00, 'PKR', '2025-11-12 10:00:00', 'Current', 'COD', '2025-11-12 15:00:00', 0),
(210, NULL, 'Fahad Guest', 'fahad.guest@testmail.com', '03301234567', 'Villa 5, Test Bahria Town, Phase 1, Rawalpindi', 5460.00, 150.00, 5610.00, 'PKR', '2025-11-12 11:00:00', 'Current', 'Online', '2025-11-12 16:00:00', 0);

-- ============================================
-- 10. ORDER ITEMS
-- ============================================
DELETE FROM `order_items` WHERE id >= 200;
INSERT INTO `order_items` (`id`, `order_id`, `bundle_id`, `product_id`, `name`, `price`, `qty`, `total`) VALUES
-- Order 200 (Ali Hassan - Delivered)
(200, 200, NULL, 10004, 'Test Apple Red 1kg', 330.00, 2, 660.00),
(201, 200, NULL, 10005, 'Test Banana Fresh (12 pcs)', 190.00, 1, 190.00),
(202, 200, NULL, 10006, 'Test Orange Valencia 1kg', 280.00, 1, 280.00),
(203, 200, NULL, 10024, 'Test Fruit Juice Mango 1L', 360.00, 1, 360.00),

-- Order 201 (Ayesha Khan - Delivered)
(204, 201, NULL, 10013, 'Test Basmati Rice Premium 5kg', 2500.00, 1, 2500.00),

-- Order 202 (Muhammad Ahmed - On The Way)
(205, 202, NULL, 10007, 'Test Milk Full Cream 1L', 240.00, 3, 720.00),
(206, 202, NULL, 10008, 'Test Cheese Cheddar 200g', 460.00, 2, 920.00),
(207, 202, NULL, 10009, 'Test Yogurt Natural 500g', 170.00, 4, 680.00),
(208, 202, NULL, 10011, 'Test Bread Whole Wheat Large', 120.00, 5, 600.00),
(209, 202, NULL, 10028, 'Test Farm Eggs Pack of 12', 500.00, 2, 1000.00),

-- Order 203 (Sara Malik - Processed)
(210, 203, NULL, 10019, 'Test Chicken Nuggets 500g', 560.00, 2, 1120.00),
(211, 203, NULL, 10021, 'Test Samosas Mix 12pcs', 400.00, 1, 400.00),
(212, 203, NULL, 10026, 'Test Chips BBQ 100g', 110.00, 3, 330.00),

-- Order 204 (Usman Ali - Current) - Bundle Order
(213, 204, 200, NULL, 'Test Weekly Grocery Bundle', 3200.00, 1, 3200.00),

-- Order 205 (Fatima Noor - Current)
(214, 205, 201, NULL, 'Test Fresh Fruits Bundle', 1100.00, 1, 1100.00),

-- Order 206 (Hamza Rehman - Current)
(215, 206, 204, NULL, 'Test Family Meal Bundle', 4000.00, 1, 4000.00),

-- Order 207 (Zainab Sheikh - Current)
(216, 207, NULL, 10001, 'Test Tomato Fresh 1kg', 140.00, 5, 700.00),
(217, 207, NULL, 10002, 'Test Potato Premium 1kg', 110.00, 5, 550.00),
(218, 207, NULL, 10003, 'Test Onion Red 1kg', 170.00, 3, 510.00),
(219, 207, NULL, 10018, 'Test Salt Iodized 800g', 80.00, 2, 160.00),
(220, 207, NULL, 10017, 'Test Sugar White 1kg', 210.00, 2, 420.00),

-- Order 208 (Imran Guest - Current)
(221, 208, NULL, 10019, 'Test Chicken Nuggets 500g', 560.00, 3, 1680.00),

-- Order 209 (Sana Guest - Current)
(222, 209, NULL, 10022, 'Test Soft Drink Cola 1.5L', 170.00, 3, 510.00),
(223, 209, NULL, 10023, 'Test Soft Drink Lemon 1.5L', 170.00, 1, 170.00),
(224, 209, NULL, 10026, 'Test Chips BBQ 100g', 110.00, 2, 220.00),

-- Order 210 (Fahad Guest - Current) - Multiple bundles
(225, 210, 200, NULL, 'Test Weekly Grocery Bundle', 3200.00, 1, 3200.00),
(226, 210, 203, NULL, 'Test Dairy Combo', 1300.00, 1, 1300.00),
(227, 210, NULL, 10020, 'Test Chicken Wings 1kg', 960.00, 1, 960.00);

-- ============================================
-- 11. TEXT PAGES (Content Pages)
-- ============================================
DELETE FROM `textpage` WHERE id >= 200;
INSERT INTO `textpage` (`id`, `namee`, `menu_namee`, `icon`, `tagline`, `desc1`, `pageData`, `title`, `keyword`, `descr`, `imagee`, `image2`, `short_desc`, `pageID`, `slug`, `slug1`, `websiteID`, `addhead`) VALUES
(200, 'Test About Us', 'About Us', 'fa fa-info', 'Learn About Us', '', '<h1>About Test Greenfield Supermarket</h1><p>We are your trusted online grocery store providing fresh products delivered to your doorstep.</p><p>Test content for about us page.</p>', 'About Us - Test Page', 'about, company, greenfield', 'Learn more about our test company', '', '', 'We are your trusted store', 1, 'test-about-us', '', 1, ''),
(201, 'Test Contact Us', 'Contact', 'fa fa-phone', 'Get in Touch', '', '<h1>Contact Us</h1><p>Email: test@greenfield.com</p><p>Phone: 051-1234567</p><p>Address: Test Location, Islamabad</p>', 'Contact Us - Test Page', 'contact, reach us', 'Contact our test store', '', '', 'Get in touch with us', 2, 'test-contact', '', 1, ''),
(202, 'Test Privacy Policy', 'Privacy', 'fa fa-lock', 'Our Privacy Policy', '', '<h1>Privacy Policy</h1><p>Test privacy policy content. We protect your data.</p><p>All information is kept confidential.</p>', 'Privacy Policy - Test', 'privacy, policy', 'Our test privacy policy', '', '', 'We protect your privacy', 3, 'test-privacy', '', 1, ''),
(203, 'Test Terms & Conditions', 'Terms', 'fa fa-file', 'Terms of Service', '', '<h1>Terms and Conditions</h1><p>Test terms and conditions content.</p><p>By using our service, you agree to these terms.</p>', 'Terms & Conditions - Test', 'terms, conditions', 'Our test terms and conditions', '', '', 'Terms of service', 4, 'test-terms', '', 1, ''),
(204, 'Test FAQ', 'FAQ', 'fa fa-question', 'Frequently Asked Questions', '', '<h1>FAQ</h1><h3>Q: How to order?</h3><p>A: Browse products and add to cart.</p><h3>Q: Delivery time?</h3><p>A: 3-5 hours in most areas.</p>', 'FAQ - Test Page', 'faq, questions', 'Frequently asked test questions', '', '', 'Common questions', 5, 'test-faq', '', 1, '');

-- ============================================
-- 12. HOME PAGE SETTINGS
-- ============================================
DELETE FROM `homep` WHERE id >= 200;
INSERT INTO `homep` (`id`, `section1`, `section2`, `section3`, `section4`, `section5`, `section6`, `section7`, `section8`, `section9`, `section10`) VALUES
(200, 'Test Welcome Banner', 'Test Featured Products', 'Test Best Sellers', 'Test New Arrivals', 'Test Special Offers', 'Test Categories', 'Test Brands', 'Test Testimonials', '<p>Test section 9 content</p>', '<p>Test section 10 content</p>');

-- ============================================
-- 13. STORES/BANNERS
-- ============================================
DELETE FROM `stores` WHERE id >= 200;
INSERT INTO `stores` (`id`, `imagee`, `linkk`, `locat`, `sortID`, `websiteID`) VALUES
(200, 'test-banner-1.jpg', '/test-products', 1, 1, 1),
(201, 'test-banner-2.jpg', '/test-offers', 1, 2, 1),
(202, 'test-logo.jpg', '/', 2, 1, 1);

-- ============================================
-- 14. PASSWORD RESETS (for testing)
-- ============================================
DELETE FROM `password_resets` WHERE email LIKE '%@testmail.com';
INSERT INTO `password_resets` (`email`, `token`, `expires_at`) VALUES
('ali.hassan@testmail.com', 'test_reset_token_12345', DATE_ADD(NOW(), INTERVAL 24 HOUR)),
('ayesha.khan@testmail.com', 'test_reset_token_67890', DATE_ADD(NOW(), INTERVAL 24 HOUR));

-- ============================================
-- 15. INVOICES (Test Invoices)
-- ============================================
DELETE FROM `invoice` WHERE id >= 200;
INSERT INTO `invoice` (`id`, `date`, `due_date`, `email`, `particulars`, `amount`, `payment_method`, `status`) VALUES
(200, '2025-11-08', '2025-11-15', 'ali.hassan@testmail.com', 'Order #200 - Test Order', 1200, 'Online', 'Paid'),
(201, '2025-11-09', '2025-11-16', 'ayesha.khan@testmail.com', 'Order #201 - Test Order', 2550, 'COD', 'Paid'),
(202, '2025-11-10', '2025-11-17', 'muhammad.ahmed@testmail.com', 'Order #202 - Test Order', 3900, 'Online', 'Pending');

-- Commit transaction
COMMIT;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;
SET AUTOCOMMIT = 1;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================
SELECT 'Test data seeded successfully!' AS Status;
SELECT '=' AS '';
SELECT 'DATA SUMMARY' AS '';
SELECT '=' AS '';
SELECT COUNT(*) AS 'Admin Users (members)' FROM members WHERE id >= 100;
SELECT COUNT(*) AS 'Test Brands' FROM brands WHERE id >= 1000;
SELECT COUNT(*) AS 'Test Products (dow)' FROM dow WHERE id >= 10000;
SELECT COUNT(*) AS 'Test Locations' FROM locations WHERE id >= 200;
SELECT COUNT(*) AS 'Delivery Charges' FROM delivery_charges WHERE id >= 200;
SELECT COUNT(*) AS 'Test Users (customers)' FROM users WHERE id >= 200;
SELECT COUNT(*) AS 'Test Bundles' FROM bundles WHERE id >= 200;
SELECT COUNT(*) AS 'Bundle Items' FROM bundle_items WHERE id >= 200;
SELECT COUNT(*) AS 'Test Orders' FROM orders WHERE id >= 200;
SELECT COUNT(*) AS 'Order Items' FROM order_items WHERE id >= 200;
SELECT COUNT(*) AS 'Text Pages' FROM textpage WHERE id >= 200;
SELECT '=' AS '';

-- Show order status distribution
SELECT statuss, COUNT(*) as count, payment_status
FROM orders WHERE id >= 200
GROUP BY statuss, payment_status
ORDER BY statuss;

-- Show products by category
SELECT mainID, COUNT(*) as product_count
FROM dow WHERE id >= 10000
GROUP BY mainID;

-- ============================================
-- TEST USER CREDENTIALS
-- ============================================
/*
ADMIN USERS (members):
- Username: testadmin, Password: password
- Username: testmanager, Password: password
- Username: teststaff, Password: password

CUSTOMER USERS:
All test customer users have:
- Password: Test@123
- Emails: see users table (ali.hassan@testmail.com, etc.)

TEST DATA IDs:
- Members: 100-102
- Brands: 1000-1004
- Products: 10001-10029 (29 products)
- Locations: 200-218
- Delivery Charges: 200-205
- Users: 200-209 (10 users)
- Bundles: 200-204 (5 bundles)
- Orders: 200-210 (11 orders)
- Order Items: 200-227
- Text Pages: 200-204

All test IDs start from 200/1000/10000 to avoid conflicts with production data
*/
