-- ============================================
-- COMPREHENSIVE SEED FILE FOR GREENFIELD SUPERMARKET
-- Complete Dynamic Data for Homepage and Full Functionality
-- Categories, Products, Bundles all matching frontend requirements
-- ============================================

USE greenfieldsuperm_db_local;

-- Disable checks
SET FOREIGN_KEY_CHECKS = 0;
SET AUTOCOMMIT = 0;
START TRANSACTION;

-- ============================================
-- 1. CLEAN UP (Remove test data only)
-- ============================================
DELETE FROM order_items WHERE order_id >= 200;
DELETE FROM orders WHERE id >= 200;
DELETE FROM users WHERE id >= 200;
DELETE FROM bundle_items WHERE bundle_id >= 200;
DELETE FROM bundles WHERE id >= 200;
DELETE FROM dow WHERE id >= 10000;
DELETE FROM brands WHERE id >= 1000;
DELETE FROM categories WHERE id >= 100;
DELETE FROM locations WHERE id >= 200;
DELETE FROM delivery_charges WHERE id >= 200;
DELETE FROM exchange WHERE id >= 100;

-- ============================================
-- 2. EXCHANGE RATES
-- ============================================
INSERT INTO exchange (id, name, currency, exchange_rate, default_currency) VALUES
(100, 'Pakistani Rupee', 'PKR', 1.00, 1);

-- ============================================
-- 3. CATEGORIES (matching frontend requirements EXACTLY)
-- ============================================
INSERT INTO categories (id, name, icon) VALUES
-- Main Categories - Matching frontend HomescreenNew.tsx (in specific order)
(100, 'Grocery', 'shop-cat1.png'),
(101, 'Fresh Produce', 'shop-cat4.png'),
(102, 'Snacks', 'shop-cat3.png'),
(103, 'Beverages', 'shop-cat2.png');

-- ============================================
-- 4. BRANDS
-- ============================================
INSERT INTO brands (id, name, slug, image, brID, title, descr, addhead, websiteID, mainID) VALUES
(1000, 'Fresh Valley', 'fresh-valley', NULL, 2, 'Fresh Valley', 'Farm fresh products', '', 1, 2),
(1001, 'Organic Best', 'organic-best', NULL, 2, 'Organic Best', 'Premium organic products', '', 1, 2),
(1002, 'Home Essentials', 'home-essentials', NULL, 2, 'Home Essentials', 'Daily home needs', '', 1, 2),
(1003, 'Premium Foods', 'premium-foods', NULL, 2, 'Premium Foods', 'High quality food items', '', 1, 2),
(1004, 'Dairy Fresh', 'dairy-fresh', NULL, 2, 'Dairy Fresh', 'Fresh dairy products', '', 1, 2);

-- ============================================
-- 5. PRODUCTS - GROCERIES (100+)
-- ============================================
INSERT INTO dow (id, brID, catID, mainID, statuss, namee, slug, code, desc1, imagee, datee, title, keyword, descr, addhead, tags, imagee3, price, dprice, sku, websiteID, imagee2) VALUES
-- Rice & Grains
(10001, 1003, 100, 2, 1, 'Basmati Rice Premium 5kg', 'basmati-rice-premium-5kg', 'RIC001', 'Premium basmati rice', 'rice.png', '2025-01-01', 'Basmati Rice Premium 5kg', 'rice, basmati', 'Premium quality basmati rice', '', 'groceries,rice', '', 2600, 2500, 'RIC-5KG-001', 1, ''),
(10002, 1003, 100, 2, 1, 'Basmati Rice Super 10kg', 'basmati-rice-super-10kg', 'RIC002', 'Super basmati rice', 'rice.png', '2025-01-01', 'Basmati Rice Super 10kg', 'rice, basmati', 'Super basmati rice 10kg pack', '', 'groceries,rice', '', 5200, 5000, 'RIC-10KG-001', 1, ''),
(10003, 1003, 100, 2, 1, 'White Rice 5kg', 'white-rice-5kg', 'RIC003', 'White rice', 'rice.png', '2025-01-01', 'White Rice 5kg', 'rice', 'Quality white rice', '', 'groceries,rice', '', 2200, 2100, 'RIC-5KG-002', 1, ''),

-- Cooking Oil
(10004, 1003, 100, 2, 1, 'Cooking Oil 1L', 'cooking-oil-1l', 'OIL001', 'Pure cooking oil', 'oil.png', '2025-01-01', 'Cooking Oil 1L', 'oil', 'Pure cooking oil', '', 'groceries,oil', '', 580, 560, 'OIL-1L-001', 1, ''),
(10005, 1003, 100, 2, 1, 'Cooking Oil 5L Pack', 'cooking-oil-5l', 'OIL002', 'Cooking oil economy pack', 'oil.png', '2025-01-01', 'Cooking Oil 5L Pack', 'oil', 'Economy pack cooking oil', '', 'groceries,oil', '', 2900, 2800, 'OIL-5L-001', 1, ''),
(10006, 1003, 100, 2, 1, 'Olive Oil Extra Virgin 500ml', 'olive-oil-500ml', 'OIL003', 'Extra virgin olive oil', 'oil.png', '2025-01-01', 'Olive Oil Extra Virgin 500ml', 'olive oil', 'Premium olive oil', '', 'groceries,oil', '', 1800, 1750, 'OIL-500ML-001', 1, ''),

