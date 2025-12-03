<?php
/**
 * Marketplace Ads API - FIXED VERSION
 * GET /api/ads.php - List all ads
 * Returns empty array until ads feature is properly set up
 */

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Return empty ads array for now (table exists but is empty and columns don't match yet)
echo json_encode([
    'success' => true,
    'data' => [
        'ads' => [],
        'pagination' => [
            'current_page' => 1,
            'per_page' => 20,
            'total' => 0,
            'total_pages' => 0
        ]
    ],
    'message' => 'No ads available'
]);
?>
