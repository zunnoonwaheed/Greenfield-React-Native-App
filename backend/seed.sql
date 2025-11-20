-- ============================================
-- Greenfield Supermarket - Seed Data
-- Sample data for development and testing
-- ============================================

-- Clear existing data (optional - comment out in production)
-- TRUNCATE TABLE notifications;
-- TRUNCATE TABLE notification_settings;
-- TRUNCATE TABLE bundle_items;
-- TRUNCATE TABLE bundles;
-- TRUNCATE TABLE locations;

-- ============================================
-- LOCATIONS (Phases and Sectors)
-- ============================================

-- Insert Phases (parent locations)
INSERT INTO `locations` (`name`, `parent_id`, `type`) VALUES
('DHA Phase 1', NULL, 'phase'),
('DHA Phase 2', NULL, 'phase'),
('DHA Phase 3', NULL, 'phase'),
('DHA Phase 4', NULL, 'phase'),
('DHA Phase 5', NULL, 'phase'),
('DHA Phase 6', NULL, 'phase'),
('Bahria Town', NULL, 'phase'),
('G-11', NULL, 'phase'),
('F-10', NULL, 'phase'),
('I-8', NULL, 'phase')
ON DUPLICATE KEY UPDATE name=name;

-- Insert Sectors for Phase 2 (assuming phase 2 has id 2)
INSERT INTO `locations` (`name`, `parent_id`, `type`) VALUES
('Sector A', 2, 'sector'),
('Sector B', 2, 'sector'),
('Sector C', 2, 'sector'),
('Sector D', 2, 'sector'),
('Sector E', 2, 'sector'),
('Sector F', 2, 'sector')
ON DUPLICATE KEY UPDATE name=name;

-- Insert Sectors for Phase 5 (assuming phase 5 has id 5)
INSERT INTO `locations` (`name`, `parent_id`, `type`) VALUES
('Sector A', 5, 'sector'),
('Sector B', 5, 'sector'),
('Sector C', 5, 'sector'),
('Sector D', 5, 'sector')
ON DUPLICATE KEY UPDATE name=name;

-- ============================================
-- CATEGORIES
-- ============================================

INSERT INTO `categories` (`name`, `slug`, `parent_id`, `status`) VALUES
('Grocery Bundles', 'grocery-bundles', NULL, 'active'),
('Fresh Produce', 'fresh-produce', NULL, 'active'),
('Dairy & Bakery', 'dairy-bakery', NULL, 'active'),
('Snacks & Beverages', 'snacks-beverages', NULL, 'active'),
('Meat & Poultry', 'meat-poultry', NULL, 'active'),
('Frozen Foods', 'frozen-foods', NULL, 'active'),
('Household Items', 'household-items', NULL, 'active'),
('Personal Care', 'personal-care', NULL, 'active'),
('Baby Products', 'baby-products', NULL, 'active'),
('Pet Supplies', 'pet-supplies', NULL, 'active')
ON DUPLICATE KEY UPDATE name=name;

-- ============================================
-- BUNDLES
-- ============================================

INSERT INTO `bundles` (`name`, `description`, `base_price`, `discount`, `final_price`, `original_price`, `discounted_price`, `is_featured`, `status`, `image`) VALUES
('Weekly Essentials Bundle', 'Rice, flour, cooking oil, sugar, tea, salt, and spices for the whole week', 2500.00, 20, 2000.00, 2500.00, 2000.00, 1, 'active', 'weekly-essentials.jpg'),
('Breakfast Combo', 'Bread, eggs, milk, butter, jam, and cereal to start your day right', 800.00, 15, 680.00, 800.00, 680.00, 1, 'active', 'breakfast-combo.jpg'),
('Snack Time Pack', 'Chips, biscuits, chocolates, and beverages for your snack cravings', 1200.00, 10, 1080.00, 1200.00, 1080.00, 1, 'active', 'snack-pack.jpg'),
('Cleaning Essentials', 'Detergent, dish soap, floor cleaner, and sponges', 1500.00, 18, 1230.00, 1500.00, 1230.00, 1, 'active', 'cleaning-bundle.jpg'),
('Family Meal Bundle', 'Meat, vegetables, rice, and spices for a complete family meal', 3500.00, 25, 2625.00, 3500.00, 2625.00, 1, 'active', 'family-meal.jpg'),
('Dairy Delight Pack', 'Milk, yogurt, cheese, butter, and cream', 1800.00, 12, 1584.00, 1800.00, 1584.00, 1, 'active', 'dairy-pack.jpg'),
('Beverage Bundle', 'Soft drinks, juices, tea, coffee, and water bottles', 1000.00, 15, 850.00, 1000.00, 850.00, 1, 'active', 'beverage-bundle.jpg'),
('Fresh Fruits Basket', 'Apples, bananas, oranges, grapes, and seasonal fruits', 1500.00, 10, 1350.00, 1500.00, 1350.00, 1, 'active', 'fruit-basket.jpg'),
('BBQ Party Pack', 'Meat, charcoal, sauces, and all BBQ essentials', 4000.00, 20, 3200.00, 4000.00, 3200.00, 1, 'active', 'bbq-pack.jpg')
ON DUPLICATE KEY UPDATE name=name;

-- ============================================
-- SAMPLE NOTIFICATIONS
-- ============================================

-- Sample notifications for user_id = 1 (if exists)
INSERT INTO `notifications` (`user_id`, `title`, `message`, `type`, `is_read`) VALUES
(1, 'Welcome to Greenfield!', 'Thank you for joining Greenfield Supermarket. Enjoy 10% off on your first order!', 'promo', 0),
(1, 'Order Confirmed', 'Your order #1001 has been confirmed and is being processed.', 'order', 1),
(1, 'Delivery Update', 'Your order #1001 is out for delivery and will arrive soon!', 'order', 0),
(1, 'New Products Added', 'Check out our latest collection of organic products!', 'general', 0),
(1, 'Special Offer', 'Weekend sale: Get 25% off on all bundles. Limited time offer!', 'promo', 0)
ON DUPLICATE KEY UPDATE title=title;

-- ============================================
-- SAMPLE NOTIFICATION SETTINGS
-- ============================================

-- Default settings for user_id = 1
INSERT INTO `notification_settings` (`user_id`, `email_notifications`, `push_notifications`, `sms_notifications`, `order_updates`, `promotional_emails`, `new_products`) VALUES
(1, 1, 1, 0, 1, 1, 1)
ON DUPLICATE KEY UPDATE user_id=user_id;

-- ============================================
-- SEED COMPLETE
-- ============================================

SELECT 'Seed data inserted successfully!' as message;
SELECT COUNT(*) as location_count FROM locations;
SELECT COUNT(*) as category_count FROM categories;
SELECT COUNT(*) as bundle_count FROM bundles;
SELECT COUNT(*) as notification_count FROM notifications;
