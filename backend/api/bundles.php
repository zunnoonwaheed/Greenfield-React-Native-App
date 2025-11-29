<?php
/**
 * Get All Bundles API
 * Method: GET
 * Query Params: featured=true, active_only=true, limit, offset
 * Returns: JSON
 */

// Start output buffering to catch any unwanted output
ob_start();

// Suppress all errors and warnings from being output
error_reporting(0);
ini_set('display_errors', 0);

// Set JSON header early
header('Content-Type: application/json; charset=utf-8');

// Handle CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    ob_end_clean();
    http_response_code(200);
    exit();
}

try {
    require_once __DIR__ . "/../helpers/session_config.php";
    require_once __DIR__ . "/../admin/includes/db_settings.php";
    require_once __DIR__ . "/../helpers/database.php";

    // Get query parameters
    $featured = isset($_GET['featured']) && $_GET['featured'] === 'true';
    $activeOnly = !isset($_GET['active_only']) || $_GET['active_only'] === 'true';
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

    // Format bundles for response
    $formattedBundles = [];

    // Get base URL for images - SAME AS CATEGORIES (use LOCAL server where images are stored)
    $protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https' : 'http';
    $host = $_SERVER['HTTP_HOST'];
    $productionUrl = 'https://greenfieldsupermarket.com';  // Fallback URL

    foreach ($bundles as $row) {
        // Construct full image URL for bundle - EXACTLY LIKE CATEGORIES with FALLBACK to production
        $imageUrl = '';
        if (!empty($row['image'])) {
            // Check multiple locations for bundle images
            $localImagePath1 = __DIR__ . '/../uploads/bundles/' . $row['image'];
            $localImagePath2 = __DIR__ . '/../admin/upload/stores/' . $row['image'];
            $localImagePath3 = __DIR__ . '/../admin/upload/dow/' . $row['image'];

            // Check if image exists locally in any location, otherwise use production URL
            if (file_exists($localImagePath1)) {
                $imageUrl = $protocol . '://' . $host . '/backend/uploads/bundles/' . $row['image'];
            } elseif (file_exists($localImagePath2)) {
                $imageUrl = $protocol . '://' . $host . '/admin/upload/stores/' . $row['image'];
            } elseif (file_exists($localImagePath3)) {
                $imageUrl = $protocol . '://' . $host . '/admin/upload/dow/' . $row['image'];
            } else {
                // Use production URL as fallback (same as categories)
                $imageUrl = $productionUrl . '/uploads/bundles/' . $row['image'];
            }
        } else {
            // Fallback to production placeholder if no image specified
            $imageUrl = $productionUrl . '/uploads/bundles/1758376585_2.png';
        }

        // Fetch products for this bundle
        $bundleProducts = [];
        $productsQuery = "
            SELECT
                p.id,
                p.namee as name,
                p.price,
                p.imagee as image_url,
                bi.quantity
            FROM bundle_items bi
            INNER JOIN dow p ON bi.product_id = p.id
            WHERE bi.bundle_id = ?
        ";
        $productsResult = dbFetchAll($con, $productsQuery, 'i', [(int)$row['id']]);

        if ($productsResult) {
            foreach ($productsResult as $product) {
                // Construct product image URL
                $productImageUrl = '';
                if (!empty($product['image_url'])) {
                    $productImagePath = __DIR__ . '/../admin/upload/dow/' . $product['image_url'];
                    if (file_exists($productImagePath)) {
                        $productImageUrl = $protocol . '://' . $host . '/backend/admin/upload/dow/' . $product['image_url'];
                    } else {
                        $productImageUrl = $productionUrl . '/backend/admin/upload/dow/' . $product['image_url'];
                    }
                }

                $bundleProducts[] = [
                    'id' => (int)$product['id'],
                    'name' => $product['name'],
                    'price' => (float)$product['price'],
                    'image_url' => $productImageUrl,
                    'quantity' => (int)$product['quantity']
                ];
            }
        }

        $formattedBundles[] = [
            'id' => (int)$row['id'],
            'name' => $row['name'],
            'description' => $row['description'] ?? '',
            'original_price' => (float)($row['base_price'] ?? $row['original_price'] ?? 0),
            'discounted_price' => (float)($row['final_price'] ?? $row['discounted_price'] ?? 0),
            'discount_percentage' => (float)($row['discount'] ?? 0),
            'image_url' => $imageUrl,
            'products' => $bundleProducts,
            'products_count' => count($bundleProducts),
            'is_featured' => (int)($row['is_featured'] ?? 0),
            'status' => $row['status'],
            'created_at' => $row['created_at'] ?? null
        ];
    }

    // Close database connection
    if (isset($con)) {
        $con->close();
    }

    // Clear any output that might have been captured
    ob_end_clean();

    // Output clean JSON
    echo json_encode([
        'success' => true,
        'data' => [
            'bundles' => $formattedBundles,
            'count' => count($formattedBundles)
        ],
        'message' => 'Bundles retrieved successfully'
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

} catch (Exception $e) {
    // Clear any output
    ob_end_clean();

    // Return error as JSON
    echo json_encode([
        'success' => false,
        'error' => 'Failed to fetch bundles',
        'message' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
}

exit;
?>
