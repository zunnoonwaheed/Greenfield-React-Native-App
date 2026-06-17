<?php
/**
 * Run Google Authentication Migration
 * Upload to: /public_html/mobile-api/backend/
 * Access ONCE at: https://greenfieldsupermarket.com/mobile-api/backend/run-google-migration.php
 *
 * IMPORTANT: Delete this file after running it!
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

echo "<h1>Google Authentication Migration</h1>";
echo "<hr>";

// Require database connection
require_once __DIR__ . '/admin/includes/db_settings.php';

if (!$con) {
    die("❌ Database connection failed!");
}

echo "<h2>Running Migration...</h2>";

// Migration SQL commands
$migrations = [
    "Add google_id column" => "ALTER TABLE users ADD COLUMN google_id VARCHAR(255) DEFAULT NULL AFTER password",
    "Add unique index on google_id" => "ALTER TABLE users ADD UNIQUE KEY google_id_unique (google_id)",
    "Add email_verified column" => "ALTER TABLE users ADD COLUMN email_verified TINYINT(1) DEFAULT 0 AFTER google_id",
    "Update existing Google users" => "UPDATE users SET email_verified = 1 WHERE google_id IS NOT NULL AND google_id != ''"
];

$success_count = 0;
$error_count = 0;

foreach ($migrations as $name => $sql) {
    echo "<p><strong>$name:</strong> ";

    $result = $con->query($sql);

    if ($result) {
        echo "✅ Success</p>";
        $success_count++;
    } else {
        // Check if error is because column already exists (error code 1060)
        if ($con->errno == 1060) {
            echo "⚠️ Already exists (skipping)</p>";
            $success_count++;
        } elseif ($con->errno == 1061) {
            echo "⚠️ Index already exists (skipping)</p>";
            $success_count++;
        } else {
            echo "❌ Error: " . $con->error . "</p>";
            $error_count++;
        }
    }
}

echo "<hr>";
echo "<h2>Migration Summary</h2>";
echo "<p>✅ Successful: $success_count</p>";
echo "<p>❌ Errors: $error_count</p>";

if ($error_count == 0) {
    echo "<h2 style='color: green;'>✅ Migration Complete!</h2>";
    echo "<p>Google Sign-In is now ready to use.</p>";
    echo "<p><strong style='color: red;'>IMPORTANT: Delete this file (run-google-migration.php) from your server now!</strong></p>";

    // Verify the columns were added
    echo "<h3>Verification:</h3>";
    $verify_query = "SHOW COLUMNS FROM users WHERE Field IN ('google_id', 'email_verified')";
    $result = $con->query($verify_query);

    if ($result && $result->num_rows == 2) {
        echo "<p>✅ Both columns verified in database</p>";
        echo "<ul>";
        while ($row = $result->fetch_assoc()) {
            echo "<li>✅ " . $row['Field'] . " (" . $row['Type'] . ")</li>";
        }
        echo "</ul>";
    }

    echo "<p><a href='test-google-endpoint.php'>Run Google Endpoint Test Again</a></p>";
} else {
    echo "<h2 style='color: red;'>⚠️ Migration had errors!</h2>";
    echo "<p>Please check the errors above and fix them manually.</p>";
}

$con->close();
?>
