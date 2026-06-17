<?php
/**
 * Products API Test
 * Upload this to: /public_html/mobile-api/backend/
 * Access at: https://greenfieldsupermarket.com/mobile-api/backend/test-products-api.php
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<h1>Products API Diagnostic</h1>";
echo "<hr>";

// Test 1: Check if required files exist
echo "<h2>1. Checking Required Files</h2>";

$files_to_check = [
    'db_settings.php' => __DIR__ . '/admin/includes/db_settings.php',
    'logger.php' => __DIR__ . '/helpers/logger.php',
    'products.php' => __DIR__ . '/api/products.php'
];

$all_exist = true;
foreach ($files_to_check as $name => $path) {
    if (file_exists($path)) {
        echo "✅ $name found<br>";
    } else {
        echo "❌ $name NOT FOUND at: $path<br>";
        $all_exist = false;
    }
}

if (!$all_exist) {
    echo "<br><strong>⚠️ Missing files need to be uploaded!</strong><br>";
    die();
}

// Test 2: Test database connection
echo "<h2>2. Testing Database Connection</h2>";
try {
    require_once __DIR__ . '/admin/includes/db_settings.php';

    if ($con->connect_error) {
        echo "❌ Connection Error: " . $con->connect_error . "<br>";
        die();
    }

    echo "✅ Database connected successfully<br>";

    // Test 3: Check if dow table exists and has data
    echo "<h2>3. Checking 'dow' Table (Products)</h2>";
    $count_query = "SELECT COUNT(*) as count FROM dow WHERE statuss = '1'";
    $result = $con->query($count_query);

    if ($result) {
        $row = $result->fetch_assoc();
        echo "✅ 'dow' table exists<br>";
        echo "Active products count: <strong>" . $row['count'] . "</strong><br>";

        // Get sample products
        if ($row['count'] > 0) {
            echo "<h2>4. Sample Products</h2>";
            $sample_query = "SELECT id, namee, price, dprice, imagee FROM dow WHERE statuss = '1' LIMIT 5";
            $sample_result = $con->query($sample_query);

            echo "<table border='1' cellpadding='10'>";
            echo "<tr><th>ID</th><th>Name</th><th>Price</th><th>Discounted</th><th>Image</th></tr>";
            while ($product = $sample_result->fetch_assoc()) {
                echo "<tr>";
                echo "<td>" . $product['id'] . "</td>";
                echo "<td>" . $product['namee'] . "</td>";
                echo "<td>Rs " . $product['price'] . "</td>";
                echo "<td>Rs " . ($product['dprice'] ?: 'N/A') . "</td>";
                echo "<td>" . ($product['imagee'] ?: 'No image') . "</td>";
                echo "</tr>";
            }
            echo "</table>";

            echo "<br>";
            echo "<h2>✅ All Tests Passed!</h2>";
            echo "<p><strong>The API should work now!</strong></p>";
            echo "<p>Test the API at: <a href='/mobile-api/backend/api/products.php?limit=5'>/mobile-api/backend/api/products.php?limit=5</a></p>";
        } else {
            echo "⚠️ No active products found in database<br>";
        }
    } else {
        echo "❌ Error: " . $con->error . "<br>";
    }

} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "<br>";
}
?>
