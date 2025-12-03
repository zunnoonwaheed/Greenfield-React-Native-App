<?php
/**
 * FIX MARKETPLACE ADS TABLES - Add Missing Columns
 * Run ONCE via browser: https://greenfieldsupermarket.com/mobile-api/backend/fix-marketplace-ads-columns.php
 * Then DELETE this file for security!
 */

// Enable error reporting to see what's wrong
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Content-Type: text/plain; charset=utf-8');

echo "═══════════════════════════════════════════════\n";
echo "  FIX MARKETPLACE_ADS TABLE COLUMNS\n";
echo "  Adding missing columns\n";
echo "═══════════════════════════════════════════════\n\n";

// Try to include db settings
$db_settings_path = __DIR__ . '/admin/includes/db_settings.php';
echo "Looking for db_settings.php at: $db_settings_path\n";

if (!file_exists($db_settings_path)) {
    die("❌ Error: db_settings.php not found at $db_settings_path\n");
}

require_once $db_settings_path;

if (!isset($con) || !$con) {
    die("❌ Database connection failed! Check db_settings.php\n");
}

echo "✅ Connected to database\n\n";

$columns_added = 0;
$columns_skipped = 0;
$errors = [];

// ==============================================
// FIX marketplace_ads TABLE
// ==============================================
echo "📋 Fixing 'marketplace_ads' table...\n\n";

// Check if table exists
$check = $con->query("SHOW TABLES LIKE 'marketplace_ads'");
if (!$check || $check->num_rows === 0) {
    die("❌ Table 'marketplace_ads' does not exist! Run the migration script first.\n");
}

// Get current columns
$columnsResult = $con->query("SHOW COLUMNS FROM marketplace_ads");
$existingColumns = [];
while ($row = $columnsResult->fetch_assoc()) {
    $existingColumns[] = $row['Field'];
}

echo "Current columns: " . implode(', ', $existingColumns) . "\n\n";

// Define columns to add
$columnsToAdd = [
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
foreach ($columnsToAdd as $column) {
    $columnName = $column['name'];
    echo "Checking column '$columnName'... ";

    if (in_array($columnName, $existingColumns)) {
        echo "⚠️  Already exists\n";
        $columns_skipped++;
    } else {
        if ($con->query($column['sql'])) {
            echo "✅ Added successfully\n";
            $columns_added++;
        } else {
            $error = $con->error;
            echo "❌ Error: $error\n";
            $errors[] = "$columnName: $error";
        }
    }
}

echo "\n";

// ==============================================
// FIX marketplace_ad_images TABLE
// ==============================================
echo "📋 Fixing 'marketplace_ad_images' table...\n\n";

// Check if table exists
$check = $con->query("SHOW TABLES LIKE 'marketplace_ad_images'");
if (!$check || $check->num_rows === 0) {
    echo "⚠️  Table 'marketplace_ad_images' does not exist! Skipping...\n\n";
} else {
    // Get current columns
    $columnsResult = $con->query("SHOW COLUMNS FROM marketplace_ad_images");
    $existingImgColumns = [];
    while ($row = $columnsResult->fetch_assoc()) {
        $existingImgColumns[] = $row['Field'];
    }

    echo "Current columns: " . implode(', ', $existingImgColumns) . "\n\n";

    // Add image_url column (or rename image_path to image_url)
    echo "Checking column 'image_url'... ";
    if (in_array('image_url', $existingImgColumns)) {
        echo "⚠️  Already exists\n";
        $columns_skipped++;
    } else if (in_array('image_path', $existingImgColumns)) {
        // Rename image_path to image_url
        $sql = "ALTER TABLE `marketplace_ad_images` CHANGE `image_path` `image_url` VARCHAR(255) NOT NULL";
        if ($con->query($sql)) {
            echo "✅ Renamed 'image_path' to 'image_url'\n";
            $columns_added++;
        } else {
            $error = $con->error;
            echo "❌ Error: $error\n";
            $errors[] = "image_url rename: $error";
        }
    } else {
        // Add new column
        $sql = "ALTER TABLE `marketplace_ad_images` ADD COLUMN `image_url` VARCHAR(255) NOT NULL AFTER `ad_id`";
        if ($con->query($sql)) {
            echo "✅ Added successfully\n";
            $columns_added++;
        } else {
            $error = $con->error;
            echo "❌ Error: $error\n";
            $errors[] = "image_url: $error";
        }
    }

    // Add sort_order column
    echo "Checking column 'sort_order'... ";
    if (in_array('sort_order', $existingImgColumns)) {
        echo "⚠️  Already exists\n";
        $columns_skipped++;
    } else {
        $sql = "ALTER TABLE `marketplace_ad_images` ADD COLUMN `sort_order` INT(11) DEFAULT 0 AFTER `is_primary`";
        if ($con->query($sql)) {
            echo "✅ Added successfully\n";
            $columns_added++;
        } else {
            $error = $con->error;
            echo "❌ Error: $error\n";
            $errors[] = "sort_order: $error";
        }
    }

    echo "\n";
}

// ==============================================
// SUMMARY
// ==============================================
echo "═══════════════════════════════════════════════\n";
echo "  FIX SUMMARY\n";
echo "═══════════════════════════════════════════════\n\n";
echo "✅ Columns added: $columns_added\n";
echo "⚠️  Columns skipped (already exist): $columns_skipped\n";
echo "❌ Errors: " . count($errors) . "\n\n";

if (count($errors) > 0) {
    echo "Error details:\n";
    foreach ($errors as $error) {
        echo "  - $error\n";
    }
    echo "\n";
}

if ($columns_added > 0) {
    echo "✅ Database schema fixed successfully!\n";
    echo "\nYou can now use the create-ad.php endpoint.\n";
} else {
    echo "ℹ️  All columns already exist.\n";
}

echo "\n⚠️  IMPORTANT: Delete this file (fix-marketplace-ads-columns.php) for security!\n";

// Show final table structure
echo "\n═══════════════════════════════════════════════\n";
echo "  FINAL TABLE STRUCTURE\n";
echo "═══════════════════════════════════════════════\n\n";

echo "marketplace_ads columns:\n";
$result = $con->query("SHOW COLUMNS FROM marketplace_ads");
if ($result) {
    while ($row = $result->fetch_assoc()) {
        echo "  - {$row['Field']} ({$row['Type']})\n";
    }
}

echo "\nmarketplace_ad_images columns:\n";
$result = $con->query("SHOW COLUMNS FROM marketplace_ad_images");
if ($result) {
    while ($row = $result->fetch_assoc()) {
        echo "  - {$row['Field']} ({$row['Type']})\n";
    }
}

$con->close();

echo "\n✅ DONE!\n";
?>
