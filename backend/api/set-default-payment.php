<?php
/**
 * Set Default Payment Method API
 * POST /api/set-default-payment.php
 */

// Start output buffering
ob_start();

// Suppress errors from being output
error_reporting(0);
ini_set('display_errors', 0);

// CORS headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    while (ob_get_level() > 0) ob_end_clean();
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/../helpers/session_config.php';
require_once __DIR__ . '/../admin/includes/db_settings.php';
require_once __DIR__ . '/../helpers/database.php';
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../helpers/auth.php';

// Use production database connection from db_settings.php
if (!$con) {
    respondError('Database connection failed');
}

// For development, use user_id = 1 (or from auth if available)
$user_id = 1;
$authUser = authenticateUser($con);
if ($authUser) {
    $user_id = $authUser;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    $con->close();
    respondError('Method not allowed', 405);
}

// Get JSON data
$data = json_decode(file_get_contents('php://input'), true);
$method_id = isset($data['id']) ? intval($data['id']) : 0;

if ($method_id <= 0) {
    $con->close();
    respondError('Payment method ID is required', 400);
}

// Check if method belongs to user
$checkQuery = "SELECT id FROM payment_methods WHERE id = ? AND user_id = ?";
$method = dbFetchOne($con, $checkQuery, 'ii', [$method_id, $user_id]);

if (!$method) {
    $con->close();
    respondError('Payment method not found', 404);
}

// Unset all defaults for this user
$unsetQuery = "UPDATE payment_methods SET is_default = 0 WHERE user_id = ?";
dbExecute($con, $unsetQuery, 'i', [$user_id]);

// Set this method as default
$setQuery = "UPDATE payment_methods SET is_default = 1 WHERE id = ?";
$result = dbExecute($con, $setQuery, 'i', [$method_id]);

$con->close();

if (!$result['success']) {
    respondError('Failed to set default payment method', 500);
}

respondSuccess([
    'message' => 'Default payment method updated successfully',
    'data' => [
        'id' => $method_id,
        'is_default' => true
    ]
]);