-- Sugar & Salt
(10007, 1003, 100, 2, 1, 'White Sugar 1kg', 'white-sugar-1kg', 'SUG001', 'Pure white sugar', 'sugar.png', '2025-01-01', 'White Sugar 1kg', 'sugar', 'Pure white sugar', '', 'groceries,sugar', '', 220, 210, 'SUG-1KG-001', 1, ''),
(10008, 1003, 100, 2, 1, 'White Sugar 5kg', 'white-sugar-5kg', 'SUG002', 'Pure white sugar pack', 'sugar.png', '2025-01-01', 'White Sugar 5kg', 'sugar', 'Economy sugar pack', '', 'groceries,sugar', '', 1100, 1050, 'SUG-5KG-001', 1, ''),
(10009, 1003, 100, 2, 1, 'Iodized Salt 800g', 'iodized-salt-800g', 'SAL001', 'Iodized salt', 'salt.png', '2025-01-01', 'Iodized Salt 800g', 'salt', 'Premium iodized salt', '', 'groceries,salt', '', 85, 80, 'SAL-800G-001', 1, ''),
(10010, 1003, 100, 2, 1, 'Pink Salt 1kg', 'pink-salt-1kg', 'SAL002', 'Himalayan pink salt', 'salt.png', '2025-01-01', 'Pink Salt 1kg', 'pink salt', 'Pure Himalayan pink salt', '', 'groceries,salt', '', 450, 430, 'SAL-1KG-001', 1, ''),

-- Pulses & Lentils
(10011, 1003, 100, 2, 1, 'Red Lentils (Masoor Dal) 1kg', 'red-lentils-1kg', 'DAL001', 'Red lentils', 'lobia.png', '2025-01-01', 'Red Lentils (Masoor Dal) 1kg', 'dal, lentils', 'Premium red lentils', '', 'groceries,dal', '', 380, 360, 'DAL-1KG-001', 1, ''),
(10012, 1003, 100, 2, 1, 'Chickpeas (Chana) 1kg', 'chickpeas-1kg', 'DAL002', 'Chickpeas', 'lobia.png', '2025-01-01', 'Chickpeas (Chana) 1kg', 'chana, chickpeas', 'Quality chickpeas', '', 'groceries,dal', '', 320, 300, 'DAL-1KG-002', 1, ''),
(10013, 1003, 100, 2, 1, 'Black Lentils (Urad Dal) 1kg', 'black-lentils-1kg', 'DAL003', 'Black lentils', 'lobia.png', '2025-01-01', 'Black Lentils (Urad Dal) 1kg', 'dal, lentils', 'Premium black lentils', '', 'groceries,dal', '', 420, 400, 'DAL-1KG-003', 1, ''),
(10014, 1003, 100, 2, 1, 'Yellow Lentils (Moong Dal) 1kg', 'yellow-lentils-1kg', 'DAL004', 'Yellow lentils', 'lobia.png', '2025-01-01', 'Yellow Lentils (Moong Dal) 1kg', 'dal, lentils', 'Premium yellow lentils', '', 'groceries,dal', '', 340, 320, 'DAL-1KG-004', 1, ''),

-- Flour & Atta
(10015, 1003, 100, 2, 1, 'Wheat Flour (Atta) 10kg', 'wheat-flour-10kg', 'FLR001', 'Whole wheat flour', 'flour.png', '2025-01-01', 'Wheat Flour (Atta) 10kg', 'atta, flour', 'Premium wheat flour', '', 'groceries,flour', '', 1800, 1750, 'FLR-10KG-001', 1, ''),
(10016, 1003, 100, 2, 1, 'All Purpose Flour (Maida) 5kg', 'all-purpose-flour-5kg', 'FLR002', 'All purpose flour', 'flour.png', '2025-01-01', 'All Purpose Flour (Maida) 5kg', 'maida, flour', 'Fine quality maida', '', 'groceries,flour', '', 900, 850, 'FLR-5KG-001', 1, ''),

-- Spices
(10017, 1003, 100, 2, 1, 'Red Chilli Powder 200g', 'red-chilli-powder-200g', 'SPC001', 'Red chilli powder', 'spices.png', '2025-01-01', 'Red Chilli Powder 200g', 'chilli, spices', 'Premium chilli powder', '', 'groceries,spices', '', 280, 260, 'SPC-200G-001', 1, ''),
(10018, 1003, 100, 2, 1, 'Turmeric Powder 200g', 'turmeric-powder-200g', 'SPC002', 'Turmeric powder', 'spices.png', '2025-01-01', 'Turmeric Powder 200g', 'haldi, turmeric', 'Pure turmeric powder', '', 'groceries,spices', '', 320, 300, 'SPC-200G-002', 1, ''),
(10019, 1003, 100, 2, 1, 'Coriander Powder 200g', 'coriander-powder-200g', 'SPC003', 'Coriander powder', 'spices.png', '2025-01-01', 'Coriander Powder 200g', 'dhaniya, coriander', 'Fresh coriander powder', '', 'groceries,spices', '', 240, 220, 'SPC-200G-003', 1, ''),
(10020, 1003, 100, 2, 1, 'Garam Masala 100g', 'garam-masala-100g', 'SPC004', 'Garam masala', 'spices.png', '2025-01-01', 'Garam Masala 100g', 'masala, spices', 'Aromatic garam masala', '', 'groceries,spices', '', 380, 360, 'SPC-100G-001', 1, '');

