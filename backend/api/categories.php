<?php
include("../admin/includes/db_settings.php");
header('Content-Type: application/json');

// Get categories (excluding those in homep.section25)
$excludeQuery = "SELECT section25 FROM homep LIMIT 1";
$excludeRes = mysqli_query($con, $excludeQuery);
$excludeRow = mysqli_fetch_assoc($excludeRes);
$excludeIds = $excludeRow['section25'] ?? '';

$whereClause = "";
if (!empty($excludeIds)) {
    $whereClause = " WHERE id NOT IN ($excludeIds)";
}

$query = "SELECT id, name, icon as image_url FROM categories $whereClause ORDER BY name ASC";
$result = mysqli_query($con, $query);

$categories = [];
while ($row = mysqli_fetch_assoc($result)) {
    $categories[] = [
        'id' => $row['id'],
        'name' => $row['name'],
        'image_url' => $row['image_url'],
        'slug' => strtolower(str_replace(' ', '-', $row['name'])),
        'parent_id' => null
    ];
}

echo json_encode([
    'success' => true,
    'data' => [
        'categories' => $categories
    ],
    'count' => count($categories)
]);
?>
