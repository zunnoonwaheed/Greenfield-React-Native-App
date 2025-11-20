<?php
include('includes/db_settings.php'); // aapka DB connection

$stmt = $con->prepare("SELECT COUNT(*) as count FROM orders WHERE is_seen = 0");
$stmt->execute();
$result = $stmt->get_result()->fetch_assoc();

echo json_encode(['count' => $result['count']]);
?>