-- ============================================
-- 6. PRODUCTS - FRESH PRODUCE
-- ============================================
INSERT INTO dow (id, brID, catID, mainID, statuss, namee, slug, code, desc1, imagee, datee, title, keyword, descr, addhead, tags, imagee3, price, dprice, sku, websiteID, imagee2) VALUES
-- Vegetables
(10021, 1000, 101, 2, 1, 'Tomato Fresh 1kg', 'tomato-fresh-1kg', 'VEG001', 'Fresh red tomatoes', 'tomatoes.png', '2025-01-01', 'Tomato Fresh 1kg', 'tomato', 'Farm fresh tomatoes', '', 'vegetables,fresh', '', 150, 140, 'VEG-TOM-001', 1, ''),
(10022, 1000, 101, 2, 1, 'Potato Premium 1kg', 'potato-premium-1kg', 'VEG002', 'Premium quality potatoes', 'potatoes.png', '2025-01-01', 'Potato Premium 1kg', 'potato', 'Fresh potatoes', '', 'vegetables,fresh', '', 120, 110, 'VEG-POT-001', 1, ''),
(10023, 1000, 101, 2, 1, 'Onion Red 1kg', 'onion-red-1kg', 'VEG003', 'Fresh red onions', 'onions.png', '2025-01-01', 'Onion Red 1kg', 'onion', 'Quality red onions', '', 'vegetables,fresh', '', 180, 170, 'VEG-ONI-001', 1, ''),
(10024, 1000, 101, 2, 1, 'Green Chillies 250g', 'green-chillies-250g', 'VEG004', 'Fresh green chillies', 'green-chillies.png', '2025-01-01', 'Green Chillies 250g', 'chilli', 'Hot green chillies', '', 'vegetables,fresh', '', 140, 130, 'VEG-CHI-001', 1, ''),
(10025, 1000, 101, 2, 1, 'Ginger Fresh 500g', 'ginger-fresh-500g', 'VEG005', 'Fresh ginger', 'ginger.png', '2025-01-01', 'Ginger Fresh 500g', 'ginger, adrak', 'Quality ginger', '', 'vegetables,fresh', '', 320, 300, 'VEG-GIN-001', 1, ''),
(10026, 1000, 101, 2, 1, 'Garlic Fresh 500g', 'garlic-fresh-500g', 'VEG006', 'Fresh garlic', 'garlic.png', '2025-01-01', 'Garlic Fresh 500g', 'garlic, lehsan', 'Quality garlic', '', 'vegetables,fresh', '', 480, 460, 'VEG-GAR-001', 1, ''),
(10027, 1000, 101, 2, 1, 'Cucumber Fresh 1kg', 'cucumber-fresh-1kg', 'VEG007', 'Fresh cucumbers', 'cucumber.png', '2025-01-01', 'Cucumber Fresh 1kg', 'cucumber, kheera', 'Crispy cucumbers', '', 'vegetables,fresh', '', 160, 150, 'VEG-CUC-001', 1, ''),
(10028, 1000, 101, 2, 1, 'Carrots Fresh 1kg', 'carrots-fresh-1kg', 'VEG008', 'Fresh carrots', 'carrots.png', '2025-01-01', 'Carrots Fresh 1kg', 'carrot, gajar', 'Fresh orange carrots', '', 'vegetables,fresh', '', 200, 190, 'VEG-CAR-001', 1, ''),

-- Fruits
(10029, 1001, 101, 2, 1, 'Apple Red 1kg', 'apple-red-1kg', 'FRT001', 'Fresh red apples', 'apples.png', '2025-01-01', 'Apple Red 1kg', 'apple, seb', 'Premium red apples', '', 'fruits,fresh', '', 350, 330, 'FRT-APP-001', 1, ''),
(10030, 1001, 101, 2, 1, 'Banana Fresh Dozen', 'banana-fresh-dozen', 'FRT002', 'Fresh bananas', 'bananas.png', '2025-01-01', 'Banana Fresh Dozen', 'banana, kela', 'Sweet ripe bananas', '', 'fruits,fresh', '', 200, 190, 'FRT-BAN-001', 1, ''),
(10031, 1001, 101, 2, 1, 'Orange Valencia 1kg', 'orange-valencia-1kg', 'FRT003', 'Fresh oranges', 'oranges.png', '2025-01-01', 'Orange Valencia 1kg', 'orange, santra', 'Juicy oranges', '', 'fruits,fresh', '', 300, 280, 'FRT-ORA-001', 1, ''),
(10032, 1001, 101, 2, 1, 'Mango (Seasonal) 1kg', 'mango-seasonal-1kg', 'FRT004', 'Fresh mangoes', 'mangoes.png', '2025-01-01', 'Mango (Seasonal) 1kg', 'mango, aam', 'Sweet mangoes', '', 'fruits,fresh', '', 450, 430, 'FRT-MAN-001', 1, ''),
(10033, 1001, 101, 2, 1, 'Grapes Green 500g', 'grapes-green-500g', 'FRT005', 'Fresh green grapes', 'grapes.png', '2025-01-01', 'Grapes Green 500g', 'grapes, angoor', 'Sweet seedless grapes', '', 'fruits,fresh', '', 520, 500, 'FRT-GRA-001', 1, ''),
(10034, 1001, 101, 2, 1, 'Watermelon Medium', 'watermelon-medium', 'FRT006', 'Fresh watermelon', 'watermelon.png', '2025-01-01', 'Watermelon Medium', 'watermelon, tarbooz', 'Juicy watermelon', '', 'fruits,fresh', '', 380, 360, 'FRT-WAT-001', 1, ''),
(10035, 1001, 101, 2, 1, 'Pomegranate 500g', 'pomegranate-500g', 'FRT007', 'Fresh pomegranate', 'pomegranate.png', '2025-01-01', 'Pomegranate 500g', 'pomegranate, anar', 'Fresh anardana', '', 'fruits,fresh', '', 680, 650, 'FRT-POM-001', 1, ''),
(10036, 1001, 101, 2, 1, 'Papaya Fresh 1kg', 'papaya-fresh-1kg', 'FRT008', 'Fresh papaya', 'papaya.png', '2025-01-01', 'Papaya Fresh 1kg', 'papaya, papita', 'Ripe papaya', '', 'fruits,fresh', '', 220, 200, 'FRT-PAP-001', 1, '');

