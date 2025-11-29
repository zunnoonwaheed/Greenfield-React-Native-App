<?php
/**
 * Upload Ad Image API
 * POST /api/upload-ad-image.php
 * Handles image uploads for marketplace ads
 */

// Start output buffering to prevent any accidental output
ob_start();

// CORS headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    ob_end_clean();
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    ob_end_clean();
    header('Content-Type: application/json; charset=utf-8');
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit();
}

require_once __DIR__ . '/../helpers/response.php';

// Check if file was uploaded
if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
    $error_message = 'No file uploaded';
    if (isset($_FILES['image']['error'])) {
        switch ($_FILES['image']['error']) {
            case UPLOAD_ERR_INI_SIZE:
            case UPLOAD_ERR_FORM_SIZE:
                $error_message = 'File is too large';
                break;
            case UPLOAD_ERR_PARTIAL:
                $error_message = 'File was only partially uploaded';
                break;
            case UPLOAD_ERR_NO_FILE:
                $error_message = 'No file was uploaded';
                break;
            default:
                $error_message = 'File upload error';
        }
    }
    respondError($error_message, 400);
}

$file = $_FILES['image'];

// Validate file type
$allowed_types = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
$file_type = mime_content_type($file['tmp_name']);

if (!in_array($file_type, $allowed_types)) {
    respondError('Invalid file type. Allowed: JPG, PNG, GIF, WEBP', 400);
}

// Validate file size (max 10MB)
$max_size = 10 * 1024 * 1024; // 10MB
if ($file['size'] > $max_size) {
    respondError('File is too large. Maximum size is 10MB', 400);
}

// Create uploads directory if it doesn't exist
$upload_dir = __DIR__ . '/../uploads/ads/';
if (!file_exists($upload_dir)) {
    mkdir($upload_dir, 0755, true);
}

// Generate unique filename
$extension = pathinfo($file['name'], PATHINFO_EXTENSION);
if (!$extension) {
    // Fallback to detecting extension from mime type
    $ext_map = [
        'image/jpeg' => 'jpg',
        'image/jpg' => 'jpg',
        'image/png' => 'png',
        'image/gif' => 'gif',
        'image/webp' => 'webp'
    ];
    $extension = $ext_map[$file_type] ?? 'jpg';
}

$filename = 'ad_' . time() . '_' . uniqid() . '.' . $extension;
$filepath = $upload_dir . $filename;

// Move uploaded file
if (!move_uploaded_file($file['tmp_name'], $filepath)) {
    respondError('Failed to save uploaded file', 500);
}

// Return the relative URL path for storage in database
$image_url = 'uploads/ads/' . $filename;

respondSuccess([
    'message' => 'Image uploaded successfully',
    'image_url' => $image_url,
    'filename' => $filename
], 201);
