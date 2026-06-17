<?php
/**
 * Test Google Login Endpoint
 * Upload to: /public_html/mobile-api/backend/
 * Access at: https://greenfieldsupermarket.com/mobile-api/backend/test-google-endpoint.php
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<h1>Google Login Endpoint Test</h1>";
echo "<hr>";

// Test 1: Check if google-login.php exists
echo "<h2>1. Checking Google Login Files</h2>";

$files_to_check = [
    'google-login.php' => __DIR__ . '/api/google-login.php',
    'response.php helper' => __DIR__ . '/helpers/response.php',
    'auth.php helper' => __DIR__ . '/helpers/auth.php',
    'database.php helper' => __DIR__ . '/helpers/database.php'
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
    echo "<br><strong>⚠️ Some Google Sign-In files are missing!</strong><br>";
    echo "<p>You need to upload the missing helper files from backend/helpers/</p>";
}

// Test 2: Check database has google_id column
echo "<h2>2. Checking Database Schema</h2>";
require_once __DIR__ . '/admin/includes/db_settings.php';

$query = "SHOW COLUMNS FROM users LIKE 'google_id'";
$result = $con->query($query);

if ($result && $result->num_rows > 0) {
    echo "✅ 'google_id' column exists in users table<br>";
} else {
    echo "❌ 'google_id' column NOT FOUND in users table<br>";
    echo "<p>Run the migration: backend/migrations/add_google_auth.sql</p>";
}

$query = "SHOW COLUMNS FROM users LIKE 'email_verified'";
$result = $con->query($query);

if ($result && $result->num_rows > 0) {
    echo "✅ 'email_verified' column exists in users table<br>";
} else {
    echo "❌ 'email_verified' column NOT FOUND in users table<br>";
    echo "<p>Run the migration: backend/migrations/add_google_auth.sql</p>";
}

echo "<hr>";
echo "<h2>Google Sign-In Configuration</h2>";
echo "<p><strong>Current Google Web Client ID:</strong> 969529169540-vkaojfsqj9n4167e0a2cbahlh5ogkn8v.apps.googleusercontent.com</p>";
echo "<p><strong>Backend Endpoint:</strong> <a href='/mobile-api/backend/api/google-login.php'>/mobile-api/backend/api/google-login.php</a></p>";

if ($all_exist) {
    echo "<br><h2>✅ All Files Ready!</h2>";
    echo "<p>Next steps:</p>";
    echo "<ol>";
    echo "<li>Get your APK's SHA-1 certificate fingerprint</li>";
    echo "<li>Add it to Google Cloud Console</li>";
    echo "<li>Test Google Sign-In in the APK</li>";
    echo "</ol>";
}
?>
