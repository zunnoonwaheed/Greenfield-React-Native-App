<?php
/**
 * Download Missing Product and Category Images from Production Server
 * This script downloads images referenced in the database but missing locally
 */

set_time_limit(0); // No time limit
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Database connection
$con = mysqli_connect("localhost", "root", "", "greenfieldsuperm_db");
if (!$con) {
    die("Connection failed: " . mysqli_connect_error());
}

$productionUrl = 'https://greenfieldsupermarket.com';
$downloaded = 0;
$skipped = 0;
$failed = 0;

echo "===== DOWNLOADING MISSING PRODUCT IMAGES =====\n\n";

// Get all products with images
$query = "SELECT DISTINCT imagee FROM dow WHERE imagee IS NOT NULL AND imagee != '' AND statuss = '1'";
$result = mysqli_query($con, $query);

while ($row = mysqli_fetch_assoc($result)) {
    $filename = $row['imagee'];
    $localPath = __DIR__ . '/admin/upload/dow/' . $filename;

    // Skip if file already exists
    if (file_exists($localPath)) {
        $skipped++;
        continue;
    }

    // Download from production
    $remoteUrl = $productionUrl . '/admin/upload/dow/' . $filename;
    echo "Downloading: $filename ... ";

    $imageData = @file_get_contents($remoteUrl);

    if ($imageData !== false && strlen($imageData) > 0) {
        file_put_contents($localPath, $imageData);
        echo "✅ SUCCESS\n";
        $downloaded++;
    } else {
        echo "❌ FAILED\n";
        $failed++;
    }

    // Sleep to avoid overwhelming the server
    usleep(100000); // 0.1 second delay
}

echo "\n===== DOWNLOADING MISSING CATEGORY IMAGES =====\n\n";

// Get all categories with images
$query = "SELECT DISTINCT image FROM sizee WHERE image IS NOT NULL AND image != '' AND catID != 0 AND keyword1='yes'";
$result = mysqli_query($con, $query);

while ($row = mysqli_fetch_assoc($result)) {
    $filename = $row['image'];
    $localPath = __DIR__ . '/admin/upload/stores/' . $filename;

    // Skip if file already exists
    if (file_exists($localPath)) {
        $skipped++;
        continue;
    }

    // Download from production
    $remoteUrl = $productionUrl . '/admin/upload/stores/' . $filename;
    echo "Downloading: $filename ... ";

    $imageData = @file_get_contents($remoteUrl);

    if ($imageData !== false && strlen($imageData) > 0) {
        file_put_contents($localPath, $imageData);
        echo "✅ SUCCESS\n";
        $downloaded++;
    } else {
        echo "❌ FAILED\n";
        $failed++;
    }

    // Sleep to avoid overwhelming the server
    usleep(100000); // 0.1 second delay
}

echo "\n===== SUMMARY =====\n";
echo "Downloaded: $downloaded\n";
echo "Skipped (already exist): $skipped\n";
echo "Failed: $failed\n";
echo "\nDone!\n";

mysqli_close($con);
?>
