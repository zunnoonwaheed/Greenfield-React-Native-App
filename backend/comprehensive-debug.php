<?php
/**
 * COMPREHENSIVE BACKEND DEBUG TEST
 * Tests EVERYTHING: Database, Tables, Queries, API endpoints, Files
 *
 * Visit: https://greenfieldsupermarket.com/mobile-api/backend/comprehensive-debug.php
 *
 * ⚠️  DELETE THIS FILE AFTER DEBUGGING! IT EXPOSES SENSITIVE INFO!
 */

// Enable ALL error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);

header('Content-Type: text/plain; charset=utf-8');

echo "╔═══════════════════════════════════════════════════════════════════╗\n";
echo "║           GREENFIELD BACKEND COMPREHENSIVE DEBUG TEST             ║\n";
echo "║                    " . date('Y-m-d H:i:s') . "                         ║\n";
echo "╚═══════════════════════════════════════════════════════════════════╝\n\n";

$testsPassed = 0;
$testsFailed = 0;
$warnings = 0;

// Helper function
function testResult($name, $passed, $message = '', $isWarning = false) {
    global $testsPassed, $testsFailed, $warnings;

    if ($isWarning) {
        echo "⚠️  ";
        $warnings++;
    } elseif ($passed) {
        echo "✅ ";
        $testsPassed++;
    } else {
        echo "❌ ";
        $testsFailed++;
    }

    echo "$name";
    if ($message) {
        echo "\n   → $message";
    }
    echo "\n";
}

// ═══════════════════════════════════════════════════════════════════
// 1. PHP ENVIRONMENT
// ═══════════════════════════════════════════════════════════════════
echo "\n┌─────────────────────────────────────────────────────────────────┐\n";
echo "│ 1. PHP ENVIRONMENT                                               │\n";
echo "└─────────────────────────────────────────────────────────────────┘\n";

testResult("PHP Version", true, phpversion());
testResult("PHP Memory Limit", true, ini_get('memory_limit'));
testResult("Max Execution Time", true, ini_get('max_execution_time') . "s");
testResult("Upload Max Filesize", true, ini_get('upload_max_filesize'));
testResult("Post Max Size", true, ini_get('post_max_size'));

$requiredExtensions = ['mysqli', 'json', 'mbstring', 'curl'];
foreach ($requiredExtensions as $ext) {
    testResult("Extension: $ext", extension_loaded($ext));
}

// ═══════════════════════════════════════════════════════════════════
// 2. FILE PERMISSIONS & PATHS
// ═══════════════════════════════════════════════════════════════════
echo "\n┌─────────────────────────────────────────────────────────────────┐\n";
echo "│ 2. FILE PERMISSIONS & PATHS                                      │\n";
echo "└─────────────────────────────────────────────────────────────────┘\n";

$currentDir = __DIR__;
testResult("Current Directory", true, $currentDir);
testResult("Directory Writable", is_writable($currentDir),
    is_writable($currentDir) ? "Yes" : "No - may cause issues with file uploads");

$criticalFiles = [
    'admin/includes/db_settings.php',
    'helpers/database.php',
    'helpers/auth.php',
    'helpers/response.php',
    'helpers/logger.php',
    'helpers/session_config.php',
    'api/products.php',
    'api/categories.php',
    'api/login.php',
    'api/register.php'
];

foreach ($criticalFiles as $file) {
    $fullPath = __DIR__ . '/' . $file;
    $exists = file_exists($fullPath);
    testResult("File: $file", $exists, $exists ? "Exists" : "MISSING!");
}

// ═══════════════════════════════════════════════════════════════════
// 3. DATABASE CONNECTION
// ═══════════════════════════════════════════════════════════════════
echo "\n┌─────────────────────────────────────────────────────────────────┐\n";
echo "│ 3. DATABASE CONNECTION                                           │\n";
echo "└─────────────────────────────────────────────────────────────────┘\n";

