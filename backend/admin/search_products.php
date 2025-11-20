<?php
// Database connection (replace with your own connection settings)
include("includes/db_settings.php");

if (isset($_GET['q']) && !empty($_GET['q'])) {
    // Get search query and selected IDs
    $searchQuery = mysqli_real_escape_string($con, $_GET['q']);
    $selectedIds = isset($_GET['selectedIds']) ? explode(',', $_GET['selectedIds']) : [];

    // Build the query to search products by name
    $query = "SELECT id, namee FROM dow WHERE namee LIKE '%$searchQuery%'";

    // Execute the query
    $result = mysqli_query($con, $query);

    // Prepare the response array
    $response = [
        'products' => []
    ];

    // Fetch the products
    while ($row = mysqli_fetch_assoc($result)) {
        // Check if the product is already selected
        if (!in_array($row['id'], $selectedIds)) {
            $response['products'][] = [
                'id' => $row['id'],
                'namee' => $row['namee']
            ];
        }
    }

    // Return the response as JSON
    echo json_encode($response);
} else {
    echo json_encode(['products' => []]);
}
?>
