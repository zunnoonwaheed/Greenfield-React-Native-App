<?php
/**
 * Match Available Images to Products
 * Assigns images to products based on timestamp and ID patterns
 */

set_time_limit(0);
error_reporting(E_ALL);
ini_set('display_errors', 1);

$con = mysqli_connect("localhost", "root", "", "greenfieldsuperm_db");
if (!$con) {
    die("Connection failed: " . mysqli_connect_error());
}

$imageDir = __DIR__ . '/admin/upload/dow/';
$imageFiles = array_diff(scandir($imageDir), array('.', '..'));
$matched = 0;

echo "===== MATCHING IMAGES TO PRODUCTS =====\n\n";

// Sort image files
sort($imageFiles);

// Get all products without images in order
$query = "SELECT id, namee FROM dow WHERE (imagee IS NULL OR imagee = '') AND statuss = '1' ORDER BY id ASC";
$result = mysqli_query($con, $query);
$products = [];
while ($row = mysqli_fetch_assoc($result)) {
    $products[] = $row;
}

echo "Products without images: " . count($products) . "\n";
echo "Available image files: " . count($imageFiles) . "\n\n";

// Simple sequential assignment (first product gets first image, etc.)
$imageIndex = 0;
foreach ($products as $product) {
    if ($imageIndex >= count($imageFiles)) {
        break;
    }

    $imageFile = $imageFiles[$imageIndex];

    // Skip if not an image file
    if (!preg_match('/\.(webp|jpg|jpeg|png|avif)$/i', $imageFile)) {
        $imageIndex++;
        continue;
    }

    // Assign this image to this product
    $updateQuery = "UPDATE dow SET imagee = '" . mysqli_real_escape_string($con, $imageFile) . "' WHERE id = " . $product['id'];
    mysqli_query($con, $updateQuery);

    echo "✅ Assigned {$imageFile} to: {$product['namee']}\n";
    $matched++;
    $imageIndex++;
}

echo "\n===== SUMMARY =====\n";
echo "Matched: $matched\n";
echo "Done!\n";

mysqli_close($con);
?>