try {
    require_once __DIR__ . '/admin/includes/db_settings.php';

    if ($con && mysqli_ping($con)) {
        testResult("Database Connection", true, "Connected to $db_name on $db_host");
        testResult("Database User", true, $db_user);
        testResult("Connection Ping", mysqli_ping($con), "Connection is alive");

        // Get MySQL version
        $version = mysqli_get_server_info($con);
        testResult("MySQL Version", true, $version);

        // Get character set
        $charset = mysqli_character_set_name($con);
        testResult("Character Set", true, $charset);

    } else {
        testResult("Database Connection", false, "Failed to connect!");
        die("\n❌ Cannot proceed without database connection.\n");
    }
} catch (Exception $e) {
    testResult("Database Connection", false, "Exception: " . $e->getMessage());
    die("\n❌ Cannot proceed without database connection.\n");
}

// ═══════════════════════════════════════════════════════════════════
// 4. REQUIRED TABLES
// ═══════════════════════════════════════════════════════════════════
echo "\n┌─────────────────────────────────────────────────────────────────┐\n";
echo "│ 4. DATABASE TABLES                                               │\n";
echo "└─────────────────────────────────────────────────────────────────┘\n";

$requiredTables = [
    'users' => 'User accounts',
    'dow' => 'Products',
    'brands' => 'Product brands',
    'sizee' => 'Categories',
    'bundles' => 'Product bundles',
    'bundle_items' => 'Bundle contents',
    'orders' => 'Customer orders',
    'order_items' => 'Order line items',
    'locations' => 'DHA locations',
    'password_resets' => 'Password reset tokens',
    'user_addresses' => 'User delivery addresses',
    'payment_methods' => 'Saved payment methods',
    'notifications' => 'User notifications',
    'notification_settings' => 'Notification preferences',
    'marketplace_ads' => 'Marketplace listings',
    'marketplace_ad_images' => 'Marketplace images',
    'delivery_zones' => 'Delivery zones'
];

foreach ($requiredTables as $table => $description) {
    $result = mysqli_query($con, "SHOW TABLES LIKE '$table'");
    $exists = $result && mysqli_num_rows($result) > 0;

    if ($exists) {
        // Get row count
        $countResult = mysqli_query($con, "SELECT COUNT(*) as cnt FROM `$table`");
        $count = mysqli_fetch_assoc($countResult)['cnt'] ?? 0;
        testResult("Table: $table", true, "$description - $count records");
    } else {
        testResult("Table: $table", false, "MISSING! ($description)");
    }
}

// ═══════════════════════════════════════════════════════════════════
// 5. DOW (PRODUCTS) TABLE STRUCTURE
// ═══════════════════════════════════════════════════════════════════
echo "\n┌─────────────────────────────────────────────────────────────────┐\n";
echo "│ 5. PRODUCTS TABLE (dow) COLUMNS                                 │\n";
echo "└─────────────────────────────────────────────────────────────────┘\n";

$result = mysqli_query($con, "SHOW TABLES LIKE 'dow'");
if ($result && mysqli_num_rows($result) > 0) {
    $result = mysqli_query($con, "DESCRIBE dow");
    $columns = [];

    echo "Columns in 'dow' table:\n";
    while ($row = mysqli_fetch_assoc($result)) {
        $columns[] = $row['Field'];
        echo "  - {$row['Field']} ({$row['Type']}) {$row['Null']}\n";
    }

    echo "\nChecking required columns for products API:\n";
    $requiredCols = ['id', 'namee', 'price', 'dprice', 'imagee', 'catID', 'brID', 'statuss'];
    $optionalCols = ['rating', 'rating_count', 'discount_percentage', 'delivery_type', 'packaging', 'seller', 'is_popular'];

    foreach ($requiredCols as $col) {
        testResult("Required column: $col", in_array($col, $columns));
    }

    foreach ($optionalCols as $col) {
        testResult("Optional column: $col", in_array($col, $columns), "", !in_array($col, $columns));
    }
} else {
    testResult("Products Table Check", false, "dow table not found!");
}

// ═══════════════════════════════════════════════════════════════════
// 6. DATABASE QUERIES TEST
// ═══════════════════════════════════════════════════════════════════
echo "\n┌─────────────────────────────────────────────────────────────────┐\n";
echo "│ 6. DATABASE QUERIES TEST                                         │\n";
echo "└─────────────────────────────────────────────────────────────────┘\n";

