-- Create user_addresses table for storing multiple delivery addresses per user
-- This table is required by the mobile app's address management feature

CREATE TABLE IF NOT EXISTS `user_addresses` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `label` varchar(50) NOT NULL DEFAULT 'Home' COMMENT 'Home, Office, Other, etc.',
  `name` varchar(255) NOT NULL COMMENT 'Address nickname or recipient name',
  `address` text NOT NULL COMMENT 'Full address details',
  `building_name` varchar(255) DEFAULT NULL,
  `flat` varchar(50) DEFAULT NULL,
  `floor` varchar(50) DEFAULT NULL,
  `company_name` varchar(255) DEFAULT NULL,
  `instructions` text DEFAULT NULL COMMENT 'Delivery instructions',
  `is_default` tinyint(1) NOT NULL DEFAULT 0 COMMENT '1 = default address, 0 = not default',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `is_default` (`is_default`),
  CONSTRAINT `user_addresses_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create index for faster queries
CREATE INDEX idx_user_default ON user_addresses(user_id, is_default);
