<?php
/**
 * Mobile App Tables Migration Script
 * Creates ALL missing tables required by the mobile app
 *
 * Run ONCE via browser: https://greenfieldsupermarket.com/mobile-api/backend/migrate_all_mobile_app_tables.php
 * Then DELETE this file for security!
 */

header('Content-Type: text/plain; charset=utf-8');

require_once __DIR__ . '/admin/includes/db_settings.php';

echo "═══════════════════════════════════════════════\n";
echo "  MOBILE APP DATABASE MIGRATION\n";
echo "  Creating missing tables\n";
echo "═══════════════════════════════════════════════\n\n";

if (!$con) {
    die("❌ Database connection failed!\n");
}

echo "✅ Connected to database: $db_name\n\n";

$tables_created = 0;
$tables_skipped = 0;
$errors = [];

// ==============================================
// 1. USER_ADDRESSES TABLE
// ==============================================
echo "📋 Checking 'user_addresses' table...\n";
$check = mysqli_query($con, "SHOW TABLES LIKE 'user_addresses'");
if (mysqli_num_rows($check) > 0) {
    echo "   ⚠️  Already exists - skipping\n\n";
    $tables_skipped++;
} else {
    $sql = "CREATE TABLE `user_addresses` (
      `id` int(11) NOT NULL AUTO_INCREMENT,
      `user_id` int(11) NOT NULL,
      `label` varchar(50) NOT NULL DEFAULT 'Home' COMMENT 'Home, Office, Other',
      `name` varchar(255) NOT NULL COMMENT 'Address nickname',
      `address` text NOT NULL,
      `building_name` varchar(255) DEFAULT NULL,
      `flat` varchar(50) DEFAULT NULL,
      `floor` varchar(50) DEFAULT NULL,
      `company_name` varchar(255) DEFAULT NULL,
      `instructions` text DEFAULT NULL,
      `is_default` tinyint(1) NOT NULL DEFAULT 0,
      `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
      `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (`id`),
      KEY `user_id` (`user_id`),
      KEY `is_default` (`is_default`),
      KEY `idx_user_default` (`user_id`, `is_default`),
      CONSTRAINT `user_addresses_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";

    if (mysqli_query($con, $sql)) {
        echo "   ✅ Created successfully!\n\n";
        $tables_created++;
    } else {
        $error = mysqli_error($con);
        echo "   ❌ Error: $error\n\n";
        $errors[] = "user_addresses: $error";
    }
}

// ==============================================
// 2. PAYMENT_METHODS TABLE
// ==============================================
echo "📋 Checking 'payment_methods' table...\n";
$check = mysqli_query($con, "SHOW TABLES LIKE 'payment_methods'");
if (mysqli_num_rows($check) > 0) {
    echo "   ⚠️  Already exists - skipping\n\n";
    $tables_skipped++;
} else {
    $sql = "CREATE TABLE `payment_methods` (
      `id` int(11) NOT NULL AUTO_INCREMENT,
      `user_id` int(11) NOT NULL,
      `type` varchar(50) NOT NULL COMMENT 'card, jazzcash, easypaisa, cod',
      `label` varchar(100) DEFAULT NULL,
      `card_number` varchar(4) DEFAULT NULL COMMENT 'Last 4 digits',
      `card_holder_name` varchar(255) DEFAULT NULL,
      `expiry_month` int(2) DEFAULT NULL,
      `expiry_year` int(4) DEFAULT NULL,
      `is_default` tinyint(1) NOT NULL DEFAULT 0,
      `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
      `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (`id`),
      KEY `user_id` (`user_id`),
      KEY `is_default` (`is_default`),
      CONSTRAINT `payment_methods_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";

    if (mysqli_query($con, $sql)) {
        echo "   ✅ Created successfully!\n\n";
        $tables_created++;
    } else {
        $error = mysqli_error($con);
        echo "   ❌ Error: $error\n\n";
        $errors[] = "payment_methods: $error";
    }
}

// ==============================================
// 3. NOTIFICATIONS TABLE
// ==============================================
echo "📋 Checking 'notifications' table...\n";
$check = mysqli_query($con, "SHOW TABLES LIKE 'notifications'");
if (mysqli_num_rows($check) > 0) {
    echo "   ⚠️  Already exists - skipping\n\n";
    $tables_skipped++;
} else {
    $sql = "CREATE TABLE `notifications` (
      `id` int(11) NOT NULL AUTO_INCREMENT,
      `user_id` int(11) NOT NULL,
      `title` varchar(255) NOT NULL,
      `message` text NOT NULL,
      `type` varchar(50) DEFAULT 'general' COMMENT 'order, delivery, promotion, general',
      `is_read` tinyint(1) NOT NULL DEFAULT 0,
      `read_at` timestamp NULL DEFAULT NULL,
      `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (`id`),
      KEY `user_id` (`user_id`),
      KEY `is_read` (`is_read`),
      KEY `type` (`type`),
      CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";

    if (mysqli_query($con, $sql)) {
        echo "   ✅ Created successfully!\n\n";
        $tables_created++;
    } else {
        $error = mysqli_error($con);
        echo "   ❌ Error: $error\n\n";
        $errors[] = "notifications: $error";
    }
}

// ==============================================
// 4. NOTIFICATION_SETTINGS TABLE
// ==============================================
echo "📋 Checking 'notification_settings' table...\n";
$check = mysqli_query($con, "SHOW TABLES LIKE 'notification_settings'");
if (mysqli_num_rows($check) > 0) {
    echo "   ⚠️  Already exists - skipping\n\n";
    $tables_skipped++;
} else {
    $sql = "CREATE TABLE `notification_settings` (
      `id` int(11) NOT NULL AUTO_INCREMENT,
      `user_id` int(11) NOT NULL,
      `email_notifications` tinyint(1) NOT NULL DEFAULT 1,
      `push_notifications` tinyint(1) NOT NULL DEFAULT 1,
      `sms_notifications` tinyint(1) NOT NULL DEFAULT 0,
      `order_updates` tinyint(1) NOT NULL DEFAULT 1,
      `promotional_emails` tinyint(1) NOT NULL DEFAULT 1,
      `new_products` tinyint(1) NOT NULL DEFAULT 1,
      `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
      `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (`id`),
      UNIQUE KEY `user_id` (`user_id`),
      CONSTRAINT `notification_settings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";

    if (mysqli_query($con, $sql)) {
        echo "   ✅ Created successfully!\n\n";
        $tables_created++;
    } else {
        $error = mysqli_error($con);
        echo "   ❌ Error: $error\n\n";
        $errors[] = "notification_settings: $error";
    }
}

