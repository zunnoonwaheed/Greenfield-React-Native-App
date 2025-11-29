<?php
include("../admin/includes/db_settings.php");
require_once("../helpers/logger.php");

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$startTime = startTimer();
$endpoint = '/api/products.php';

// Production URL for image fallback
$productionUrl = 'https://greenfieldsupermarket.com';

// Basic filters
$search = $_GET['search'] ?? $_GET['q'] ?? $_POST['q'] ?? '';
$category_id = $_GET['category_id'] ?? '';
$brand_id = $_GET['brand_id'] ?? '';
$limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 50;
$offset = isset($_GET['offset']) ? (int)$_GET['offset'] : 0;

// Advanced filters
$price_min = isset($_GET['price_min']) ? (float)$_GET['price_min'] : null;
$price_max = isset($_GET['price_max']) ? (float)$_GET['price_max'] : null;
$discount_min = isset($_GET['discount_min']) ? (int)$_GET['discount_min'] : null;
$rating_min = isset($_GET['rating_min']) ? (float)$_GET['rating_min'] : null;
$delivery_type = $_GET['delivery_type'] ?? '';
$packaging = $_GET['packaging'] ?? '';
$seller = $_GET['seller'] ?? '';
$sort_by = $_GET['sort_by'] ?? '';

// Log incoming request
logRequest($endpoint, $_SERVER['REQUEST_METHOD'], [
    'search' => $search,
    'category_id' => $category_id,
    'brand_id' => $brand_id,
    'limit' => $limit,
    'offset' => $offset
]);

// Build query
$query = "SELECT
            d.id,
            d.namee as name,
            d.slug,
            d.imagee as image_url,
            d.price,
            d.dprice as discounted_price,
            d.desc1 as description,
            d.catID as category_id,
            d.brID as brand_id,
            COALESCE(d.rating, 4.0) as rating,
            COALESCE(d.rating_count, 0) as rating_count,
            COALESCE(d.discount_percentage,
                CASE WHEN d.price > 0 AND d.dprice > 0 AND d.dprice < d.price
                     THEN ROUND(((d.price - d.dprice) / d.price) * 100)
                     ELSE 0 END
            ) as discount_percentage,
            COALESCE(d.delivery_type, 'standard') as delivery_type,
            COALESCE(d.packaging, 'single') as packaging,
            COALESCE(d.seller, b.name, 'Greenfield') as seller,
            COALESCE(d.is_popular, 0) as is_popular,
            b.name as brand_name
          FROM dow d
          LEFT JOIN brands b ON d.brID = b.id
          WHERE d.statuss = '1'";

$params = [];
$types = '';

// Search filter
if (!empty($search)) {
    $query .= " AND (d.namee LIKE ? OR d.desc1 LIKE ?)";
    $params[] = "%$search%";
    $params[] = "%$search%";
    $types .= 'ss';
}

// Category filter
if (!empty($category_id)) {
    $query .= " AND d.catID = ?";
    $params[] = $category_id;
    $types .= 'i';
}

// Brand filter
if (!empty($brand_id)) {
    $query .= " AND d.brID = ?";
    $params[] = $brand_id;
    $types .= 'i';
}

// Price range filter
if ($price_min !== null) {
    $query .= " AND COALESCE(d.dprice, d.price) >= ?";
    $params[] = $price_min;
    $types .= 'd';
}
if ($price_max !== null) {
    $query .= " AND COALESCE(d.dprice, d.price) <= ?";
    $params[] = $price_max;
    $types .= 'd';
}

// Discount filter
if ($discount_min !== null && $discount_min > 0) {
    $query .= " AND (
        d.discount_percentage >= ? OR
        (d.price > 0 AND d.dprice > 0 AND d.dprice < d.price AND
         ROUND(((d.price - d.dprice) / d.price) * 100) >= ?)
    )";
    $params[] = $discount_min;
    $params[] = $discount_min;
    $types .= 'ii';
}

// Rating filter
if ($rating_min !== null) {
    $query .= " AND COALESCE(d.rating, 4.0) >= ?";
    $params[] = $rating_min;
    $types .= 'd';
}

// Delivery type filter
if (!empty($delivery_type) && $delivery_type !== 'all') {
    $deliveryMap = [
        'Free delivery' => 'free',
        'Express delivery' => 'express',
        'Standard delivery' => 'standard',
        'Pickup available' => 'pickup'
    ];
    $dbDeliveryType = $deliveryMap[$delivery_type] ?? $delivery_type;
    $query .= " AND COALESCE(d.delivery_type, 'standard') = ?";
    $params[] = $dbDeliveryType;
    $types .= 's';
}

