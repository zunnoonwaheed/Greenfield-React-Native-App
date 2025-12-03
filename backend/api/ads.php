<?php
/**
 * Marketplace Ads API
 * GET /api/ads.php - List all ads with pagination and filtering
 */

// Start output buffering
ob_start();

// CORS headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Session-ID');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    ob_end_clean();
    http_response_code(200);
    exit();
}

// Helper function to send JSON response
function sendResponse($data, $httpCode = 200) {
    while (ob_get_level() > 0) ob_end_clean();
    http_response_code($httpCode);
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit();
}

// Use production database connection from db_settings.php
require_once __DIR__ . '/../admin/includes/db_settings.php';

if (!$con) {
    sendResponse(['success' => false, 'error' => 'Database connection failed'], 500);
}

// Get query parameters
$page = isset($_GET['page']) ? max(1, intval($_GET['page'])) : 1;
$per_page = isset($_GET['per_page']) ? min(50, max(1, intval($_GET['per_page']))) : 20;
$category = isset($_GET['category']) ? trim($_GET['category']) : null;
$status = isset($_GET['status']) ? trim($_GET['status']) : 'active';
$user_id = isset($_GET['user_id']) ? intval($_GET['user_id']) : null;
$search = isset($_GET['search']) ? trim($_GET['search']) : null;

$offset = ($page - 1) * $per_page;

// Build WHERE clause
$where = ["a.status = ?"];
$params = [$status];
$types = 's';

if ($category) {
    $where[] = "a.category = ?";
    $params[] = $category;
    $types .= 's';
}

if ($user_id) {
    $where[] = "a.user_id = ?";
    $params[] = $user_id;
    $types .= 'i';
}

if ($search) {
    $where[] = "(a.title LIKE ? OR a.description LIKE ?)";
    $searchTerm = "%$search%";
    $params[] = $searchTerm;
    $params[] = $searchTerm;
    $types .= 'ss';
}

$whereClause = implode(' AND ', $where);

// Get total count
$countQuery = "SELECT COUNT(*) as total FROM marketplace_ads a WHERE $whereClause";
$countStmt = $con->prepare($countQuery);
if ($countStmt) {
    $countStmt->bind_param($types, ...$params);
    $countStmt->execute();
    $countResult = $countStmt->get_result();
    $total = $countResult->fetch_assoc()['total'];
    $countStmt->close();
} else {
    $total = 0;
}

// Fetch ads with primary image
$query = "
    SELECT
        a.*,
        COALESCE(a.seller_name, u.name) as seller_name,
        a.seller_phone,
        a.seller_email,
        (SELECT image_url FROM marketplace_ad_images WHERE ad_id = a.id AND is_primary = 1 LIMIT 1) as primary_image,
        (SELECT COUNT(*) FROM marketplace_ad_images WHERE ad_id = a.id) as image_count
    FROM marketplace_ads a
    LEFT JOIN users u ON a.user_id = u.id
    WHERE $whereClause
    ORDER BY a.featured DESC, a.created_at DESC
    LIMIT ? OFFSET ?
";

$stmt = $con->prepare($query);
if (!$stmt) {
    $con->close();
    sendResponse(['success' => false, 'error' => 'Database error'], 500);
}

// Add limit and offset to params
$params[] = $per_page;
$params[] = $offset;
$types .= 'ii';

$stmt->bind_param($types, ...$params);
$stmt->execute();
$result = $stmt->get_result();

$ads = [];
while ($row = $result->fetch_assoc()) {
    // Convert relative image path to full URL
    $primary_image = $row['primary_image'];
    if ($primary_image && !str_starts_with($primary_image, 'http')) {
        // If it's a relative path, prepend the base URL
        $base_url = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://" . $_SERVER['HTTP_HOST'];
        $primary_image = $base_url . "/mobile-api/backend/" . $primary_image;
    }

    $ads[] = [
        'id' => $row['id'],
        'title' => $row['title'],
        'description' => $row['description'],
        'price' => floatval($row['price']),
        'category' => $row['category'],
        'subcategory' => $row['subcategory'],
        'condition' => $row['condition'],
        'location' => $row['location'],
        'status' => $row['status'],
        'views' => intval($row['views']),
        'featured' => boolval($row['featured']),
        'primary_image' => $primary_image,
        'total_images' => intval($row['image_count']),
        'seller' => [
            'name' => $row['seller_name'] ?: 'Unknown Seller',
            'phone' => $row['seller_phone'],
            'email' => $row['seller_email']
        ],
        'created_at' => $row['created_at']
    ];
}

$stmt->close();
$con->close();

// Calculate pagination
$total_pages = ceil($total / $per_page);

sendResponse([
    'success' => true,
    'data' => [
        'ads' => $ads,
        'pagination' => [
            'current_page' => $page,
            'per_page' => $per_page,
            'total' => intval($total),
            'total_pages' => $total_pages
        ]
    ],
    'message' => count($ads) > 0 ? 'Ads fetched successfully' : 'No ads found'
]);
?>
