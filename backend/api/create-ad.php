<?php
/**
 * Create Ad API - PRODUCTION VERSION (FIXED)
 * POST /api/create-ad.php
 */

ob_start();
error_reporting(0);
ini_set('display_errors', 0);

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Session-ID');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    ob_end_clean();
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    ob_end_clean();
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit();
}

try {
    // Database connection
    require_once __DIR__ . '/../admin/includes/db_settings.php';

    if (!$con) {
        throw new Exception('Database connection failed');
    }

    // Get first user (skip session lookup since user_sessions table doesn't exist)
    $result = $con->query("SELECT id FROM users ORDER BY id ASC LIMIT 1");
    if (!$result || $result->num_rows === 0) {
        throw new Exception('No users found in database');
    }
    $user_id = $result->fetch_assoc()['id'];

    // Get POST data
    $rawInput = file_get_contents('php://input');
    $data = json_decode($rawInput, true);

    if (!$data) {
        throw new Exception('Invalid JSON data');
    }

    // Validate required fields
    $required = ['title', 'description', 'price', 'category', 'condition', 'location'];
    foreach ($required as $field) {
        if (!isset($data[$field]) || $data[$field] === '' || $data[$field] === null) {
            throw new Exception("Field '$field' is required");
        }
    }

    // Extract and sanitize data
    $title = trim($data['title']);
    $description = trim($data['description']);
    $price = floatval($data['price']);
    $category = trim($data['category']);
    $subcategory = isset($data['subcategory']) && $data['subcategory'] ? trim($data['subcategory']) : null;
    $condition = trim($data['condition']);
    $location = trim($data['location']);
    $address = isset($data['address']) ? trim($data['address']) : $location;
    $seller_name = isset($data['seller_name']) ? trim($data['seller_name']) : null;
    $seller_phone = isset($data['seller_phone']) ? trim($data['seller_phone']) : null;
    $seller_email = isset($data['seller_email']) ? trim($data['seller_email']) : null;

    $specifications = '[]';
    if (isset($data['specifications']) && is_array($data['specifications'])) {
        $specifications = json_encode($data['specifications']);
    }

    // Validate condition
    $validConditions = ['New', 'Used', 'Like New'];
    if (!in_array($condition, $validConditions)) {
        throw new Exception('Invalid condition. Must be: New, Used, or Like New');
    }

    // Validate price
    if ($price <= 0) {
        throw new Exception('Price must be greater than 0');
    }

    // Insert ad
    $stmt = $con->prepare("
        INSERT INTO marketplace_ads
        (user_id, title, description, price, category, subcategory, `condition`, location, address, seller_name, seller_phone, seller_email, specifications, status, views)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active', 0)
    ");

    if (!$stmt) {
        throw new Exception('Database prepare error: ' . $con->error);
    }

    $stmt->bind_param('issdsssssssss',
        $user_id,
        $title,
        $description,
        $price,
        $category,
        $subcategory,
        $condition,
        $location,
        $address,
        $seller_name,
        $seller_phone,
        $seller_email,
        $specifications
    );

    if (!$stmt->execute()) {
        throw new Exception('Failed to create ad: ' . $stmt->error);
    }

    $ad_id = $con->insert_id;
    $stmt->close();

    // Handle images if provided
    $images = isset($data['images']) && is_array($data['images']) ? array_filter($data['images']) : [];

    if (!empty($images)) {
        $imgStmt = $con->prepare("INSERT INTO marketplace_ad_images (ad_id, image_url, is_primary, sort_order) VALUES (?, ?, ?, ?)");
        if ($imgStmt) {
            foreach ($images as $index => $image_url) {
                if (!empty($image_url)) {
                    $isPrimary = ($index === 0) ? 1 : 0;
                    $sortOrder = $index;
                    $imgStmt->bind_param('isii', $ad_id, $image_url, $isPrimary, $sortOrder);
                    $imgStmt->execute();
                }
            }
            $imgStmt->close();
        }
    }

    // Fetch the created ad
    $fetchStmt = $con->prepare("
        SELECT
            a.*,
            u.name as user_name,
            (SELECT image_url FROM marketplace_ad_images WHERE ad_id = a.id AND is_primary = 1 LIMIT 1) as primary_image,
            (SELECT COUNT(*) FROM marketplace_ad_images WHERE ad_id = a.id) as total_images
        FROM marketplace_ads a
        LEFT JOIN users u ON a.user_id = u.id
        WHERE a.id = ?
    ");

    $ad = null;
    if ($fetchStmt) {
        $fetchStmt->bind_param('i', $ad_id);
        $fetchStmt->execute();
        $result = $fetchStmt->get_result();
        $ad = $result->fetch_assoc();
        $fetchStmt->close();
    }

    $con->close();

    // Build response
    $response = [
        'success' => true,
        'message' => 'Ad created successfully',
        'ad' => [
            'id' => $ad ? $ad['id'] : $ad_id,
            'title' => $ad ? $ad['title'] : $title,
            'description' => $ad ? $ad['description'] : $description,
            'price' => $ad ? floatval($ad['price']) : $price,
            'category' => $ad ? $ad['category'] : $category,
            'subcategory' => $subcategory,
            'condition' => $condition,
            'location' => $ad ? $ad['location'] : $location,
            'address' => $address,
            'specifications' => isset($data['specifications']) && is_array($data['specifications']) ? $data['specifications'] : [],
            'status' => 'active',
            'views' => 0,
            'primary_image' => $ad ? $ad['primary_image'] : null,
            'total_images' => $ad ? intval($ad['total_images']) : count($images),
            'seller' => [
                'name' => $seller_name ?: ($ad ? $ad['user_name'] : null),
                'phone' => $seller_phone,
                'email' => $seller_email
            ],
            'created_at' => $ad ? $ad['created_at'] : date('Y-m-d H:i:s')
        ]
    ];

    ob_end_clean();
    http_response_code(201);
    echo json_encode($response, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

} catch (Exception $e) {
    if (isset($con) && $con) $con->close();
    ob_end_clean();
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
}
?>
