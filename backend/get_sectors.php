<?php
header('Content-Type: application/json');
include("admin/includes/db_settings.php");

if (!isset($_GET['phase_id']) || empty($_GET['phase_id'])) {
    echo json_encode([]);
    exit;
}

$phase_id = (int) $_GET['phase_id'];

$stmt = $con->prepare("SELECT id, name FROM locations WHERE parent_id = ? AND type = 'sector' ORDER BY name ASC");
$stmt->bind_param("i", $phase_id);
$stmt->execute();
$result = $stmt->get_result();

$sectors = [];
while ($row = $result->fetch_assoc()) {
    $sectors[] = $row;
}

echo json_encode($sectors);
