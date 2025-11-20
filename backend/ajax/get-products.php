<?php
header('Content-Type: application/json');
include("../admin/includes/db_settings.php");

$catId   = intval($_POST['catId'] ?? 0);
$brandId = intval($_POST['brandId'] ?? 0);

if ($catId <= 0) {
    echo json_encode(['success' => false, 'message' => 'Category ID is required']);
    exit;
}

// brand filter
$brandFilter = "";
if ($brandId > 0) {
    $brandFilter = " AND brID='$brandId'";
}

// products fetch
$pQ = "SELECT * FROM dow WHERE catID='$catId' AND statuss='1' $brandFilter";
$pRes = mysqli_query($con, $pQ);

if (!$pRes) {
    echo json_encode(['success' => false, 'message' => 'Database error']);
    exit;
}

$products = [];
while ($p = mysqli_fetch_assoc($pRes)) {
    $products[] = [
        'id' => $p['id'],
        'name' => $p['namee'],
        'slug' => $p['slug'],
        'image' => $p['imagee'] ?: 'default.jpg',
        'price' => $p['price'],
        'dprice' => $p['dprice'],
        'description' => $p['description'] ?? '',
        'category_id' => $p['catID'],
        'brand_id' => $p['brID'] ?? null
    ];
}

echo json_encode([
    'success' => true,
    'products' => $products,
    'count' => count($products)
]);

