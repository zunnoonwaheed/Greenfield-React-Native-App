<?php
include("../admin/includes/db_settings.php");
header('Content-Type: application/json');

$id = $_GET['id'] ?? '';
$slug = $_GET['slug'] ?? '';
$brand_filter = $_GET['brand_filter'] ?? '';

if (empty($id) && empty($slug)) {
    echo json_encode(['success' => false, 'message' => 'Category ID or slug is required']);
    exit;
}

// Get category details by ID or slug
if (!empty($id)) {
    $catQuery = "SELECT * FROM categories WHERE id = ?";
    $stmt = $con->prepare($catQuery);
    $stmt->bind_param("i", $id);
} else {
    $catQuery = "SELECT * FROM categories WHERE slug = ?";
    $stmt = $con->prepare($catQuery);
    $stmt->bind_param("s", $slug);
}

$stmt->execute();
$catResult = $stmt->get_result();

if ($catResult->num_rows === 0) {
    echo json_encode(['success' => false, 'message' => 'Category not found']);
    exit;
}

$category = $catResult->fetch_assoc();
$catID = $category['id'];

// Get products in this category
$productQuery = "SELECT id, namee as name, slug, imagee as image, price, dprice, description
                 FROM dow
                 WHERE catID = ? AND statuss = '1'";

if (!empty($brand_filter)) {
    $productQuery .= " AND brID = ?";
    $stmt = $con->prepare($productQuery);
    $stmt->bind_param("ii", $catID, $brand_filter);
} else {
    $stmt = $con->prepare($productQuery);
    $stmt->bind_param("i", $catID);
}

$stmt->execute();
$productResult = $stmt->get_result();

$products = [];
while ($row = $productResult->fetch_assoc()) {
    $products[] = [
        'id' => $row['id'],
        'name' => $row['name'],
        'slug' => $row['slug'],
        'image' => $row['image'],
        'price' => $row['price'],
        'dprice' => $row['dprice'],
        'description' => $row['description']
    ];
}

// Get brands if requested
$brands = [];
if (!empty($brand_filter)) {
    $brandQuery = "SELECT DISTINCT b.id, b.name
                   FROM brands b
                   INNER JOIN dow d ON b.id = d.brID
                   WHERE d.catID = ?";
    $stmt = $con->prepare($brandQuery);
    $stmt->bind_param("i", $catID);
    $stmt->execute();
    $brandResult = $stmt->get_result();

    while ($row = $brandResult->fetch_assoc()) {
        $brands[] = [
            'id' => $row['id'],
            'name' => $row['name']
        ];
    }
}

echo json_encode([
    'success' => true,
    'category' => [
        'id' => $category['id'],
        'name' => $category['name'],
        'slug' => $category['slug'],
        'image' => $category['image']
    ],
    'products' => $products,
    'brands' => $brands,
    'product_count' => count($products)
]);
?>