-- ============================================
-- 7. PRODUCTS - DAIRY & BAKERY
-- ============================================
INSERT INTO dow (id, brID, catID, mainID, statuss, namee, slug, code, desc1, imagee, datee, title, keyword, descr, addhead, tags, imagee3, price, dprice, sku, websiteID, imagee2) VALUES
-- Dairy
(10037, 1004, 102, 2, 1, 'Milk Full Cream 1L', 'milk-full-cream-1l', 'DRY001', 'Full cream milk', 'milk.png', '2025-01-01', 'Milk Full Cream 1L', 'milk, doodh', 'Fresh full cream milk', '', 'dairy', '', 250, 240, 'DRY-MLK-001', 1, ''),
(10038, 1004, 102, 2, 1, 'Milk Skimmed 1L', 'milk-skimmed-1l', 'DRY002', 'Skimmed milk', 'milk.png', '2025-01-01', 'Milk Skimmed 1L', 'milk, doodh', 'Low fat milk', '', 'dairy', '', 230, 220, 'DRY-MLK-002', 1, ''),
(10039, 1004, 102, 2, 1, 'Cheese Cheddar 200g', 'cheese-cheddar-200g', 'DRY003', 'Premium cheddar cheese', 'cheese.png', '2025-01-01', 'Cheese Cheddar 200g', 'cheese', 'Premium cheddar', '', 'dairy', '', 480, 460, 'DRY-CHE-001', 1, ''),
(10040, 1004, 102, 2, 1, 'Cheese Mozzarella 200g', 'cheese-mozzarella-200g', 'DRY004', 'Mozzarella cheese', 'cheese.png', '2025-01-01', 'Cheese Mozzarella 200g', 'cheese', 'Perfect for pizza', '', 'dairy', '', 550, 530, 'DRY-CHE-002', 1, ''),
(10041, 1004, 102, 2, 1, 'Yogurt Natural 500g', 'yogurt-natural-500g', 'DRY005', 'Natural yogurt', 'yogurt.png', '2025-01-01', 'Yogurt Natural 500g', 'yogurt, dahi', 'Fresh natural yogurt', '', 'dairy', '', 180, 170, 'DRY-YOG-001', 1, ''),
(10042, 1004, 102, 2, 1, 'Yogurt Greek 400g', 'yogurt-greek-400g', 'DRY006', 'Greek yogurt', 'yogurt.png', '2025-01-01', 'Yogurt Greek 400g', 'yogurt', 'Thick Greek yogurt', '', 'dairy', '', 380, 360, 'DRY-YOG-002', 1, ''),
(10043, 1004, 102, 2, 1, 'Butter Salted 200g', 'butter-salted-200g', 'DRY007', 'Salted butter', 'butter.png', '2025-01-01', 'Butter Salted 200g', 'butter, makhan', 'Premium salted butter', '', 'dairy', '', 350, 340, 'DRY-BUT-001', 1, ''),
(10044, 1004, 102, 2, 1, 'Butter Unsalted 200g', 'butter-unsalted-200g', 'DRY008', 'Unsalted butter', 'butter.png', '2025-01-01', 'Butter Unsalted 200g', 'butter', 'Pure unsalted butter', '', 'dairy', '', 350, 340, 'DRY-BUT-002', 1, ''),
(10045, 1004, 102, 2, 1, 'Cream Fresh 200ml', 'cream-fresh-200ml', 'DRY009', 'Fresh cream', 'cream.png', '2025-01-01', 'Cream Fresh 200ml', 'cream', 'Cooking cream', '', 'dairy', '', 280, 270, 'DRY-CRE-001', 1, ''),
(10046, 1004, 102, 2, 1, 'Eggs Farm Fresh Dozen', 'eggs-farm-fresh-dozen', 'DRY010', 'Farm fresh eggs', 'eggs.png', '2025-01-01', 'Eggs Farm Fresh Dozen', 'eggs, anday', 'Fresh farm eggs', '', 'dairy,eggs', '', 520, 500, 'DRY-EGG-001', 1, ''),
(10047, 1004, 102, 2, 1, 'Eggs Farm Fresh 30pcs', 'eggs-farm-fresh-30pcs', 'DRY011', 'Eggs tray', 'eggs.png', '2025-01-01', 'Eggs Farm Fresh 30pcs', 'eggs, anday', 'Fresh eggs tray', '', 'dairy,eggs', '', 1300, 1250, 'DRY-EGG-002', 1, ''),

