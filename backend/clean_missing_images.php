<?php
/**
 * Clean Missing Image References from Database
 * Sets imagee to NULL for products where the image file doesn't exist locally
 */

error_reporting(E_ALL);
ini_set('display_errors', 1);

// Database connection
$con = mysqli_connect("localhost", "root", "", "greenfieldsuperm_db");
if (!$con) {
    die("Connection failed: " . mysqli_connect_error());
}

$cleaned = 0;
$kept = 0;

echo "===== CLEANING MISSING IMAGE REFERENCES =====\n\n";

// Get all products with images
$query = "SELECT id, namee, imagee FROM dow WHERE imagee IS NOT NULL AND imagee != ''";
$result = mysqli_query($con, $query);

while ($row = mysqli_fetch_assoc($result)) {
    $imagePath = __DIR__ . '/admin/upload/dow/' . $row['imagee'];

    if (!file_exists($imagePath)) {
        // Image doesn't exist - clear the reference (use empty string instead of NULL)
        $updateQuery = "UPDATE dow SET imagee = '' WHERE id = " . $row['id'];
        mysqli_query($con, $updateQuery);
        // echo "❌ Cleared: {$row['namee']} (missing: {$row['imagee']})\n";  // Too much output
        $cleaned++;
    } else {
        $kept++;
    }
}

echo "\n===== SUMMARY =====\n";
echo "Kept (images exist): $kept\n";
echo "Cleared (images missing): $cleaned\n";
echo "\nDone!\n";

mysqli_close($con);
?>
