<?php
/**
 * Update Address API
 * Method: POST
 * Params: address
 * Returns: JSON
 * Requires: Authentication
 */

// CORS headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . "/../helpers/session_config.php";
require_once("../admin/includes/db_settings.php");
require_once("../helpers/response.php");
require_once("../helpers/auth.php");
require_once("../helpers/database.php");

// Authenticate user (supports session, token, and development mode)
$user_id = authenticateUser($con);
if (!$user_id) {
    jsonError('Unauthorized - Please login', 401);
}

// Get input
$address = trim($_POST['address'] ?? '');

// Validate required fields
if (empty($address)) {
    jsonError('Address is required', 422);
}

// Update only address field
$query = "UPDATE users SET address = ? WHERE id = ?";
$result = dbExecute($con, $query, 'si', [$address, $user_id]);

if ($result['success']) {
    // Update session
    $_SESSION['user_address'] = $address;

    // Get updated user data
    $user = dbFetchOne($con, "SELECT id, name, email, phone, address, created_at FROM users WHERE id = ?", 'i', [$user_id]);

    jsonSuccess([
        'user' => $user,
        'address' => $address
    ], 'Address updated successfully');
} else {
    jsonError('Failed to update address', 500);
}
?>
