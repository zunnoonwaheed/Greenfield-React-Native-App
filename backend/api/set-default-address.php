<?php
/**
 * Set Default Address API
 * Method: POST
 * Params: address_id
 * Requires: Authentication
 */

// CORS headers - Must be BEFORE session_start()
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

// Handle preflight OPTIONS request
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

// Get address ID
$address_id = isset($_POST['address_id']) ? (int)$_POST['address_id'] : 0;

if (!$address_id) {
    jsonError('Address ID is required', 422);
}

// Verify address belongs to user
$address = dbFetchOne(
    $con,
    "SELECT id, name, address FROM user_addresses WHERE id = ? AND user_id = ?",
    'ii',
    [$address_id, $user_id]
);

if (!$address) {
    jsonError('Address not found', 404);
}

// Unset all defaults for this user
dbExecute($con, "UPDATE user_addresses SET is_default = 0 WHERE user_id = ?", 'i', [$user_id]);

// Set new default
$result = dbExecute($con, "UPDATE user_addresses SET is_default = 1 WHERE id = ?", 'i', [$address_id]);

if ($result['success']) {
    // Also update user's main address field
    $fullAddress = implode(', ', array_filter([$address['name'], $address['address']]));
    dbExecute($con, "UPDATE users SET address = ? WHERE id = ?", 'si', [$fullAddress, $user_id]);

    jsonSuccess([
        'message' => 'Default address updated',
        'address' => $fullAddress
    ]);
} else {
    jsonError('Failed to set default address', 500);
}
?>
