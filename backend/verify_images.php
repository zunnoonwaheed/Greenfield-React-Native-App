<?php
/**
 * Verify Image Availability for All Categories
 * Checks if images exist locally or on production server
 */

set_time_limit(0);
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Database connection
$con = mysqli_connect("localhost", "root", "", "greenfieldsuperm_db");
if (!$con) {
    die("Connection failed: " . mysqli_connect_error());
}

$productionUrl = 'https://greenfieldsupermarket.com';

echo "===== VERIFYING CATEGORY IMAGES =====\n\n";

// Get all active categories
$query = "SELECT id, name, image FROM sizee WHERE catID != 0 AND keyword1='yes' ORDER BY name ASC";
$result = mysqli_query($con, $query);

$total = 0;
$localExists = 0;
$productionExists = 0;
$missing = 0;

while ($row = mysqli_fetch_assoc($result)) {
    $total++;
    $name = $row['name'];
    $image = $row['image'];

    echo sprintf("%-40s", substr($name, 0, 40));

    if (empty($image)) {
        echo " ❌ NO IMAGE SPECIFIED\n";
        $missing++;
        continue;
    }

    $localPath = __DIR__ . '/admin/upload/stores/' . $image;

    // Check local
    if (file_exists($localPath)) {
        echo " ✅ LOCAL";
        $localExists++;
    } else {
        // Check production
        $remoteUrl = $productionUrl . '/admin/upload/stores/' . $image;
        $headers = @get_headers($remoteUrl);

        if ($headers && strpos($headers[0], '200') !== false) {
            echo " 🌐 PRODUCTION";
            $productionExists++;
        } else {
            echo " ❌ MISSING";
            $missing++;
        }
    }

    echo "\n";
}

echo "\n===== CATEGORY SUMMARY =====\n";
echo "Total Categories: $total\n";
echo "Available Locally: $localExists\n";
echo "Available on Production: $productionExists\n";
echo "Missing: $missing\n";
echo "Coverage: " . round((($localExists + $productionExists) / $total) * 100, 2) . "%\n\n";

// Now check products for a sample category (Baby Food & Formula = ID 93)
echo "===== VERIFYING BABY FOOD & FORMULA PRODUCTS =====\n\n";

$query = "SELECT id, namee, imagee FROM dow WHERE catID = 93 AND statuss = '1' LIMIT 10";
$result = mysqli_query($con, $query);

$totalProducts = 0;
$localProductImages = 0;
$productionProductImages = 0;
$missingProductImages = 0;

while ($row = mysqli_fetch_assoc($result)) {
    $totalProducts++;
    $name = $row['namee'];
    $image = $row['imagee'];

    echo sprintf("%-50s", substr($name, 0, 50));

    if (empty($image)) {
        echo " ❌ NO IMAGE\n";
        $missingProductImages++;
        continue;
    }

    $localPath = __DIR__ . '/admin/upload/dow/' . $image;

    // Check local
    if (file_exists($localPath)) {
        echo " ✅ LOCAL\n";
        $localProductImages++;
    } else {
        // Check production
        $remoteUrl = $productionUrl . '/admin/upload/dow/' . $image;
        $headers = @get_headers($remoteUrl);

        if ($headers && strpos($headers[0], '200') !== false) {
            echo " 🌐 PROD\n";
            $productionProductImages++;
        } else {
            echo " ❌ MISS\n";
            $missingProductImages++;
        }
    }
}

echo "\n===== PRODUCT SAMPLE SUMMARY =====\n";
echo "Total Products Checked: $totalProducts\n";
echo "Available Locally: $localProductImages\n";
echo "Available on Production: $productionProductImages\n";
echo "Missing: $missingProductImages\n";

if ($totalProducts > 0) {
    echo "Coverage: " . round((($localProductImages + $productionProductImages) / $totalProducts) * 100, 2) . "%\n";
}

mysqli_close($con);

echo "\n✅ Verification complete!\n";
?>
