-- Add missing columns to bundles table
ALTER TABLE `bundles` ADD COLUMN `is_featured` tinyint(1) DEFAULT 0;
ALTER TABLE `bundles` ADD COLUMN `slug` varchar(255) DEFAULT NULL;
ALTER TABLE `bundles` ADD COLUMN `image_url` varchar(500) DEFAULT NULL;
ALTER TABLE `bundles` ADD COLUMN `original_price` decimal(10,2) DEFAULT NULL;
ALTER TABLE `bundles` ADD COLUMN `discounted_price` decimal(10,2) DEFAULT NULL;

-- Add indexes
ALTER TABLE `bundles` ADD INDEX `idx_is_featured` (`is_featured`);
ALTER TABLE `bundles` ADD INDEX `idx_slug` (`slug`);
ALTER TABLE `bundles` ADD INDEX `idx_status` (`status`);

-- Update existing bundles to be featured and set proper prices
UPDATE `bundles` SET
    `is_featured` = 1,
    `original_price` = `base_price`,
    `discounted_price` = `final_price`
WHERE `is_featured` IS NOT NULL;
