<?php
/**
 * Marketplace Ads API
 * GET /api/ads.php - List all ads (with filters)
 * Returns marketplace ads list with pagination and filters
 */

// Start output buffering to prevent any accidental output
ob_start();

// CORS headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    ob_end_clean();
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/../helpers/database.php';
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../helpers/logger.php';

// Database connection
$host = 'localhost';
$db = 'greenfieldsuperm_db';
$user = 'root';
$pass = '';

// Suppress mysqli errors from being output directly
mysqli_report(MYSQLI_REPORT_OFF);

$con = new mysqli($host, $user, $pass, $db);

if ($con->connect_error) {
    respondError('Database connection failed: ' . $con->connect_error);
}

$con->set_charset('utf8mb4');

// Check if marketplace_ads table exists
$tableCheck = $con->query("SHOW TABLES LIKE 'marketplace_ads'");
if (!$tableCheck || $tableCheck->num_rows === 0) {
    // Table doesn't exist - return empty ads array for now
    $con->close();
    respondSuccess([
        'ads' => [],
        'pagination' => [
            'current_page' => 1,
            'per_page' => 20,
            'total' => 0,
            'total_pages' => 0
        ],
        'message' => 'Marketplace tables not yet created. Please run the schema migration.'
    ]);
}

// Get query parameters
$page = isset($_GET['page']) ? max(1, intval($_GET['page'])) : 1;
$limit = isset($_GET['limit']) ? min(50, max(1, intval($_GET['limit']))) : 20;
$offset = ($page - 1) * $limit;

$category = isset($_GET['category']) ? trim($_GET['category']) : '';
$condition = isset($_GET['condition']) ? trim($_GET['condition']) : '';
$search = isset($_GET['search']) ? trim($_GET['search']) : '';
$user_id = isset($_GET['user_id']) ? intval($_GET['user_id']) : 0;
$featured_only = isset($_GET['featured']) && $_GET['featured'] === 'true';

// Build query
$whereConditions = ["a.status = 'active'"];
$params = [];
$types = '';

if (!empty($category)) {
    $whereConditions[] = "a.category = ?";
    $params[] = $category;
    $types .= 's';
}

if (!empty($condition)) {
    $whereConditions[] = "a.condition = ?";
    $params[] = $condition;
    $types .= 's';
}

if (!empty($search)) {
    $whereConditions[] = "(a.title LIKE ? OR a.description LIKE ?)";
    $searchTerm = "%{$search}%";
    $params[] = $searchTerm;
    $params[] = $searchTerm;
    $types .= 'ss';
}

if ($user_id > 0) {
    $whereConditions[] = "a.user_id = ?";
    $params[] = $user_id;
    $types .= 'i';
}

if ($featured_only) {
    $whereConditions[] = "a.featured = 1";
}

$whereClause = implode(' AND ', $whereConditions);

// Count total
$countQuery = "SELECT COUNT(*) as total FROM marketplace_ads a WHERE {$whereClause}";
$totalResult = dbSelect($con, $countQuery, $types, $params);
$total = 0;
if ($totalResult && $row = $totalResult->fetch_assoc()) {
    $total = intval($row['total']);
}

// Fetch ads with user info and primary image
// Use seller_name from ad if set, otherwise fall back to user name
$query = "
    SELECT
        a.*,
        COALESCE(a.seller_name, u.name) as display_seller_name,
        COALESCE(a.seller_email, u.email) as display_seller_email,
        COALESCE(a.seller_phone, u.phone) as display_seller_phone,
        (SELECT image_url FROM marketplace_ad_images WHERE ad_id = a.id AND is_primary = 1 LIMIT 1) as primary_image,
        (SELECT COUNT(*) FROM marketplace_ad_images WHERE ad_id = a.id) as total_images
    FROM marketplace_ads a
    LEFT JOIN users u ON a.user_id = u.id
    WHERE {$whereClause}
    ORDER BY a.featured DESC, a.created_at DESC
    LIMIT ? OFFSET ?
";

$params[] = $limit;
$params[] = $offset;
$types .= 'ii';

$result = dbSelect($con, $query, $types, $params);

$ads = [];
if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        // Parse specifications JSON
        $specifications = [];
        if (!empty($row['specifications'])) {
            $specs = json_decode($row['specifications'], true);
            $specifications = is_array($specs) ? $specs : [];
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
            'address' => $row['address'],
            'specifications' => $specifications,
            'status' => $row['status'],
            'views' => intval($row['views']),
            'featured' => boolval($row['featured']),
            'primary_image' => $row['primary_image'],
            'total_images' => intval($row['total_images']),
            'seller' => [
                'id' => $row['user_id'],
                'name' => $row['display_seller_name'],
                'email' => $row['display_seller_email'],
                'phone' => $row['display_seller_phone']
            ],
            'created_at' => $row['created_at'],
            'updated_at' => $row['updated_at']
        ];
    }
}

$con->close();

// Return paginated response
respondSuccess([
    'ads' => $ads,
    'pagination' => [
        'current_page' => $page,
        'per_page' => $limit,
        'total' => $total,
        'total_pages' => ceil($total / $limit)
    ]
]);
