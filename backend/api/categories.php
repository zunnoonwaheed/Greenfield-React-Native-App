<?php
// Prevent any output before JSON
ob_start();
error_reporting(0);

include("../admin/includes/db_settings.php");
header('Content-Type: application/json');

// Clear any previous output
ob_clean();

// Get ALL categories from sizee table with product counts
// Show ALL categories (not just keyword1='yes')
// Include product count for each category
$query = "SELECT s.id, s.name, s.slug, s.image, s.keyword1,
                 COUNT(d.id) as product_count
          FROM sizee s
          LEFT JOIN dow d ON s.id = d.catID AND d.statuss = '1'
          WHERE s.catID != 0
          GROUP BY s.id, s.name, s.slug, s.image, s.keyword1
          ORDER BY s.name ASC";
$result = mysqli_query($con, $query);

// Get base URL for images - use LOCAL server where images are stored
$protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https' : 'http';
$host = $_SERVER['HTTP_HOST'];
$productionUrl = 'https://greenfieldsupermarket.com';  // Fallback URL

$categories = [];
while ($row = mysqli_fetch_assoc($result)) {
    // Construct full image URL for category icon with FALLBACK to production
    $imageUrl = '';
    if (!empty($row['image'])) {
        $localImagePath = __DIR__ . '/../admin/upload/stores/' . $row['image'];

        // Check if image exists locally, otherwise use production URL
        if (file_exists($localImagePath)) {
            $imageUrl = $protocol . '://' . $host . '/admin/upload/stores/' . $row['image'];
        } else {
            $imageUrl = $productionUrl . '/admin/upload/stores/' . $row['image'];
        }
    } else {
        // Fallback to placeholder if no image specified
        $imageUrl = $protocol . '://' . $host . '/images/category-placeholder.jpg';
    }

    $categories[] = [
        'id' => $row['id'],
        'name' => $row['name'],
        'icon' => $row['image'], // Keep the icon filename
        'image_url' => $imageUrl, // Full URL for frontend (same as web app)
        'slug' => $row['slug'],
        'parent_id' => null,
        'product_count' => (int)$row['product_count'], // Number of products in this category
        'has_products' => (int)$row['product_count'] > 0 // Boolean flag
    ];
}

echo json_encode([
    'success' => true,
    'data' => [
        'categories' => $categories
    ],
    'count' => count($categories)
]);

ob_end_flush();
?>
