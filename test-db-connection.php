<?php
/**
 * Database Connection Diagnostic Script
 * Upload this to: /public_html/mobile-api/backend/
 * Access at: https://greenfieldsupermarket.com/mobile-api/backend/test-db-connection.php
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<h1>Database Connection Test</h1>";
echo "<hr>";

// Test 1: Check if db_settings.php exists
echo "<h2>1. Checking db_settings.php</h2>";
$db_settings_path = __DIR__ . '/admin/includes/db_settings.php';
if (file_exists($db_settings_path)) {
    echo "✅ db_settings.php found at: $db_settings_path<br>";
} else {
    echo "❌ db_settings.php NOT FOUND at: $db_settings_path<br>";
    echo "<pre>Current directory: " . __DIR__ . "</pre>";
    die("Cannot proceed without db_settings.php");
}

// Test 2: Include db_settings.php
echo "<h2>2. Including db_settings.php</h2>";
try {
    require_once $db_settings_path;
    echo "✅ Successfully included db_settings.php<br>";
} catch (Exception $e) {
    echo "❌ Error including db_settings.php: " . $e->getMessage() . "<br>";
    die();
}

// Test 3: Check connection variable
echo "<h2>3. Checking Database Connection</h2>";
if (isset($con) && $con instanceof mysqli) {
    echo "✅ Database connection object exists<br>";

    if ($con->connect_error) {
        echo "❌ Connection Error: " . $con->connect_error . "<br>";
        echo "Error Number: " . $con->connect_errno . "<br>";
    } else {
        echo "✅ Successfully connected to database!<br>";
        echo "Database: $db_name<br>";
        echo "User: $db_user<br>";
    }
} else {
    echo "❌ Connection object not found or invalid<br>";
    die();
}

// Test 4: Test a simple query
echo "<h2>4. Testing Database Query</h2>";
$test_query = "SHOW TABLES";
$result = $con->query($test_query);

if ($result) {
    echo "✅ Successfully executed query<br>";
    echo "<strong>Tables in database:</strong><br>";
    echo "<ul>";
    while ($row = $result->fetch_array()) {
        echo "<li>" . $row[0] . "</li>";
    }
    echo "</ul>";
} else {
    echo "❌ Query failed: " . $con->error . "<br>";
}

// Test 5: Check if products table exists and has data
echo "<h2>5. Checking Products Table</h2>";
$products_query = "SELECT COUNT(*) as count FROM products";
$result = $con->query($products_query);

if ($result) {
    $row = $result->fetch_assoc();
    echo "✅ Products table exists<br>";
    echo "Total products: " . $row['count'] . "<br>";

    // Get a sample product
    $sample_query = "SELECT * FROM products LIMIT 1";
    $sample_result = $con->query($sample_query);
    if ($sample_result && $sample_result->num_rows > 0) {
        echo "<strong>Sample product:</strong><br>";
        echo "<pre>";
        print_r($sample_result->fetch_assoc());
        echo "</pre>";
    }
} else {
    echo "❌ Error checking products table: " . $con->error . "<br>";
}

// Test 6: Check helpers directory
echo "<h2>6. Checking Helper Files</h2>";
$logger_path = __DIR__ . '/helpers/logger.php';
if (file_exists($logger_path)) {
    echo "✅ logger.php found<br>";
} else {
    echo "❌ logger.php NOT FOUND at: $logger_path<br>";
}

echo "<hr>";
echo "<h2>✅ Diagnostic Complete</h2>";
echo "<p>If all tests passed, the API should work. If you see errors above, that's what needs to be fixed.</p>";
?>
