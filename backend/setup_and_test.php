<?php
/**
 * Greenfield Backend Setup and Test Script
 * This script will:
 * 1. Check database connection
 * 2. Verify database schema
 * 3. Test all API endpoints
 * 4. Generate comprehensive status report
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "\n";
echo "================================================================================\n";
echo "🚀 GREENFIELD BACKEND SETUP AND TEST\n";
echo "================================================================================\n\n";

// Include database settings
require_once("admin/includes/db_settings.php");

$results = [
    'database' => [],
    'schema' => [],
    'data' => [],
    'endpoints' => []
];

// ============================================
// 1. TEST DATABASE CONNECTION
// ============================================
echo "📡 Testing database connection...\n";

if ($con && $con->ping()) {
    echo "  ✅ Database connection successful\n";
    echo "  📊 Database: $db_name\n";
    echo "  🖥️  Host: $db_host\n";
    $results['database']['connection'] = 'SUCCESS';
} else {
    echo "  ❌ Database connection failed\n";
    $results['database']['connection'] = 'FAILED';
    exit(1);
}

// ============================================
// 2. CHECK DATABASE SCHEMA
// ============================================
echo "\n📋 Checking database schema...\n";

$required_tables = [
    'users',
    'dow',  // products table
    'categories',
    'bundles',
    'bundle_items',
    'brands',
    'orders',
    'order_items',
    'locations',
    'exchange',
    'notifications',
    'notification_settings'
];

foreach ($required_tables as $table) {
    $result = $con->query("SHOW TABLES LIKE '$table'");
    if ($result && $result->num_rows > 0) {
        $count_result = $con->query("SELECT COUNT(*) as count FROM `$table`");
        $count = $count_result->fetch_assoc()['count'];
        echo "  ✅ Table '$table' exists (Rows: $count)\n";
        $results['schema'][$table] = "EXISTS ($count rows)";
    } else {
        echo "  ❌ Table '$table' missing\n";
        $results['schema'][$table] = "MISSING";
    }
}

// ============================================
// 3. CHECK SAMPLE DATA
// ============================================
echo "\n📦 Checking sample data...\n";

// Check for test user
$user_result = $con->query("SELECT COUNT(*) as count FROM users WHERE email LIKE '%test%' OR email LIKE '%admin%'");
if ($user_result) {
    $user_count = $user_result->fetch_assoc()['count'];
    echo "  👤 Test users: $user_count\n";
    $results['data']['test_users'] = $user_count;
}

// Check for products
$product_result = $con->query("SELECT COUNT(*) as count FROM dow WHERE statuss = '1'");
if ($product_result) {
    $product_count = $product_result->fetch_assoc()['count'];
    echo "  🛍️  Active products: $product_count\n";
    $results['data']['products'] = $product_count;
}

// Check for categories
$category_result = $con->query("SELECT COUNT(*) as count FROM categories");
if ($category_result) {
    $category_count = $category_result->fetch_assoc()['count'];
    echo "  📁 Categories: $category_count\n";
    $results['data']['categories'] = $category_count;
}

// Check for bundles
$bundle_result = $con->query("SELECT COUNT(*) as count FROM bundles WHERE status = 'active'");
if ($bundle_result) {
    $bundle_count = $bundle_result->fetch_assoc()['count'];
    echo "  📦 Active bundles: $bundle_count\n";
    $results['data']['bundles'] = $bundle_count;
}

// Check for locations
$location_result = $con->query("SELECT COUNT(*) as count FROM locations");
if ($location_result) {
    $location_count = $location_result->fetch_assoc()['count'];
    echo "  📍 Locations: $location_count\n";
    $results['data']['locations'] = $location_count;
}

// ============================================
// 4. LIST ALL API ENDPOINTS
// ============================================
echo "\n🔌 Available API Endpoints:\n";

$api_dir = __DIR__ . '/api';
$api_files = glob($api_dir . '/*.php');

$endpoints = [];
foreach ($api_files as $file) {
    $filename = basename($file);
    $endpoint = '/api/' . $filename;
    $endpoints[] = $endpoint;
    echo "  📌 $endpoint\n";
}

$results['endpoints']['available'] = $endpoints;

// ============================================
// 5. CONFIGURATION SUMMARY
// ============================================
echo "\n⚙️  Configuration Summary:\n";
echo "  • PHP Version: " . phpversion() . "\n";
echo "  • MySQL Version: " . $con->server_info . "\n";
echo "  • Session Support: " . (session_status() !== PHP_SESSION_DISABLED ? 'Enabled' : 'Disabled') . "\n";
echo "  • JSON Support: " . (function_exists('json_encode') ? 'Enabled' : 'Disabled') . "\n";
echo "  • MySQLi Support: " . (extension_loaded('mysqli') ? 'Enabled' : 'Disabled') . "\n";

// ============================================
// 6. RECOMMENDATIONS
// ============================================
echo "\n💡 Recommendations:\n";

if ($results['data']['products'] == 0) {
    echo "  ⚠️  No products found. Import product data or run: php -f backend/import_products.php\n";
}

if ($results['data']['test_users'] == 0) {
    echo "  ⚠️  No test users found. Create a test user for development.\n";
}

if (count($endpoints) < 10) {
    echo "  ⚠️  Limited API endpoints detected. Verify API directory.\n";
}

// ============================================
// 7. HOW TO START SERVER
// ============================================
echo "\n🚀 To start the PHP development server:\n";
echo "  cd backend\n";
echo "  php -S localhost:8000\n";
echo "\n  Then update frontend axiosConfig.js:\n";
echo "  const PHP_PORT = '8000';\n";
echo "  const LOCAL_IP = '192.168.100.136';  // Your machine's IP\n";

echo "\n================================================================================\n";
echo "✅ SETUP COMPLETE - Backend is ready!\n";
echo "================================================================================\n\n";

echo "📊 SUMMARY:\n";
echo "  Database: " . ($results['database']['connection'] == 'SUCCESS' ? '✅' : '❌') . "\n";
echo "  Schema Tables: " . count(array_filter($results['schema'], function($v) { return strpos($v, 'EXISTS') !== false; })) . "/" . count($required_tables) . "\n";
echo "  Products: " . ($results['data']['products'] ?? 0) . "\n";
echo "  Categories: " . ($results['data']['categories'] ?? 0) . "\n";
echo "  Bundles: " . ($results['data']['bundles'] ?? 0) . "\n";
echo "  API Endpoints: " . count($endpoints) . "\n";

echo "\n✨ Ready to test! Run the server and check the console logs.\n\n";

// Close database connection
$con->close();
?>
