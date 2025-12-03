<?php
/**
 * COMPREHENSIVE MARKETPLACE TABLES SETUP
 *
 * This script will:
 * 1. Check if marketplace tables exist
 * 2. Create them if they don't exist
 * 3. Add any missing columns to existing tables
 * 4. Verify the setup is complete
 *
 * Run via browser: https://greenfieldsupermarket.com/mobile-api/backend/setup-marketplace-tables.php
 * Then DELETE this file for security!
 */

// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: text/plain; charset=utf-8');

echo "═══════════════════════════════════════════════\n";
echo "  MARKETPLACE TABLES SETUP\n";
echo "  Comprehensive Database Migration\n";
echo "═══════════════════════════════════════════════\n\n";

// Load database connection
$db_settings_path = __DIR__ . '/admin/includes/db_settings.php';
if (!file_exists($db_settings_path)) {
    die("❌ Error: db_settings.php not found at $db_settings_path\n");
}

require_once $db_settings_path;

if (!isset($con) || !$con) {
    die("❌ Database connection failed! Check db_settings.php\n");
}

echo "✅ Connected to database: $db_name\n\n";

$tables_created = 0;
$columns_added = 0;
$tables_skipped = 0;
$columns_skipped = 0;
$errors = [];

// ==============================================
// STEP 1: CREATE MARKETPLACE_ADS TABLE
// ==============================================
echo "📋 Step 1: Checking 'marketplace_ads' table...\n";

$check = $con->query("SHOW TABLES LIKE 'marketplace_ads'");
if ($check && $check->num_rows > 0) {
    echo "   ✅ Table exists\n";
    $tables_skipped++;
} else {
    echo "   ⚠️  Table does not exist - creating...\n";

    $sql = "CREATE TABLE `marketplace_ads` (
        `id` int(11) NOT NULL AUTO_INCREMENT,
        `user_id` int(11) NOT NULL,
        `title` varchar(255) NOT NULL,
        `description` text NOT NULL,
        `price` decimal(10,2) NOT NULL,
        `category` varchar(100) DEFAULT NULL,
        `subcategory` varchar(100) DEFAULT NULL,
        `condition` varchar(50) DEFAULT NULL,
        `location` varchar(255) DEFAULT NULL,
        `address` text DEFAULT NULL,
        `seller_name` varchar(255) DEFAULT NULL,
        `seller_phone` varchar(20) DEFAULT NULL,
        `seller_email` varchar(255) DEFAULT NULL,
        `specifications` text DEFAULT NULL COMMENT 'JSON array of specs',
        `status` varchar(20) NOT NULL DEFAULT 'active' COMMENT 'active, sold, expired',
        `featured` tinyint(1) NOT NULL DEFAULT 0,
        `views` int(11) NOT NULL DEFAULT 0,
        `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (`id`),
        KEY `user_id` (`user_id`),
        KEY `status` (`status`),
        KEY `category` (`category`),
        CONSTRAINT `marketplace_ads_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";

    if ($con->query($sql)) {
        echo "   ✅ Table created successfully!\n";
        $tables_created++;
    } else {
        $error = $con->error;
        echo "   ❌ Error: $error\n";
        $errors[] = "marketplace_ads table: $error";
    }
}

echo "\n";

// ==============================================
// STEP 2: ADD MISSING COLUMNS TO MARKETPLACE_ADS
// ==============================================
echo "📋 Step 2: Checking for missing columns in 'marketplace_ads'...\n";

// Get current columns
$columnsResult = $con->query("SHOW COLUMNS FROM marketplace_ads");
if ($columnsResult) {
    $existingColumns = [];
    while ($row = $columnsResult->fetch_assoc()) {
        $existingColumns[] = $row['Field'];
    }

    echo "   Current columns: " . implode(', ', $existingColumns) . "\n\n";

    // Define required columns with their SQL
    $requiredColumns = [
        [
            'name' => 'subcategory',
            'sql' => "ALTER TABLE `marketplace_ads` ADD COLUMN `subcategory` VARCHAR(100) DEFAULT NULL AFTER `category`"
        ],
        [
            'name' => 'condition',
            'sql' => "ALTER TABLE `marketplace_ads` ADD COLUMN `condition` VARCHAR(50) DEFAULT NULL AFTER `subcategory`"
        ],
        [
            'name' => 'address',
            'sql' => "ALTER TABLE `marketplace_ads` ADD COLUMN `address` TEXT DEFAULT NULL AFTER `location`"
        ],
        [
            'name' => 'seller_name',
            'sql' => "ALTER TABLE `marketplace_ads` ADD COLUMN `seller_name` VARCHAR(255) DEFAULT NULL AFTER `address`"
        ],
        [
            'name' => 'seller_phone',
            'sql' => "ALTER TABLE `marketplace_ads` ADD COLUMN `seller_phone` VARCHAR(20) DEFAULT NULL AFTER `seller_name`"
        ],
        [
            'name' => 'seller_email',
            'sql' => "ALTER TABLE `marketplace_ads` ADD COLUMN `seller_email` VARCHAR(255) DEFAULT NULL AFTER `seller_phone`"
        ],
        [
            'name' => 'specifications',
            'sql' => "ALTER TABLE `marketplace_ads` ADD COLUMN `specifications` TEXT DEFAULT NULL COMMENT 'JSON array of specs' AFTER `seller_email`"
        ],
        [
            'name' => 'featured',
            'sql' => "ALTER TABLE `marketplace_ads` ADD COLUMN `featured` TINYINT(1) NOT NULL DEFAULT 0 AFTER `status`"
        ]
    ];

    // Add each missing column
    foreach ($requiredColumns as $column) {
        $columnName = $column['name'];
        echo "   Checking column '$columnName'... ";

        if (in_array($columnName, $existingColumns)) {
            echo "✅ exists\n";
            $columns_skipped++;
        } else {
            if ($con->query($column['sql'])) {
                echo "✅ added\n";
                $columns_added++;
            } else {
                $error = $con->error;
                echo "❌ error: $error\n";
                $errors[] = "$columnName: $error";
            }
        }
    }
} else {
    echo "   ❌ Could not check columns\n";
    $errors[] = "Could not read marketplace_ads columns";
}