-- Bakery
(10048, 1002, 102, 2, 1, 'Bread Whole Wheat Large', 'bread-whole-wheat-large', 'BKR001', 'Whole wheat bread', 'bread.png', '2025-01-01', 'Bread Whole Wheat Large', 'bread, roti', 'Fresh wheat bread', '', 'bakery', '', 130, 120, 'BKR-BRD-001', 1, ''),
(10049, 1002, 102, 2, 1, 'Bread White Large', 'bread-white-large', 'BKR002', 'White bread', 'bread.png', '2025-01-01', 'Bread White Large', 'bread', 'Soft white bread', '', 'bakery', '', 110, 100, 'BKR-BRD-002', 1, ''),
(10050, 1002, 102, 2, 1, 'Buns Burger 6pcs', 'buns-burger-6pcs', 'BKR003', 'Burger buns', 'buns.png', '2025-01-01', 'Buns Burger 6pcs', 'buns, burger', 'Soft burger buns', '', 'bakery', '', 180, 170, 'BKR-BUN-001', 1, ''),
(10051, 1002, 102, 2, 1, 'Biscuits Chocolate 200g', 'biscuits-chocolate-200g', 'BKR004', 'Chocolate biscuits', 'biscuits-cookies.png', '2025-01-01', 'Biscuits Chocolate 200g', 'biscuits, cookies', 'Crunchy chocolate cookies', '', 'bakery,snacks', '', 220, 200, 'BKR-BIS-001', 1, ''),
(10052, 1002, 102, 2, 1, 'Biscuits Cream 200g', 'biscuits-cream-200g', 'BKR005', 'Cream biscuits', 'biscuits-cookies.png', '2025-01-01', 'Biscuits Cream 200g', 'biscuits, cookies', 'Cream filled cookies', '', 'bakery,snacks', '', 240, 220, 'BKR-BIS-002', 1, ''),
(10053, 1002, 102, 2, 1, 'Cake Chocolate Small', 'cake-chocolate-small', 'BKR006', 'Chocolate cake', 'cake.png', '2025-01-01', 'Cake Chocolate Small', 'cake', 'Delicious chocolate cake', '', 'bakery', '', 680, 650, 'BKR-CAK-001', 1, ''),
(10054, 1002, 102, 2, 1, 'Croissant Plain 4pcs', 'croissant-plain-4pcs', 'BKR007', 'Plain croissants', 'croissant.png', '2025-01-01', 'Croissant Plain 4pcs', 'croissant', 'Butter croissants', '', 'bakery', '', 420, 400, 'BKR-CRO-001', 1, '');

-- ============================================
-- 8. PRODUCTS - SNACKS & BEVERAGES
-- ============================================
INSERT INTO dow (id, brID, catID, mainID, statuss, namee, slug, code, desc1, imagee, datee, title, keyword, descr, addhead, tags, imagee3, price, dprice, sku, websiteID, imagee2) VALUES
-- Snacks
(10055, 1002, 103, 2, 1, 'Chips BBQ 100g', 'chips-bbq-100g', 'SNK001', 'BBQ flavored chips', 'chips.png', '2025-01-01', 'Chips BBQ 100g', 'chips, snacks', 'Crunchy BBQ chips', '', 'snacks', '', 120, 110, 'SNK-CHP-001', 1, ''),
(10056, 1002, 103, 2, 1, 'Chips Salt 100g', 'chips-salt-100g', 'SNK002', 'Salted chips', 'chips.png', '2025-01-01', 'Chips Salt 100g', 'chips, snacks', 'Classic salted chips', '', 'snacks', '', 120, 110, 'SNK-CHP-002', 1, ''),
(10057, 1002, 103, 2, 1, 'Chips Chilli 100g', 'chips-chilli-100g', 'SNK003', 'Chilli flavored chips', 'chips.png', '2025-01-01', 'Chips Chilli 100g', 'chips, snacks', 'Spicy chilli chips', '', 'snacks', '', 120, 110, 'SNK-CHP-003', 1, ''),
(10058, 1002, 103, 2, 1, 'Popcorn Butter 200g', 'popcorn-butter-200g', 'SNK004', 'Butter popcorn', 'popcorn.png', '2025-01-01', 'Popcorn Butter 200g', 'popcorn, snacks', 'Buttery popcorn', '', 'snacks', '', 280, 260, 'SNK-POP-001', 1, ''),
(10059, 1002, 103, 2, 1, 'Peanuts Salted 200g', 'peanuts-salted-200g', 'SNK005', 'Salted peanuts', 'dryfruits.png', '2025-01-01', 'Peanuts Salted 200g', 'peanuts, mungfali', 'Crunchy peanuts', '', 'snacks', '', 180, 170, 'SNK-PEA-001', 1, ''),
(10060, 1002, 103, 2, 1, 'Cashews Roasted 200g', 'cashews-roasted-200g', 'SNK006', 'Roasted cashews', 'dryfruits.png', '2025-01-01', 'Cashews Roasted 200g', 'cashew, kaju', 'Premium cashews', '', 'snacks,dryfruits', '', 980, 950, 'SNK-CAS-001', 1, ''),
(10061, 1002, 103, 2, 1, 'Almonds 200g', 'almonds-200g', 'SNK007', 'Premium almonds', 'dryfruits.png', '2025-01-01', 'Almonds 200g', 'almond, badam', 'California almonds', '', 'snacks,dryfruits', '', 850, 820, 'SNK-ALM-001', 1, ''),
(10062, 1002, 103, 2, 1, 'Chocolate Bar Milk 50g', 'chocolate-bar-milk-50g', 'SNK008', 'Milk chocolate', 'chocolates.png', '2025-01-01', 'Chocolate Bar Milk 50g', 'chocolate', 'Creamy milk chocolate', '', 'snacks,chocolates', '', 150, 140, 'SNK-CHO-001', 1, ''),
(10063, 1002, 103, 2, 1, 'Chocolate Bar Dark 50g', 'chocolate-bar-dark-50g', 'SNK009', 'Dark chocolate', 'chocolates.png', '2025-01-01', 'Chocolate Bar Dark 50g', 'chocolate', 'Rich dark chocolate', '', 'snacks,chocolates', '', 180, 170, 'SNK-CHO-002', 1, ''),
(10064, 1002, 103, 2, 1, 'Cookies Chocolate Chip 200g', 'cookies-chocolate-chip-200g', 'SNK010', 'Chocolate chip cookies', 'biscuits-cookies.png', '2025-01-01', 'Cookies Chocolate Chip 200g', 'cookies', 'Crispy chocolate cookies', '', 'snacks', '', 320, 300, 'SNK-COO-001', 1, ''),

