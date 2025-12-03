<?php
/**
 * Ad Detail API
 * GET /api/ad-detail.php?id=123
 * Returns detailed information about a specific ad including all images
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

require_once __DIR__ . '/../admin/includes/db_settings.php';
require_once __DIR__ . '/../helpers/database.php';
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../helpers/logger.php';

// Use production database connection from db_settings.php
if (!$con) {
    respondError('Database connection failed');
}

// Get ad ID
$ad_id = isset($_GET['id']) ? intval($_GET['id']) : 0;

if ($ad_id <= 0) {
    respondError('Ad ID is required', 400);
}

// Fetch ad details with seller info
$query = "
    SELECT
        a.*,
        u.name as seller_name,
        u.email as seller_email,
        u.phone as seller_phone
    FROM marketplace_ads a
    LEFT JOIN users u ON a.user_id = u.id
    WHERE a.id = ? AND a.status != 'deleted'
    LIMIT 1
";

$ad = dbFetchOne($con, $query, 'i', [$ad_id]);

if (!$ad) {
    $con->close();
    respondError('Ad not found', 404);
}

// Increment view count
dbExecute($con, "UPDATE marketplace_ads SET views = views + 1 WHERE id = ?", 'i', [$ad_id]);

// Fetch all images for this ad
$imagesQuery = "
    SELECT id, image_url, is_primary, sort_order
    FROM marketplace_ad_images
    WHERE ad_id = ?
    ORDER BY is_primary DESC, sort_order ASC
";

$images = dbFetchAll($con, $imagesQuery, 'i', [$ad_id]);

$con->close();

// Parse specifications
$specifications = [];
if (!empty($ad['specifications'])) {
    $specs = json_decode($ad['specifications'], true);
    $specifications = is_array($specs) ? $specs : [];
}

// Format response
$response = [
    'id' => $ad['id'],
    'title' => $ad['title'],
    'description' => $ad['description'],
    'price' => floatval($ad['price']),
    'category' => $ad['category'],
    'subcategory' => $ad['subcategory'],
    'condition' => $ad['condition'],
    'location' => $ad['location'],
    'address' => $ad['address'],
    'specifications' => $specifications,
    'status' => $ad['status'],
    'views' => intval($ad['views']),
    'featured' => boolval($ad['featured']),
    'images' => array_map(function($img) {
        return [
            'id' => $img['id'],
            'url' => $img['image_url'],
            'is_primary' => boolval($img['is_primary'])
        ];
    }, $images),
    'seller' => [
        'id' => $ad['user_id'],
        'name' => $ad['seller_name'],
        'email' => $ad['seller_email'],
        'phone' => $ad['seller_phone']
    ],
    'created_at' => $ad['created_at'],
    'updated_at' => $ad['updated_at']
];

respondSuccess($response);