// Test simple product query
$query = "SELECT id, namee, price FROM dow WHERE statuss = '1' LIMIT 1";
$result = mysqli_query($con, $query);
testResult("Simple Products Query", $result !== false,
    $result ? mysqli_num_rows($result) . " products found" : mysqli_error($con));

// Test products with brands JOIN
$query = "SELECT d.id, d.namee, b.name as brand_name
          FROM dow d
          LEFT JOIN brands b ON d.brID = b.id
          WHERE d.statuss = '1' LIMIT 1";
$result = mysqli_query($con, $query);
testResult("Products with Brands JOIN", $result !== false,
    $result ? "Query successful" : mysqli_error($con));

// Test products with COALESCE (what products.php uses)
$query = "SELECT d.id,
                 d.namee as name,
                 COALESCE(d.rating, 4.0) as rating,
                 COALESCE(d.rating_count, 0) as rating_count
          FROM dow d
          WHERE d.statuss = '1' LIMIT 1";
$result = mysqli_query($con, $query);
testResult("Products with COALESCE", $result !== false,
    $result ? "Query successful" : mysqli_error($con));

// Test categories query
$query = "SELECT id, namee FROM sizee ORDER BY orderID ASC LIMIT 5";
$result = mysqli_query($con, $query);
testResult("Categories Query", $result !== false,
    $result ? mysqli_num_rows($result) . " categories found" : mysqli_error($con));

// Test user query
$query = "SELECT id, name, email FROM users WHERE id = 1";
$result = mysqli_query($con, $query);
testResult("Users Query", $result !== false,
    $result ? "User query successful" : mysqli_error($con));

// Test user_addresses query
$query = "SELECT COUNT(*) as cnt FROM user_addresses";
$result = mysqli_query($con, $query);
if ($result) {
    $count = mysqli_fetch_assoc($result)['cnt'];
    testResult("User Addresses Query", true, "$count addresses in database");
} else {
    testResult("User Addresses Query", false, mysqli_error($con));
}

// Test notifications query
$query = "SELECT COUNT(*) as cnt FROM notifications";
$result = mysqli_query($con, $query);
if ($result) {
    $count = mysqli_fetch_assoc($result)['cnt'];
    testResult("Notifications Query", true, "$count notifications in database");
} else {
    testResult("Notifications Query", false, mysqli_error($con));
}

// ═══════════════════════════════════════════════════════════════════
// 7. API ENDPOINTS TEST
// ═══════════════════════════════════════════════════════════════════
echo "\n┌─────────────────────────────────────────────────────────────────┐\n";
echo "│ 7. API ENDPOINTS AVAILABILITY                                    │\n";
echo "└─────────────────────────────────────────────────────────────────┘\n";

$apiEndpoints = [
    'api/products.php',
    'api/categories.php',
    'api/login.php',
    'api/register.php',
    'api/profile.php',
    'api/addresses.php',
    'api/notifications.php',
    'api/payment-methods.php',
    'api/order-history.php',
    'api/bundles.php',
    'api/ads.php',
    'cart-contents.php'
];

foreach ($apiEndpoints as $endpoint) {
    $fullPath = __DIR__ . '/' . $endpoint;
    $exists = file_exists($fullPath);
    $readable = $exists && is_readable($fullPath);

    if ($exists && $readable) {
        testResult("Endpoint: $endpoint", true, "File exists and readable");
    } elseif ($exists) {
        testResult("Endpoint: $endpoint", false, "File exists but NOT readable!");
    } else {
        testResult("Endpoint: $endpoint", false, "File NOT found!");
    }
}

// ═══════════════════════════════════════════════════════════════════
// 8. SAMPLE DATA CHECK
// ═══════════════════════════════════════════════════════════════════
echo "\n┌─────────────────────────────────────────────────────────────────┐\n";
echo "│ 8. SAMPLE DATA                                                   │\n";
echo "└─────────────────────────────────────────────────────────────────┘\n";

