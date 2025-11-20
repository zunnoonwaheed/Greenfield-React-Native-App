<?php
/**
 * Get All Bundles API
 * Method: GET
 * Query Params: featured=true, active_only=true, limit, offset
 * Returns: JSON
 */

require_once("../helpers/session_config.php");
require_once("../admin/includes/db_settings.php");
require_once("../helpers/response.php");
require_once("../helpers/database.php");
require_once("../helpers/logger.php");

header('Content-Type: application/json');

$startTime = startTimer();
$endpoint = '/api/bundles.php';
logRequest($endpoint, $_SERVER['REQUEST_METHOD'], $_GET);

// Get query parameters
$featured = isset($_GET['featured']) && $_GET['featured'] === 'true';
$activeOnly = !isset($_GET['active_only']) || $_GET['active_only'] === 'true'; // Default to active only
$limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 100;
$offset = isset($_GET['offset']) ? (int)$_GET['offset'] : 0;

// Build query based on filters
$conditions = [];
$types = '';
$params = [];

if ($activeOnly) {
    $conditions[] = "(status = 'active' OR status = '1')";
}

if ($featured) {
    $conditions[] = "is_featured = 1";
}

$whereClause = !empty($conditions) ? 'WHERE ' . implode(' AND ', $conditions) : '';
$query = "SELECT * FROM bundles {$whereClause} ORDER BY created_at DESC";

if ($limit > 0) {
    $query .= " LIMIT ? OFFSET ?";
    $types = 'ii';
    $params = [$limit, $offset];
}

// Fetch bundles
$bundles = dbFetchAll($con, $query, $types, $params);

// Format bundles for response - map old column names to new names expected by frontend
$formattedBundles = [];
foreach ($bundles as $row) {
    $formattedBundles[] = [
        'id' => (int)$row['id'],
        'name' => $row['name'],
        'description' => $row['description'] ?? '',
        'original_price' => (float)($row['base_price'] ?? $row['original_price'] ?? 0),
        'discounted_price' => (float)($row['final_price'] ?? $row['discounted_price'] ?? 0),
        'discount_percentage' => (float)($row['discount'] ?? 0),
        'image_url' => $row['image'] ?? '',
        'is_featured' => (int)($row['is_featured'] ?? 0),
        'status' => $row['status'],
        'created_at' => $row['created_at'] ?? null
    ];
}

logInfo("Fetched " . count($formattedBundles) . " bundles");
logResponse($endpoint, true, null, count($formattedBundles) . " bundles retrieved");
endTimer($startTime, $endpoint);

jsonSuccess([
    'bundles' => $formattedBundles,
    'count' => count($formattedBundles)
], 'Bundles retrieved successfully');
?>
