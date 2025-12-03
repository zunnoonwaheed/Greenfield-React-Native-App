<?php
/**
 * Get Product Details API
 * Supports both ID and slug
 * Method: GET
 * Params: id OR slug
 * Returns: JSON
 */
include("../admin/includes/db_settings.php");
header('Content-Type: application/json');

$id = $_GET['id'] ?? '';
$slug = $_GET['slug'] ?? '';

if (empty($id) && empty($slug)) {
    echo json_encode(['success' => false, 'message' => 'Product ID or slug is required']);
    exit;
}

// Get product details by ID or slug
if (!empty($id)) {
    $productQuery = "SELECT * FROM dow WHERE id = ? AND statuss = '1'";
    $stmt = $con->prepare($productQuery);
    $stmt->bind_param("i", $id);
} else {
    $productQuery = "SELECT * FROM dow WHERE slug = ? AND statuss = '1'";
    $stmt = $con->prepare($productQuery);
    $stmt->bind_param("s", $slug);
}

$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(['success' => false, 'message' => 'Product not found']);
    exit;
}

$product = $result->fetch_assoc();

// Get base URL for images
$protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https' : 'http';
$host = $_SERVER['HTTP_HOST'];
$productionUrl = 'https://greenfieldsupermarket.com';

// Construct product image URL
$productImageUrl = '';
if (!empty($product['imagee'])) {
    $localImagePath = __DIR__ . '/../admin/upload/dow/' . $product['imagee'];
    if (file_exists($localImagePath)) {
        $productImageUrl = $protocol . '://' . $host . '/admin/upload/dow/' . $product['imagee'];
    } else {
        $productImageUrl = $productionUrl . '/admin/upload/dow/' . $product['imagee'];
    }
}

// Calculate discount percentage
$discountPct = 0;
if ($product['price'] > 0 && $product['dprice'] > 0 && $product['dprice'] < $product['price']) {
    $discountPct = round((($product['price'] - $product['dprice']) / $product['price']) * 100);
}

// Get similar products (same category)
$similarQuery = "SELECT d.id, d.namee as name, d.slug, d.imagee as image, d.price, d.dprice,
                        COALESCE(d.discount_percentage,
                            CASE WHEN d.price > 0 AND d.dprice > 0 AND d.dprice < d.price
                                 THEN ROUND(((d.price - d.dprice) / d.price) * 100)
                                 ELSE 0 END
                        ) as discount_percentage
                 FROM dow d
                 WHERE d.catID = ? AND d.id != ? AND d.statuss = '1'
                 AND d.imagee IS NOT NULL AND d.imagee != ''
                 ORDER BY d.is_popular DESC, d.rating_count DESC
                 LIMIT 6";
$stmt = $con->prepare($similarQuery);
$stmt->bind_param("ii", $product['catID'], $product['id']);
$stmt->execute();
$similarResult = $stmt->get_result();

$similarProducts = [];
while ($row = $similarResult->fetch_assoc()) {
    // Construct image URL for similar product
    $imageUrl = '';
    if (!empty($row['image'])) {
        $localImagePath = __DIR__ . '/../admin/upload/dow/' . $row['image'];
        if (file_exists($localImagePath)) {
            $imageUrl = $protocol . '://' . $host . '/admin/upload/dow/' . $row['image'];
        } else {
            $imageUrl = $productionUrl . '/admin/upload/dow/' . $row['image'];
        }
    }

    $similarProducts[] = [
        'id' => (int)$row['id'],
        'name' => $row['name'],
        'slug' => $row['slug'],
        'image_url' => $imageUrl,
        'price' => (float)$row['price'],
        'discounted_price' => (float)$row['dprice'],
        'discount_percentage' => (int)$row['discount_percentage']
    ];
}

