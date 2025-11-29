<?php
/**
 * Restore Image References by Matching Product Names with Available Images
 * This script attempts to restore image references that were cleared
 */

set_time_limit(0);
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Database connection
$con = mysqli_connect("localhost", "root", "", "greenfieldsuperm_db");
if (!$con) {
    die("Connection failed: " . mysqli_connect_error());
}

$restored = 0;
$imageDir = __DIR__ . '/admin/upload/dow/';

// Get all available image files
$imageFiles = array_diff(scandir($imageDir), array('.', '..'));
echo "Found " . count($imageFiles) . " image files\n\n";

// Get products without images
$query = "SELECT id, namee FROM dow WHERE (imagee IS NULL OR imagee = '') AND statuss = '1'";
$result = mysqli_query($con, $query);

echo "===== ATTEMPTING TO RESTORE IMAGE REFERENCES =====\n\n";

while ($row = mysqli_fetch_assoc($result)) {
    $productId = $row['id'];
    $productName = strtolower($row['namee']);

    // Try to find matching image by searching filename patterns
    foreach ($imageFiles as $imageFile) {
        // Skip if not an image file
        if (!preg_match('/\.(webp|jpg|jpeg|png|avif)$/i', $imageFile)) {
            continue;
        }

        // Check if product name contains key words from filename
        $filenameLower = strtolower($imageFile);

        // For now, we can't reliably match - would need original data
        // Skip auto-matching to avoid incorrect associations
    }
}

echo "\n===== BETTER SOLUTION: IMPORT FROM BACKUP =====\n";
echo "Since we have the image files but lost the database associations,\n";
echo "we need to import the original database backup.\n\n";

// Check if greenfieldsuperm_database.sql exists
if (file_exists('/Users/mac/Greenfield-Integration/backend/greenfieldsuperm_database.sql')) {
    echo "✅ Found greenfieldsuperm_database.sql\n";
    echo "   Run: mysql -u root greenfieldsuperm_db < greenfieldsuperm_database.sql\n";
} else {
    echo "❌ Original database backup not found\n";
    echo "   Need to export from web application database\n";
}

mysqli_close($con);
?>
