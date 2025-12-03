<?php
/**
 * Debug test for products.php
 * Visit: https://greenfieldsupermarket.com/mobile-api/backend/api/test-products-debug.php
 * DELETE this file after debugging!
 */

// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);

header('Content-Type: text/plain; charset=utf-8');

echo "═══════════════════════════════════════════════\n";
echo "  PRODUCTS API DEBUG TEST\n";
echo "═══════════════════════════════════════════════\n\n";

// Test 1: Database connection
echo "Test 1: Database Connection\n";
echo str_repeat("-", 50) . "\n";

try {
    require_once __DIR__ . '/../admin/includes/db_settings.php';

    if ($con) {
        echo "✅ Database connected\n";
        echo "   Database: $db_name\n";
        echo "   Host: $db_host\n\n";
    } else {
        die("❌ Database connection failed\n");
    }
} catch (Exception $e) {
    die("❌ Error: " . $e->getMessage() . "\n");
}

// Test 2: Check dow table exists
echo "Test 2: Check 'dow' table\n";
echo str_repeat("-", 50) . "\n";

$result = mysqli_query($con, "SHOW TABLES LIKE 'dow'");
if ($result && mysqli_num_rows($result) > 0) {
    echo "✅ 'dow' table exists\n\n";
} else {
    die("❌ 'dow' table not found!\n");
}

// Test 3: Get table structure
echo "Test 3: 'dow' table columns\n";
echo str_repeat("-", 50) . "\n";

$result = mysqli_query($con, "DESCRIBE dow");
if ($result) {
    echo "Columns in dow table:\n";
    while ($row = mysqli_fetch_assoc($result)) {
        echo "  - {$row['Field']} ({$row['Type']})\n";
    }
    echo "\n";
} else {
    echo "❌ Error getting table structure: " . mysqli_error($con) . "\n\n";
}

// Test 4: Check brands table
echo "Test 4: Check 'brands' table\n";
echo str_repeat("-", 50) . "\n";

$result = mysqli_query($con, "SHOW TABLES LIKE 'brands'");
if ($result && mysqli_num_rows($result) > 0) {
    echo "✅ 'brands' table exists\n\n";
} else {
    echo "⚠️  'brands' table not found (LEFT JOIN may fail)\n\n";
}

// Test 5: Simple product query
echo "Test 5: Simple Product Query\n";
echo str_repeat("-", 50) . "\n";

$simpleQuery = "SELECT id, namee as name, price, dprice, statuss FROM dow WHERE statuss = '1' LIMIT 3";
$result = mysqli_query($con, $simpleQuery);

if ($result) {
    $count = mysqli_num_rows($result);
    echo "✅ Query successful! Found $count products\n";

    while ($row = mysqli_fetch_assoc($result)) {
        echo "  Product ID {$row['id']}: {$row['name']} - Price: {$row['price']}\n";
    }
    echo "\n";
} else {
    echo "❌ Query failed: " . mysqli_error($con) . "\n\n";
}

// Test 6: Product query with LEFT JOIN brands
echo "Test 6: Product Query with Brands JOIN\n";
echo str_repeat("-", 50) . "\n";

$joinQuery = "SELECT d.id, d.namee as name, d.price, b.name as brand_name
              FROM dow d
              LEFT JOIN brands b ON d.brID = b.id
              WHERE d.statuss = '1'
              LIMIT 3";
$result = mysqli_query($con, $joinQuery);

if ($result) {
    $count = mysqli_num_rows($result);
    echo "✅ JOIN query successful! Found $count products\n";

    while ($row = mysqli_fetch_assoc($result)) {
        $brand = $row['brand_name'] ?? 'No Brand';
        echo "  Product {$row['id']}: {$row['name']} - Brand: $brand\n";
    }
    echo "\n";
} else {
    echo "❌ JOIN query failed: " . mysqli_error($con) . "\n\n";
}

// Test 7: Check for problematic columns
echo "Test 7: Check optional columns\n";
echo str_repeat("-", 50) . "\n";

$optionalColumns = ['rating', 'rating_count', 'discount_percentage', 'delivery_type', 'packaging', 'seller', 'is_popular'];
$existingColumns = [];

$result = mysqli_query($con, "DESCRIBE dow");
while ($row = mysqli_fetch_assoc($result)) {
    $existingColumns[] = $row['Field'];
}

foreach ($optionalColumns as $col) {
    if (in_array($col, $existingColumns)) {
        echo "  ✅ Column '$col' exists\n";
    } else {
        echo "  ⚠️  Column '$col' missing (COALESCE needed)\n";
    }
}

echo "\n";

// Test 8: Test the actual products.php query (simplified)
echo "Test 8: Test Popular Products Query\n";
echo str_repeat("-", 50) . "\n";

$query = "SELECT
            d.id,
            d.namee as name,
            d.price,
            d.dprice as discounted_price,
            COALESCE(d.rating, 4.0) as rating,
            b.name as brand_name
          FROM dow d
          LEFT JOIN brands b ON d.brID = b.id
          WHERE d.statuss = '1'
          LIMIT 5";

$result = mysqli_query($con, $query);

if ($result) {
    $count = mysqli_num_rows($result);
    echo "✅ Popular products query successful! Found $count products\n";

    while ($row = mysqli_fetch_assoc($result)) {
        echo "  - {$row['name']} (Rating: {$row['rating']})\n";
    }
    echo "\n";
} else {
    echo "❌ Query failed: " . mysqli_error($con) . "\n\n";
}

mysqli_close($con);

echo "═══════════════════════════════════════════════\n";
echo "  DEBUG TEST COMPLETE\n";
echo "═══════════════════════════════════════════════\n";
echo "\n⚠️  IMPORTANT: Delete this file after debugging!\n";
?>
