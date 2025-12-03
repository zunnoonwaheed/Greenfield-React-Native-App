<?php
/**
 * DEBUG ADS API
 * GET /api/ads-debug.php
 * Shows exactly what the ads.php endpoint returns
 */

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Session-ID');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/../admin/includes/db_settings.php';

$debug = [
    'timestamp' => date('Y-m-d H:i:s'),
    'request_method' => $_SERVER['REQUEST_METHOD'],
    'query_params' => $_GET
];

if (!$con) {
    echo json_encode([
        'success' => false,
        'error' => 'Database connection failed',
        'debug' => $debug
    ]);
    exit();
}

$debug['db_connected'] = true;

// Count total ads
$countResult = $con->query("SELECT COUNT(*) as total FROM marketplace_ads WHERE status = 'active'");
$total = $countResult->fetch_assoc()['total'];
$debug['total_ads_in_db'] = $total;

// Fetch ads
$query = "
    SELECT
        a.*,
        u.name as seller_name,
        (SELECT image_url FROM marketplace_ad_images WHERE ad_id = a.id AND is_primary = 1 LIMIT 1) as primary_image,
        (SELECT COUNT(*) FROM marketplace_ad_images WHERE ad_id = a.id) as image_count
    FROM marketplace_ads a
    LEFT JOIN users u ON a.user_id = u.id
    WHERE a.status = 'active'
    ORDER BY a.featured DESC, a.created_at DESC
    LIMIT 20
";

$result = $con->query($query);
$debug['query_executed'] = true;
$debug['num_rows'] = $result->num_rows;

$ads = [];
while ($row = $result->fetch_assoc()) {
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
        'primary_image' => $row['primary_image'],
        'total_images' => intval($row['image_count']),
        'seller' => [
            'name' => $row['seller_name'] ?: 'Unknown Seller'
        ],
        'created_at' => $row['created_at']
    ];
}

$con->close();

// Final response
echo json_encode([
    'success' => true,
    'message' => count($ads) > 0 ? 'Ads fetched successfully' : 'No ads found',
    'data' => [
        'ads' => $ads,
        'pagination' => [
            'current_page' => 1,
            'per_page' => 20,
            'total' => intval($total),
            'total_pages' => ceil($total / 20)
        ]
    ],
    'debug' => $debug
], JSON_PRETTY_PRINT);
?>