// Packaging filter
if (!empty($packaging) && $packaging !== 'all') {
    $packagingMap = [
        'Single item' => 'single',
        'Pack of 2' => 'pack_2',
        'Pack of 5' => 'pack_5',
        'Pack of 10' => 'pack_10',
        'Bulk packaging' => 'bulk'
    ];
    $dbPackaging = $packagingMap[$packaging] ?? $packaging;
    $query .= " AND COALESCE(d.packaging, 'single') = ?";
    $params[] = $dbPackaging;
    $types .= 's';
}

// Seller/Brand filter
if (!empty($seller) && $seller !== 'all') {
    $query .= " AND (d.seller = ? OR b.name = ?)";
    $params[] = $seller;
    $params[] = $seller;
    $types .= 'ss';
}

// Sorting - Prioritize products WITH images
$orderBy = "CASE WHEN d.imagee IS NOT NULL AND d.imagee != '' THEN 0 ELSE 1 END, d.id ASC";
if (!empty($sort_by)) {
    switch ($sort_by) {
        case 'Price (Low to High)':
        case 'price-low-high':
            $orderBy = "COALESCE(d.dprice, d.price) ASC";
            break;
        case 'Price (High to Low)':
        case 'price-high-low':
            $orderBy = "COALESCE(d.dprice, d.price) DESC";
            break;
        case 'Newest First':
        case 'newest':
            $orderBy = "d.id DESC";
            break;
        case 'Most Popular':
        case 'popular':
            $orderBy = "d.is_popular DESC, d.rating_count DESC";
            break;
        case 'Rating (High to Low)':
        case 'rating':
            $orderBy = "d.rating DESC";
            break;
        case 'discount':
            $orderBy = "d.discount_percentage DESC";
            break;
        case 'name':
            $orderBy = "d.namee ASC";
            break;
    }
}

$query .= " ORDER BY $orderBy LIMIT ? OFFSET ?";
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
// Get base URL for images
$protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https' : 'http';
$host = $_SERVER['HTTP_HOST'];

while ($row = $result->fetch_assoc()) {
    // Construct image URL with FALLBACK to production
    $imageUrl = '';
    if (!empty($row['image_url'])) {
        $localImagePath = __DIR__ . '/../admin/upload/dow/' . $row['image_url'];

        // Check if image exists locally
        if (file_exists($localImagePath)) {
            // Use local image
            $imageUrl = $protocol . '://' . $host . '/admin/upload/dow/' . $row['image_url'];
        } else {
            // Fallback to production server
            $imageUrl = $productionUrl . '/admin/upload/dow/' . $row['image_url'];
        }
    }

    // Calculate discount percentage
    $discountPct = (int)$row['discount_percentage'];
    if ($discountPct == 0 && $row['price'] > 0 && $row['discounted_price'] > 0 && $row['discounted_price'] < $row['price']) {
        $discountPct = round((($row['price'] - $row['discounted_price']) / $row['price']) * 100);
    }

    $products[] = [
        'id' => (string)$row['id'],
        'name' => $row['name'],
        'slug' => $row['slug'],
        'image_url' => $imageUrl,
        'price' => (float)$row['price'],
        'discounted_price' => (float)($row['discounted_price'] ?: $row['price']),
        'description' => $row['description'] ?: '',
        'category_id' => $row['category_id'],
        'brand_id' => $row['brand_id'],
        'brand_name' => $row['brand_name'] ?: 'Greenfield',
        'rating' => (float)$row['rating'],
        'rating_count' => (int)$row['rating_count'],
        'discount_percentage' => $discountPct,
        'delivery_type' => $row['delivery_type'],
        'packaging' => $row['packaging'],
        'seller' => $row['seller']
    ];
}

// Get total count
$countQuery = "SELECT COUNT(*) as total FROM dow d LEFT JOIN brands b ON d.brID = b.id WHERE d.statuss = '1'";
$countResult = $con->query($countQuery);
$totalCount = $countResult->fetch_assoc()['total'];

logInfo("Fetched " . count($products) . " products");
logResponse($endpoint, true, null, count($products) . " products retrieved");
endTimer($startTime, $endpoint);

echo json_encode([
    'success' => true,
    'data' => [
        'products' => $products
    ],
    'count' => count($products),
    'total' => (int)$totalCount,
    'limit' => $limit,
    'offset' => $offset
]);
?>
