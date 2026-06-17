<?php
/**
 * Verify product images match product names
 */

$db_host = "localhost";
$db_user = "root";
$db_pass = "";
$db_name = "greenfieldsuperm_db_local";

$con = mysqli_connect($db_host, $db_user, $db_pass, $db_name);
if ($con->connect_error) {
    die('Connect Error: '. mysqli_connect_error());
}

echo "=== Verifying Product Images Match Names ===\n\n";

// Get first 30 active products
$sql = "SELECT id, namee, imagee FROM dow WHERE statuss = '1' AND imagee IS NOT NULL AND imagee != '' ORDER BY id ASC LIMIT 30";
$result = $con->query($sql);

$issues = [];
$total = 0;

while ($row = $result->fetch_assoc()) {
    $total++;
    $productId = $row['id'];
    $productName = $row['namee'];
    $imageName = $row['imagee'];
    $imagePath = __DIR__ . '/' . $imageName;

    // Check if image exists
    if (!file_exists($imagePath)) {
        $issues[] = "Product #{$productId}: {$productName}\n  ✗ Image missing: {$imageName}\n";
        continue;
    }

    // Check for obvious mismatches based on keywords
    $nameLower = strtolower($productName);
    $imageLower = strtolower($imageName);

    $mismatches = [];

    // Check specific product types
    if (stripos($productName, 'Green Chili') !== false && stripos($imageName, 'gobi') !== false) {
        $mismatches[] = "Green Chilies product using cabbage (gobi) image";
    }
    if (stripos($productName, 'Lemon') !== false && stripos($imageName, 'mango') !== false) {
        $mismatches[] = "Lemon product using mango image";
    }
    if (stripos($productName, 'Coffee') !== false && stripos($imageName, 'tea') !== false) {
        $mismatches[] = "Coffee product using tea image";
    }
    if (stripos($productName, 'Tea') !== false && stripos($imageName, 'coffee') !== false) {
        $mismatches[] = "Tea product using coffee image";
    }

    if (!empty($mismatches)) {
        $issues[] = "Product #{$productId}: {$productName}\n  Image: {$imageName}\n  ⚠ Mismatch: " . implode(', ', $mismatches) . "\n";
    } else {
        echo "✓ Product #{$productId}: " . substr($productName, 0, 50) . "\n";
    }
}

echo "\n=== Issues Found ===\n";
if (!empty($issues)) {
    foreach ($issues as $issue) {
        echo $issue . "\n";
    }
    echo "\nTotal products checked: {$total}\n";
    echo "Issues found: " . count($issues) . "\n";
} else {
    echo "✓ No obvious mismatches found!\n";
    echo "Total products checked: {$total}\n";
}

$con->close();
?>
