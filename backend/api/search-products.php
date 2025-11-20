<?php
/**
 * Search Products API
 * Method: POST or GET
 * Params: q (search query)
 * Returns: JSON
 * Authentication: Not required
 */

session_start();
require_once("../admin/includes/db_settings.php");
require_once("../helpers/response.php");
require_once("../helpers/database.php");

header('Content-Type: application/json');

// Accept both GET and POST
$query = trim($_POST['q'] ?? $_GET['q'] ?? '');

if (empty($query)) {
    jsonError('Search query is required');
}

// Search products using prepared statement
$searchTerm = '%' . $query . '%';
$products = dbFetchAll(
    $con,
    "SELECT id, namee as name, slug, price, dprice, imagee as image, catID as category_id, brID as brand_id
     FROM dow
     WHERE statuss = '1' AND namee LIKE ?
     ORDER BY namee ASC
     LIMIT 20",
    's',
    [$searchTerm]
);

// Format products
$formatted_products = [];
foreach ($products as $product) {
    $formatted_products[] = [
        'id' => (int)$product['id'],
        'name' => $product['name'],
        'slug' => $product['slug'],
        'price' => (float)$product['price'],
        'discounted_price' => (float)($product['dprice'] ?? 0),
        'image_url' => $product['image'] ? '/admin/upload/dow/' . $product['image'] : '',
        'category_id' => (int)$product['category_id'],
        'brand_id' => (int)$product['brand_id']
    ];
}

jsonSuccess([
    'products' => $formatted_products,
    'count' => count($formatted_products),
    'query' => $query
], 'Search completed');
?>
