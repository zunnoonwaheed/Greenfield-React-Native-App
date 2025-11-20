<?php
/**
 * Validate Delivery API Endpoint
 * Check if delivery is available to a specific location
 * Method: POST
 * Returns: JSON
 * Authentication: Not required
 */

session_start();
require_once("../admin/includes/db_settings.php");
require_once("../helpers/response.php");
require_once("../helpers/database.php");

header('Content-Type: application/json');

// Only accept POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonError('Method not allowed', 405);
}

$phaseId = $_POST['phase_id'] ?? '';
$sectorId = $_POST['sector_id'] ?? '';

if (empty($phaseId)) {
    jsonError('Phase ID is required');
}

// Check if phase exists
$phase = dbFetchOne(
    $con,
    "SELECT id, name FROM locations WHERE id = ? AND (parent_id IS NULL OR parent_id = 0)",
    'i',
    [$phaseId]
);

if (!$phase) {
    jsonSuccess([
        'available' => false,
        'message' => 'Delivery not available to this location'
    ], 'Delivery validation completed');
}

// If sector provided, validate it belongs to the phase
if (!empty($sectorId)) {
    $sector = dbFetchOne(
        $con,
        "SELECT id, name, parent_id FROM locations WHERE id = ? AND parent_id = ?",
        'ii',
        [$sectorId, $phaseId]
    );

    if (!$sector) {
        jsonSuccess([
            'available' => false,
            'message' => 'Invalid sector for this phase'
        ], 'Delivery validation completed');
    }
}

// For now, all existing phases/sectors support delivery
// In future, you can add delivery_zones table with charges
$deliveryCharge = 100; // Default delivery charge in PKR
$estimatedTime = '1-2 days'; // Default estimation

// You can enhance this with a delivery_zones table
// Example: SELECT charge, estimated_time FROM delivery_zones WHERE phase_id = ? AND sector_id = ?

jsonSuccess([
    'available' => true,
    'delivery_charge' => $deliveryCharge,
    'estimated_time' => $estimatedTime,
    'phase' => $phase['name'],
    'sector' => isset($sector) ? $sector['name'] : null,
    'message' => 'Delivery available to this location'
], 'Delivery validation completed');
?>
