<?php
/**
 * Update Profile API
 * Method: POST
 * Params: name, phone, address (optional)
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

session_start();
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
$name = trim($_POST['name'] ?? '');
$phone = trim($_POST['phone'] ?? '');
$address = trim($_POST['address'] ?? '');

// Validate required fields
if (empty($name) || empty($phone)) {
    jsonError('Name and phone are required', 422);
}

// Build update query
if (!empty($address)) {
    $query = "UPDATE users SET name = ?, phone = ?, address = ? WHERE id = ?";
    $result = dbExecute($con, $query, 'sssi', [$name, $phone, $address, $user_id]);
} else {
    $query = "UPDATE users SET name = ?, phone = ? WHERE id = ?";
    $result = dbExecute($con, $query, 'ssi', [$name, $phone, $user_id]);
}

if ($result['success']) {
    // Update session
    $_SESSION['user_name'] = $name;
    $_SESSION['user_phone'] = $phone;
    if (!empty($address)) {
        $_SESSION['user_address'] = $address;
    }

    // Get updated user data
    $user = dbFetchOne($con, "SELECT id, name, email, phone, address, created_at FROM users WHERE id = ?", 'i', [$user_id]);

    jsonSuccess([
        'user' => $user
    ], 'Profile updated successfully');
} else {
    jsonError('Failed to update profile', 500);
}
?>
