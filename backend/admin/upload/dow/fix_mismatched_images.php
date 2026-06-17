<?php
/**
 * Fix the 2 products with mismatched images
 */

$db_host = "localhost";
$db_user = "root";
$db_pass = "";
$db_name = "greenfieldsuperm_db_local";

$con = mysqli_connect($db_host, $db_user, $db_pass, $db_name);
if ($con->connect_error) {
    die('Connect Error: '. mysqli_connect_error());
}

echo "=== Fixing Mismatched Product Images ===\n\n";

// Step 1: Create appropriate images
echo "Step 1: Creating appropriate images...\n";

// Copy vegetables image for green chilies
$sourceVeg = __DIR__ . '/../stores/1756823880_vegetables.webp';
$destChilies = __DIR__ . '/green-chilies.webp';

if (file_exists($sourceVeg)) {
    copy($sourceVeg, $destChilies);
    echo "✓ Created green-chilies.webp (" . number_format(filesize($destChilies)) . " bytes)\n";
} else {
    echo "✗ Source vegetables image not found\n";
}

// Copy fruits image for lemons
$sourceFruit = __DIR__ . '/../stores/1756823889_fruits.webp';
$destLemons = __DIR__ . '/lemons.webp';

if (file_exists($sourceFruit)) {
    copy($sourceFruit, $destLemons);
    echo "✓ Created lemons.webp (" . number_format(filesize($destLemons)) . " bytes)\n";
} else {
    echo "✗ Source fruits image not found\n";
}

echo "\nStep 2: Updating database...\n";

// Update Product #7: Green Chilies
$sql = "UPDATE dow SET imagee = 'green-chilies.webp' WHERE id = 7";
if ($con->query($sql)) {
    echo "✓ Updated Product #7 (Green Chilies) → green-chilies.webp\n";
} else {
    echo "✗ Failed to update Product #7\n";
}

// Update Product #8: Lemon Pack
$sql = "UPDATE dow SET imagee = 'lemons.webp' WHERE id = 8";
if ($con->query($sql)) {
    echo "✓ Updated Product #8 (Lemon Pack) → lemons.webp\n";
} else {
    echo "✗ Failed to update Product #8\n";
}

echo "\nStep 3: Verifying fixes...\n";
$sql = "SELECT id, namee, imagee FROM dow WHERE id IN (7, 8)";
$result = $con->query($sql);

while ($row = $result->fetch_assoc()) {
    $imagePath = __DIR__ . '/' . $row['imagee'];
    $exists = file_exists($imagePath) ? '✓' : '✗';
    echo "{$exists} Product #{$row['id']}: {$row['namee']} → {$row['imagee']}\n";
}

echo "\n=== Fix Complete! ===\n";

$con->close();
?>
