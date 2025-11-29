<?php
header('Content-Type: application/json');
include("admin/includes/db_settings.php");

$q = $_POST['q'] ?? '';
$q = mysqli_real_escape_string($con, $q);

// Get base URL for images
$protocol = isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? 'https' : 'http';
$host = $_SERVER['HTTP_HOST'];
$productionUrl = 'https://greenfieldsupermarket.com';

$sql = "SELECT id, namee, slug, imagee, price, dprice,
               COALESCE(discount_percentage,
                   CASE WHEN price > 0 AND dprice > 0 AND dprice < price
                        THEN ROUND(((price - dprice) / price) * 100)
                        ELSE 0 END
               ) as discount_percentage
        FROM dow
        WHERE statuss = '1' AND (namee LIKE '%$q%' OR desc1 LIKE '%$q%')
        AND imagee IS NOT NULL AND imagee != ''
        LIMIT 20";
$res = mysqli_query($con, $sql);

$products = [];
if (mysqli_num_rows($res) > 0) {
    while ($row = mysqli_fetch_assoc($res)) {
        // Construct full image URL
        $imageUrl = '';
        if (!empty($row['imagee'])) {
            $localImagePath = __DIR__ . '/admin/upload/dow/' . $row['imagee'];
            if (file_exists($localImagePath)) {
                $imageUrl = $protocol . '://' . $host . '/admin/upload/dow/' . $row['imagee'];
            } else {
                $imageUrl = $productionUrl . '/admin/upload/dow/' . $row['imagee'];
            }
        }

        $products[] = [
            'id' => (int)$row['id'],
            'name' => $row['namee'],
            'slug' => $row['slug'],
            'price' => (float)$row['price'],
            'discounted_price' => (float)$row['dprice'],
            'discount_percentage' => (int)$row['discount_percentage'],
            'image_url' => $imageUrl
        ];
    }
}

echo json_encode([
    'success' => true,
    'data' => [
        'products' => $products,
        'count' => count($products),
        'query' => $q
    ]
]);
?>