-- Beverages
(10065, 1002, 103, 2, 1, 'Soft Drink Cola 1.5L', 'soft-drink-cola-15l', 'BVR001', 'Cola soft drink', 'beverages.png', '2025-01-01', 'Soft Drink Cola 1.5L', 'cola, cold drink', 'Refreshing cola', '', 'beverages', '', 180, 170, 'BVR-COL-001', 1, ''),
(10066, 1002, 103, 2, 1, 'Soft Drink Lemon 1.5L', 'soft-drink-lemon-15l', 'BVR002', 'Lemon soft drink', 'beverages.png', '2025-01-01', 'Soft Drink Lemon 1.5L', 'lemon, cold drink', 'Citrus lemon drink', '', 'beverages', '', 180, 170, 'BVR-LEM-001', 1, ''),
(10067, 1002, 103, 2, 1, 'Soft Drink Orange 1.5L', 'soft-drink-orange-15l', 'BVR003', 'Orange soft drink', 'beverages.png', '2025-01-01', 'Soft Drink Orange 1.5L', 'orange, cold drink', 'Orange flavored drink', '', 'beverages', '', 180, 170, 'BVR-ORA-001', 1, ''),
(10068, 1002, 103, 2, 1, 'Fruit Juice Mango 1L', 'fruit-juice-mango-1l', 'BVR004', 'Pure mango juice', 'juice.png', '2025-01-01', 'Fruit Juice Mango 1L', 'mango juice', 'Fresh mango juice', '', 'beverages', '', 380, 360, 'BVR-JUI-001', 1, ''),
(10069, 1002, 103, 2, 1, 'Fruit Juice Orange 1L', 'fruit-juice-orange-1l', 'BVR005', 'Fresh orange juice', 'juice.png', '2025-01-01', 'Fruit Juice Orange 1L', 'orange juice', 'Pure orange juice', '', 'beverages', '', 380, 360, 'BVR-JUI-002', 1, ''),
(10070, 1002, 103, 2, 1, 'Fruit Juice Apple 1L', 'fruit-juice-apple-1l', 'BVR006', 'Apple juice', 'juice.png', '2025-01-01', 'Fruit Juice Apple 1L', 'apple juice', 'Crisp apple juice', '', 'beverages', '', 400, 380, 'BVR-JUI-003', 1, ''),
(10071, 1002, 103, 2, 1, 'Fruit Juice Mixed 1L', 'fruit-juice-mixed-1l', 'BVR007', 'Mixed fruit juice', 'juice.png', '2025-01-01', 'Fruit Juice Mixed 1L', 'fruit juice', 'Tropical mix juice', '', 'beverages', '', 380, 360, 'BVR-JUI-004', 1, ''),
(10072, 1002, 103, 2, 1, 'Energy Drink 250ml', 'energy-drink-250ml', 'BVR008', 'Energy drink', 'beverages.png', '2025-01-01', 'Energy Drink 250ml', 'energy drink', 'Boost your energy', '', 'beverages', '', 280, 270, 'BVR-ENE-001', 1, ''),
(10073, 1002, 103, 2, 1, 'Mineral Water 1.5L', 'mineral-water-15l', 'BVR009', 'Mineral water', 'water.png', '2025-01-01', 'Mineral Water 1.5L', 'water', 'Pure mineral water', '', 'beverages', '', 80, 75, 'BVR-WAT-001', 1, ''),
(10074, 1002, 103, 2, 1, 'Mineral Water 500ml', 'mineral-water-500ml', 'BVR010', 'Mineral water bottle', 'water.png', '2025-01-01', 'Mineral Water 500ml', 'water', 'Drinking water', '', 'beverages', '', 40, 35, 'BVR-WAT-002', 1, ''),
(10075, 1002, 103, 2, 1, 'Tea Bags Black 100pcs', 'tea-bags-black-100pcs', 'BVR011', 'Black tea bags', 'tea.png', '2025-01-01', 'Tea Bags Black 100pcs', 'tea, chai', 'Premium black tea', '', 'beverages,tea', '', 580, 560, 'BVR-TEA-001', 1, ''),
(10076, 1002, 103, 2, 1, 'Tea Bags Green 50pcs', 'tea-bags-green-50pcs', 'BVR012', 'Green tea bags', 'tea.png', '2025-01-01', 'Tea Bags Green 50pcs', 'green tea', 'Healthy green tea', '', 'beverages,tea', '', 680, 650, 'BVR-TEA-002', 1, ''),
(10077, 1002, 103, 2, 1, 'Coffee Instant 200g', 'coffee-instant-200g', 'BVR013', 'Instant coffee', 'coffee.png', '2025-01-01', 'Coffee Instant 200g', 'coffee', 'Rich instant coffee', '', 'beverages,coffee', '', 780, 750, 'BVR-COF-001', 1, '');

