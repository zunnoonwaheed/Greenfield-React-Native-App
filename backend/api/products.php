<?php
include("../admin/includes/db_settings.php");
require_once("../helpers/logger.php");

header('Content-Type: application/json');

$startTime = startTimer();
$endpoint = '/api/products.php';

$search = $_GET['search'] ?? $_GET['q'] ?? $_POST['q'] ?? '';
$category_id = $_GET['category_id'] ?? '';
$brand_id = $_GET['brand_id'] ?? '';
$limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 20;
$offset = isset($_GET['offset']) ? (int)$_GET['offset'] : 0;

// Log incoming request
logRequest($endpoint, $_SERVER['REQUEST_METHOD'], [
    'search' => $search,
    'category_id' => $category_id,
    'brand_id' => $brand_id,
    'limit' => $limit,
    'offset' => $offset
]);

$query = "SELECT id, namee as name, slug, imagee as image_url, price, dprice as discounted_price, desc1 as description, catID as category_id, brID as brand_id
          FROM dow
          WHERE statuss = '1'";

$params = [];
$types = '';

if (!empty($search)) {
    $query .= " AND namee LIKE ?";
    $params[] = "%$search%";
    $types .= 's';
}

if (!empty($category_id)) {
    $query .= " AND catID = ?";
    $params[] = $category_id;
    $types .= 'i';
}

if (!empty($brand_id)) {
    $query .= " AND brID = ?";
    $params[] = $brand_id;
    $types .= 'i';
}

$query .= " ORDER BY id DESC LIMIT ? OFFSET ?";
$params[] = $limit;
$params[] = $offset;
$types .= 'ii';

$stmt = $con->prepare($query);
if (!empty($params)) {
    $stmt->bind_param($types, ...$params);
}
$stmt->execute();
$result = $stmt->get_result();

$products = [];
while ($row = $result->fetch_assoc()) {
    $products[] = [
        'id' => $row['id'],
        'name' => $row['name'],
        'slug' => $row['slug'],
        'image_url' => $row['image_url'],
        'price' => $row['price'],
        'discounted_price' => $row['discounted_price'] ?: $row['price'],
        'description' => $row['description'] ?: '',
        'category_id' => $row['category_id'],
        'brand_id' => $row['brand_id']
    ];
}

logInfo("Fetched " . count($products) . " products");
logResponse($endpoint, true, null, count($products) . " products retrieved");
endTimer($startTime, $endpoint);

echo json_encode([
    'success' => true,
    'data' => [
        'products' => $products
    ],
    'count' => count($products),
    'limit' => $limit,
    'offset' => $offset
]);
?>