// Get sample products
echo "\nSample Products (first 3):\n";
$result = mysqli_query($con, "SELECT id, namee, price, dprice, statuss FROM dow WHERE statuss = '1' LIMIT 3");
if ($result && mysqli_num_rows($result) > 0) {
    while ($row = mysqli_fetch_assoc($result)) {
        echo "  • ID {$row['id']}: {$row['namee']} - ₨{$row['price']} (Sale: ₨{$row['dprice']})\n";
    }
} else {
    echo "  ⚠️  No active products found!\n";
}

// Get sample categories
echo "\nSample Categories (first 5):\n";
$result = mysqli_query($con, "SELECT id, namee FROM sizee ORDER BY orderID ASC LIMIT 5");
if ($result && mysqli_num_rows($result) > 0) {
    while ($row = mysqli_fetch_assoc($result)) {
        echo "  • ID {$row['id']}: {$row['namee']}\n";
    }
} else {
    echo "  ⚠️  No categories found!\n";
}

// Get sample users
echo "\nSample Users (first 3):\n";
$result = mysqli_query($con, "SELECT id, name, email FROM users LIMIT 3");
if ($result && mysqli_num_rows($result) > 0) {
    while ($row = mysqli_fetch_assoc($result)) {
        echo "  • ID {$row['id']}: {$row['name']} ({$row['email']})\n";
    }
} else {
    echo "  ⚠️  No users found!\n";
}

// ═══════════════════════════════════════════════════════════════════
// 9. POTENTIAL ISSUES
// ═══════════════════════════════════════════════════════════════════
echo "\n┌─────────────────────────────────────────────────────────────────┐\n";
echo "│ 9. POTENTIAL ISSUES DETECTION                                    │\n";
echo "└─────────────────────────────────────────────────────────────────┘\n";

// Check for products without images
$result = mysqli_query($con, "SELECT COUNT(*) as cnt FROM dow WHERE statuss = '1' AND (imagee IS NULL OR imagee = '')");
if ($result) {
    $count = mysqli_fetch_assoc($result)['cnt'];
    if ($count > 0) {
        testResult("Products without images", false, "$count products missing images", true);
    } else {
        testResult("Products without images", true, "All products have images");
    }
}

// Check for products with invalid prices
$result = mysqli_query($con, "SELECT COUNT(*) as cnt FROM dow WHERE statuss = '1' AND (price <= 0 OR price IS NULL)");
if ($result) {
    $count = mysqli_fetch_assoc($result)['cnt'];
    if ($count > 0) {
        testResult("Products with invalid prices", false, "$count products have invalid prices", true);
    } else {
        testResult("Products with invalid prices", true, "All product prices are valid");
    }
}

// Check for orphaned products (no category)
$result = mysqli_query($con, "SELECT COUNT(*) as cnt FROM dow WHERE statuss = '1' AND catID NOT IN (SELECT id FROM sizee)");
if ($result) {
    $count = mysqli_fetch_assoc($result)['cnt'];
    if ($count > 0) {
        testResult("Orphaned products (no category)", false, "$count products have invalid category", true);
    } else {
        testResult("Orphaned products", true, "All products have valid categories");
    }
}

// ═══════════════════════════════════════════════════════════════════
// SUMMARY
// ═══════════════════════════════════════════════════════════════════
echo "\n╔═══════════════════════════════════════════════════════════════════╗\n";
echo "║                         TEST SUMMARY                              ║\n";
echo "╚═══════════════════════════════════════════════════════════════════╝\n";
echo "\n";
echo "✅ Tests Passed:  $testsPassed\n";
echo "❌ Tests Failed:  $testsFailed\n";
echo "⚠️  Warnings:      $warnings\n";
echo "\n";

if ($testsFailed > 0) {
    echo "❌ ISSUES DETECTED! Review the failed tests above.\n";
} elseif ($warnings > 0) {
    echo "⚠️  Some warnings found. Review them above.\n";
} else {
    echo "✅ ALL TESTS PASSED! Backend is healthy.\n";
}

echo "\n";
echo "═══════════════════════════════════════════════════════════════════\n";
echo "⚠️  SECURITY WARNING: DELETE THIS FILE IMMEDIATELY AFTER DEBUGGING!\n";
echo "   This file exposes sensitive database and system information.\n";
echo "═══════════════════════════════════════════════════════════════════\n";

mysqli_close($con);
?>
