<?php
/**
 * Delete Ad API
 * DELETE /api/delete-ad.php?id=123
 * Deletes (soft delete) a marketplace ad
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'DELETE') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit();
}

require_once __DIR__ . '/../helpers/database.php';
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../helpers/auth.php';
require_once __DIR__ . '/../helpers/logger.php';

// Database connection
$host = 'localhost';
$db = 'greenfieldsuperm_db';
$user = 'root';
$pass = '';

$con = new mysqli($host, $user, $pass, $db);

if ($con->connect_error) {
    respondError('Database connection failed');
}

$con->set_charset('utf8mb4');

logRequest('delete-ad.php');

// Authenticate user
$user_id = authenticateUser($con);
if (!$user_id) {
    $con->close();
    respondError('Unauthorized', 401);
}

// Get ad ID
$ad_id = isset($_GET['id']) ? intval($_GET['id']) : 0;

if ($ad_id <= 0) {
    $con->close();
    respondError('Ad ID is required', 400);
}

// Check if ad belongs to user
$checkQuery = "SELECT user_id FROM marketplace_ads WHERE id = ? AND status != 'deleted'";
$ad = dbFetchOne($con, $checkQuery, 'i', [$ad_id]);

if (!$ad) {
    $con->close();
    respondError('Ad not found', 404);
}

if ($ad['user_id'] != $user_id) {
    $con->close();
    respondError('You do not have permission to delete this ad', 403);
}

// Soft delete the ad
$deleteQuery = "UPDATE marketplace_ads SET status = 'deleted' WHERE id = ?";
$result = dbExecute($con, $deleteQuery, 'i', [$ad_id]);

$con->close();

if (!$result['success']) {
    respondError('Failed to delete ad', 500);
}

respondSuccess(['message' => 'Ad deleted successfully']);
