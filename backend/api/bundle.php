<?php
/**
 * Get Bundle Details API
 * Method: GET
 * Params: id
 * Returns: JSON
 */
include("../admin/includes/db_settings.php");
header('Content-Type: application/json');

$bundle_id = intval($_GET['id'] ?? 0);

if ($bundle_id <= 0) {
    echo json_encode(['success' => false, 'message' => 'Bundle ID is required']);
    exit;
}

// Fetch bundle
$bQ = "SELECT * FROM bundles WHERE id = ? AND (status = 'active' OR status = '1') LIMIT 1";
$stmt = $con->prepare($bQ);
$stmt->bind_param("i", $bundle_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows == 0) {
    echo json_encode(['success' => false, 'message' => 'Bundle not found']);
    exit;
}

$bundle = $result->fetch_assoc();

// Fetch bundle items with product info
$itemsQ = "
    SELECT bi.quantity, d.id as product_id, d.namee as product_name, d.slug, d.price, d.dprice, d.imagee
    FROM bundle_items bi
    JOIN dow d ON bi.product_id = d.id
    WHERE bi.bundle_id = ?
";
$stmt = $con->prepare($itemsQ);
$stmt->bind_param("i", $bundle_id);
$stmt->execute();
$itemsRes = $stmt->get_result();

$items = [];
while ($item = $itemsRes->fetch_assoc()) {
    $items[] = [
        'product_id' => (int)$item['product_id'],
        'product_name' => $item['product_name'],
        'product_slug' => $item['slug'],
        'product_image' => $item['imagee'] ?? '',
        'price' => (float)$item['price'],
        'dprice' => (float)$item['dprice'],
        'quantity' => (int)$item['quantity']
    ];
}

echo json_encode([
    'success' => true,
    'data' => [
        'bundle' => [
            'id' => (int)$bundle['id'],
            'name' => $bundle['name'],
            'description' => $bundle['description'],
            'base_price' => (float)$bundle['base_price'],
            'discount' => (float)$bundle['discount'],
            'final_price' => (float)$bundle['final_price'],
            'image' => $bundle['image'] ?? '',
            'status' => $bundle['status'],
            'created_at' => $bundle['created_at']
        ],
        'items' => $items,
        'item_count' => count($items)
    ]
]);
?>
