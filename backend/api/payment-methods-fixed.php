<?php
/**
 * Payment Methods API - FIXED VERSION
 * GET /api/payment-methods.php - List user's payment methods
 * Returns empty array until payment methods are added
 */

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once __DIR__ . '/../helpers/session_config.php';

// Return empty payment methods array for now
echo json_encode([
    'success' => true,
    'data' => [
        'payment_methods' => []
    ],
    'message' => 'No payment methods added yet'
]);
?>
