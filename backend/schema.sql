-- ============================================
-- Greenfield Supermarket - Database Schema
-- Complete schema for mobile app backend
-- ============================================

-- Create notifications table
CREATE TABLE IF NOT EXISTS `notifications` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `type` varchar(50) DEFAULT 'general' COMMENT 'general, order, promo, system',
  `is_read` tinyint(1) DEFAULT 0,
  `read_at` datetime DEFAULT NULL,
  `data` text DEFAULT NULL COMMENT 'JSON data for additional info',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_is_read` (`is_read`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create notification settings table
CREATE TABLE IF NOT EXISTS `notification_settings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL UNIQUE,
  `email_notifications` tinyint(1) DEFAULT 1,
  `push_notifications` tinyint(1) DEFAULT 1,
  `sms_notifications` tinyint(1) DEFAULT 0,
  `order_updates` tinyint(1) DEFAULT 1,
  `promotional_emails` tinyint(1) DEFAULT 1,
  `new_products` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add missing columns to users table if they don't exist
ALTER TABLE `users`
ADD COLUMN IF NOT EXISTS `deleted_at` datetime DEFAULT NULL,
ADD COLUMN IF NOT EXISTS `status` varchar(20) DEFAULT 'active',
ADD COLUMN IF NOT EXISTS `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Add missing columns to bundles table if they don't exist
ALTER TABLE `bundles`
ADD COLUMN IF NOT EXISTS `is_featured` tinyint(1) DEFAULT 0,
ADD COLUMN IF NOT EXISTS `slug` varchar(255) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS `image_url` varchar(500) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS `original_price` decimal(10,2) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS `discounted_price` decimal(10,2) DEFAULT NULL;

-- Add indexes for better performance
ALTER TABLE `bundles`
ADD INDEX IF NOT EXISTS `idx_is_featured` (`is_featured`),
ADD INDEX IF NOT EXISTS `idx_slug` (`slug`),
ADD INDEX IF NOT EXISTS `idx_status` (`status`);

-- Ensure categories have proper structure
ALTER TABLE `categories`
ADD COLUMN IF NOT EXISTS `slug` varchar(255) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS `parent_id` int(11) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS `image_url` varchar(500) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS `status` varchar(20) DEFAULT 'active',
ADD COLUMN IF NOT EXISTS `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE `categories`
ADD INDEX IF NOT EXISTS `idx_parent_id` (`parent_id`),
ADD INDEX IF NOT EXISTS `idx_slug` (`slug`),
ADD INDEX IF NOT EXISTS `idx_status` (`status`);

-- Ensure locations table has proper structure
ALTER TABLE `locations`
ADD COLUMN IF NOT EXISTS `type` varchar(50) DEFAULT 'sector',
ADD COLUMN IF NOT EXISTS `parent_id` int(11) DEFAULT NULL,
ADD INDEX IF NOT EXISTS `idx_parent_id` (`parent_id`),
ADD INDEX IF NOT EXISTS `idx_type` (`type`);

-- ============================================
-- SUMMARY OF KEY TABLES
-- ============================================
-- users: User accounts (id, name, email, password, phone, address, deleted_at, status, created_at)
-- notifications: User notifications (id, user_id, title, message, type, is_read, read_at, data, created_at)
-- notification_settings: User notification preferences (id, user_id, email_notifications, push_notifications, etc.)
-- dow: Products table (id, namee, imagee, price, dprice, desc1, catID, brID, statuss, slug)
-- categories: Product categories (id, name, slug, parent_id, image_url, status, created_at)
-- bundles: Product bundles (id, name, description, base_price, discount, final_price, is_featured, slug, image, status, created_at)
-- bundle_items: Bundle composition (id, bundle_id, product_id, quantity)
-- brands: Product brands (id, name, logo, status)
-- orders: Customer orders (id, user_id, guest_email, total, statuss, created_at)
-- order_items: Order line items (id, order_id, product_id, quantity, price)
-- locations: Delivery locations - phases and sectors (id, name, parent_id, type)
-- password_resets: Password reset tokens (id, user_id, email, token, expires_at, created_at)
-- exchange: Currency exchange rates