-- ============================================
-- 9. LOCATIONS
-- ============================================
INSERT INTO locations (id, parent_id, name, type) VALUES
(200, NULL, 'DHA Phase 1', 'phase'),
(201, 200, 'Sector A', 'sector'),
(202, 200, 'Sector B', 'sector'),
(203, 200, 'Sector C', 'sector'),
(204, NULL, 'DHA Phase 2', 'phase'),
(205, 204, 'Sector D', 'sector'),
(206, 204, 'Sector E', 'sector'),
(207, NULL, 'Bahria Town', 'phase'),
(208, 207, 'Phase 1', 'sector'),
(209, 207, 'Phase 2', 'sector');

-- ============================================
-- 12. DELIVERY CHARGES
-- ============================================
INSERT INTO delivery_charges (id, area, sector, charge) VALUES
(200, 'DHA Phase 1', 'All Sectors', 0.00),
(201, 'DHA Phase 2', 'All Sectors', 50.00),
(202, 'Bahria Town', 'All Phases', 100.00);

-- ============================================
-- 13. USERS (Test accounts - password: Test@123)
-- ============================================
INSERT INTO users (id, name, email, password, phone, address, created_at) VALUES
(200, 'Ali Hassan', 'ali.hassan@testmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '03001111111', 'House 10, Street 5, DHA Phase 1, Islamabad', '2025-01-01 10:00:00'),
(201, 'Ayesha Khan', 'ayesha.khan@testmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '03002222222', 'Apartment 5B, DHA Phase 2, Islamabad', '2025-01-01 11:00:00'),
(202, 'Muhammad Ahmed', 'muhammad.ahmed@testmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '03003333333', 'House 25, Bahria Town, Islamabad', '2025-01-01 12:00:00');

-- ============================================
-- 14. BUNDLES (Featured on homepage)
-- ============================================
INSERT INTO bundles (id, name, description, base_price, discount, final_price, image, status, created_at) VALUES
(200, 'Weekly Grocery Bundle', 'Essential groceries for the week including rice, oil, sugar, salt, and fresh vegetables', 3500.00, 300.00, 3200.00, 'grocery-bun.png', 'active', '2025-01-01 10:00:00'),
(201, 'Fresh Fruits Bundle', 'Assorted fresh fruits package with apples, bananas, oranges, and grapes', 1200.00, 100.00, 1100.00, 'grocery-bun.png', 'active', '2025-01-01 10:00:00'),
(202, 'Breakfast Bundle', 'Complete breakfast essentials with bread, eggs, cheese, butter, and milk', 1800.00, 150.00, 1650.00, 'grocery-bun.png', 'active', '2025-01-01 10:00:00'),
(203, 'Dairy Combo', 'All dairy products in one bundle - milk, cheese, yogurt, butter, and cream', 1400.00, 100.00, 1300.00, 'grocery-bun.png', 'active', '2025-01-01 10:00:00'),
(204, 'Family Meal Bundle', 'Complete family meal package with rice, eggs, milk, vegetables, and cooking essentials', 4500.00, 500.00, 4000.00, 'grocery-bun.png', 'active', '2025-01-01 10:00:00'),
(205, 'Snack Party Pack', 'Perfect for parties - chips, chocolates, biscuits, and soft drinks', 2200.00, 200.00, 2000.00, 'grocery-bun.png', 'active', '2025-01-01 10:00:00'),
(206, 'Health & Wellness Bundle', 'Healthy choices - green tea, dry fruits, fresh fruits, and yogurt', 2800.00, 300.00, 2500.00, 'grocery-bun.png', 'active', '2025-01-01 10:00:00');

-- ============================================
-- 15. BUNDLE ITEMS
-- ============================================
INSERT INTO bundle_items (id, bundle_id, product_id, quantity) VALUES
-- Weekly Grocery Bundle (200)
(200, 200, 10001, 1), -- Rice 5kg
(201, 200, 10004, 1), -- Oil 1L
(202, 200, 10007, 2), -- Sugar 1kg x2
(203, 200, 10009, 1), -- Salt
(204, 200, 10021, 2), -- Tomato x2
(205, 200, 10022, 2), -- Potato x2
(206, 200, 10023, 1), -- Onion

-- Fresh Fruits Bundle (201)
(207, 201, 10029, 1), -- Apples
(208, 201, 10030, 1), -- Bananas
(209, 201, 10031, 1), -- Oranges
(210, 201, 10033, 1), -- Grapes

-- Breakfast Bundle (202)
(211, 202, 10048, 2), -- Bread x2
(212, 202, 10046, 1), -- Eggs 12
(213, 202, 10039, 1), -- Cheese
(214, 202, 10043, 1), -- Butter
(215, 202, 10037, 1), -- Milk

-- Dairy Combo (203)
(216, 203, 10037, 2), -- Milk x2
(217, 203, 10039, 1), -- Cheese
(218, 203, 10041, 2), -- Yogurt x2
(219, 203, 10043, 1), -- Butter
(220, 203, 10045, 1), -- Cream

-- Family Meal Bundle (204)
(221, 204, 10001, 1), -- Rice 5kg
(222, 204, 10046, 2), -- Eggs x2
(223, 204, 10037, 2), -- Milk x2
(224, 204, 10021, 2), -- Tomato x2
(225, 204, 10022, 2), -- Potato x2
(226, 204, 10023, 1), -- Onion
(227, 204, 10004, 1), -- Oil

-- Snack Party Pack (205)
(228, 205, 10055, 3), -- Chips x3
(229, 205, 10062, 5), -- Chocolate bars x5
(230, 205, 10051, 2), -- Biscuits x2
(231, 205, 10065, 2), -- Soft drinks x2
(232, 205, 10060, 1), -- Cashews

-- Health & Wellness Bundle (206)
(233, 206, 10076, 1), -- Green tea
(234, 206, 10060, 1), -- Cashews
(235, 206, 10061, 1), -- Almonds
(236, 206, 10029, 1), -- Apples
(237, 206, 10042, 2); -- Greek yogurt x2

-- ============================================
-- 16. SAMPLE ORDERS
-- ============================================
INSERT INTO orders (id, user_id, guest_name, guest_email, guest_phone, guest_address, subtotal, delivery_charge, total, currency, created_at, statuss, payment_status) VALUES
(200, 200, 'Ali Hassan', 'ali.hassan@testmail.com', '03001111111', 'House 10, Street 5, DHA Phase 1, Islamabad', 1200.00, 0.00, 1200.00, 'PKR', '2025-01-08 12:00:00', 'Delivered', 'Received'),
(201, 201, 'Ayesha Khan', 'ayesha.khan@testmail.com', '03002222222', 'Apartment 5B, DHA Phase 2, Islamabad', 2500.00, 50.00, 2550.00, 'PKR', '2025-01-10 14:00:00', 'otw', 'Online'),
(202, 202, 'Muhammad Ahmed', 'muhammad.ahmed@testmail.com', '03003333333', 'House 25, Bahria Town, Islamabad', 3200.00, 100.00, 3300.00, 'PKR', '2025-01-11 15:00:00', 'Current', 'Pending');

-- ============================================
-- 17. ORDER ITEMS
-- ============================================
INSERT INTO order_items (id, order_id, bundle_id, product_id, name, price, qty, total) VALUES
-- Order 200 (Delivered)
(200, 200, NULL, 10029, 'Apple Red 1kg', 330.00, 2, 660.00),
(201, 200, NULL, 10030, 'Banana Fresh Dozen', 190.00, 1, 190.00),
(202, 200, NULL, 10031, 'Orange Valencia 1kg', 280.00, 1, 280.00),

-- Order 201 (On The Way) - Bundle order
(203, 201, 200, NULL, 'Weekly Grocery Bundle', 3200.00, 1, 3200.00),

-- Order 202 (Current)
(204, 202, 201, NULL, 'Fresh Fruits Bundle', 1100.00, 1, 1100.00);

-- ============================================
-- COMMIT
-- ============================================
COMMIT;
SET FOREIGN_KEY_CHECKS = 1;
SET AUTOCOMMIT = 1;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================
SELECT 'Database seed completed successfully!' as Status;
SELECT 'Categories inserted:' as Info, COUNT(*) as Count FROM categories WHERE id >= 100
UNION ALL
SELECT 'Products inserted:', COUNT(*) FROM dow WHERE id >= 10000
UNION ALL
SELECT 'Brands inserted:', COUNT(*) FROM brands WHERE id >= 1000
UNION ALL
SELECT 'Bundles inserted:', COUNT(*) FROM bundles WHERE id >= 200
UNION ALL
SELECT 'Users inserted:', COUNT(*) FROM users WHERE id >= 200
UNION ALL
SELECT 'Orders inserted:', COUNT(*) FROM orders WHERE id >= 200;

-- Show categories
SELECT '=== CATEGORIES ===' as Section;
SELECT id, name, icon FROM categories WHERE id >= 100;

-- Show featured bundles
SELECT '=== FEATURED BUNDLES ===' as Section;
SELECT id, name, final_price, discount FROM bundles WHERE id >= 200;
