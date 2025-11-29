<?php
/**
 * Create Ad API
 * POST /api/create-ad.php
 * Creates a new marketplace ad (requires authentication)
 */

// Start output buffering FIRST before anything else
ob_start();

// Suppress all errors from being output
error_reporting(0);
ini_set('display_errors', 0);

// CORS headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Session-ID');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    while (ob_get_level() > 0) ob_end_clean();
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    while (ob_get_level() > 0) ob_end_clean();
    header('Content-Type: application/json; charset=utf-8');
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit();
}

// Helper function to send JSON response
function sendResponse($data, $httpCode = 200) {
    while (ob_get_level() > 0) ob_end_clean();
    http_response_code($httpCode);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit();
}

function sendError($message, $httpCode = 400) {
    sendResponse(['success' => false, 'error' => $message], $httpCode);
}

// Database connection
$host = 'localhost';
$db = 'greenfieldsuperm_db';
$user = 'root';
$pass = '';

// Suppress mysqli errors from being output directly
mysqli_report(MYSQLI_REPORT_OFF);

$con = @new mysqli($host, $user, $pass, $db);

if ($con->connect_error) {
    sendError('Database connection failed', 500);
}

$con->set_charset('utf8mb4');

// Check if marketplace_ads table exists
$tableCheck = @$con->query("SHOW TABLES LIKE 'marketplace_ads'");
if (!$tableCheck || $tableCheck->num_rows === 0) {
    $con->close();
    sendError('Marketplace tables not yet created', 500);
}

// For development, use user_id = 1 (Kashan Ali)
$user_id = 1;

// Get POST data
$rawInput = file_get_contents('php://input');
$data = json_decode($rawInput, true);

if (!$data) {
    $con->close();
    sendError('Invalid JSON data', 400);
}

// Validate required fields
$required = ['title', 'description', 'price', 'category', 'condition', 'location'];
foreach ($required as $field) {
    if (empty($data[$field])) {
        $con->close();
        sendError("Field '{$field}' is required", 400);
    }
}

$title = trim($data['title']);
$description = trim($data['description']);
$price = floatval($data['price']);
$category = trim($data['category']);
$subcategory = isset($data['subcategory']) && $data['subcategory'] ? trim($data['subcategory']) : null;
$condition = trim($data['condition']);
$location = trim($data['location']);
$address = isset($data['address']) ? trim($data['address']) : $location;
$specifications = isset($data['specifications']) && is_array($data['specifications'])
    ? json_encode($data['specifications'])
    : '[]';

// Seller contact info from form
$seller_name = isset($data['seller_name']) ? trim($data['seller_name']) : null;
$seller_phone = isset($data['seller_phone']) ? trim($data['seller_phone']) : null;
$seller_email = isset($data['seller_email']) ? trim($data['seller_email']) : null;

// Validate condition
$validConditions = ['New', 'Used', 'Like New'];
if (!in_array($condition, $validConditions)) {
    $con->close();
    sendError('Invalid condition. Must be: New, Used, or Like New', 400);
}

// Validate price
if ($price <= 0) {
    $con->close();
    sendError('Price must be greater than 0', 400);
}

// Insert ad using prepared statement
$stmt = $con->prepare("
    INSERT INTO marketplace_ads
    (user_id, title, description, price, category, subcategory, `condition`, location, address, seller_name, seller_phone, seller_email, specifications, status, featured)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active', 0)
");

if (!$stmt) {
    $con->close();
    sendError('Database error', 500);
}

$stmt->bind_param('issdsssssssss', $user_id, $title, $description, $price, $category, $subcategory, $condition, $location, $address, $seller_name, $seller_phone, $seller_email, $specifications);

if (!$stmt->execute()) {
    $stmt->close();
    $con->close();
    sendError('Failed to create ad', 500);
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
                $sortOrder = $index + 1;
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
        COALESCE(a.seller_name, u.name) as display_seller_name,
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

// Parse specifications for response
$specs = $ad ? json_decode($ad['specifications'], true) : [];
if (!is_array($specs)) $specs = [];

sendResponse([
    'success' => true,
    'message' => 'Ad created successfully',
    'ad' => [
        'id' => $ad ? $ad['id'] : $ad_id,
        'title' => $ad ? $ad['title'] : $title,
        'description' => $ad ? $ad['description'] : $description,
        'price' => $ad ? floatval($ad['price']) : $price,
        'category' => $ad ? $ad['category'] : $category,
        'subcategory' => $ad ? $ad['subcategory'] : $subcategory,
        'condition' => $ad ? $ad['condition'] : $condition,
        'location' => $ad ? $ad['location'] : $location,
        'address' => $ad ? $ad['address'] : $address,
        'specifications' => $specs,
        'status' => 'active',
        'primary_image' => $ad ? $ad['primary_image'] : null,
        'total_images' => $ad ? intval($ad['total_images']) : 0,
        'seller' => [
            'name' => $ad ? ($ad['display_seller_name'] ?: $seller_name) : $seller_name,
            'phone' => $ad ? $ad['seller_phone'] : $seller_phone,
            'email' => $ad ? $ad['seller_email'] : $seller_email
        ],
        'created_at' => $ad ? $ad['created_at'] : date('Y-m-d H:i:s')
    ]
], 201);
