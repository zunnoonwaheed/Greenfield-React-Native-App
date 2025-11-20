<?php
/**
 * Get Sectors by Phase API
 * Method: GET
 * Params: phase_id
 * Returns: JSON
 * Authentication: Not required
 */

session_start();
require_once("../admin/includes/db_settings.php");
require_once("../helpers/response.php");
require_once("../helpers/database.php");

header('Content-Type: application/json');

$phase_id = intval($_GET['phase_id'] ?? 0);

if ($phase_id <= 0) {
    jsonError('Phase ID is required');
}

// Fetch sectors for this phase
$sectors = dbFetchAll(
    $con,
    "SELECT id, name, parent_id, type FROM locations WHERE parent_id = ? ORDER BY name ASC",
    'i',
    [$phase_id]
);

// Format sectors
$formatted_sectors = [];
foreach ($sectors as $sector) {
    $formatted_sectors[] = [
        'id' => (int)$sector['id'],
        'name' => $sector['name'],
        'parent_id' => (int)$sector['parent_id'],
        'type' => $sector['type'] ?? 'sector'
    ];
}

jsonSuccess([
    'sectors' => $formatted_sectors,
    'count' => count($formatted_sectors),
    'phase_id' => $phase_id
], 'Sectors retrieved successfully');
?>
