<?php
/**
 * Profile API Endpoint
 * Returns user profile information
 * Method: GET
 * Returns: JSON
 * Requires: Authentication
 */

require_once("../helpers/session_config.php");
require_once("../admin/includes/db_settings.php");
require_once("../helpers/response.php");
require_once("../helpers/auth.php");
require_once("../helpers/database.php");
require_once("../helpers/logger.php");

// CORS headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$startTime = startTimer();
$endpoint = '/api/profile.php';

logRequest($endpoint, $_SERVER['REQUEST_METHOD'], []);

// Authenticate user (supports session, token, and development mode)
$userId = authenticateUser($con);
if (!$userId) {
    jsonError('Unauthorized - Please login', 401);
}

// Get user info
$user = dbFetchOne($con, "SELECT id, name, email, phone, address, created_at FROM users WHERE id = ?", 'i', [$userId]);

if (!$user) {
    jsonError('User not found', 404);
}

logInfo("Profile retrieved for user ID: $userId");
logResponse($endpoint, true, null, "Profile retrieved");
endTimer($startTime, $endpoint);

jsonSuccess([
    'user' => $user
], 'Profile retrieved successfully');
?>