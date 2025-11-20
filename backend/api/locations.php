<?php
/**
 * Locations API Endpoint
 * Get complete location hierarchy (phases and sectors)
 * Method: GET
 * Returns: JSON
 * Authentication: Not required
 */

session_start();
require_once("../admin/includes/db_settings.php");
require_once("../helpers/response.php");
require_once("../helpers/database.php");

header('Content-Type: application/json');

// Get all phases (parent_id = NULL or 0)
$phases = dbFetchAll(
    $con,
    "SELECT id, name, parent_id, type FROM locations WHERE parent_id IS NULL OR parent_id = 0 ORDER BY name"
);

// Get all sectors
$allSectors = dbFetchAll(
    $con,
    "SELECT id, name, parent_id, type FROM locations WHERE parent_id IS NOT NULL AND parent_id != 0 ORDER BY name"
);

// Group sectors by phase
$phasesWithSectors = [];
foreach ($phases as $phase) {
    $phaseSectors = array_filter($allSectors, function($sector) use ($phase) {
        return $sector['parent_id'] == $phase['id'];
    });

    $phasesWithSectors[] = [
        'id' => (int)$phase['id'],
        'name' => $phase['name'],
        'type' => $phase['type'] ?? 'phase',
        'sectors' => array_values(array_map(function($sector) {
            return [
                'id' => (int)$sector['id'],
                'name' => $sector['name'],
                'parent_id' => (int)$sector['parent_id'],
                'type' => $sector['type'] ?? 'sector'
            ];
        }, $phaseSectors))
    ];
}

jsonSuccess([
    'phases' => $phasesWithSectors,
    'total_phases' => count($phasesWithSectors)
], 'Locations retrieved successfully');
?>