echo "\n";

// ==============================================
// STEP 3: CREATE MARKETPLACE_AD_IMAGES TABLE
// ==============================================
echo "📋 Step 3: Checking 'marketplace_ad_images' table...\n";

$check = $con->query("SHOW TABLES LIKE 'marketplace_ad_images'");
if ($check && $check->num_rows > 0) {
    echo "   ✅ Table exists\n";
    $tables_skipped++;
} else {
    echo "   ⚠️  Table does not exist - creating...\n";

    $sql = "CREATE TABLE `marketplace_ad_images` (
        `id` int(11) NOT NULL AUTO_INCREMENT,
        `ad_id` int(11) NOT NULL,
        `image_path` varchar(255) NOT NULL,
        `is_primary` tinyint(1) NOT NULL DEFAULT 0,
        `sort_order` int(11) DEFAULT 0,
        `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (`id`),
        KEY `ad_id` (`ad_id`),
        CONSTRAINT `marketplace_ad_images_ibfk_1` FOREIGN KEY (`ad_id`) REFERENCES `marketplace_ads` (`id`) ON DELETE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";

    if ($con->query($sql)) {
        echo "   ✅ Table created successfully!\n";
        $tables_created++;
    } else {
        $error = $con->error;
        echo "   ❌ Error: $error\n";
        $errors[] = "marketplace_ad_images table: $error";
    }
}

echo "\n";

// ==============================================
// STEP 4: ADD MISSING COLUMNS TO MARKETPLACE_AD_IMAGES
// ==============================================
echo "📋 Step 4: Checking for missing columns in 'marketplace_ad_images'...\n";

$columnsResult = $con->query("SHOW COLUMNS FROM marketplace_ad_images");
if ($columnsResult) {
    $existingImgColumns = [];
    while ($row = $columnsResult->fetch_assoc()) {
        $existingImgColumns[] = $row['Field'];
    }

    echo "   Current columns: " . implode(', ', $existingImgColumns) . "\n\n";

    // Check for sort_order column
    echo "   Checking column 'sort_order'... ";
    if (in_array('sort_order', $existingImgColumns)) {
        echo "✅ exists\n";
        $columns_skipped++;
    } else {
        $sql = "ALTER TABLE `marketplace_ad_images` ADD COLUMN `sort_order` INT(11) DEFAULT 0 AFTER `is_primary`";
        if ($con->query($sql)) {
            echo "✅ added\n";
            $columns_added++;
        } else {
            $error = $con->error;
            echo "❌ error: $error\n";
            $errors[] = "sort_order: $error";
        }
    }
} else {
    echo "   ❌ Could not check columns\n";
    $errors[] = "Could not read marketplace_ad_images columns";
}

echo "\n";

// ==============================================
// FINAL SUMMARY
// ==============================================
echo "═══════════════════════════════════════════════\n";
echo "  SETUP SUMMARY\n";
echo "═══════════════════════════════════════════════\n\n";
echo "✅ Tables created: $tables_created\n";
echo "⚠️  Tables already existed: $tables_skipped\n";
echo "✅ Columns added: $columns_added\n";
echo "⚠️  Columns already existed: $columns_skipped\n";
echo "❌ Errors: " . count($errors) . "\n\n";

if (count($errors) > 0) {
    echo "Error details:\n";
    foreach ($errors as $error) {
        echo "  - $error\n";
    }
    echo "\n";
}

// ==============================================
// VERIFICATION
// ==============================================
echo "═══════════════════════════════════════════════\n";
echo "  VERIFICATION\n";
echo "═══════════════════════════════════════════════\n\n";

echo "marketplace_ads table structure:\n";
$result = $con->query("SHOW COLUMNS FROM marketplace_ads");
if ($result) {
    while ($row = $result->fetch_assoc()) {
        echo "  ✓ {$row['Field']} ({$row['Type']})\n";
    }
} else {
    echo "  ❌ Could not read table structure\n";
}

echo "\nmarketplace_ad_images table structure:\n";
$result = $con->query("SHOW COLUMNS FROM marketplace_ad_images");
if ($result) {
    while ($row = $result->fetch_assoc()) {
        echo "  ✓ {$row['Field']} ({$row['Type']})\n";
    }
} else {
    echo "  ❌ Could not read table structure\n";
}

echo "\n";

// ==============================================
// FINAL STATUS
// ==============================================
if (count($errors) === 0) {
    echo "✅ ✅ ✅ SUCCESS! ✅ ✅ ✅\n\n";
    echo "All marketplace tables and columns are set up correctly.\n";
    echo "You can now use the create-ad.php endpoint.\n\n";
} else {
    echo "⚠️  ⚠️  ⚠️  PARTIAL SUCCESS ⚠️  ⚠️  ⚠️\n\n";
    echo "Some errors occurred. Please review the errors above.\n\n";
}

echo "⚠️  IMPORTANT: Delete this file (setup-marketplace-tables.php) for security!\n";

$con->close();

echo "\n✅ DONE!\n";
?>