// Get frequently bought together (popular products from different categories)
$frequentlyBoughtQuery = "SELECT d.id, d.namee as name, d.slug, d.imagee as image, d.price, d.dprice,
                                 COALESCE(d.discount_percentage,
                                     CASE WHEN d.price > 0 AND d.dprice > 0 AND d.dprice < d.price
                                          THEN ROUND(((d.price - d.dprice) / d.price) * 100)
                                          ELSE 0 END
                                 ) as discount_percentage
                          FROM dow d
                          WHERE d.catID != ? AND d.id != ? AND d.statuss = '1'
                          AND d.imagee IS NOT NULL AND d.imagee != ''
                          AND d.is_popular = 1
                          ORDER BY d.rating_count DESC, RAND()
                          LIMIT 6";
$stmt = $con->prepare($frequentlyBoughtQuery);
$stmt->bind_param("ii", $product['catID'], $product['id']);
$stmt->execute();
$frequentlyBoughtResult = $stmt->get_result();

$frequentlyBought = [];
while ($row = $frequentlyBoughtResult->fetch_assoc()) {
    // Construct image URL
    $imageUrl = '';
    if (!empty($row['image'])) {
        $localImagePath = __DIR__ . '/../admin/upload/dow/' . $row['image'];
        if (file_exists($localImagePath)) {
            $imageUrl = $protocol . '://' . $host . '/admin/upload/dow/' . $row['image'];
        } else {
            $imageUrl = $productionUrl . '/admin/upload/dow/' . $row['image'];
        }
    }

    $frequentlyBought[] = [
        'id' => (int)$row['id'],
        'name' => $row['name'],
        'slug' => $row['slug'],
        'image_url' => $imageUrl,
        'price' => (float)$row['price'],
        'discounted_price' => (float)$row['dprice'],
        'discount_percentage' => (int)$row['discount_percentage']
    ];
}

// Get other recommendations (recently added popular products)
$recommendedQuery = "SELECT d.id, d.namee as name, d.slug, d.imagee as image, d.price, d.dprice,
                            COALESCE(d.discount_percentage,
                                CASE WHEN d.price > 0 AND d.dprice > 0 AND d.dprice < d.price
                                     THEN ROUND(((d.price - d.dprice) / d.price) * 100)
                                     ELSE 0 END
                            ) as discount_percentage
                     FROM dow d
                     WHERE d.id != ? AND d.statuss = '1'
                     AND d.imagee IS NOT NULL AND d.imagee != ''
                     ORDER BY d.id DESC, d.is_popular DESC
                     LIMIT 6";
$stmt = $con->prepare($recommendedQuery);
$stmt->bind_param("i", $product['id']);
$stmt->execute();
$recommendedResult = $stmt->get_result();

$recommended = [];
while ($row = $recommendedResult->fetch_assoc()) {
    // Construct image URL
    $imageUrl = '';
    if (!empty($row['image'])) {
        $localImagePath = __DIR__ . '/../admin/upload/dow/' . $row['image'];
        if (file_exists($localImagePath)) {
            $imageUrl = $protocol . '://' . $host . '/admin/upload/dow/' . $row['image'];
        } else {
            $imageUrl = $productionUrl . '/admin/upload/dow/' . $row['image'];
        }
    }

    $recommended[] = [
        'id' => (int)$row['id'],
        'name' => $row['name'],
        'slug' => $row['slug'],
        'image_url' => $imageUrl,
        'price' => (float)$row['price'],
        'discounted_price' => (float)$row['dprice'],
        'discount_percentage' => (int)$row['discount_percentage']
    ];
}

echo json_encode([
    'success' => true,
    'data' => [
        'product' => [
            'id' => (int)$product['id'],
            'name' => $product['namee'],
            'slug' => $product['slug'],
            'image_url' => $productImageUrl,
            'price' => (float)$product['price'],
            'discounted_price' => (float)$product['dprice'],
            'discount_percentage' => $discountPct,
            'description' => $product['desc1'] ?? '',
            'category_id' => (int)$product['catID'],
            'brand_id' => (int)($product['brID'] ?? 0),
            'rating' => (float)($product['rating'] ?? 4.0),
            'rating_count' => (int)($product['rating_count'] ?? 0),
            'brand_name' => $product['brID'] ? '' : 'Greenfield' // Will be populated if you join with brands table
        ],
        'similar_products' => $similarProducts,
        'frequently_bought_together' => $frequentlyBought,
        'recommended_for_you' => $recommended
    ]
]);
?>
