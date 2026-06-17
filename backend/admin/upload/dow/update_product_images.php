<?php
/**
 * Update test products to use real product images
 */

$db_host = "localhost";
$db_user = "root";
$db_pass = "";
$db_name = "greenfieldsuperm_db_local";

$con = mysqli_connect($db_host, $db_user, $db_pass, $db_name);
if ($con->connect_error) {
    die('Connect Error: '. mysqli_connect_error());
}

// Map product IDs to real images that exist
$updates = [
    // Chocolates - use Cadbury image
    '10063' => '1756206996_Cadbury Dairy Milk Chocolate Bar White Chocolate PNG.jpeg',
    '10062' => '1756206996_Cadbury Dairy Milk Chocolate Bar White Chocolate PNG.jpeg',

    // Nuts/Snacks - use fun nuggets
    '10061' => '1757940660_grocerapp_kn_fun_nuggets_5e9b0a30bdc3e.webp',
    '10060' => '1757940660_grocerapp_kn_fun_nuggets_5e9b0a30bdc3e.webp',
    '10059' => '1757940660_grocerapp_kn_fun_nuggets_5e9b0a30bdc3e.webp',
    '10058' => '1757940660_grocerapp_kn_fun_nuggets_5e9b0a30bdc3e.webp',

    // Cookies - use a product image
    '10064' => '1756207848_36445_main.avif',
];

foreach ($updates as $productId => $imageName) {
    $sql = "UPDATE dow SET imagee = ? WHERE id = ?";
    $stmt = $con->prepare($sql);
    $stmt->bind_param('si', $imageName, $productId);

    if ($stmt->execute()) {
        echo "✓ Updated product {$productId} → {$imageName}\n";
    } else {
        echo "✗ Failed to update product {$productId}\n";
    }
}

echo "\n=== Testing image files exist ===\n";
foreach ($updates as $productId => $imageName) {
    $path = __DIR__ . '/' . $imageName;
    if (file_exists($path)) {
        $size = filesize($path);
        echo "✓ {$imageName} (" . number_format($size) . " bytes)\n";
    } else {
        echo "✗ {$imageName} NOT FOUND\n";
    }
}

$con->close();
?>