// ==============================================
// 5. MARKETPLACE_ADS TABLE
// ==============================================
echo "📋 Checking 'marketplace_ads' table...\n";
$check = mysqli_query($con, "SHOW TABLES LIKE 'marketplace_ads'");
if (mysqli_num_rows($check) > 0) {
    echo "   ⚠️  Already exists - skipping\n\n";
    $tables_skipped++;
} else {
    $sql = "CREATE TABLE `marketplace_ads` (
      `id` int(11) NOT NULL AUTO_INCREMENT,
      `user_id` int(11) NOT NULL,
      `title` varchar(255) NOT NULL,
      `description` text NOT NULL,
      `price` decimal(10,2) NOT NULL,
      `category` varchar(100) DEFAULT NULL,
      `location` varchar(255) DEFAULT NULL,
      `status` varchar(20) NOT NULL DEFAULT 'active' COMMENT 'active, sold, expired',
      `views` int(11) NOT NULL DEFAULT 0,
      `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
      `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (`id`),
      KEY `user_id` (`user_id`),
      KEY `status` (`status`),
      KEY `category` (`category`),
      CONSTRAINT `marketplace_ads_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";

    if (mysqli_query($con, $sql)) {
        echo "   ✅ Created successfully!\n\n";
        $tables_created++;
    } else {
        $error = mysqli_error($con);
        echo "   ❌ Error: $error\n\n";
        $errors[] = "marketplace_ads: $error";
    }
}

// ==============================================
// 6. MARKETPLACE_AD_IMAGES TABLE
// ==============================================
echo "📋 Checking 'marketplace_ad_images' table...\n";
$check = mysqli_query($con, "SHOW TABLES LIKE 'marketplace_ad_images'");
if (mysqli_num_rows($check) > 0) {
    echo "   ⚠️  Already exists - skipping\n\n";
    $tables_skipped++;
} else {
    $sql = "CREATE TABLE `marketplace_ad_images` (
      `id` int(11) NOT NULL AUTO_INCREMENT,
      `ad_id` int(11) NOT NULL,
      `image_path` varchar(255) NOT NULL,
      `is_primary` tinyint(1) NOT NULL DEFAULT 0,
      `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (`id`),
      KEY `ad_id` (`ad_id`),
      CONSTRAINT `marketplace_ad_images_ibfk_1` FOREIGN KEY (`ad_id`) REFERENCES `marketplace_ads` (`id`) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";

    if (mysqli_query($con, $sql)) {
        echo "   ✅ Created successfully!\n\n";
        $tables_created++;
    } else {
        $error = mysqli_error($con);
        echo "   ❌ Error: $error\n\n";
        $errors[] = "marketplace_ad_images: $error";
    }
}

// ==============================================
// 7. DELIVERY_ZONES TABLE
// ==============================================
echo "📋 Checking 'delivery_zones' table...\n";
$check = mysqli_query($con, "SHOW TABLES LIKE 'delivery_zones'");
if (mysqli_num_rows($check) > 0) {
    echo "   ⚠️  Already exists - skipping\n\n";
    $tables_skipped++;
} else {
    $sql = "CREATE TABLE `delivery_zones` (
      `id` int(11) NOT NULL AUTO_INCREMENT,
      `phase_id` int(11) DEFAULT NULL,
      `sector_id` int(11) DEFAULT NULL,
      `zone_name` varchar(255) NOT NULL,
      `charge` decimal(10,2) NOT NULL DEFAULT 0.00,
      `estimated_time` varchar(50) DEFAULT NULL COMMENT 'e.g., 30-45 mins',
      `is_active` tinyint(1) NOT NULL DEFAULT 1,
      `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
      `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (`id`),
      KEY `phase_id` (`phase_id`),
      KEY `sector_id` (`sector_id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";

    if (mysqli_query($con, $sql)) {
        echo "   ✅ Created successfully!\n\n";
        $tables_created++;
    } else {
        $error = mysqli_error($con);
        echo "   ❌ Error: $error\n\n";
        $errors[] = "delivery_zones: $error";
    }
}

// ==============================================
// SUMMARY
// ==============================================
echo "═══════════════════════════════════════════════\n";
echo "  MIGRATION SUMMARY\n";
echo "═══════════════════════════════════════════════\n\n";
echo "✅ Tables created: $tables_created\n";
echo "⚠️  Tables skipped (already exist): $tables_skipped\n";
echo "❌ Errors: " . count($errors) . "\n\n";

if (count($errors) > 0) {
    echo "Error details:\n";
    foreach ($errors as $error) {
        echo "  - $error\n";
    }
    echo "\n";
}

if ($tables_created > 0) {
    echo "✅ Migration completed successfully!\n";
} else {
    echo "ℹ️  All tables already exist.\n";
}

echo "\n⚠️  IMPORTANT: Delete this file (migrate_all_mobile_app_tables.php) for security!\n";

mysqli_close($con);
?>
