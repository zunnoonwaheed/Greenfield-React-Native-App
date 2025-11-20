<?php
/**
 * Get Product Details API
 * Supports both ID and slug
 * Method: GET
 * Params: id OR slug
 * Returns: JSON
 */
include("../admin/includes/db_settings.php");
header('Content-Type: application/json');

$id = $_GET['id'] ?? '';
$slug = $_GET['slug'] ?? '';

if (empty($id) && empty($slug)) {
    echo json_encode(['success' => false, 'message' => 'Product ID or slug is required']);
    exit;
}

// Get product details by ID or slug
if (!empty($id)) {
    $productQuery = "SELECT * FROM dow WHERE id = ? AND statuss = '1'";
    $stmt = $con->prepare($productQuery);
    $stmt->bind_param("i", $id);
} else {
    $productQuery = "SELECT * FROM dow WHERE slug = ? AND statuss = '1'";
    $stmt = $con->prepare($productQuery);
    $stmt->bind_param("s", $slug);
}

$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(['success' => false, 'message' => 'Product not found']);
    exit;
}

$product = $result->fetch_assoc();

// Get similar products (same category)
$similarQuery = "SELECT id, namee as name, slug, imagee as image, price, dprice
                 FROM dow
                 WHERE catID = ? AND id != ? AND statuss = '1'
                 LIMIT 6";
$stmt = $con->prepare($similarQuery);
$stmt->bind_param("ii", $product['catID'], $product['id']);
$stmt->execute();
$similarResult = $stmt->get_result();

$similarProducts = [];
while ($row = $similarResult->fetch_assoc()) {
    $similarProducts[] = [
        'id' => (int)$row['id'],
        'name' => $row['name'],
        'slug' => $row['slug'],
        'image' => $row['image'],
        'price' => (float)$row['price'],
        'dprice' => (float)$row['dprice']
    ];
}

echo json_encode([
    'success' => true,
    'data' => [
        'product' => [
            'id' => (int)$product['id'],
            'name' => $product['namee'],
            'slug' => $product['slug'],
            'image' => $product['imagee'],
            'price' => (float)$product['price'],
            'dprice' => (float)$product['dprice'],
            'description' => $product['desc1'] ?? '',
            'category_id' => (int)$product['catID'],
            'brand_id' => (int)($product['brID'] ?? 0)
        ],
        'similar_products' => $similarProducts
    ]
]);
?>
