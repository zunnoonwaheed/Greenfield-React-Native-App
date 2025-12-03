<?php
/**
 * Delete Payment Method API
 * DELETE /api/delete-payment-method.php?id=123
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

require_once __DIR__ . '/../admin/includes/db_settings.php';
require_once __DIR__ . '/../helpers/database.php';
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../helpers/auth.php';
require_once __DIR__ . '/../helpers/logger.php';

// Use production database connection from db_settings.php
if (!$con) {
    respondError('Database connection failed');
}

logRequest('delete-payment-method.php');

// Authenticate user
$user_id = authenticateUser($con);
if (!$user_id) {
    $con->close();
    respondError('Unauthorized', 401);
}

// Get payment method ID
$method_id = isset($_GET['id']) ? intval($_GET['id']) : 0;

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

// Delete the payment method
$deleteQuery = "DELETE FROM payment_methods WHERE id = ?";
$result = dbExecute($con, $deleteQuery, 'i', [$method_id]);

$con->close();

if (!$result['success']) {
    respondError('Failed to delete payment method', 500);
}

respondSuccess(['message' => 'Payment method deleted successfully']);
