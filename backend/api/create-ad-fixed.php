<?php
/**
 * Create Ad API - FIXED VERSION
 * POST /api/create-ad.php
 * Creates a new marketplace ad (requires authentication)
 * Only uses columns that exist in the actual marketplace_ads table
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

// Use production database connection from db_settings.php
require_once __DIR__ . '/../admin/includes/db_settings.php';

if (!$con) {
    sendError('Database connection failed', 500);
}

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
$required = ['title', 'description', 'price', 'category', 'location'];
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
$location = trim($data['location']);

// Validate price
if ($price <= 0) {
    $con->close();
    sendError('Price must be greater than 0', 400);
}

// Insert ad using ONLY columns that exist in marketplace_ads table:
// id, user_id, title, description, price, category, location, status, views, created_at, updated_at
$stmt = $con->prepare("
    INSERT INTO marketplace_ads
    (user_id, title, description, price, category, location, status, views)
    VALUES (?, ?, ?, ?, ?, ?, 'active', 0)
");

if (!$stmt) {
    $con->close();
    sendError('Database error: ' . $con->error, 500);
}

$stmt->bind_param('issdss', $user_id, $title, $description, $price, $category, $location);

if (!$stmt->execute()) {
    $error = $stmt->error;
    $stmt->close();
    $con->close();
    sendError('Failed to create ad: ' . $error, 500);
}

$ad_id = $con->insert_id;
$stmt->close();

// Handle images if provided
// marketplace_ad_images table has: id, ad_id, image_path, is_primary, created_at
$images = isset($data['images']) && is_array($data['images']) ? array_filter($data['images']) : [];

if (!empty($images)) {
    $imgStmt = $con->prepare("INSERT INTO marketplace_ad_images (ad_id, image_path, is_primary) VALUES (?, ?, ?)");
    if ($imgStmt) {
        foreach ($images as $index => $image_url) {
            if (!empty($image_url)) {
                $isPrimary = ($index === 0) ? 1 : 0;
                $imgStmt->bind_param('isi', $ad_id, $image_url, $isPrimary);
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
        (SELECT image_path FROM marketplace_ad_images WHERE ad_id = a.id AND is_primary = 1 LIMIT 1) as primary_image,
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

// Build response with data from frontend (for display) even if we didn't store it
$condition = isset($data['condition']) ? trim($data['condition']) : 'Used';
$subcategory = isset($data['subcategory']) ? trim($data['subcategory']) : null;
$address = isset($data['address']) ? trim($data['address']) : $location;
$seller_name = isset($data['seller_name']) ? trim($data['seller_name']) : ($ad ? $ad['user_name'] : null);
$seller_phone = isset($data['seller_phone']) ? trim($data['seller_phone']) : null;
$seller_email = isset($data['seller_email']) ? trim($data['seller_email']) : null;
$specifications = isset($data['specifications']) && is_array($data['specifications']) ? $data['specifications'] : [];

sendResponse([
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
        'specifications' => $specifications,
        'status' => 'active',
        'views' => 0,
        'primary_image' => $ad ? $ad['primary_image'] : null,
        'total_images' => $ad ? intval($ad['total_images']) : 0,
        'seller' => [
            'name' => $seller_name,
            'phone' => $seller_phone,
            'email' => $seller_email
        ],
        'created_at' => $ad ? $ad['created_at'] : date('Y-m-d H:i:s')
    ]
], 201);
